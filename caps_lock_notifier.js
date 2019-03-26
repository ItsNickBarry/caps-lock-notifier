const ICON = '⚠️';

let capsLockState;

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

let setStyle = function (element) {
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

let restoreStyle = function (element) {
  let backup = element._caps_lock_notifier_backup;
  if (backup) {
    element.style['background-image'] = backup[0];
    element.style['background-position'] = backup[1];
    element.style['background-repeat'] = backup[2];
    element.title = backup[3];
  }
};

let setCapsLockState = function (state) {
  if (capsLockState !== state) {
    capsLockState = state;

    document.querySelectorAll('input').forEach(function (el) {
      if (el.type === 'password') {
        if (capsLockState) {
          setStyle(el);
        } else {
          restoreStyle(el);
        }
      }
    });
  }
};

// check for changes to state while page is in background
document.addEventListener('click', function (e) {
  setCapsLockState(e.getModifierState('CapsLock'));
});

// register event when any key is pressed
document.addEventListener('keyup', function (e) {
  if (e.key === 'CapsLock') {
    // getModifierState is always true if key is CapsLock
    // therefore, toggle, but only if state has previously been set
    if (typeof capsLockState !== 'undefined') {
      setCapsLockState(!capsLockState);
    }
  } else {
    // getModifierState can be trusted if key is not CapsLock
    setCapsLockState(e.getModifierState('CapsLock'));
  }
});
