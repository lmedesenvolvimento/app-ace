import Actions from "../types/publicareas_types";

export function setPublicAreas(data) {
  return { 
    type: Actions.SET_PUBLICAREAS,
     data 
  };
}

const getters = {
  getPublicAreasByNeighborhoodId(){
    return (dispatch, getState) => {
      const { publicareas } = getState();
      return publicareas.data;
    }
  }
}

export const PublicAreaMapGettersToProps = (dispatch) => {
  return bindActionCreators(getters, dispatch);
}