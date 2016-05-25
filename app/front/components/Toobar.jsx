import React, { PropTypes, Component } from 'react';
import mui from 'material-ui';

class Toolbar extends Component {
  render() {
    return (
      <div className="titlebar">
        <div className="titlebar-edge"></div>
        <div className="osx-buttons">
          <button className="osx-close"/>
          <button className="osx-minimize"/>
          <button className="osx-maximize"/>
        </div>
      </div>
    );
  }
}

export default Toolbar;

