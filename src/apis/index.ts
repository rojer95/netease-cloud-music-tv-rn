import axios from 'axios';

const HOST = 'YOUR API HOST';

const request = axios.create({
  baseURL: HOST,
  timeout: 5000,
  withCredentials: true,
});

/**
 * 这里是对未发出的请求进行预处理
 */
request.interceptors.request.use(
  function (config: any) {
    if (!config.params) config.params = {};
    if (config.params.t) {
      config.params.timerstamp =
        new Date().valueOf() + '_' + Math.floor(Math.random() * 1000000);
      delete config.params.t;
    }
    if (global.realIP) config.params.realIP = global.realIP;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

/**
 * 这里是收到的请求接轨进行处理
 * 主要是处理错误显示
 */
request.interceptors.response.use(
  function (response) {
    const {data} = response;
    // console.log('response data ok... ');
    if ('code' in data && ![200, 801, 802, 803].includes(data.code)) {
      console.log(data);
      global.alert(data.message || data.msg || '请求数据错误');
    }
    return data;
  },
  function (error) {
    console.log('网络异常', error);
  },
);

export default request;
// 登录二维码获取key
export const login_qr_key = async () => {
  return await request('/login/qr/key', {params: {params: {t: true}}});
};
// 登录二维码生成
export const login_qr_create = async (key: string) => {
  return await request('/login/qr/create', {params: {key, t: true}});
};

// 二维码登陆状态检测
export const login_qr_check = async (key: string) => {
  return await request('/login/qr/check', {params: {key, t: true}});
};

// 登陆状态检测
export const login_status = async () => {
  return await request('/login/status', {params: {t: true}});
};

// 登出
export const logout = async () => {
  return await request('/logout', {params: {t: true}});
};

// FM推荐
export const personal_fm = async () => {
  return await request('/personal_fm', {params: {t: true}});
};

// 用户歌单列表
export const user_playlist = async (params: any) => {
  return await request('/user/playlist', {params});
};

// 推荐歌单
export const personalized = async (params: any) => {
  return await request('/personalized', {params});
};

// 歌单详情
export const playlist_detail = async (id: string) => {
  return await request('/playlist/detail', {params: {id}});
};

// 歌曲详情
export const song_detail = async (
  ids: Array<string | number>,
): Promise<any> => {
  return await request('/song/detail', {params: {ids: ids.join(',')}});
};

// 歌曲详情
export const song_url = async (ids: Array<string | number>) => {
  try {
    const {data} = await request('/song/url', {params: {id: ids.join(',')}});
    if (data.length > 0) {
      return data.reduce((pre: any, item: any) => {
        pre[item.id] =
          item.url ||
          `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`;
        return pre;
      }, {});
    }
  } catch (error) {
    console.log('获取歌曲url失败', error);
  }
  return {};
};

export const auto_song_url = (id: number | string) => {
  return `${HOST}/song/url/redirect?id=${id}`;
};

// 歌词
export const lyric = async (id: number | string) => {
  try {
    const res: any = await request('/lyric', {params: {id}});
    if (res?.lrc) {
      return res?.lrc?.lyric;
    }
  } catch (error) {
    console.log('加载歌词失败', error);
  }
  return '[00:00.000] 暂时没有歌词';
};

// 喜欢列表
export const likelist = async (uid: number | string) => {
  return await request('/likelist', {params: {uid, t: true}});
};

// 喜欢
export const like = async (id: number | string, lk: number | string) => {
  return await request('/like', {params: {id, like: lk, t: true}});
};

// 榜单
export const toplist = async () => {
  return await request('/toplist');
};

// 可把该音乐从私人 FM 中移除至垃圾桶
export const fm_trash = async (id: number | string) => {
  return await request('/fm_trash', {params: {id}});
};

// 热门歌单分类
export const playlist_hot = async () => {
  return await request('/playlist/hot');
};

// 歌单分类
export const playlist_catlist = async () => {
  return await request('/playlist/catlist');
};
// 热门歌单分类
export const top_playlist = async (
  cat: number | string,
  limit: number | string,
  offset: number | string,
) => {
  return await request('/top/playlist', {
    params: {
      cat,
      limit,
      offset,
    },
  });
};
