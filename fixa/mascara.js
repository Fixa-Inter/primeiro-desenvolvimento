// Máscaras de CNPJ e CEP: formata enquanto digita e aceita só os dígitos do campo.
(function () {
  function digitos(s) { return String(s || '').replace(/\D/g, ''); }
  var mascaras = {
    cnpj: {
      tam: 14, maxlength: 18,
      fmt: function (d) {
        var r = d.slice(0, 2);
        if (d.length > 2) r += '.' + d.slice(2, 5);
        if (d.length > 5) r += '.' + d.slice(5, 8);
        if (d.length > 8) r += '/' + d.slice(8, 12);
        if (d.length > 12) r += '-' + d.slice(12, 14);
        return r;
      }
    },
    cep: {
      tam: 8, maxlength: 9,
      fmt: function (d) { return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; }
    }
  };
  function aplicar(campo, m) {
    campo.value = m.fmt(digitos(campo.value).slice(0, m.tam));
  }
  function ligar(id, m) {
    var campo = document.getElementById(id);
    if (!campo) return;
    campo.setAttribute('maxlength', m.maxlength);
    campo.setAttribute('inputmode', 'numeric');
    aplicar(campo, m);
    campo.addEventListener('input', function () { aplicar(campo, m); });
    campo.addEventListener('keydown', function (e) {
      var pos = campo.selectionStart;
      if (e.key !== 'Backspace' || pos === 0 || campo.selectionStart !== campo.selectionEnd) return;
      if (/\d/.test(campo.value.charAt(pos - 1))) return;
      e.preventDefault();
      var pares = digitos(campo.value), antes = digitos(campo.value.slice(0, pos)).length;
      campo.value = m.fmt((pares.slice(0, antes - 1) + pares.slice(antes)).slice(0, m.tam));
      campo.setSelectionRange(campo.value.length, campo.value.length);
    });
  }
  ligar('cnpj', mascaras.cnpj);
  ligar('cep', mascaras.cep);
})();
