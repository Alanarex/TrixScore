// modal.js - Reusable Modal component
class Modal {
  constructor({ content = '', actions = [], onClose = null, blockClose = false }) {
    this.content = content;
    this.actions = actions;
    this.onClose = onClose;
    this.blockClose = blockClose;
    this.modal = null;
  }
  show() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.tabIndex = -1;
    this.modal.innerHTML = `<div class="modal-content">${this.content}<div class="modal-actions"></div></div>`;
    const actionsDiv = this.modal.querySelector('.modal-actions');
    this.actions.forEach(({ label, onClick, danger, className }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.className = className || 'btn btn-primary';
      if (danger) btn.classList.add('btn-danger');
      btn.onclick = () => {
        if (onClick) onClick();
        this.close();
      };
      actionsDiv.appendChild(btn);
    });
    if (!this.blockClose) {
      this.modal.onclick = (e) => {
        if (e.target === this.modal) this.close();
      };
    }
    document.body.appendChild(this.modal);
    document.body.classList.add('modal-open');
  }
  close() {
    if (this.modal) {
      document.body.removeChild(this.modal);
      document.body.classList.remove('modal-open');
      if (this.onClose) this.onClose();
    }
  }
}
window.Modal = Modal;
