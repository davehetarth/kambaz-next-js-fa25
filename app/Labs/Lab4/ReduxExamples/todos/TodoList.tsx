"use client";

import { ListGroup } from "react-bootstrap";
import TodoForm from "./TodoForm";
import { RootState } from "../../store";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";

export default function TodoList() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  return (
    <div id="wd-todo-list-redux">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
