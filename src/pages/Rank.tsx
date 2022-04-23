import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {Text, Container, Row, RecommendItem, Flex, Page} from '../components';

import {toplist} from '../apis';
import useWidth from '../hooks/useWidth';

const Empty = styled(Flex)`
  height: 60px;
  width: 100%;
`;

interface Props {}
const Rank = () => {
  const [list, setList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const {w4} = useWidth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setRefreshing(true);
    const {list: data}: any = await toplist();
    setList(data);
    setRefreshing(false);
  };

  return (
    <Page pageId="Rank">
      <View>
        <ScrollView>
          <Container style={{paddingTop: 20}}>
            {list.length === 0 ? (
              <Empty align="center" justify="center">
                <Text color="rgba(255,255,255,0.6)">
                  {refreshing ? '正在加载排行榜...' : '现在还没有排行榜~'}
                </Text>
              </Empty>
            ) : null}

            <Row
              count={list.length}
              col={4}
              style={{width: '100%'}}
              wrap="wrap"
              justify="space-between">
              {list.map((i: any) => (
                <RecommendItem width={w4} key={i.id} detail={i} />
              ))}
            </Row>
          </Container>
        </ScrollView>
      </View>
    </Page>
  );
};

export default Rank;
