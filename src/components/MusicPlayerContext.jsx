import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const MusicPlayerContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({ children }) => {
 const [currentTrack, setCurrentTrack] = useState(null);

 const playTrack = (trackId, title, author, thumbnail) => {
  if (trackId !== null) {
    localStorage.setItem('currentTrack', trackId);
    localStorage.setItem('currentTrackTitle', title);
    localStorage.setItem('currentTrackAuthor', author);
    localStorage.setItem('currentTrackThumbnail', thumbnail);
    localStorage.setItem('currentTrackLyrics', null);
    localStorage.setItem('addMusicCount', localStorage.getItem('addMusicCount') ? Number(localStorage.getItem('addMusicCount')) + 1 : 1);
  }
  if (currentTrack) {
    stopTrack(currentTrack);
  }
  setCurrentTrack(trackId);
  startTrack(trackId);
 };

 const stopTrack = () => {
  setCurrentTrack(null);
 };

 const startTrack = () => {
 };

 return (
  <MusicPlayerContext.Provider value={{ playTrack, stopTrack, currentTrack }}>
    {children}
  </MusicPlayerContext.Provider>
 );
};

MusicPlayerProvider.propTypes = {
 children: PropTypes.node.isRequired,
};
