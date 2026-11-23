// CAOS BR: comportamento do portal (barra do topo, login e proteção das imagens).
(() => {
  // Barra do topo fica sólida depois que a página desce um pouco.
  const bar = document.querySelector('.topbar');
  const onScroll = () => bar.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Título grande: ajusta o tamanho para a palavra ocupar a largura disponível,
  // com a fonte que estiver carregada (estêncil ou a reserva do sistema).
  const title = document.querySelector('.title');
  const fitTitle = () => {
    const room = title.parentElement.clientWidth;
    const max = Math.min(window.innerWidth * 0.3, 320);
    title.style.fontSize = '100px';
    const natural = title.scrollWidth;
    const size = Math.min(max, (100 * room) / natural * 0.94);
    title.style.fontSize = `${Math.max(48, size)}px`;
  };
  fitTitle();
  window.addEventListener('resize', fitTitle);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitle);

  // Janela de login (por enquanto só visual: os campos estão desativados).
  const dialog = document.getElementById('login');
  document.querySelectorAll('[data-open-login]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });
  // Clique fora da janela (no fundo escuro) fecha.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  // Imagens dos jogos: sem menu de "salvar imagem", sem arrastar e sem copiar.
  // Isto dificulta o uso casual, mas não impede captura de tela.
  document.querySelectorAll('.art').forEach((el) => {
    ['contextmenu', 'dragstart', 'copy', 'cut'].forEach((type) => {
      el.addEventListener(type, (e) => e.preventDefault());
    });
  });
})();
