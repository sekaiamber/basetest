import qs from 'qs';
import message from './message';
import jwt from './jwt';
import '../assets/fetch';

// const $token = document.querySelector('meta[name=csrf-token]');
// let token = '';
// if ($token) {
//   token = $token.getAttribute('content');
// }

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (window._APP_ && response.status === 401) {
    message.info('登錄過期，請重新登錄');
    localStorage.setItem('member_id', '__EMPTY__');
    localStorage.setItem('member_token', '__EMPTY__');
    window._APP_._store.dispatch({
      type: 'utils/goto',
      goto: '/login',
    });
  }
  const { status, statusText } = response;
  throw new Error(`[${status}] ${statusText}`);
}

function parseJSON(response) {
  return response.json();
}

function processData(data) {
  if (data.success === false) {
    data.errors.forEach(e => message.error(e.message ? e.message : e));
  }
  // 判斷升級
  if (data.upgrade && data.upgrade.force_upgrade) {
    window._APP_._store.dispatch({
      type: 'utils/updateState',
      payload: {
        needUpgrade: data.upgrade,
      },
    });
  }
  return data;
}

function catchError(error) {
  if (error.message.slice(1, 4) !== '401') message.error(error.message);
  return {
    success: false,
  };
}

// (url, {
//   headers: getPriveteHeader(),
//   ...options,
//   body,
//   method: 'POST',
//   credentials: 'include',
// })
function nativeFetch(url, options) {
  const { http } = window.cordova.plugin;
  const nativeOptions = {
    method: options.method.toLowerCase(),
    headers: options.headers,
    serializer: 'json',
    data: {},
  };
  if (options.body) {
    nativeOptions.data = JSON.parse(options.body);
  }
  return new Promise((resolve, reject) => {
    http.sendRequest(url, nativeOptions, (response) => {
      resolve({
        ...response,
        json() {
          return JSON.parse(this.data);
        },
      });
    }, (response) => {
      if (response.status === 401) {
        resolve(response);
      } else {
        const err = JSON.parse(response.error);
        reject(new Error(`(${err.status}) ${err.error}`));
      }
    });
  });
}

function getFetchLib() {
  let fetchlib;
  const { cordova } = window;
  if (cordova && cordova.plugin && cordova.plugin.http) {
    fetchlib = nativeFetch;
  } else {
    fetchlib = window.fetch;
  }
  return fetchlib;
}

function getPriveteHeader() {
  return {
    'X-App-Key': jwt.getKey(),
    'X-App-Auth': jwt.getPrivateToken(),
    'Content-Type': 'application/json',
  };
}

function privateBroke() {
  const currentUser = localStorage.getItem('member_id');
  const broke = currentUser === '__EMPTY__';
  if (broke) {
    setImmediate(() => {
      if (window._APP_) {
        window._APP_._store.dispatch({
          type: 'utils/goto',
          goto: '/login',
        });
      }
    });
  }
  return broke;
}

const fetchPrivate = {
  post(url, data, options = {}, form = false) {
    if (privateBroke()) {
      return new Promise((resolve) => {
        resolve({
          success: false,
        });
      });
    }
    let body;
    if (form) {
      data.append('locale', window.locale);
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        locale: window.locale,
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getPriveteHeader(),
      ...options,
      body,
      method: 'POST',
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  patch(url, data, options = {}, form = false) {
    if (privateBroke()) {
      return new Promise((resolve) => {
        resolve({
          success: false,
        });
      });
    }
    let body;
    if (form) {
      data.append('locale', window.locale);
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        locale: window.locale,
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getPriveteHeader(),
      ...options,
      body,
      method: 'PATCH',
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  put(url, data, options = {}, form = false) {
    if (privateBroke()) {
      return new Promise((resolve) => {
        resolve({
          success: false,
        });
      });
    }
    let body;
    if (form) {
      data.append('locale', window.locale);
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
        locale: window.locale,
      });
    }
    return getFetchLib()(url, {
      headers: getPriveteHeader(),
      ...options,
      body,
      method: 'PUT',
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  delete(url, options = {}) {
    if (privateBroke()) {
      return new Promise((resolve) => {
        resolve({
          success: false,
        });
      });
    }
    return getFetchLib()(url, {
      headers: getPriveteHeader(),
      ...options,
      method: 'DELETE',
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  get(url, data, options = {}) {
    if (privateBroke()) {
      return new Promise((resolve) => {
        resolve({
          success: false,
        });
      });
    }
    let queryUrl = url;
    if (data) {
      const params = qs.stringify({ ...data, locale: window.locale });
      queryUrl += '?' + params;
    }
    return getFetchLib()(queryUrl, {
      headers: getPriveteHeader(),
      credentials: 'include',
      ...options,
      method: 'GET',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
};

function getHeader() {
  return {
    'X-App-Key': jwt.getKey(),
    'X-App-Auth': jwt.getPublicToken(),
    'Content-Type': 'application/json',
  };
}

const fetch = {
  private: fetchPrivate,
  post(url, data, options = {}, form = false) {
    let body;
    if (form) {
      data.append('locale', window.locale);
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        locale: window.locale,
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getHeader(),
      ...options,
      body,
      method: 'POST',
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  patch(url, data, options = {}, form = false) {
    let body;
    if (form) {
      data.append('locale', window.locale);
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        locale: window.locale,
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getHeader(),
      ...options,
      body,
      method: 'PATCH',
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  put(url, data, options = {}, form = false) {
    let body;
    if (form) {
      data.append('locale', window.locale);
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
        locale: window.locale,
      });
    }
    return getFetchLib()(url, {
      headers: getHeader(),
      ...options,
      body,
      method: 'PUT',
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  delete(url, options = {}) {
    return getFetchLib()(url, {
      headers: getHeader(),
      ...options,
      method: 'DELETE',
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  get(url, data, options = {}) {
    let queryUrl = url;
    if (data) {
      const params = qs.stringify({ ...data, locale: window.locale });
      queryUrl += '?' + params;
    }
    return getFetchLib()(queryUrl, {
      headers: getHeader(),
      credentials: 'include',
      ...options,
      method: 'GET',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
};

export default fetch;
