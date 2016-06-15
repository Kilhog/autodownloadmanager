import {TOGGLE_SLIDE_PREFERENCE, CHANGE_MENU} from '../constants/ActionTypes';
import {take, fork} from 'redux-saga/effects'

function* watchNavigate() {
  while(true) {
    const test = yield take(CHANGE_MENU);
  }
}

export default function* root() {
  yield [fork(watchNavigate)]
}
