import React, {useEffect, useRef, useState, useMemo} from 'react';
import {View, Alert, useTVEventHandler, ToastAndroid} from 'react-native';
import {RecyclerListView, DataProvider} from 'recyclerlistview';
import {GridLayoutProvider} from 'recyclerlistview-gridlayoutprovider';
import styled from 'styled-components/native';

import useWidth from '../hooks/useWidth';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const PAGESIZE = 50;

import {Flex, Page, Focusable, Text, Musicing, Button} from '../components';
import {usePlayer, useUser} from '../hooks/useStores';
import {observer} from 'mobx-react';
import {playlist_detail, song_detail, subscribe} from '../apis';

const Container = styled.View`
  height: 100%;
  width: 100%;
`;

const SongBox = styled.View`
  height: 80px;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ITEM_HEIGHT = 80 + 20;

const Song = styled(Flex)`
  width: 100%;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.3);
  padding-right: 24px;
`;

const SongPic = styled.Image`
  height: 80px;
  width: 80px;
  margin-right: 12px;
`;

const Empty = styled(Flex)`
  height: 60px;
  width: 100%;
`;

interface ItemProps {
  item: any;
  onPress: any;
  width: number;
  index: number;
}

const confirm = (title: string, msg: string, ok: string, cancel: string) => {
  return new Promise(resolve => {
    Alert.alert(title, msg, [
      {
        text: cancel,
        onPress: () => {
          resolve(false);
        },
        style: 'cancel',
      },
      {text: ok, onPress: () => resolve(true)},
    ]);
  });
};

class LayoutProvider extends GridLayoutProvider {
  constructor(props: any) {
    super(
      2,
      index => {
        return index;
      },
      index => {
        return 1;
      },
      index => {
        return ITEM_HEIGHT;
      },
    );
  }
}

const Item = observer(({item, onPress, width, index}: ItemProps) => {
  const {current} = usePlayer();

  return (
    <SongBox>
      <Focusable
        style={{width}}
        onPress={onPress}
        defaultFocus={index === 0}
        ani>
        <Song align="center" justify="space-between">
          <SongPic
            source={{uri: `${item?.al?.picUrl}?param=80y80`}}
            resizeMode="cover"
          />
          <Flex
            direction="column"
            justify="space-evenly"
            style={{
              flex: 1,
            }}>
            <Text numberOfLines={1} ellipsizeMode="tail" size={24}>
              {item?.name}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              color="rgba(255,255,255, 0.6)">
              {item?.ar?.map?.((ar: any) => ar.name).join('/')}
            </Text>
          </Flex>
          {current?.id === item?.id ? (
            <View style={{marginLeft: 12}}>
              <Musicing width={18} height={18} />
            </View>
          ) : null}
        </Song>
      </Focusable>
    </SongBox>
  );
});

const CollectButton = observer(({id}: {id: string}) => {
  const {mySubscribedId, notifyCollect} = useUser();
  const isCollected = id ? mySubscribedId?.includes(Number(id)) : false;

  const collect = async () => {
    const isCollected = id ? mySubscribedId?.includes(Number(id)) : false;

    const res = await subscribe(isCollected ? '2' : '1', id);
    notifyCollect(!isCollected, Number(id));
  };

  return (
    <Focusable shadow={false} onPress={collect} radius={30}>
      <Button width={80} height={30} radius={30}>
        <Text color="rgba(255,255,255,0.6)">
          {isCollected ? '取消收藏' : '收藏'}
        </Text>
      </Button>
    </Focusable>
  );
});

const List = observer(() => {
  const {w2} = useWidth();
  const {playList} = usePlayer();
  const [loading, setLoading] = useState<boolean>(false);
  const [ids, setIds] = useState<number[]>([]);

  const changeFunc = (r1: any, r2: any) => r1.id !== r2.id;
  const [list, setList] = useState<any>(null);
  const [layoutProvider, setLayoutProvider] = useState<any>(null);

  const originList = useRef<any[]>([]);
  const page = useRef(1);
  const ended = useRef(false);
  const loadlock = useRef(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const id = useRef(0);
  const route = useRoute<RouteProp<RootStackParamList>>();
  const {params} = route;

  useEffect(() => {
    if (params) {
      id.current = Number(params?.id);
      setTitle();
      load();
    }
  }, [navigation, params]);

  const setTitle = () => {
    if (params?.title) {
      navigation.setOptions({
        headerTitle: params?.title,
        headerRight: () => {
          return <CollectButton id={params?.id} />;
        },
      });
    }
  };

  const lock = () => {
    loadlock.current = true;
    setLoading(true);
  };

  const unlock = () => {
    loadlock.current = false;
    setLoading(false);
  };

  const load = async () => {
    try {
      lock();
      const {playlist, code, message}: any = await playlist_detail(params?.id);
      if (code !== 200) {
        unlock();
        global.alert(message);
        navigation.goBack();
        return;
      }
      const {trackIds} = playlist;
      console.log('获取歌曲 id 首', trackIds.length);
      setIds(trackIds.map((i: any) => i.id));
    } catch (error) {
      console.log(error);
    }
    unlock();
  };

  const init = () => {
    ended.current = false;
    page.current = 1;
    originList.current = [];
    loadPage();
  };
  useEffect(() => {
    init();
  }, [ids]);

  useTVEventHandler(e => {
    if (e.eventType === 'menu') {
      init();
    }
  });

  const loadPage = async () => {
    if (loadlock.current || ended.current) return;
    lock();
    try {
      const start = (page.current - 1) * PAGESIZE;
      const end = page.current * PAGESIZE;
      console.log('获取歌曲 页', page.current, start, end);
      const pids = ids.slice(start, end);
      if (pids.length === 0) {
        ended.current = true;
        unlock();
        return;
      }
      global.alert('加载中...', ToastAndroid.SHORT);
      const {songs}: any = await song_detail(pids);
      originList.current = [...originList.current, ...songs];

      const dataProvider = new DataProvider(changeFunc).cloneWithRows(
        originList.current,
      );
      setList(dataProvider);
      setLayoutProvider(new LayoutProvider(dataProvider));

      console.log('获取歌曲 页...成功', songs.length);
      page.current++;
    } catch (error) {
      console.log(error);
    }
    unlock();
  };

  const renderItem = (index: any, item: any) => {
    return (
      <Item
        index={index}
        item={item}
        onPress={async () => {
          const ok = await confirm(
            '提示',
            '替换当前播放列表，是否继续？如歌单过长可能需要比较久时间',
            '继续',
            '不了',
          );
          if (ok) {
            playList?.(item, ids);
            navigation.navigate('Music');
          } else {
            return false;
          }
        }}
        width={w2}
      />
    );
  };

  return (
    <Page pageId="List">
      <Container style={{paddingTop: 20}}>
        {list && layoutProvider ? (
          <RecyclerListView
            rowRenderer={renderItem}
            dataProvider={list}
            layoutProvider={layoutProvider}
            renderFooter={() => (
              <Empty align="center" justify="center">
                <Text color="rgba(255,255,255,0.6)">
                  {!loading ? '加载中...' : ''}
                </Text>
              </Empty>
            )}
            onEndReached={() => {
              loadPage();
            }}
          />
        ) : (
          <Empty align="center" justify="center">
            <Text color="rgba(255,255,255,0.6)">加载中...</Text>
          </Empty>
        )}
      </Container>
    </Page>
  );
});

export default List;
