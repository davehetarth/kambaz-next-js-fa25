import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

const COURSES_API = `${HTTP_SERVER}/api/courses`;

export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  location: string;
  description: string;
}

export interface Lesson {
  _id: string;
  name: string;
  description: string;
  module: string;
}

export interface Module {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: Lesson[];
}

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

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/courses`
  );
  return data;
};

export const createCourse = async (
  course: Partial<Course>
): Promise<Course> => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course
  );
  return data;
};

export const deleteCourse = async (id: string): Promise<unknown> => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};

export const updateCourse = async (course: Course): Promise<Course> => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findModulesForCourse = async (
  courseId: string
): Promise<Module[]> => {
  const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

export const createModuleForCourse = async (
  courseId: string,
  module: Partial<Module> // Use Partial for creation
): Promise<Module> => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const deleteModule = async (courseId: string, moduleId: string) => {
  const response = await axios.delete(
    `${COURSES_API}/${courseId}/modules/${moduleId}`
  );
  return response.data;
};

export const updateModule = async (courseId: string, module: Module) => {
  const { data } = await axios.put(
    `${COURSES_API}/${courseId}/modules/${module._id}`,
    module
  );
  return data;
};

export const createAssignment = async (
  courseId: string,
  assignment: Partial<Assignment> // Use Partial for creation
): Promise<Assignment> => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/assignments`,
    assignment
  );
  return response.data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};

/**
 * Delete an assignment by its ID
 * @param assignmentId The ID of the assignment to delete
 */
export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

/**
 * Update an assignment
 * @param assignment The assignment object with updates
 */
export const updateAssignment = async (
  assignment: Assignment
): Promise<Assignment> => {
  const response = await axios.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment
  );
  return response.data;
};

export const enrollInCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/enroll`
  );
  return response.data;
};

/**
 * Unenrolls the current user from a course.
 * @param courseId The ID of the course to unenroll from.
 */
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};

/**
 * Finds all enrollments for the current user.
 */
export const findMyEnrollments = async () => {
  const response = await axiosWithCredentials.get(
    `${USERS_API}/current/enrollments`
  );
  return response.data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};
export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};
