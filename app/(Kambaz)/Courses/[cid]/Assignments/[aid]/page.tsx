import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FormGroup,
  FormLabel,
  FormControl,
  FormCheck,
  FormSelect,
} from "react-bootstrap";

export default function AssignmentEditor() {
  const descriptionText = `The assignment is available online.

Submit a link to the landing page of your Web application running on Netlify.

The landing page should include the following:
  • Your full name and section
  • Links to each of the lab assignments
  • Link to the Kanbas application
  • Links to all relevant source code repositories

The Kanbas application should include a link to navigate back to the landing page.`;
  return (
    <div id="wd-assignments-editor" className="my-3 w-50">
      <div>
        <div className="mb-3">
          <FormLabel htmlFor="wd-name" className="fw-medium">
            Assignment Name
          </FormLabel>
          <FormControl type="text" id="wd-name" defaultValue="A1" />
        </div>

        <hr />

        {/* Description */}
        <FormControl
          as="textarea"
          className="mb-4"
          rows={12}
          defaultValue={descriptionText}
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
            <FormControl type="text" value={100} id="wd-points" />
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
            <FormSelect id="wd-group">
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
            <FormSelect id="wd-display-grade-as">
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
              <FormSelect id="wd-submission-type" className="mb-3">
                <option>Online</option>
                <option>Offline</option>
              </FormSelect>
              <FormLabel className="fw-medium">Online Entry Options</FormLabel>
              <FormCheck
                type="checkbox"
                label="Text Entry"
                id="wd-text-entry"
              />
              <FormCheck
                type="checkbox"
                label="Website URL"
                id="wd-website-url"
                defaultChecked
              />
              <FormCheck
                type="checkbox"
                label="Media Recordings"
                id="wd-media-recordings"
              />
              <FormCheck
                type="checkbox"
                label="Student Annotation"
                id="wd-student-annotation"
              />
              <FormCheck
                type="checkbox"
                label="File Uploads"
                id="wd-file-upload"
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
                />
              </div>

              <div className="mb-3">
                <FormLabel htmlFor="wd-due-date" className="fw-medium">
                  Due
                </FormLabel>
                <FormControl
                  type="text"
                  id="wd-due-date"
                  defaultValue="05/13/2024"
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
                      type="text"
                      id="wd-available-from"
                      defaultValue="05/06/2024"
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
                      type="text"
                      id="wd-available-until"
                      defaultValue="05/13/2024"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <div className="d-flex justify-content-end">
          <Button variant="light" className="me-2">
            Cancel
          </Button>
          <Button variant="danger">Save</Button>
        </div>
      </div>
    </div>
  );
}
