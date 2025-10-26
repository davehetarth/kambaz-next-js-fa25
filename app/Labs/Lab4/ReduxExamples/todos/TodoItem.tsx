"use client";
import { ListGroupItem, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deletetodo, setTodo } from "./todosReducer";

export default function TodoItem({
  todo,
}: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();
  return (
    <ListGroupItem key={todo.id} className="d-flex align-items-center w-50">
      <div className="flex-grow-1 fw-medium">{todo.title} </div>
      <div className="flex-shrink-0">
        <Button
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
          className="btn m-2"
        >
          {" "}
          Edit{" "}
        </Button>
        <Button
          onClick={() => dispatch(deletetodo(todo.id))}
          id="wd-delete-todo-click"
          className="btn btn-danger m-2"
        >
          {" "}
          Delete{" "}
        </Button>
      </div>
    </ListGroupItem>
  );
}
