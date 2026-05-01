import { useState, useEffect } from 'react';
import { useTest } from '../../contexts/TestContext';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserLevel } from '../../services/authApi';
import TestResultDisplay from './TestResultDisplay';
import type { TestResult } from '../../types/auth';
import '../../styles/test.css';

interface LevelTestProps {
  onComplete: () => void;
}

export default function LevelTest({ onComplete }: LevelTestProps) {
  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    progress,
    answerQuestion,
    nextQuestion,
    completeTest,
    answers,
  } = useTest();

  const { user, updateUser } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setSelectedAnswer('');
    setShowExplanation(false);
  }, [currentQuestionIndex]);

  const handleSelectAnswer = (answer: string) => {
    if (!showExplanation) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    answerQuestion(selectedAnswer);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    } else {
      handleCompleteTest();
    }
  };

  const handleCompleteTest = async () => {
    setIsSubmitting(true);
    try {
      const result = completeTest();
      setTestResult(result);

      if (user) {
        await updateUserLevel(user.id, result.cefrLevel);
        updateUser({
          ...user,
          cefrLevel: result.cefrLevel,
          hasCompletedTest: true,
        });
      }
    } catch (error) {
      console.error('Failed to complete test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (testResult) {
    return (
      <TestResultDisplay
        result={testResult}
        onComplete={onComplete}
      />
    );
  }

  if (!currentQuestion) {
    return <div className="test-loading">加载中...</div>;
  }

  const currentAnswer = answers[currentQuestionIndex];
  const isAnswered = currentAnswer !== undefined;
  const isCorrect = currentAnswer?.isCorrect;

  return (
    <div className="test-container">
      <div className="test-header">
        <h1 className="test-title">印尼语水平测试</h1>
        <p className="test-subtitle">请完成以下测试，以便我们为您推荐合适的学习内容</p>
      </div>

      <div className="test-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">
          {currentQuestionIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="test-question-card">
        <div className="question-header">
          <span className={`question-type ${currentQuestion.questionType}`}>
            {currentQuestion.questionType === 'vocabulary' ? '词汇' : '语法'}
          </span>
          <span className={`question-difficulty ${currentQuestion.difficulty}`}>
            {currentQuestion.difficulty}
          </span>
        </div>

        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="options-list">
          {currentQuestion.options.map((option, index) => {
            let optionClass = 'option-item';
            if (isAnswered) {
              if (option === currentQuestion.correctAnswer) {
                optionClass += ' correct';
              } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                optionClass += ' incorrect';
              }
            } else if (option === selectedAnswer) {
              optionClass += ' selected';
            }

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && currentQuestion.explanation && (
          <div className={`explanation ${isCorrect ? 'correct' : 'incorrect'}`}>
            <p className="explanation-title">
              {isCorrect ? '✅ 回答正确！' : '❌ 回答错误'}
            </p>
            <p className="explanation-text">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <div className="test-actions">
        {!isAnswered ? (
          <button
            className="submit-btn"
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer || isSubmitting}
          >
            提交答案
          </button>
        ) : (
          <button
            className="next-btn"
            onClick={handleNextQuestion}
            disabled={isSubmitting}
          >
            {currentQuestionIndex < questions.length - 1 ? '下一题' : '完成测试'}
          </button>
        )}
      </div>
    </div>
  );
}
