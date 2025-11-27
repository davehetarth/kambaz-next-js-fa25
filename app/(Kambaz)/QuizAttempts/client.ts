import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const QUIZ_ATTEMPTS_API = `${HTTP_SERVER}/api/quizzes`;

// Interface matching the Mongoose schema for an Attempt
export interface QuizAttempt {
  _id: string;
  quiz: string; // Quiz ID
  user: string; // User ID
  answers: Record<string, any>; // Map of QuestionId -> Answer
  score: number;
  maxPoints: number;
  attemptDate: string;
}

// Fetch a specific attempt by ID
export const findAttemptById = async (
  attemptId: string
): Promise<QuizAttempt> => {
  const response = await axios.get(
    `${QUIZ_ATTEMPTS_API}/attempts/${attemptId}`
  );
  return response.data;
};

// Fetch all attempts for a user on a specific quiz
export const findAttemptsForUser = async (
  quizId: string,
  userId: string
): Promise<QuizAttempt[]> => {
  const response = await axios.get(
    `${QUIZ_ATTEMPTS_API}/${quizId}/users/${userId}/attempts`
  );
  return response.data;
};
