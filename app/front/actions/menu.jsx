import {TOGGLE_SLIDE_PREFERENCE, CHANGE_MENU} from '../constants/ActionTypes';

export function toogleSlidePreference() {
  return {type: TOGGLE_SLIDE_PREFERENCE};
}

export function changeMenu(id) {
  return {type: CHANGE_MENU, id};
}
