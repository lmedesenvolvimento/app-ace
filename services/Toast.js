import TimerMixin from 'react-timer-mixin';
import { Platform, ToastAndroid } from 'react-native';

export function simpleToast(text){
  if (Platform.OS == 'ios'){
    TimerMixin.setTimeout(() => alert(text), 800);
  } else{
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }
  return true;
}
