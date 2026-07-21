import React from 'react';

export const AIUserMessage: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[85%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm shadow-sm whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </div>
  );
};
