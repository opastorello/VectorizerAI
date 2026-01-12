import { useState, useEffect, useCallback } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ModeSelector } from './components/ModeSelector';
import { FormatSelector } from './components/FormatSelector';
import { ResultPanel } from './components/ResultPanel';
import { LoginPage } from './components/LoginPage';
import { useCredentials } from './hooks/useCredentials';
import { useAuth } from './hooks/useAuth';
import { getAccountStatus, vectorizeImage } from './lib/vectorizer';
import type { AccountStatus, VectorizeResult, ProcessingMode, OutputFormat } from './types';

function App() {
  const { credentials, isConfigured } = useCredentials();
  const { isAuthRequired, isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [mode, setMode] = useState<ProcessingMode>('test');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('svg');
  const [result, setResult] = useState<VectorizeResult | null>(null);
  const [isVectorizing, setIsVectorizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAccountStatus = useCallback(async () => {
    if (!credentials) return;

    setStatusLoading(true);
    const status = await getAccountStatus(credentials);
    setAccountStatus(status);
    setStatusLoading(false);
  }, [credentials]);

  useEffect(() => {
    if (isConfigured && credentials) {
      loadAccountStatus();
    }
  }, [isConfigured, credentials, loadAccountStatus]);

  const handleVectorize = async () => {
    if (!credentials || !selectedImage) return;

    setError(null);
    setResult(null);
    setIsVectorizing(true);

    try {
      const vectorizeResult = await vectorizeImage(credentials, selectedImage, {
        mode,
        outputFormat,
      });

      setResult(vectorizeResult);

      if (mode === 'production' || mode === 'preview') {
        loadAccountStatus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao vetorizar imagem');
    } finally {
      setIsVectorizing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthRequired && !isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Vectorizer</h1>
          <p className="text-slate-600 mb-6">Credenciais nao configuradas</p>

          <div className="text-left space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800 font-medium mb-2">Configure as variaveis de ambiente:</p>
              <code className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded block mb-1">VECTORIZER_API_ID</code>
              <code className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded block">VECTORIZER_API_SECRET</code>
            </div>
          </div>

          <a
            href="https://vectorizer.ai/api"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Obter credenciais no Vectorizer.AI
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <Header
        accountStatus={accountStatus}
        isLoading={statusLoading}
        showLogout={!!isAuthRequired}
        onLogout={logout}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">Erro</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <ImageUploader
              onImageSelect={setSelectedImage}
              disabled={isVectorizing}
            />

            <ModeSelector
              mode={mode}
              onChange={setMode}
              disabled={isVectorizing}
            />

            <FormatSelector
              format={outputFormat}
              onChange={setOutputFormat}
              disabled={isVectorizing}
            />

            <div className="flex gap-3">
              <button
                onClick={handleVectorize}
                disabled={!selectedImage || isVectorizing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 text-sm"
              >
                <Zap className="w-5 h-5" />
                Vetorizar
              </button>

              {(selectedImage || result) && (
                <button
                  onClick={handleReset}
                  disabled={isVectorizing}
                  className="px-5 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <ResultPanel result={result} isLoading={isVectorizing} mode={mode} />
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 border-t border-slate-200/60 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">
            Powered by <a href="https://vectorizer.ai" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-700 hover:text-blue-600 transition-colors">Vectorizer.AI</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
