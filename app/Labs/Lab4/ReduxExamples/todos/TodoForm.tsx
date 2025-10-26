"use client";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";
import { RootState } from "../../store";

export default function TodoForm() {
  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();

  return (
    <ListGroupItem className="d-flex align-items-center w-50">
      <FormControl
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
        className="flex-grow-1 fw-medium"
      />
      <div className="flex-shrink-0">
        <Button
          onClick={() => dispatch(updateTodo(todo))}
          id="wd-update-todo-click"
          className="m-2 btn btn-warning"
        >
          {" "}
          Update{" "}
        </Button>
        <Button
          onClick={() => dispatch(addTodo(todo))}
          id="wd-add-todo-click"
          className="m-2 btn btn-danger"
        >
          {" "}
          Add{" "}
        </Button>
      </div>
    </ListGroupItem>
  );
}
