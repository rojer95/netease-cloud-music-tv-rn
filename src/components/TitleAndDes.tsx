import React from 'react';
import styled from 'styled-components/native';
import {Image, View} from 'react-native';
import {Flex} from './Layout';
import Text from './Text';

const Shadow = styled(Flex)`
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
`;

interface TitleAndDescProps {
  title?: string;
  desc?: string;
  icon?: any;
}

const TitleAndDesc: React.FC<TitleAndDescProps> = ({title, desc, icon}) => {
  return (
    <Shadow direction="column" align="center" justify="center">
      <Flex style={{marginBottom: 12}} align="center" justify="center">
        {icon ? (
          <Image
            source={icon}
            style={{width: 28, height: 28, marginRight: 12}}
            resizeMode="contain"
          />
        ) : null}

        <Text style={{marginRight: icon ? 12 : 0}} size={28}>
          {title}
        </Text>
      </Flex>
      {desc ? (
        <View>
          <Text size={12} color="rgba(255,255,255,0.7)">
            {desc}
          </Text>
        </View>
      ) : null}
    </Shadow>
  );
};

export default TitleAndDesc;
