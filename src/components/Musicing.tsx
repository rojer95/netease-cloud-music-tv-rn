import React from 'react';
import ImageSequence from 'react-native-image-sequence';
import styled from 'styled-components/native';

const Image = styled(ImageSequence)<Props>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;
interface Props {
  height: number;
  width: number;
}
export default ({width, height}: Props) => {
  return (
    <Image
      images={[
        require('../assets/gif_musicing_1.png'),
        require('../assets/gif_musicing_2.png'),
        require('../assets/gif_musicing_3.png'),
        require('../assets/gif_musicing_4.png'),
        require('../assets/gif_musicing_5.png'),
      ]}
      framesPerSecond={8}
      width={width}
      height={height}
    />
  );
};
