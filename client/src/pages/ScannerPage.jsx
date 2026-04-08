import React from 'react';
import CodeEditor from '../components/CodeEditor';
import ScanResults from '../components/ScanResults';
import InfoPanel from '../components/InfoPanel';
import ErrorAlert from '../components/ErrorAlert';
import ScanHistory from '../components/ScanHistory';
import useScanner from '../hooks/useScanner';

const ScannerPage = () => {
  const {
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
  } = useScanner();

  return (
    <main className="main">
      <CodeEditor
        code={code}
        onChange={setCode}
        language={language}
        onLanguageChange={setLanguage}
        onScan={handleScan}
        onClear={handleClear}
        loading={loading}
      />

      <ErrorAlert message={error} />

      {scanned && results && <ScanResults results={results} />}

      {history.length > 0 && (
        <ScanHistory history={history} onRestore={handleRestore} />
      )}

      {!scanned && <InfoPanel />}
    </main>
  );
};

export default ScannerPage;