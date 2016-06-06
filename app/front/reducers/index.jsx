import {combineReducers} from 'redux';
import menu from './menu';
import episodesUnseen from './episodesUnseen'

const rootReducer = combineReducers({
  menu,
  episodesUnseen
});

export default rootReducer;
