import Types from "../types/user_types";

export function setUser(data){
  return {
    type: Types.UPDATE_LOCAL_PROFILE,
    data: data
  };
}
