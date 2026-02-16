(function (KAEL) {
  function startEnergyTick() {
    setInterval(function () {
      KAEL.state.tickEnergy();
      KAEL.ui.flashEnergy();
      KAEL.ui.updateUI();
    }, 1000);
  }

  function init() {
    KAEL.utils.createSnow();

    KAEL.ui.bindUpgradeInteractions();
    KAEL.ui.bindCarInteraction();
    KAEL.ui.updateUI();

    startEnergyTick();

    if (KAEL.flow.hasSeenFtue()) {
      KAEL.flow.enterGame(true);
      return;
    }

    KAEL.utils.at(300, KAEL.flow.runBoot);
  }

  init();
})(window.KAEL || (window.KAEL = {}));
