import React, {useContext, useEffect, useState} from 'react';
import {Lrc} from '@rojer/react-native-lrc';
import {ImageBackground, View} from 'react-native';
import Slider from '@react-native-community/slider';
import styled from 'styled-components/native';
import {useDebouncedCallback} from 'use-debounce';
import useWidth from '../hooks/useWidth';
import {Container, Flex, Page} from '../components/Layout';
import Text from '../components/Text';
import Poster from '../components/Poster';
import Focusable from '../components/Focusable';
import Button from '../components/Button';
import {usePlayer, useUser} from '../hooks/useStores';
import {observer} from 'mobx-react';
import {useGlobal} from '../hooks/useGlobal';

const LrcBox = styled.View<{height: number; width: number}>`
  height: ${props => `${props.height}px`};
  width: 100%;
`;

const ControlerBox = styled(Flex)`
  height: 100px;
  width: 100%;
  padding-bottom: 20px;
`;

const Icon = styled.Image<{size?: number}>`
  height: ${props => (props.size ? `${props.size}px` : '23px')};
  width: ${props => (props.size ? `${props.size}px` : '23px')};
`;
interface Props {}

const loops: any = {
  list: require('../assets/icon_loop_list.png'),
  random: require('../assets/icon_loop_random.png'),
  signal: require('../assets/icon_loop_signal.png'),
};

const SliderBar = observer(({seekTo}: {seekTo: any}) => {
  const {w1} = useWidth();
  const {progress} = usePlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const slideing = React.useRef<boolean>(false);

  useEffect(() => {
    if (!slideing.current) setCurrentTime(progress?.currentTime);
  }, [progress?.currentTime]);

  const slideTime = useDebouncedCallback((time: number) => {
    seekTo(parseInt(`${time}`, 0));
    setTimeout(() => {
      slideing.current = false;
    }, 1000);
  }, 1500);

  return (
    <Slider
      style={{width: w1, height: 40}}
      minimumValue={0}
      maximumValue={progress?.seekableDuration}
      thumbTintColor="#FFFFFF"
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#FFFFFF"
      value={currentTime}
      onValueChange={(time: any) => {
        slideing.current = true;
        slideTime(time);
      }}
    />
  );
});

const LrcBar = observer(({lyric, height}: {lyric: string; height: number}) => {
  const {progress} = usePlayer();
  const lineRenderer = React.useCallback(
    ({lrcLine: {content}, active}) => (
      <Text
        color={active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)'}
        size={active ? 28 : 18}
        numberOfLines={1}
        style={{textAlign: 'center'}}>
        {content}
      </Text>
    ),
    [],
  );

  return (
    <Lrc
      height={height * 0.5}
      lrc={lyric}
      currentTime={parseInt(`${progress?.currentTime * 1000}`, 0)}
      lineHeight={38}
      activeLineHeight={58}
      lineRenderer={lineRenderer}
      scrollEnabled={false}
    />
  );
});

