import 'react';
import styled from 'styled-components/native';

interface ButtonStyleProps {
  width?: number;
  height?: number;
  radius?: number;
}

export default styled.View<ButtonStyleProps>`
  width: ${props => (props.width ? `${props.width}px` : '84px')};
  height: ${props => (props.height ? `${props.height}px` : '40px')};
  border-radius: ${props => (props.radius ? `${props.radius}px` : '30px')};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
`;
