import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
import styled from 'styled-components/native';
import {user_playlist} from '../apis';
import {Text, Container, Row, RecommendItem, Flex, Page} from '../components';

import {useUser} from '../hooks/useStores';

const Title = styled.View`
  border-left-width: 4px;
  border-left-color: #e70625;
  padding-left: 8px;
  margin: 24px 4px;
`;

const Empty = styled(Flex)`
  height: 60px;
  width: 100%;
`;

interface Props {}
const My = () => {
  const [myList, setMylist] = useState<any[]>([]);
  const [subscribedList, setSubscribedList] = useState<any[]>([]);
  const {account} = useUser();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const res: any = await user_playlist({uid: account?.id});
    setMylist(res?.playlist?.filter((i: any) => i.subscribed === false) ?? []);
    setSubscribedList(
      res?.playlist?.filter((i: any) => i.subscribed === true) ?? [],
    );
    setRefreshing(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, []),
  );

  return (
    <Page pageId="My">
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor="#e70625"
              colors={['#e70625']}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }>
          <Container>
            {myList?.length + subscribedList?.length === 0 ? (
              <Empty align="center" justify="center">
                <Text color="rgba(255,255,255,0.6)">
                  {refreshing ? '正在加载歌单...' : '现在还没有歌单~'}
                </Text>
              </Empty>
            ) : null}

            {myList.length > 0 ? (
              <Title>
                <Text size={24}>我创建的歌单</Text>
              </Title>
            ) : null}

            <Row
              count={myList.length}
              col={5}
              style={{width: '100%'}}
              wrap="wrap"
              justify="space-between">
              {myList.map((i: any, index) => (
                <RecommendItem key={i.id} detail={i} index={index} />
              ))}
            </Row>

            {subscribedList.length > 0 ? (
              <Title>
                <Text size={24}>我收藏的歌单</Text>
              </Title>
            ) : null}

            <Row
              count={subscribedList.length}
              col={5}
              style={{width: '100%'}}
              wrap="wrap"
              justify="space-between">
              {subscribedList.map((i: any) => (
                <RecommendItem key={i.id} detail={i} />
              ))}
            </Row>
          </Container>
        </ScrollView>
      </View>
    </Page>
  );
};

export default My;
