import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import message from '../../utils/message';
import fetch from '../../utils/fetch';
import jwt from '../../utils/jwt';
import QUERYS from '../querys';

const login = data => fetch.post(QUERYS.LOGIN, data);
const logout = () => fetch.private.delete(QUERYS.LOGIN);
const queryMy = () => fetch.private.get(QUERYS.QUERY_MY);
const queryAccount = () => fetch.private.get(QUERYS.QUEYR_ACCOUNT);
const queryAcitivies = () => fetch.private.get(QUERYS.QUERY_ACTIVITIES);
const queryAcitiviesDone = page => fetch.private.get(QUERYS.QUERY_ACTIVITIES_DONE(page));
const queryAcitiviesAll = () => fetch.private.get(QUERYS.QUERY_ACTIVITIES_ALL);
const queryAcitiviesYesterday = () => fetch.private.get(QUERYS.QUERY_ACTIVITIES_YESTERDAY);
const queryAcitiviesTotal = () => fetch.private.get(QUERYS.QUERY_ACTIVITIES_TOTAL);
const queryOrders = () => fetch.private.get(QUERYS.QUERY_ORDERS);
const queryDeposits = data => fetch.private.get(QUERYS.QUERY_DEPOSITS, data);
const queryWithdraws = data => fetch.private.get(QUERYS.QUERY_WITHDRAWS, data);
const querySubUser = () => fetch.private.get(QUERYS.QUERY_SUB_USER);
const changeAutoReceive = data => fetch.private.post(QUERYS.QUERY_MY, { auto_receive: data });
const submitWithdraw = data => fetch.private.post(QUERYS.QUERY_WITHDRAWS, data);
const collect = id => fetch.private.post(QUERYS.COLLECT(id));

function sedoRandom(seed) {
  return ('0.' + Math.sin(seed).toString().substr(6));
}

export default {
  namespace: 'account',
  state: {
    member_token: undefined,
    userInfo: {},
    account: {},
    acitivies: [],
    acitiviesDone: [],
    acitiviesAll: [],
    acitiviesYesterday: 0,
    acitiviesTotal: 0,
    orders: [],
    history: [],
    subuser: [],
  },
  subscriptions: {},
  effects: {
    * login({ payload }, { call, put }) {
      yield put({
        type: 'utils/loading',
        loading: {
          text: '登錄中',
        },
      });
      const data = yield call(login, payload);
      if (data.success) {
        const token = data.data.member;
        const v = jwt.verify(token);

        yield put({
          type: 'updateLocalState',
          payload: {
            member_token: v.member_token,
            member_id: v.member_id,
          },
        });
        message.success('登錄成功');
        yield put({
          type: 'utils/goto',
          goto: '/',
        });
      }
      yield put({
        type: 'utils/loading',
        loading: null,
      });
    },
    * logout(_, { call, put }) {
      const data = yield call(logout);
      if (data.success) {
        message.success('退出成功');
        localStorage.setItem('member_id', '__EMPTY__');
        localStorage.setItem('member_token', '__EMPTY__');
        yield put({
          type: 'utils/goto',
          goto: '/login',
        });
      }
    },
    * queryMy(_, { call, put }) {
      const data = yield call(queryMy);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            userInfo: data.data,
          },
        });
      }
    },
    * queryAccount(_, { call, put }) {
      const data = yield call(queryAccount);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            account: data.data,
          },
        });
      }
    },
    * queryAcitivies({ remainOld }, { call, put }) {
      if (!remainOld) {
        yield put({
          type: 'updateState',
          payload: {
            acitivies: [],
          },
        });
      }
      const data = yield call(queryAcitivies);
      if (data.success) {
        const acitivies = data.data.map(item => ({
          ...item,
          position: {
            left: 0.05 + sedoRandom(item.id) * 0.8,
            top: 0.05 + sedoRandom(item.id + 1) * 0.75,
          },
          animation: {
            delay: sedoRandom(item.id) * -6 + 's',
          },
        }));
        yield put({
          type: 'updateState',
          payload: {
            acitivies,
          },
        });
      }
    },
    * queryAcitiviesDone({ payload, onSuccess }, { select, call, put }) {
      if (payload === 1) {
        yield put({
          type: 'updateState',
          payload: {
            acitiviesDone: [],
          },
        });
      }
      const data = yield call(queryAcitiviesDone, payload);
      if (data.success) {
        const acitiviesDone = yield select(({ account }) => account.acitiviesDone);
        yield put({
          type: 'updateState',
          payload: {
            acitiviesDone: acitiviesDone.concat(data.data),
          },
        });
        if (onSuccess) onSuccess();
      }
    },
    * queryAcitiviesAll(_, { call, put }) {
      const data = yield call(queryAcitiviesAll);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            acitiviesAll: data.data,
          },
        });
      }
    },
    * queryAcitiviesYesterday(_, { call, put }) {
      const data = yield call(queryAcitiviesYesterday);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            acitiviesYesterday: data.amount,
          },
        });
      }
    },
    * queryAcitiviesTotal(_, { call, put }) {
      const data = yield call(queryAcitiviesTotal);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            acitiviesTotal: data.amount,
          },
        });
      }
    },
    * queryOrders(_, { call, put }) {
      const data = yield call(queryOrders);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            orders: data.data,
          },
        });
      }
    },
    * queryHistory({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          history: 'LOADING',
        },
      });
      const currency = payload || 'BASE';
      const withdraws = yield call(queryWithdraws, { currency });
      const deposits = yield call(queryDeposits, { currency });
      if (withdraws.success && deposits.success) {
        const wit = withdraws.data.map(d => ({
          ...d,
          type: 'withdraw',
        }));
        const dep = deposits.data.map(d => ({
          ...d,
          type: 'deposits',
        }));
        const history = wit.concat(dep);
        history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        yield put({
          type: 'updateState',
          payload: {
            history,
          },
        });
      }
    },
    * querySubUser(_, { call, put }) {
      const data = yield call(querySubUser);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            subuser: data.data,
          },
        });
      }
    },
    * changeAutoReceive({ payload }, { call, put }) {
      yield put({
        type: 'utils/loading',
        loading: {},
      });
      const data = yield call(changeAutoReceive, payload);
      if (data.success) {
        yield put({
          type: 'queryMy',
        });
      }
      yield put({
        type: 'utils/loading',
        loading: null,
      });
    },
    * submitWithdraw({ payload }, { call, put }) {
      yield put({
        type: 'utils/loading',
        loading: {},
      });
      const data = yield call(submitWithdraw, payload);
      if (data.success) {
        message.success('申請提現成功');
        yield put({
          type: 'queryAccount',
        });
      }
      yield put({
        type: 'utils/loading',
        loading: null,
      });
    },
    * collect({ payload }, { call, put }) {
      const data = yield call(collect, payload);
      if (data.success) {
        message.success('領取成功');
        yield put({
          type: 'queryAcitivies',
          remainOld: true,
        });
      }
    },
    * updateLocalState({ payload }, { put }) {
      Object.keys(payload).forEach((key) => {
        localStorage.setItem(key, payload[key]);
      });

      yield put({
        type: 'updateState',
        payload,
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
