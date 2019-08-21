import { bindActionCreators } from 'redux';
import Actions from "../types/publicareas_types";

import { filter } from 'lodash';

export function setPublicAreas(data) {
  return { 
    type: Actions.SET_PUBLICAREAS,
     data 
  };
}

const getters = {
  getPublicAreasByNeighborhoodId(neighborhood_id){
    return (dispatch, getState) => {
      const { data } = getState().publicareas;
      const result = filter(data, p => p.neighborhood_id.toString() === neighborhood_id);
      return result;
    }
  }
}

export const PublicAreaMapGettersToProps = (dispatch) => {
  return bindActionCreators(getters, dispatch);
}