import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import fetch from '../../utils/fetch';
import QUERYS from '../querys';

const queryMarket = () => fetch.get(QUERYS.QUERY_MARKET);
const queryBlock = () => fetch.get(QUERYS.QUERY_BLOCK);

function getPrice(data) {
  return {
    cny: data.ticker.last_cny,
    usdt: data.ticker.last_usdt,
    change: (parseFloat(data.ticker.last) - parseFloat(data.ticker.open)) / parseFloat(data.ticker.open),
  };
}

export default {
  namespace: 'market',
  state: {
    prices: {
      base: {
        cny: 0,
        usdt: 0,
        change: 0,
      },
      btc: {
        cny: 0,
        usdt: 0,
        change: 0,
      },
      eth: {
        cny: 0,
        usdt: 0,
        change: 0,
      },
    },
    block: {
      height: 0,
      power: 0,
      level: 0,
    },
  },
  subscriptions: {},
  effects: {
    * queryMarket(_, { call, put }) {
      const data = yield call(queryMarket);
      if (data.success) {
        const list = data.data;
        const prices = {
          base: getPrice(list.find(a => a.name === 'BASE/ETH')),
          eth: getPrice(list.find(a => a.name === 'ETH/USDT')),
          btc: getPrice(list.find(a => a.name === 'BTC/USDT')),
        };
        yield put({
          type: 'updateState',
          payload: {
            prices,
          },
        });
      }
    },
    * queryBlock(_, { call, put }) {
      const data = yield call(queryBlock);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            block: {
              height: data.block_number,
              power: data.power,
              level: data.reward_level,
            },
          },
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
