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
  setAssignments,
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

  // 1. Get data from Redux store
  const { assignment, assignments } = useSelector(
    (state: RootState) => state.assignmentReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  // 2. Determine edit permission safely
  const canEdit = currentUser?.role === "FACULTY";

  // 3. Local state for form editing
  const [localAssignment, setLocalAssignment] = useState(assignment);

  // 4. Fetch assignments if list is empty (e.g., on direct link or refresh)
  useEffect(() => {
    const fetchAssignments = async () => {
      if (cid && assignments.length === 0) {
        const fetchedAssignments = await client.findAssignmentsForCourse(
          cid as string
        );
        dispatch(setAssignments(fetchedAssignments));
      }
    };
    fetchAssignments();
  }, [cid, assignments.length, dispatch]);

  // 5. Initialize form data based on URL parameter (new vs. edit)
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

  // 6. Sync local state whenever Redux state changes
  useEffect(() => {
    setLocalAssignment(assignment);
  }, [assignment]);

  // Helper to format ISO date string for <input type="date"> (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  // Helper to convert date input value back to ISO string for storage
  const toISODate = (dateString: string) => {
    return new Date(dateString).toISOString();
  };

  const handleSave = async () => {
    if (!cid) return;
    try {
      if (aid === "new") {
        // Create new
        const newAssignment = await client.createAssignment(
          cid as string,
          localAssignment
        );
        dispatch(addAssignment(newAssignment));
      } else {
        // Update existing. FIX: Pass ID and the assignment object.
        const updatedAssignment = await client.updateAssignment(
          localAssignment._id,
          localAssignment
        );
        dispatch(updateAssignment(updatedAssignment));
      }
      router.push(`/Courses/${cid}/Assignments`);
    } catch (err) {
      console.error("Failed to save assignment", err);
      // Optionally add user feedback here (e.g., a toast notification)
    }
  };

  return (
    <div className="me-5 pe-5">
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

        {/* ... (Group and Display Grade as sections remain unchanged) ... */}
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
        {/* ... (Submission Type section remains unchanged) ... */}
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

              {/* FIX: Updated property names and added date conversion handlers */}
              <div className="mb-3">
                <FormLabel htmlFor="wd-due-date" className="fw-medium">
                  Due
                </FormLabel>
                <FormControl
                  type="date"
                  id="wd-due-date"
                  readOnly={!canEdit}
                  // Use new property name: dueDate
                  value={formatDateForInput(localAssignment.due)}
                  onChange={(e) =>
                    setLocalAssignment({
                      ...localAssignment,
                      // Convert back to ISO string on change
                      due: toISODate(e.target.value),
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
                      // Use new property name: availableFromDate
                      value={formatDateForInput(localAssignment.availablefrom)}
                      onChange={(e) =>
                        setLocalAssignment({
                          ...localAssignment,
                          // Convert back to ISO string on change
                          availablefrom: toISODate(e.target.value),
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
                      // Use new property name: availableUntilDate
                      value={formatDateForInput(localAssignment.availableto)}
                      onChange={(e) =>
                        setLocalAssignment({
                          ...localAssignment,
                          // Convert back to ISO string on change
                          availableto: toISODate(e.target.value),
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
        {/* Disable save button if not faculty */}
        <Button onClick={handleSave} variant="danger" disabled={!canEdit}>
          Save
        </Button>
      </div>
    </div>
  );
}
