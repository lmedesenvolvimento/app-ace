import ui_types from '../types/ui_types';

export function toggleLoading(){
  return {
    type: ui_types.TOGGLE_LOADING
  };
}

export function openLoading(){
  return {
    type: ui_types.OPEN_LOADING
  };
}

export function closeLoading(){
  return {
    type: ui_types.CLOSE_LOADING
  };
}