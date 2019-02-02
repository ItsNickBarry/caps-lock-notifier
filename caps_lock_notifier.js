const ICON = '⚠️';

let isPasswordTarget = function (e) {
  return e.target.nodeName === 'INPUT' && e.target.type === 'password';
};

let backgrounds = {};

let getBackground = function (height) {
  if (typeof backgrounds[height] === 'undefined') {
    // https://koddsson.com/posts/emoji-favicon/
    let canvas = document.createElement('canvas');
    canvas.height = canvas.width = height;

    let ctx = canvas.getContext('2d');
    let h = Math.floor(height * 0.8);
    ctx.font = `${ h }px serif`;
    ctx.fillText(ICON, 0, h);

    backgrounds[height] = `url(${ canvas.toDataURL() })`;
  }
  return backgrounds[height];
};

let setAttributes = function (element) {
  if (!element._caps_lock_notifier_backup) {
    element._caps_lock_notifier_backup = [
      element.style['background-image'],
      element.style['background-position'],
      element.style['background-repeat'],
      element.title,
    ];
  }
  element.style['background-image'] = getBackground(element.clientHeight);
  element.style['background-repeat'] = 'no-repeat';
  element.style['background-position'] = 'center right';
  element.title = 'CAPS LOCK is on!'
};

let restoreAttributes = function (element) {
  let backup = element._caps_lock_notifier_backup;
  if (backup) {
    element.style['background-image'] = backup[0];
    element.style['background-position'] = backup[1];
    element.style['background-repeat'] = backup[2];
    element.title = backup[3];
  }
};

let handler = function (e) {
  if (isPasswordTarget(e) && e.getModifierState('CapsLock')) {
    setAttributes(e.target);
  } else {
    restoreAttributes(e.target);
  }
};

// register event when selecting a password input element
document.addEventListener('click', handler);
// register event when caps lock is pressed
document.addEventListener('keyup', handler);
