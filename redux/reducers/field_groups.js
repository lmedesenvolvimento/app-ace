import * as _ from "lodash";
import field_groups_types from '../types/field_groups_types';

const initialState = {
  data: []
}

export default function reducer(state = initialState, action){
  switch (action.type) {
    case field_groups_types.UPDATE_FIELD_GROUPS:
      return { ...state, data: action.data };
    case field_groups_types.PUSH_PUBLIC_AREA:
      let { index, field_group } = action.data;

      state
       .data[index]
       .public_areas
       .push(field_group);

      return { ...state, data: state.data };
    default:
      return state;
  }
}
