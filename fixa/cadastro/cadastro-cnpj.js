const cnpjInformado = new URLSearchParams(window.location.search).get('cnpj');
if (cnpjInformado !== null) {
  document.getElementById('cnpj').value = cnpjInformado;
}
