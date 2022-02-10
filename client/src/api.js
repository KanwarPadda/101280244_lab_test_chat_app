import axios from "axios"

export const getCookies = () =>
  document.cookie.split(';').reduce((cookies, item) => {
    const [name, value] = item.split('=');
    cookies[name] = value;
    return cookies;
}, {});

const axiosInstance = axios.create({
  timeout: 1000,
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCookies()[' messenger-csrfToken'] || getCookies()['messenger-csrfToken'];
    if(csrfToken) config.headers["x-csrf-token"] = csrfToken;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosInstance;