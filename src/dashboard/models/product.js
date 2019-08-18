import pathToRegexp from 'path-to-regexp';
import fetch from '../../utils/fetch';
import QUERYS from '../querys';

const queryProducts = () => fetch.get(QUERYS.QUERY_PRODUCTS);
const buy = data => fetch.private.post(QUERYS.QUERY_ORDERS, data);

export default {
  namespace: 'product',
  state: {
    products: [],
    canBuy: false,
    usdtCanBuy: false,
  },
  subscriptions: {},
  effects: {
    * queryProducts(_, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          products: 'LOADING',
        },
      });
      const data = yield call(queryProducts);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            products: data.data.products,
            canBuy: data.data.can_buy,
            usdtCanBuy: data.data.usdt_can_buy,
          },
        });
      }
    },
    * buy({ payload, onSuccess }, { call, put }) {
      const data = yield call(buy, payload);
      if (data.success) {
        if (onSuccess) onSuccess();
        yield put({
          type: 'account/queryAccount',
        });
      }
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
