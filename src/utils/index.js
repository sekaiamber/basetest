const hori = window.innerWidth < window.innerHeight;

export function getRestTime(target) {
  const nowTime = Date.now();
  const timespan = target - nowTime;
  if (timespan < 0) {
    return {
      day: 0,
      hour: '00',
      minute: '00',
      second: '00',
    };
  }
  const timediff = Math.round((target - nowTime) / 1000);
  const day = parseInt(timediff / 3600 / 24, 10);
  const hour = parseInt(timediff / 3600 % 24, 10);
  const minute = parseInt(timediff / 60 % 60, 10);
  const second = timediff % 60;
  return {
    day,
    hour: hour > 9 ? hour : `0${hour}`,
    minute: minute > 9 ? minute : `0${minute}`,
    second: second > 9 ? second : `0${second}`,
  };
}

export function getRestTimeFormatted(target) {
  const t = new Date(target);
  const rest = getRestTime(t);
  let ret = '';
  if (rest.day > 0) {
    ret += rest.day + '天';
  }
  // const hour = parseInt(rest.hour, 10);
  // if (hour > 0) {
  //   ret += rest.hour + '小时';
  // }
  // const minute = parseInt(rest.minute, 10);
  // if (minute > 0) {
  //   ret += rest.minute + '分钟';
  // }
  // const second = parseInt(rest.second, 10);
  // if (second > 0) {
  //   ret += rest.second + '秒';
  // }
  ret += `${rest.hour}:${rest.minute}:${rest.second}`;
  return ret;
}

export {
  hori,
};
