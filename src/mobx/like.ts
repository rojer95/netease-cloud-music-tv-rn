import {makeAutoObservable} from 'mobx';
import {AsyncStorage} from 'react-native';
import uuid from 'react-native-uuid';
import {getLike, like as likeApi} from '../api';
const getStorage = (key: string): Promise<string> => {
  return new Promise((resovle, reject) => {
    AsyncStorage.getItem(key, (error, value) => {
      if (error) return reject(error);
      resovle(value ?? '');
    });
  });
};

const setStorage = (key: string, value: string) => {
  return new Promise((resovle, reject) => {
    AsyncStorage.setItem(key, value, error => {
      if (error) return reject(error);
      resovle(null);
    });
  });
};

class LikeStore {
  list: any[] = [];
  uid: string = '';

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  *init() {
    this.uid = yield getStorage('uid');
    if (!this.uid) {
      this.uid = uuid.v4() as string;
      yield setStorage('uid', this.uid);
    }
    yield this.loadLike();
  }

  *loadLike() {
    const {data: likes} = yield getLike(this.uid);
    this.list = likes;
  }

  *like(path: string) {
    try {
      yield likeApi(path, this.uid);
      yield this.loadLike();
    } catch (error) {
      console.log(error);
    }
  }
}

const store = new LikeStore();

export default store;
