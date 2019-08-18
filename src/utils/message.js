// import './message.scss';

// let handler;

// const iconMap = {
//   success: 'https://assets.zjzsxhy.com/upload/c0bc7d6e-cc1f-4da3-9bf8-ad2700bc49f7.svg',
//   error: 'https://assets.zjzsxhy.com/upload/95c1812d-5a21-4895-87ab-8899109c8f8d.svg',
// };

// function message(msg, type = 'success') {
//   let $c = document.getElementById('message');
//   if (!$c) {
//     $c = document.createElement('div');
//     $c.id = 'message';
//     document.body.appendChild($c);
//   }
//   $c.classList.remove('success');
//   $c.classList.remove('error');
//   $c.classList.add(type);
//   $c.innerHTML = `<img src="${iconMap[type]}"><span>${msg}</span>`;
//   if (handler) {
//     clearTimeout(handler);
//   }
//   handler = setTimeout(() => {
//     document.body.removeChild($c);
//   }, 5000);
// }


// const obj = {
//   error(msg) {
//     message(msg, 'error');
//   },
//   success(msg) {
//     message(msg, 'success');
//   },
// };

// export default obj;
import { message } from 'antd';

const ret = {};
const lastContent = {};

['error', 'info', 'loading', 'success', 'warn', 'warning'].forEach((key) => {
  lastContent[key] = '';
  ret[key] = (content, ...rest) => {
    if (lastContent[key] === content && content === '登錄過期，請重新登錄') return;
    lastContent[key] = content;
    message[key](content, ...rest);
  };
});

export default ret;
