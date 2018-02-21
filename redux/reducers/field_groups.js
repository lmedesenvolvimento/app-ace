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
      var { fieldGroupId, newData } = action.data;

      // Criando Id para novo Logradouro
      newData.$id = _.uniqueId('public_area_')
      
      // Adicionando novo Logradouro
      _.find(state.data, ['$id', fieldGroupId]).public_areas.push(newData)

      return { ...state, data: state.data };

    case field_groups_types.EDIT_PUBLIC_AREA:
      var { fieldGroupId, record, newData } = action.data;
      
      // Mesclando informações do Logradouro
      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
      var indexOfPublicArea = getPublicAreaIndex(state, action)
      
      state
      .data[indexOfFieldGroup]
      .public_areas[indexOfPublicArea] = { ...record, ...newData };
      
      return { ...state, data: state.data };
      
    case field_groups_types.REMOVE_PUBLIC_AREA:
      var { fieldGroupId, record } = action.data;

      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
      var indexOfPublicArea = getPublicAreaIndex(state, action, record.$id)

      state
        .data[indexOfFieldGroup]
        .public_areas.splice(indexOfPublicArea, 1);

      return { ...state, data: state.data };

    case field_groups_types.PUSH_LOCATION:
      var { fieldGroupId, publicareaId, newData } = action.data;

      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
      var indexOfPublicArea = getPublicAreaIndex(state, action, publicareaId)

      // Criando um Array para novas visitas
      newData.$id = _.uniqueId('address_')
      newData.visits = [newData.visit]
      
      // Adicionando nova Localização e Visita
      state
        .data[indexOfFieldGroup]
        .public_areas[indexOfPublicArea]
        .addresses.push( _.omit(newData, ['visit']) )       

      return { ...state, data: state.data }

    case field_groups_types.EDIT_LOCATION:
      var { fieldGroupId, publicareaId, record, newData } = action.data;

      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
      var indexOfPublicArea = getPublicAreaIndex(state, action, publicareaId)
      var indexOfAddress = getLocationIndex(state, action, record.$id)

      // Atualizando Localização e Visita
      state
        .data[indexOfFieldGroup]
        .public_areas[indexOfPublicArea]
        .addresses[indexOfAddress] = { ...record, ...newData };

      return { ...state, data: state.data }
      
    default:
      return state;
  }
}

// Queries for Public Area
function getPublicAreaIndex(state, action, index){
  let { fieldGroupId } = action.data;
  
  let result = _.chain(state.data)
    .find(['$id', fieldGroupId])
    .get('public_areas')
    .findIndex(['$id', index])
    .value()

  return result
}

// Queries for Location
function getLocationIndex(state, action, index){
  let { fieldGroupId, publicareaId } = action.data;
  
  let result = _.chain(state.data)
    .find(['$id', fieldGroupId])
    .get('public_areas')
    .find(['$id', publicareaId])
    .get('addresses')
    .findIndex(['$id', index])
    .value()

  return result  
}