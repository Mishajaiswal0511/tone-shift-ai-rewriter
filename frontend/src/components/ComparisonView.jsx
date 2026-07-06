import React, { useMemo } from 'react';
import { diffWords } from 'diff';
import { Eye, ArrowRight } from 'lucide-react';

export default function ComparisonView({ originalText, rewrittenText }) {
  // Compute word differences using the 'diff' library
  const diffs = useMemo(() => {
    if (!originalText || !rewrittenText) return [];
    return diffWords(originalText, rewrittenText);
  }, [originalText, rewrittenText]);

  // Render the original side: show unchanged and removed words, skip added words
  const renderOriginal = useMemo(() => {
    return diffs.map((part, index) => {
      if (part.added) {
        return null; // Don't show newly added words on original side
      }
      if (part.removed) {
        return (
          <span 
            key={index} 
            className="bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 line-through rounded px-0.5 font-medium border-b border-rose-200 dark:border-rose-900"
          >
            {part.value}
          </span>
        );
      }
      return <span key={index} className="text-slate-700 dark:text-slate-300">{part.value}</span>;
    });
  }, [diffs]);

  // Render the rewritten side: show unchanged and added words, skip removed words
  const renderRewritten = useMemo(() => {
    return diffs.map((part, index) => {
      if (part.removed) {
        return null; // Don't show deleted words on rewritten side
      }
      if (part.added) {
        return (
          <span 
            key={index} 
            className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded px-0.5 font-medium border-b border-emerald-200 dark:border-emerald-900"
          >
            {part.value}
          </span>
        );
      }
      return <span key={index} className="text-slate-700 dark:text-slate-300">{part.value}</span>;
    });
  }, [diffs]);

  if (!originalText || !rewrittenText) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <Eye className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Side-by-Side Comparison
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
          (Word-by-word highlights showing updates)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Original Text with Removals */}
        <div className="flex flex-col bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Original Text (Showing Removals)
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900">
              Removed Words Red
            </span>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap min-h-[120px] max-h-[400px] overflow-y-auto pr-2">
            {renderOriginal}
          </div>
        </div>

        {/* Right Column - Rewritten Text with Additions */}
        <div className="flex flex-col bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rewritten Text (Showing Additions)
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
              Added Words Green
            </span>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap min-h-[120px] max-h-[400px] overflow-y-auto pr-2">
            {renderRewritten}
          </div>
        </div>
      </div>
    </div>
  );
}
