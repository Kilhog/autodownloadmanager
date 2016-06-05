import {TOGGLE_SLIDE_PREFERENCE, CHANGE_MENU} from '../constants/ActionTypes';

const initialState = {
  isSlidePreferenceOpen: false,
  idMenuSelected: 2,
  items: [{
    id: 1,
    redirectId: 2, 
    name: 'Non Vus',
    items: [{
      id: 2,
      name: 'Épisodes',
      icon: 'icon-episodes'
    }, {
      id: 3,
      name: 'Films',
      icon: 'icon-films'
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
