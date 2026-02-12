import React, { useEffect, useState } from 'react';
import { User, ReviewRecord } from '../types';
import { getHistory, clearHistory } from '../services/storage';
import { CodeIcon } from './Icons';
import { ReviewResultView } from './ReviewResultView';

interface HistoryProps {
  user: User;
}

const History: React.FC<HistoryProps> = ({ user }) => {
  const [history, setHistory] = useState<ReviewRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory(user.username));
  }, [user.username]);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your entire review history?")) {
      clearHistory(user.username);
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-dark-surface rounded-full mb-4">
          <CodeIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No History Yet</h2>
        <p className="text-slate-500 dark:text-slate-400">Your past code reviews will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Review History</h2>
        <button 
          onClick={handleClear}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-6">
        {history.map((record) => (
          <div key={record.id} className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden shadow-sm">
            <div 
              className="px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex justify-between items-center"
              onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white">{record.language}</span>
                  <span className="text-xs px-2 py-1 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 rounded-md">
                    {record.reviewType}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(record.timestamp).toLocaleString()} • {record.explanationLevel} Explanation
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 text-slate-400 transform transition-transform ${expandedId === record.id ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            
            {expandedId === record.id && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-[#0f172a]">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Original Code:</h4>
                <pre className="p-4 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-dark-border rounded-lg overflow-x-auto text-sm font-mono text-slate-800 dark:text-slate-200 mb-8">
                  <code>{record.code}</code>
                </pre>
                
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Analysis & Results:</h4>
                <div className="bg-white dark:bg-dark-surface p-1 rounded-lg">
                  <ReviewResultView content={record.result} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;