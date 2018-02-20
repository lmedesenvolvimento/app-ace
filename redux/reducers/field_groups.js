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
      // Adicionando novo Logradouro
      state
       .data[action.data.indexOfFieldGroup]
       .public_areas
       .push(action.data.newData);

      return { ...state, data: state.data };

    case field_groups_types.EDIT_PUBLIC_AREA:
      var { indexOfFieldGroup, record, newData } = action.data;
      var index = getPublicAreaIndex(state, action);

      // Mesclando informações do Logradouro
      state
        .data[action.data.indexOfFieldGroup]
        .public_areas[index] = { ...record, ...newData };

      return { ...state, data: state.data };

    case field_groups_types.REMOVE_PUBLIC_AREA:
      var { indexOfFieldGroup } = action.data;
      var index = getPublicAreaIndex(state, action)

      state
        .data[indexOfFieldGroup]
        .public_areas.splice(index, 1);

      return { ...state, data: state.data };

    case field_groups_types.PUSH_LOCATION:
      var { indexOfFieldGroup, indexOfPublicArea, newData } = action.data;

      // Criando um Array para novas visitas
      newData.visits = [newData.visit]
      
      // Adicionando nova Localização e Visita
      state
        .data[indexOfFieldGroup]
        .public_areas[indexOfPublicArea]
        .addresses.push( _.omit(newData, ['visit']) ) 

      return { ...state, data: state.data }

    case field_groups_types.EDIT_LOCATION:
      var { indexOfFieldGroup, indexOfPublicArea, record, newData } = action.data;
      var index = getLocationIndex(state, action)

      // Atualizando Localização e Visita
      state
        .data[indexOfFieldGroup]
        .public_areas[indexOfPublicArea]
        .addresses[index] = { ...record, ...newData };

      return { ...state, data: state.data }
      
    default:
      return state;
  }
}

// Queries for Public Area
function getPublicAreaIndex(state, action){
  let { indexOfFieldGroup, record } = action.data;
  let { public_areas } = state.data[indexOfFieldGroup];
  return _.findIndex(public_areas, (area) => area === record)
}

function getPublicArea(state, action, index){
  let { indexOfFieldGroup } = action.data;
  return state.data[indexOfFieldGroup].public_areas[index];
}

// Queries for Location
function getLocationIndex(state, action){
  let { indexOfFieldGroup, indexOfPublicArea, record } = action.data;
  let { addresses } = state.data[indexOfFieldGroup].public_areas[indexOfPublicArea];
  return _.findIndex(addresses, (address) => address === record);
}