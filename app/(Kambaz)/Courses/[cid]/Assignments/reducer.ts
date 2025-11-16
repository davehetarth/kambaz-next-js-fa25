"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// 1. REMOVED: The Database import is gone.

// 2. UPDATED: The 'editing' flag is removed.
export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  due: string;
  availablefrom: string;
  availableto: string;
}

// 3. UPDATED: The state shape now includes 'assignment' (singular) for the editor.
interface AssignmentsState {
  assignments: Assignment[];
  assignment: Assignment; // For the editor
}

// 4. NEW: A constant for a blank assignment for the editor.
const emptyAssignment: Assignment = {
  _id: "new",
  title: "New Assignment",
  course: "", // The component will fill this in
  description: "New Description",
  points: 100,
  due: "2025-01-01T00:00:00Z",
  availablefrom: "2025-01-01T00:00:00Z",
  availableto: "2025-01-01T00:00:00Z",
};

// 5. UPDATED: The initial state is now empty.
const initialState: AssignmentsState = {
  assignments: [], // Starts empty
  assignment: emptyAssignment,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    // This reducer loads the list from the server
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },

    // 6. SIMPLIFIED: 'addAssignment' just adds the object (server creates ID)
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments = [action.payload, ...state.assignments];
    },

    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== action.payload
      );
    },

    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments = state.assignments.map((a) =>
        a._id === action.payload._id ? action.payload : a
      );
    },

    // 7. REMOVED: 'editAssignment' (toggling the flag) is gone.

    // 8. NEW: 'setAssignment' (singular) for the editor
    setAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignment = action.payload;
    },

    // 9. NEW: 'resetAssignment' to clear the editor for a new entry
    resetAssignment: (state) => {
      state.assignment = emptyAssignment;
    },
  },
});

// 10. UPDATED: Export all the new actions
export const {
  setAssignments,
  addAssignment,
  deleteAssignment,
  updateAssignment,
  setAssignment,
  resetAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
