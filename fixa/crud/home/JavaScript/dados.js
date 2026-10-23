window.FixaDados = (() => {
  const chave = "fixa.crud.v1";
  const chaveHistorico = "fixa.crud.desfazer.v1";
  const entidades = Object.keys(window.FIXA_ENTIDADES);
  const servidor = window.FIXA_CONFIG.modo === "servidor";
  const copiar = (valor) => JSON.parse(JSON.stringify(valor));

  function bancoVazio() {
    return {
      versao: 1,
      revisao: "inicial",
      registros: Object.fromEntries(entidades.map((entidade) => [entidade, []])),
      sequencias: Object.fromEntries(entidades.map((entidade) => [entidade, 0])),
    };
  }

  function ler() {
    try {
      const texto = localStorage.getItem(chave);
      if (!texto) return bancoVazio();
      const banco = JSON.parse(texto);
      if (
        banco.versao !== 1 ||
        !banco.sequencias ||
        !banco.registros ||
        entidades.some((entidade) => !Array.isArray(banco.registros[entidade]))
      ) {
        throw new Error();
      }
      return banco;
    } catch {
      throw new Error(
        "Não foi possível ler os dados locais. Verifique se o armazenamento do navegador está disponível.",
      );
    }
  }

  function gravar(banco, antes, entidade) {
    banco.revisao = Date.now() + "-" + Math.random();
    try {
      localStorage.setItem(chave, JSON.stringify(banco));
    } catch {
      throw new Error(
        "Não foi possível salvar. O armazenamento pode estar cheio ou bloqueado; nenhum registro foi alterado.",
      );
    }
    try {
      sessionStorage.setItem(
        chaveHistorico,
        JSON.stringify({ antes, entidade, revisao: banco.revisao }),
      );
    } catch {
      sessionStorage.removeItem(chaveHistorico);
    }
  }

  async function requisitar(entidade, parametros, metodo = "GET") {
    const base = new URL(window.FIXA_CONFIG.baseUrl, location.href);
    const url = new URL(entidade, base);
    const opcoes = {
      method: metodo,
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    };
    if (metodo === "GET") url.search = new URLSearchParams(parametros).toString();
    else {
      opcoes.body = new URLSearchParams(parametros);
      if (window.FIXA_CONFIG.csrfToken)
        opcoes.headers["X-CSRF-Token"] = window.FIXA_CONFIG.csrfToken;
    }
    const resposta = await fetch(url, opcoes);
    let dados;
    try {
      dados = await resposta.json();
    } catch {
      throw new Error("O servidor não retornou uma resposta JSON válida.");
    }
    if (!resposta.ok)
      throw new Error(dados.erro || "Não foi possível concluir a operação no servidor.");
    return dados;
  }

  function validar(entidade, registro, banco) {
    const lista = banco.registros[entidade];
    const unicos = {
      instituicoes: ["email_corporativo", "dominio_email"],
      usuarios: ["email"],
      enderecos: ["cnpj"],
      "super-administradores": ["email"],
    };
    for (const campo of unicos[entidade] || []) {
      const valor = String(registro[campo] || "")
        .trim()
        .toLocaleLowerCase("pt-BR");
      if (
        valor &&
        lista.some(
          (item) =>
            item.id !== registro.id &&
            String(item[campo] || "")
              .trim()
              .toLocaleLowerCase("pt-BR") === valor,
        )
      ) {
        const rotulo = window.FIXA_ENTIDADES[entidade].campos.find(
          (item) => item.nome === campo,
        ).rotulo;
        throw new Error(rotulo + " já está cadastrado.");
      }
    }
    const vinculos = {
      fk_instituicao_id: "instituicoes",
      fk_endereco_id: "enderecos",
      fk_plano_id: "planos",
      fk_contrato_id: "contratos",
      fk_usuario_id: "usuarios",
    };
    for (const [campo, destino] of Object.entries(vinculos)) {
      if (
        registro[campo] &&
        !banco.registros[destino].some((item) => String(item.id) === String(registro[campo]))
      ) {
        throw new Error(
          "O vínculo selecionado não existe mais. Atualize a página e selecione outro registro.",
        );
      }
    }
    if (
      entidade === "contratos" &&
      registro.data_inicio &&
      registro.data_vencimento &&
      registro.data_vencimento <= registro.data_inicio
    ) {
      throw new Error("A data de vencimento deve ser posterior à data de início.");
    }
    if (
      entidade === "usuarios" &&
      registro.data_nascimento &&
      registro.data_nascimento > dataAtual()
    ) {
      throw new Error("A data de nascimento não pode estar no futuro.");
    }
  }

  function dataAtual() {
    const hoje = new Date();
    return (
      hoje.getFullYear() +
      "-" +
      String(hoje.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(hoje.getDate()).padStart(2, "0")
    );
  }

  return {
    servidor,
    async listarTodos() {
      if (!servidor) return copiar(ler().registros);
      const registros = {};
      for (const entidade of entidades) {
        const resposta = await requisitar(entidade, { operacao: "listar" });
        if (!Array.isArray(resposta.registros))
          throw new Error("Lista de registros inválida: " + entidade);
        registros[entidade] = resposta.registros;
      }
      return registros;
    },
    async salvar(entidade, dados) {
      if (servidor)
        return requisitar(entidade, { ...dados, operacao: dados.id ? "editar" : "novo" }, "POST");
      const banco = ler();
      const antes = copiar(banco);
      const lista = banco.registros[entidade];
      const id = dados.id ? Number(dados.id) : ++banco.sequencias[entidade];
      const existente = lista.find((item) => item.id === id);
      if (dados.id && !existente)
        throw new Error("Este registro não existe mais. Atualize a lista.");
      const registro = { ...existente, id };
      for (const campo of window.FIXA_ENTIDADES[entidade].campos) {
        if (campo.tipo === "password") continue;
        registro[campo.nome] =
          campo.tipo === "checkbox"
            ? dados[campo.nome] === "true"
            : String(dados[campo.nome] ?? "").trim();
      }
      const agora = new Date();
      const horarioLocal = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19);
      registro.data_criacao = existente?.data_criacao || horarioLocal;
      validar(entidade, registro, banco);
      if (existente) lista[lista.indexOf(existente)] = registro;
      else lista.push(registro);
      gravar(banco, antes, entidade);
      return { registro: copiar(registro) };
    },
    async excluir(entidade, id) {
      if (servidor) return requisitar(entidade, { operacao: "excluir", id }, "POST");
      const banco = ler();
      const antes = copiar(banco);
      const chaves = {
        instituicoes: "fk_instituicao_id",
        enderecos: "fk_endereco_id",
        planos: "fk_plano_id",
        contratos: "fk_contrato_id",
        usuarios: "fk_usuario_id",
      };
      const campo = chaves[entidade];
      if (campo) {
        for (const outra of entidades) {
          if (banco.registros[outra].some((registro) => String(registro[campo]) === String(id))) {
            throw new Error(
              "Este registro está vinculado a " +
                window.FIXA_ENTIDADES[outra].titulo.toLowerCase() +
                ". Remova ou altere o vínculo antes de excluir.",
            );
          }
        }
      }
      const indice = banco.registros[entidade].findIndex((item) => String(item.id) === String(id));
      if (indice === -1) throw new Error("Este registro não existe mais.");
      banco.registros[entidade].splice(indice, 1);
      gravar(banco, antes, entidade);
      return { sucesso: true };
    },
    podeDesfazer(entidade) {
      if (servidor) return false;
      try {
        const historico = JSON.parse(sessionStorage.getItem(chaveHistorico));
        return historico?.entidade === entidade && historico.revisao === ler().revisao;
      } catch {
        return false;
      }
    },
    async desfazer(entidade) {
      if (!this.podeDesfazer(entidade))
        throw new Error("Não há alteração disponível para desfazer nesta tela.");
      const historico = JSON.parse(sessionStorage.getItem(chaveHistorico));
      const banco = historico.antes;
      const atual = ler();
      for (const chave of entidades)
        banco.sequencias[chave] = Math.max(banco.sequencias[chave], atual.sequencias[chave]);
      try {
        localStorage.setItem(chave, JSON.stringify(banco));
      } catch {
        throw new Error("Não foi possível desfazer a alteração.");
      }
      sessionStorage.removeItem(chaveHistorico);
    },
  };
})();
