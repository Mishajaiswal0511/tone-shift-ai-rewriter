import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function QualityAnalysis({ analysis }) {
  if (!analysis) return null;

  const {
    meaning_preserved = false,
    similarity_score = 0,
    drift_level = 'Low',
    summary = '',
    changed_information = [],
    what_changed = []
  } = analysis;

  // Determine styles based on meaning preservation
  const preservationStatus = meaning_preserved ? 'Yes' : 'No';
  const preservationColor = meaning_preserved 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800'
    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800';
  
  // Determine styles for drift level
  const getDriftBadgeColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800';
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/20 dark:text-slate-400 dark:border-slate-800';
    }
  };

  // Determine color for the similarity score meter
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  // Determine background track color for radial progress bar
  const strokeDashoffset = 251.2 - (251.2 * similarity_score) / 100;

  return (
    <div className="space-y-6">
      {/* Upper Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Radial Progress Score Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Similarity Score
          </span>
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Radial Meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="40"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="40"
                className={`transition-all duration-500 ${getScoreColor(similarity_score)}`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                {similarity_score}%
              </span>
            </div>
          </div>
        </div>

        {/* Badges and Summary Information */}
        <div className="md:col-span-2 flex flex-col justify-between p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Meaning Preserved Card */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Meaning Preserved
              </span>
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border w-fit font-medium text-sm ${preservationColor}`}>
                {meaning_preserved ? (
                  <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 mr-1.5 shrink-0" />
                )}
                {preservationStatus}
              </div>
            </div>

            {/* Drift Level Card */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Meaning Drift Level
              </span>
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border w-fit font-medium text-sm ${getDriftBadgeColor(drift_level)}`}>
                <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                {drift_level} Drift
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              AI Summary
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {summary || "No summary provided by the evaluation model."}
            </p>
          </div>
        </div>
      </div>

      {/* "What Changed?" Bullets Section */}
      <div className="p-6 bg-blue-50/20 dark:bg-blue-950/5 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            What Changed?
          </h3>
        </div>
        
        {what_changed && what_changed.length > 0 ? (
          <ul className="space-y-3">
            {what_changed.map((bullet, idx) => (
              <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mr-3 mt-0.5 shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">
            No style modification details available.
          </p>
        )}
      </div>

      {/* Changed/Lost Information warning (if any) */}
      {!meaning_preserved && changed_information && changed_information.length > 0 && (
        <div className="p-4 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-400 mb-2">
            <Info className="w-4 h-4 shrink-0" />
            <h4 className="text-sm font-semibold">Semantic Discrepancy Warnings</h4>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {changed_information.map((info, idx) => (
              <li key={idx} className="text-xs text-rose-700 dark:text-rose-300 leading-normal">
                {info}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
