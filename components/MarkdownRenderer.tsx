import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split the content by markdown code blocks (```language ... ```)
  const parts = content.split(/(```[\w]*\n[\s\S]*?\n```)/g);

  return (
    <div className="text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 font-sans text-sm sm:text-base">
      {parts.map((part, index) => {
        // Odd indices are the code blocks due to the regex split with capture group
        if (index % 2 !== 0) {
          const match = part.match(/```([\w]*)\n([\s\S]*?)\n```/);
          if (match) {
            const language = match[1] || 'code';
            const code = match[2];
            return (
              <div key={index} className="my-6 rounded-lg overflow-hidden border border-slate-200 dark:border-dark-border shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-mono text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-dark-border flex justify-between items-center">
                  <span>{language}</span>
                </div>
                <pre className="p-4 bg-white dark:bg-[#0d1117] overflow-x-auto text-sm font-mono text-slate-800 dark:text-slate-200">
                  <code>{code}</code>
                </pre>
              </div>
            );
          }
        }

        // Parse headers and paragraphs simply
        const subParts = part.split('\n');
        return (
          <div key={index}>
            {subParts.map((line, i) => {
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-bold mt-6 mb-2 text-brand-600 dark:text-brand-500">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">{line.replace('# ', '')}</h1>;
              }
              if (line.startsWith('- ') || line.startsWith('* ')) {
                return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              // Basic bold text parsing `**text**`
              const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((segment, j) => {
                 if (segment.startsWith('**') && segment.endsWith('**')) {
                   return <strong key={j} className="font-semibold">{segment.slice(2, -2)}</strong>;
                 }
                 return segment;
              });

              return <p key={i} className="mb-2">{formattedLine}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;