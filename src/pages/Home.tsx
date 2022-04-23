import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {
  ScrollView,
  RefreshControl,
  useTVEventHandler,
  Image,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import {
  Flex,
  Page,
  RecommendPlaylist,
  Musicing,
  Container,
  Focusable,
  Button,
  Text,
} from '../components';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {usePlayer, useUser} from '../hooks/useStores';
import {observer} from 'mobx-react';
import {useGlobal} from '../hooks/useGlobal';
import FmButton from '../components/FmButton';
import MyLikeButton from '../components/MyLikeButton';
import RankButton from '../components/RankButton';
import {personalized} from '../apis';

const Header = styled.View`
  margin: 15px 0px;
  height: 60px;
  width: 100%;
  padding: 0px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const Logo = styled.Image`
  height: 60px;
  width: 250px;
  margin-right: auto;
`;

const Avatar = styled.View`
  height: 40px;
  width: 40px;
  border-radius: 40px;
  overflow: hidden;
`;

const Title = styled(Flex)`
  border-left-width: 4px;
  border-left-color: #e70625;
  padding-left: 8px;
  margin: 24px 4px;
  justify-content: space-between;
  align-items: center;
`;

export default observer(() => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {current, playerState} = usePlayer();
  const [refreshing, setRefreshing] = useState(false);
  const {logined, profile} = useUser();
  const [cruteria, setCruteria] = useState([]);

  useTVEventHandler(e => {
    if (e.eventType === 'menu') {
      onRefresh();
    }
  });

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res: any = await personalized({limit: 10});
      setCruteria(res?.result);
      setRefreshing(false);
    } catch (error: any) {
      global.alert(error.message);
      setRefreshing(false);
    }
  };

  return (
    <Page pageId="Home">
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor="#e70625"
            colors={['#e70625']}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {/* 头部 */}
        <Header>
          <Logo resizeMode="contain" source={require('../assets/logo-w.png')} />

          {current?.name ? (
            <Focusable
              shadow={false}
              onPress={() => {
                navigation.navigate('Music');
              }}
              radius={40}
              style={{marginRight: 12}}>
              <Flex align="center">
                {playerState === 'playing' ? (
                  <Button
                    width={40}
                    height={40}
                    radius={40}
                    style={{marginRight: 6}}>
                    <Musicing width={20} height={20} />
                  </Button>
                ) : null}
                <Text
                  size={12}
                  style={{maxWidth: 180, marginRight: 24}}
                  numberOfLines={1}>
                  {current?.name}
                </Text>
              </Flex>
            </Focusable>
          ) : null}

          {logined ? (
            <Focusable
              shadow={false}
              onPress={() => {
                navigation.navigate('My');
              }}
              radius={30}
              style={{marginRight: 12}}>
              <Button>
                <Text>我的歌单</Text>
              </Button>
            </Focusable>
          ) : null}

          {logined ? (
            <Focusable
              radius={40}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Avatar>
                <Image
                  source={{uri: profile?.avatarUrl, width: 40, height: 40}}
                  resizeMode="contain"
                />
              </Avatar>
            </Focusable>
          ) : (
            <Focusable
              shadow={false}
              onPress={() => {
                navigation.navigate('Login');
              }}
              radius={30}>
              <Button>
                <Text>登录</Text>
              </Button>
            </Focusable>
          )}
        </Header>
        <Container>
          <Flex style={{width: '100%'}} justify="space-between">
            <FmButton />
            <MyLikeButton />
            <RankButton />
          </Flex>

          <Title>
            <Text size={24}>推荐歌单</Text>
            <Focusable
              shadow={false}
              onPress={() => {
                navigation.navigate('Category');
              }}
              radius={30}>
              <Button>
                <Text>更多歌单</Text>
              </Button>
            </Focusable>
          </Title>

          <RecommendPlaylist cruteria={cruteria} />
        </Container>
      </ScrollView>
    </Page>
  );
});
