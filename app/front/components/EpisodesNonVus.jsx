import React, {PropTypes, Component} from 'react';
import mui from 'material-ui';

class EpisodesNonVus extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {

  }

  render() {
    const {episodesUnseen, actions} = this.props;

    return (
      <div className="container-series">
           {episodesUnseen.map(i =>
             <div key={i.id}>
               <div className="poster-series"><img src={i.poster}/></div>
               <div className="title-series">{i.title}</div>
             </div>
           )}
      </div>
    );
  }
}

EpisodesNonVus.propTypes = {
  episodesUnseen: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default EpisodesNonVus;
