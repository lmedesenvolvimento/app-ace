import Types from "../types/field_groups_types";
import { client } from "../../services/ApolloClient";

import Store from "../../constants/Store";

export function setFieldGroups(data){
  return {
    type: Types.UPDATE_FIELD_GROUPS,
    data: data
  };
}

export function getFieldGroups(){
  return (dispatch, getState) => {
    client(gql_get_field_groups)
    .then((response) => {
      dispatch({ type: Types.UPDATE_FIELD_GROUPS, data: response.data.field_groups })
    }).catch( error => console.log(error))
  }
}

let gql_get_field_groups = {
  query:`query {
    field_groups {
      id
      name
      neighborhood {
        id
        name
      }
    }
  }`
};
