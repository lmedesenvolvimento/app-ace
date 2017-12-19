import Types from "../types/user_types";

export function setUser(data){
  return {
    type: Types.UPDATE_LOCAL_PROFILE,
    data: data
  };
}

export function getUser(){
  return {
    type: Types.GET_PROFILE
  };
}
