import Actions from "../types/network_types";

export function setStatusOnline() {
  return { type: Actions.CONNECTED };
}

export function setStatusOffline() {
  return { type: Actions.NOTCONNECTED };
}
