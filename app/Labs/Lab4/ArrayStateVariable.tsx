"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Lab4/store/index";
import { ListGroup, ListGroupItem } from "react-bootstrap";
export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  return (
    <div
      id="wd-array-state-variables"
      className="card"
      style={{ width: "18rem" }}
    >
      <div className="card-body">
        <h3>Array State Variable</h3>
        <button
          onClick={addElement}
          className="btn btn-sucess mb-3"
          style={{
            backgroundColor: "#198754", // Bootstrap's green
            color: "white",
            borderColor: "#198754",
          }}
        >
          Add Element
        </button>
        <ul className="list-group">
          {array.map((item, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {" "}
              <span className="fw-bold">{item}</span>
              <button
                onClick={() => deleteElement(index)}
                className="btn btn-danger btn-sm rounded-2xl"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroupItem key={todo.id}>{todo.title}</ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
