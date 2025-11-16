"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

interface EnrollmentState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentState = {
  enrollments: [],
};

const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    // Sets the complete list of enrollments from the server
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
    // Adds a new enrollment when a user enrolls
    addEnrollment: (state, action: PayloadAction<Enrollment>) => {
      state.enrollments.push(action.payload);
    },
    // Removes an enrollment when a user unenrolls
    removeEnrollment: (state, action: PayloadAction<string>) => {
      // Payload is courseId
      state.enrollments = state.enrollments.filter(
        (e) => e.course !== action.payload
      );
    },
  },
});

// Note: Your Dashboard imported 'enroll' and 'unenroll'.
// We are exporting 'addEnrollment' and 'removeEnrollment' to be clearer.
export const { setEnrollments, addEnrollment, removeEnrollment } =
  enrollmentSlice.actions;

export default enrollmentSlice.reducer;
