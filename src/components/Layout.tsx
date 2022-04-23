import React, {useState} from 'react';
import {useEffect} from 'react';
import styled from 'styled-components/native';
import {View} from 'react-native';
import useWidth from '../hooks/useWidth';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useGlobal} from '../hooks/useGlobal';
import PageContext from '../contexts/page';

export const Container = ({style = {}, ...props}) => {
  const {margin} = useWidth();
  return (
    <View
      {...props}
      style={{
        paddingLeft: margin,
        paddingRight: margin,
        ...style,
      }}
    />
  );
};

interface FlexProps {
  style?: any;
  direction?: 'row' | 'column';
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  wrap?: 'wrap' | 'nowrap';
}

export const Flex = styled.View<FlexProps>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
`;

export const Row: React.FC<
  FlexProps & {
    count: number;
    col: 1 | 2 | 3 | 4 | 5;
  }
> = ({children, count, col, ...props}) => {
  const [vchild, setVchild] = React.useState<any>([]);

  useEffect(() => {
    const vcount = count % col;
    if (vcount === 0) {
      setVchild([]);
    } else {
      setVchild(new Array(col - vcount).fill('__v__'));
    }
  }, [col, count]);
  const widths: any = useWidth();

  return (
    <Flex {...props}>
      {children}
      {vchild.map((key: string, index: number) => (
        <View
          key={`${key}${index}`}
          style={{height: 0, width: widths[`w${col}`]}}
        />
      ))}
    </Flex>
  );
};

const PageContainer = styled.View`
  min-height: 100%;
  background-color: #363636;
`;

export const Page = ({
  children,
  pageId,
}: React.PropsWithChildren<{pageId: string}>) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [fid, setFid] = useState<string>('');
  const {setPage} = useGlobal();
  const [shouldRefreshFocus, setShouldRefreshFocus] = useState(false);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      // console.log('set pageId', pageId);
      setPage?.(pageId);
      setShouldRefreshFocus(true);
    });
  }, []);

  useEffect(() => {
    return navigation.addListener('blur', () => {
      setPage?.('');
      setShouldRefreshFocus(false);
    });
  }, []);

  return (
    <PageContext.Provider
      value={{
        page: pageId,
        fid,
        setFid,
        shouldRefreshFocus,
      }}>
      <PageContainer>{children}</PageContainer>
    </PageContext.Provider>
  );
};
