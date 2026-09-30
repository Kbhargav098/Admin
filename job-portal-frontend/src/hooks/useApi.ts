import { useState } from 'react';

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (apiCall: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall();
      return data;
    } catch (err: any) {
      setError(err.message || 'API request failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
}
