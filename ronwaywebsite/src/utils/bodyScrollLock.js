let lockedScrollY = 0;

export function lockBodyScroll() {
  lockedScrollY = window.scrollY;
  const { style } = document.body;

  style.position = 'fixed';
  style.top = `-${lockedScrollY}px`;
  style.left = '0';
  style.right = '0';
  style.width = '100%';
  style.overflow = 'hidden';
}

export function unlockBodyScroll() {
  const { style } = document.body;

  style.position = '';
  style.top = '';
  style.left = '';
  style.right = '';
  style.width = '';
  style.overflow = '';
  window.scrollTo(0, lockedScrollY);
}
