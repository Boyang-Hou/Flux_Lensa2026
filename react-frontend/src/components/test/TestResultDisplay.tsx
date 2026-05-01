import type { TestResult } from '../../types/auth';
import '../../styles/test.css';

interface TestResultDisplayProps {
  result: TestResult;
  onComplete: () => void;
}

export default function TestResultDisplay({ result, onComplete }: TestResultDisplayProps) {
  const getLevelDescription = (level: string): string => {
    switch (level) {
      case 'A1':
        return '入门级 - 能够理解和使用日常用语和非常基本的句子';
      case 'A2':
        return '初级 - 能够进行简单的日常交流，描述身边的事物';
      case 'B1':
        return '中级 - 能够理解熟悉的话题，描述经历和事件';
      default:
        return '';
    }
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'A1':
        return '#4CAF50';
      case 'A2':
        return '#2196F3';
      case 'B1':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div className="test-result-container">
      <div className="result-header">
        <div className="result-icon">🎉</div>
        <h1 className="result-title">测试完成！</h1>
        <p className="result-subtitle">您的印尼语水平评估结果</p>
      </div>

      <div className="result-level-card" style={{ borderColor: getLevelColor(result.cefrLevel) }}>
        <div className="level-badge" style={{ backgroundColor: getLevelColor(result.cefrLevel) }}>
          {result.cefrLevel}
        </div>
        <h2 className="level-title">CEFR {result.cefrLevel} 水平</h2>
        <p className="level-description">{getLevelDescription(result.cefrLevel)}</p>
      </div>

      <div className="result-scores">
        <div className="score-card">
          <div className="score-circle">
            <svg viewBox="0 0 100 100">
              <circle
                className="score-bg"
                cx="50"
                cy="50"
                r="45"
              />
              <circle
                className="score-fill"
                cx="50"
                cy="50"
                r="45"
                strokeDasharray={`${result.score * 2.83} ${283 - result.score * 2.83}`}
                style={{ stroke: getLevelColor(result.cefrLevel) }}
              />
            </svg>
            <div className="score-value">{result.score}</div>
          </div>
          <p className="score-label">总分</p>
        </div>

        <div className="score-card">
          <div className="score-circle">
            <svg viewBox="0 0 100 100">
              <circle className="score-bg" cx="50" cy="50" r="45" />
              <circle
                className="score-fill"
                cx="50"
                cy="50"
                r="45"
                strokeDasharray={`${result.vocabularyScore * 2.83} ${283 - result.vocabularyScore * 2.83}`}
                style={{ stroke: '#4CAF50' }}
              />
            </svg>
            <div className="score-value">{result.vocabularyScore}</div>
          </div>
          <p className="score-label">词汇</p>
        </div>

        <div className="score-card">
          <div className="score-circle">
            <svg viewBox="0 0 100 100">
              <circle className="score-bg" cx="50" cy="50" r="45" />
              <circle
                className="score-fill"
                cx="50"
                cy="50"
                r="45"
                strokeDasharray={`${result.grammarScore * 2.83} ${283 - result.grammarScore * 2.83}`}
                style={{ stroke: '#2196F3' }}
              />
            </svg>
            <div className="score-value">{result.grammarScore}</div>
          </div>
          <p className="score-label">语法</p>
        </div>
      </div>

      <div className="result-details">
        <div className="detail-item">
          <span className="detail-label">题目总数</span>
          <span className="detail-value">{result.totalQuestions}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">正确题数</span>
          <span className="detail-value">{result.correctAnswers}</span>
        </div>
      </div>

      {result.recommendations.length > 0 && (
        <div className="recommendations">
          <h3 className="recommendations-title">学习建议</h3>
          <ul className="recommendations-list">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="recommendation-item">
                <span className="recommendation-icon">💡</span>
                <span className="recommendation-text">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="complete-btn" onClick={onComplete}>
        开始学习
      </button>
    </div>
  );
}
