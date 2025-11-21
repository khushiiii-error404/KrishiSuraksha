import React from 'react';
import { Plus, DollarSign, TrendingUp, Activity, CloudRain, AlertTriangle, Landmark, FileCheck, Link, Shield, User, Droplets, Wind, Sun } from 'lucide-react';
import { Button } from './Button';
import { Claim, Policy, Language, UserProfile } from '../types';
import { translations } from '../translations';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { MapView } from './MapView';

interface DashboardProps {
  onReportClick: (policy: Policy) => void;
  claims: Claim[];
  policies: Policy[];
  language: Language;
  userProfile: UserProfile;
}

const MOCK_HISTORY_DATA = [
  { month: 'Jan', payout: 0 },
  { month: 'Feb', payout: 0 },
  { month: 'Mar', payout: 120000 },
  { month: 'Apr', payout: 150000 },
  { month: 'May', payout: 50000 },
  { month: 'Jun', payout: 380000 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onReportClick, claims, policies, language, userProfile }) => {
  const [selectedPolicyId, setSelectedPolicyId] = React.useState<string>(policies[0]?.id || '');
  const t = translations[language];
  
  const totalPayouts = claims.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.payout : 0), 0);
  const pendingClaims = claims.filter(c => c.status === 'Processing' || c.status === 'Approved' || c.status === 'Under Review').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const selectedPolicy = policies.find(p => p.id === selectedPolicyId);

  const getStatusStyle = (status: Claim['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      default: // Processing, Approved
        return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Row: Profile and Weather */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center mb-4">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">{userProfile.name}</h3>
                    <p className="text-xs text-slate-500">{userProfile.village}, {userProfile.district}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">{t.aadhaar}</span>
                    <span className="font-medium text-slate-900">XXXX-XXXX-{userProfile.aadhaarLast4}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">{t.bankAccount}</span>
                    <span className="font-medium text-slate-900">{userProfile.bankName} ••••{userProfile.accountLast4}</span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                     <span className="text-slate-500">Status</span>
                     <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <Shield className="w-3 h-3 mr-1" /> KYC Verified
                     </span>
                </div>
            </div>
        </div>

        {/* Weather Widget (Mocked for Dashboard, Real for Analysis) */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg">{t.currentWeather}</h3>
                        <p className="text-blue-100 text-sm">{t.today}, {selectedPolicy?.location.split(',')[0]}</p>
                    </div>
                    <Sun className="h-8 w-8 text-yellow-300 animate-pulse" />
                </div>
                <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold">32°</span>
                    <span className="text-lg mb-1 ml-1 text-blue-100">C</span>
                </div>
                <div className="flex gap-4 text-sm text-blue-50">
                    <div className="flex items-center">
                        <Droplets className="w-4 h-4 mr-1" /> 65%
                    </div>
                    <div className="flex items-center">
                        <Wind className="w-4 h-4 mr-1" /> 12 km/h
                    </div>
                </div>
             </div>
             {/* Decorative */}
             <CloudRain className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
        </div>

        {/* Stats Summary Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{t.totalClaims}</p>
                <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(totalPayouts)}</h3>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg">
                 <Landmark className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{t.dbIntegration}</span>
              <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full text-xs">
                <Link className="w-3 h-3 mr-1" />
                Bhoomi / PMFBY
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Hero Actions */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="md:col-span-1 bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">{t.pmfbyActive}</h2>
              <span className="bg-white/20 text-xs px-2 py-1 rounded border border-white/20">{t.season}: {selectedPolicy?.season === 'Kharif' ? t.kharif : t.rabi} 2025</span>
            </div>
            <p className="text-emerald-100 mb-4 text-sm">
              {t.implementingAgency}: <strong>{selectedPolicy?.implementingAgency}</strong>. 
              {t.monitoringActive}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                {/* Policy Selector */}
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20 w-full sm:w-auto min-w-[250px]">
                <label className="block text-xs text-emerald-200 mb-1">{t.selectedPolicy}</label>
                <select 
                    value={selectedPolicyId}
                    onChange={(e) => setSelectedPolicyId(e.target.value)}
                    className="w-full bg-transparent border-none text-white font-semibold focus:ring-0 p-0 cursor-pointer appearance-none"
                >
                    {policies.map(p => (
                    <option key={p.id} value={p.id} className="text-slate-900">
                        {p.cropType} - {p.acres} Acres (Survey No: {p.landId})
                    </option>
                    ))}
                </select>
                </div>

                <Button 
                onClick={() => selectedPolicy && onReportClick(selectedPolicy)}
                variant="danger"
                className="font-bold shadow-lg border-2 border-white/10 w-full sm:w-auto"
                >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {t.reportDamage}
                </Button>
            </div>
          </div>
          {/* Decorative BG Elements */}
          <CloudRain className="absolute right-4 top-4 text-white/10 h-32 w-32" />
        </div>
      </div>

      {/* Linked Policies Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-slate-500" />
            {t.myPolicies}
          </h3>
          <Button variant="secondary" className="text-xs h-8">
            {t.linkNew}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
          {policies.map(policy => (
            <div 
              key={policy.id} 
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPolicyId === policy.id 
                  ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' 
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
              onClick={() => setSelectedPolicyId(policy.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-900">{policy.cropType}</span>
                <span className={`text-xs px-2 py-0.5 rounded border ${policy.season === 'Kharif' ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                  {policy.season === 'Kharif' ? t.kharif : t.rabi}
                </span>
              </div>
              <div className="text-sm text-slate-600 mb-1">
                No: {policy.landId} • {policy.location}
              </div>
              <div className="text-xs text-slate-500 mb-3">
                {t.implementingAgency}: {policy.implementingAgency}
              </div>
              <div className="text-xs text-slate-500 flex justify-between border-t border-slate-200 pt-2">
                <div>
                    <span className="block text-slate-400">{t.sumInsured}</span>
                    <span className="font-medium text-slate-900">{formatCurrency(policy.sumInsured)}</span>
                </div>
                <div className="text-right">
                    <span className="block text-slate-400">{t.premium} ({policy.season === 'Kharif' ? '2%' : '1.5%'})</span>
                    <span className="font-medium text-emerald-600">{formatCurrency(policy.premiumPaid)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-medium uppercase">{t.activePolicies}</span>
            <Shield className="text-emerald-500 w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-slate-900">{policies.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-medium uppercase">{t.pendingClaims}</span>
            <Activity className="text-amber-500 w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-slate-900">{pendingClaims}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-medium uppercase">{t.areaRisk}</span>
            <AlertTriangle className="text-red-500 w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-slate-900">{t.low}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-medium uppercase">{t.settlementTime}</span>
            <DollarSign className="text-blue-500 w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-slate-900">{t.instant}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t.payoutHistory}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HISTORY_DATA}>
                <defs>
                  <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="payout" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPayout)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{t.policyLocation}</h3>
          <div className="h-80 w-full bg-slate-100 rounded-xl overflow-hidden">
             {selectedPolicy && (
              <MapView 
                key={selectedPolicy.id}
                center={{ lat: selectedPolicy.lat, lng: selectedPolicy.lng }}
                zoom={16}
              />
            )}
          </div>
        </div>
      </div>

      {/* Recent Claims List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{t.recentClaims}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {claims.length === 0 ? (
            <div className="p-8 text-center text-slate-500">{t.noClaims}</div>
          ) : (
            claims.map((claim) => (
              <div key={claim.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  {claim.imageUrl && (
                    <img src={claim.imageUrl} alt="Evidence" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{claim.type} Damage</p>
                    <p className="text-xs text-slate-500">{new Date(claim.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{claim.status === 'Under Review' ? t.underReview : formatCurrency(claim.payout)}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(claim.status)}`}>
                    {t[claim.status.toLowerCase().replace(' ', '')] || claim.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};