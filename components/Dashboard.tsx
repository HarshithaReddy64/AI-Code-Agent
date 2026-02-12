import React, { useState, useRef } from 'react';
import { ProgrammingLanguage, ReviewType, ExplanationLevel, User, ReviewRecord } from '../types';
import { UploadIcon, DownloadIcon, PlayIcon } from './Icons';
import { analyzeCodeStream } from '../services/gemini';
import { saveToHistory } from '../services/storage';
import { ReviewResultView } from './ReviewResultView';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>(ProgrammingLanguage.JAVASCRIPT);
  const [reviewType, setReviewType] = useState<ReviewType>(ReviewType.FULL_REVIEW);
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>(ExplanationLevel.INTERMEDIATE);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultEndRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setCode(text);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert("Please enter or upload some code to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setResult('');
    let fullResult = '';

    try {
      const stream = analyzeCodeStream(code, language, reviewType, explanationLevel);
      for await (const chunk of stream) {
        fullResult += chunk;
        setResult(fullResult);
      }
      
      // Save to history after completion
      const record: ReviewRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        code,
        language,
        reviewType,
        explanationLevel,
        result: fullResult
      };
      saveToHistory(user.username, record);
      
    } catch (error) {
       console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractCodeForDownload = (): string | null => {
    // Look for the last code block in the markdown (ignores metrics since it looks for ```)
    const regex = /```[\w]*\n([\s\S]*?)\n```/g;
    let match;
    let lastCode = null;
    while ((match = regex.exec(result)) !== null) {
      lastCode = match[1];
    }
    return lastCode;
  };

  const handleDownload = () => {
    const optimizedCode = extractCodeForDownload();
    if (!optimizedCode) {
      alert("No optimized code found to download.");
      return;
    }

    const blob = new Blob([optimizedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Determine extension based on language
    const extMap: Record<string, string> = {
      [ProgrammingLanguage.PYTHON]: 'py',
      [ProgrammingLanguage.JAVASCRIPT]: 'js',
      [ProgrammingLanguage.TYPESCRIPT]: 'ts',
      [ProgrammingLanguage.JAVA]: 'java',
      [ProgrammingLanguage.CPP]: 'cpp',
      [ProgrammingLanguage.CSHARP]: 'cs',
      [ProgrammingLanguage.RUST]: 'rs',
      [ProgrammingLanguage.GO]: 'go',
      [ProgrammingLanguage.PHP]: 'php',
      [ProgrammingLanguage.RUBY]: 'rb',
      [ProgrammingLanguage.SWIFT]: 'swift',
      [ProgrammingLanguage.KOTLIN]: 'kt',
    };
    const ext = extMap[language] || 'txt';
    a.download = `optimized_code.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6">
      
      {/* Left Panel: Input */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4 bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border p-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Code Input</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
              className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-dark-border rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {Object.values(ProgrammingLanguage).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Review Type</label>
            <select 
              value={reviewType} 
              onChange={(e) => setReviewType(e.target.value as ReviewType)}
              className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-dark-border rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {Object.values(ReviewType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Explanation</label>
            <select 
              value={explanationLevel} 
              onChange={(e) => setExplanationLevel(e.target.value as ExplanationLevel)}
              className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-dark-border rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {Object.values(ExplanationLevel).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-grow flex flex-col relative min-h-[300px]">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Paste your ${language} code here...`}
            className="flex-grow w-full resize-none rounded-lg border border-slate-300 dark:border-dark-border bg-slate-50 dark:bg-[#0d1117] p-4 font-mono text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
            spellCheck="false"
          />
          
          <div className="absolute bottom-4 right-4 flex gap-2">
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".txt,.py,.js,.ts,.jsx,.tsx,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt" 
              />
             <button
               onClick={() => fileInputRef.current?.click()}
               className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
               title="Upload File"
             >
               <UploadIcon />
             </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !code.trim()}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Logic & Complexity...
            </>
          ) : (
             <>
               <PlayIcon className="w-5 h-5" />
               Analyze Code & Generate Dashboard
             </>
          )}
        </button>
      </div>

      {/* Right Panel: Output */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden h-full min-h-[500px]">
        <div className="p-4 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-[#0f172a]">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review Results</h2>
          
          {result && !isAnalyzing && extractCodeForDownload() && (
            <button
              onClick={handleDownload}
              className="text-sm font-medium flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-1.5 rounded-md transition-colors text-slate-800 dark:text-slate-200"
            >
              <DownloadIcon className="w-4 h-4" />
              Download Code
            </button>
          )}
        </div>

        <div className="flex-grow p-6 overflow-y-auto relative bg-white dark:bg-[#0f172a]">
           <ReviewResultView content={result} isAnalyzing={isAnalyzing} />
           <div ref={resultEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;