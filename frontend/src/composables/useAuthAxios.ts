import axios from "axios";
import useToken from "../composables/useToken";

const useAuthAxios = () => {
  const cookie = useToken();
  const jwt = cookie.get("EA-session");
 
  if (!jwt) {
    throw new Error("no jwt provided");
  }
  return axios.create({
    baseURL: import.meta.env.VITE_BE_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
  });
};

export default useAuthAxios;
