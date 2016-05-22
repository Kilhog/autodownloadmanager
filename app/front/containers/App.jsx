import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyRawTheme from '../material_ui_raw_theme_file';
const muiTheme = getMuiTheme(MyRawTheme);

class App extends Component {
  render() {
    const { todos, actions } = this.props;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header addTodo={actions.addTodo} />
          <MainSection todos={todos} actions={actions} muiTheme={muiTheme} />
        </div>
      </MuiThemeProvider>
    );
  }
}


App.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
