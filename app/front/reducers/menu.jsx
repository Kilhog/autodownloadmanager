import {TOGGLE_SLIDE_PREFERENCE, CHANGE_MENU} from '../constants/ActionTypes';

const initialState = {
  isSlidePreferenceOpen: false,
  idMenuSelected: 1,
  items: [{
    id: 1,
    name: 'Non Vus',
    items: [{
      id: 1,
      name: 'Épisodes',
      icon: 'icon-friends'
    }, {
      id: 2,
      name: 'Films',
      icon: 'icon-friends'
    }]
  }]
};

export default function menu(state = initialState, action) {
  switch(action.type) {
    case TOGGLE_SLIDE_PREFERENCE:
      return Object.assign({}, state, {isSlidePreferenceOpen: !state.isSlidePreferenceOpen});
    case CHANGE_MENU:
      return Object.assign({}, state, {idMenuSelected: action.id});
    default:
      return state;
  }
}
