import Types from "../types/field_groups_types";
import Session from "../../services/Session";
import Store from "../../constants/Store";

import { client } from "../../services/ApolloClient";
import { genSecureHex } from "../../services/SecureRandom";


export function setFieldGroups(data){
  return {
    type: Types.UPDATE_FIELD_GROUPS,
    data: data
  };
}

export function getFieldGroups(){
  return (dispatch, getState) => {
    let state = getState()

    if(state.fieldGroups.data.length){
      return false;
    }

    if(Session.Storage.cache == null || Session.Storage.cache.data == null){
      // Get in API
      client(gql_get_field_groups)
      .then((response) => {
        // Criando ids únicos para todas as entidades recebidos
        let field_groups = response.data.field_groups.map(createUniqueIds);
        // Enviando para Store
        dispatch({ type: Types.UPDATE_FIELD_GROUPS, data: field_groups });
        // Guardando Alterações no Banco
        commit(getState);
      }).catch( error => console.log(error))
    } else{
      // Resgatando do Cache
      dispatch({ type: Types.UPDATE_FIELD_GROUPS, data: Session.Storage.cache.data });
    }
  }
}

export function addPublicArea(fieldGroupId, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.PUSH_PUBLIC_AREA, data: { fieldGroupId, newData } });
    // Guardando Alterações no Banco
    commit(getState);
  }
}

export function editPublicArea(fieldGroupId, record, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.EDIT_PUBLIC_AREA, data: { fieldGroupId, record, newData } });
    // Guardando Alterações no Banco
    commit(getState);
  }
}

export function removePublicArea(fieldGroupId, record){
  return (dispatch, getState) => {
    dispatch({ type: Types.REMOVE_PUBLIC_AREA, data: { fieldGroupId, record } });
    // Guardando Alterações no Banco
    commit(getState);
  }
}

export function addLocationInPublicArea(fieldGroupId, publicareaId, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.PUSH_LOCATION, data: { fieldGroupId, publicareaId, newData } });
    // Update LocalStorage
    commit(getState);
  }
}

export function updateLocationInPublicArea(fieldGroupId, publicareaId, record, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.EDIT_LOCATION, data: { fieldGroupId, publicareaId, record, newData } });
    // Update LocalStorage
    commit(getState);
  }
}

export function removeLocationInPublicArea(fieldGroupId, publicareaId, record){
  return (dispatch, getState) => {
    dispatch({ type: Types.REMOVE_LOCATION, data: { fieldGroupId, publicareaId, record } });
    // Update LocalStorage
    commit(getState);
  }
}

function createUniqueIds(mapping){
  let { field_group } = mapping
  field_group.$id = genSecureHex()
  field_group.mapping_id = mapping.id
  field_group.public_areas.map(createUniqueIdsForPublicAreas.bind(this))
  return field_group
}

function createUniqueIdsForPublicAreas(public_area){
  public_area.$id = genSecureHex()
  public_area.addresses.map(createUniqueIdsForAddresses)
  return public_area
}

function createUniqueIdsForAddresses(address){
  address.$id = genSecureHex()
  return address
}

function commit(getState){
  let state = getState();
  Session.Storage.create(state.currentUser.data.email, state.fieldGroups)
}

let gql_get_field_groups = {
  query:`query {
    mappings{
      id,
      cycle_id,
      field_group {
        id,
        name,
        neighborhood {
          name
        },
        public_areas {
          id,
          address,
          addresses,
          {
            id,
            number,
            complement,
            visits{
              type,
              check_in
            }
          }
        }
      }
    }
  }`
};
