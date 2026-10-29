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

const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");

if (senha && confirmarSenha) {
  function conferirSenhas() {
    confirmarSenha.setCustomValidity(
      senha.value === confirmarSenha.value ? "" : "As senhas precisam ser iguais.",
    );
  }

  senha.addEventListener("input", conferirSenhas);
  confirmarSenha.addEventListener("input", conferirSenhas);
}
