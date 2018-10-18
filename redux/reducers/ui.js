
import ui_types from '../types/ui_types';

const initialState = {
  loading: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case ui_types.OPEN_LOADING:
    return { ...state, loading: true };
  case ui_types.CLOSE_LOADING:
    return { ...state, loading: false };
  case ui_types.TOGGLE_LOADING:
    return { ...state, loading: !state.loading };
  default:
    return state;
  }
}
