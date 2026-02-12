import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { ShieldCheckIcon } from './Icons';

interface ReviewResultViewProps {
  content: string;
  isAnalyzing?: boolean;
}

// Function to generate SVG path data mapping Big-O notation to coordinate curves
const getPathData = (complexity: string) => {
  const str = (complexity || '').toLowerCase().replace(/\s/g, '');
  let type = 'n';
  
  if (str.includes('1') && !str.includes('n')) type = '1';
  else if (str.includes('logn') && !str.includes('nlogn')) type = 'logn';
  else if (str.includes('nlogn')) type = 'nlogn';
  else if (str.includes('n^2') || str.includes('n*n')) type = 'n2';
  else if (str.includes('n^3') || str.includes('2^n') || str.includes('!')) type = '2n';

  let points = [];
  // Calculate points for X from 0 to 100
  for (let x = 0; x <= 100; x += 2) {
    let t = x / 10; // Abstract time factor 0 to 10
    let y = 0;
    
    // Mathematical functions to approximate Big-O curves within a 100x100 grid
    if (type === '1') y = 10;
    else if (type === 'logn') y = 15 * Math.log2(t + 1);
    else if (type === 'n') y = 6 * t;
    else if (type === 'nlogn') y = 2.5 * t * Math.log2(t + 1);
    else if (type === 'n2') y = Math.pow(t, 2);
    else if (type === '2n') y = Math.pow(2, t / 1.5);
    
    y = Math.min(y, 100); // Cap at max height
    points.push(`${x},${100 - y}`); // Invert Y for SVG coordinates
  }
  
  return `M ${points.join(' L ')}`;
};

const CircularProgress: React.FC<{ value: number }> = ({ value }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const colorClass = value >= 80 ? 'text-green-500' : value >= 60 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-slate-800" />
        <circle 
          cx="64" 
          cy="64" 
          r={radius} 
          stroke="currentColor" 
          strokeWidth="10" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          className={`${colorClass} transition-all duration-1000 ease-out`} 
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{value}</span>
      </div>
    </div>
  );
};

const ComplexityLineGraph: React.FC<{ title: string, before: string, after: string, yAxisLabel: string }> = ({ title, before, after, yAxisLabel }) => {
  return (
    <div className="flex flex-col w-full h-full min-h-[220px]">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 text-center">{title}</h4>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mb-4 text-[11px] font-bold">
        <div className="flex items-center gap-2">
          <div className="w-4 border-b-[3px] border-red-500 border-dashed"></div>
          <span className="text-slate-500 uppercase tracking-wide">Original <span className="text-slate-700 dark:text-slate-300">({before})</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 border-b-[3px] border-emerald-500"></div>
          <span className="text-slate-500 uppercase tracking-wide">Optimized <span className="text-emerald-600 dark:text-emerald-400">({after})</span></span>
        </div>
      </div>
      
      {/* Graph Area */}
      <div className="flex-1 flex flex-col pt-2">
        <div className="flex flex-1">
          {/* Y-axis label */}
          <div className="w-8 flex items-center justify-center">
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase -rotate-90 whitespace-nowrap origin-center transform translate-y-4">
              {yAxisLabel}
            </span>
          </div>
          
          {/* SVG Plot */}
          <div className="flex-1 border-l-2 border-b-2 border-slate-300 dark:border-slate-600 relative overflow-visible">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" className="text-slate-100 dark:text-slate-700/50" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" className="text-slate-100 dark:text-slate-700/50" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" className="text-slate-100 dark:text-slate-700/50" />
              
              {/* Curves */}
              <path 
                d={getPathData(before)} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeDasharray="6 4" 
                vectorEffect="non-scaling-stroke" 
                className="text-red-500/80" 
              />
              <path 
                d={getPathData(after)} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                vectorEffect="non-scaling-stroke" 
                className="text-emerald-500 drop-shadow-md" 
              />
            </svg>
          </div>
        </div>
        
        {/* X-axis label */}
        <div className="h-8 flex items-center justify-center pl-8">
           <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Input Size (n)</span>
        </div>
      </div>
    </div>
  );
};

export const ReviewResultView: React.FC<ReviewResultViewProps> = ({ content, isAnalyzing }) => {
  if (!content && !isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
        <ShieldCheckIcon className="w-16 h-16 mb-4 opacity-20" />
        <p>Run analysis to see detailed review, health score, and complexity graphs.</p>
      </div>
    );
  }

  // Parse metrics out of the content
  let metricsData = null;
  // Strip out the metrics block entirely for the clean markdown display
  const cleanMarkdown = content.replace(/<metrics>[\s\S]*$/, '').trim();

  const metricsMatch = content.match(/<metrics>([\s\S]*?)<\/metrics>/);
  if (metricsMatch) {
    try {
      metricsData = JSON.parse(metricsMatch[1]);
    } catch (e) {
      // JSON might be incomplete if still streaming, ignore safely
    }
  }

  return (
    <div className="pb-8 space-y-8">
      {/* Code Health Dashboard Widget */}
      {metricsData && (
        <div className="bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-dark-border rounded-2xl p-6 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-brand-500">
              <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V7.5Z" clipRule="evenodd" />
            </svg>
            Code Health Dashboard
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Health Score */}
            <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-full min-h-[250px]">
              <CircularProgress value={metricsData.score || 0} />
              <div className="mt-4 text-center">
                <span className="block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Health Score</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Based on bugs, logic, and efficiency</span>
              </div>
            </div>
            
            {/* Time Complexity Graph */}
            <div className="flex flex-col p-6 bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-full min-h-[250px]">
              <ComplexityLineGraph 
                title="Time Complexity" 
                before={metricsData.timeBefore || 'O(?)'} 
                after={metricsData.timeAfter || 'O(?)'} 
                yAxisLabel="Operations"
              />
            </div>

            {/* Space Complexity Graph */}
            <div className="flex flex-col p-6 bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-full min-h-[250px]">
              <ComplexityLineGraph 
                title="Space Complexity" 
                before={metricsData.spaceBefore || 'O(?)'} 
                after={metricsData.spaceAfter || 'O(?)'} 
                yAxisLabel="Memory"
              />
            </div>
          </div>
        </div>
      )}

      {/* Markdown Content */}
      <MarkdownRenderer content={cleanMarkdown} />
    </div>
  );
};
