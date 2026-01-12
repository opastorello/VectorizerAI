import { Sparkles, FlaskConical, Eye, Beaker } from 'lucide-react';
import type { ProcessingMode } from '../types';

interface ModeSelectorProps {
  mode: ProcessingMode;
  onChange: (mode: ProcessingMode) => void;
  disabled?: boolean;
}

const modes: { value: ProcessingMode; icon: typeof Sparkles; label: string; description: string; cost: string; color: string }[] = [
  {
    value: 'production',
    icon: Sparkles,
    label: 'Production',
    description: 'Qualidade maxima',
    cost: '1.0 credito',
    color: 'emerald',
  },
  {
    value: 'preview',
    icon: Eye,
    label: 'Preview',
    description: 'Previa com marca dagua',
    cost: '0.2 credito',
    color: 'blue',
  },
  {
    value: 'test',
    icon: FlaskConical,
    label: 'Test',
    description: 'Teste gratuito',
    cost: 'Gratuito',
    color: 'amber',
  },
  {
    value: 'test_preview',
    icon: Beaker,
    label: 'Test Preview',
    description: 'Previa de teste',
    cost: 'Gratuito',
    color: 'orange',
  },
];

const colorClasses = {
  emerald: {
    selected: 'border-emerald-500 bg-emerald-50',
    icon: 'bg-emerald-500',
    iconDefault: 'bg-slate-200',
    text: 'text-emerald-800',
    subtext: 'text-emerald-600',
    dot: 'bg-emerald-500',
  },
  blue: {
    selected: 'border-blue-500 bg-blue-50',
    icon: 'bg-blue-500',
    iconDefault: 'bg-slate-200',
    text: 'text-blue-800',
    subtext: 'text-blue-600',
    dot: 'bg-blue-500',
  },
  amber: {
    selected: 'border-amber-500 bg-amber-50',
    icon: 'bg-amber-500',
    iconDefault: 'bg-slate-200',
    text: 'text-amber-800',
    subtext: 'text-amber-600',
    dot: 'bg-amber-500',
  },
  orange: {
    selected: 'border-orange-500 bg-orange-50',
    icon: 'bg-orange-500',
    iconDefault: 'bg-slate-200',
    text: 'text-orange-800',
    subtext: 'text-orange-600',
    dot: 'bg-orange-500',
  },
};

export function ModeSelector({ mode, onChange, disabled }: ModeSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Modo de Processamento</h3>

      <div className="grid grid-cols-2 gap-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const isSelected = mode === m.value;
          const colors = colorClasses[m.color as keyof typeof colorClasses];

          return (
            <button
              key={m.value}
              onClick={() => onChange(m.value)}
              disabled={disabled}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? colors.selected
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                isSelected ? colors.icon : colors.iconDefault
              }`}>
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <p className={`font-bold text-sm ${isSelected ? colors.text : 'text-slate-700'}`}>
                {m.label}
              </p>
              <p className={`text-xs mt-1 ${isSelected ? colors.subtext : 'text-slate-500'}`}>
                {m.description}
              </p>
              <p className={`text-[10px] mt-2 font-semibold uppercase tracking-wide ${isSelected ? colors.subtext : 'text-slate-400'}`}>
                {m.cost}
              </p>
              {isSelected && (
                <div className={`absolute top-3 right-3 w-3 h-3 ${colors.dot} rounded-full`}></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
