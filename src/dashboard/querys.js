import config from '../config';

const QUERYS = {
  LOGIN: '/api/v1/sessions.json',
  QUERY_MARKET: '/api/v1/markets.json',
  QUERY_BLOCK: '/api/v1/home.json',
  QUERY_MY: '/api/v1/my.json',
  QUEYR_ACCOUNT: '/api/v1/accounts.json',
  QUERY_ACTIVITIES_YESTERDAY: '/api/v1/activities/yesterday.json?page=1&state=submitted',
  QUERY_ACTIVITIES: '/api/v1/activities.json?page=1&state=submitted',
  QUERY_ACTIVITIES_DONE: page => `/api/v1/activities.json?page=${page}&state=done`,
  QUERY_ACTIVITIES_ALL: '/api/v1/activities.json?page=1',
  QUERY_ACTIVITIES_TOTAL: '/api/v1/activities/total.json',
  QUERY_ORDERS: '/api/v1/orders.json',
  QUERY_PRODUCTS: '/api/v1/products.json',
  QUERY_DEPOSITS: '/api/v1/deposits.json',
  QUERY_WITHDRAWS: '/api/v1/withdraws.json',
  QUERY_NOTICE: '/api/v1/notices.json',
  QUERY_SUB_USER: '/api/v1/my/sub_users.json',
  COLLECT: id => `/api/v1/activities/${id}/collect.json`,
  SEND_SMS: '/api/v1/sms.json',
  SEND_FORGET_SMS: '/api/v1/sms/reset_password.json',
  SIGNUP: '/api/v1/users.json',
  RESET_PASSWORD: '/api/v1/reset_password.json',

  // GAME
  GAME_BUILDINGS: '/api/v1/games/buildings.json',
  GAME_MY: '/api/v1/games/my.json',
  GAME_MY_BUFF: '/api/v1/games/buffs.json',
  GAME_MY_SETS: '/api/v1/games/sets.json',
  GAME_ACCOUNT: '/api/v1/games/accounts.json',
  GAME_BUY_BUILDING: id => `/api/v1/games/buildings/${id}/buy.json`,
  GAME_UPDATE_BUILDING: id => `/api/v1/games/buildings/${id}`,
  GAME_MY_GUILD: '/api/v1/games/unions/my.json',
  GAME_GUILDS: '/api/v1/games/unions.json',
  GAME_GUILD_UPDATE: id => `/api/v1/games/unions/${id}.json`,
  GAME_GUILD_REMOVE_USER: id => `/api/v1/games/unions/${id}/remove_user.json`,
  GAME_GUILD_JOIN: id => `/api/v1/games/unions/${id}/join.json`,
  GAME_GUILD_LEAVE: id => `/api/v1/games/unions/${id}/leave.json`,
  GAME_GUILD_UP: id => `/api/v1/games/unions/${id}/upgrade.json`,
  GAME_GUILD_DONATE: id => `/api/v1/games/unions/${id}/donate.json`,
  GAME_GUILD_UPGRADE_TECH: id => `/api/v1/games/unions/${id}/upgrade_technology.json`,
  GAME_SHOP_BASIC: '/api/v1/games/items.json',
  GAME_ME: '/api/v1/games/items/my.json',
  GAME_BUY_ITEM: id => `/api/v1/games/items/${id}/buy.json`,
  GAME_SELL_ITEM: id => `/api/v1/games/items/${id}/sell.json`,
  GAME_REPAIR_ITEM: id => `/api/v1/games/items/${id}/repair.json`,
  GAME_EQUIP: id => `/api/v1/games/items/${id}.json`,
  GAME_DEPOSIT: '/api/v1/games/accounts/deposit.json',
  GAME_BATTLES: '/api/v1/games/fightings.json',
};

const { DOMAIN: domain } = config;

Object.keys(QUERYS).forEach((key) => {
  if (typeof QUERYS[key] === 'string') {
    QUERYS[key] = domain + QUERYS[key];
  } else if (typeof QUERYS[key] === 'function') {
    const tmp = QUERYS[key];
    QUERYS[key] = (...args) => domain + tmp(...args);
  }
});

export default QUERYS;
