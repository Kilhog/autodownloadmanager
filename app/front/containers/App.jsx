import React, {Component, PropTypes} from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Toolbar from '../components/Toobar';
import LeftWrapper from '../components/LeftWrapper';
import MenusWrapper from '../components/MenusWrapper';
import RightWrapper from '../components/RightWrapper';
import * as GeneralActions from '../actions/general';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyRawTheme from '../material_ui_raw_theme_file';

class App extends Component {
  getChildContext() {
    return {muiTheme: getMuiTheme(MyRawTheme)};
  }

  render() {
    const {general, actions} = this.props;
    return (
      <div>
        <Toolbar/>
        <div className="app flex-vertical theme-dark">
          <div className="flex-vertical flex-spacer">
            <section className="flex-horizontal flex-spacer">
              <LeftWrapper/>
              <MenusWrapper actions={actions} general={general}/>
              <RightWrapper/>
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
  general: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    general: state.general
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(GeneralActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);