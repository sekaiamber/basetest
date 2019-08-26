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
const donate = data => fetch.private.post(QUERYS.GAME_GUILD_DONATE(data.id), data);
const update = data => fetch.private.patch(QUERYS.GAME_GUILD_UPDATE(data.id), data);
const removeUser = data => fetch.private.post(QUERYS.GAME_GUILD_REMOVE_USER(data.id), data);
const upgradeTech = data => fetch.private.post(QUERYS.GAME_GUILD_UPGRADE_TECH(data.id), data);

function convertTechListToMap(list) {
  const techs = {
    power: {
      index: 1,
      name: '战斗力提升',
      icon: RESOURCE.UI.GUILD_TECH_01,
      level: 0,
    },
    upgrade: {
      index: 3,
      name: '升级成功率',
      icon: RESOURCE.UI.GUILD_TECH_02,
      level: 0,
    },
    suite: {
      index: 2,
      name: '装备掉落率',
      icon: RESOURCE.UI.GUILD_TECH_03,
      level: 0,
    },
    repair: {
      index: 0,
      name: '修理费降低',
      icon: RESOURCE.UI.GUILD_TECH_04,
      level: 0,
    },
  };
  list.forEach((tech) => {
    techs[tech.technology_type].level = tech.level;
  });
  return techs;
}

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
            myGuild: {
              ...data.data,
              technologies: convertTechListToMap(data.data.technologies),
            },
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
    * leave({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(leave, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * up({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(up, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * update({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(update, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * donate({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(donate, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
        });
        yield put({
          type: 'farm_player/getAccounts',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * removeUser({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(removeUser, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
        });
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * upgradeTech({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(upgradeTech, payload);
      if (data.success) {
        yield put({
          type: 'getMyGuild',
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
