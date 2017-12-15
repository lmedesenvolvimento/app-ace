import axios from "axios";

axios.defaults.baseURL = "http://10.0.40.109:5000";
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
