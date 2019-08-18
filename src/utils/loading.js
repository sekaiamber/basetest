import './loading.scss';

export function loading(msg = '請稍等') {
  let $c = document.getElementById('loading');
  if (!$c) {
    $c = document.createElement('div');
    $c.id = 'loading';
    document.body.appendChild($c);
  }
  $c.innerHTML = `<span>${msg}</span>`;
}

export function removeLoading() {
  const $c = document.getElementById('loading');
  if ($c) {
    $c.remove();
  }
}
