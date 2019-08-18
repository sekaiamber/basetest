import { routerRedux } from 'dva/router';
import { initMap, mapWidth, mapHeight } from './res';
import RESOURCE from '../../resource';
import fetch from '../../../utils/fetch';
import { hori } from '../../../utils';
import QUERYS from '../../querys';

const getBuildings = () => fetch.get(QUERYS.GAME_BUILDINGS);

const fieldWidth = hori ? window.innerHeight : window.innerWidth;
const fieldHeight = hori ? window.innerWidth : window.innerHeight;

const x0 = fieldWidth / 2;
const y0 = fieldHeight - (fieldWidth * 0.9 / 2);
let dx = fieldWidth * 0.9 / mapWidth / 2;
const dy = Math.ceil(dx / 2);
dx = dy * 2;

export default {
  namespace: 'farm_env',
  state: {
    buildingMetas: {
      building: [],
      plant: [],
    },
    bg: RESOURCE.BG[2],
    field: {
      x0,
      y0,
      dx,
      dy,
      width: mapWidth,
      height: mapHeight,
    },
    map: initMap,
    loading: false,
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
    * getBuildings(_, { call, put }) {
      const data = yield call(getBuildings);
      if (data.success) {
        const building = data.data.filter(b => b.building_type === 'building');
        const plant = data.data.filter(b => b.building_type === 'plant');
        building.sort((a, b) => (a.price < b.price ? -1 : 1));
        plant.sort((a, b) => (a.price < b.price ? -1 : 1));
        const buildingMetas = {
          building,
          plant,
        };
        yield put({
          type: 'updateState',
          payload: {
            buildingMetas,
          },
        });
      }
    },
    * setBackground({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          bg: RESOURCE.BG[payload],
        },
      });
    },
    * setField({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          field: payload,
        },
      });
    },
    * loading({ loading }, { put }) {
      if (loading === undefined) {
        yield put({
          type: 'updateState',
          payload: {
            loading: true,
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            loading: !!loading,
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
