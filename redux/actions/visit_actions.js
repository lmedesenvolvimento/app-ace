import Types from '../types/visit_types';

export function setVisit(data) {
  return {
    type: Types.SET_VISIT,
    data: data
  };
}

export function clearVisit() {
  return {
    type: Types.CLEAR_VISIT
  };
}