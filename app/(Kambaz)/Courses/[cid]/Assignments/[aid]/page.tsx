"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as db from "../../../../Database";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Container, Row, Col, Button } from "react-bootstrap";
import { addAssignment, updateAssignment, deleteAssignment } from "../reducer";

import {
  FormGroup,
  FormLabel,
  FormControl,
  FormCheck,
  FormSelect,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";

export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  due: string;
  availablefrom: string;
  availableto: string;
  editing: boolean;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const canEdit = currentUser?.role === "FACULTY";
  const dispatch = useDispatch();
  const isNew = aid === "new";
  const DEFAULT_ASSIGNMENT: Assignment = {
    _id: "new",
    title: "New Assignment",
    course: cid as string,
    description: "New Assignment Description",
    points: 100,
    due: new Date().toISOString().split("T")[0],
    availablefrom: new Date().toISOString().split("T")[0],
    availableto: new Date().toISOString().split("T")[0],
    editing: false,
  };

  const [assignment, setAssignment] = useState<Assignment>(DEFAULT_ASSIGNMENT);
  useEffect(() => {
    if (isNew) {
      if (!canEdit) {
        router.push(`/Courses/${cid}/Assignments`);
        return;
      }
      setAssignment(DEFAULT_ASSIGNMENT);
    } else {
      const existingAssignment = assignments.find((a) => a._id === aid);
      if (existingAssignment) {
        setAssignment(existingAssignment);
      }
    }
  }, [aid, assignments, isNew, cid]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignment((prev) => ({ ...prev, title: e.target.value }));
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAssignment((prev) => ({ ...prev, description: e.target.value }));
  };
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignment((prev) => ({ ...prev, points: Number(e.target.value) }));
  };
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignment((prev) => ({ ...prev, due: e.target.value }));
  };
  const handleAvailableFromChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssignment((prev) => ({ ...prev, availablefrom: e.target.value }));
  };
  const handleAvailableToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignment((prev) => ({ ...prev, availableto: e.target.value }));
  };

  const handleSave = () => {
    if (isNew) {
      // --- This is the part that works with your original reducer ---
      // We must build the exact payload shape your 'addAssignment' reducer expects
      const newAssignmentPayload = {
        assignment: assignment.title, // 'title' from state maps to 'assignment' in payload
        course: assignment.course,
        points: assignment.points,
        due: assignment.due,
        availableto: assignment.availableto,
        availablefrom: assignment.availablefrom,
        // 'description' from state is NOT sent, because your reducer would ignore it
      };
      dispatch(addAssignment(newAssignmentPayload));
      // ---------------------------------------------------------------
    } else {
      // 'updateAssignment' reducer expects the full assignment object, which we have.
      dispatch(updateAssignment(assignment));
    }
    // Navigate back to the assignments list
    router.push(`/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="my-3 w-50">
      <div>
        <div className="mb-3">
          <FormLabel htmlFor="wd-name" className="fw-medium">
            Assignment Name
          </FormLabel>
          <FormControl type="text" id="wd-name" defaultValue={`${aid}`} />
        </div>

        <hr />

        {/* Description */}
        <FormControl
          as="textarea"
          className="mb-4"
          rows={6}
          value={assignment.description}
          onChange={handleDescriptionChange}
          readOnly={!canEdit}
        />

        {/* Points, Group, Grade, Submission Type */}
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
              value={assignment.points}
              id="wd-points"
              onChange={handlePointsChange}
              readOnly={!canEdit}
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
                  value={formatDate(assignment.due)}
                  onChange={handleDueDateChange}
                  readOnly={!canEdit}
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
                      value={formatDate(assignment.availablefrom)}
                      onChange={handleAvailableFromChange}
                      readOnly={!canEdit}
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
                      value={formatDate(assignment.availableto)}
                      onChange={handleAvailableToChange}
                      readOnly={!canEdit}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <div className="d-flex justify-content-end">
          <Link
            href={`../../${cid}/Assignments`}
            className="btn btn-light me-2"
          >
            Cancel
          </Link>
          {canEdit && (
            <Button variant="danger" onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
