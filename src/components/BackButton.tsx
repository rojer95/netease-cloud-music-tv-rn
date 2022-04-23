import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import Focusable from './Focusable';
import Icon from './Icon';

const BackButton = () => {
  const [isFocused, setIsFocused] = React.useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  React.useEffect(
    () =>
      navigation.addListener('focus', () => {
        setIsFocused(true);
      }),
    [navigation],
  );
  React.useEffect(
    () =>
      navigation.addListener('blur', () => {
        setIsFocused(false);
      }),
    [navigation],
  );

  return (
    <Focusable
      shadow={false}
      onPress={() => {
        navigation.goBack();
      }}
      isTVSelectable={isFocused}
      radius={40}
      width={0}
      style={{
        opacity: 0.5,
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 'auto',
        marginLeft: 10,
      }}>
      <Icon
        source={require('../assets/icon_back.png')}
        resizeMode="contain"
        size={20}
      />
    </Focusable>
  );
};

export default BackButton;
