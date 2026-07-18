import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import api from '../../../utils/axios';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const GoogleLoginButton = ({ actionText = "signin_with" }: { actionText?: 'signin_with' | 'signup_with' | 'continue_with' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      setUser(response.data.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.error('Google login failed');
  };

  return (
    <div className={`w-full flex justify-center ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        text={actionText}
        theme="outline"
        size="large"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
};
