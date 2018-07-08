import * as _ from "lodash";
import field_groups_types from '../types/field_groups_types';
import { genSecureHex } from "../../services/SecureRandom";
import { VisitType, VisitTypeLocation } from "../../types/visit";

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
      newData.$id = genSecureHex();
      
      // Adicionando novo Logradouro
      _.find(state.data, ['$id', fieldGroupId]).field_group.public_areas.push(newData)

      return { ...state, data: state.data };

    case field_groups_types.EDIT_PUBLIC_AREA:
      var { fieldGroupId, record, newData } = action.data;
      
      // Mesclando informações do Logradouro
      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
      var indexOfPublicArea = getPublicAreaIndex(state, action)
      
      state
      .data[indexOfFieldGroup]
      .field_group
      .public_areas[indexOfPublicArea] = { ...record, ...newData };
      
      return { ...state, data: state.data };
      
    case field_groups_types.REMOVE_PUBLIC_AREA:
      var { fieldGroupId, record } = action.data;

      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
      var indexOfPublicArea = getPublicAreaIndex(state, action, record.$id)
      
      // Deletando Logradouro
      state
        .data[indexOfFieldGroup]
        .field_group
        .public_areas.splice(indexOfPublicArea, 1);

      return { ...state, data: state.data };

    case field_groups_types.PUSH_LOCATION:
      var { fieldGroupId, publicareaId, newData } = action.data;

      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
      var indexOfPublicArea = getPublicAreaIndex(state, action, publicareaId)

      // Adicionando MappingId a visita
      newData.visit.mapping_id = state.data[indexOfFieldGroup].id

      // Criando um Array para novas visitas
      newData.$id = genSecureHex()
      newData.census = []
      newData.visits = [newData.visit]
      
      // Adicionando nova Localização e Visita
      state
        .data[indexOfFieldGroup]
        .field_group
        .public_areas[indexOfPublicArea]
        .addresses.push( _.omit(newData, ['visit']) )       

      return { ...state, data: state.data }

    case field_groups_types.EDIT_LOCATION:
      var { fieldGroupId, publicareaId, record, newData } = action.data;

      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
      var indexOfPublicArea = getPublicAreaIndex(state, action, publicareaId)
      var indexOfAddress = getLocationIndex(state, action, record.$id)

      // Adicionando MappingId a visita
      newData.visit.mapping_id = state.data[indexOfFieldGroup].id

      // Se a visita for fechada ou se a visita anterior for fechada adiciona mais uma visita ao endereço
      if( isVisitClosedORefused(newData.visit.type) || isVisitClosedORefused(_.last(record.visits).type) ){
        newData.visits = _.clone(record.visits)
        newData.visits.push(newData.visit)
      } else{
        // Mesclando alterações da última visíta
        var lastVisitIndex = _.findLastIndex(record.visits)
        record.visits[lastVisitIndex] = newData.visit
      }

      // Atualizando Localização e Visita
      state
        .data[indexOfFieldGroup]
        .field_group
        .public_areas[indexOfPublicArea]
        .addresses[indexOfAddress] = { ..._.omit(record,  ['visit']), ..._.omit(newData, ['visit']) };

      return { ...state, data: state.data }

    case field_groups_types.REMOVE_LOCATION:
      var { fieldGroupId, publicareaId, record } = action.data;

      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
      var indexOfPublicArea = getPublicAreaIndex(state, action, publicareaId)
      var indexOfAddress = getLocationIndex(state, action, record.$id)
      
      // Deletando Endereço
      state
        .data[indexOfFieldGroup]
        .field_group
        .public_areas[indexOfPublicArea]
        .addresses.splice(indexOfAddress, 1)

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
    .get('field_group.public_areas')
    .findIndex(['$id', index])
    .value();

  return result;
}

// Queries for Location
function getLocationIndex(state, action, index){
  let { fieldGroupId, publicareaId } = action.data;
  
  let result = _.chain(state.data)
    .find(['$id', fieldGroupId])
    .get('field_group.public_areas')
    .find(['$id', publicareaId])
    .get('addresses')
    .findIndex(['$id', index])
    .value();

  return result;
}

// Checks
function isVisitClosedORefused(type){
  return [VisitType.closed, VisitType.refused].includes(type)
}