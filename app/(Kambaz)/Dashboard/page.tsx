import Link from "next/link";
import Image from "next/image";
import { Row, Col } from "react-bootstrap";
import { Card, CardImg, CardText, CardTitle, CardBody } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { LuNotebookPen } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Dashboard() {
  return (
    <div id="wd-dashboard" className="ms-3">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2> <hr />
      <div id="wd-dashboard-courses" className="d-flex flex-wrap gap-4">
        <Row xs={1} md={5} className="g-4 mb-4">
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card className="position-relative">
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "6px" }}
              />
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  width="100%"
                  height={160}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1234 React Js
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "75px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <LuNotebookPen className="fs-4" />
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            {" "}
            <Card>
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "6px" }}
              />
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  width="100%"
                  height={160}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1235 React JS
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "75px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <LuNotebookPen className="fs-4" />
                </CardBody>
              </Link>
            </Card>{" "}
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            {" "}
            <Card>
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "6px" }}
              />
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  width="100%"
                  height={160}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1232 React JS
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "75px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <LuNotebookPen className="fs-4" />
                </CardBody>
              </Link>
            </Card>{" "}
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            {" "}
            <Card>
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "6px" }}
              />
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  width="100%"
                  height={160}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1236 React JS
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "75px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <LuNotebookPen className="fs-4" />
                </CardBody>
              </Link>
            </Card>{" "}
          </Col>
        </Row>
        <Row xs={1} md={5} className="g-4 mb-4">
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "6px" }}
              />
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  width="100%"
                  height={160}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1237 React JS
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "75px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <LuNotebookPen className="fs-4" />
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            {" "}
            <Card>
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "6px" }}
              />
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  width="100%"
                  height={160}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1231 React JS
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "75px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <LuNotebookPen className="fs-4" />
                </CardBody>
              </Link>
            </Card>{" "}
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            {" "}
            <Card>
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "6px" }}
              />
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  width="100%"
                  height={160}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1239 React JS
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "75px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <LuNotebookPen className="fs-4" />
                </CardBody>
              </Link>
            </Card>{" "}
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            {" "}
            <Card>
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "6px" }}
              />
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  width="100%"
                  height={160}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1238 React JS
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "75px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <LuNotebookPen className="fs-4" />
                </CardBody>
              </Link>
            </Card>{" "}
          </Col>
        </Row>
      </div>
    </div>
  );
}
