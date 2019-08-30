import { routerRedux } from 'dva/router';
import RESOURCE from '../../resource';
import fetch from '../../../utils/fetch';
import QUERYS from '../../querys';
import { convertEquippedListToMap } from '../../../utils/hero';

const getInfo = () => fetch.private.get(QUERYS.GAME_ME);
const getMyBuffs = () => fetch.private.get(QUERYS.GAME_MY_BUFF);
const getMySets = () => fetch.private.get(QUERYS.GAME_MY_SETS);
const equip = data => fetch.private.patch(QUERYS.GAME_EQUIP(data.id), data);
const getBattleHistory = () => fetch.private.get(QUERYS.GAME_BATTLES);
const battle = () => fetch.private.post(QUERYS.GAME_BATTLES);

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
    battles: '__LOADING__',
    buffs: [],
    sets: [],
    itemSetMap: {},
    setMap: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // history.listen(({ pathname }) => {
      // const test = pathToRegexp(router.test).exec(pathname);
      // if (test) {
      // dispatch({
      //   type: 'updateState',
      // });
      // }
      // });
    },
  },
  effects: {
    * getSets(_, { call, put }) {
      const data = yield call(getMySets);
      if (data.success) {
        const sets = data.data;
        const itemSetMap = {};
        const setMap = {};
        sets.forEach((set) => {
          setMap[set.code] = set;
          set.items.forEach((item) => {
            itemSetMap[item.code] = set;
          });
        });
        yield put({
          type: 'updateState',
          payload: {
            sets,
            itemSetMap,
            setMap,
          },
        });
      }
    },
    * getInfo(_, { call, put }) {
      const data = yield call(getInfo);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            info: data.data,
            equipped: convertEquippedListToMap(data.data.equipped),
          },
        });
      }
      const buffs = yield call(getMyBuffs);
      if (buffs.success) {
        yield put({
          type: 'updateState',
          payload: {
            buffs: buffs.data,
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
    * getBattleHistory(_, { call, put }) {
      const data = yield call(getBattleHistory);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            battles: data.data,
          },
        });
      }
    },
    * battle({ onSuccess }, { call }) {
      // TODO:
      const data = yield call(battle);
      // const data = {"success":true,"data":{"from":{"nickname":"test","power":84,"is_me":true,"equipped":[{"meta":{"id":3,"name":"勇敢者裹腿","code":"e_lower_17_0","position":"lower","price":200,"power":10,"item_type":"equipment","suit_code":"set_01"},"id":7,"level":1,"durability":null,"max_durability":null,"position":null,"equipped":true,"power":10},{"meta":{"id":1,"name":"追风者兜帽","code":"e_head_17_0","position":"head","price":200,"power":10,"item_type":"equipment","suit_code":"set_01"},"id":13,"level":1,"durability":null,"max_durability":null,"position":null,"equipped":true,"power":10},{"meta":{"id":5,"name":"沃洛尔，坚贞者的流光之刃","code":"e_weapon_2SD200002","position":"weapon","price":1,"power":40,"item_type":"weapon","weapon_type":{"hold":"double","hand":"left","desc":"双手剑"}},"id":17,"level":1,"durability":11,"max_durability":20,"position":null,"equipped":true,"power":40},{"meta":{"id":2,"name":"见习剑士夹克","code":"e_body_17_0","position":"body","price":200,"power":10,"item_type":"equipment","suit_code":"set_01"},"id":18,"level":1,"durability":null,"max_durability":null,"position":null,"equipped":true,"power":10}]},"to":{"nickname":"hging3","power":43,"is_me":false,"equipped":[{"meta":{"id":1,"name":"追风者兜帽","code":"e_head_17_0","position":"head","price":200,"power":10,"item_type":"equipment","suit_code":"set_01"},"id":9,"level":1,"durability":null,"max_durability":null,"position":null,"equipped":true,"power":10},{"meta":{"id":2,"name":"见习剑士夹克","code":"e_body_17_0","position":"body","price":200,"power":10,"item_type":"equipment","suit_code":"set_01"},"id":10,"level":1,"durability":null,"max_durability":null,"position":null,"equipped":true,"power":10},{"meta":{"id":3,"name":"勇敢者裹腿","code":"e_lower_17_0","position":"lower","price":200,"power":10,"item_type":"equipment","suit_code":"set_01"},"id":11,"level":1,"durability":null,"max_durability":null,"position":null,"equipped":true,"power":10},{"meta":{"id":4,"name":"无用短匕","code":"e_weapon_DGR100004","position":"weapon","price":200,"power":10,"item_type":"weapon","weapon_type":{"hold":"single","hand":"right","desc":"匕首"}},"id":12,"level":1,"durability":1,"max_durability":10,"position":null,"equipped":true,"power":10}]},"win_amount":"29.0","winer":"from"},"upgrade":{"school_version":"1.0.1","school_url":"https://assets.bitrabbit.com/upload/796fe015-67b4-4f16-95f5-8363ff395f70.dex"}};
      if (data.success) {
        onSuccess(data.data);
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
