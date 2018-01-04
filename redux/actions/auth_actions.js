import Types from "../types/auth_types";

export function toWaiting(){
  return {
    type: Types.WAITING
  };
}

export function toDone(){
  return {
    type: Types.DONE
  };
}
