// Avança para o próximo dígito ao digitar, volta ao apagar e distribui o código colado.
document.querySelectorAll('.codigo-inputs input').forEach(function (campo, i, lista) {
  campo.addEventListener('input', function () {
    if (campo.value && lista[i + 1]) lista[i + 1].focus();
  });
  campo.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' && !campo.value && lista[i - 1]) lista[i - 1].focus();
  });
  campo.addEventListener('paste', function (e) {
    var digitos = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
    if (!digitos) return;
    e.preventDefault();
    var fim = Math.min(i + digitos.length, lista.length);
    for (var k = i; k < fim; k++) lista[k].value = digitos.charAt(k - i);
    lista[Math.min(fim, lista.length - 1)].focus();
  });
});
