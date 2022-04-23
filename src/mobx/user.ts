import {makeAutoObservable} from 'mobx';
import {
  login_status,
  logout as logout_api,
  likelist as likelistApi,
  like as likeApi,
  song_detail,
  user_playlist,
} from '../apis';

class UserStore {
  logined: boolean = false;
  profile: any = {};
  account: any = {};
  likelist: Array<any> = [];
  likePoster?: string = undefined;
  myLike: any = {};

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  *loadUserInfo() {
    const {data} = yield login_status();
    const {account, profile} = data;
    if (account && profile) {
      this.logined = true;
      this.account = account;
      this.profile = profile;
      this.loadLikeList();
    }
  }

  *loadLikeList(): any {
    if (this.account.id) {
      const {ids} = yield likelistApi(this.account.id);

      this.likelist = ids;
      if (ids.length > 0) {
        const {songs} = yield song_detail([ids[0]]);
        this.likePoster = songs?.[0]?.al?.picUrl;
      }

      this.loadMyLike();
    }
  }

  *likeMusic(id: string | number, like: any) {
    if (this.logined) {
      yield likeApi(id, like);
      this.loadLikeList();
    }
  }

  *loadMyLike() {
    if (this.logined) {
      const {playlist} = yield user_playlist({uid: this.account.id});
      this.myLike = playlist[0];
    }
  }

  *logout() {
    yield logout_api();
    this.logined = false;
    this.account = null;
    this.profile = null;
    this.likelist = [];
    this.likePoster = undefined;
    this.myLike = {};
  }
}

const store = new UserStore();

export default store;
