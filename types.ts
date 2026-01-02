
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  description: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  selectedOption: number | null;
  showExplanation: boolean;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ'
}
