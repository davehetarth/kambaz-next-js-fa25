"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// 1. DELETE 'courses' from here, it's just mock data
// import { courses } from "../Database";
import { v4 as uuidv4 } from "uuid";
// 2. IMPORT THE COURSE TYPE
import { Course } from "./client"; // Adjust path if client is not in the same folder

// 3. DELETE THE LOCAL COURSE INTERFACE
// interface Course { ... }

// 4. Define an interface for the state
interface CoursesState {
  courses: Course[]; // This now uses the IMPORTED Course type
}

// 5. Use that interface to type initialState
const initialState: CoursesState = {
  // 6. Start with an empty array
  courses: [],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    addNewCourse: (state, action: PayloadAction<Course>) => {
      // Your API should now be creating the _id
      state.courses = [...state.courses, action.payload];
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      const courseId = action.payload;
      state.courses = state.courses.filter((course) => course._id !== courseId);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const course = action.payload;
      state.courses = state.courses.map((c) =>
        c._id === course._id ? course : c
      );
    },
  },
});
export const { addNewCourse, deleteCourse, updateCourse, setCourses } =
  coursesSlice.actions;
export default coursesSlice.reducer;
