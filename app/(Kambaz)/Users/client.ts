import axios from "axios";
const HTTP_SERVER =
  process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
const USERS_API = `${HTTP_SERVER}/api/users`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const profile = async () => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return data;
};
