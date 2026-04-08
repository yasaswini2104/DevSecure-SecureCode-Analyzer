import { useState, useCallback } from 'react';
import { scanCode } from '../services/scanService';

const MAX_HISTORY = 5;

const useScanner = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanned, setScanned] = useState(false);
  const [history, setHistory] = useState([]);

  const handleError = (err) => {
    if (err.response) {
      const status = err.response.status;
      if (status === 429) {
        setError('Too many requests. Please wait a few seconds and try again.');
        return;
      }
      if (status === 401) {
        setError('Invalid API key. Please check backend configuration.');
        return;
      }
      const msg = err.response.data?.message || err.response.statusText;
      setError(`Error ${status}: ${msg}`);
    } else if (err.request) {
      setError('Cannot connect to backend. Make sure Spring Boot is running on port 8080.');
    } else {
      setError(`Unexpected error: ${err.message}`);
    }
  };

  const handleScan = useCallback(async () => {
    if (loading) return;
    if (!code.trim()) {
      setError('Please paste some code to scan.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    setScanned(false);

    try {
      const data = await scanCode(code, language);
      setResults(data);
      setScanned(true);
      setHistory(prev => [
        { ...data, timestamp: new Date().toLocaleTimeString(), type: language },
        ...prev,
      ].slice(0, MAX_HISTORY));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [code, language, loading]);

  const handleClear = useCallback(() => {
    setCode('');
    setResults(null);
    setError('');
    setScanned(false);
  }, []);

  const handleRestore = useCallback((item) => {
    setResults(item);
    setScanned(true);
    setError('');
  }, []);

  return {
    code, setCode,
    language, setLanguage,
    results,
    loading,
    error,
    scanned,
    history,
    handleScan,
    handleClear,
    handleRestore,
  };
};

export default useScanner;