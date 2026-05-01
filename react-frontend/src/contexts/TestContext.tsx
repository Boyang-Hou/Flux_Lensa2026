import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { TestState, TestAnswer, TestResult } from '../types/auth';

type TestAction =
  | { type: 'START_TEST'; payload: number }
  | { type: 'ANSWER_QUESTION'; payload: TestAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_TEST'; payload: number }
  | { type: 'RESET_TEST' };

interface TestQuestion {
  id: string;
  question: string;
  questionType: 'vocabulary' | 'grammar' | 'listening';
  options: string[];
  correctAnswer: string;
  difficulty: 'A1' | 'A2' | 'B1';
  explanation?: string;
}

import { testQuestions } from '../data/testQuestions';

const initialState: TestState = {
  currentQuestionIndex: 0,
  answers: [],
  isSubmitting: false,
  isCompleted: false,
  startTime: Date.now(),
};

function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'START_TEST':
      return { ...initialState, startTime: action.payload };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: [...state.answers, action.payload],
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
    case 'COMPLETE_TEST':
      return {
        ...state,
        isCompleted: true,
        isSubmitting: false,
        endTime: action.payload,
      };
    case 'RESET_TEST':
      return initialState;
    default:
      return state;
  }
}

interface TestContextType extends TestState {
  questions: TestQuestion[];
  currentQuestion: TestQuestion | null;
  progress: number;
  answerQuestion: (answer: string) => void;
  nextQuestion: () => void;
  completeTest: () => TestResult;
  resetTest: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(testReducer, initialState);

  const questions = testQuestions;
  const currentQuestion = questions[state.currentQuestionIndex] || null;
  const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;

  const answerQuestion = (answer: string) => {
    if (!currentQuestion) return;

    const testAnswer: TestAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect: answer === currentQuestion.correctAnswer,
    };

    dispatch({ type: 'ANSWER_QUESTION', payload: testAnswer });
  };

  const nextQuestion = () => {
    if (state.currentQuestionIndex < questions.length - 1) {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const calculateCefrLevel = (score: number): 'A1' | 'A2' | 'B1' => {
    if (score >= 80) return 'B1';
    if (score >= 50) return 'A2';
    return 'A1';
  };

  const generateRecommendations = (result: TestResult): string[] => {
    const recommendations: string[] = [];

    if (result.vocabularyScore < 60) {
      recommendations.push('建议多进行词汇学习，可以通过拍照识别日常物品来扩展词汇量');
    }
    if (result.grammarScore < 60) {
      recommendations.push('建议加强语法练习，关注印尼语的基本句型和语法规则');
    }
    if (result.cefrLevel === 'A1') {
      recommendations.push('建议从基础词汇开始，每天学习 5-10 个新单词');
      recommendations.push('可以尝试使用 Anki 卡片进行间隔重复学习');
    } else if (result.cefrLevel === 'A2') {
      recommendations.push('可以开始尝试简单的印尼语对话练习');
      recommendations.push('建议阅读简单的印尼语文章或故事');
    } else {
      recommendations.push('可以尝试更复杂的印尼语对话和阅读材料');
      recommendations.push('建议关注印尼语的高级语法和表达方式');
    }

    return recommendations;
  };

  const completeTest = (): TestResult => {
    const endTime = Date.now();
    dispatch({ type: 'COMPLETE_TEST', payload: endTime });

    const correctAnswers = state.answers.filter(a => a.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const vocabularyQuestions = questions.filter(q => q.questionType === 'vocabulary');
    const grammarQuestions = questions.filter(q => q.questionType === 'grammar');

    const vocabularyCorrect = state.answers.filter(
      a => a.isCorrect && vocabularyQuestions.some(q => q.id === a.questionId)
    ).length;
    const grammarCorrect = state.answers.filter(
      a => a.isCorrect && grammarQuestions.some(q => q.id === a.questionId)
    ).length;

    const vocabularyScore = vocabularyQuestions.length > 0
      ? Math.round((vocabularyCorrect / vocabularyQuestions.length) * 100)
      : 0;
    const grammarScore = grammarQuestions.length > 0
      ? Math.round((grammarCorrect / grammarQuestions.length) * 100)
      : 0;

    const cefrLevel = calculateCefrLevel(score);

    const result: TestResult = {
      totalQuestions,
      correctAnswers,
      score,
      cefrLevel,
      vocabularyScore,
      grammarScore,
      recommendations: [],
      completedAt: new Date().toISOString(),
    };

    result.recommendations = generateRecommendations(result);

    return result;
  };

  const resetTest = () => {
    dispatch({ type: 'RESET_TEST' });
  };

  return (
    <TestContext.Provider
      value={{
        ...state,
        questions,
        currentQuestion,
        progress,
        answerQuestion,
        nextQuestion,
        completeTest,
        resetTest,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
}
