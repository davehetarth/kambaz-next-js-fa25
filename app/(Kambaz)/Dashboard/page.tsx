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
      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4 me-3">
        {/* Card 1 */}
        <Col>
          <Card className="h-100">
            <div className="position-relative">
              <CardImg
                variant="top"
                src="/images/reactjs.jpg"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "10px", cursor: "pointer" }}
              />
            </div>
            <Link
              href="/Courses/CS1234/Home"
              className="text-decoration-none text-dark d-flex flex-column flex-grow-1"
            >
              <CardBody className="d-flex flex-column">
                <CardTitle className="text-truncate">CS1234 React Js</CardTitle>
                <CardText>Full Stack software</CardText>
                <div className="mt-auto">
                  {" "}
                  <LuNotebookPen className="fs-4" />{" "}
                </div>
              </CardBody>
            </Link>
          </Card>
        </Col>

        {/* Card 2 */}
        <Col>
          <Card className="h-100">
            <div className="position-relative">
              <CardImg
                variant="top"
                src="/images/Cloud-Computing.jpg"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "10px", cursor: "pointer" }}
              />
            </div>
            <Link
              href="/Courses/CS1235/Home"
              className="text-decoration-none text-dark d-flex flex-column flex-grow-1"
            >
              <CardBody className="d-flex flex-column">
                <CardTitle className="text-truncate">
                  CS1235 Cloud Computing
                </CardTitle>
                <CardText>Learn Cloud Computing</CardText>
                <div className="mt-auto">
                  {" "}
                  <LuNotebookPen className="fs-4" />{" "}
                </div>
              </CardBody>
            </Link>
          </Card>
        </Col>

        {/* Card 3 */}
        <Col>
          <Card className="h-100">
            <div className="position-relative">
              <CardImg
                variant="top"
                src="/images/Data-Analytics.jpg"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "10px", cursor: "pointer" }}
              />
            </div>
            <Link
              href="/Courses/CS1232/Home"
              className="text-decoration-none text-dark d-flex flex-column flex-grow-1"
            >
              <CardBody className="d-flex flex-column">
                <CardTitle className="text-truncate">
                  CS1232 Data Analytics
                </CardTitle>
                <CardText>Data Analytics</CardText>
                <div className="mt-auto">
                  {" "}
                  <LuNotebookPen className="fs-4" />{" "}
                </div>
              </CardBody>
            </Link>
          </Card>
        </Col>

        {/* Card 4 */}
        <Col>
          <Card className="h-100">
            <div className="position-relative">
              <CardImg
                variant="top"
                src="/images/Machine-learning.jpg"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "10px", cursor: "pointer" }}
              />
            </div>
            <Link
              href="/Courses/CS1232/Home"
              className="text-decoration-none text-dark d-flex flex-column flex-grow-1"
            >
              <CardBody className="d-flex flex-column">
                <CardTitle className="text-truncate">
                  CS1232 Machine Learning
                </CardTitle>
                <CardText>Machine Learning</CardText>
                <div className="mt-auto">
                  {" "}
                  <LuNotebookPen className="fs-4" />{" "}
                </div>
              </CardBody>
            </Link>
          </Card>
        </Col>
        <Col>
          <Card className="h-100">
            <div className="position-relative">
              <CardImg
                variant="top"
                src="/images/DBMS.jpg"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "10px", cursor: "pointer" }}
              />
            </div>
            <Link
              href="/Courses/CS1232/Home"
              className="text-decoration-none text-dark d-flex flex-column flex-grow-1"
            >
              <CardBody className="d-flex flex-column">
                <CardTitle className="text-truncate">CS1232 DBMS</CardTitle>
                <CardText>Learn DBMS</CardText>
                <div className="mt-auto">
                  {" "}
                  <LuNotebookPen className="fs-4" />{" "}
                </div>
              </CardBody>
            </Link>
          </Card>
        </Col>
        <Col>
          <Card className="h-100">
            <div className="position-relative">
              <CardImg
                variant="top"
                src="/images/Algo.jpg"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "10px", cursor: "pointer" }}
              />
            </div>
            <Link
              href="/Courses/CS1232/Home"
              className="text-decoration-none text-dark d-flex flex-column flex-grow-1"
            >
              <CardBody className="d-flex flex-column">
                <CardTitle className="text-truncate">
                  CS1232 Algorithms
                </CardTitle>
                <CardText>Learn Algorithms</CardText>
                <div className="mt-auto">
                  {" "}
                  <LuNotebookPen className="fs-4" />{" "}
                </div>
              </CardBody>
            </Link>
          </Card>
        </Col>
        <Col>
          <Card className="h-100">
            <div className="position-relative">
              <CardImg
                variant="top"
                src="/images/Networks.jpg"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <BsThreeDotsVertical
                className="position-absolute fs-4 text-white"
                style={{ top: "10px", right: "10px", cursor: "pointer" }}
              />
            </div>
            <Link
              href="/Courses/CS1232/Home"
              className="text-decoration-none text-dark d-flex flex-column flex-grow-1"
            >
              <CardBody className="d-flex flex-column">
                <CardTitle className="text-truncate">CS1232 Networks</CardTitle>
                <CardText>Computer Networks</CardText>
                <div className="mt-auto">
                  {" "}
                  <LuNotebookPen className="fs-4" />{" "}
                </div>
              </CardBody>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
