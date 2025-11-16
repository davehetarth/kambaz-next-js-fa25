"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../../Courses/client";
import {
  addAssignment,
  updateAssignment,
  setAssignment,
  setAssignments, // Import setAssignments
  resetAssignment,
} from "../reducer";
import {
  Button,
  Form,
  FormControl,
  Row,
  Col,
  FormLabel,
  FormSelect,
  FormCheck,
} from "react-bootstrap";
import Link from "next/link";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignment } = useSelector(
    (state: RootState) => state.assignmentReducer
  );
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentReducer
  );
  // Get currentUser to determine edit permissions
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const canEdit = currentUser?.role === "FACULTY";

  // Load the assignment from Redux into local state for editing
  const [localAssignment, setLocalAssignment] = useState(assignment);

  const fetchAssignments = async () => {
    if (cid && assignments.length === 0) {
      const assignments = await client.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(assignments));
    }
  };
  useEffect(() => {
    fetchAssignments();
  }, [cid, assignments.length, dispatch]);

  useEffect(() => {
    if (aid === "new") {
      dispatch(resetAssignment());
    } else {
      const foundAssignment = assignments.find((a) => a._id === aid);
      if (foundAssignment) {
        dispatch(setAssignment(foundAssignment));
      }
    }
  }, [aid, assignments, dispatch]);

  useEffect(() => {
    setLocalAssignment(assignment);
  }, [assignment]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const handleSave = async () => {
    try {
      if (aid === "new") {
        const newAssignment = await client.createAssignment(
          cid as string,
          localAssignment
        );
        dispatch(addAssignment(newAssignment));
      } else {
        const updatedAssignment = await client.updateAssignment(
          localAssignment
        );
        dispatch(updateAssignment(updatedAssignment));
      }
      router.push(`/Courses/${cid}/Assignments`);
    } catch (err) {
      console.error("Failed to save assignment", err);
    }
  };

  return (
    <div className="me-5">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Assignment Title</Form.Label>
          <FormControl
            value={localAssignment.title}
            readOnly={!canEdit}
            onChange={(e) =>
              setLocalAssignment({ ...localAssignment, title: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <FormControl
            as="textarea"
            rows={5}
            readOnly={!canEdit}
            value={localAssignment.description}
            onChange={(e) =>
              setLocalAssignment({
                ...localAssignment,
                description: e.target.value,
              })
            }
          />
        </Form.Group>

        <Row className="mb-3">
          <FormLabel
            column
            sm={4}
            className="text-end fw-medium"
            htmlFor="wd-points"
          >
            Points
          </FormLabel>
          <Col sm={8}>
            <FormControl
              type="number"
              value={localAssignment.points}
              id="wd-points"
              readOnly={!canEdit}
              onChange={(e) =>
                setLocalAssignment({
                  ...localAssignment,
                  points: Number(e.target.value),
                })
              }
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel
            column
            sm={4}
            className="text-end fw-medium"
            htmlFor="wd-group"
          >
            Assignment Group
          </FormLabel>
          <Col sm={8}>
            <FormSelect id="wd-group" disabled={!canEdit}>
              <option value="Assignments">ASSIGNMENTS</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel
            column
            sm={4}
            className="text-end fw-medium"
            htmlFor="wd-display-grade-as"
          >
            Display Grade as
          </FormLabel>
          <Col sm={8}>
            <FormSelect id="wd-display-grade-as" disabled={!canEdit}>
              <option value="Percentage">Percentage</option>
              <option value="Marks">Marks</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel
            id="wd-submission-type"
            column
            sm={4}
            className="text-end fw-medium"
          >
            Submission Type
          </FormLabel>
          <Col sm={8}>
            <div className="border p-3 rounded">
              <FormSelect
                id="wd-submission-type"
                className="mb-3"
                disabled={!canEdit}
              >
                <option>Online</option>
                <option>Offline</option>
              </FormSelect>
              <FormLabel className="fw-medium">Online Entry Options</FormLabel>
              <FormCheck
                type="checkbox"
                label="Text Entry"
                id="wd-text-entry"
                disabled={!canEdit}
              />
              <FormCheck
                type="checkbox"
                label="Website URL"
                id="wd-website-url"
                defaultChecked
                disabled={!canEdit}
              />
              <FormCheck
                type="checkbox"
                label="Media Recordings"
                id="wd-media-recordings"
                disabled={!canEdit}
              />
              <FormCheck
                type="checkbox"
                label="Student Annotation"
                id="wd-student-annotation"
                disabled={!canEdit}
              />
              <FormCheck
                type="checkbox"
                label="File Uploads"
                id="wd-file-upload"
                disabled={!canEdit}
              />
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel column sm={4} className="text-end fw-medium">
            Assign
          </FormLabel>
          <Col sm={8}>
            <div className="border p-3 rounded">
              <div className="mb-3">
                <FormLabel htmlFor="wd-assign-to" className="fw-medium">
                  Assign to
                </FormLabel>
                <FormControl
                  type="text"
                  id="wd-assign-to"
                  defaultValue="Everyone"
                  readOnly={!canEdit}
                />
              </div>

              <div className="mb-3">
                <FormLabel htmlFor="wd-due-date" className="fw-medium">
                  Due
                </FormLabel>
                <FormControl
                  type="date"
                  id="wd-due-date"
                  readOnly={!canEdit}
                  value={formatDate(localAssignment.due)}
                  onChange={(e) =>
                    setLocalAssignment({
                      ...localAssignment,
                      due: e.target.value,
                    })
                  }
                />
              </div>

              <Row>
                <Col>
                  <div>
                    <FormLabel
                      htmlFor="wd-available-from"
                      className="fw-medium"
                    >
                      Available from
                    </FormLabel>
                    <FormControl
                      type="date"
                      id="wd-available-from"
                      readOnly={!canEdit}
                      value={formatDate(localAssignment.availablefrom)}
                      onChange={(e) =>
                        setLocalAssignment({
                          ...localAssignment,
                          availablefrom: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col>
                  <div>
                    <FormLabel
                      htmlFor="wd-available-until"
                      className="fw-medium"
                    >
                      Until
                    </FormLabel>
                    <FormControl
                      type="date"
                      id="wd-available-until"
                      readOnly={!canEdit}
                      value={formatDate(localAssignment.availableto)}
                      onChange={(e) =>
                        setLocalAssignment({
                          ...localAssignment,
                          availableto: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Form>
      <hr />
      <div className="d-flex justify-content-end">
        <Link
          href={`/Courses/${cid}/Assignments`}
          className="btn btn-secondary me-2"
        >
          Cancel
        </Link>
        <Button onClick={handleSave} variant="danger" disabled={!canEdit}>
          Save
        </Button>
      </div>
    </div>
  );
}
