"use client";
import React, { useState, useEffect } from "react";
import * as client from "./client";
import { FaTrash } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";
import { FormControl } from "react-bootstrap";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  editing: boolean; // This is client-side only
}

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(null); // Fetches the initial list
  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    // Add 'editing: false' to each todo as client-side state
    setTodos((todos || []).map((todo: Todo) => ({ ...todo, editing: false })));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // --- Create Functions ---
  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({
      title: "New Posted Todo",
      completed: false,
    });
    // Add to state using functional update
    setTodos((currentTodos) => [
      ...currentTodos,
      { ...newTodo, editing: false }, // Add client-side flag
    ]);
  };

  // --- Delete Functions ---
  const updateTodo = async (todo: any) => {
    try {
      await client.updateTodo(todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };
  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo);
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };

  // Optimistic update for checkbox toggle
  const handleToggleTodo = async (todoToToggle: Todo) => {
    const newCompletedStatus = !todoToToggle.completed;
    const updatedTodo = { ...todoToToggle, completed: newCompletedStatus };

    // Optimistically update the UI
    setTodos((currentTodos) =>
      currentTodos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
    );

    // Send the change to the server
    await updateTodo(updatedTodo);
  };

  // Updates the "draft" state as the user types
  const handleTitleDraft = (todo: Todo, newTitle: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((t) =>
        t.id === todo.id ? { ...t, title: newTitle } : t
      )
    );
  };

  // Toggles the 'editing' flag (client-side only)
  const editTodo = (todoToEdit: Todo) => {
    setTodos((currentTodos) =>
      currentTodos.map((t) =>
        t.id === todoToEdit.id ? { ...t, editing: true } : t
      )
    );
  };

  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (
        <div
          id="wd-todo-error-message"
          className="alert alert-danger mb-2 mt-2"
        >
          {errorMessage}
        </div>
      )}
      <h4>
        Todos{" "}
        <FaPlusCircle
          onClick={postNewTodo}
          className="text-primary float-end fs-3 me-3"
          id="wd-post-todo"
        />
      </h4>
      <ListGroup className="w-50">
        {todos.map((todo: Todo) => (
          <ListGroupItem key={todo.id}>
            {/* --- ICONS --- */}
            <TiDelete
              onClick={() => deleteTodo(todo)}
              className="text-danger float-end me-2 fs-3"
              id="wd-delete-todo"
            />
            <FaPencil
              onClick={() => editTodo(todo)}
              className="text-primary float-end me-2 mt-1"
            />

            {/* --- CHECKBOX --- */}
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo)}
            />

            {/* --- TITLE / EDIT INPUT --- */}
            {!todo.editing ? (
              // BUG FIX 2: Moved <span> inside
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
            ) : (
              // BUG FIX 1: Fixed onChange, onKeyDown, and value
              <FormControl
                className="w-50 float-start"
                value={todo.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleTitleDraft(todo, e.target.value);
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
                autoFocus // Focus the input when it appears
              />
            )}

            {/* BUG FIX 2: Removed the duplicate <span> here */}

            {/* Kept this one as it seems to be the one you want to deprecate */}
            <FaTrash
              onClick={() => deleteTodo(todo)} // Changed to deleteTodo
              className="text-danger float-end mt-1"
              style={{ opacity: 0.3 }} // Made it faded
              id="wd-remove-todo"
            />
          </ListGroupItem>
        ))}
      </ListGroup>{" "}
      <hr />
    </div>
  );
}
