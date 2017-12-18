import Config from "../env.json";
import axios from "axios";

axios.defaults.baseURL = Config.BASEURL;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
