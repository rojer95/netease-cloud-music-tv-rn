import React, {useState, useEffect, useRef} from 'react';
import {View, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {
  Text,
  Container,
  RecommendItem,
  Flex,
  Button,
  Focusable,
  Page,
} from '../components';
import {useNavigation} from '@react-navigation/native';

import {observer} from 'mobx-react';

import {top_playlist, playlist_hot, playlist_catlist} from '../apis';

const Empty = styled(Flex)`
  height: 60px;
  width: 100%;
`;

const ActiveButton = styled(Button)<{active: boolean}>`
  background: ${props =>
    props.active ? 'rgba(255,255,255,0.8)' : 'rgba(255, 255, 255, 0.2)'};
`;

const ActiveText = styled(Text)<{active: boolean}>`
  color: ${props => (props.active ? '#000000' : '#FFFFFF')};
`;
interface Props {}
const Home = observer(() => {
  const navigation = useNavigation();
  const [page, setPage] = useState<number>(1);
  const ended = useRef(false);
  const loadlock = useRef(false);
  const [all, setAll] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const [cat, setCat] = useState<string>('');
  const [hotcats, setHotCats] = useState<string[]>([]);
  const [cats, setCats] = useState<any[]>([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const lock = () => {
    loadlock.current = true;
    setRefreshing(true);
  };

  const unlock = () => {
    loadlock.current = false;
    setRefreshing(false);
  };

  useEffect(() => {
    const loadCat = async () => {
      const {tags}: any = await playlist_hot();

      if (tags.length > 0) {
        setHotCats(tags.map((i: any) => i.name));
        setCat(tags[0].name);
      }
      const {sub, categories}: any = await playlist_catlist();
      setCats(
        Object.keys(categories).map((key: string) => {
          return {
            name: categories[key],
            sub: sub
              .filter((i: any) => String(i.category) === key)
              .map((i: any) => i.name),
          };
        }),
      );
    };

    loadCat();
  }, []);

  const toggle = (select_cat: string) => {
    setList([]);
    setCat(select_cat);
    setPage(1);
    ended.current = false;
  };

  const loadList = React.useCallback(async () => {
    if (loadlock.current || !cat || (page > 1 && ended.current)) {
      return;
    }

    try {
      lock();
      const limit = 50;
      const offset = (page - 1) * 50;

      console.log('top_playlist', cat, page);

      const {playlists, code, total, msg}: any = await top_playlist(
        cat,
        limit,
        offset,
      );

      if (code !== 200) {
        unlock();
        await global.alert(msg);
        navigation.goBack();
        return;
      }

      const newlist = page === 1 ? playlists : [...list, ...playlists];
      if (newlist.length >= total) {
        ended.current = true;
      } else {
        ended.current = false;
      }
      setList(newlist);
    } catch (error) {
      console.log(error);
    }
    unlock();
  }, [page, list, cat]);

  useEffect(() => {
    loadList();
  }, [cat, page]);

  return (
    <Page pageId="Category">
      <Container style={{height: '100%', paddingTop: 20}}>
        <Flex direction="column" style={{height: '100%'}}>
          <View style={{flex: 1}}>
            <FlatList
              horizontal={false}
              numColumns={5}
              style={{width: '100%', height: '100%'}}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              data={list}
              renderItem={({item}: any) => {
                return <RecommendItem key={item.id} detail={item} />;
              }}
              keyExtractor={(item: any) => `${item.id}`}
              ListHeaderComponent={
                <View style={{marginBottom: 8}}>
                  {!all ? (
                    <Flex wrap="wrap">
                      {hotcats.map((str: string) => (
                        <Focusable
                          style={{marginRight: 8}}
                          key={str}
                          shadow={false}
                          onPress={() => {
                            toggle(str);
                          }}
                          radius={30}>
                          <ActiveButton active={str === cat}>
                            <ActiveText active={str === cat}>{str}</ActiveText>
                          </ActiveButton>
                        </Focusable>
                      ))}
                      <Focusable
                        shadow={false}
                        onPress={() => {
                          setAll(!all);
                        }}
                        radius={30}>
                        <Button>
                          <Text>{all ? '收起' : '全部分类'}</Text>
                        </Button>
                      </Focusable>
                    </Flex>
                  ) : (
                    <View>
                      {cats.map(catg => (
                        <Flex key={catg.name}>
                          <Flex style={{height: 44, width: 50}} align="center">
                            <Text>{catg.name}：</Text>
                          </Flex>

                          <Flex
                            wrap="wrap"
                            align="center"
                            style={{
                              marginBottom: 8,
                              flex: 1,
                            }}>
                            {catg.sub.map((str: string) => (
                              <Focusable
                                style={{marginRight: 8}}
                                key={str}
                                shadow={false}
                                onPress={() => {
                                  toggle(str);
                                }}
                                radius={30}>
                                <ActiveButton active={str === cat}>
                                  <ActiveText active={str === cat}>
                                    {str}
                                  </ActiveText>
                                </ActiveButton>
                              </Focusable>
                            ))}
                          </Flex>
                        </Flex>
                      ))}
                      <Flex>
                        <Flex style={{height: 44, width: 50}} align="center" />

                        <Focusable
                          shadow={false}
                          onPress={() => {
                            setAll(!all);
                          }}
                          radius={30}>
                          <Button>
                            <Text>{all ? '收起' : '全部分类'}</Text>
                          </Button>
                        </Focusable>
                      </Flex>
                    </View>
                  )}
                </View>
              }
              ListFooterComponent={
                <Empty align="center" justify="center">
                  <Text color="rgba(255,255,255,0.6)">
                    {refreshing ? '正在加载歌单...' : '现在还没有歌单~'}
                  </Text>
                </Empty>
              }
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                setPage(page + 1);
              }}
            />
          </View>
        </Flex>
      </Container>
    </Page>
  );
});

export default Home;
