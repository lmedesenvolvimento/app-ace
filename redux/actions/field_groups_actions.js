import Types from "../types/field_groups_types";
import Session from "../../services/Session";
import Store from "../../constants/Store";

import { client } from "../../services/ApolloClient";

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
        dispatch({ type: Types.UPDATE_FIELD_GROUPS, data: response.data.field_groups });
        // Update LocalStorage
        commit(getState);
      }).catch( error => console.log(error))
    } else{
      // Get in Local Storage
      dispatch({ type: Types.UPDATE_FIELD_GROUPS, data: Session.Storage.cache.data });
    }
  }
}

export function addPublicArea(indexOfFieldGroup, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.PUSH_PUBLIC_AREA, data: { indexOfFieldGroup, newData } });
    // Update LocalStorage
    commit(getState);
  }
}

export function editPublicArea(indexOfFieldGroup, record, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.EDIT_PUBLIC_AREA, data: { indexOfFieldGroup, record, newData } });
    // Update LocalStorage
    commit(getState);
  }
}

export function removePublicArea(indexOfFieldGroup, record){
  return (dispatch, getState) => {
    dispatch({ type: Types.REMOVE_PUBLIC_AREA, data: { indexOfFieldGroup, record } });
    // Update LocalStorage
    commit(getState);
  }
}

export function addLocationInPublicArea(indexOfFieldGroup, indexOfPublicArea, newData){
  return (dispatch, getState) => {
    dispatch({ type: Types.PUSH_LOCATION, data: { indexOfFieldGroup, indexOfPublicArea, newData } });
    // Update LocalStorage
    commit(getState);
  }
}

function commit(getState){
  let state = getState();
  Session.Storage.create(state.currentUser.data.email, state.fieldGroups)
}

let gql_get_field_groups = {
  query:`query {
    field_groups {
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
  }`
};
