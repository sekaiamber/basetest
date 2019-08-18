import { routerRedux } from 'dva/router';
import RESOURCE from '../../resource';
import fetch from '../../../utils/fetch';
import QUERYS from '../../querys';

const getBaseShopItems = () => fetch.private.get(QUERYS.GAME_SHOP_BASIC);
const buy = id => fetch.private.post(QUERYS.GAME_BUY_ITEM(id));

export default {
  namespace: 'hero_shop',
  state: {
    basic: [],
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
    * getBaseShopItems(_, { call, put }) {
      const data = yield call(getBaseShopItems);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            basic: data.data,
          },
        });
      }
    },
    * buy({ payload }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(buy, payload);
      if (data.success) {
        yield put({
          type: 'farm_player/getAccounts',
        });
        yield put({
          type: 'hero_player/getInfo',
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
