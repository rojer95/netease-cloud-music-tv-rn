import styled from 'styled-components/native';

const Icon = styled.Image<{size?: number}>`
  height: ${props => (props.size ? `${props.size}px` : '23px')};
  width: ${props => (props.size ? `${props.size}px` : '23px')};
`;

export default Icon;
