(function (KAEL) {
  function at(delay, fn) {
    return setTimeout(fn, delay);
  }

  function draw(id, durationSeconds) {
    var circle = document.getElementById(id);
    if (!circle) {
      return;
    }

    circle.style.opacity = '1';
    circle.style.transition = 'stroke-dashoffset ' + durationSeconds + 's ease';
    circle.style.strokeDashoffset = '0';
  }

  function createSnow() {
    var snowBox = document.getElementById('snowBox');
    if (!snowBox) {
      return;
    }

    for (var i = 0; i < 16; i += 1) {
      var flake = document.createElement('div');
      var size = Math.random() * 2 + 0.5;

      flake.className = 'sf';
      flake.style.width = size + 'px';
      flake.style.height = size + 'px';
      flake.style.left = Math.random() * 100 + '%';
      flake.style.animationDuration = Math.random() * 10 + 8 + 's';
      flake.style.animationDelay = Math.random() * 12 + 's';

      snowBox.appendChild(flake);
    }
  }

  KAEL.utils = {
    at: at,
    draw: draw,
    createSnow: createSnow,
  };
})(window.KAEL || (window.KAEL = {}));
