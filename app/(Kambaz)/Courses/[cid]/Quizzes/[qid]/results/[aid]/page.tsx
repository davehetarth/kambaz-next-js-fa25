"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Card,
  ListGroup,
  Badge,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
// Import both clients
import * as quizClient from "../../../../Quizzes/client";
import * as attemptClient from "../../../../../../../(Kambaz)/QuizAttempts/client";
// Import interfaces
import { Quiz, Question, QuestionType } from "../../../../Quizzes/client";
import { QuizAttempt } from "../../../../../../../(Kambaz)/QuizAttempts/client";
// Import Icons for feedback
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function QuizResultsPage() {
  const params = useParams();
  const courseId = params.cid as string;
  const quizId = params.qid as string;
  const attemptId = params.aid as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch both Quiz and Attempt data in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Run both fetches simultaneously for speed
        const [quizData, attemptData] = await Promise.all([
          quizClient.findQuizById(quizId),
          attemptClient.findAttemptById(attemptId),
        ]);

        setQuiz(quizData);
        setAttempt(attemptData);
      } catch (err) {
        // Remove explicit type annotation to let TS infer.
        // We cast inside the block to handle the 'unknown' nature of errors in strict mode.
        console.error("Failed to load results data", err);

        let errorMessage = "Failed to load quiz results. Please try again.";
        // Type assertion to access potential Axios error property safely
        const errorWithResponse = err as { response?: { data?: string } };
        if (errorWithResponse?.response?.data) {
          errorMessage = errorWithResponse.response.data;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (quizId && attemptId) {
      fetchData();
    }
  }, [quizId, attemptId]);

  // --- HELPER: Determine if the student's answer for a question was correct ---
  const isAnswerCorrect = (
    question: Question,
    studentAnswer: string
  ): boolean => {
    if (!studentAnswer) return false;

    switch (question.questionType) {
      case QuestionType.TRUE_FALSE:
      case QuestionType.FILL_BLANKS:
        // Simple string comparison against the quiz's stored correct answer
        return studentAnswer === question.correctAnswer;

      case QuestionType.MULTIPLE_CHOICE:
        // studentAnswer is a Choice ID. Find that choice object.
        const selectedChoice = question.choices?.find(
          (c) => c._id === studentAnswer
        );
        // Check if that choice is marked as correct
        return selectedChoice ? selectedChoice.isCorrect : false;

      default:
        return false;
    }
  };

  // --- RENDER LOADING/ERROR STATES ---
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }
  if (error || !quiz || !attempt) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error || "Data not found."}</Alert>
        <Link
          href={`/Courses/${courseId}/Quizzes/${quizId}`}
          className="btn btn-secondary"
        >
          Go Back
        </Link>
      </Container>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div id="wd-quiz-results" className="pb-5">
      <Container className="mt-4">
        {/* Header Summary Card */}
        <Card className="mb-4 shadow-sm">
          <Card.Body className="p-4">
            <h2 className="mb-3">{quiz.title} - Results</h2>
            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded fs-5">
              <div>
                <span className="text-muted me-2">Submitted:</span>
                <strong>
                  {new Date(attempt.attemptDate).toLocaleString()}
                </strong>
              </div>
              <div className="d-flex align-items-center">
                <span className="text-muted me-3">Final Score:</span>
                <Badge
                  bg={
                    attempt.score / attempt.maxPoints >= 0.7
                      ? "success"
                      : "danger"
                  }
                  className="fs-4"
                >
                  {attempt.score} / {attempt.maxPoints} Points
                </Badge>
              </div>
            </div>
          </Card.Body>
        </Card>

        <h4 className="mb-3">Question Breakdown</h4>
        <ListGroup>
          {quiz.questions.map((question, index) => {
            // Get the student's specific answer for this question ID from the attempt map
            const studentAnswer = attempt.answers[question._id];
            const correct = isAnswerCorrect(question, studentAnswer);

            return (
              <ListGroup.Item
                key={question._id}
                className={`p-4 mb-3 rounded border ${
                  correct
                    ? "border-success bg-success-subtle"
                    : "border-danger bg-danger-subtle"
                }`}
              >
                {/* Question Header: Title and Points */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="d-flex align-items-center mb-0">
                    <Badge bg="secondary" className="me-3">
                      Q{index + 1}
                    </Badge>
                    {question.title}
                  </h5>
                  <div className="text-end">
                    {/* Visual Feedback Icon */}
                    {correct ? (
                      <span className="text-success d-flex align-items-center fw-bold">
                        <FaCheckCircle className="me-2 fs-4" /> Correct
                      </span>
                    ) : (
                      <span className="text-danger d-flex align-items-center fw-bold">
                        <FaTimesCircle className="me-2 fs-4" /> Incorrect
                      </span>
                    )}
                    <small className="text-muted d-block mt-1">
                      {correct ? question.points : 0} / {question.points} pts
                    </small>
                  </div>
                </div>

                <div className="ms-5 ps-2">
                  {/* Question Text */}
                  <p className="mb-3" style={{ whiteSpace: "pre-wrap" }}>
                    {question.description}
                  </p>

                  {/* --- DISPLAY STUDENT ANSWER --- */}
                  <div className="mb-3">
                    <strong>Your Answer: </strong>
                    {/* Logic to display the human-readable answer based on type */}
                    {question.questionType === QuestionType.MULTIPLE_CHOICE ? (
                      // Find the text associated with the selected choice ID
                      <span className="fst-italic">
                        {question.choices?.find((c) => c._id === studentAnswer)
                          ?.text || "No answer selected"}
                      </span>
                    ) : (
                      // Display string value directly for T/F or Fill Blanks
                      <span className="fst-italic">
                        {studentAnswer || "No answer provided"}
                      </span>
                    )}
                  </div>

                  {/* --- DISPLAY CORRECT ANSWER (If incorrect) --- */}
                  {!correct && quiz.showCorrectAnswers && (
                    <div className="p-3 bg-white rounded border border-success text-success">
                      <strong>Correct Answer: </strong>
                      {question.questionType ===
                      QuestionType.MULTIPLE_CHOICE ? (
                        <span>
                          {question.choices?.find((c) => c.isCorrect)?.text}
                        </span>
                      ) : (
                        <span>{question.correctAnswer}</span>
                      )}
                    </div>
                  )}
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>

        <div className="mt-4">
          <Link
            href={`/Courses/${courseId}/Quizzes/${quizId}`}
            className="btn btn-outline-secondary"
          >
            <FaArrowLeft className="me-2" /> Back to Quiz Details
          </Link>
        </div>
      </Container>
    </div>
  );
}
