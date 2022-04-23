import 'react';
import styled from 'styled-components/native';

interface TextProps {
  color?: string;
  size?: number;
}

export default styled.Text<TextProps>`
  color: ${props => props.color || '#ffffff'};
  font-size: ${props => (props.size ? `${props.size}px` : '14px')};
`;
