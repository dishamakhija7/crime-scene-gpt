import React, { useState } from 'react';
import Splash from './components/Splash';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import PersonalInfo from './components/settings/PersonalInfo';
import ChangePassword from './components/settings/ChangePassword';
import NotificationSettings from './components/settings/NotificationSettings';
import LinkedAccounts from './components/settings/LinkedAccounts';
import HelpSupport from './components/settings/HelpSupport';
import AboutApp from './components/settings/AboutApp';
import CaseList from './components/CaseList';
import Dashboard from './components/Dashboard';
import MCQFlow from './components/MCQFlow';
import EvidenceUpload from './components/EvidenceUpload';
import Reconstruction3D from './components/Reconstruction3D';
import ConfidenceHeatmap from './components/ConfidenceHeatmap';
import ReportPreview from './components/ReportPreview';
import PDFReport from './components/PDFReport';
import TimelineView from './components/TimelineView';
import SideDrawer from './components/SideDrawer';
import QuickActionsModal from './components/QuickActionsModal';
import AlternativeScenarios from './components/AlternativeScenarios';

import { 
  Menu, Bell, ShieldAlert, Compass, FileText, User, 
  Settings, Layers, HelpCircle, Code, ShieldCheck, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [authStatus, setAuthStatus] = useState('splash'); // 'splash', 'signin', 'signup', 'authenticated'
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, mcq, evidence, reconstruction, heatmap, report, pdf, timeline, profile, personal, password, notifications, linked, help, about, cases
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Simulated global state
  const [investigationData, setInvestigationData] = useState(null);

  const handleNextFromSplash = () => {
    setAuthStatus('signin');
  };

  const handleSignIn = () => {
    setAuthStatus('authenticated');
    setActiveView('dashboard');
  };

  const handleSignUp = () => {
    setAuthStatus('authenticated');
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setAuthStatus('signin');
  };

  const handleNewInvestigation = () => {
    setQuickActionsOpen(true);
  };

  const handleSelectQuickAction = (actionId) => {
    setQuickActionsOpen(false);
    if (actionId === 'mcq') {
      setActiveView('mcq');
    } else if (actionId === 'evidence') {
      setActiveView('evidence');
    } else if (actionId === 'quick') {
      setActiveView('mcq');
    } else if (actionId === 'import') {
      setActiveView('reconstruction');
    }
  };

  const handleSelectCase = (caseId) => {
    // Jump straight to interactive reconstruction analysis for the case
    setActiveView('reconstruction');
  };

  const handleNavigate = (view) => {
    switch (view) {
      case 'settings':
        return setActiveView('profile');
      case 'support':
        return setActiveView('help');
      case 'about':
        return setActiveView('about');
      case 'notifications':
        return setNotificationsOpen(true);
      case 'cases':
        return setActiveView('cases');
      default:
        return setActiveView(view);
    }
  };

  // Breadcrumbs text helper
  const getBreadcrumb = () => {
    switch (activeView) {
      case 'dashboard': return 'Incident Hub';
      case 'mcq': return 'AI Questionnaire Flow';
      case 'evidence': return 'Multi-Input Evidence';
      case 'reconstruction': return '3D Accident Mesh';
      case 'heatmap': return 'Likelihood Heatmap';
      case 'report': return 'AI Analysis Report';
      case 'pdf': return 'Printable PDF Record';
      case 'timeline': return 'Microsecond Chronology';
      case 'personal': return 'Personal Information';
      case 'password': return 'Change Password';
      case 'notifications': return 'Notification Settings';
      case 'linked': return 'Linked Accounts';
      case 'help': return 'Help & Support';
      case 'about': return 'About CrimeScene GPT';
      case 'cases': return 'Case Archive';
      case 'profile': return 'Officer Credentials';
      default: return 'System Workspace';
    }
  };

  // Render current view function
  const renderView = () => {
    if (authStatus === 'splash') {
      return <Splash onNext={handleNextFromSplash} />;
    }
    if (authStatus === 'signin') {
      return <SignIn onSignIn={handleSignIn} onGoToSignUp={() => setAuthStatus('signup')} />;
    }
    if (authStatus === 'signup') {
      return <SignUp onSignUp={handleSignUp} onGoToSignIn={() => setAuthStatus('signin')} />;
    }

    // Authenticated views
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            onNewInvestigation={handleNewInvestigation} 
            onSelectCase={handleSelectCase} 
            onOpenCases={() => setActiveView('cases')}
          />
        );
      case 'mcq':
        return (
          <MCQFlow 
            onComplete={(data) => {
              setInvestigationData(data);
              setActiveView('evidence');
            }} 
            onCancel={() => setActiveView('dashboard')} 
          />
        );
      case 'evidence':
        return (
          <EvidenceUpload 
            onContinue={() => setActiveView('reconstruction')} 
            onBack={() => setActiveView('mcq')} 
          />
        );
      case 'reconstruction':
        return (
          <Reconstruction3D 
            onGoBack={() => setActiveView('dashboard')}
            onGoToReport={() => setActiveView('report')} 
            onGoToTimeline={() => setActiveView('timeline')}
            onGoToHeatmap={() => setActiveView('heatmap')}
          />
        );
      case 'heatmap':
        return <ConfidenceHeatmap />;
      case 'report':
        return (
          <ReportPreview 
            onTogglePDF={() => setActiveView('pdf')} 
            onGoToTimeline={() => setActiveView('timeline')}
            onGoToEvidence={() => setActiveView('evidence')}
          />
        );
      case 'pdf':
        return <PDFReport onBack={() => setActiveView('report')} />;
      case 'timeline':
        return (
          <TimelineView 
            onGoToReport={() => setActiveView('report')} 
            onGoToReconstruction={() => setActiveView('reconstruction')} 
          />
        );
      case 'profile':
        return <Profile onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'personal':
        return <PersonalInfo onBack={() => setActiveView('profile')} />;
      case 'password':
        return <ChangePassword onBack={() => setActiveView('profile')} />;
      case 'notifications':
        return <NotificationSettings onBack={() => setActiveView('profile')} />;
      case 'linked':
        return <LinkedAccounts onBack={() => setActiveView('profile')} />;
      case 'help':
        return <HelpSupport onBack={() => setActiveView('profile')} />;
      case 'about':
        return <AboutApp onBack={() => setActiveView('profile')} />;
      case 'cases':
        return <CaseList onBack={() => setActiveView('dashboard')} onSelectCase={handleSelectCase} />;
      default:
        return <Dashboard onNewInvestigation={handleNewInvestigation} onSelectCase={handleSelectCase} onOpenCases={() => setActiveView('cases')} />;
    }
  };

  // Debug force view jumper
  const jumpToMockScreen = (auth, view) => {
    setAuthStatus(auth);
    setActiveView(view);
    if (view === 'new') {
      setAuthStatus('authenticated');
      setActiveView('dashboard');
      setQuickActionsOpen(true);
    }
  };

  const isDarkAppTheme = activeView !== 'pdf' || authStatus !== 'authenticated';

  return (
    <div className={`min-h-screen ${isDarkAppTheme ? 'bg-[#09090E] text-gray-100' : 'bg-gray-100 text-gray-900'} relative transition-colors duration-300 font-sans pb-16`}>
      
      {/* Background cyber grid if dark theme */}
      {isDarkAppTheme && <div className="absolute inset-0 cyber-grid pointer-events-none opacity-50 z-0" />}

      {/* Main Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        
        {/* Global Authenticated Top Header */}
        {authStatus === 'authenticated' && activeView !== 'pdf' && (
          <header className="border-b border-gray-800/50 bg-[#0B0B14] sticky top-0 z-30 px-4 py-4 flex justify-between items-center w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setDrawerOpen(true)}
                className="w-10 h-10 bg-[#12121a] rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <img src="/favicon.svg" alt="Logo" className="w-8 h-8 object-contain" />
                <div className="flex flex-col justify-center">
                  <span className="text-[13px] font-bold text-[#00E5FF] tracking-wide leading-tight">CRIMESCENE GPT</span>
                  <span className="text-[12px] text-gray-300 leading-tight mt-0.5">AI Accident Reconstruction</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification icon */}
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative w-10 h-10 bg-[#12121a] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition shadow-sm"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ff3b30]" />
              </button>

              {/* User Avatar */}
              <button 
                onClick={() => setActiveView('profile')}
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center transition border-2 border-transparent hover:border-gray-600"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Inspector Arjun" 
                  className="w-full h-full object-cover" 
                />
              </button>
            </div>
          </header>
        )}

        {/* View Viewport */}
        <main className="flex-grow flex items-center justify-center w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${authStatus}-${activeView}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {notificationsOpen && authStatus === 'authenticated' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 flex items-center justify-center p-4"
              >
                <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setNotificationsOpen(false)} />
                <motion.div
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-50 w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0b0f1f]/95 p-5 shadow-[0_40px_120px_rgba(31,25,54,0.4)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-[#a78bfa]/80">Notifications</p>
                      <h2 className="mt-3 text-xl font-semibold text-white">Recent Alerts</h2>
                      <p className="mt-2 text-sm text-[#cbd5e1]">Review the latest system updates, case alerts, and message summaries.</p>
                    </div>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="h-11 w-11 rounded-3xl border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {[
                      { title: 'New evidence uploaded', detail: 'A new file was added to INV-2025-0715.', time: '2m ago', badge: 'Urgent' },
                      { title: 'Analysis complete', detail: '3D reconstruction finished for your current case.', time: '14m ago', badge: 'Info' },
                      { title: 'Security alert', detail: 'Login attempt from a new device was detected.', time: '45m ago', badge: 'Security' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-3xl border border-white/10 bg-[#111827]/80 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <p className="mt-1 text-sm text-[#94a3b8]">{item.detail}</p>
                          </div>
                          <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#cbd5e1]">
                            {item.badge}
                          </span>
                        </div>
                        <p className="mt-3 text-[11px] text-gray-500">{item.time}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Global Authenticated Bottom Navigation Bar */}
        {authStatus === 'authenticated' && activeView !== 'pdf' && (
          <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-800/80 bg-[#0B0B14]/90 backdrop-blur-md py-2.5 px-6 flex justify-around items-center z-30 max-w-lg mx-auto rounded-t-2xl shadow-2xl">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 transition ${activeView === 'dashboard' ? 'text-accentTeal' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[9px] font-mono uppercase tracking-wider">Home</span>
            </button>

            <button 
              onClick={() => setActiveView('reconstruction')}
              className={`flex flex-col items-center gap-1 transition ${(activeView === 'reconstruction' || activeView === 'heatmap' || activeView === 'timeline') ? 'text-accentTeal' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Layers className="w-5 h-5" />
              <span className="text-[9px] font-mono uppercase tracking-wider">Analysis</span>
            </button>

            <button 
              onClick={() => setActiveView('report')}
              className={`flex flex-col items-center gap-1 transition ${activeView === 'report' ? 'text-accentTeal' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[9px] font-mono uppercase tracking-wider">Reports</span>
            </button>

            <button 
              onClick={() => setActiveView('profile')}
              className={`flex flex-col items-center gap-1 transition ${activeView === 'profile' ? 'text-accentTeal' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <User className="w-5 h-5" />
              <span className="text-[9px] font-mono uppercase tracking-wider">Profile</span>
            </button>
          </nav>
        )}
      </div>

      {/* Side menu drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <SideDrawer 
            isOpen={drawerOpen} 
            onClose={() => setDrawerOpen(false)}
            activeView={activeView}
            onNavigate={(view) => handleNavigate(view)}
            onLogout={handleLogout}
            onNewInvestigation={handleNewInvestigation}
          />
        )}
      </AnimatePresence>

      {/* New Investigation Actions Modal */}
      <AnimatePresence>
        {quickActionsOpen && (
          <QuickActionsModal 
            isOpen={quickActionsOpen} 
            onClose={() => setQuickActionsOpen(false)}
            onSelectAction={handleSelectQuickAction}
          />
        )}
      </AnimatePresence>



    </div>
  );
}

export default App;

