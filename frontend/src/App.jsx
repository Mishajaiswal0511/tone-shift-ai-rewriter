import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Moon, 
  Sun, 
  Clock, 
  FileText, 
  AlertCircle,
  Clock3,
  Scale
} from 'lucide-react';

import ToneSelector from './components/ToneSelector';
import OutputCard from './components/OutputCard';
import QualityAnalysis from './components/QualityAnalysis';
import ComparisonView from './components/ComparisonView';
import { rewriteText } from './services/api';
import { countWords, calculateReadingTime, formatReadingTime } from './utils/text';

export default function App() {
  // Application State
  const [inputText, setInputText] = useState('');
  const [selectedTone, setSelectedTone] = useState('Formal');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Read local storage or fallback to system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Toasts Notification State
  const [toasts, setToasts] = useState([]);

  // Sync Dark/Light mode theme class
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Toast Helper
  const triggerToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Text Stats
  const charCount = inputText.length;
  const wordCount = countWords(inputText);
  const readingTimeSec = calculateReadingTime(inputText);
  const formattedReadingTime = formatReadingTime(readingTimeSec);
  const maxChars = 5000;
  const isNearLimit = charCount > maxChars - 300;

  // Actions
  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
    triggerToast('Cleared all inputs');
  };

  const handleRewrite = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please enter some text to rewrite.');
      triggerToast('Input text is empty');
      return;
    }
    if (inputText.length > maxChars) {
      setError(`Character count exceeds the maximum limit of ${maxChars} characters.`);
      triggerToast('Input exceeds limits');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await rewriteText(inputText, selectedTone);
      setResult(response);
      triggerToast('Text rewritten successfully!');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      triggerToast('Error generating rewrite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                ToneShift
              </span>
              <span className="text-[10px] block font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest -mt-1">
                Audience-Aware
              </span>
            </div>
          </div>

          {/* Theme Toggle & Viva Info */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900">
              Gemini 2.5 Flash App
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200 cursor-pointer shadow-sm"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Hero Banner Section */}
        <section className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            ToneShift
          </h1>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-blue-600 dark:text-blue-400">
            Audience-Aware AI Rewriter
          </p>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-normal">
            Rewrite your text into different tones while preserving its original meaning. Backed by automated back-translation validation.
          </p>
        </section>

        {/* Input Form & Tone Selector */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          <form onSubmit={handleRewrite} className="space-y-6">
            
            {/* Input TextBox Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="user-input-text" className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 uppercase">
                  Original Text
                </label>
                
                {/* Word / Char Stats */}
                <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {formattedReadingTime} read
                  </span>
                </div>
              </div>

              <div className="relative">
                <textarea
                  id="user-input-text"
                  placeholder="Paste or type your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  maxLength={maxChars}
                  rows={6}
                  disabled={loading}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/30 outline-none transition-all duration-200 text-sm sm:text-base resize-y font-normal"
                />
                
                {/* Character Counter Ring */}
                <div className={`absolute bottom-3 right-3 text-xs font-semibold ${
                  isNearLimit ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {charCount} / {maxChars}
                </div>
              </div>
            </div>

            {/* Tone Selector Cards */}
            <ToneSelector 
              selectedTone={selectedTone} 
              onSelectTone={setSelectedTone} 
            />

            {/* Action Buttons & Loading */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Rewrite Text</span>
              </button>
              
              <button
                type="button"
                onClick={handleClear}
                disabled={loading || !inputText}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </form>
        </section>

        {/* Loading Spinner */}
        {loading && (
          <section className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-500 animate-spin" />
              <Scale className="w-5 h-5 text-blue-600 dark:text-blue-500 absolute animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Generating rewrite...</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">FastAPI & Gemini 2.5 Flash are processing your request</p>
            </div>
          </section>
        )}

        {/* Error Display */}
        {error && (
          <section className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl flex items-start space-x-3 text-rose-800 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Processing Failed</h4>
              <p className="text-xs mt-1 leading-relaxed">{error}</p>
            </div>
          </section>
        )}

        {/* Results Layout Panel */}
        {result && !loading && (
          <section className="space-y-8 animate-fadeIn">
            
            {/* API Execution Time badge */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 py-1.5 px-3 rounded-lg w-fit">
              <Clock3 className="w-3.5 h-3.5 text-blue-500" />
              <span>API Execution Time: <strong>{result.execution_time_ms} ms</strong></span>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OutputCard 
                title="Original Text" 
                text={result.original} 
                onCopyToast={triggerToast} 
              />
              <OutputCard 
                title={`Rewritten Text (${selectedTone})`} 
                text={result.rewrite} 
                onCopyToast={triggerToast} 
              />
              <OutputCard 
                title="Back Translation (Simple neutral English)" 
                text={result.back_translation} 
                onCopyToast={triggerToast} 
              />
              
              {/* Quality Analysis Card Wrapper */}
              <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm md:col-span-2">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                    Meaning Preservation & Quality Analysis
                  </h3>
                </div>
                <QualityAnalysis analysis={result.analysis} />
              </div>
            </div>

            {/* Side-by-Side Word Diff View */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <ComparisonView 
                originalText={result.original} 
                rewrittenText={result.rewrite} 
              />
            </div>
          </section>
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto py-8 text-center text-xs text-slate-400 dark:text-slate-600 transition-colors duration-300">
        <p>© 2026 ToneShift – Academic AI Engineering Project. Powered by Gemini 2.5 Flash & Python FastAPI.</p>
      </footer>

      {/* Stacked Toasts */}
      <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 dark:border-slate-200 text-xs font-semibold flex items-center space-x-2 animate-slideIn pointer-events-auto"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
