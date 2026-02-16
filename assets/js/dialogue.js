(function (KAEL) {
  var queue = [];
  var isBusy = false;

  function say(text, onDone) {
    queue.push({ text: text, onDone: onDone });
    if (!isBusy) {
      showNext();
    }
  }

  function showNext() {
    if (!queue.length) {
      isBusy = false;
      return;
    }

    var item = queue.shift();
    var dlg = document.getElementById('dlg');
    var dlgText = document.getElementById('dlgText');

    isBusy = true;
    dlgText.innerHTML = item.text;
    dlg.classList.add('show');

    KAEL.utils.at(400, function () {
      dlg.addEventListener(
        'click',
        function handler() {
          dlg.removeEventListener('click', handler);
          dlg.classList.remove('show');

          if (item.onDone) {
            item.onDone();
          }

          KAEL.utils.at(300, showNext);
        },
        { once: true }
      );
    });
  }

  KAEL.dialogue = {
    say: say,
  };
})(window.KAEL || (window.KAEL = {}));
