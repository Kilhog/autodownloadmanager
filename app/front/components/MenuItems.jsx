import React, {PropTypes, Component} from 'react';
import classnames from 'classnames';
import * as _ from 'lodash';

class MenusItems extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {menu, actions} = this.props;

    return (
      <div className="scroller menu-items">
        {_.flatMapDeep(menu.items, (i) => [i, i.items]).map((item, i) =>  {
            switch(!!item.icon) {
              case false:
                return <header onClick={() => actions.changeMenu(item.id)} key={i}><span>{item.name}</span></header>;
              default:
                return <div onClick={() => actions.changeMenu(item.id)} key={i} className={classnames("menu menu-icon", {'selected': item.id === menu.idMenuSelected})}>
                  <a><div className={item.icon}></div><div className="menu-name">{item.name}</div></a>
                </div>;
            }
          }
        )}
      </div>
    );
  }
}

MenusItems.propTypes = {
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default MenusItems;
