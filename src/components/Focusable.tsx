import React, {useEffect, useRef, useState} from 'react';
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TargetedEvent,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import uuid from 'react-native-uuid';
import {useGlobal} from '../hooks/useGlobal';
import {usePage} from '../hooks/usePage';

const TouchableOpacityContainer = styled(TouchableOpacity)<{
  focused?: boolean;
  disabled?: boolean;
  width?: number;
  radius?: number;
  ani?: boolean;
  shadow?: boolean;
}>`
  border: ${props => ('width' in props ? props.width : 4)}px solid
    ${props => (props.focused ? 'rgba(255,255,255,0.5)' : 'transparent')};
  border-radius: ${({radius = 0}) => (radius ? `${radius + 8}px` : '0px')};
  overflow: hidden;
  elevation: ${props => (props.focused && props.shadow ? 6 : 0)};
  box-shadow: ${props =>
    props.focused && props.shadow
      ? '6px 6px 6px rgba(0, 0, 0, 0.5)'
      : '0px 0px 0px rgba(0, 0, 0, 0)'};
  background: ${props =>
    props.focused && props.width === 0 ? 'rgba(0, 0, 0, 0.4)' : 'transparent'};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
`;

interface Props {
  onBlur?: ((e: NativeSyntheticEvent<TargetedEvent>) => void) | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  onFocus?: ((e: NativeSyntheticEvent<TargetedEvent>) => void) | undefined;
  width?: number;
  radius?: number;
  style?: any;
  ani?: boolean;
  disabled?: boolean;
  shadow?: boolean;
  hasTVPreferredFocus?: boolean;
  isTVSelectable?: boolean;
}

class FocusableHighlight extends React.Component<Props> {
  state = {
    focused: false,
  };

  render() {
    const {
      radius = 0,
      width = 4,
      ani = false,
      shadow = true,
      style,
      hasTVPreferredFocus = false,
      isTVSelectable = true,
      disabled = false,
      ...props
    } = this.props;

    return (
      <TouchableOpacityContainer
        activeOpacity={0.8}
        accessible={disabled ? false : isTVSelectable}
        hasTVPreferredFocus={hasTVPreferredFocus}
        radius={radius}
        width={width}
        shadow={shadow}
        focused={this.state.focused}
        ani={ani}
        onPress={(event: GestureResponderEvent) => {
          if (props.onPress && event.preventDefault) {
            if (disabled) return;
            props.onPress(event);
          }
        }}
        style={style}
        onFocus={event => {
          this.setState({
            focused: true,
          });
          if (props.onFocus) {
            props.onFocus(event);
          }
        }}
        onBlur={event => {
          this.setState({
            focused: false,
          });
          if (props.onBlur) {
            props.onBlur(event);
          }
        }}>
        {props.children || <View />}
      </TouchableOpacityContainer>
    );
  }
}
const FocusableHighlightAnimated =
  Animated.createAnimatedComponent(FocusableHighlight);

const FocusableHighlightWithAnimated: React.FC<
  Props & {
    ani?: boolean;
    defaultFocus?: boolean;
  }
> = ({children, isTVSelectable, defaultFocus = false, ...props}) => {
  const spinValue = useRef<any>(new Animated.Value(1));
  const fanim: any = useRef<any>(
    Animated.timing(spinValue.current, {
      toValue: 1.03,
      duration: 300,
      useNativeDriver: true,
      isInteraction: false,
    }),
  ).current;

  const banim: any = useRef<any>(
    Animated.timing(spinValue.current, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      isInteraction: false,
    }),
  ).current;

  const {page, fid, setFid, shouldRefreshFocus} = usePage();
  const {page: showPage} = useGlobal();

  const [uid] = useState<string>(uuid.v4() as string);

  return (
    <FocusableHighlightAnimated
      {...props}
      isTVSelectable={
        typeof isTVSelectable === 'boolean' ? isTVSelectable : showPage === page
      }
      hasTVPreferredFocus={
        shouldRefreshFocus && (fid ? fid === uid : defaultFocus)
      }
      style={{
        ...(props.style || {}),
        transform: [{scale: spinValue.current}],
      }}
      onPress={event => {
        setFid?.(uid);
        if (props.onPress && event.preventDefault) {
          props.onPress(event);
        }
      }}
      onFocus={event => {
        if (props.ani) {
          fanim.start();
        }
        if (props.onFocus) {
          props.onFocus(event);
        }
      }}
      onBlur={event => {
        if (props.ani) {
          banim.start();
        }
        if (props.onBlur) {
          props.onBlur(event);
        }
      }}>
      {children}
    </FocusableHighlightAnimated>
  );
};

export default FocusableHighlightWithAnimated;
