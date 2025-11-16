"use client";
// 1. Import PayloadAction to type your reducers
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { courses } from "../Database";
import { v4 as uuidv4 } from "uuid";

// 2. This interface is good
interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

// 3. Define an interface for the state
interface CoursesState {
  courses: Course[];
}

// 4. Use that interface to type initialState
const initialState: CoursesState = {
  courses: courses,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    // 5. Add types to your action payloads
    setCourses: (state, action: PayloadAction<Course[]>) => {
      // The payload is a complete array of courses
      state.courses = action.payload;
    },
    addNewCourse: (state, action: PayloadAction<Course>) => {
      // The user is passing in the 'new course' form object
      const course = action.payload;
      const newCourse = { ...course, _id: uuidv4() };
      state.courses = [...state.courses, newCourse];
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      // The payload is the courseId (string)
      const courseId = action.payload;
      state.courses = state.courses.filter((course) => course._id !== courseId);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      // The payload is the full course object to update
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
