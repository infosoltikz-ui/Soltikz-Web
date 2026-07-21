import React, { useRef, useEffect } from 'react';
import { useAIStore, AIMessageType } from '../store/useAIStore';
import { PromptInput } from './PromptInput';
import { AIToolbar } from './AIToolbar';
import { AIUserMessage } from './AIUserMessage';
import { AIAssistantMessage } from './AIAssistantMessage';
import { StreamingMessage } from './StreamingMessage';
import { Bot } from 'lucide-react';
import { useParams } from 'react-router-dom';

export const AIChatWindow: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { messages, streamingMessage, isGenerating, setIsGenerating, addMessage, setStreamingMessage, clearStreamingMessage, currentConversationId } = useAIStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const handleSend = async (text: string) => {
    const userMessage: AIMessageType = {
      id: Date.now().toString(),
      role: 'USER',
      content: text,
      createdAt: new Date(),
    };
    addMessage(userMessage);
    
    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          promptType: 'GENERAL_CHAT',
          variables: { input: text },
          resumeId,
          conversationId: currentConversationId
        }),
        signal: abortControllerRef.current?.signal
      });

      if (!response.body) throw new Error('No streaming response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'chunk') {
                  setStreamingMessage((prev) => prev + data.content);
                } else if (data.type === 'done') {
                  const assistantMessage: AIMessageType = {
                    id: Date.now().toString(),
                    role: 'ASSISTANT',
                    content: data.response.response,
                    createdAt: new Date(),
                    tokens: data.response.tokens.total,
                    cost: data.response.cost,
                    model: data.response.model,
                    provider: data.response.provider
                  };
                  addMessage(assistantMessage);
                  clearStreamingMessage();
                } else if (data.type === 'error') {
                  console.error('Stream error:', data.error);
                  clearStreamingMessage();
                }
              } catch (e) {
                console.error('Error parsing SSE line:', e, line);
              }
            }
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Generation aborted');
        const partialMessage: AIMessageType = {
           id: Date.now().toString(),
           role: 'ASSISTANT',
           content: useAIStore.getState().streamingMessage + '\n\n*(Generation aborted)*',
           createdAt: new Date()
        };
        addMessage(partialMessage);
        clearStreamingMessage();
      } else {
        console.error('Streaming request failed:', error);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <AIToolbar />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
              <Bot className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm">How can I help you with your resume today?</p>
          </div>
        ) : (
          messages.map((msg) => (
            msg.role === 'USER' ? (
              <AIUserMessage key={msg.id} content={msg.content} />
            ) : (
              <AIAssistantMessage key={msg.id} message={msg} />
            )
          ))
        )}
        
        {isGenerating && streamingMessage && (
          <StreamingMessage content={streamingMessage} />
        )}
        {isGenerating && !streamingMessage && (
          <div className="flex items-center gap-2 text-slate-400 text-sm italic pl-2">
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            Thinking...
          </div>
        )}
      </div>

      <PromptInput onSend={handleSend} onCancel={handleCancel} isGenerating={isGenerating} />
    </div>
  );
};
