const telaPequena = window.matchMedia('(max-width: 900px)');
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('.carrossel-equipe').forEach(function (carrossel) {
  const fila = carrossel.querySelector('.linha-equipe');
  const fotos = Array.from(fila.children);
  const pontos = carrossel.querySelectorAll('.ponto-equipe');
  const anuncio = carrossel.querySelector('.anuncio-equipe');
  let atual = 0;
  let inicio = null;
  let deslocamento = 0;
  let animando = false;
  let temporizador;

  function mostrar(avisar) {
    fotos.forEach(function (foto, indice) {
      const posicao = (indice - atual + fotos.length) % fotos.length;
      foto.style.transform = telaPequena.matches ? 'translateX(' + (-posicao * 5) + 'px) scale(' + (1 - posicao * 0.04) + ')' : '';
      foto.style.zIndex = telaPequena.matches ? fotos.length - posicao : '';
      foto.style.opacity = '';
      foto.tabIndex = telaPequena.matches && posicao !== 0 ? -1 : 0;
      if (telaPequena.matches && posicao !== 0) foto.setAttribute('aria-hidden', 'true');
      else foto.removeAttribute('aria-hidden');
    });
    pontos.forEach(function (ponto, indice) { ponto.setAttribute('aria-current', String(indice === atual)); });
    if (avisar) anuncio.textContent = fotos[atual].querySelector('h3').textContent.trim();
  }
  function passar(direcao) {
    if (!telaPequena.matches || animando) return;
    animando = true;
    fotos[atual].style.transform = 'translateX(' + (-direcao * fila.clientWidth * 0.7) + 'px) rotate(' + (-direcao * 8) + 'deg)';
    fotos[atual].style.opacity = '0';
    temporizador = window.setTimeout(function () {
      atual = (atual + direcao + fotos.length) % fotos.length;
      animando = false;
      mostrar(true);
    }, movimentoReduzido.matches ? 0 : 280);
  }
  carrossel.querySelector('.anterior').addEventListener('click', function () { passar(-1); });
  carrossel.querySelector('.proximo').addEventListener('click', function () { passar(1); });
  pontos.forEach(function (ponto, indice) {
    ponto.addEventListener('click', function () {
      if (animando) return;
      atual = indice;
      mostrar(true);
    });
  });
  fila.addEventListener('keydown', function (evento) {
    if (!telaPequena.matches) return;
    if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
      evento.preventDefault();
      passar(evento.key === 'ArrowRight' ? 1 : -1);
    }
  });
  fila.addEventListener('dragstart', function (evento) { evento.preventDefault(); });
  fila.addEventListener('pointerdown', function (evento) {
    if (!telaPequena.matches || animando || !evento.isPrimary || evento.button !== 0) return;
    inicio = evento.clientX;
    deslocamento = 0;
    fila.setPointerCapture(evento.pointerId);
    fila.classList.add('arrastando');
  });
  fila.addEventListener('pointermove', function (evento) {
    if (inicio === null) return;
    deslocamento = evento.clientX - inicio;
    fotos[atual].style.transform = 'translateX(' + deslocamento + 'px) rotate(' + deslocamento / 30 + 'deg)';
  });
  function terminar(evento) {
    if (inicio === null) return;
    inicio = null;
    fila.classList.remove('arrastando');
    if (fila.hasPointerCapture(evento.pointerId)) fila.releasePointerCapture(evento.pointerId);
    if (evento.type === 'pointerup' && Math.abs(deslocamento) > Math.min(60, fila.clientWidth * 0.2)) passar(deslocamento < 0 ? 1 : -1);
    else mostrar(false);
  }
  fila.addEventListener('pointerup', terminar);
  fila.addEventListener('pointercancel', terminar);
  telaPequena.addEventListener('change', function () {
    clearTimeout(temporizador);
    animando = false;
    inicio = null;
    fila.classList.remove('arrastando');
    mostrar(false);
  });
  mostrar(false);
});
