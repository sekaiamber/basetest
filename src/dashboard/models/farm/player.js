/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import RESOURCE from '../../resource';
import {
  convertBuildingDataToRenderData, checkBuildingData, convertBuildingsListToMap, convertBuildingsListToUsedMap,
} from '../../../utils/farm';
import fetch from '../../../utils/fetch';
import QUERYS from '../../querys';
import { message } from 'antd';


const getMyBuilding = () => fetch.private.get(QUERYS.GAME_MY);
const getAccounts = () => fetch.private.get(QUERYS.GAME_ACCOUNT);
const buyBuilding = data => fetch.private.post(QUERYS.GAME_BUY_BUILDING(data.id), data);
const rotateBuilding = data => fetch.private.patch(QUERYS.GAME_UPDATE_BUILDING(data.id), data);
const moveBuildingFinish = data => fetch.private.patch(QUERYS.GAME_UPDATE_BUILDING(data.id), data);
const removeBuilding = id => fetch.private.patch(QUERYS.GAME_UPDATE_BUILDING(id), { position: null });
const deposit = data => fetch.private.post(QUERYS.GAME_DEPOSIT, data);

export default {
  namespace: 'farm_player',
  state: {
    // buildings: [convertBuildingDataToRenderData({
    //   meta: RESOURCE.BUILDING.CENTRE,
    //   active_count: 0,
    //   position: [1, 1],
    //   rotate: false,
    //   id: parseInt(Math.random() * 10000, 10),
    // })],
    buildings: {
      list: [],
      map: {},
      usedMap: [],
      storage: [],
    },
    accounts: {
      base: '0',
    },
    info: {},
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
    * getAccounts(_, { call, put }) {
      const data = yield call(getAccounts);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            accounts: data.data,
          },
        });
      }
    },
    * getMyBuilding(_, { call, put }) {
      const data = yield call(getMyBuilding);
      if (data.success) {
        const info = {
          ...data.data,
        };
        delete info.buildings;
        const buildingsList = data.data.buildings.filter(checkBuildingData).filter(b => b.position).map(b => convertBuildingDataToRenderData(b));
        yield put({
          type: 'updateState',
          payload: {
            buildings: {
              list: buildingsList,
              map: convertBuildingsListToMap(buildingsList),
              usedMap: convertBuildingsListToUsedMap(buildingsList),
              storage: data.data.buildings.filter(checkBuildingData).filter(b => !b.position),
            },
            info,
          },
        });
      }
    },
    * buyBuilding({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(buyBuilding, payload);
      if (data.success) {
        yield put({
          type: 'getAccounts',
        });
        yield put({
          type: 'getMyBuilding',
        });
      }
      if (onSuccess) onSuccess();
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    // * insertBuilding({ payload, onSuccess }, { select, put }) {
    //   const { buildings } = yield select(({ farm_player }) => farm_player);
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       buildings: buildings.concat(convertBuildingDataToRenderData({
    //         ...payload,
    //         active_count: 0,
    //         rotate: false,
    //         id: parseInt(Math.random() * 10000, 10),
    //       })),
    //     },
    //   });
    //   if (onSuccess) onSuccess();
    // },
    * rotateBuilding({ payload }, { select, call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const rotate = !payload.rotate;
      const data = yield call(rotateBuilding, {
        id: payload.id,
        rotate,
      });
      if (data.success) {
        const { buildings } = yield select(({ farm_player }) => farm_player);
        const updateBuildings = {
          ...buildings,
          list: [...buildings.list],
          map: { ...buildings.map },
        };
        updateBuildings.list.filter(b => b.id === payload.id)[0].rotate = rotate;
        updateBuildings.map[payload.position[0]][payload.position[1]].rotate = rotate;
        yield put({
          type: 'updateState',
          payload: {
            buildings: updateBuildings,
          },
        });
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
    },
    * removeBuilding({ payload, onSuccess }, { select, call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(removeBuilding, payload.id);
      if (data.success) {
        const { buildings } = yield select(({ farm_player }) => farm_player);
        const updateBuildings = {
          ...buildings,
          list: buildings.list.filter(b => b.id !== payload.id),
        };
        updateBuildings.map = convertBuildingsListToMap(updateBuildings.list);
        updateBuildings.usedMap = convertBuildingsListToUsedMap(updateBuildings.list);
        yield put({
          type: 'updateState',
          payload: {
            buildings: updateBuildings,
          },
        });
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
      if (onSuccess) onSuccess();
    },
    * triggerBuildingEvent({ payload, onSuccess }, { select, put }) {
      const { buildings: originBuildings } = yield select(({ farm_player }) => farm_player);
      const buildings = [];
      let updatedBuilding;
      originBuildings.forEach((building) => {
        if (building.id === payload.id) {
          building.active_count += 1;
          updatedBuilding = convertBuildingDataToRenderData(building);
          buildings.push(updatedBuilding);
        } else {
          buildings.push(building);
        }
      });
      yield put({
        type: 'updateState',
        payload: {
          buildings,
        },
      });
      if (onSuccess) onSuccess(updatedBuilding);
    },
    * moveBuildingLocal({ payload }, { select, put }) {
      // console.log(payload);
      const { building, position } = payload;
      const { buildings } = yield select(({ farm_player }) => farm_player);
      const updateBuildings = {
        ...buildings,
        list: [...buildings.list],
      };
      updateBuildings.list.filter(b => b.id === building.id)[0].position = position;
      updateBuildings.map = convertBuildingsListToMap(updateBuildings.list);
      updateBuildings.usedMap = convertBuildingsListToUsedMap(updateBuildings.list);
      yield put({
        type: 'updateState',
        payload: {
          buildings: updateBuildings,
        },
      });
    },
    * moveBuildingFinish({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      yield call(moveBuildingFinish, {
        id: payload.id,
        position: `${payload.position[0]},${payload.position[1]}`,
      });
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
      if (onSuccess) onSuccess();
    },
    * deposit({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'farm_env/loading',
      });
      const data = yield call(deposit, {
        amount: payload,
      });
      if (data.success) {
        message.success('充值成功');
        yield put({
          type: 'getAccounts',
        });
        yield put({
          type: 'account/queryAccount',
        });
      }
      yield put({
        type: 'farm_env/loading',
        loading: false,
      });
      if (onSuccess) onSuccess();
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
