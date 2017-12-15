import NetworkTypes from "../types/NetworkTypes";

const initialState = {
  isConnected: false
}

export default function reducer(state = initialState, action){
  switch (action.type) {
    case NetworkTypes.CONNECTED:
      return { ...state, isConnected: true }
    case NetworkTypes.NOTCONNECTED:
      return { ...state, isConnected: false }
    default:
      return state
  }
}
