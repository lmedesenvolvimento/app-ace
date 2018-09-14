import Types from '../types/field_groups_types';
import Session from '../../services/Session';

import { client } from '../../services/ApolloClient';
import { genSecureHex } from '../../services/SecureRandom';
import { simpleToast } from '../../services/Toast';

import _ from 'lodash';

import { ActionConst, Actions } from 'react-native-router-flux';


export function setFieldGroups(data){
  return {
    type: Types.UPDATE_FIELD_GROUPS,
    data: data
  };
}

export function toggleMappingStatus(fieldGroupId){
  return {
    type: Types.TOGGLE_MAPPING_STATUS,
    data: {
      fieldGroupId
    }
  };
}

export function getFieldGroups(callback, onFail){
  return (dispatch, getState) => {
    let state = getState();

    if(state.fieldGroups.data.length){
      return false;
    }

    Session.Storage.get(state.currentUser.data.email).then((response) => {
      let storageData = null;
      
      response 
        ? storageData = response.data
        : storageData = [];

      if (Session.Storage.cache == null || Session.Storage.cache.data == null || _.isEmpty(storageData)) {
        // Get in API
        fetchFieldGroupsInGraph(dispatch, getState, callback, onFail);
      } else{
        // Resgatando do Cache
        dispatch({ type: Types.UPDATE_FIELD_GROUPS, data: Session.Storage.cache.data });
      }
    });
  };
}
// Use for dev tests
// export function _fetchFieldGroupsInGraph(callback, onFail){
//   return (dispatch, getState) => {
//     fetchFieldGroupsInGraph(dispatch, getState, callback, onFail);
//   };
// }

function fetchFieldGroupsInGraph(dispatch, getState, callback, onFail){
  client(gql_get_field_groups)
    .then((response) => {
      // Criando ids únicos para todas as entidades recebidos
      let field_groups = response.data.mappings.map(createUniqueIds);
      // Enviando para Store
      dispatch({ type: Types.UPDATE_FIELD_GROUPS, data: field_groups });
      // Guardando Alterações no Banco
      commit(getState);
      // sucess callback
      return callback ? callback(field_groups) : false;
    }).catch(({ response }) => {
      let msg = null;

      if(!response) {
        simpleToast('Error desconhecido. Por favor informe ao administrador');
      }

      switch (response.status) {
      case 200:
        msg = 'Sessão de usuário já expirada, por favor efetue login novamente e tente de novo.';
        // user feedback
        simpleToast(msg);
        // Redirect for unauthorized
        Actions.unauthorized({type: ActionConst.RESET});
        break;
      default:
        msg = 'Falha na recuperação dos dados. Por favor informe ao administrador.';
        // user feedback
        simpleToast(msg);
        break;
      }

      return onFail ? onFail(msg) : false;
    });
}

export function addPublicArea(fieldGroupId, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.PUSH_PUBLIC_AREA, data: { fieldGroupId, newData } });
    // Guardando Alterações no Banco
    commit(getState);
  };
}

export function editPublicArea(fieldGroupId, record, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.EDIT_PUBLIC_AREA, data: { fieldGroupId, record, newData } });
    // Guardando Alterações no Banco
    commit(getState);
  };
}

export function removePublicArea(fieldGroupId, record){
  return (dispatch, getState) => {
    dispatch({ type: Types.REMOVE_PUBLIC_AREA, data: { fieldGroupId, record } });
    // Guardando Alterações no Banco
    commit(getState);
  };
}

export function addLocationInPublicArea(fieldGroupId, publicareaId, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.PUSH_LOCATION, data: { fieldGroupId, publicareaId, newData } });
    // Update LocalStorage
    commit(getState);
  };
}

export function updateLocationInPublicArea(fieldGroupId, publicareaId, record, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.EDIT_LOCATION, data: { fieldGroupId, publicareaId, record, newData } });
    // Update LocalStorage
    commit(getState);
  };
}

export function removeLocationInPublicArea(fieldGroupId, publicareaId, record){
  return (dispatch, getState) => {
    dispatch({ type: Types.REMOVE_LOCATION, data: { fieldGroupId, publicareaId, record } });
    // Update LocalStorage
    commit(getState);
  };
}

function createUniqueIds(mapping){
  let { field_group } = mapping;

  mapping.$id = genSecureHex();
  
  field_group.mapping_id = mapping.id;
  field_group.public_areas.map(createUniqueIdsForPublicAreas.bind(this));
  return mapping;
}

function createUniqueIdsForPublicAreas(public_area){
  public_area.$id = genSecureHex();
  public_area.addresses.map(createUniqueIdsForAddresses);
  return public_area;
}

function createUniqueIdsForAddresses(address){
  address.$id = genSecureHex();
  return address;
}

function commit(getState){
  let state = getState();
  Session.Storage.create(state.currentUser.data.email, state.fieldGroups);
}

let gql_get_field_groups = {
  query:`query {
    mappings{
      id,
      cycle_id,
      status,
      field_group {
        id,
        name,
        neighborhood {
          name
        },
        public_areas {
          id,
          type,
          address,
          addresses
          {
            id,
            number,
            complement,
            visits{
              id,
              type,
              check_in
            },
            census {
              id
              inhabitants
              cistern
              drum
              filter
              plant_pot
              pot
              tank
              tina
              water_box
              waterhole
            }
          }
        }
      }
    }
  }`
};
