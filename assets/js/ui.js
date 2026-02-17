(function (KAEL) {
  var elements = {
    upgSlot: document.getElementById('upgSlot'),
    vEnergy: document.getElementById('vEnergy'),
    vSpeed: document.getElementById('vSpeed'),
    speedTxt: document.getElementById('speedTxt'),
    statOutput: document.getElementById('statOutput'),
    statEff: document.getElementById('statEff'),
    genLvl: document.getElementById('genLvl'),
    genBadge: document.getElementById('genBadge'),
    rEnergy: document.getElementById('rEnergy'),
    tempBadge: document.getElementById('tempBadge'),
    genStatus: document.getElementById('genStatus'),
    genPanel: document.getElementById('genPanel'),
    lockedPanel: document.getElementById('lockedPanel'),
    liIcon: document.getElementById('liIcon'),
    liTitle: document.getElementById('liTitle'),
    liReq: document.getElementById('liReq'),
    resStrip: document.getElementById('resStrip'),
    botNav: document.getElementById('botNav'),
  };

  function updateGeneratorStatus(track) {
    var currentState = KAEL.state.state;
    var statusText = track.name + ' — Lv.' + track.level + '/' + track.maxLevel;

    if (track.id === 'coils' && KAEL.state.isTrackMaxed(track) && currentState.coldLoss > 0) {
      statusText = 'Temperature dropping. Coils are holding, but we are losing heat in the turbine housing.';
    }

    if (track.id === 'thermal' && !KAEL.state.isTrackMaxed(track) && currentState.coldLoss > 0) {
      statusText = 'Insulation in progress. Recovering output from cold loss.';
    }

    if (track.id === 'thermal' && KAEL.state.isTrackMaxed(track)) {
      statusText = "Thermals stable. Dynamo vibration is now the critical fault.";
    }

    if (track.id === 'dynamo' && KAEL.state.isTrackMaxed(track)) {
      statusText = 'Generator stable. Workshop online. Baseline reached, not completion.';
    }

    elements.genStatus.innerHTML =
      '<span style="color:var(--am)">FORGE:</span> ' +
      statusText;
  }

  function unlockCarriage(carriageId) {
    var carriage = document.querySelector('[data-car="' + carriageId + '"]');
    if (!carriage) {
      return;
    }

    carriage.classList.remove('locked');
    carriage.classList.add('unlocked');

    var lock = carriage.querySelector('.car-lock');
    if (lock) {
      lock.remove();
    }

    var emoji = carriage.querySelector('.car-emoji');
    if (emoji) {
      emoji.style.opacity = '1';
      emoji.style.filter = 'none';
    }

    var level = document.createElement('div');
    level.className = 'car-lvl';
    level.textContent = 'Lv.1';
    carriage.appendChild(level);
  }

  function handleUpgrade(index) {
    var result = KAEL.state.upgrade(index);
    if (!result.upgraded) {
      return;
    }

    if (result.milestoneMessage) {
      KAEL.dialogue.say(result.milestoneMessage, function () {
        updateGeneratorStatus(result.track);

        if (result.unlockedCarriage) {
          unlockCarriage(result.unlockedCarriage);
        }

        updateUI();
      });
      updateUI();
      return;
    }

    updateGeneratorStatus(result.track);
    updateUI();
  }

  function upgradeDescription(track) {
    if (track.id === 'dynamo') {
      return '+5.0 energy/s, +20 km/h — Unlocks Workshop';
    }
    if (track.id === 'thermal') {
      return 'Recovers up to -0.3/s cold loss, +0.8 km/h';
    }

    var energyPart = track.energyPerLvl > 0 ? '+' + track.energyPerLvl.toFixed(2) + ' energy/s' : '';
    var speedPart = track.speedPerLvl > 0 ? '+' + track.speedPerLvl + ' km/h' : '';

    if (energyPart && speedPart) {
      return energyPart + ', ' + speedPart;
    }

    return energyPart || speedPart;
  }

  function renderUpgrades() {
    var tracks = KAEL.state.state.tracks;
    var html = '';

    tracks.forEach(function (track, index) {
      if (!KAEL.state.isTrackUnlocked(track)) {
        return;
      }

      if (KAEL.state.isTrackMaxed(track)) {
        html +=
          '<div class="upg done">' +
          '<div class="upg-icon" style="background:' +
          track.iconBg +
          '">' +
          track.icon +
          '</div>' +
          '<div class="upg-info">' +
          '<div class="upg-name">' +
          track.name +
          '</div>' +
          '<div class="upg-desc" style="color:var(--gn)">✓ Complete — Lv.' +
          track.level +
          '</div>' +
          '</div>' +
          '<div class="upg-cost" style="color:var(--gn)">MAX</div>' +
          '</div>';
        return;
      }

      var cost = KAEL.state.getTrackCost(track);
      var canAfford = KAEL.state.state.energy >= cost;
      var progress = ((track.level / track.maxLevel) * 100).toFixed(0);
      var barColor =
        track.level >= track.maxLevel * 0.8
          ? 'var(--gn)'
          : track.level >= track.maxLevel * 0.5
          ? 'var(--cy)'
          : 'var(--am)';

      html +=
        '<div class="upg ' +
        (canAfford ? '' : 'cant') +
        '" data-track="' +
        index +
        '">' +
        '<div class="upg-icon" style="background:' +
        track.iconBg +
        '">' +
        track.icon +
        '</div>' +
        '<div class="upg-info">' +
        '<div class="upg-name">' +
        track.name +
        ' <span style="color:var(--cy);font-family:\'JetBrains Mono\',monospace;font-size:9px">Lv.' +
        track.level +
        '→' +
        (track.level + 1) +
        '</span></div>' +
        '<div class="upg-desc">' +
        upgradeDescription(track) +
        '</div>' +
        '<div style="width:100%;height:3px;background:rgba(255,255,255,0.04);border-radius:2px;margin-top:6px;overflow:hidden">' +
        '<div style="height:100%;width:' +
        progress +
        '%;background:' +
        barColor +
        ';border-radius:2px;transition:width .3s"></div>' +
        '</div>' +
        '</div>' +
        '<div class="upg-cost" style="color:' +
        (canAfford ? 'var(--gn)' : 'var(--am)') +
        '">⚡ ' +
        cost +
        '</div>' +
        '</div>';
    });

    if (!html) {
      html =
        '<div style="text-align:center;padding:14px;font-family:\'JetBrains Mono\',monospace;font-size:9px;color:var(--gn);letter-spacing:1px">✓ ALL SYSTEMS STABLE</div>';
    }

    elements.upgSlot.innerHTML = html;
  }

  function updateUI() {
    var currentState = KAEL.state.state;
    var effectiveOutput = KAEL.state.getEffectiveOutput();
    var hasColdLoss = currentState.coldLoss > 0;

    elements.vEnergy.textContent = Math.floor(currentState.energy);
    elements.vSpeed.textContent = currentState.speed;
    elements.speedTxt.textContent = currentState.speed + ' km/h';
    elements.statOutput.textContent = '+' + effectiveOutput.toFixed(1);
    elements.statEff.textContent = KAEL.state.getEfficiency() + '%';
    elements.genLvl.textContent = 'Lv.' + KAEL.state.getGeneratorLevel();
    elements.genBadge.textContent = 'Lv.' + KAEL.state.getGeneratorLevel();
    elements.tempBadge.textContent = '❄ ' + currentState.tempC + '°C';

    if (currentState.tempC <= -71) {
      elements.tempBadge.style.color = 'var(--rd)';
      elements.tempBadge.style.borderColor = 'rgba(255,51,68,0.4)';
      elements.tempBadge.style.background = 'rgba(255,51,68,0.1)';
    } else {
      elements.tempBadge.style.color = 'var(--cy)';
      elements.tempBadge.style.borderColor = 'rgba(0,240,255,0.15)';
      elements.tempBadge.style.background = 'rgba(0,240,255,0.06)';
    }

    if (hasColdLoss) {
      elements.rEnergy.textContent =
        '+' +
        effectiveOutput.toFixed(1) +
        '/s (-' +
        currentState.coldLoss.toFixed(1) +
        '/s cold loss)';
      elements.rEnergy.style.color = 'var(--am)';
    } else {
      elements.rEnergy.textContent = '+' + effectiveOutput.toFixed(1) + '/s';
      elements.rEnergy.style.color = 'var(--gn)';
    }

    renderUpgrades();
  }

  function flashEnergy() {
    elements.vEnergy.classList.add('flash');
    KAEL.utils.at(200, function () {
      elements.vEnergy.classList.remove('flash');
    });
  }

  function bindUpgradeInteractions() {
    elements.upgSlot.addEventListener('click', function (event) {
      var card = event.target.closest('.upg');
      if (!card || card.classList.contains('done')) {
        return;
      }

      handleUpgrade(parseInt(card.dataset.track, 10));
    });
  }

  function bindCarInteraction() {
    var lockedData = KAEL.data.lockedData;

    document.querySelectorAll('.car').forEach(function (car) {
      car.addEventListener('click', function () {
        var id = car.dataset.car;
        if (!id) {
          return;
        }

        document.querySelectorAll('.car').forEach(function (item) {
          item.classList.remove('selected');
        });

        if (car.classList.contains('locked') && lockedData[id]) {
          car.classList.add('selected');
          elements.genPanel.classList.remove('show');
          elements.lockedPanel.classList.add('show');

          elements.liIcon.textContent = lockedData[id].icon;
          elements.liTitle.textContent = lockedData[id].title;
          elements.liReq.innerHTML = lockedData[id].req;
          return;
        }

        if (id === 'generator') {
          car.classList.add('selected');
          elements.lockedPanel.classList.remove('show');
          elements.genPanel.classList.add('show');
        }
      });
    });
  }

  function showResources() {
    elements.resStrip.classList.add('show');
  }

  function showBottomNav() {
    elements.botNav.classList.add('show');
  }

  KAEL.ui = {
    bindUpgradeInteractions: bindUpgradeInteractions,
    bindCarInteraction: bindCarInteraction,
    flashEnergy: flashEnergy,
    renderUpgrades: renderUpgrades,
    updateUI: updateUI,
    showResources: showResources,
    showBottomNav: showBottomNav,
  };
})(window.KAEL || (window.KAEL = {}));
