import React, {useEffect, useState} from 'react';
import Home from './src/pages/Home';
import List from './src/pages/List';
import Music from './src/pages/Music';
import Login from './src/pages/Login';
import My from './src/pages/My';
import Rank from './src/pages/Rank';
import Category from './src/pages/Category';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useKeepAwake} from '@unsw-gsbme/react-native-keep-awake';

import GlobalContext from './src/contexts/global';
import BackButton from './src/components/BackButton';
import GlobalPlayer from './src/components/GlobalPlayer';
import {useUser} from './src/hooks/useStores';

const Stack = createStackNavigator<RootStackParamList>();

const optionGeter = (name: string) => {
  return {
    headerStyle: {
      backgroundColor: '#363636',
    },
    headerTitleStyle: {
      color: '#FFFFFF',
    },
    headerTitle: name,
    headerLeft: () => <BackButton />,
  };
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('Home');
  const [pageLastFocus, setPageLastFocus] = useState<Record<string, string>>(
    {},
  );

  const [cruteria, setCruteria] = useState<any[]>([]);
  useKeepAwake();

  const {loadUserInfo} = useUser();

  useEffect(() => {
    loadUserInfo();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        cruteria,
        setCruteria,
        page: currentPage,
        setPage: setCurrentPage,
        pageLastFocus,
        setPageLastFocus: (page: string, uuid: string) => {
          setPageLastFocus({
            ...pageLastFocus,
            [page]: uuid,
          });
        },
      }}>
      <GlobalPlayer />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="List"
            component={List}
            options={optionGeter('歌曲列表')}
          />

          <Stack.Screen
            name="Music"
            component={Music}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={optionGeter('登录')}
          />

          <Stack.Screen
            name="My"
            component={My}
            options={optionGeter('我的歌单')}
          />

          <Stack.Screen
            name="Rank"
            component={Rank}
            options={optionGeter('排行榜')}
          />

          <Stack.Screen
            name="Category"
            component={Category}
            options={optionGeter('歌单列表')}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalContext.Provider>
  );
};

export default App;
