export enum ViewState {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY'
}

export enum ProgrammingLanguage {
  PYTHON = 'Python',
  JAVASCRIPT = 'JavaScript',
  TYPESCRIPT = 'TypeScript',
  JAVA = 'Java',
  CPP = 'C++',
  CSHARP = 'C#',
  RUST = 'Rust',
  GO = 'Go',
  PHP = 'PHP',
  RUBY = 'Ruby',
  SWIFT = 'Swift',
  KOTLIN = 'Kotlin',
  OTHER = 'Other'
}

export enum ReviewType {
  FULL_REVIEW = 'Full Review',
  BUG_DETECTION = 'Bug Detection',
  PERFORMANCE = 'Performance Optimization',
  SECURITY = 'Security Check',
  BEST_PRACTICES = 'Best Practices'
}

export enum ExplanationLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface User {
  username: string;
}

export interface ReviewRecord {
  id: string;
  timestamp: number;
  code: string;
  language: ProgrammingLanguage;
  reviewType: ReviewType;
  explanationLevel: ExplanationLevel;
  result: string;
}