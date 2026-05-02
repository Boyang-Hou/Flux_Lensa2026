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
import ResultCard from './components/ResultCard';
import Practice from './components/Practice';
import AnkiExport from './components/AnkiExport';
import { useLensaApp } from './hooks/useLensaApp';
import './styles/components.css';

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { t } = useSettings();
  const { state, handleGenerate, handleSubmitAnswer, ankiUrl } = useLensaApp();

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
          disabled={state.isGenerating || state.isRendering}
        />

        <ResultCard
          imageUrl={state.resultImageUrl}
          isRendering={state.isRendering}
        />

        {state.annotations.length > 0 && (
          <div className="annotations-section">
            <h3>📝 识别结果</h3>
            <ul>
              {state.annotations.map((ann, idx) => (
                <li key={idx}>
                  <strong>{ann.object}</strong> ({ann.label})
                  <ul>
                    {ann.new_words.map((w, i) => (
                      <li key={i}>{w.word} — {w.translation_zh} / {w.translation_en}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Practice
          task={state.task}
          feedback={state.feedback}
          onSubmit={handleSubmitAnswer}
          disabled={state.isGenerating || state.isRendering}
        />

        <AnkiExport
          ankiUrl={ankiUrl}
          userId={state.userId}
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
