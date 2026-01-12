import { Download, CheckCircle, Copy, Check, Coins } from 'lucide-react';
import { useState } from 'react';
import type { VectorizeResult, ProcessingMode } from '../types';

interface ResultPanelProps {
  result: VectorizeResult | null;
  isLoading: boolean;
  mode: ProcessingMode;
}

export function ResultPanel({ result, isLoading, mode }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result?.content) {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (result?.content) {
      const mimeTypes: Record<string, string> = {
        svg: 'image/svg+xml',
        eps: 'application/postscript',
        pdf: 'application/pdf',
        dxf: 'application/dxf',
        png: 'image/png',
      };

      const blob = new Blob([result.content], { type: mimeTypes[result.format] || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vectorized.${result.format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const isTestMode = mode === 'test' || mode === 'test_preview';
  const showCreditsCalculated = isTestMode && result && result.creditsCalculated > 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-lg font-semibold text-slate-700">Vetorizando...</p>
        <p className="text-sm text-slate-500 mt-1">Isso pode levar alguns segundos</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-200/60 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-700 mb-1">Aguardando imagem</p>
        <p className="text-sm text-slate-500 text-center max-w-xs">
          Selecione uma imagem e clique em vetorizar para ver o resultado
        </p>
      </div>
    );
  }

  const canPreview = result.format === 'svg';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">Vetorizacao concluida</span>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">
          {result.format.toUpperCase()}
        </span>
      </div>

      {showCreditsCalculated && (
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Coins className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Modo de teste</p>
              <p className="text-xs text-amber-700">
                Custo em producao: <strong>{result.creditsCalculated.toFixed(3)} creditos</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        {canPreview ? (
          <div className="bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f1f5f9%22%2F%3E%3C%2Fsvg%3E')] rounded-xl p-4 border border-slate-200 min-h-[280px] flex items-center justify-center">
            <div
              dangerouslySetInnerHTML={{ __html: result.content }}
              className="max-w-full max-h-[260px] [&>svg]:max-w-full [&>svg]:max-h-[260px] [&>svg]:w-auto [&>svg]:h-auto"
            />
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 min-h-[280px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-slate-500">{result.format.toUpperCase()}</span>
            </div>
            <p className="text-slate-600 font-medium">Arquivo gerado com sucesso</p>
            <p className="text-sm text-slate-500 mt-1">Clique em baixar para obter o arquivo</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 flex gap-3">
        {canPreview && (
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        )}
        <button
          onClick={handleDownload}
          className={`${canPreview ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/25`}
        >
          <Download className="w-4 h-4" />
          Baixar {result.format.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
