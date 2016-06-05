import React, {Component, PropTypes} from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Toolbar from '../components/Toobar';
import LeftWrapper from '../components/LeftWrapper';
import MenusWrapper from '../components/MenusWrapper';
import RightWrapper from '../components/RightWrapper';
import * as MenuActions from '../actions/menu';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyRawTheme from '../material_ui_raw_theme_file';

class App extends Component {
  getChildContext() {
    return {muiTheme: getMuiTheme(MyRawTheme)};
  }

  render() {
    const {state, actions} = this.props;
    return (
      <div>
        <Toolbar/>
        <div className="app flex-vertical theme-dark">
          <div className="flex-vertical flex-spacer">
            <section className="flex-horizontal flex-spacer">
              <LeftWrapper/>
              <MenusWrapper actions={actions} menu={state.menu}/>
              <RightWrapper menu={state.menu}/>
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
  state: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MenuActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
