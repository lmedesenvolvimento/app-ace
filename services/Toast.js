import { Platform, ToastAndroid } from "react-native";

export function simpleToast(text){
  if (Platform.OS == 'ios'){
    alert(text);
  } else{
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }
  return true;
}
