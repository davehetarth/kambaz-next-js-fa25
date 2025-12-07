"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import {
  setQuiz,
  resetQuiz,
  updateQuiz as updateQuizAction,
  addQuiz,
  addQuestionToQuiz,
  deleteQuestionFromQuiz,
} from "../reducer";
import * as quizClient from "../client";
import * as attemptClient from "../../../../QuizAttempts/client";
import { QuizType, AssignmentGroup } from "../client";
import { QuizAttempt } from "../../../../QuizAttempts/client";
import {
  Form,
  Button,
  Tabs,
  Tab,
  Row,
  Col,
  InputGroup,
  ListGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaPencilAlt,
  FaGripVertical,
  FaExternalLinkAlt,
} from "react-icons/fa";
import QuestionEditorModal from "./QuestionEditor";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const courseId = cid as string;
  const quizId = qid as string;
  const isNew = quizId === "new";

  const { quiz } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const canEdit = currentUser?.role === "FACULTY";
  const [key, setKey] = useState("details");

  const [showQModal, setShowQModal] = useState(false);
  const [editingQId, setEditingQId] = useState<string | null>(null);

  const [studentAttempts, setStudentAttempts] = useState<QuizAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  useEffect(() => {
    const fetchOrResetQuiz = async () => {
      if (isNew) {
        dispatch(resetQuiz());
      } else {
        try {
          const fetchedQuiz = await quizClient.findQuizById(quizId);
          dispatch(setQuiz(fetchedQuiz));
        } catch (err) {
          console.error("Failed to fetch quiz found", err);
        }
      }
    };
    fetchOrResetQuiz();
  }, [quizId, dispatch, isNew]);

  useEffect(() => {
    const fetchAttempts = async () => {
      if (currentUser && !canEdit && !isNew && quizId) {
        setLoadingAttempts(true);
        try {
          const attempts = await attemptClient.findAttemptsForUser(
            quizId,
            currentUser._id
          );
          setStudentAttempts(attempts);
        } catch (err) {
          console.error("Failed to fetch student attempts", err);
        } finally {
          setLoadingAttempts(false);
        }
      }
    };
    fetchAttempts();
  }, [currentUser, canEdit, isNew, quizId]);

  const handleSave = async () => {
    if (!canEdit) return;

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const quizToSave = { ...quiz, course: courseId, points: totalPoints };

    try {
      if (isNew) {
        const newQuiz = await quizClient.createQuiz(courseId, quizToSave);
        dispatch(addQuiz(newQuiz));
      } else {
        await quizClient.updateQuiz(quizToSave);
        dispatch(updateQuizAction(quizToSave));
      }
      router.push(`/Courses/${courseId}/Quizzes`);
    } catch (err) {
      console.error("Error saving quiz:", err);
      alert("Failed to save quiz. Check console for details.");
    }
  };

  const formatDateForInput = (dateString: string) =>
    dateString ? dateString.split("T")[0] : "";

  const handleAddQuestion = () => {
    dispatch(addQuestionToQuiz());
  };

  const handleDeleteQuestion = (qId: string) => {
    if (window.confirm("Delete this question?")) {
      dispatch(deleteQuestionFromQuiz(qId));
    }
  };

  const handleEditQuestion = (qId: string) => {
    setEditingQId(qId);
    setShowQModal(true);
  };

  if (!canEdit && !isNew) {
    const formatDisplayDate = (dateString: string) => {
      if (!dateString) return "Not set";
      try {
        return new Date(dateString).toLocaleString();
      } catch (e) {
        return dateString;
      }
    };

    if (loadingAttempts) {
      return (
        <div className="p-5 text-center">
          <Spinner animation="border" /> Loading quiz details...
        </div>
      );
    }

    const attemptsTaken = studentAttempts.length;

    const attemptsAllowed = !quiz.multipleAttempts ? 1 : quiz.howManyAttempts;
    const hasAttemptsRemaining = attemptsTaken < attemptsAllowed;
    const latestAttempt =
      studentAttempts.length > 0 ? studentAttempts[0] : null;

    return (
      <div id="wd-quiz-details-student" className="container mt-4">
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="mb-0">{quiz.title}</h2>

          {latestAttempt && (
            <Badge
              bg={
                latestAttempt.score / latestAttempt.maxPoints >= 0.7
                  ? "success"
                  : "secondary"
              }
              className="fs-5"
            >
              Latest Score: {latestAttempt.score} / {latestAttempt.maxPoints}
            </Badge>
          )}
        </div>
        <hr />

        {quiz.description && (
          <div className="mb-4 p-3 bg-light rounded border">
            <h5>Instructions</h5>
            <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {quiz.description}
            </p>
          </div>
        )}

        <Row className="justify-content-center font-monospace">
          <Col md={8}>
            <div className="border rounded p-4 mb-4 bg-white shadow-sm">
              <h4 className="border-bottom pb-2 mb-3">Quiz Details</h4>
              <Row className="mb-2">
                <Col xs={6} className="text-muted text-end fw-bold">
                  Quiz Type
                </Col>
                <Col xs={6}>{quiz.quizType.replace("_", " ")}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={6} className="text-muted text-end fw-bold">
                  Points
                </Col>
                <Col xs={6}>{quiz.points}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={6} className="text-muted text-end fw-bold">
                  Assignment Group
                </Col>
                <Col xs={6}>{quiz.assignmentGroup}</Col>
              </Row>
              <hr
                className="my-2 text-muted"
                style={{ width: "50%", margin: "auto" }}
              />
              <Row className="mb-2">
                <Col xs={6} className="text-muted text-end fw-bold">
                  Time Limit
                </Col>
                <Col xs={6}>
                  {quiz.timeLimit > 0 ? `${quiz.timeLimit} Minutes` : "None"}
                </Col>
              </Row>

              <Row className="mb-2">
                <Col xs={6} className="text-muted text-end fw-bold">
                  Attempts
                </Col>
                <Col xs={6}>
                  <span
                    className={
                      hasAttemptsRemaining
                        ? "text-success"
                        : "text-danger fw-bold"
                    }
                  >
                    {attemptsTaken}
                  </span>
                  {" / "}
                  {quiz.multipleAttempts ? quiz.howManyAttempts : "1"}
                </Col>
              </Row>

              <hr
                className="my-2 text-muted"
                style={{ width: "50%", margin: "auto" }}
              />
              <Row className="mb-2">
                <Col xs={6} className="text-muted text-end fw-bold">
                  Due
                </Col>
                <Col xs={6}>{formatDisplayDate(quiz.due)}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={6} className="text-muted text-end fw-bold">
                  Available From
                </Col>
                <Col xs={6}>{formatDisplayDate(quiz.availableFromDate)}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={6} className="text-muted text-end fw-bold">
                  Until
                </Col>
                <Col xs={6}>{formatDisplayDate(quiz.availableUntilDate)}</Col>
              </Row>
            </div>

            <div className="text-center d-flex justify-content-center gap-3">
              {latestAttempt && (
                <Button
                  size="lg"
                  variant="outline-primary"
                  onClick={() =>
                    router.push(
                      `/Courses/${courseId}/Quizzes/${quizId}/results/${latestAttempt._id}`
                    )
                  }
                  className="px-4 py-2 fs-5 fw-bold shadow-sm d-flex align-items-center"
                >
                  View Latest Result <FaExternalLinkAlt className="ms-2 fs-6" />
                </Button>
              )}

              {quiz.published ? (
                <Button
                  size="lg"
                  variant={hasAttemptsRemaining ? "danger" : "secondary"}
                  onClick={() =>
                    router.push(`/Courses/${courseId}/Quizzes/${quizId}/take`)
                  }
                  disabled={!hasAttemptsRemaining}
                  className="px-5 py-2 fs-5 fw-bold shadow"
                >
                  {hasAttemptsRemaining
                    ? "Begin Quiz"
                    : "No Attempts Remaining"}
                </Button>
              ) : (
                <div className="alert alert-warning d-inline-block px-5 fw-bold">
                  This quiz is not currently available.
                </div>
              )}
            </div>
          </Col>
        </Row>
        <div className="mt-4">
          <Link
            href={`/Courses/${courseId}/Quizzes`}
            className="text-decoration-none text-muted"
          >
            &larr; Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  //Faculty editor
  return (
    <div id="wd-quiz-editor">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{isNew ? "Create Quiz" : `Edit: ${quiz.title}`}</h2>
        <div>
          <span className="me-3 fw-bold text-muted">
            {quiz.published ? "Published" : "Not Published"}
          </span>
          <Button variant="danger" onClick={handleSave} className="me-2">
            Save
          </Button>
          <Link
            href={`/Courses/${courseId}/Quizzes`}
            className="btn btn-secondary"
          >
            Cancel
          </Link>
        </div>
      </div>
      <hr />

      <Tabs
        id="quiz-editor-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || "details")}
        className="mb-3"
      >
        {/* --- DETAILS TAB (FINAL VERSION WITH ALL FIELDS) --- */}
        <Tab eventKey="details" title="Details">
          <Form className="p-4 border rounded bg-white">
            {/* 1. Basic Info Section */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Quiz Title</Form.Label>
              <Form.Control
                type="text"
                value={quiz.title}
                onChange={(e) =>
                  dispatch(setQuiz({ ...quiz, title: e.target.value }))
                }
                placeholder="Enter quiz title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={quiz.description || ""}
                onChange={(e) =>
                  dispatch(setQuiz({ ...quiz, description: e.target.value }))
                }
                placeholder="Quiz instructions..."
                style={{ resize: "vertical" }}
              />
            </Form.Group>

            {/* 2. Quiz Type and Group Dropdowns */}
            <div className="mb-4 bg-light p-3 rounded border">
              <Row className="mb-3 align-items-center">
                <Form.Group as={Col} md={6}>
                  <Form.Label className="fw-bold">Quiz Type</Form.Label>
                  <Form.Select
                    value={quiz.quizType}
                    // We need to cast the value as QuizType so TypeScript is happy
                    onChange={(e) =>
                      dispatch(
                        setQuiz({
                          ...quiz,
                          quizType: e.target.value as QuizType,
                        })
                      )
                    }
                  >
                    <option value={QuizType.GRADED_QUIZ}>Graded Quiz</option>
                    <option value={QuizType.PRACTICE_QUIZ}>
                      Practice Quiz
                    </option>
                    <option value={QuizType.GRADED_SURVEY}>
                      Graded Survey
                    </option>
                    <option value={QuizType.UNGRADED_SURVEY}>
                      Ungraded Survey
                    </option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md={6}>
                  <Form.Label className="fw-bold">Assignment Group</Form.Label>
                  <Form.Select
                    value={quiz.assignmentGroup}
                    onChange={(e) =>
                      dispatch(
                        setQuiz({
                          ...quiz,
                          assignmentGroup: e.target.value as AssignmentGroup,
                        })
                      )
                    }
                  >
                    <option value={AssignmentGroup.QUIZZES}>Quizzes</option>
                    <option value={AssignmentGroup.EXAMS}>Exams</option>
                    <option value={AssignmentGroup.ASSIGNMENTS}>
                      Assignments
                    </option>
                    <option value={AssignmentGroup.PROJECT}>Project</option>
                  </Form.Select>
                </Form.Group>
              </Row>
            </div>

            {/* 3. Options Section (Checkboxes) */}
            <Form.Group className="mb-4 p-3 border rounded">
              <Form.Label className="fw-bold d-block border-bottom pb-2 mb-3">
                Options
              </Form.Label>

              {/* Shuffle Answers */}
              <Form.Check
                type="checkbox"
                id="shuffleAnswers"
                label="Shuffle Answers"
                checked={quiz.shuffleAnswers}
                onChange={(e) =>
                  dispatch(
                    setQuiz({ ...quiz, shuffleAnswers: e.target.checked })
                  )
                }
                className="mb-3 fw-bold"
              />

              {/* Time Limit (Simple implementation) */}
              <Row className="align-items-center mb-3 g-2">
                <Col xs="auto">
                  <Form.Check
                    type="checkbox"
                    id="timeLimitToggle"
                    // If time limit is > 0, the box appears checked
                    checked={quiz.timeLimit > 0}
                    readOnly // This is just a visual indicator for now
                    label="Time Limit"
                    className="fw-bold"
                  />
                </Col>
                <Col xs="auto">
                  <Form.Control
                    type="number"
                    min="0"
                    style={{ width: "80px", display: "inline-block" }}
                    value={quiz.timeLimit || ""}
                    onChange={(e) =>
                      dispatch(
                        setQuiz({
                          ...quiz,
                          timeLimit: parseInt(e.target.value) || 0,
                        })
                      )
                    }
                  />
                </Col>
                <Col xs="auto">Minutes</Col>
              </Row>

              {/* Multiple Attempts (Conditional Logic) */}
              <div
                className={`border p-3 rounded mb-3 ${
                  quiz.multipleAttempts ? "bg-white border-primary" : "bg-light"
                }`}
              >
                <Form.Check
                  type="checkbox"
                  id="multipleAttempts"
                  label="Allow Multiple Attempts"
                  checked={quiz.multipleAttempts}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    // If checking box, keep current attempt count. If unchecking, reset attempts to 1.
                    dispatch(
                      setQuiz({
                        ...quiz,
                        multipleAttempts: checked,
                        howManyAttempts: checked ? quiz.howManyAttempts : 1,
                      })
                    );
                  }}
                  className="mb-2 fw-bold"
                />
                {/* Only show this input if the box above is checked */}
                {quiz.multipleAttempts && (
                  <Row className="align-items-center g-2 ms-4 mt-2 transition-all">
                    <Col xs="auto">Score to keep: Highest</Col>
                    <Col xs="auto" className="ms-4">
                      Allowed Attempts:
                    </Col>
                    <Col xs="auto">
                      <Form.Control
                        type="number"
                        min="1"
                        style={{ width: "80px" }}
                        value={quiz.howManyAttempts}
                        onChange={(e) =>
                          dispatch(
                            setQuiz({
                              ...quiz,
                              howManyAttempts: parseInt(e.target.value) || 1,
                            })
                          )
                        }
                      />
                    </Col>
                  </Row>
                )}
              </div>

              {/* Other simple boolean options */}
              <div className="d-flex flex-wrap gap-4 mt-3">
                <Form.Check
                  type="checkbox"
                  id="showCorrectAnswers"
                  label="Show Correct Answers"
                  checked={quiz.showCorrectAnswers}
                  onChange={(e) =>
                    dispatch(
                      setQuiz({ ...quiz, showCorrectAnswers: e.target.checked })
                    )
                  }
                  className="fw-bold"
                />
                <Form.Check
                  type="checkbox"
                  id="oneQuestionAtATime"
                  label="One Question at a Time"
                  checked={quiz.oneQuestionAtATime}
                  onChange={(e) =>
                    dispatch(
                      setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })
                    )
                  }
                  className="fw-bold"
                />
                <Form.Check
                  type="checkbox"
                  id="webcamRequired"
                  label="Webcam Required"
                  checked={quiz.webcamRequired}
                  onChange={(e) =>
                    dispatch(
                      setQuiz({ ...quiz, webcamRequired: e.target.checked })
                    )
                  }
                  className="fw-bold"
                />
                <Form.Check
                  type="checkbox"
                  id="lockQuestions"
                  label="Lock Questions After Answering"
                  checked={quiz.lockQuestionsAfterAnswering}
                  onChange={(e) =>
                    dispatch(
                      setQuiz({
                        ...quiz,
                        lockQuestionsAfterAnswering: e.target.checked,
                      })
                    )
                  }
                  className="fw-bold"
                />
              </div>
            </Form.Group>

            {/* 4. Access Code */}
            <Form.Group
              as={Row}
              className="mb-4 align-items-center p-3 border rounded bg-light"
            >
              <Form.Label column md={3} className="fw-bold">
                Access Code
              </Form.Label>
              <Col md={5}>
                <Form.Control
                  type="text"
                  value={quiz.accessCode || ""}
                  onChange={(e) =>
                    dispatch(setQuiz({ ...quiz, accessCode: e.target.value }))
                  }
                  placeholder="Enter passcode (optional)"
                />
              </Col>
            </Form.Group>

            {/* 5. Dates Section */}
            <div className="border-top pt-3">
              <Form.Label className="fw-bold fs-5">Assign</Form.Label>
              <div className="border p-4 rounded mb-3">
                <Row className="mb-4">
                  <Form.Group as={Col} md={6}>
                    <Form.Label className="fw-bold">Assign to</Form.Label>
                    <Form.Control
                      type="text"
                      value="Everyone"
                      readOnly
                      className="bg-light fw-bold"
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md={4}>
                    <Form.Label className="fw-bold">Due</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="date"
                        value={formatDateForInput(quiz.due)}
                        onChange={(e) =>
                          dispatch(setQuiz({ ...quiz, due: e.target.value }))
                        }
                      />
                      <InputGroup.Text>
                        <FaCalendarAlt />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label className="fw-bold">Available from</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="date"
                        value={formatDateForInput(quiz.availableFromDate)}
                        onChange={(e) =>
                          dispatch(
                            setQuiz({
                              ...quiz,
                              availableFromDate: e.target.value,
                            })
                          )
                        }
                      />
                      <InputGroup.Text>
                        <FaCalendarAlt />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label className="fw-bold">Until</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="date"
                        value={formatDateForInput(quiz.availableUntilDate)}
                        onChange={(e) =>
                          dispatch(
                            setQuiz({
                              ...quiz,
                              availableUntilDate: e.target.value,
                            })
                          )
                        }
                      />
                      <InputGroup.Text>
                        <FaCalendarAlt />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Row>
              </div>
            </div>

            {/* 6. Publish Status Toggle at bottom */}
            <div className="d-flex justify-content-end align-items-center border-top pt-4 mt-2">
              <span className="me-3 text-muted">
                {quiz.published
                  ? "Visible to students"
                  : "Hidden from students"}
              </span>
              <Form.Check
                type="switch"
                id="publish-switch-bottom"
                label={quiz.published ? "Published" : "Unpublished"}
                checked={quiz.published}
                onChange={(e) =>
                  dispatch(setQuiz({ ...quiz, published: e.target.checked }))
                }
                className="fs-5 fw-bold"
              />
            </div>
          </Form>
        </Tab>

        <Tab
          eventKey="questions"
          title={`Questions (${quiz.questions.length})`}
        >
          <div className="p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Quiz Questions</h5>
              {/* Use the simpler handler */}
              <Button variant="secondary" size="sm" onClick={handleAddQuestion}>
                <FaPlus className="me-1" /> Add Question
              </Button>
            </div>

            <ListGroup variant="flush">
              {quiz.questions.length === 0 && (
                <ListGroup.Item className="text-muted text-center py-4">
                  No questions added yet. Click &quot;Add Question&quot; to
                  begin.
                </ListGroup.Item>
              )}
              {quiz.questions.map((question, index) => (
                <ListGroup.Item
                  key={question._id}
                  className="d-flex align-items-center justify-content-between bg-light mb-2 rounded border"
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <FaGripVertical
                      className="text-muted me-3"
                      style={{ cursor: "grab" }}
                    />
                    <Badge bg="secondary" className="me-3">
                      {index + 1}
                    </Badge>
                    <div className="flex-grow-1">
                      <strong>{question.title}</strong>
                      <span className="text-muted ms-2 small">
                        ({question.questionType.replace("_", " ")})
                      </span>
                    </div>
                    <Badge bg="info" className="me-3">
                      {question.points} pts
                    </Badge>
                  </div>

                  <div>
                    <Button
                      variant="link"
                      className="text-warning me-1"
                      onClick={() => handleEditQuestion(question._id)}
                    >
                      <FaPencilAlt />
                    </Button>
                    <Button
                      variant="link"
                      className="text-danger"
                      onClick={() => handleDeleteQuestion(question._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {quiz.questions.length > 0 && (
              <div className="text-end mt-3 fw-bold border-top pt-2">
                Total Points:{" "}
                {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
      <hr />
      <div className="d-flex justify-content-end">
        <Link
          href={`/Courses/${courseId}/Quizzes`}
          className="btn btn-secondary me-2"
        >
          Cancel
        </Link>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>

      <QuestionEditorModal
        show={showQModal}
        questionId={editingQId}
        onHide={() => {
          setShowQModal(false);
          setEditingQId(null);
        }}
      />
    </div>
  );
}
