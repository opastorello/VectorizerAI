import { Zap, LogOut } from 'lucide-react';
import type { AccountStatus } from '../types';

interface HeaderProps {
  accountStatus: AccountStatus | null;
  isLoading: boolean;
  showLogout?: boolean;
  onLogout?: () => void;
}

export function Header({ accountStatus, isLoading, showLogout, onLogout }: HeaderProps) {
  const getStatusColor = (state: string) => {
    switch (state) {
      case 'active': return 'text-emerald-600';
      case 'past_due': return 'text-amber-600';
      default: return 'text-red-500';
    }
  };

  const getStatusLabel = (state: string) => {
    switch (state) {
      case 'active': return 'Ativo';
      case 'past_due': return 'Pendente';
      default: return 'Inativo';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vectorizer</h1>
              <p className="text-xs text-slate-500 font-medium">Converta imagens em SVG</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <span className="text-sm text-slate-600">Carregando...</span>
              </div>
            ) : accountStatus ? (
              <div className="flex items-center gap-6 px-5 py-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Plano</span>
                  <span className="text-sm font-semibold text-slate-800 capitalize">{accountStatus.subscriptionPlan}</span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Status</span>
                  <span className={`text-sm font-semibold ${getStatusColor(accountStatus.subscriptionState)}`}>
                    {getStatusLabel(accountStatus.subscriptionState)}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Creditos</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {accountStatus.credits === 0 && accountStatus.subscriptionPlan !== 'none'
                      ? 'Ilimitado'
                      : accountStatus.credits.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ) : null}

            {showLogout && onLogout && (
              <button
                onClick={onLogout}
                className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
