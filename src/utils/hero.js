/* eslint-disable camelcase */
export function calculateHeroPower(level) {
  return 1 + (level - 1) * 5;
}

export function getLevelExp(level) {
  if (level === 1) return 0;
  if (level <= 10) return 1 + (level - 2) * 2;
  if (level <= 20) return 19 + (level - 11) * 3;
  if (level <= 30) return 49 + (level - 21) * 4;
  if (level <= 40) return 89 + (level - 31) * 5;
  if (level <= 50) return 139 + (level - 41) * 8;
  if (level <= 60) return 219 + (level - 51) * 12;
  if (level <= 70) return 339 + (level - 61) * 17;
  if (level <= 80) return 509 + (level - 71) * 23;
  if (level <= 90) return 739 + (level - 81) * 30;
  if (level <= 100) return 1039 + (level - 91) * 38;
  return -1;
}

const expStartMap = [0, 1, 19, 49, 89, 139, 219, 339, 509, 739, 1039, 99999];
const expGapMap = [1, 2, 3, 4, 5, 8, 12, 17, 23, 30, 38];
const expCountMap = [1, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10];

export function convertExpToLevel(exp) {
  let i;
  let level = 0;
  for (i = 0; i < expStartMap.length; i += 1) {
    if (expStartMap[i + 1] >= exp) break;
    level += expCountMap[i];
  }
  const stepDiff = exp - expStartMap[i];
  const stepLv = Math.floor(stepDiff / expGapMap[i]);
  return level + stepLv + 1;
}

export function calculateItemPower(item) {
  let radio = 0.05;
  if (item.meta.position === 'weapon') {
    radio = 0.08;
  }
  return item.meta.power * (1 + radio * (item.level - 1));
}

export function convertEquippedListToMap(equipped) {
  const ret = {
    head: null,
    body: null,
    lower: null,
    accessory: null,
    weapon: null,
  };

  equipped.forEach((e) => {
    ret[e.meta.position] = e;
  });

  return ret;
}

const positionMap = {
  head: '头部',
  body: '身体',
  lower: '裤子',
  accessory: '饰品',
  weapon: '武器',
  relic: '圣物',
};

export function getItemPositionName(meta) {
  const { position } = meta;
  let ret = positionMap[position];
  if (position === 'weapon') {
    ret = meta.weapon_type.desc;
  }
  return ret;
}

const quMap = {
  0: '杂物',
  1: '普通',
  2: '优秀',
  3: '精良',
  4: '史诗',
  5: '传说',
  6: '至宝',
};

export function getItemQuality(meta) {
  const { max_level } = meta;
  let level = 0;
  if (!max_level) {
    level = 0;
  } else if (max_level < 60) {
    level = 1;
  } else if (max_level < 80) {
    level = 2;
  } else if (max_level < 100) {
    level = 3;
  } else if (max_level < 120) {
    level = 4;
  } else if (max_level < 140) {
    level = 5;
  } else {
    level = 6;
  }
  return {
    level,
    desc: quMap[level],
  };
}

export function getItemUpgradeInfo(item) {
  const { level } = item;
  if (level < 20) {
    return {
      rate: '100%',
      cost: 200,
    };
  }
  if (level < 40) {
    return {
      rate: '90%',
      cost: 400,
    };
  }
  if (level < 60) {
    return {
      rate: '80%',
      cost: 800,
    };
  }
  if (level < 80) {
    return {
      rate: '70%',
      cost: 1500,
    };
  }
  if (level < 100) {
    return {
      rate: '60%',
      cost: 2000,
    };
  }
  if (level < 120) {
    return {
      rate: '45%',
      cost: 2000,
    };
  }
  if (level < 140) {
    return {
      rate: '30%',
      cost: 2000,
    };
  }
  return {
    rate: '10%',
    cost: 3000,
  };
}
