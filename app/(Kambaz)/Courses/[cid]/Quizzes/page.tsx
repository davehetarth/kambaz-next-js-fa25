"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { setQuizzes, deleteQuiz } from "./reducer";
import * as client from "./client";
import { ListGroup, Button, Badge } from "react-bootstrap";
import {
  FaPlus,
  FaTrash,
  FaPencilAlt,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import Link from "next/link";

export default function Quizzes() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const courseId = cid as string;

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const canEdit = currentUser?.role === "FACULTY";

  const fetchQuizzes = async () => {
    if (!courseId) return;
    try {
      const quizzes = await client.findQuizzesForCourse(courseId);
      dispatch(setQuizzes(quizzes));
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await client.deleteQuiz(quizId);
        dispatch(deleteQuiz(quizId));
      } catch (err) {
        console.error("Error deleting quiz:", err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const dateA = new Date(a.availableFromDate);
    const dateB = new Date(b.availableFromDate);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div id="wd-quizzes">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quizzes</h2>
        {canEdit && (
          <Button
            variant="danger"
            size="lg"
            onClick={() => router.push(`/Courses/${courseId}/Quizzes/new`)}
          >
            <FaPlus className="me-2" /> Quiz
          </Button>
        )}
      </div>
      <hr />

      <ListGroup>
        {sortedQuizzes.length === 0 && (
          <ListGroup.Item>No quizzes found.</ListGroup.Item>
        )}
        {sortedQuizzes.map((quiz) => (
          <ListGroup.Item
            key={quiz._id}
            className="d-flex justify-content-between align-items-center p-3"
          >
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-1">
                <Link
                  href={`/Courses/${courseId}/Quizzes/${quiz._id}`}
                  className="fw-bold text-dark text-decoration-none fs-5"
                >
                  {quiz.title}
                </Link>
              </div>

              <div className="text-muted small">
                {quiz.published ? (
                  <Badge bg="success" className="me-2">
                    <FaCheckCircle className="me-1" /> Published
                  </Badge>
                ) : (
                  <Badge bg="secondary" className="me-2">
                    <FaBan className="me-1" /> Unpublished
                  </Badge>
                )}

                <span className="ms-2">
                  <b>Due:</b> {formatDate(quiz.due)} |
                  <b className="ms-2">Available:</b>{" "}
                  {formatDate(quiz.availableFromDate)} -{" "}
                  {formatDate(quiz.availableUntilDate)} |
                  <b className="ms-2">{quiz.points} pts</b> |
                  <b className="ms-2">{quiz.questions.length} Questions</b>
                </span>
              </div>
            </div>

            {canEdit && (
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  <FaTrash />
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() =>
                    router.push(`/Courses/${courseId}/Quizzes/${quiz._id}`)
                  }
                >
                  <FaPencilAlt />
                </Button>
              </div>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
