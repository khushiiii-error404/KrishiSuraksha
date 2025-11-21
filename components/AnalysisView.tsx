
import React, { useEffect, useState } from 'react';
import { Satellite, ScanLine, Database, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface AnalysisViewProps {
  language: Language;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ language }) => {
  const [step, setStep] = useState(0);
  const t = translations[language];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),   // Uploading
      setTimeout(() => setStep(2), 2500),  // Processing Visuals
      setTimeout(() => setStep(3), 4500),  // Querying Satellite
      setTimeout(() => setStep(4), 6500),  // Calculating Payout
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const steps = [
    { icon: ScanLine, text: t.step1, status: step > 1 ? 'done' : step === 1 ? 'active' : 'pending' },
    { icon: Satellite, text: t.step2, status: step > 2 ? 'done' : step === 2 ? 'active' : 'pending' },
    { icon: Database, text: t.step3, status: step > 3 ? 'done' : step === 3 ? 'active' : 'pending' },
    { icon: CheckCircle2, text: t.step4, status: step > 4 ? 'done' : step === 4 ? 'active' : 'pending' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto p-6">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-ping"></div>
        <div className="bg-white p-6 rounded-full shadow-xl relative z-10 border-4 border-emerald-100">
          <Satellite className="w-16 h-16 text-emerald-600 animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t.processingTitle}</h2>
      
      <div className="w-full space-y-4">
        {steps.map((s, idx) => (
          <div key={idx} className={`flex items-center p-3 rounded-lg transition-all duration-500 ${
            s.status === 'active' ? 'bg-emerald-50 border border-emerald-100 transform scale-105' : 
            s.status === 'done' ? 'opacity-50' : 'opacity-30'
          }`}>
            <div className={`mr-4 p-2 rounded-full ${
              s.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 
              s.status === 'done' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
            }`}>
              {s.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className={`w-5 h-5 ${s.status === 'active' ? 'animate-spin-slow' : ''}`} />}
            </div>
            <span className={`font-medium ${s.status === 'active' ? 'text-emerald-900' : 'text-slate-700'}`}>
              {s.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};