import user_types from '../types/user_types';

export default function reducer(state = { data: {} }, action){
  switch (action.type) {
    case user_types.UPDATE_LOCAL_PROFILE:
      return { ...state, data: action.data };
    case user_types.GET_PROFILE:
      return state;
    default:
      return state;
  }
}
