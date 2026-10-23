(async () => {
  const configuracoes = window.FIXA_ENTIDADES;
  const entidade = document.body.dataset.entidade;
  const configuracao = configuracoes[entidade];
  const repositorio = window.FixaDados;
  const paginaFormulario = Boolean(document.body.dataset.operacao);
  const paginasEdicao = {
    instituicoes: "editar-instituicao.html",
    usuarios: "editar-usuario.html",
    enderecos: "editar-endereco.html",
    "super-administradores": "editar-super-admin.html",
    planos: "editar-plano.html",
    contratos: "editar-contrato.html",
    pagamentos: "editar-pagamento.html",
    "fotos-usuario": "editar-foto-usuario.html",
  };
  const seletor = (valor) => document.querySelector(valor);
  const linhaTemporaria = seletor('#registros tr[data-temporario="true"]')?.cloneNode(true);
  const normalizar = (valor) =>
    String(valor ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const comparador = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });
  const operadoresFiltro = {
    IGUAL: "=",
    CONTEM: "Contém",
    MAIOR_QUE: ">",
    MAIOR_OU_IGUAL: ">=",
    MENOR_QUE: "<",
    MENOR_OU_IGUAL: "<=",
  };
  const destinosVinculos = {
    fk_instituicao_id: "instituicoes",
    fk_endereco_id: "enderecos",
    fk_plano_id: "planos",
    fk_contrato_id: "contratos",
    fk_usuario_id: "usuarios",
  };
  let banco = {};
  let ordem = { campo: "id", direcao: 1 };
  let filtros = [];
  let ocupado = false;

  const menu = seletor(".menu-lateral");
  const controleMenu = seletor("#controle-menu");
  controleMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    controleMenu.setAttribute("aria-expanded", String(aberto));
    controleMenu.setAttribute(
      "aria-label",
      aberto ? "Recolher menu lateral" : "Expandir menu lateral",
    );
  });
  menu.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      menu.classList.remove("aberto");
      controleMenu.setAttribute("aria-expanded", "false");
      controleMenu.focus();
    }
  });

  function mensagem(texto, erro = false) {
    const caixa = seletor("#mensagem");
    caixa.textContent = texto;
    caixa.classList.toggle("erro", erro);
  }

  function erroDialog(dialogo, texto) {
    let caixa = dialogo.querySelector(".mensagem-modal");
    if (!caixa) {
      caixa = document.createElement("p");
      caixa.className = "mensagem-modal";
      caixa.setAttribute("role", "alert");
      dialogo.querySelector(".titulo-cartao").after(caixa);
    }
    caixa.textContent = texto;
  }

  async function carregar() {
    banco = await repositorio.listarTodos();
    if (configuracao && !paginaFormulario) {
      atualizarValorFiltro();
      renderizar();
    }
    document.querySelectorAll("[data-total]").forEach((total) => {
      total.textContent = banco[total.dataset.total].length;
    });
  }

  function encontrar(tipo, id) {
    return (banco[tipo] || []).find((registro) => String(registro.id) === String(id));
  }

  function enderecoTexto(endereco) {
    if (!endereco) return "";
    if (endereco.nome) return endereco.nome;
    return (
      [endereco.rua, endereco.numero].filter(Boolean).join(", ") +
      (endereco.cidade ? " — " + endereco.cidade : "") +
      (endereco.estado ? "/" + endereco.estado : "")
    );
  }

  function valor(registro, campo) {
    const usuario =
      entidade === "fotos-usuario" ? encontrar("usuarios", registro.fk_usuario_id) : registro;
    const contrato =
      entidade === "pagamentos" ? encontrar("contratos", registro.fk_contrato_id) : registro;
    const idEndereco =
      entidade === "usuarios"
        ? registro.fk_endereco_id
        : entidade === "fotos-usuario"
          ? usuario?.fk_endereco_id
          : contrato?.fk_endereco_id;
    const endereco = entidade === "enderecos" ? registro : encontrar("enderecos", idEndereco);
    if (["usuario", "usuario_nome"].includes(campo)) return usuario?.nome || "";
    if (campo === "email_usuario") return usuario?.email || "";
    if (campo === "contrato")
      return contrato
        ? "Contrato #" +
            contrato.id +
            (encontrar("planos", contrato.fk_plano_id)?.nome
              ? " — " + encontrar("planos", contrato.fk_plano_id).nome
              : "")
        : "";
    if (campo === "plano") return encontrar("planos", contrato?.fk_plano_id)?.nome || "";
    if (campo === "endereco") return enderecoTexto(endereco);
    if (campo === "instituicao")
      return encontrar("instituicoes", endereco?.fk_instituicao_id)?.nome || "";
    if (campo === "estado" && entidade !== "enderecos") return endereco?.estado || "";
    if (["status_contrato", "data_vencimento"].includes(campo) && entidade === "pagamentos")
      return contrato?.[campo] ?? "";
    if (campo === "em_dia") {
      if (!contrato?.data_vencimento || !registro.data_pagamento || !registro.foi_realizado)
        return null;
      return registro.data_pagamento.slice(0, 10) <= contrato.data_vencimento;
    }
    return registro[campo] ?? "";
  }

  function campoDefinicao(campo) {
    return (
      configuracao.campos.find((item) => item.nome === campo) ||
      configuracoes.contratos.campos.find((item) => item.nome === campo)
    );
  }

  function dataFormatada(texto) {
    const partes = String(texto).replace(" ", "T").split("T");
    const data = partes[0].split("-");
    if (data.length !== 3) return texto;
    return data.reverse().join("/") + (partes[1] ? " " + partes[1].slice(0, 5) : "");
  }

  function formatar(registro, campo) {
    const conteudo = valor(registro, campo);
    if (conteudo === "" || conteudo == null) return "—";
    if (campo === "id") return "#" + conteudo;
    if (destinosVinculos[campo]) {
      const relacionado = encontrar(destinosVinculos[campo], conteudo);
      if (!relacionado) return "Vínculo #" + conteudo + " não encontrado";
      const nome =
        destinosVinculos[campo] === "enderecos"
          ? enderecoTexto(relacionado)
          : destinosVinculos[campo] === "contratos"
            ? "Contrato"
            : relacionado.nome;
      return (nome || "Registro") + " (#" + relacionado.id + ")";
    }
    if (typeof conteudo === "boolean") return conteudo ? "Sim" : "Não";
    if (campo.startsWith("data_")) return dataFormatada(conteudo);
    if (["valor", "valor_mensal"].includes(campo))
      return Number(conteudo).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const definicao = campoDefinicao(campo);
    return definicao?.opcoes?.[conteudo] || String(conteudo);
  }

  function comparar(a, b, campo) {
    if (a === "" || a == null) return b === "" || b == null ? 0 : 1;
    if (b === "" || b == null) return -1;
    if (campo === "id" || filtroNumerico(campo)) return Number(a) - Number(b);
    if (typeof a === "boolean") return Number(a) - Number(b);
    if (campo.startsWith("data_"))
      return String(dataComparavel(a) || a).localeCompare(String(dataComparavel(b) || b));
    const opcoes = campoDefinicao(campo)?.opcoes;
    return comparador.compare(opcoes?.[a] || String(a), opcoes?.[b] || String(b));
  }

  function definicaoFiltro(nome) {
    if (nome === "id") return { nome, rotulo: "ID", tipo: "number" };
    if (nome === "data_criacao") return { nome, rotulo: "Data de criação", tipo: "datetime-local" };
    return configuracao.campos.find((campo) => campo.nome === nome);
  }

  function filtroNumerico(nome) {
    const campo = campoDefinicao(nome);
    return (
      campo?.tipo === "number" ||
      !!destinosVinculos[nome] ||
      (!!campo?.opcoes && Object.keys(campo.opcoes).every((valor) => /^\d+$/.test(valor)))
    );
  }

  function atualizarValorFiltro(limpar = false) {
    const nome = seletor("#campo-filtro").value;
    const campo = definicaoFiltro(nome);
    const anterior = seletor("#valor-filtro");
    const destino = destinosVinculos[nome];
    const selecionavel =
      seletor("#operador-filtro").value !== "CONTEM" &&
      (campo.tipo === "checkbox" || campo.opcoes || destino);
    const controle = document.createElement(selecionavel ? "select" : "input");
    controle.id = "valor-filtro";
    controle.name = "valor";
    controle.required = true;
    if (selecionavel) {
      controle.add(new Option("Selecione", ""));
      if (campo.tipo === "checkbox") {
        controle.add(new Option("Sim", "true"));
        controle.add(new Option("Não", "false"));
      } else if (destino) {
        for (const registro of banco[destino] || []) {
          const nomeRegistro = destino === "enderecos" ? enderecoTexto(registro) : registro.nome;
          controle.add(
            new Option((nomeRegistro || "Registro") + " (#" + registro.id + ")", registro.id),
          );
        }
      } else {
        for (const [valor, rotulo] of Object.entries(campo.opcoes))
          controle.add(new Option(rotulo, valor));
      }
    } else {
      controle.type = ["number", "date", "datetime-local"].includes(campo.tipo)
        ? campo.tipo
        : "text";
      controle.placeholder = "Valor";
      controle.autocomplete = "off";
      if (["number", "datetime-local"].includes(controle.type)) controle.step = "any";
      if (nome === "id" || nome === "duracao_meses") controle.step = "1";
    }
    if (!limpar) controle.value = anterior.value;
    anterior.replaceWith(controle);
  }

  function atualizarOperadoresFiltro() {
    const campo = seletor("#campo-filtro").value;
    const select = seletor("#operador-filtro");
    select.replaceChildren();
    for (const operador of configuracao.filtros[campo])
      select.add(new Option(operadoresFiltro[operador], operador));
    atualizarValorFiltro(true);
  }

  function normalizarContem(texto) {
    const valor = String(texto).toLocaleLowerCase("pt-BR");
    return configuracao.ignorarAcentosEspacos ? normalizar(valor).replace(/ /g, "") : valor;
  }

  function contem(texto, criterio) {
    const escapar = (caractere) => caractere.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const caracteres = Array.from(normalizarContem(criterio));
    let expressao = "";
    for (let indice = 0; indice < caracteres.length; indice++) {
      const caractere = caracteres[indice];
      if (caractere === "\\" && indice + 1 < caracteres.length)
        expressao += escapar(caracteres[++indice]);
      else if (caractere === "%") expressao += ".*";
      else if (caractere === "_") expressao += ".";
      else expressao += escapar(caractere);
    }
    return new RegExp(expressao, "su").test(normalizarContem(texto));
  }

  function dataComparavel(valor) {
    const texto = String(valor).replace(" ", "T");
    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return texto;
    const partes = texto.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::(\d{2}))?(?:\.(\d{1,6}))?$/);
    return partes
      ? partes[1] + ":" + (partes[2] || "00") + "." + (partes[3] || "").padEnd(6, "0")
      : null;
  }

  function passaFiltro(registro, filtro) {
    if (!configuracao.filtros[filtro.campo]?.includes(filtro.operador)) return false;
    let bruto = registro[filtro.campo];
    let criterio = filtro.valor;
    if (bruto == null || bruto === "") return false;
    if (filtro.operador === "CONTEM") return contem(bruto, criterio);
    const campo = definicaoFiltro(filtro.campo);
    if (campo.tipo === "checkbox") return bruto === (criterio === "true");
    if (filtro.campo === "id" || filtroNumerico(filtro.campo)) {
      bruto = Number(bruto);
      criterio = Number(criterio);
      if (!Number.isFinite(bruto) || !Number.isFinite(criterio)) return false;
    } else if (["date", "datetime-local"].includes(campo.tipo)) {
      bruto = dataComparavel(bruto);
      criterio = dataComparavel(criterio);
      if (bruto == null || criterio == null) return false;
    } else {
      bruto = String(bruto);
    }
    switch (filtro.operador) {
      case "IGUAL":
        return bruto === criterio;
      case "MAIOR_QUE":
        return bruto > criterio;
      case "MAIOR_OU_IGUAL":
        return bruto >= criterio;
      case "MENOR_QUE":
        return bruto < criterio;
      case "MENOR_OU_IGUAL":
        return bruto <= criterio;
      default:
        return false;
    }
  }

  function icone(tipo) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "icone");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      tipo === "editar"
        ? "M16 3l5 5L8 21H3v-5L16 3Z M14 5l5 5"
        : "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7",
    );
    svg.append(path);
    return svg;
  }

  function botaoAcao(texto, acao, id) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.acao = acao;
    botao.dataset.id = id;
    botao.className = acao;
    botao.setAttribute("aria-label", texto + " registro #" + id);
    botao.append(icone(acao), document.createTextNode(texto));
    return botao;
  }

  function renderizar() {
    const pesquisa = normalizar(seletor("#pesquisa").value.trim());
    const lista = banco[entidade].filter((registro) => {
      const camposBusca = [
        ...configuracao.colunas.map((campo) => campo.nome),
        ...configuracao.campos
          .filter((campo) => campo.tipo !== "password")
          .map((campo) => campo.nome),
      ];
      const conteudo = camposBusca.map((campo) => formatar(registro, campo)).join(" ");
      return (
        normalizar(conteudo).includes(pesquisa) &&
        filtros.every((filtro) => passaFiltro(registro, filtro))
      );
    });
    const campoOrdenacao = configuracao.camposOrdenaveis[ordem?.campo] || "id";
    const direcao = configuracao.camposOrdenaveis[ordem?.campo] && ordem.direcao === -1 ? -1 : 1;
    lista.sort(
      (a, b) =>
        direcao * comparar(a[campoOrdenacao], b[campoOrdenacao], campoOrdenacao) ||
        Number(a.id) - Number(b.id),
    );
    const corpo = seletor("#registros");
    corpo.replaceChildren();
    if (
      !banco[entidade].length &&
      linhaTemporaria &&
      !filtros.length &&
      normalizar(linhaTemporaria.textContent).includes(pesquisa)
    ) {
      corpo.append(linhaTemporaria.cloneNode(true));
      seletor("#contagem").textContent = "1 registro";
      seletor("#rodape-tabela").textContent = "1 de 1 registros";
      return;
    }
    for (const registro of lista) {
      const linha = document.createElement("tr");
      for (const coluna of configuracao.colunas) {
        const celula = document.createElement("td");
        if (coluna.relacionada) celula.className = "coluna-relacionada";
        const conteudo = valor(registro, coluna.nome);
        const texto = formatar(registro, coluna.nome);
        if (coluna.nome === "id") {
          const consulta = document.createElement("button");
          consulta.type = "button";
          consulta.className = "consultar";
          consulta.dataset.acao = "consultar";
          consulta.dataset.id = registro.id;
          consulta.textContent = texto;
          consulta.setAttribute("aria-label", "Consultar registro " + texto);
          celula.append(consulta);
        } else if (typeof conteudo === "boolean" || coluna.nome === "status_contrato") {
          const etiqueta = document.createElement("span");
          etiqueta.className =
            "etiqueta" +
            (conteudo === true || (coluna.nome === "status_contrato" && String(conteudo) === "1")
              ? " etiqueta-verde"
              : String(conteudo) === "3"
                ? " etiqueta-vermelha"
                : "");
          etiqueta.textContent = texto;
          celula.append(etiqueta);
        } else celula.textContent = texto;
        linha.append(celula);
      }
      const acoes = document.createElement("td");
      acoes.className = "coluna-acoes";
      const grupo = document.createElement("div");
      grupo.className = "acoes-linha";
      grupo.append(
        botaoAcao("Editar", "editar", registro.id),
        botaoAcao("Excluir", "excluir", registro.id),
      );
      acoes.append(grupo);
      linha.append(acoes);
      corpo.append(linha);
    }
    if (!lista.length) {
      const linha = corpo.insertRow();
      const celula = linha.insertCell();
      celula.colSpan = configuracao.colunas.length + 1;
      celula.className = "vazio";
      celula.textContent = banco[entidade].length
        ? "Nenhum resultado para esta pesquisa ou filtro."
        : "Nenhum registro cadastrado. Clique em + Novo para começar.";
    }
    seletor("#contagem").textContent =
      lista.length + (lista.length === 1 ? " registro" : " registros");
    seletor("#rodape-tabela").textContent = lista.length
      ? "↓ Role a tabela para ver todos os campos · " +
        lista.length +
        " de " +
        banco[entidade].length +
        " registros"
      : "Nenhum registro para exibir";
    seletor("#desfazer").disabled = !repositorio.podeDesfazer(entidade);
    seletor("#desfazer").title = "Desfazer a última alteração desta tela";
    document.querySelectorAll("[data-ordenar]").forEach((botao) => {
      const ativo = botao.dataset.ordenar === ordem?.campo;
      botao
        .closest("th")
        .setAttribute(
          "aria-sort",
          ativo ? (ordem.direcao === 1 ? "ascending" : "descending") : "none",
        );
      botao.title = !ativo
        ? "Ordenar em ordem crescente"
        : ordem.direcao === 1
          ? "Ordenar em ordem decrescente"
          : "Voltar à ordem padrão por ID";
    });
  }

  function preencherVinculos(formulario) {
    for (const [campo, destino] of Object.entries(destinosVinculos)) {
      const select = formulario.elements.namedItem(campo);
      if (!select) continue;
      select.replaceChildren(new Option("Sem vínculo", ""));
      for (const registro of banco[destino]) {
        const texto =
          destino === "enderecos"
            ? enderecoTexto(registro)
            : destino === "contratos"
              ? "Contrato #" + registro.id
              : registro.nome;
        select.add(new Option((texto || "Registro") + " (#" + registro.id + ")", registro.id));
      }
    }
  }

  function abrir(acao, id) {
    mensagem("");
    const registro = id ? encontrar(entidade, id) : null;
    if (acao !== "novo" && !registro) {
      mensagem(
        "Registro não encontrado. Selecione um registro da lista ou cadastre um novo.",
        true,
      );
      return;
    }
    document.querySelectorAll(".mensagem-modal").forEach((caixa) => caixa.remove());
    if (["novo", "editar"].includes(acao)) {
      const formulario = seletor("#registro-form");
      formulario.reset();
      preencherVinculos(formulario);
      formulario.elements.namedItem("operacao").value = acao;
      formulario.elements.namedItem("id").value = registro?.id || "";
      if (!paginaFormulario) {
        seletor("#titulo-formulario").textContent =
          acao === "novo" ? "Cadastrar registro" : "Editar registro #" + registro.id;
      }
      for (const campo of configuracao.campos) {
        const controle = formulario.elements.namedItem(campo.nome);
        controle.setCustomValidity("");
        if (campo.tipo === "password") {
          controle.value = "";
          controle.required =
            acao === "novo" &&
            ["instituicoes", "usuarios", "super-administradores"].includes(entidade);
          formulario.querySelector('label[for="' + controle.id + '"]').textContent =
            "Senha" + (controle.required ? " *" : "");
          controle.placeholder =
            acao === "editar" ? "Deixe em branco para manter a senha" : "Digite uma senha segura";
        } else if (
          !registro &&
          ["data_cadastro", "data_inicio", "data_pagamento", "data_registro"].includes(campo.nome)
        ) {
          const agora = new Date();
          const horarioLocal = new Date(
            agora.getTime() - agora.getTimezoneOffset() * 60000,
          ).toISOString();
          controle.value =
            campo.tipo === "date" ? horarioLocal.slice(0, 10) : horarioLocal.slice(0, 16);
        } else if (registro) {
          if (campo.tipo === "checkbox") controle.checked = registro[campo.nome] === true;
          else controle.value = registro[campo.nome] ?? "";
        }
      }
      if (!paginaFormulario) seletor("#registro-dialog").showModal();
    } else if (acao === "excluir") {
      seletor("#excluir-form").elements.namedItem("id").value = registro.id;
      seletor("#confirmacao-texto").textContent =
        "Deseja excluir o registro #" +
        registro.id +
        (registro.nome ? " — " + registro.nome : "") +
        "?";
      seletor("#excluir-dialog").showModal();
    } else if (acao === "consultar") {
      const dl = seletor("#dados-consulta");
      dl.replaceChildren();
      const campos = [...configuracao.colunas];
      for (const campo of configuracao.campos) {
        if (campo.tipo !== "password" && !campos.some((coluna) => coluna.nome === campo.nome))
          campos.push({ nome: campo.nome, rotulo: campo.rotulo });
      }
      for (const campo of campos) {
        const item = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = campo.rotulo;
        dd.textContent = formatar(registro, campo.nome);
        item.append(dt, dd);
        dl.append(item);
      }
      seletor("#consulta-dialog").showModal();
    }
  }

  async function executar(formulario, tarefa, sucesso) {
    if (ocupado) return;
    ocupado = true;
    const dialogo = formulario.closest("dialog");
    const botao = formulario.querySelector('[type="submit"]');
    botao.disabled = true;
    try {
      await tarefa();
      if (paginaFormulario) {
        window.location.href = formulario.getAttribute("action");
        return;
      }
      dialogo.close();
      await carregar();
      mensagem(sucesso);
    } catch (erro) {
      if (dialogo?.open) erroDialog(dialogo, erro.message);
      else mensagem(erro.message, true);
    } finally {
      ocupado = false;
      botao.disabled = false;
    }
  }

  try {
    await carregar();
  } catch (erro) {
    mensagem(erro.message, true);
    if (configuracao && !paginaFormulario) {
      seletor("#registros td").textContent =
        "Não foi possível carregar os dados. Recarregue a página para tentar novamente.";
      seletor("#novo").removeAttribute("href");
    }
    if (paginaFormulario) {
      seletor("#registro-form").querySelector('[type="submit"]').disabled = true;
    }
    return;
  }
  if (!configuracao) return;

  if (paginaFormulario) {
    const acao = document.body.dataset.operacao;
    const id = new URLSearchParams(window.location.search).get("id");
    if (acao === "editar" && (!id || !encontrar(entidade, id))) {
      mensagem("Registro não encontrado. Volte à lista e escolha um registro para editar.", true);
      seletor("#registro-form").querySelector('[type="submit"]').disabled = true;
      return;
    }
    abrir(acao, id);
    seletor("#registro-form").addEventListener("submit", (evento) => {
      evento.preventDefault();
      const formulario = evento.currentTarget;
      const dados = Object.fromEntries(new FormData(formulario));
      formulario
        .querySelectorAll('[type="checkbox"]')
        .forEach((controle) => (dados[controle.name] = String(controle.checked)));
      executar(formulario, () => repositorio.salvar(entidade, dados), "Registro salvo com sucesso.");
    });
    return;
  }

  atualizarOperadoresFiltro();
  seletor("#campo-filtro").addEventListener("change", atualizarOperadoresFiltro);
  seletor("#operador-filtro").addEventListener("change", () => atualizarValorFiltro());
  seletor("#pesquisa").addEventListener("input", renderizar);
  document.querySelectorAll("[data-ordenar]").forEach((botao) =>
    botao.addEventListener("click", () => {
      const campo = botao.dataset.ordenar;
      if (!Object.hasOwn(configuracao.camposOrdenaveis, campo)) return;
      if (!ordem || ordem.campo !== campo) {
        ordem = { campo, direcao: 1 };
      } else if (ordem.direcao === 1) {
        ordem = { campo, direcao: -1 };
      } else {
        ordem = null;
      }
      renderizar();
    }),
  );
  seletor("#registros").addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-acao]");
    if (botao?.dataset.acao === "editar") {
      window.location.href =
        paginasEdicao[entidade] + "?id=" + encodeURIComponent(botao.dataset.id);
      return;
    }
    if (botao) abrir(botao.dataset.acao, botao.dataset.id);
  });
  document.querySelectorAll("[data-fechar]").forEach((botao) =>
    botao.addEventListener("click", () => {
      if (ocupado) return;
      botao.closest("dialog").close();
    }),
  );
  document.querySelectorAll("dialog").forEach((dialogo) =>
    dialogo.addEventListener("cancel", (evento) => {
      if (ocupado) evento.preventDefault();
    }),
  );
  seletor("#registro-form").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const dados = Object.fromEntries(new FormData(formulario));
    formulario
      .querySelectorAll('[type="checkbox"]')
      .forEach((controle) => (dados[controle.name] = String(controle.checked)));
    executar(formulario, () => repositorio.salvar(entidade, dados), "Registro salvo com sucesso.");
  });
  seletor("#excluir-form").addEventListener("submit", (evento) => {
    evento.preventDefault();
    executar(
      evento.currentTarget,
      () => repositorio.excluir(entidade, evento.currentTarget.elements.namedItem("id").value),
      "Registro excluído.",
    );
  });
  seletor("#desfazer").addEventListener("click", async () => {
    try {
      await repositorio.desfazer(entidade);
      await carregar();
      mensagem("Última alteração desfeita.");
    } catch (erro) {
      mensagem(erro.message, true);
    }
  });
  seletor("#filtro-form").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const filtro = {
      campo: seletor("#campo-filtro").value,
      operador: seletor("#operador-filtro").value,
      valor: seletor("#valor-filtro").value,
    };
    if (!configuracao.filtros[filtro.campo]?.includes(filtro.operador)) {
      mensagem("Selecione um campo e um operador válidos.", true);
      return;
    }
    if (!evento.currentTarget.reportValidity() || !filtro.valor) return;
    mensagem("");
    const controle = seletor("#valor-filtro");
    filtro.rotuloValor =
      controle.tagName === "SELECT"
        ? controle.selectedOptions[0].textContent
        : filtro.campo.startsWith("data_")
          ? filtro.valor.replace(/^(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1").replace("T", " ")
          : filtro.valor;
    filtros.push(filtro);
    seletor("#valor-filtro").value = "";
    mostrarFiltros();
    renderizar();
  });
  function mostrarFiltros() {
    const caixa = seletor("#filtros-ativos");
    caixa.replaceChildren();
    filtros.forEach((filtro, indice) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "filtro-chip";
      const rotulo = definicaoFiltro(filtro.campo).rotulo;
      const operador = operadoresFiltro[filtro.operador];
      botao.textContent = rotulo + " " + operador + " " + filtro.rotuloValor + " ×";
      botao.setAttribute("aria-label", "Remover filtro " + botao.textContent);
      botao.addEventListener("click", () => {
        filtros.splice(indice, 1);
        mostrarFiltros();
        renderizar();
      });
      caixa.append(botao);
    });
  }
  window.addEventListener("storage", async (evento) => {
    if (evento.key === "fixa.crud.v1") {
      try {
        await carregar();
        mensagem("A lista foi atualizada por outra aba.");
      } catch (erro) {
        mensagem(erro.message, true);
      }
    }
  });
})();
