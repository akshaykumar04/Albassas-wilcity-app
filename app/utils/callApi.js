import axios from "axios";
import { baseURL } from "../constants/config";
axios.defaults.baseURL = baseURL;
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
const callApi = (endpoint, method = "GET", body) => {
  return axios({
    method,
    url: endpoint,
    data: body
  }).catch(err => console.log(err));
};

export default callApi;
