import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

// --- TypeScript Interfaces (Matching Mongoose Schema) ---

export enum QuizType {
  GRADED_QUIZ = "GRADED_QUIZ",
  PRACTICE_QUIZ = "PRACTICE_QUIZ",
  GRADED_SURVEY = "GRADED_SURVEY",
  UNGRADED_SURVEY = "UNGRADED_SURVEY",
}

export enum AssignmentGroup {
  QUIZZES = "QUIZZES",
  EXAMS = "EXAMS",
  ASSIGNMENTS = "ASSIGNMENTS",
  PROJECT = "PROJECT",
}

export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE",
  FILL_BLANKS = "FILL_BLANKS",
}

export interface Choice {
  _id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  title: string;
  points: number;
  questionType: QuestionType;
  description?: string;
  choices?: Choice[]; // For MC
  correctAnswer?: string; // For T/F or Blanks
}

export interface Quiz {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points: number;
  // Using string for dates in frontend state to handle input fields easily
  due: string;
  availableFromDate: string;
  numberOfAttempts: number;
  availableUntilDate: string;
  published: boolean;
  questions: Question[];
  quizType: QuizType;
  assignmentGroup: AssignmentGroup;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: boolean;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
}
export interface QuizAttemptSubmission {
  userId: string;
  answers: Record<string, string>;
}
// --- Axios API Calls ---

export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const createQuiz = async (courseId: string, quiz: Quiz) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const updateQuiz = async (quiz: Quiz) => {
  const response = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return response.data;
};

export const submitQuizAttempt = async (
  quizId: string,
  submission: QuizAttemptSubmission
) => {
  const response = await axios.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    submission
  );
  return response.data;
};
