import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Toolbar from '../components/Toobar';
import GuildsWrapper from '../components/GuildsWrapper';
import ChannelsWrapper from '../components/ChannelsWrapper';
import ChatWrapper from '../components/ChatWrapper';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyRawTheme from '../material_ui_raw_theme_file';

class App extends Component {
  getChildContext() {
    return {muiTheme: getMuiTheme(MyRawTheme)};
  }

  render() {
    const { todos, actions } = this.props;
    return (
      <div>
        <Toolbar/>
        <div className="app flex-vertical theme-dark">
          <div className="flex-vertical flex-spacer">
            <section className="flex-horizontal flex-spacer">
              <GuildsWrapper/>
              <ChannelsWrapper/>
              <ChatWrapper/>
            </section>
          </div>
        </div>
        {/*<Header addTodo={actions.addTodo} />*/}
        {/*<MainSection todos={todos} actions={actions} />*/}
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: PropTypes.object.isRequired
};

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
