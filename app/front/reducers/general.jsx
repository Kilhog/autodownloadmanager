import {TOGGLE_SLIDE_PREFERENCE} from '../constants/ActionTypes';

const initialState = {
  isSlidePreferenceOpen: false
};

export default function general(state = initialState, action) {
  switch(action.type) {
    case TOGGLE_SLIDE_PREFERENCE:
      return Object.assign({}, state, {isSlidePreferenceOpen: !state.isSlidePreferenceOpen});
    default:
      return state;
  }
}
