import preferences_types from '../types/preferences_types';

const initialState = {
  city: undefined
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case preferences_types.SET_CITY:
      return { 
        ...state, 
        city: action.data 
      };
    default:
      return state;
  }
}
