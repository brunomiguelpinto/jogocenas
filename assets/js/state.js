(function (KAEL) {
  var sourceTracks = KAEL.data.tracks;

  function cloneTrack(track) {
    return {
      id: track.id,
      icon: track.icon,
      iconBg: track.iconBg,
      name: track.name,
      level: track.level,
      maxLevel: track.maxLevel,
      baseCost: track.baseCost,
      costScale: track.costScale,
      energyPerLvl: track.energyPerLvl,
      speedPerLvl: track.speedPerLvl,
      unlockAt: track.unlockAt,
      unlockedBy: track.unlockedBy,
      unlocks: track.unlocks,
      forgeAt: Object.assign({}, track.forgeAt),
    };
  }

  var state = {
    energy: 0,
    speed: 42,
    baseOutput: 1.2,
    tempC: -67,
    coldLoss: 0,
    maxColdLoss: 0.3,
    tracks: sourceTracks.map(cloneTrack),
  };

  function getTrackCost(track) {
    return Math.floor(track.baseCost * Math.pow(track.costScale, track.level));
  }

  function isTrackUnlocked(track) {
    if (track.unlockAt === 0) {
      return true;
    }

    var dependency = state.tracks.find(function (item) {
      return item.id === track.unlockedBy;
    });

    return dependency && dependency.level >= track.unlockAt;
  }

  function isTrackMaxed(track) {
    return track.level >= track.maxLevel;
  }

  function tickEnergy() {
    state.energy += getEffectiveOutput();
  }

  function upgrade(index) {
    var track = state.tracks[index];

    if (!track || isTrackMaxed(track)) {
      return { upgraded: false };
    }

    var cost = getTrackCost(track);
    if (state.energy < cost) {
      return { upgraded: false };
    }

    state.energy -= cost;
    track.level += 1;
    state.baseOutput += track.energyPerLvl;
    state.speed += track.speedPerLvl;

    if (track.id === 'coils' && isTrackMaxed(track) && state.coldLoss === 0) {
      state.tempC = -71;
      state.coldLoss = state.maxColdLoss;
    }

    if (track.id === 'thermal') {
      if (state.coldLoss > 0) {
        state.coldLoss = Math.max(0, state.coldLoss - state.maxColdLoss / track.maxLevel);
      }

      if (isTrackMaxed(track)) {
        state.tempC = -69;
      } else {
        state.tempC = track.level % 2 === 0 ? -70 : -72;
      }
    }

    if (track.id === 'dynamo' && isTrackMaxed(track)) {
      state.tempC = -67;
      state.coldLoss = 0;
    }

    return {
      upgraded: true,
      track: track,
      milestoneMessage: track.forgeAt[track.level],
      unlockedCarriage: track.unlocks && isTrackMaxed(track) ? track.unlocks : null,
    };
  }

  function getEfficiency() {
    var baseEfficiency = state.tracks.reduce(function (acc, track) {
      return acc + track.level;
    }, 0) * 0.85 + 34;

    var coldPenalty = Math.round(state.coldLoss * 35);
    return Math.max(10, Math.min(99, Math.round(baseEfficiency - coldPenalty)));
  }

  function getGeneratorLevel() {
    return state.tracks[0].level + 1;
  }

  function getEffectiveOutput() {
    return Math.max(0.1, state.baseOutput - state.coldLoss);
  }

  KAEL.state = {
    state: state,
    getTrackCost: getTrackCost,
    isTrackUnlocked: isTrackUnlocked,
    isTrackMaxed: isTrackMaxed,
    tickEnergy: tickEnergy,
    upgrade: upgrade,
    getEfficiency: getEfficiency,
    getGeneratorLevel: getGeneratorLevel,
    getEffectiveOutput: getEffectiveOutput,
  };
})(window.KAEL || (window.KAEL = {}));
