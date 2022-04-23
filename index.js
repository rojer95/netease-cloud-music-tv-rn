/**
 * @format
 */

import 'react-native/tvos-types.d';

import {AppRegistry, ToastAndroid} from 'react-native';
import App from './App';
import app from './app.json';

global.alert = (msg, long = ToastAndroid.LONG) => {
  ToastAndroid.showWithGravity(msg, long, ToastAndroid.CENTER);
};

AppRegistry.registerComponent(app.name, () => App);
