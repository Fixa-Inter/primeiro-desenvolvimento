document.querySelectorAll('[data-carrossel]').forEach(function (lista) {
  const controles = lista.nextElementSibling;
  const pontos = controles.querySelectorAll('[data-indice]');
  function largura() { return lista.children[0].getBoundingClientRect().width + 16; }
  function ir(indice) {
    lista.scrollTo({left: indice * largura(), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  controles.querySelector('.anterior').addEventListener('click', function () { ir(Math.max(0, Math.round(lista.scrollLeft / largura()) - 1)); });
  controles.querySelector('.proximo').addEventListener('click', function () { ir(Math.min(lista.children.length - 1, Math.round(lista.scrollLeft / largura()) + 1)); });
  pontos.forEach(function (ponto, indice) { ponto.addEventListener('click', function () { ir(indice); }); });
  function atualizar() {
    const atual = Math.round(lista.scrollLeft / largura());
    pontos.forEach(function (ponto, indice) { ponto.setAttribute('aria-current', String(atual === indice)); });
  }
  lista.addEventListener('scroll', atualizar, {passive:true});
  atualizar();
});
