import { routerRedux } from 'dva/router';
import { message } from 'antd';
import RESOURCE from '../../resource';
import fetch from '../../../utils/fetch';
import QUERYS from '../../querys';

const getBaseShopItems = () => fetch.private.get(QUERYS.GAME_SHOP_BASIC);
const getAuctionShopItems = () => fetch.private.get(QUERYS.GAME_AUCTION);
const getMyAuctionItems = () => fetch.private.get(QUERYS.GAME_MY_AUCTION);
const getUnionShopItems = () => fetch.private.get(QUERYS.GAME_SHOP_BASIC, { shop: 'union' });
const buy = id => fetch.private.post(QUERYS.GAME_BUY_ITEM(id));
const sell = id => fetch.private.post(QUERYS.GAME_SELL_ITEM(id));
const auctionSell = data => fetch.private.post(QUERYS.GAME_AUCTION_SELL_ITEM(data.id), data);
const auctionClose = id => fetch.private.post(QUERYS.GAME_AUCTION_CLOSE_ITEM(id));
const auctionBuy = id => fetch.private.post(QUERYS.GAME_AUCTION_BUY_ITEM(id));
const repair = id => fetch.private.post(QUERYS.GAME_REPAIR_ITEM(id));
const upgrade = id => fetch.private.post(QUERYS.GAME_UPGRADE_ITEM(id));

export default {
  namespace: 'hero_shop',
  state: {
    auction: [],
    myAuction: [],
    basic: [],
    union: [],
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
    * getUnionShopItems(_, { call, put }) {
      const data = yield call(getUnionShopItems);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            union: data.data,
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
        message.success('购买成功');
        yield put({
          type: 'farm_player/getAccounts',
        });
        yield put({
          type: 'hero_player/getInfo',
        });
        yield put({
          type: 'hero_guild/getMyGuild',
        });
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * sell({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(sell, payload);
      if (data.success) {
        message.success('卖出成功');
        yield put({
          type: 'farm_player/getAccounts',
        });
        yield put({
          type: 'hero_player/getInfo',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * repair({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(repair, payload);
      if (data.success) {
        message.success('修理成功');
        yield put({
          type: 'farm_player/getAccounts',
        });
        yield put({
          type: 'hero_player/getInfo',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * upgrade({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(upgrade, payload);
      if (data.success) {
        message.success('升级成功');
        yield put({
          type: 'farm_player/getAccounts',
        });
        yield put({
          type: 'hero_player/getInfo',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * getAuctionShopItems(_, { call, put }) {
      const data = yield call(getAuctionShopItems);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            auction: data.data,
          },
        });
      }
    },
    * getMyAuctionItems(_, { call, put }) {
      const data = yield call(getMyAuctionItems);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            myAuction: data.data,
          },
        });
      }
    },
    * auctionSell({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(auctionSell, payload);
      if (data.success) {
        message.success('上架成功');
        yield put({
          type: 'hero_player/getInfo',
        });
        yield put({
          type: 'getMyAuctionItems',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * auctionBuy({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(auctionBuy, payload);
      if (data.success) {
        message.success('购买成功');
        yield put({
          type: 'hero_player/getInfo',
        });
        yield put({
          type: 'getMyAuctionItems',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * auctionClose({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(auctionClose, payload);
      if (data.success) {
        message.success('下架成功');
        yield put({
          type: 'hero_player/getInfo',
        });
        yield put({
          type: 'getMyAuctionItems',
        });
        if (onSuccess) onSuccess();
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
