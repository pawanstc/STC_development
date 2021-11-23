import TrackPlayer from 'react-native-track-player';


export default async function trackPlayerService() {

    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());

    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());

    TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());
    TrackPlayer.addEventListener('remote-pause', (state) => console.log(state));

 }