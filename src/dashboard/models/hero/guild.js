import { routerRedux } from 'dva/router';
import RESOURCE from '../../resource';
import fetch from '../../../utils/fetch';
import QUERYS from '../../querys';

const getMyGuild = () => fetch.private.get(QUERYS.GAME_MY_GUILD);
const getGuildList = () => fetch.private.get(QUERYS.GAME_GUILDS);
const create = data => fetch.private.post(QUERYS.GAME_GUILDS, data);
const join = id => fetch.private.post(QUERYS.GAME_GUILD_JOIN(id));
const leave = id => fetch.private.post(QUERYS.GAME_GUILD_LEAVE(id));
const up = id => fetch.private.post(QUERYS.GAME_GUILD_UP(id));

export default {
  namespace: 'hero_guild',
  state: {
    myGuild: '__LOADING__',
    guilds: '__LOADING__',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        // const test = pathToRegexp(router.test).exec(pathname);
        // if (test) {
        //   dispatch({
        //     type: 'updateState',
        //   });
        // }
      });
    },
  },
  effects: {
    * getMyGuild(_, { call, put }) {
      const data = yield call(getMyGuild);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            myGuild: data.data,
          },
        });
      }
    },
    * getGuildList(_, { call, put }) {
      const data = yield call(getGuildList);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            guilds: data.data,
          },
        });
      }
    },
    * create({ payload }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(create, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
        });
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * join({ payload }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(join, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
        });
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * leave({ payload }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(leave, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
        });
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * up({ payload }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(up, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
        });
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
