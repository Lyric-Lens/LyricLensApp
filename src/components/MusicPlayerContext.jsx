import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MusicPlayerContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({ children }) => {
 const [currentTrack, setCurrentTrack] = useState(null);

 // Load the current track from localStorage when the component mounts
 useEffect(() => {
    const storedTrack = localStorage.getItem('currentTrack');
    if (storedTrack) {
      setCurrentTrack(storedTrack);
      startTrack(storedTrack);
    }
 }, []);

 const playTrack = (trackId) => {
    if (currentTrack) {
      stopTrack(currentTrack);
    }
    setCurrentTrack(trackId);
    localStorage.setItem('currentTrack', trackId);
    startTrack(trackId);
 };

 const stopTrack = (trackId) => {
    const iframe = document.getElementById(`youtube-player-${trackId}`);
    if (iframe) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'stopVideo',
        args: [],
      }), '*');
    }
 };

 const startTrack = (trackId) => {
    const iframe = document.getElementById(`youtube-player-${trackId}`);
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
