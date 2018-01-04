import auth_types from '../types/auth_types';

const initialState = {
  waiting: false
}

export default function reducer(state = initialState, action){
  switch (action.type) {
    case auth_types.WAITING:
      return { ...state, waiting: true };
    case auth_types.DONE:
      return { ...state, waiting: false };
    default:
      return state;
  }
}
