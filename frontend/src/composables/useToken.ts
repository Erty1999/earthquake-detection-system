import Cookies from "universal-cookie";

export default function useToken() {
  const cookies = new Cookies();
  return cookies;
}
