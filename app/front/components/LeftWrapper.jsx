import React, { PropTypes, Component } from 'react';
import mui from 'material-ui';

class LeftWrapper extends Component {
  render() {
    return (
      <div className="left-wrapper">
        <div className="icones-items">
          <div className="icone-item">
            <div className="icone-item-inner" style={{borderRadius: '25px', backgroundColor: 'rgb(46, 49, 54)'}}>
              <a>
                <div className="friends-icon"></div>
              </a>
            </div>
          </div>
          <div className="friends-online">0 en ligne</div>
          <span className="dms"/>
          <div className="icone-item-separator"></div>
          <div className="icone-item selected unread">
            <div draggable="true">
              <div className="icone-item-inner" draggable="false" style={{borderRadius: '15px'}}>
                <a draggable="false" className="avatar-small" href="https://discordapp.com/assets/channels/110838748563914752/163668753874288640" style={{backgroundImage: 'url("https://cdn.discordapp.com/icons/110838748563914752/5d7eab04da5e6c5fb191cc3a016a685c.jpg")'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeftWrapper;
