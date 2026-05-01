import { useAuth } from './contexts/AuthContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { TestProvider } from './contexts/TestContext';
import AuthPage from './components/auth/AuthPage';
import LevelTest from './components/test/LevelTest';
import MainLayout from './components/layout/MainLayout';
import WelcomeSection from './components/dashboard/WelcomeSection';
import CameraUpload from './components/dashboard/CameraUpload';
import RecentLearning from './components/dashboard/RecentLearning';
import QuickActions from './components/dashboard/QuickActions';
import { useLensaApp } from './hooks/useLensaApp';
import './styles/components.css';

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { t } = useSettings();
  const { handleGenerate } = useLensaApp();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (!user?.hasCompletedTest) {
    return (
      <TestProvider>
        <LevelTest onComplete={() => {}} />
      </TestProvider>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-content">
        <WelcomeSection />
        
        <CameraUpload 
          onCapture={handleGenerate}
          disabled={false}
        />

        <RecentLearning />

        <QuickActions 
          onActionClick={(actionId) => {
            console.log('Action clicked:', actionId);
          }}
        />
      </div>
    </MainLayout>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
