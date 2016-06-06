import React, { PropTypes, Component } from 'react';
import {DISPLAY_EPISODES, DISPLAY_FILMS} from '../constants/ComponentFilters';
import EpisodesNonVus from './EpisodesNonVus'

class RightWrapper extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {state} = this.props;
    let nameMenu = _.flatMapDeep(state.menu.items ,i => [i, i.items]).find(i => i.id === state.menu.idMenuSelected).name;
    let parentMenu = state.menu.items.find(i => _.some(i.items, ii => ii.id === state.menu.idMenuSelected));

    return (
      <div className="chat flex-vertical flex-spacer">
        <div className="title-wrap">
          <div className="title">
            <span className="channel-name"><span className="parent-name">{parentMenu ? parentMenu.name + " /" : ""}</span> {nameMenu}</span>
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
          <div className="flex-spacer flex-vertical">
            {this.renderComponentFilter()}
          </div>
        </div>
      </div>
    );
  }

  renderComponentFilter() {
    const {state} = this.props;
    switch(_.flatMapDeep(state.menu.items ,i => [i, i.items]).find(i => i.id === state.menu.idMenuSelected).componentFilter) {
      case DISPLAY_EPISODES:
        return <EpisodesNonVus episodesUnseen={state.episodesUnseen}/>;
      case DISPLAY_FILMS:
        return <div>FILMS</div>;
    }
  }
}

RightWrapper.propTypes = {
  state: PropTypes.object.isRequired
};

export default RightWrapper;
