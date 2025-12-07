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

import * as quizClient from "../../../../Quizzes/client";
import * as attemptClient from "../../../../../../../(Kambaz)/QuizAttempts/client";

import { Quiz, Question, QuestionType } from "../../../../Quizzes/client";
import { QuizAttempt } from "../../../../../../../(Kambaz)/QuizAttempts/client";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [quizData, attemptData] = await Promise.all([
          quizClient.findQuizById(quizId),
          attemptClient.findAttemptById(attemptId),
        ]);

        setQuiz(quizData);
        setAttempt(attemptData);
      } catch (err) {
        console.error("Failed to load results data", err);

        let errorMessage = "Failed to load quiz results. Please try again.";

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

  const isAnswerCorrect = (
    question: Question,
    studentAnswer: string
  ): boolean => {
    if (!studentAnswer) return false;

    switch (question.questionType) {
      case QuestionType.TRUE_FALSE:
      case QuestionType.FILL_BLANKS:
        return studentAnswer === question.correctAnswer;

      case QuestionType.MULTIPLE_CHOICE:
        const selectedChoice = question.choices?.find(
          (c) => c._id === studentAnswer
        );

        return selectedChoice ? selectedChoice.isCorrect : false;

      default:
        return false;
    }
  };

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

  return (
    <div id="wd-quiz-results" className="pb-5">
      <Container className="mt-4">
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
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="d-flex align-items-center mb-0">
                    <Badge bg="secondary" className="me-3">
                      Q{index + 1}
                    </Badge>
                    {question.title}
                  </h5>
                  <div className="text-end">
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
                  <p className="mb-3" style={{ whiteSpace: "pre-wrap" }}>
                    {question.description}
                  </p>

                  <div className="mb-3">
                    <strong>Your Answer: </strong>

                    {question.questionType === QuestionType.MULTIPLE_CHOICE ? (
                      <span className="fst-italic">
                        {question.choices?.find((c) => c._id === studentAnswer)
                          ?.text || "No answer selected"}
                      </span>
                    ) : (
                      <span className="fst-italic">
                        {studentAnswer || "No answer provided"}
                      </span>
                    )}
                  </div>

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
