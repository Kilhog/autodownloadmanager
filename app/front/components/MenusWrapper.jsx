import React, {PropTypes, Component} from 'react';
import mui from 'material-ui';
import classnames from 'classnames';
import MenuItems from './MenuItems';

class MenusWrapper extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {menu, actions} = this.props;

    return (
      <div className="flex-vertical menus-wrap">
        <div className="flex-vertical flex-spacer">
          <div onClick={actions.toogleSlidePreference} className={`menu-header ${menu.isSlidePreferenceOpen ? 'menu-header-open' : ''}`}>
            <header><span>AutoDownloadManager</span>
              <button type="button" className={classnames('btn btn-hamburger', {'btn-hamburger-open': menu.isSlidePreferenceOpen})}>
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
            <MenuItems menu={menu} actions={actions}/>
          </div>
        </div>

        <div className="account">
          <div className="avatar-small animate" style={{backgroundImage: "url('https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png')", backgroundSize: "30px 30px"}}>
            <div className="status status-online"></div>
          </div>
          <div className="account-details"><span className="username">Kilhog</span><span className="discriminator">#1356</span></div>
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

MenusWrapper.propTypes = {
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default MenusWrapper;
