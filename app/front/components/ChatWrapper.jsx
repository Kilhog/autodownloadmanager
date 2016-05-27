import React, { PropTypes, Component } from 'react';

class ChatWrapper extends Component {
  render() {
    return (
      <div className="chat flex-vertical flex-spacer">
        <div className="title-wrap">
          <div className="title">
            <span className="channel-name">welcome</span>
          </div>
          <div className="no-topic"></div>
          <div className="header-toolbar">
            <button type="button" className="">
              <span style={{backgroundImage: 'url("https://discordapp.com/assets/70b7e4bf8b79bb44805705ef2611393b.svg")'}}/>
            </button>
            <button type="button" className="active">
              <span style={{backgroundImage: 'url("https://discordapp.com/assets/535815751d1ba2ac3d45300dca6356d9.svg")'}}/>
            </button>
            <div className="separator"></div>
            <button type="button" className="">
              <span style={{backgroundImage: 'url("https://discordapp.com/assets/cfb80ab4c0c135cdcb4dbcf0db124c4d.svg")'}}/>
            </button>
          </div>
        </div>
        <div className="content flex-spacer flex-horizontal">
          <div className="flex-spacer flex-vertical"></div>
        </div>
      </div>
    );
  }
}

export default ChatWrapper;
