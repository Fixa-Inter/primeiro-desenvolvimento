const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");

if (confirmarSenha) {
  function conferirSenhas() {
    if (senha.value !== confirmarSenha.value) {
      confirmarSenha.setCustomValidity("As senhas precisam ser iguais.");
    } else {
      confirmarSenha.setCustomValidity("");
    }
  }

  senha.addEventListener("input", conferirSenhas);
  confirmarSenha.addEventListener("input", conferirSenhas);
}

document.querySelectorAll(".mostrar-senha").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const campo = document.getElementById(botao.dataset.campo);
    const mostrar = campo.type === "password";
    campo.type = mostrar ? "text" : "password";
    botao.textContent = mostrar ? "Ocultar" : "Mostrar";
    botao.setAttribute("aria-pressed", mostrar);
  });
});

document.querySelectorAll("form").forEach(function (formulario) {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    window.location.href = formulario.action;
  });
});
