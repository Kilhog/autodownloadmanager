import React, {PropTypes, Component} from 'react';
import mui from 'material-ui';

class GuildsWrapper extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {general, actions} = this.props;

    return (
      <div className="flex-vertical channels-wrap">
        <div className="flex-vertical flex-spacer">
          <div className={`guild-header ${general.isSlidePreferenceOpen ? 'guild-header-open' : ''}`}>
            <header><span>AperoDuCaptainWeb</span>
              <button onClick={actions.toogleSlidePreference} type="button" className={`btn btn-hamburger ${general.isSlidePreferenceOpen ? 'btn-hamburger-open' : ''}`}>
                <span/><span/><span/><span/><span/><span/>
              </button>
            </header>
            <ul>
              <li><a>Paramètres de notification</a></li>
              <li><a>Paramètres de confidentialité</a></li>
              <li><a className="red-highlight">Quitter le serveur</a></li>
            </ul>
          </div>
          <div className="scroller-wrap fade dark">
            <div className="scroller guild-channels">
              <div style={{width: '100%', height: 0, visibility: 'hidden'}}></div>
              <header><span>Salons textuels</span></header>
              <div className="channel channel-text" draggable="true"><a draggable="false" className="" href="/channels/110838748563914752/163674317207502849"><span
                className="channel-name">welcome</span>
              </a></div>
              <div className="channel channel-text selected" draggable="true"><a draggable="false" className="" href="/channels/110838748563914752/110838748563914752"><span className="channel-name">general</span>
              </a></div>
              <div className="channel channel-text" draggable="true"><a draggable="false" className="" href="/channels/110838748563914752/110866639448182784"><span
                className="channel-name">videos</span>
              </a></div>
              <div className="channel channel-text" draggable="true"><a draggable="false" className="" href="/channels/110838748563914752/163668753874288640"><span className="channel-name">questionpouruneinsertion</span>
              </a></div>
              <div className="channel channel-text unread" draggable="true"><a draggable="false" className="" href="/channels/110838748563914752/118493372628467718"><span className="channel-name">wazzufs</span>
              </a></div>
              <div className="channel channel-text" draggable="true"><a draggable="false" className="" href="/channels/110838748563914752/128431661195984896"><span
                className="channel-name">liens</span>
              </a></div>
              <div style={{width: '100%', height: '86px', visibility: 'hidden'}}></div>
            </div>
          </div>
        </div>

        <div className="account">
          <div className="avatar-small animate" style={{backgroundImage: "url('https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png')"}}>
            <div className="status status-online"></div>
          </div>
          <div className="account-details"><span className="username">Kilhog</span><span
            className="discriminator">#1356</span></div>
          <div className="btn-group">
            <button className="btn btn-mute"/>
            <button className="btn btn-deafen"/>
            <button className="btn btn-settings"/>
          </div>
        </div>
        <ul className="links">
          <li><a>Notes de mise à jour</a></li>
          <li><a>Télécharger les applications</a></li>
        </ul>
      </div>
    );
  }
}

GuildsWrapper.propTypes = {
  general: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default GuildsWrapper;
