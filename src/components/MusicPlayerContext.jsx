import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const MusicPlayerContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({ children }) => {
 const [currentTrack, setCurrentTrack] = useState(null);

 const playTrack = (trackId, title, author, thumbnail) => {
    localStorage.setItem('currentTrack', trackId);
    localStorage.setItem('currentTrackTitle', title);
    localStorage.setItem('currentTrackAuthor', author);
    localStorage.setItem('currentTrackThumbnail', thumbnail);
    if (currentTrack) {
      stopTrack(currentTrack);
    }
    setCurrentTrack(trackId);
    startTrack(trackId);
 };

 const stopTrack = () => {
    const iframe = document.getElementById(`music-player`);
    if (iframe) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'stopVideo',
        args: [],
      }), '*');
    }
 };

 const startTrack = () => {
    const iframe = document.getElementById(`music-player`);
    if (iframe) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'playVideo',
        args: [],
      }), '*');
    }
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
