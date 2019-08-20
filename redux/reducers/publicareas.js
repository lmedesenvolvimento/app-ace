import publicareas_types from '../types/publicareas_types';

const initialState = {
  data: []
};

export default function reducer(state = initialState, action) {
  const { data } = action;
  switch (action.type) {
    case publicareas_types.SET_PUBLICAREAS:
      return { 
        ...state, 
        data
      };
    default:
      return state;
  }
}
