import React from 'react';
import { CodeIcon, ShieldCheckIcon, PlayIcon, HistoryIcon } from './Icons';

interface HomeProps {
  onGetStarted: () => void;
}

const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-brand-100 dark:bg-brand-900/30 rounded-2xl mb-6 border border-brand-200 dark:border-brand-800/50">
          <CodeIcon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          Intelligent Analysis <br className="hidden sm:block" />
          <span className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500">
            Review smarter - Optimize faster - Build better
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
          Analyze, review, and optimize your code seamlessly through our AI-driven platform designed to detect bugs, boost performance, and strengthen security.
        </p>

        <button
          onClick={onGetStarted}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-full shadow-lg hover:shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <PlayIcon className="w-6 h-6" />
          Start Reviewing Now
        </button>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Mentor-Style Learning"
          description="We don't just fix code; we act as a smart mentor, explaining what was optimized, how the logic improved, and why it matters."
          icon={<HistoryIcon className="w-6 h-6 text-indigo-500" />}
        />
        <FeatureCard
          title="Edge Case Detection"
          description="Go beyond surface-level linting. We analyze potential failure scenarios, limits, and edge cases to make your code bulletproof."
          icon={<ShieldCheckIcon className="w-6 h-6 text-red-500" />}
        />
        <FeatureCard
          title="Code Health Dashboard"
          description="Skip the long reports. Instantly understand your code quality through visual scores and time/space complexity comparison graphs."
          icon={<CodeIcon className="w-6 h-6 text-brand-500" />}
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border hover:border-brand-300 dark:hover:border-brand-700/50 transition-colors">
    <div className="w-12 h-12 bg-slate-50 dark:bg-[#0f172a] rounded-xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

export default Home;