const Music = observer(() => {
  const {
    current,
    playerState,
    setLoop,
    loop,
    lyric,
    pause,
    play,
    playNext,
    playPre,
    seekTo,
    isGlobalRandom,
    fmTrash,
  } = usePlayer();

  const {height, w3, w5} = useWidth();
  const [liked, setLiked] = React.useState(false);
  const {likelist, likeMusic} = useUser();

  const toggleLoop = () => {
    const next: any = {
      list: 'random',
      random: 'signal',
      signal: 'list',
    };
    setLoop?.(next[loop ?? 'list']);
  };

  const [poster, setPoster] = useState(null);
  const [alName, setAlName] = useState('');
  const [artName, setArtName] = useState('');

  useEffect(() => {
    setLiked(!!likelist?.includes(current?.id));
    setPoster(current?.album?.picUrl ?? current?.al?.picUrl);
    setAlName(current?.album?.name ?? current?.al?.name);
    setArtName(
      (current?.artists ?? current?.ar ?? [])
        ?.map((i: any) => i.name)
        .join('/'),
    );
  }, [current, likelist]);

  return (
    <Page pageId="Music">
      <View
        style={{
          position: 'relative',
        }}>
        {poster ? (
          <ImageBackground
            source={{uri: `${poster}?param=${w5}y${w5}`}}
            blurRadius={18}
            style={{
              height: '100%',
              width: '100%',
              opacity: 0.5,
              position: 'absolute',
              zIndex: 1,
            }}
          />
        ) : null}

        <Flex
          direction="column"
          style={{
            height: '100%',
            width: '100%',
            position: 'relative',
            zIndex: 998,
          }}>
          <Flex style={{flex: 1}} align="center" justify="center">
            <Poster />
            <View style={{marginLeft: 24, width: w3 * 2}}>
              <Flex
                style={{marginBottom: 12}}
                direction="column"
                justify="center"
                align="center">
                <Text
                  size={36}
                  numberOfLines={1}
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    marginBottom: 12,
                  }}>
                  {current?.name}
                </Text>

                <Flex justify="center" align="center">
                  <Text
                    color="rgba(255,255,255, 0.4)"
                    style={{marginRight: 10}}>
                    专辑：{alName}
                  </Text>

                  <Text color="rgba(255,255,255, 0.4)" style={{marginLeft: 10}}>
                    歌手：{artName}
                  </Text>
                </Flex>
              </Flex>

              <LrcBox height={height * 0.5} width={w3 * 2}>
                <LrcBar height={height} lyric={lyric || ''} />
              </LrcBox>
            </View>
          </Flex>

          <Container>
            <SliderBar seekTo={seekTo} />
          </Container>

          <ControlerBox justify="center" align="center" direction="column">
            <Flex align="center">
              {/* 循环模式 */}
              {isGlobalRandom ? null : (
                <Focusable
                  shadow={false}
                  radius={40}
                  onPress={toggleLoop}
                  style={{marginRight: 24}}>
                  <Button height={40} width={40} radius={40}>
                    <Icon source={loops[loop ?? 'list']} resizeMode="contain" />
                  </Button>
                </Focusable>
              )}

              {/* 不喜欢 */}
              {isGlobalRandom ? (
                <Focusable
                  shadow={false}
                  radius={40}
                  onPress={async () => {
                    await fmTrash(current?.id);
                  }}
                  style={{marginRight: 24}}>
                  <Button height={40} width={40} radius={40}>
                    <Icon
                      source={require('../assets/icon_dislike.png')}
                      resizeMode="contain"
                    />
                  </Button>
                </Focusable>
              ) : null}

              {/* 上一首 */}
              <Focusable
                shadow={false}
                radius={40}
                disabled={isGlobalRandom}
                onPress={async () => {
                  playPre?.();
                }}
                style={{marginRight: 24}}>
                <Button height={40} width={40} radius={40}>
                  <Icon
                    source={require('../assets/icon_pre.png')}
                    resizeMode="contain"
                  />
                </Button>
              </Focusable>

              {/* 播放 / 暂停 */}
              <Focusable
                shadow={false}
                radius={50}
                onPress={() => {
                  if (playerState === 'playing') {
                    pause?.();
                  }
                  if (playerState === 'stoped') {
                    play?.();
                  }
                }}
                defaultFocus>
                <Button height={50} width={50} radius={50}>
                  <Icon
                    source={
                      playerState === 'playing'
                        ? require('../assets/icon_pause.png')
                        : require('../assets/icon_play.png')
                    }
                    resizeMode="contain"
                  />
                </Button>
              </Focusable>

              {/* 下一首 */}
              <Focusable
                shadow={false}
                radius={40}
                onPress={async () => {
                  playNext?.();
                }}
                style={{marginLeft: 24}}>
                <Button height={40} width={40} radius={40}>
                  <Icon
                    source={require('../assets/icon_next.png')}
                    resizeMode="contain"
                  />
                </Button>
              </Focusable>

              {/* 喜欢 */}
              <Focusable
                shadow={false}
                radius={40}
                onPress={() => {
                  likeMusic(current?.id, !liked);
                }}
                style={{marginLeft: 24}}>
                <Button height={40} width={40} radius={40}>
                  <Icon
                    source={
                      liked
                        ? require('../assets/icon_liked.png')
                        : require('../assets/icon_like.png')
                    }
                    resizeMode="contain"
                  />
                </Button>
              </Focusable>
            </Flex>
          </ControlerBox>
        </Flex>
      </View>
    </Page>
  );
});

export default Music;
