declare var alert: (msg: string, long?: any) => void;
declare module 'react-native-video';
declare module 'react-native-image-animation';
declare module '@unsw-gsbme/react-native-keep-awake';

type RootStackParamList = {
  Home: any;
  List: {title: string; id: number[] | number | string};
  Music: any;
  Login: any;
  Category: any;
  My: any;
  Rank: any;
};

declare var realIP: string;
