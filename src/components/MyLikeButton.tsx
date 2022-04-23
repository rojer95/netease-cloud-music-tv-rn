import React, {useEffect, useState} from 'react';
import {ImageBackground, ToastAndroid} from 'react-native';
import {observer} from 'mobx-react';
import LinearGradinet from 'react-native-linear-gradient';
import Focusable from './Focusable';

import TitleAndDesc from './TitleAndDes';
import useWidth from '../hooks/useWidth';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useUser} from '../hooks/useStores';
const mylike_icon = require('../assets/mylike.png');

const MyLikeButton = observer(() => {
  const {w4, space} = useWidth();

  const {myLike, logined} = useUser();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Focusable
      style={{
        height: w4,
        flex: 1,
        marginRight: space,
      }}
      onPress={() => {
        if (logined) {
          navigation.navigate({
            name: 'List',
            params: myLike,
          });
        } else {
          global.alert('请先登录', ToastAndroid.SHORT);
        }
      }}
      radius={10}
      ani>
      {myLike?.coverImgUrl ? (
        <ImageBackground
          source={{
            uri: myLike?.coverImgUrl,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover">
          <TitleAndDesc
            title="我喜欢的"
            desc="【点击查看详情】"
            icon={mylike_icon}
          />
        </ImageBackground>
      ) : (
        <LinearGradinet
          style={{width: '100%', height: '100%'}}
          start={{x: 1, y: 1}}
          end={{x: 0, y: 0}}
          colors={['#cacaca', '#ececec']}>
          <TitleAndDesc
            title="我喜欢的"
            desc="【点击查看详情】"
            icon={mylike_icon}
          />
        </LinearGradinet>
      )}
    </Focusable>
  );
});

export default MyLikeButton;
