import React from 'react';

import LinearGradinet from 'react-native-linear-gradient';
import TitleAndDesc from './TitleAndDes';
import Focusable from './Focusable';
import useWidth from '../hooks/useWidth';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const rank_icon = require('../assets/rank.png');

const RankButton = () => {
  const {w4, space} = useWidth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Focusable
      style={{
        width: w4,
        height: w4,
        marginLeft: space,
      }}
      onPress={() => {
        navigation.navigate('Rank');
      }}
      radius={10}
      ani>
      <LinearGradinet
        style={{width: '100%', height: '100%'}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#9b63cd', '#e0708c']}>
        <TitleAndDesc
          title="排行榜"
          desc="汇聚热门榜单，任君挑选"
          icon={rank_icon}
        />
      </LinearGradinet>
    </Focusable>
  );
};

export default RankButton;
