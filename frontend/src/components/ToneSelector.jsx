import React from 'react';
import { 
  Sparkles, 
  Coffee, 
  Briefcase, 
  Heart, 
  Smile, 
  GraduationCap 
} from 'lucide-react';

const TONES = [
  {
    id: 'Formal',
    name: 'Formal',
    description: 'Sophisticated, polite, and grammatically precise.',
    icon: Sparkles,
    color: 'border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 dark:text-blue-400',
    hoverColor: 'hover:border-blue-300 dark:hover:border-blue-700'
  },
  {
    id: 'Casual',
    name: 'Casual',
    description: 'Relaxed, conversational, and everyday language.',
    icon: Coffee,
    color: 'border-amber-500 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400',
    hoverColor: 'hover:border-amber-300 dark:hover:border-amber-700'
  },
  {
    id: 'Professional',
    name: 'Professional',
    description: 'Clear, respectful, objective, and business-focused.',
    icon: Briefcase,
    color: 'border-indigo-500 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400',
    hoverColor: 'hover:border-indigo-300 dark:hover:border-indigo-700'
  },
  {
    id: 'Friendly',
    name: 'Friendly',
    description: 'Warm, engaging, supportive, and empathetic.',
    icon: Heart,
    color: 'border-rose-500 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400',
    hoverColor: 'hover:border-rose-300 dark:hover:border-rose-700'
  },
  {
    id: 'Child-Friendly',
    name: 'Child-Friendly',
    description: 'Simple vocabulary, highly clear, and enthusiastic.',
    icon: Smile,
    color: 'border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400',
    hoverColor: 'hover:border-emerald-300 dark:hover:border-emerald-700'
  },
  {
    id: 'Academic',
    name: 'Academic',
    description: 'Scholarly, analytical, objective, and detailed.',
    icon: GraduationCap,
    color: 'border-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-950/20 dark:text-purple-400',
    hoverColor: 'hover:border-purple-300 dark:hover:border-purple-700'
  }
];

export default function ToneSelector({ selectedTone, onSelectTone }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 uppercase">
          Select Rewrite Tone
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Choose one target tone
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TONES.map((tone) => {
          const Icon = tone.icon;
          const isSelected = selectedTone === tone.id;
          
          return (
            <button
              key={tone.id}
              type="button"
              onClick={() => onSelectTone(tone.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? `${tone.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 border-transparent shadow-md`
                  : `border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 ${tone.hoverColor} hover:shadow-sm`
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isSelected 
                    ? 'bg-white/80 dark:bg-slate-800/80 shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-tight">{tone.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {tone.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
