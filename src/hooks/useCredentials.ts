import { useState, useEffect } from 'react';
import type { Credentials } from '../types';

export function useCredentials() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const envApiId = import.meta.env.VECTORIZER_API_ID;
    const envApiSecret = import.meta.env.VECTORIZER_API_SECRET;

    if (envApiId && envApiSecret) {
      setCredentials({ apiId: envApiId, apiSecret: envApiSecret });
      setIsConfigured(true);
    }
  }, []);

  return {
    credentials,
    isConfigured,
  };
}
