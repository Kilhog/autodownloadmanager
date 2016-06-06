import React, {PropTypes, Component} from 'react';
import mui from 'material-ui';

class EpisodesNonVus extends Component {

  render() {
    const {episodesUnseen} = this.props;

    return (
      <div className="container-episodes">
           {episodesUnseen.map(i => <div key={i.id}>{i.title}</div>)}
      </div>
    );
  }
}

EpisodesNonVus.propTypes = {
  episodesUnseen: PropTypes.array.isRequired
};

export default EpisodesNonVus;
