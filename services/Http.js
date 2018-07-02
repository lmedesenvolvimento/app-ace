import Config from '../env.json';
import ProductionConfig from '../env.production.json';

import axios from 'axios';

let instance = axios.create({
  baseURL: ( __DEV__ ? Config.BASEURL : ProductionConfig )
});

instance.defaults.headers.post['Accept'] = 'application/json';
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers.common['Accept'] = 'application/json';
instance.defaults.headers.common['Content-Type'] = 'application/json';

export default instance;
