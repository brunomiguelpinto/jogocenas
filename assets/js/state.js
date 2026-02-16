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
    genOutput: 1.2,
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
    state.energy += state.genOutput;
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
    state.genOutput += track.energyPerLvl;
    state.speed += track.speedPerLvl;

    return {
      upgraded: true,
      track: track,
      milestoneMessage: track.forgeAt[track.level],
      unlockedCarriage: track.unlocks && isTrackMaxed(track) ? track.unlocks : null,
    };
  }

  function getEfficiency() {
    var totalLvl = state.tracks.reduce(function (acc, track) {
      return acc + track.level;
    }, 0);

    return Math.min(99, Math.round(34 + totalLvl * 0.85));
  }

  function getGeneratorLevel() {
    return state.tracks[0].level + 1;
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
  };
})(window.KAEL || (window.KAEL = {}));
