import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define the Enrollment shape (Link between User & Course)
interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

// 2. Define the Course shape (The actual course data)
interface Course {
  _id: string;
  name: string;
  number?: string;
  description?: string;
}

// 3. Create a Union Type: Items can be Enrollment OR Course
type EnrollmentOrCourse = Enrollment | Course;

interface EnrollmentState {
  enrollments: EnrollmentOrCourse[];
}

const initialState: EnrollmentState = {
  enrollments: [],
};

const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    // The payload can be a list of mixed objects (Courses or Enrollments)
    setEnrollments: (state, action: PayloadAction<EnrollmentOrCourse[]>) => {
      state.enrollments = action.payload;
    },

    // Adding a single item (usually an Enrollment object on creation)
    addEnrollment: (state, action: PayloadAction<EnrollmentOrCourse>) => {
      state.enrollments.push(action.payload);
    },

    // Removing requires checking both types safely
    removeEnrollment: (state, action: PayloadAction<string>) => {
      const courseIdToRemove = action.payload;

      state.enrollments = state.enrollments.filter((e) => {
        // CASE 1: It's a Course Object (e.g. from database fetch)
        if (e._id === courseIdToRemove) return false;

        // CASE 2: It's an Enrollment Object (e.g. just added)
        // We use the 'in' operator to safely check if the 'course' property exists
        if ("course" in e && e.course === courseIdToRemove) return false;

        return true;
      });
    },
  },
});

export const { setEnrollments, addEnrollment, removeEnrollment } =
  enrollmentSlice.actions;

export default enrollmentSlice.reducer;
