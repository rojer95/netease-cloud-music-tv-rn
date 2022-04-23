import React, {MutableRefObject, useEffect, useState, useRef} from 'react';
import {View, Image} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import styled from 'styled-components/native';
import QRCode from 'react-native-qrcode-svg';
import {Text, Flex, Button, Focusable, Page} from '../components';
import {login_qr_key, login_qr_create, login_qr_check} from '../apis';
import {observer} from 'mobx-react';
import {usePlayer, useUser} from '../hooks/useStores';

const QrGuide = styled.Image`
  max-height: 80%;
  height: 300px;
  width: 150px;
`;

const Avatar = styled(Image)`
  height: 120px;
  width: 120px;
  border-radius: 120px;
  overflow: hidden;
`;

const Login = observer(() => {
  const navigation = useNavigation();
  const [v, setV] = useState(1);
  const [qrurl, setQrurl] = useState('');
  const [key, setKey] = useState('');
  const timer: MutableRefObject<any> = useRef<any>();

  const {loadUserInfo, logined, profile, logout}: any = useUser();
  const {loadFm, clearFm}: any = usePlayer();

  useEffect(() => {
    timer.current && clearInterval(timer.current);
    if (!logined) {
      loadQrocde();
    }
  }, [v, logined]);

  const loadQrocde = async () => {
    try {
      const {
        data: {unikey},
      }: any = await login_qr_key();

      setKey(unikey);
      if (unikey) {
        const {
          data: {qrurl: url},
        }: any = await login_qr_create(unikey);
        if (url) {
          setQrurl(url);
        }
      }
    } catch (error) {
      global.alert('加载失败');
    }
  };

  const checkLogin = () => {
    console.log('start checkLogin');
    timer.current = setInterval(async () => {
      const {code, message}: any = await login_qr_check(key);
      console.log(code, message);

      if (code === 800) {
        global.alert('二维码已过期,请重新获取');
        setV(v + 1);
      }

      if (code === 803) {
        timer.current && clearInterval(timer.current);
        await loadUserInfo();
        global.alert('登录成功');
        clearFm();
        await loadFm();
        navigation.goBack();
      }
    }, 1500);
  };

  useEffect(() => {
    if (qrurl) {
      checkLogin();
    }
    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, [qrurl]);

  return (
    <Page pageId="Login">
      <View>
        {!logined ? (
          <Flex
            justify="space-evenly"
            align="center"
            style={{width: '100%', height: '100%'}}>
            <QrGuide
              source={require('../assets/qr_guide.png')}
              resizeMode="contain"
            />

            <Flex direction="column" align="center">
              <View
                style={{
                  marginBottom: 24,
                  overflow: 'hidden',
                  borderRadius: 10,
                }}>
                {qrurl ? (
                  <QRCode value={qrurl} size={200} quietZone={6} />
                ) : (
                  <View />
                )}
              </View>

              <View>
                <Text>
                  请使用
                  <Text color="#e70625">网易云音乐</Text>APP
                </Text>
              </View>
              <View>
                <Text>扫码登录</Text>
              </View>
            </Flex>
          </Flex>
        ) : (
          <Flex
            align="center"
            justify="center"
            direction="column"
            style={{width: '100%', height: '100%'}}>
            {/* <Avatar> */}
            <Avatar source={{uri: profile?.avatarUrl}} />
            <Text size={32} style={{marginTop: 24, marginBottom: 54}}>
              {profile?.nickname}
            </Text>

            <Focusable onPress={logout} radius={30}>
              <Button width={220}>
                <Text>退出登录</Text>
              </Button>
            </Focusable>
          </Flex>
        )}
      </View>
    </Page>
  );
});

export default Login;
