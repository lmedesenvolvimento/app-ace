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
      state
       .data[action.data.indexOfFieldGroup]
       .public_areas
       .push(action.data.newData);

      return { ...state, data: state.data };
    case field_groups_types.EDIT_PUBLIC_AREA:
      var { indexOfFieldGroup, newData } = action.data;
      var index = getPublicAreaIndex(state, action);
      var publicArea = getPublicArea(state, action, index);

      // Mesclando informações do Logradouro
      state
        .data[action.data.indexOfFieldGroup]
        .public_areas[index] = { ...publicArea, ...newData };

      return { ...state, data: state.data };
    case field_groups_types.REMOVE_PUBLIC_AREA:
      var { indexOfFieldGroup } = action.data;
      var index = getPublicAreaIndex(state, action)

      state
        .data[indexOfFieldGroup]
        .public_areas.splice(index, 1);

      return { ...state, data: state.data };
    default:
      return state;
  }
}


function getPublicAreaIndex(state, action){
  let { indexOfFieldGroup, record } = action.data;
  let { public_areas } = state.data[indexOfFieldGroup];
  return _.findIndex(public_areas, (area) => area === record)
}

function getPublicArea(state, action, index){
  let { indexOfFieldGroup } = action.data;
  return state .data[indexOfFieldGroup].public_areas[index];
}
