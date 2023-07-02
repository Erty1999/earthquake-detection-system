import axios from "axios";

const useAxios = () => {
  return axios.create({
    baseURL: "http://localhost:3100",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default useAxios;
