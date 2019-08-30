import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import message from '../../utils/message';
import fetch from '../../utils/fetch';
import QUERYS from '../querys';

const sendSms = data => fetch.post(QUERYS.SEND_SMS, data);
const sendResetSms = data => fetch.post(QUERYS.SEND_FORGET_SMS, data);
const signup = data => fetch.post(QUERYS.SIGNUP, data);
const resetPassword = data => fetch.post(QUERYS.RESET_PASSWORD, data);

const pathConfigs = {
  '/': {
    // header: {
    //   title: '',
    //   style: {
    //     color: '#fff',
    //     position: 'absolute',
    //     backgroundColor: 'transparent',
    //     borderBottomColor: 'transparent',
    //   },
    //   icon: {
    //     left: 'notices',
    //     right: 'activitiesDone',
    //   },
    // },
    header: {
      hide: true,
    },
    footer: {
      activeNav: 0,
    },
    refresh: [{
      type: 'account/queryMy',
    }, {
      type: 'account/queryAccount',
    }, {
      type: 'account/queryAcitivies',
    }, {
      type: 'account/queryAcitiviesYesterday',
    }, {
      type: 'market/queryMarket',
    }, {
      type: 'market/queryBlock',
    }],
  },
  '/game': {
    header: {
      hide: true,
    },
    refresh: [{
      type: 'farm_player/getAccounts',
    }, {
      type: 'farm_player/getMyBuilding',
    }, {
      type: 'farm_env/getBuildings',
    }, {
      type: 'hero_player/getInfo',
    }, {
      type: 'hero_player/getSets',
    }, {
      type: 'account/queryMy',
    }, {
      type: 'account/queryAccount',
    }],
  },
  '/power': {
    header: {
      title: '算力',
    },
    footer: {
      activeNav: 1,
    },
    refresh: [{
      type: 'account/queryMy',
    }, {
      type: 'account/queryAccount',
    }, {
      type: 'account/queryOrders',
    }, {
      type: 'account/queryAcitiviesYesterday',
    }],
  },
  '/buy': {
    header: {
      title: '購買算力',
    },
    footer: {
      activeNav: 2,
    },
    refresh: [{
      type: 'product/queryProducts',
    }, {
      type: 'account/queryAccount',
    }],
  },
  '/wallet': {
    header: {
      title: '錢包',
    },
    footer: {
      activeNav: 3,
    },
    refresh: [{
      type: 'account/queryMy',
    }, {
      type: 'account/queryAccount',
    }],
  },
  '/me': {
    header: {
      title: '個人中心',
    },
    footer: {
      activeNav: 4,
    },
    refresh: [{
      type: 'account/queryMy',
    }],
  },
  '/notice': {
    header: {
      title: '公告',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'notice/queryNotices',
    }],
  },
  '/activities': {
    header: {
      title: '領取記錄',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryAcitiviesDone',
      payload: 1,
    }],
  },
  '/invite': {
    header: {
      title: '邀請好友',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryMy',
    }],
  },
  '/miners': {
    header: {
      title: '礦工管理',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryAcitiviesAll',
    }, {
      type: 'account/queryAcitiviesTotal',
    }],
  },
  '/subuser': {
    header: {
      title: '我的礦工',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/querySubUser',
    }],
  },
  '/deposit/:currency': {
    header: {
      title: '充值',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryMy',
    }],
  },
  '/withdraw/:currency': {
    header: {
      title: '提現',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryAccount',
    }],
  },
  '/signup': {
    header: {
      title: '註冊',
      icon: {
        left: 'back',
      },
    },
  },
  '/login': {
    header: {
      title: '登錄賬戶',
    },
  },
  '/forgetPassword': {
    header: {
      title: '重置密碼',
      icon: {
        left: 'back',
      },
    },
  },
};

let originDispatch;

export default {
  namespace: 'utils',
  state: {
    history: null,
    currentPath: '',
    currentPathConfig: {},
    loading: null,
    needUpgrade: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      originDispatch = dispatch;
      dispatch({
        type: 'updateState',
        payload: {
          history,
        },
      });
      history.listen(({ pathname }) => {
        const c = Object.keys(pathConfigs).find(key => pathToRegexp(key).exec(pathname));
        dispatch({
          type: 'updateState',
          payload: {
            currentPath: pathname,
            currentPathConfig: pathConfigs[c] || {},
          },
        });
        dispatch({
          type: 'refreshPage',
          pathname,
        });
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
    * goBack(_, { select }) {
      const history = yield select(({ utils }) => utils.history);
      history.goBack();
    },
    * goto({ goto }, { select, put }) {
      const history = yield select(({ utils }) => utils.history);
      if (history.location.pathname === goto) return;
      yield put(routerRedux.push(goto));
    },
    * loading({ loading }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          loading,
        },
      });
    },
    * sendSms({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'utils/loading',
        loading: {
          text: '發送中',
        },
      });
      const data = yield call(sendSms, payload);
      if (data.success) {
        message.success('已發送，請查看手機');
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'utils/loading',
        loading: null,
      });
    },
    * sendResetSms({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'utils/loading',
        loading: {
          text: '發送中',
        },
      });
      const data = yield call(sendResetSms, payload);
      if (data.success) {
        message.success('已發送，請查看手機');
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'utils/loading',
        loading: null,
      });
    },
    * signup({ payload }, { call, put }) {
      yield put({
        type: 'utils/loading',
        loading: {
          text: '註冊中',
        },
      });
      const data = yield call(signup, payload);
      if (data.success) {
        message.success('註冊成功，請登錄');
        yield put({
          type: 'utils/goto',
          goto: '/login',
        });
      }
      yield put({
        type: 'utils/loading',
        loading: null,
      });
    },
    * resetPassword({ payload }, { call, put }) {
      const data = yield call(resetPassword, payload);
      if (data.success) {
        message.success('重置密碼成功，請登錄');
        yield put({
          type: 'utils/goto',
          goto: '/login',
        });
      }
    },
    * refreshPage({ pathname, onSuccess }, { select, put }) {
      let p = pathname;
      if (!p) {
        p = yield select(({ utils }) => utils.currentPath);
      }
      const pathes = Object.keys(pathConfigs);
      for (let i = 0; i < pathes.length; i += 1) {
        const path = pathes[i];
        const test = pathToRegexp(path).exec(p);
        if (test) {
          const config = pathConfigs[path];
          if (!config) return;
          const { refresh } = config;
          if (refresh) {
            for (let j = 0; j < refresh.length; j += 1) {
              const params = refresh[j];
              yield put(params);
            }
          }
        }
      }
      if (onSuccess) onSuccess();
    },
  },
  reducers: {
    updateCurrentPathName(state, { pathname, history }) {
      return { ...state, pathname, history };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
