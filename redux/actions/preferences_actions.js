import Actions from "../types/preferences_types";

export function setCity(data) {
  return { 
    type: Actions.SET_CITY,
     data 
  };
}