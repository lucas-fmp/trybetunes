import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loading from '../pages/Loading';
import { addSong, removeSong } from '../services/favoriteSongsAPI';

export default class MusicCard extends Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.verifyingFavorite = this.verifyingFavorite.bind(this);

    this.state = {
      isSaving: false,
      isChecked: false,
    };
  }

  componentDidMount() {
    this.verifyingFavorite();
  }

  async onChange({ target }) {
    const { track, updateFavorites } = this.props;
    const { isChecked } = this.state;
    const { checked } = target;
    await this.setState({ isSaving: true, isChecked: !isChecked });
    if (checked === true) {
      await addSong(track);
      await this.setState({
        isSaving: false,
      });
    } else {
      await removeSong(track);
      await updateFavorites();
      await this.setState({ isSaving: false });
    }
  }

  async verifyingFavorite() {
    const { favoriteSongs, track } = this.props;
    const verifyingFavorite = favoriteSongs
      .filter((song) => song.trackName === track.trackName);
    if (verifyingFavorite.length === 0) {
      await this.setState({ isChecked: false });
    } else {
      await this.setState({ isChecked: true });
    }
  }

  render() {
    const { track } = this.props;
    const { trackName, previewUrl, trackId } = track;
    const { isChecked, isSaving } = this.state;
    return (
      <ul>
        <li>
          <p>{trackName}</p>
          <audio data-testid="audio-component" src={ previewUrl } controls>
            <track kind="captions" />
            O seu navegador não suporta o elemento
            <code>audio</code>
          </audio>
          {
            isSaving ? <Loading /> : (
              <label
                data-testid={ `checkbox-music-${trackId}` }
                htmlFor={ trackId }
              >
                Favorita
                <input
                  type="checkbox"
                  id={ trackId }
                  onChange={ this.onChange }
                  checked={ isChecked }
                />
              </label>
            )
          }
        </li>
      </ul>
    );
  }
}

MusicCard.propTypes = {
  favoriteSongs: PropTypes.arrayOf(PropTypes.any).isRequired,
  track: PropTypes.shape({
    previewUrl: PropTypes.string.isRequired,
    trackId: PropTypes.number.isRequired,
    trackName: PropTypes.string.isRequired,
  }).isRequired,
  updateFavorites: PropTypes.func.isRequired,
};
