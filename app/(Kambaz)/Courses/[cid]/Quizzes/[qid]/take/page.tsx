"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import * as client from "../../client";
import { Quiz, Question } from "../../client";
import {
  Button,
  Card,
  ProgressBar,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import QuestionTaker from "./QuestionTaker";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";

export default function TakeQuizPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const courseId = cid as string;
  const quizId = qid as string;

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  // State to hold the fetched quiz data
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // State to track which question index is currently active (starts at 0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Placeholder state for storing student answers (will be used in Phase 6c/6d)
  // Mapping question ID string -> answer value (string or string[] for MC multiple select)
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // 1. Fetch Quiz Data on Load
  useEffect(() => {
    const init = async () => {
      try {
        const fetchedQuiz = await client.findQuizById(quizId);
        setQuiz(fetchedQuiz);
      } catch (err) {
        console.error("Failed to load quiz", err);
        alert("Error loading quiz. Please try again.");
        router.push(`/Courses/${courseId}/Quizzes/${quizId}`);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [quizId, courseId, router]);

  // Navigation Handlers
  const handleNext = () => {
    if (!quiz || !quiz.questions) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo(0, 0); // Scroll to top on slide change
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit Handler
  const handleSubmitQuiz = async () => {
    if (!currentUser?._id) {
      alert("Error: User not identified. Cannot submit.");
      return;
    }

    const confirm = window.confirm(
      "Are you ready to submit your quiz? You will not be able to change your answers."
    );

    if (confirm) {
      try {
        setSubmitting(true); // Show loading state

        // Call the backend API
        const result = await client.submitQuizAttempt(quizId, {
          userId: currentUser._id,
          answers: answers,
        });

        console.log("Submission successful:", result);
        alert(
          `Quiz submitted successfully! Your score: ${result.score}/${result.maxPoints}`
        );

        // Redirect back to the quiz details page
        router.push(`/Courses/${courseId}/Quizzes/${quizId}`);
      } catch (error) {
        console.error("Error submitting quiz:", error);
        alert(
          "Failed to submit quiz. Please try again or contact your instructor."
        );
        setSubmitting(false);
      }
    }
  };

  // HANDLER to update answers state
  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer, // Update the answer for this specific question ID
    }));
  };

  // Loading State
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // Submitting spinner state
  if (submitting) {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner
          animation="border"
          variant="success"
          role="status"
          className="mb-3"
        />
        <h4>Submitting your answers, please wait...</h4>
      </Container>
    );
  }

  // Error state if quiz didn't load
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">
          Quiz data not found or has no questions.
          <Link
            href={`/Courses/${courseId}/Quizzes/${quizId}`}
            className="ms-3"
          >
            Go Back
          </Link>
        </div>
      </Container>
    );
  }

  // Determine current question object based on index
  const currentQuestion: Question = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  // Calculate progress percentage for the bar
  const progressPercentage =
    ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div id="wd-take-quiz" className="pb-5 bg-light min-vh-100">
      {/* Header / Sticky Top Bar */}
      <div className="sticky-top bg-white shadow-sm p-3 mb-4">
        <Container className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1 text-truncate" style={{ maxWidth: "500px" }}>
              {quiz.title}
            </h4>
            {/* Timer placeholder */}
            {quiz.timeLimit > 0 && (
              <span className="text-muted small">
                Time Remaining: [Timer placeholder]
              </span>
            )}
          </div>
          <div className="text-end">
            {/* Progress Text */}
            <span className="fw-bold text-primary">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>
        </Container>
        {/* Progress Bar */}
        <ProgressBar
          now={progressPercentage}
          variant="primary"
          style={{ height: "5px", marginTop: "15px" }}
          animated={false}
        />
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col md={9} lg={8}>
            {/* Main Question Card */}
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="bg-white pt-3 pb-2 border-bottom-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Question {currentQuestionIndex + 1}</h5>
                  <span className="badge bg-secondary font-monospace">
                    {currentQuestion.points} pts
                  </span>
                </div>
              </Card.Header>
              <Card.Body className="px-4 py-4">
                <QuestionTaker
                  question={currentQuestion}
                  // Pass the current answer if it exists in the state object
                  answer={answers[currentQuestion._id] || null}
                  // Pass the handler, currying it with the current question ID
                  onAnswerChange={(answer) =>
                    handleAnswerChange(currentQuestion._id, answer)
                  }
                />
                {/* PLACEHOLDER DIV REMOVED FROM HERE */}
              </Card.Body>
            </Card>

            {/* Navigation Buttons Footer */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className="px-4"
              >
                <FaChevronLeft className="me-2" /> Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleSubmitQuiz}
                  className="px-5 fw-bold"
                >
                  <FaCheckCircle className="me-2" /> Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleNext}
                  className="px-4"
                >
                  Next <FaChevronRight className="ms-2" />
                </Button>
              )}
            </div>
          </Col>
          {/* Optional Sidebar for question navigator (future enhancement) */}
          {/* <Col md={3} lg={4} className="d-none d-md-block"> ...Sidebar... </Col> */}
        </Row>
      </Container>
    </div>
  );
}
