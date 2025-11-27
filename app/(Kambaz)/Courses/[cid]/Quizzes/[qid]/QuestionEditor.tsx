"use client";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { updateQuestionInQuiz } from "../reducer";
import { Question, QuestionType, Choice } from "../client";
import { v4 as uuidv4 } from "uuid";
import { FaTrash, FaPlus } from "react-icons/fa";

interface QuestionEditorProps {
  questionId: string | null;
  show: boolean;
  onHide: () => void;
}

export default function QuestionEditorModal({
  questionId,
  show,
  onHide,
}: QuestionEditorProps) {
  const dispatch = useDispatch();

  const question = useSelector((state: RootState) =>
    state.quizzesReducer.quiz.questions.find((q) => q._id === questionId)
  );

  if (!show || !questionId || !question) {
    return null;
  }

  const handleUpdate = (field: keyof Question, value: any) => {
    dispatch(updateQuestionInQuiz({ ...question, [field]: value }));
  };

  // --- HELPER FUNCTIONS FOR MULTIPLE CHOICE ---
  const handleAddChoice = () => {
    const newChoice: Choice = {
      _id: uuidv4(),
      text: "",
      isCorrect: false,
    };
    const currentChoices = question.choices || [];
    handleUpdate("choices", [...currentChoices, newChoice]);
  };

  const handleChoiceTextChange = (choiceId: string, newText: string) => {
    const updatedChoices = question.choices?.map((choice) =>
      choice._id === choiceId ? { ...choice, text: newText } : choice
    );
    handleUpdate("choices", updatedChoices);
  };

  const handleSetCorrectChoice = (choiceId: string) => {
    const updatedChoices = question.choices?.map((choice) => ({
      ...choice,
      isCorrect: choice._id === choiceId,
    }));
    handleUpdate("choices", updatedChoices);
  };

  const handleDeleteChoice = (choiceId: string) => {
    const updatedChoices = question.choices?.filter(
      (choice) => choice._id !== choiceId
    );
    handleUpdate("choices", updatedChoices);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} md={8}>
              <Form.Label>Question Title</Form.Label>
              <Form.Control
                type="text"
                value={question.title}
                onChange={(e) => handleUpdate("title", e.target.value)}
                placeholder="e.g., Question 1"
              />
            </Form.Group>
            <Form.Group as={Col} md={4}>
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={question.points}
                onChange={(e) =>
                  handleUpdate("points", parseInt(e.target.value) || 0)
                }
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Question Type</Form.Label>
            <Form.Select
              value={question.questionType}
              onChange={(e) =>
                handleUpdate("questionType", e.target.value as QuestionType)
              }
            >
              <option value={QuestionType.MULTIPLE_CHOICE}>
                Multiple Choice
              </option>
              <option value={QuestionType.TRUE_FALSE}>True / False</option>
              <option value={QuestionType.FILL_BLANKS}>
                Fill in the Blanks
              </option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description / Question Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={question.description}
              onChange={(e) => handleUpdate("description", e.target.value)}
              placeholder="Enter the question text here. For fill-in-the-blanks, use underscores (e.g., 'The sky is ____')."
            />
          </Form.Group>

          <hr />
          <h5>Answers</h5>

          {/* --- TRUE/FALSE EDITOR --- */}
          {question.questionType === QuestionType.TRUE_FALSE && (
            <div className="p-4 border rounded bg-light">
              <Form.Label className="fw-bold mb-3">
                Select the correct answer:
              </Form.Label>
              <Form.Check
                type="radio"
                label="True"
                name="tf-answer"
                id="tf-true"
                className="mb-2 fs-5"
                checked={question.correctAnswer === "true"}
                onChange={() => handleUpdate("correctAnswer", "true")}
              />
              <Form.Check
                type="radio"
                label="False"
                name="tf-answer"
                id="tf-false"
                className="fs-5"
                checked={question.correctAnswer === "false"}
                onChange={() => handleUpdate("correctAnswer", "false")}
              />
            </div>
          )}

          {/* --- MULTIPLE CHOICE EDITOR --- */}
          {question.questionType === QuestionType.MULTIPLE_CHOICE && (
            <div className="p-3 border rounded bg-light">
              <p className="text-muted mb-3">
                Enter answer choices and select the correct one.
              </p>
              {question.choices?.map((choice, index) => (
                <InputGroup key={choice._id} className="mb-2">
                  <InputGroup.Radio
                    name="mc-correct-answer"
                    checked={choice.isCorrect}
                    onChange={() => handleSetCorrectChoice(choice._id)}
                    aria-label="Mark as correct answer"
                  />
                  <Form.Control
                    type="text"
                    value={choice.text}
                    onChange={(e) =>
                      handleChoiceTextChange(choice._id, e.target.value)
                    }
                    placeholder={`Choice ${index + 1}`}
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteChoice(choice._id)}
                  >
                    <FaTrash />
                  </Button>
                </InputGroup>
              ))}
              <div className="text-end mt-3">
                <Button variant="secondary" size="sm" onClick={handleAddChoice}>
                  <FaPlus className="me-1" /> Add Choice
                </Button>
              </div>
            </div>
          )}

          {/* --- FILL IN BLANKS EDITOR --- */}
          {question.questionType === QuestionType.FILL_BLANKS && (
            <div className="p-4 border rounded bg-light">
              <Form.Group>
                <Form.Label className="fw-bold">Correct Answer</Form.Label>
                <Form.Control
                  type="text"
                  value={question.correctAnswer || ""}
                  onChange={(e) =>
                    handleUpdate("correctAnswer", e.target.value)
                  }
                  placeholder="Enter the exact answer the student must type"
                />
                <Form.Text className="text-muted">
                  Students will need to provide an exact match to this answer.
                </Form.Text>
              </Form.Group>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
