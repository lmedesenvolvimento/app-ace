import { ActionConst } from 'react-native-router-flux';

export default function reducer(state = {}, action) {
  console.log(action)
  switch (action.type) {
    case ActionConst.FOCUS:
      return {
        ...state,
        scene: action.scene,
      };

      default:
        return state;
    }
}
