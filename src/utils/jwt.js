/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import config from '../config';

const { KEY, SECRET } = config;

const exp = {
  getPublicToken() {
    return jwt.sign({
      timestamp: parseInt(new Date().getTime() / 1000, 10),
    }, SECRET);
  },

  getKey() {
    return KEY;
  },

  verify(token) {
    return jwt.verify(token, SECRET);
  },

  getPrivateToken() {
    const member_id = localStorage.getItem('member_id');
    const member_token = localStorage.getItem('member_token');
    if (!member_id || !member_token) {
      return '__NO_LOGIN__';
    }
    const sig = jwt.sign({}, member_token);
    return jwt.sign({
      timestamp: parseInt(new Date().getTime() / 1000, 10),
      member_id,
      member_token,
      sig,
    }, SECRET);
  },
};

export default exp;
