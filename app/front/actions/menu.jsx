import * as types from '../constants/ActionTypes';

export function toogleSlidePreference() {
  return {type: types.TOGGLE_SLIDE_PREFERENCE};
}

export function changeMenu(id) {
  return {type: types.CHANGE_MENU, id};
}
