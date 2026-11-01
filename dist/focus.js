function devolverFoco(el) {
  if (!el || typeof el.focus !== "function") return;
  el.setAttribute("data-hrl-foco-devuelto", "");
  el.focus();
}
export {
  devolverFoco
};
//# sourceMappingURL=focus.js.map
