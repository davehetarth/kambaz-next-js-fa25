"use client";
import { Form } from "react-bootstrap";
import { Question, QuestionType, Choice } from "../../client";

interface QuestionTakerProps {
  question: Question;
  answer: string | undefined; // Could be string (T/F, Fill Blanks) or stringId (MC)
  onAnswerChange: (answer: string) => void;
}

export default function QuestionTaker({
  question,
  answer,
  onAnswerChange,
}: QuestionTakerProps) {
  const renderQuestionInputs = () => {
    switch (question.questionType) {
      case QuestionType.TRUE_FALSE:
        return (
          <Form.Group>
            <Form.Check
              type="radio"
              label="True"
              name={`question-${question._id}`}
              id={`question-${question._id}-true`}
              checked={answer === "true"}
              onChange={() => onAnswerChange("true")}
              className="mb-2 fs-5"
            />
            <Form.Check
              type="radio"
              label="False"
              name={`question-${question._id}`}
              id={`question-${question._id}-false`}
              checked={answer === "false"}
              onChange={() => onAnswerChange("false")}
              className="fs-5"
            />
          </Form.Group>
        );

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <Form.Group>
            {question.choices?.map((choice: Choice) => (
              <Form.Check
                key={choice._id}
                type="radio"
                label={choice.text}
                name={`question-${question._id}`}
                id={`question-${question._id}-${choice._id}`}
                checked={answer === choice._id}
                onChange={() => onAnswerChange(choice._id)}
                className="mb-2 fs-5"
              />
            ))}
          </Form.Group>
        );

      case QuestionType.FILL_BLANKS:
        return (
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Type your answer here"
              value={answer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="fs-5"
            />
          </Form.Group>
        );

      default:
        return <div className="text-danger">Unknown question type.</div>;
    }
  };

  return (
    <div className="p-4 border rounded bg-white">
      <div className="mb-4">
        <h4 className="mb-3">{question.title}</h4>
        {question.description && (
          <div
            className="mb-4 p-3 bg-light rounded fs-5"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {question.description}
          </div>
        )}
      </div>
      <div className="ms-2">{renderQuestionInputs()}</div>
    </div>
  );
}
