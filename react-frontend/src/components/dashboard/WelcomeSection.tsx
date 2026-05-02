import { useSettings } from '../../contexts/SettingsContext';
import type { AppLanguage } from '../../contexts/SettingsContext';
import { useResponsive } from '../../hooks/useResponsive';

export default function WelcomeSection() {
  const { isMobile } = useResponsive();
  const { language, setLanguage, languages, formatTime, t } = useSettings();

  return (
    <section className="welcome-section">
      <div className="welcome-header">
        <div className="welcome-text">
          <span className="eyebrow">{t.welcome.eyebrow}</span>
          <h1 className="welcome-title">{t.welcome.title}</h1>
          <p className="welcome-subtitle">{t.welcome.subtitle}</p>
        </div>

        {!isMobile && (
          <div className="welcome-actions">
            <div className="time-display" aria-label={t.common.currentTime}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{formatTime()}</span>
            </div>

            <select
              className="language-selector"
              value={language}
              onChange={(event) => setLanguage(event.target.value as AppLanguage)}
              aria-label={t.common.language}
            >
              {Object.entries(languages).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>

            <div className="user-avatar">N</div>
          </div>
        )}
      </div>

      <div className="hero-metrics" aria-label={t.welcome.overview}>
        <div className="hero-metric">
          <strong>24 min</strong>
          <span>{t.welcome.immersion}</span>
        </div>
        <div className="hero-metric">
          <strong>128</strong>
          <span>{t.welcome.words}</span>
        </div>
        <div className="hero-metric">
          <strong>87%</strong>
          <span>{t.welcome.accuracy}</span>
        </div>
      </div>
    </section>
  );
}
