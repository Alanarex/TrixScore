// src/screens/contract-forms.js - Individual contract form renderers

(function() {
  function renderTrexContractForm(players, state) {
    const form = buildTrexForm(players, state);
    state._trexOrder = form.getOrder;
    return form.element;
  }

  function renderQueensContractForm(players, state) {
    const form = buildQueensForm(players);
    state._queensData = form.getQueensData;
    return form.element;
  }

  function renderKingContractForm(players, state) {
    const form = buildKingForm(players);
    state._kingData = form.getKingData;
    return form.element;
  }

  function renderDiamondsContractForm(players, state) {
    const form = buildDiamondsForm(players);
    state._diamondSteppers = form.getSteppers();
    return form.element;
  }

  function renderTricksContractForm(players, state) {
    const form = buildTricksForm(players);
    state._trickSteppers = form.getSteppers();
    return form.element;
  }

  window.renderTrexContractForm = renderTrexContractForm;
  window.renderQueensContractForm = renderQueensContractForm;
  window.renderKingContractForm = renderKingContractForm;
  window.renderDiamondsContractForm = renderDiamondsContractForm;
  window.renderTricksContractForm = renderTricksContractForm;
})();
