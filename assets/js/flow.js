(function (KAEL) {
  var FTUE_STORAGE_KEY = 'kael_ftue_seen_v1';

  function hasSeenFtue() {
    try {
      return window.localStorage.getItem(FTUE_STORAGE_KEY) === '1';
    } catch (error) {
      return false;
    }
  }

  function markFtueSeen() {
    try {
      window.localStorage.setItem(FTUE_STORAGE_KEY, '1');
    } catch (error) {
      // Ignore storage failures (private mode, disabled storage, etc).
    }
  }

  function enterGame(skipIntro) {
    document.getElementById('ov0').classList.add('gone');
    document.getElementById('ov1').classList.add('gone');
    document.getElementById('gameLayer').classList.add('show');

    if (skipIntro) {
      KAEL.ui.showResources();
      KAEL.ui.showBottomNav();
      KAEL.ui.renderUpgrades();
      return;
    }

    runGameIntro();
  }

  function runBoot() {
    var fill = document.getElementById('bFill');
    var lines = document.getElementById('bLines');

    function addLine(html) {
      var line = document.createElement('span');
      line.innerHTML = html;
      lines.appendChild(line);
      requestAnimationFrame(function () {
        line.classList.add('sh');
      });
    }

    function progress(value) {
      fill.style.width = value + '%';
    }

    KAEL.utils.at(400, function () {
      KAEL.utils.draw('br1', 2.5);
      document.getElementById('br1s').style.opacity = '1';
      document.getElementById('br1s').style.animation = 'spinCW 30s linear infinite';
      progress(15);
    });

    KAEL.utils.at(1500, function () {
      addLine('<span class="sy">ENGINE</span> <span class="ok">RUNNING</span>');
      progress(35);
    });

    KAEL.utils.at(2200, function () {
      KAEL.utils.draw('br2', 2);
      progress(55);
    });

    KAEL.utils.at(3000, function () {
      addLine('<span class="sy">COMMS</span> <span class="wn">WEAK SIGNAL</span>');
      progress(72);
    });

    KAEL.utils.at(3600, function () {
      KAEL.utils.draw('br3', 1.5);
      progress(85);
    });

    KAEL.utils.at(4300, function () {
      document.getElementById('bcore').style.opacity = '1';
      document.getElementById('bcore').style.animation = 'scaleIn .5s ease forwards';
      progress(92);
    });

    KAEL.utils.at(4900, function () {
      document.getElementById('bArca').style.opacity = '1';
      document.getElementById('bArca').style.animation = 'fadeIn .5s ease forwards';
    });

    KAEL.utils.at(5400, function () {
      document.getElementById('bKael').style.opacity = '1';
      document.getElementById('bKael').style.animation = 'glitch 5s ease infinite';
      progress(100);
    });

    KAEL.utils.at(6100, function () {
      addLine('<span class="wn">⚠ MEMORY 77% CORRUPTED</span>');
    });

    KAEL.utils.at(7500, function () {
      document.getElementById('ov0').classList.add('gone');
      document.getElementById('ov1').classList.remove('gone');
      runAwaken();
    });
  }

  function runAwaken() {
    var text = document.getElementById('awText');
    var lines = KAEL.data.awakenLines;
    var delay = 500;

    lines.forEach(function (line, index) {
      KAEL.utils.at(delay, function () {
        var item = document.createElement('div');
        item.innerHTML = line;
        item.style.opacity = '0';
        item.style.transition = 'opacity .6s';

        text.appendChild(item);
        text.style.opacity = '1';

        requestAnimationFrame(function () {
          item.style.opacity = '1';
        });
      });

      delay += index === 0 ? 1200 : index === 6 ? 1200 : 800;
    });

    KAEL.utils.at(delay + 800, function () {
      var prompt = document.getElementById('awPrompt');
      var awakenOverlay = document.getElementById('ov1');

      prompt.style.opacity = '1';
      prompt.style.transition = 'opacity .5s';
      prompt.style.animation = 'pulseB 1.5s ease-in-out infinite';

      awakenOverlay.addEventListener(
        'click',
        function () {
          markFtueSeen();
          enterGame(false);
        },
        { once: true }
      );
    });
  }

  function runGameIntro() {
    KAEL.utils.at(500, function () {
      KAEL.dialogue.say(
        "You're online. <em>Good.</em> I'm FORGE — the engineering intelligence. I've been keeping this train running for... a long time.",
        function () {
          KAEL.ui.showResources();
        }
      );
    });

    KAEL.utils.at(500, function () {
      KAEL.dialogue.say(
        "The <em>generator</em> converts movement into energy. But it's barely holding together. I've identified the most urgent repair.",
        function () {
          KAEL.ui.showBottomNav();
          KAEL.ui.renderUpgrades();
        }
      );
    });

    KAEL.utils.at(500, function () {
      KAEL.dialogue.say(
        "One thing at a time. Fix what's broken, then I can diagnose what's next.",
        function () {}
      );
    });
  }

  KAEL.flow = {
    hasSeenFtue: hasSeenFtue,
    enterGame: enterGame,
    runBoot: runBoot,
  };
})(window.KAEL || (window.KAEL = {}));
