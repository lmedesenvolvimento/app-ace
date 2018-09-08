import Expo from 'expo';
import axios from 'axios';

let instance = axios.create({
  baseURL: Expo.Constants.manifest.extra.baseurl
});

instance.defaults.headers.post['Accept'] = 'application/json';
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers.common['Accept'] = 'application/json';
instance.defaults.headers.common['Content-Type'] = 'application/json';

export default instance;
