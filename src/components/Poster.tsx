import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, View, ImageBackground} from 'react-native';
import styled from 'styled-components/native';

import {Flex} from './Layout';
import useWidth from '../hooks/useWidth';
import {usePlayer} from '../hooks/useStores';
import {observer} from 'mobx-react';

const Container = styled.View<{size: number}>`
  height: ${props => `${props.size}px`};
  width: ${props => `${props.size}px`};
  border-radius: ${props => `${props.size}px`};
  overflow: hidden;
  position: relative;
`;

const Shadow = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
`;

const MBar = styled(Animated.Image)`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: -53%;
  right: -60%;
`;

const DURATION = 30000;
const PlayerPic = observer(() => {
  const {current, playerState} = usePlayer();
  const {w4, w6} = useWidth();
  const spinValue = useRef<any>(new Animated.Value(0));
  const barValue = useRef<any>(new Animated.Value(0));
  const resetValue = useRef<number>(0);

  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    if (current) {
      setUri(`${current?.album?.picUrl}?param=${w6}y${w6}`);
    }
  }, [current, w6]);

  const anim: any = useRef<any>(
    Animated.loop(
      Animated.timing(spinValue.current, {
        toValue: 1,
        duration: DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    ),
  );

  const barStartAnim: any = useRef<any>(
    Animated.timing(barValue.current, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      isInteraction: false,
    }),
  );

  const barStopAnim: any = useRef<any>(
    Animated.timing(barValue.current, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      isInteraction: false,
    }),
  );

  useEffect(() => {
    if (playerState !== 'playing') {
      barValue.current.setValue(1);
    }
    const pid = spinValue.current.addListener((v: any) => {
      resetValue.current = v.value;
    });
    return () => {
      spinValue.current && spinValue.current.removeListener(pid);
    };
  }, [playerState]);

  useEffect(() => {
    console.log('playerState', playerState);

    if (playerState === 'playing') {
      let reset = 1 - resetValue.current;
      if (reset >= 1) reset = 0;
      barStartAnim.current.start();
      Animated.timing(spinValue.current, {
        toValue: 1,
        duration: DURATION * reset,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished) {
          spinValue.current.setValue(0);
          anim.current.start();
        }
      });
    }

    if (playerState !== 'playing') {
      anim.current.stop();
      barStopAnim.current.start();
    }
  }, [playerState]);

  return (
    <View>
      <ImageBackground
        source={require('../assets/m_bg.png')}
        style={{width: w4, height: w4}}
        resizeMode="contain">
        <MBar
          source={require('../assets/m_bar.png')}
          resizeMode="contain"
          style={{
            transform: [
              {
                rotate: barValue.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-30deg'],
                }),
              },
            ],
          }}
        />
        <Flex
          style={{height: '100%', width: '100%'}}
          align="center"
          justify="center">
          {uri ? (
            <Container size={w6}>
              <Shadow
                style={{
                  borderRadius: w6,
                }}
              />
              <View
                style={{
                  position: 'relative',
                }}>
                <Animated.Image
                  source={{
                    uri: uri,
                    width: w6,
                    height: w6,
                  }}
                  resizeMode="cover"
                  style={{
                    borderRadius: w6,
                    transform: [
                      {
                        rotate: spinValue.current.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  }}
                />
              </View>
            </Container>
          ) : null}
        </Flex>
      </ImageBackground>
    </View>
  );
});

export default PlayerPic;
