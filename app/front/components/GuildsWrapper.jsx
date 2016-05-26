import React, { PropTypes, Component } from 'react';
import mui from 'material-ui';

class GuildsWrapper extends Component {
  render() {
    return (
      <div className="guilds-wrapper">
        <div className="guilds">
          <div className="guild">
            <div className="guild-inner" draggable="false" style={{borderRadius: '25px', backgroundColor: 'rgb(46, 49, 54)'}}><a draggable="false" className="" href="/channels/@me">
              <div className="friends-icon"></div>
            </a></div>
          </div>
          <div className="friends-online">0 en ligne</div>
          <span className="dms"/>
          <div className="guild-separator"></div>
          <div className="guild selected unread">
            <div draggable="true">
              <div className="guild-inner" draggable="false" style={{borderRadius: '15px'}}>
                <a draggable="false" className="avatar-small" href="/channels/110838748563914752/163668753874288640" style={{backgroundImage: 'url("https://cdn.discordapp.com/icons/110838748563914752/5d7eab04da5e6c5fb191cc3a016a685c.jpg")'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GuildsWrapper;
