(() => {
  const menu = document.querySelector(".menu-lateral");
  const controleMenu = document.getElementById("controle-menu");

  if (menu && controleMenu) {
    function fecharMenu() {
      menu.classList.remove("aberto");
      controleMenu.setAttribute("aria-expanded", "false");
      controleMenu.setAttribute("aria-label", "Expandir menu lateral");
      controleMenu.focus();
    }

    controleMenu.addEventListener("click", function () {
      const aberto = menu.classList.toggle("aberto");
      controleMenu.setAttribute("aria-expanded", String(aberto));
      controleMenu.setAttribute("aria-label", aberto ? "Recolher menu lateral" : "Expandir menu lateral");
    });

    menu.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") fecharMenu();
    });
  }

  const corpo = document.getElementById("registros");
  if (!corpo) return;

  const tabela = corpo.closest("table");
  const cabecalhos = Array.from(tabela.querySelectorAll("thead th"));
  const linhas = Array.from(corpo.rows).filter(function (linha) {
    return linha.cells.length === cabecalhos.length;
  });
  const pesquisa = document.getElementById("pesquisa");
  const linhaVazia = document.createElement("tr");
  const avisoVazio = linhaVazia.insertCell();
  avisoVazio.colSpan = cabecalhos.length;
  avisoVazio.className = "vazio";
  avisoVazio.textContent = "Nenhum registro encontrado.";
  const comparador = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });
  let ordem = { campo: "id", direcao: 1 };

  function normalizar(texto) {
    return String(texto ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/\s+/g, " ").trim();
  }

  function aplicarPesquisa() {
    const termo = normalizar(pesquisa.value);
    let visiveis = 0;
    linhas.forEach(function (linha) {
      const encontrado = normalizar(linha.textContent).includes(termo);
      linha.hidden = !encontrado;
      if (encontrado) visiveis++;
    });
    if (visiveis === 0) corpo.append(linhaVazia);
    else linhaVazia.remove();
    document.getElementById("contagem").textContent = visiveis + (visiveis === 1 ? " registro" : " registros");
    document.getElementById("rodape-tabela").textContent = visiveis + " de " + linhas.length + " registros";
  }

  function valorCelula(linha, indice) {
    const celula = linha.cells[indice];
    const campo = cabecalhos[indice].dataset.campo;
    const texto = (celula.dataset.valor ?? celula.textContent).trim();
    const data = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})(.*)$/);
    if (data && campo.startsWith("data_")) return data[3] + "-" + data[2] + "-" + data[1] + data[4];
    if (campo.startsWith("data_")) return texto.replace("T", " ");
    if (["id", "valor", "valor_mensal", "duracao_meses"].includes(campo)) {
      let numero = texto.replace(/[^0-9,.-]/g, "");
      if (numero.includes(",")) numero = numero.replace(/\./g, "").replace(",", ".");
      if (numero && Number.isFinite(Number(numero))) return Number(numero);
    }
    return normalizar(texto);
  }

  function ordenarLinhas() {
    const campo = ordem ? ordem.campo : "id";
    const direcao = ordem ? ordem.direcao : 1;
    const indice = cabecalhos.findIndex(function (cabecalho) { return cabecalho.dataset.campo === campo; });
    if (indice < 0) return;
    linhas.sort(function (a, b) {
      const valorA = valorCelula(a, indice);
      const valorB = valorCelula(b, indice);
      const resultado = typeof valorA === "number" && typeof valorB === "number"
        ? valorA - valorB : comparador.compare(String(valorA), String(valorB));
      return direcao * resultado;
    });
    linhas.forEach(function (linha) { corpo.append(linha); });
    tabela.querySelectorAll("[data-ordenar]").forEach(function (botao) {
      const ativo = ordem && botao.dataset.ordenar === ordem.campo;
      botao.closest("th").setAttribute("aria-sort", ativo ? (ordem.direcao === 1 ? "ascending" : "descending") : "none");
    });
  }

  tabela.querySelectorAll("[data-ordenar]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      const campo = botao.dataset.ordenar;
      if (!ordem || ordem.campo !== campo) ordem = { campo, direcao: 1 };
      else if (ordem.direcao === 1) ordem.direcao = -1;
      else ordem = null;
      ordenarLinhas();
    });
  });
  ordenarLinhas();

  pesquisa.addEventListener("input", aplicarPesquisa);

  aplicarPesquisa();

  corpo.addEventListener("click", function (evento) {
    const botao = evento.target.closest("[data-acao]");
    if (!botao || botao.disabled) return;
    if (botao.dataset.acao === "consultar") {
      const dados = document.getElementById("dados-consulta");
      dados.replaceChildren();
      const linha = botao.closest("tr");
      cabecalhos.forEach(function (cabecalho, indice) {
        if (!cabecalho.dataset.campo) return;
        const item = document.createElement("div");
        const rotulo = document.createElement("dt");
        const valor = document.createElement("dd");
        rotulo.textContent = cabecalho.textContent.trim();
        valor.textContent = linha.cells[indice].textContent.trim();
        item.append(rotulo, valor);
        dados.append(item);
      });
      document.getElementById("consulta-dialog").showModal();
    }
  });

  document.querySelectorAll("[data-fechar]").forEach(function (botao) {
    botao.addEventListener("click", function () { botao.closest("dialog").close(); });
  });
})();
