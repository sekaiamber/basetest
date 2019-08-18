import { routerRedux } from 'dva/router';
import RESOURCE from '../../resource';
import fetch from '../../../utils/fetch';
import QUERYS from '../../querys';

const getInfo = () => fetch.private.get(QUERYS.GAME_ME);
const equip = data => fetch.private.patch(QUERYS.GAME_EQUIP(data.id), data);

export default {
  namespace: 'hero_player',
  state: {
    info: {},
    equipped: {
      head: null,
      body: null,
      lower: null,
      accessory: null,
      weapon: null,
    },
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
    * getInfo(_, { call, put }) {
      const data = yield call(getInfo);
      if (data.success) {
        const equipped = {
          head: null,
          body: null,
          lower: null,
          accessory: null,
        };
        data.data.equipped.forEach((e) => {
          equipped[e.meta.position] = e;
        });
        yield put({
          type: 'updateState',
          payload: {
            info: data.data,
            equipped,
          },
        });
      }
    },
    * equip({ payload }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(equip, {
        id: payload.id,
        equipped: true,
      });
      if (data.success) {
        yield put({
          type: 'getInfo',
        });
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * notEquip({ payload }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(equip, {
        id: payload.id,
        equipped: false,
      });
      if (data.success) {
        yield put({
          type: 'getInfo',
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
