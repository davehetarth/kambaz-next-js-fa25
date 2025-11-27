import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Quiz,
  QuestionType,
  Question,
  QuizType,
  AssignmentGroup,
} from "./client";

export const emptyQuestion: Question = {
  _id: "new", // Temp ID for frontend
  title: "New Question",
  points: 1,
  questionType: QuestionType.MULTIPLE_CHOICE, // Default type
  description: "",
  choices: [],
  correctAnswer: "",
};
// Define initial state for a brand new quiz
const emptyQuiz: Quiz = {
  _id: "new",
  title: "New Quiz",
  course: "", // Will be set by component
  description: "",
  points: 0,
  // Default dates (adjust as needed)
  numberOfAttempts: 1,
  due: new Date().toISOString().split("T")[0],
  availableFromDate: new Date().toISOString().split("T")[0],
  availableUntilDate: new Date().toISOString().split("T")[0],
  published: false,
  questions: [],
  quizType: QuizType.GRADED_QUIZ,
  assignmentGroup: AssignmentGroup.QUIZZES,
  shuffleAnswers: true,
  timeLimit: 20,
  multipleAttempts: false,
  howManyAttempts: 1,
  showCorrectAnswers: true,
  accessCode: "",
  oneQuestionAtATime: true,
  webcamRequired: false,
  lockQuestionsAfterAnswering: false,
};

interface QuizzesState {
  quizzes: Quiz[];
  quiz: Quiz; // The quiz currently being viewed/edited
}

const initialState: QuizzesState = {
  quizzes: [],
  quiz: emptyQuiz,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes = [action.payload, ...state.quizzes];
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
    },
    updateQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes = state.quizzes.map((q) =>
        q._id === action.payload._id ? action.payload : q
      );
    },
    // Used when preparing the editor with a specific quiz
    setQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quiz = action.payload;
    },
    // Used when preparing the editor for a new quiz
    resetQuiz: (state) => {
      state.quiz = emptyQuiz;
    },
    addQuestionToQuiz: (state) => {
      // Create a unique temporary ID so React keys don't clash before saving to DB
      const tempId = `new-${Date.now()}`;
      state.quiz.questions.push({ ...emptyQuestion, _id: tempId });
    },

    // Updates an existing question in the current quiz state
    updateQuestionInQuiz: (state, action: PayloadAction<Question>) => {
      const index = state.quiz.questions.findIndex(
        (q) => q._id === action.payload._id
      );
      if (index !== -1) {
        state.quiz.questions[index] = action.payload;
      }
    },

    // Removes a question from the current quiz state
    deleteQuestionFromQuiz: (state, action: PayloadAction<string>) => {
      state.quiz.questions = state.quiz.questions.filter(
        (q) => q._id !== action.payload
      );
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  setQuiz,
  resetQuiz,
  addQuestionToQuiz,
  updateQuestionInQuiz,
  deleteQuestionFromQuiz,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
