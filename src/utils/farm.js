/* eslint-disable no-restricted-globals */
import { hori } from './index';

function getClickPosition(pageX, pageY) {
  // const x = hori ? pageY : pageX;
  // const y = hori ? (window.innerWidth - pageX) : pageY;
  return {
    x: pageX,
    y: pageY,
  };
}

function getClickCoordinate(pageX, pageY, field) {
  const { x, y } = getClickPosition(pageX, pageY);
  const {
    x0, y0, dx, dy,
  } = field;
  const _dx = (x - x0) / dx;
  const _dy = (y - y0) / dy;
  const j = (_dx + _dy) / 2;
  const i = (_dy - _dx) / 2;
  return [
    i,
    j,
  ];
}

function getClickCoordinateRound(pageX, pageY, field) {
  const [i, j] = getClickCoordinate(pageX, pageY, field);
  const i0 = Math.floor(i);
  const i1 = Math.ceil(i);
  const j0 = Math.floor(j);
  const j1 = Math.ceil(j);
  return [
    (i - i0) < 0.5 ? i0 : i1,
    (j - j0) < 0.5 ? j0 : j1,
  ];
}

function convertCoordinateToPosition(i, j, field) {
  const {
    x0, y0, dx, dy,
  } = field;
  const x = x0 + (j - i) * dx;
  const y = y0 + (j + i) * dy;
  return {
    x,
    y,
  };
}

function checkBuildingData(data) {
  // TODO: 过滤过期building
  if (data.position) {
    if (isNaN(parseInt(data.position[0], 10))) return false;
    if (isNaN(parseInt(data.position[1], 10))) return false;
  }
  return true;
}

function convertBuildingDataToRenderData(data) {
  // TODO: 按时间变贴图
  const ret = {
    ...data,
    texture: data.meta.textures.slice(-1)[0],
    position: [parseInt(data.position[0], 10), parseInt(data.position[1], 10)],
  };
  return ret;
}

function convertBuildingsListToMap(buildings) {
  const ret = {};
  buildings.forEach((building) => {
    const [i, j] = building.position;
    if (!ret[i]) {
      ret[i] = {};
    }
    ret[i][j] = building;
  });
  return ret;
}

function convertBuildingsListToUsedMap(buildings) {
  const map = {};
  buildings.forEach((building) => {
    const [bi, bj] = building.position;
    const bsize = building.meta.size;
    for (let _i = 0; _i < bsize[0]; _i += 1) {
      for (let _j = 0; _j < bsize[1]; _j += 1) {
        const ii = bi - _i;
        const jj = bj - _j;
        if (!map[ii]) {
          map[ii] = {};
        }
        map[ii][jj] = building;
      }
    }
  });
  return map;
}

function areaUsedInBuildingsList(buildings, i, j, size = [1, 1], filter = () => true) {
  const map = convertBuildingsListToUsedMap(buildings);
  for (let _i = 0; _i < size[0]; _i += 1) {
    for (let _j = 0; _j < size[1]; _j += 1) {
      const ii = i - _i;
      const jj = j - _j;
      if (map[ii] && map[ii][jj] && filter(map[ii][jj])) return map[ii][jj];
    }
  }
  return null;
}

export {
  getClickPosition,
  getClickCoordinate,
  convertCoordinateToPosition,
  getClickCoordinateRound,
  convertBuildingDataToRenderData,
  convertBuildingsListToMap,
  areaUsedInBuildingsList,
  convertBuildingsListToUsedMap,
  checkBuildingData,
};
