import React, {useContext, useEffect, useState} from 'react';
import Video from 'react-native-video';
import throttle from 'lodash.throttle';

import {usePlayer} from '../hooks/useStores';
import {observer} from 'mobx-react';
import {auto_song_url, lyric as lyricApi} from '../apis';

export default observer(() => {
  const {
    current,
    setLyric,
    setPlayer,
    setPlayerState,
    loop,
    paused,
    playNext,
    pause,
    play,
    playerState,
    setProgress,
  } = usePlayer();
  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    if (current) {
      startPlay(current);
    }
  }, [current]);

  const loadLrc = async (item: any) => {
    setLyric?.('[00:00.00]歌词加载中..');
    try {
      const lrc = await lyricApi(item.id);
      setLyric?.(lrc);
    } catch (error) {
      setLyric?.('[00:00.00]暂无歌词');
    }
  };

  const updateProgress = throttle((e: any) => {
    setProgress(e);
  }, 400);

  const startPlay = async (item: any) => {
    setProgress({currentTime: 0, seekableDuration: 0});
    pause();
    await loadLrc(item);
    console.log('url', auto_song_url(item.id));
    setUri(auto_song_url(item.id));
    play();
  };

  return uri ? (
    <Video
      source={{uri: uri}}
      ref={(ref: any) => setPlayer(ref)}
      onLoad={() => {
        setPlayerState?.('playing');
      }}
      onProgress={(e: any) => {
        if (playerState === 'playing') {
          updateProgress(e);
        }
      }}
      onEnd={() => {
        console.log('onEnd');
        playNext();
      }}
      repeat={loop === 'signal'}
      paused={paused}
      audioOnly
      // playInBackground
    />
  ) : null;
});
