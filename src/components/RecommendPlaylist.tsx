import React from 'react';
import LinearGradinet from 'react-native-linear-gradient';
import styled from 'styled-components/native';

import Text from './Text';
import Focusable from './Focusable';
import useWidth from '../hooks/useWidth';
import {Flex} from './Layout';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const Item = styled.ImageBackground`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Name = styled(LinearGradinet)`
  height: 50%;
  width: 100%;
  position: absolute;
  left: 0px;
  bottom: 0px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
`;
export const RecommendItem: React.FC<{
  detail: any;
  width?: number;
}> = ({detail, width}) => {
  const {w5, space} = useWidth();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Focusable
      style={{
        width: width || w5,
        height: width || w5,
        marginBottom: space,
      }}
      onPress={() => {
        if (!detail?.name) return;
        navigation.navigate({
          name: 'List',
          params: {
            title: detail.name,
            id: detail.id,
          },
        });
      }}
      radius={10}
      ani>
      <Item
        source={{
          uri: `${detail?.picUrl || detail?.coverImgUrl}?param=${width || w5}y${
            width || w5
          }`,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover">
        <Name
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          colors={['#000000', 'rgba(0,0,0,0)']}>
          <Text numberOfLines={2}>{detail?.name}</Text>
        </Name>
      </Item>
    </Focusable>
  );
};

const RecommendPlaylist = ({cruteria}: {cruteria: any[]}) => {
  return (
    <Flex style={{width: '100%'}} wrap="wrap" justify="space-between">
      {cruteria?.map((i: any) => (
        <RecommendItem key={i.name} detail={i} />
      ))}
    </Flex>
  );
};

export default RecommendPlaylist;
