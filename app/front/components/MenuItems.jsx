import React, {PropTypes, Component} from 'react';
import classnames from 'classnames';

class MenusItems extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {menu, actions} = this.props;

    return (
      <div className="scroller menu-items">
        <header>
          <span>Non Vus</span>
        </header>
        <div className="menu menu-icon btn-friends selected">
          <a>
            <div className="icon-friends"></div>
            <div className="menu-name">Amis</div>
          </a>
        </div>
        <div className="menu menu-text">
          <a>
            <span className="menu-name">Épisodes</span>
          </a>
        </div>
        <div className="menu menu-text">
          <a>
            <span className="menu-name">Films</span>
          </a>
        </div>
      </div>
    );
  }
}

MenusItems.propTypes = {
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default MenusItems;
