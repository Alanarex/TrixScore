// navbar.js - Reusable Navbar component
class Navbar {
  constructor({ title = '', left = null, right = null, onBack = null, onSettings = null, onHistory = null }) {
    this.title = title;
    this.left = left;
    this.right = right;
    this.onBack = onBack;
    this.onSettings = onSettings;
    this.onHistory = onHistory;
  }
  render() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    const noop = () => {};
    // Left slot
    const leftSlot = document.createElement('div');
    leftSlot.className = 'nav-slot nav-left';
    if (this.left === 'back') {
      const leftBtn = document.createElement('button');
      leftBtn.className = 'nav-btn left-btn';
      leftBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
      leftBtn.onclick = this.onBack || noop;
      leftSlot.appendChild(leftBtn);
    }
    nav.appendChild(leftSlot);
    // Title
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = this.title;
    nav.appendChild(title);
    // Right slot (always show settings and history)
    const rightSlot = document.createElement('div');
    rightSlot.className = 'nav-slot nav-right';
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'nav-btn right-btn';
    settingsBtn.innerHTML = '<i class="fa-solid fa-gear"></i>';
    settingsBtn.onclick = this.onSettings || noop;
    rightSlot.appendChild(settingsBtn);
    const historyBtn = document.createElement('button');
    historyBtn.className = 'nav-btn right-btn';
    historyBtn.innerHTML = '<i class="fa-solid fa-clock"></i>';
    historyBtn.onclick = this.onHistory || noop;
    rightSlot.appendChild(historyBtn);
    nav.appendChild(rightSlot);
    return nav;
  }
}
window.Navbar = Navbar;
