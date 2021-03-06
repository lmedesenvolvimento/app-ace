import _ from 'lodash';
import { MappingStatus } from '../../types/mapping';
import field_groups_types from '../types/field_groups_types';
import { genSecureHex } from '../../services/SecureRandom';
import { VisitType } from '../../types/visit';

const initialState = {
  data: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  
  case field_groups_types.UPDATE_FIELD_GROUPS:
    return { ...state, data: action.data };
  
  case field_groups_types.TOGGLE_MAPPING_STATUS:
    var { fieldGroupId } = action.data;
    var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId]);

    state.data[indexOfFieldGroup].status = 
      state.data[indexOfFieldGroup].status ? MappingStatus.not_finished : MappingStatus.finished;

    return { ...state, data: state.data };

  case field_groups_types.PUSH_PUBLIC_AREA:
    var { fieldGroupId, newData } = action.data;

    // Criando Id para novo Logradouro
    newData.$id = genSecureHex();

    // Adicionando novo Logradouro
    _.find(state.data, ['$id', fieldGroupId]).field_group.field_group_public_areas.push(newData);

    return { ...state, data: state.data };

  case field_groups_types.EDIT_PUBLIC_AREA:
    var { fieldGroupId, record, newData } = action.data;

    // Mesclando informações do Logradouro
    var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId]);
    var indexOfPublicArea = getPublicAreaIndex(state, action, record.$id);

    var oldRecord = state.data[indexOfFieldGroup].field_group.field_group_public_areas[indexOfPublicArea];

    state
      .data[indexOfFieldGroup]
      .field_group
      .field_group_public_areas[indexOfPublicArea] = { ...oldRecord, ...newData };

    return { ...state, data: state.data };

  case field_groups_types.REMOVE_PUBLIC_AREA:
    var { fieldGroupId, record } = action.data;

    var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId])
    var indexOfPublicArea = getPublicAreaIndex(state, action, record.$id)

    // Deletando Logradouro
    state
      .data[indexOfFieldGroup]
      .field_group
      .field_group_public_areas.splice(indexOfPublicArea, 1);

    return { ...state, data: state.data };

  case field_groups_types.PUSH_LOCATION:
    var { fieldGroupId, publicareaId, newData } = action.data;

    var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId]);
    var indexOfPublicArea = getPublicAreaIndex(state, action, publicareaId);

    // Adicionando MappingId a visita
    newData.visit.mapping_id = state.data[indexOfFieldGroup].id;

    // Criando um Array para novas visitas
    newData.$id = genSecureHex();
    newData.census = [];
    newData.visits = [newData.visit];

    // console.log(fieldGroupId, publicareaId, indexOfFieldGroup, indexOfPublicArea)

    // console.log('field_group', state.data[indexOfFieldGroup].field_group)

    // Adicionando tipo da visita no endereço
    newData.type = newData.visit.type_location;

    // Adicionando nova Localização e Visita
    state
      .data[indexOfFieldGroup]
      .field_group
      .field_group_public_areas[indexOfPublicArea]
      .addresses.push(_.omit(newData, ['visit']));

    return { ...state, data: state.data };

  case field_groups_types.EDIT_LOCATION:
    var { fieldGroupId, publicareaId, record, newData } = action.data;

    var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId]);
    var indexOfPublicArea = getPublicAreaIndex(state, action, publicareaId);
    var indexOfAddress = getLocationIndex(state, action, record.$id);

    var lastVisit = _.last(record.visits);

    // Adicionando MappingId a visita
    newData.visit.mapping_id = state.data[indexOfFieldGroup].id;
    
    // Se a visita for fechada ou se a visita anterior for fechada adiciona mais uma visita ao endereço
    if ( _.isUndefined(lastVisit) ||  isVisitClosedORefused(newData.visit.type) || isVisitClosedORefused(lastVisit.type)) {
      let newVisit = _.clone(newData.visit);
      // Copiando visitas anteriores
      newData.visits = _.clone(record.visits);
      // Se nova visita for fechada removendo informações de coleta da visita passada
      if(isVisitClosedORefused(newData.visit.type)){
        newData.visits.push(_.omit(newVisit, ['id', 'inspect', 'treatment', 'samples']));
      } else {
        newData.visits.push(_.omit(newVisit, ['id']));
      }
    } else {
      // Mesclando alterações da última visíta
      var lastVisitIndex = _.findLastIndex(record.visits);
      record.visits[lastVisitIndex] = newData.visit;
    }

    // Adicionando tipo da visita no endereço
    newData.type = newData.visit.type_location

    // Atualizando Localização e Visita
    state
      .data[indexOfFieldGroup]
      .field_group
      .field_group_public_areas[indexOfPublicArea]
      .addresses[indexOfAddress] = _.omit(newData, ['visit']);

    return { ...state, data: state.data };

  case field_groups_types.REMOVE_LOCATION:
    var { fieldGroupId, publicareaId, record } = action.data;

    var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId]);
    var indexOfPublicArea = getPublicAreaIndex(state, action, publicareaId);
    var indexOfAddress = getLocationIndex(state, action, record.$id);

    // Deletando Endereço
    state
      .data[indexOfFieldGroup]
      .field_group
      .field_group_public_areas[indexOfPublicArea]
      .addresses.splice(indexOfAddress, 1)

    return { ...state, data: state.data }

  case field_groups_types.UPDATE_CENSUS:
      var { fieldGroupId, publicareaId, record, newData } = action.data;

      var indexOfFieldGroup = _.findIndex(state.data, ['$id', fieldGroupId]);
      var indexOfPublicArea = getPublicAreaIndex(state, action, publicareaId);
      var indexOfAddress = getLocationIndex(state, action, record.$id);

      // Atualizando Cencus
      state
        .data[indexOfFieldGroup]
        .field_group
        .field_group_public_areas[indexOfPublicArea]
        .addresses[indexOfAddress] = newData;

      return { ...state, data: state.data };
      
  default:
    return state;
  }
}

// Queries for Public Area
function getPublicAreaIndex(state, action, index) {
  let { fieldGroupId } = action.data;

  let result = _.chain(state.data)
    .find(['$id', fieldGroupId])
    .get('field_group.field_group_public_areas')
    .findIndex(['$id', index])
    .value();

  return result;
}

// Queries for Location
function getLocationIndex(state, action, index) {
  let { fieldGroupId, publicareaId } = action.data;

  let result = _.chain(state.data)
    .find(['$id', fieldGroupId])
    .get('field_group.field_group_public_areas')
    .find(['$id', publicareaId])
    .get('addresses')
    .findIndex(['$id', index])
    .value();

  return result;
}

// Checks
function isVisitClosedORefused(type) {
  return [VisitType.closed, VisitType.refused].includes(type)
}