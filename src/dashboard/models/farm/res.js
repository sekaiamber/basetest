import RESOURCE from '../../resource';

// 生成MAP

const mapWidth = 9;
const mapHeight = 9;

const initMap = [];
for (let i = 0; i < mapHeight; i += 1) {
  initMap.push([]);
  for (let j = 0; j < mapWidth; j += 1) {
    initMap[i][j] = [{
      texture: RESOURCE.UI.BRICK,
      scale: {
        x: 1,
        y: 1,
      },
      offset: {
        left: 0,
        top: 0,
      },
    }];
  }
  // 增加右侧边框
  initMap[i][mapWidth] = [{
    texture: RESOURCE.UI.BRICK,
    scale: {
      x: 1,
      y: 1,
    },
    offset: {
      left: 0,
      top: 0,
    },
  }];
}

// 增加左侧边框
initMap[mapHeight] = [];
for (let j = 0; j < mapWidth + 1; j += 1) {
  initMap[mapHeight][j] = [{
    texture: RESOURCE.UI.BRICK,
    scale: {
      x: 1,
      y: 1,
    },
    offset: {
      left: 0,
      top: 0,
    },
  }];
}

// 增加边框数据
initMap[mapHeight][mapWidth].push({
  texture: RESOURCE.UI.BORDER_CENTER,
  scale: {
    x: 1,
    y: 2.5,
  },
  offset: {
    left: 0,
    top: 2,
  },
  z: 10,
});
initMap[mapHeight][0] = [{
  texture: RESOURCE.UI.BORDER_LEFT_LIMIT,
  scale: {
    x: 1,
    y: 2.5,
  },
  offset: {
    left: -1,
    top: 3,
  },
  z: 10,
}];
initMap[0][mapWidth] = [{
  texture: RESOURCE.UI.BORDER_RIGHT_LIMIT,
  scale: {
    x: 1,
    y: 2.5,
  },
  offset: {
    left: 1,
    top: 3,
  },
  z: 10,
}];
[4, 8].forEach((i) => {
  initMap[mapHeight][mapWidth - i].push({
    texture: RESOURCE.UI.BORDER_LEFT,
    scale: {
      x: 2,
      y: 4,
    },
    offset: {
      left: 0,
      top: 5,
    },
    z: 10,
  });
  initMap[mapHeight - i][mapWidth].push({
    texture: RESOURCE.UI.BORDER_RIGHT,
    scale: {
      x: 2,
      y: 4,
    },
    offset: {
      left: -2,
      top: 5,
    },
    z: 10,
  });
});

export {
  initMap,
  mapWidth,
  mapHeight,
};
