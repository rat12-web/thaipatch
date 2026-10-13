(() => {
  const button = document.getElementById('themeToggle');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const dark = theme === 'dark';
    document.getElementById('themeIcon').textContent = dark ? '☀' : '☾';
    document.getElementById('themeLabel').textContent = dark ? 'โหมดสว่าง' : 'โหมดมืด';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#15212b' : '#f5f8fb';
  }
  apply(document.documentElement.dataset.theme);
  button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(theme);
    try { localStorage.setItem('romthai.theme', theme); } catch {}
  });
  media.addEventListener('change', event => {
    let saved = null;
    try { saved = localStorage.getItem('romthai.theme'); } catch {}
    if (saved !== 'light' && saved !== 'dark') apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', event => {
    if (event.key === 'romthai.theme') apply(event.newValue === 'light' || event.newValue === 'dark'
      ? event.newValue : (media.matches ? 'dark' : 'light'));
  });
})();
