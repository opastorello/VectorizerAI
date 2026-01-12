import { FileCode, FileText, FileImage } from 'lucide-react';
import type { OutputFormat } from '../types';

interface FormatSelectorProps {
  format: OutputFormat;
  onChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

const formats: { value: OutputFormat; label: string; description: string }[] = [
  { value: 'svg', label: 'SVG', description: 'Vetorial escalavel' },
  { value: 'eps', label: 'EPS', description: 'PostScript' },
  { value: 'pdf', label: 'PDF', description: 'Documento' },
  { value: 'dxf', label: 'DXF', description: 'AutoCAD' },
  { value: 'png', label: 'PNG', description: 'Bitmap' },
];

export function FormatSelector({ format, onChange, disabled }: FormatSelectorProps) {
  const getIcon = (f: OutputFormat) => {
    switch (f) {
      case 'svg':
      case 'eps':
      case 'dxf':
        return FileCode;
      case 'pdf':
        return FileText;
      case 'png':
        return FileImage;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Formato de Saida</h3>

      <div className="flex flex-wrap gap-2">
        {formats.map((f) => {
          const Icon = getIcon(f.value);
          const isSelected = format === f.value;

          return (
            <button
              key={f.value}
              onClick={() => onChange(f.value)}
              disabled={disabled}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-semibold text-sm">{f.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {formats.find(f => f.value === format)?.description}
      </p>
    </div>
  );
}
