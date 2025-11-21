
import React from 'react';
import { Languages } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  onHome: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Custom logo component: Wheat Stalk inside a Shield
const KrishiSurakshaLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Shield Outline */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    {/* Wheat/Crop Stalk */}
    <path d="M12 8v9" />
    <path d="M12 12c-1.7-1-2.5-3.5-2.5-3.5" />
    <path d="M12 12c1.7-1 2.5-3.5 2.5-3.5" />
    <path d="M12 15c-1.3-0.5-2-2-2-2" />
    <path d="M12 15c1.3-0.5 2-2 2-2" />
  </svg>
);


export const Header: React.FC<HeaderProps> = ({ onHome, language, setLanguage }) => {
  const t = translations[language];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={onHome}
          >
            <div className="bg-emerald-100 p-2 rounded-full mr-3">
              <KrishiSurakshaLogo className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{t.appTitle}</h1>
              <p className="text-xs text-slate-500">{t.tagline}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            className="flex items-center px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium text-slate-700 border border-slate-200"
          >
            <Languages className="w-4 h-4 mr-1.5" />
            {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </button>
        </div>
      </div>
    </header>
  );
};