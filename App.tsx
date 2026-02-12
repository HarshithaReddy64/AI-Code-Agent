import React, { useState, useEffect } from 'react';
import { ViewState, User } from './types';
import { getStoredUser, setStoredUser } from './services/storage';
import { CodeIcon, SunIcon, MoonIcon, HistoryIcon } from './components/Icons';

import Home from './components/Home';
import Dashboard from './components/Dashboard';
import History from './components/History';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for developer aesthetic

  useEffect(() => {
    // Check local storage for user
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    // Check system preference for theme initially
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setStoredUser(userData);
    setShowAuth(false);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setStoredUser(null);
    setView(ViewState.HOME);
  };

  const requireAuth = (targetView: ViewState) => {
    if (user) {
      setView(targetView);
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView(ViewState.HOME)}
          >
            <div className="bg-brand-600 p-1.5 rounded-lg text-white">
              <CodeIcon className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block tracking-tight">
              AI CodeAgent
            </span>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex space-x-1">
            <button
              onClick={() => setView(ViewState.HOME)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${view === ViewState.HOME ? 'text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-slate-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              Home
            </button>
            <button
              onClick={() => requireAuth(ViewState.DASHBOARD)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${view === ViewState.DASHBOARD ? 'text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-slate-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => requireAuth(ViewState.HISTORY)}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${view === ViewState.HISTORY ? 'text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-slate-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              <HistoryIcon className="w-4 h-4" />
              History
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-200 dark:border-dark-border pl-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-dark-border pl-4">
                <button
                  onClick={() => setShowAuth(true)}
                  className="text-sm px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 font-medium rounded-lg transition-colors shadow-sm"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {view === ViewState.HOME && <Home onGetStarted={() => requireAuth(ViewState.DASHBOARD)} />}
        {view === ViewState.DASHBOARD && user && <Dashboard user={user} />}
        {view === ViewState.HISTORY && user && <History user={user} />}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;