import React, {useEffect, useState} from 'react';
import {ImageBackground} from 'react-native';
import {observer} from 'mobx-react';
import LinearGradinet from 'react-native-linear-gradient';
import Focusable from './Focusable';
import TitleAndDesc from './TitleAndDes';
import useWidth from '../hooks/useWidth';
import {usePlayer} from '../hooks/useStores';
import {NavigationProp, useNavigation} from '@react-navigation/native';
const fm_icon = require('../assets/fm.png');

const FmButton: React.FC = observer(() => {
  const {randomPoster, loadFm, startGlobalRandom, isGlobalRandom} = usePlayer();

  const {w4, space} = useWidth();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadFm();
  }, []);

  return (
    <Focusable
      style={{
        height: w4,
        flex: 1,
        marginRight: space,
      }}
      onPress={async () => {
        if (!isGlobalRandom) {
          startGlobalRandom();
        }
        nav.navigate('Music');
      }}
      radius={10}
      ani>
      {randomPoster ? (
        <ImageBackground
          source={{
            uri: randomPoster,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover">
          <TitleAndDesc
            title="私人FM"
            desc="专属个性化推荐，发现更好音乐"
            icon={fm_icon}
          />
        </ImageBackground>
      ) : (
        <LinearGradinet
          style={{width: '100%', height: '100%'}}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={['#051937', '#A8EB12']}>
          <TitleAndDesc
            title="私人FM"
            desc="专属个性化推荐，发现更好音乐"
            icon={fm_icon}
          />
        </LinearGradinet>
      )}
    </Focusable>
  );
});

export default FmButton;
