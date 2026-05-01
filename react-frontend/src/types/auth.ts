export interface User {
  id: string;
  email: string;
  name: string;
  cefrLevel?: 'A1' | 'A2' | 'B1' | null;
  hasCompletedTest: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

export interface TestQuestion {
  id: string;
  question: string;
  questionType: 'vocabulary' | 'grammar' | 'listening';
  options: string[];
  correctAnswer: string;
  difficulty: 'A1' | 'A2' | 'B1';
  explanation?: string;
}

export interface TestAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface TestState {
  currentQuestionIndex: number;
  answers: TestAnswer[];
  isSubmitting: boolean;
  isCompleted: boolean;
  startTime: number;
  endTime?: number;
}

export interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  cefrLevel: 'A1' | 'A2' | 'B1';
  vocabularyScore: number;
  grammarScore: number;
  recommendations: string[];
  completedAt: string;
}

export type TestAction =
  | { type: 'START_TEST'; payload: number }
  | { type: 'ANSWER_QUESTION'; payload: TestAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_TEST'; payload: number }
  | { type: 'RESET_TEST' };
