import {makeAutoObservable} from 'mobx';
import {fm_trash, personal_fm, song_detail} from '../apis';

type Song = {
  [key: string]: any;
};

let fm_queue: any[] = []; // FM等待队列

class PlayerStore {
  randomPoster?: string = undefined;
  player: any;
  paused: boolean = false;
  current?: Song = undefined;
  currentList: any[] = [];
  playerState: 'playing' | 'stoped' = 'stoped';
  loop: 'list' | 'signal' | 'random' = 'list';
  lyric: string = '';
  progress: {currentTime: number; seekableDuration: number} = {
    currentTime: 0,
    seekableDuration: 0,
  };
  isGlobalRandom: boolean = false;
  random?: Song = undefined;

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  startGlobalRandom() {
    this.isGlobalRandom = true;
    this.current = this.random;
  }

  *loadFm() {
    // 如果等待队列小于2则获取数据，加入队列
    if (fm_queue.length <= 1) {
      const {data} = yield personal_fm();
      if (Array.isArray(data)) {
        for (const music of data) {
          if (!this.randomPoster) this.randomPoster = music.album.picUrl;
          if (!this.random) this.random = music;
          fm_queue.push(music);
        }
      }
    }
  }

  clearFm() {
    fm_queue = [];
  }

  *pushFm() {
    const music = fm_queue.shift();
    if (music) {
      // 重置播放列表
      this.randomPoster = music.album.picUrl;
      this.random = music;
      this.loadFm();
      return music;
    } else {
      console.log('FM没有等待队列为空...');
    }
  }

  *fmTrash(id: number | string) {
    yield fm_trash(id);
    yield this.pushFm();
  }

  *playNext(): any {
    if (this.isGlobalRandom) {
      const song: Song = yield this.pushFm();
      this.current = song;
      return;
    }

    if (this.loop === 'signal') {
      return;
    }

    let id;
    if (this.loop === 'random') {
      // 随机
      const index = Math.floor(Math.random() * this.currentList.length);
      id = this.currentList[index];
    } else {
      let index = this.currentList.findIndex(id => id === this.current?.id);
      index += 1;
      index = index < this.currentList.length ? index : 0;
      id = this.currentList[index];
    }

    const {songs}: any = yield song_detail([id]);
    this.current = songs?.[0];
  }

  *playPre(): any {
    if (this.isGlobalRandom) {
      const song: Song = yield this.pushFm();
      this.current = song;
      return;
    }
    if (this.loop === 'signal') {
      return;
    }
    let id;

    if (this.loop === 'random') {
      // 随机
      const index = Math.floor(Math.random() * this.currentList.length);
      id = this.currentList[index];
    } else {
      let index = this.currentList.findIndex(id => id === this.current?.id);
      index -= 1;
      index = index < 0 ? this.currentList.length - 1 : index;
      id = this.currentList[index];
    }

    const res: any = yield song_detail([id]);
    this.current = res?.songs?.[0];
  }

  pause() {
    this.paused = true;
    this.playerState = 'stoped';
  }

  play() {
    this.paused = false;
    this.playerState = 'playing';
  }

  seekTo(t: number) {
    this.player?.seek(t);
  }

  playList(music: any, list: any[]) {
    this.isGlobalRandom = false;
    this.current = music;
    this.currentList = list;
  }

  setPlayer(o: any) {
    this.player = o;
  }

  setLyric(lrc: string) {
    this.lyric = lrc;
  }

  setPlayerState(state: 'playing' | 'stoped') {
    this.playerState = state;
  }

  setLoop(lp: 'list' | 'signal' | 'random' = 'list') {
    this.loop = lp;
  }

  setProgress(o: any) {
    this.progress = o;
  }
}

const store = new PlayerStore();

export default store;
