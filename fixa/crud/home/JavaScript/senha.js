document.querySelectorAll(".mostrar-senha").forEach(function (botao) {
  const campo = document.getElementById(botao.dataset.campo);
  if (!campo) return;

  botao.addEventListener("click", function () {
    const mostrar = campo.type === "password";
    campo.type = mostrar ? "text" : "password";
    botao.setAttribute("aria-pressed", String(mostrar));
    botao.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
    botao.title = mostrar ? "Ocultar senha" : "Mostrar senha";
  });
});
