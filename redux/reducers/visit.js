import visit_types from '../types/visit_types';

const initialState = {
  number: '',
  complement: '',
  visit: {
    type: null,
    type_location: null,
    check_in: null,
    observation: null,
    registred_at: null,
    latitude: null,
    longitude: null,
    samples: [],
    inspect: {},
    treatment: {},
    validation: {}
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case visit_types.SET_VISIT:
    var newState = Object.assign({}, state, action.data);
    console.log(newState);
    return newState;
  case visit_types.CLEAR_VISIT:
    return initialState;
  default:
    return state;
  }
}
