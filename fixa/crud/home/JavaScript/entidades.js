window.FIXA_ENTIDADES = {
  instituicoes: {
    titulo: "Instituições",
    campos: [
      {
        nome: "nome",
        rotulo: "Nome",
        tipo: "text",
      },
      {
        nome: "email_corporativo",
        rotulo: "E-mail corporativo",
        tipo: "email",
      },
      {
        nome: "data_cadastro",
        rotulo: "Data de cadastro",
        tipo: "date",
      },
      {
        nome: "dominio_email",
        rotulo: "Domínio do e-mail",
        tipo: "text",
      },
      {
        nome: "tipo_instituicao",
        rotulo: "Tipo de instituição",
        tipo: "select",
        opcoes: {
          1: "Escola",
          2: "Faculdade",
          3: "Empresa",
          4: "Órgão Público",
        },
      },
      {
        nome: "senha",
        rotulo: "Senha",
        tipo: "password",
      },
    ],
    colunas: [
      {
        nome: "id",
        rotulo: "ID",
      },
      {
        nome: "nome",
        rotulo: "Nome",
      },
      {
        nome: "email_corporativo",
        rotulo: "E-mail corporativo",
      },
      {
        nome: "data_cadastro",
        rotulo: "Data de cadastro",
      },
      {
        nome: "dominio_email",
        rotulo: "Domínio do e-mail",
      },
      {
        nome: "tipo_instituicao",
        rotulo: "Tipo de instituição",
      },
    ],
    filtros: {
      id: ["IGUAL"],
      nome: ["IGUAL", "CONTEM"],
      email_corporativo: ["IGUAL", "CONTEM"],
      data_cadastro: ["IGUAL", "MAIOR_QUE", "MAIOR_OU_IGUAL", "MENOR_QUE", "MENOR_OU_IGUAL"],
      tipo_instituicao: ["IGUAL"],
      dominio_email: ["IGUAL", "CONTEM"],
    },
    ignorarAcentosEspacos: true,
    camposOrdenaveis: {
      id: "id",
      nome: "nome",
      email_corporativo: "email_corporativo",
      data_cadastro: "data_cadastro",
      dominio_email: "dominio_email",
      tipo_instituicao: "tipo_instituicao",
    },
  },
  usuarios: {
    titulo: "Usuários",
    campos: [
      {
        nome: "nome",
        rotulo: "Nome",
        tipo: "text",
      },
      {
        nome: "senha",
        rotulo: "Senha",
        tipo: "password",
      },
      {
        nome: "esta_ativo",
        rotulo: "Está ativo",
        tipo: "checkbox",
      },
      {
        nome: "email",
        rotulo: "E-mail",
        tipo: "email",
      },
      {
        nome: "cargo",
        rotulo: "Cargo",
        tipo: "text",
      },
      {
        nome: "tipo_acesso",
        rotulo: "Tipo de acesso",
        tipo: "select",
        opcoes: {
          1: "Administrador",
          2: "Gestor",
          3: "Técnico",
          4: "Solicitante",
        },
      },
      {
        nome: "fk_endereco_id",
        rotulo: "Endereço",
        tipo: "select",
      },
      {
        nome: "data_nascimento",
        rotulo: "Data de nascimento",
        tipo: "date",
      },
      {
        nome: "primeiro_acesso",
        rotulo: "Primeiro acesso",
        tipo: "checkbox",
      },
    ],
    colunas: [
      {
        nome: "id",
        rotulo: "ID",
      },
      {
        nome: "nome",
        rotulo: "Nome",
      },
      {
        nome: "esta_ativo",
        rotulo: "Está ativo",
      },
      {
        nome: "email",
        rotulo: "E-mail",
      },
      {
        nome: "data_criacao",
        rotulo: "Data de criação",
      },
      {
        nome: "cargo",
        rotulo: "Cargo",
      },
      {
        nome: "tipo_acesso",
        rotulo: "Tipo de acesso",
      },
      {
        nome: "endereco",
        rotulo: "Endereço",
      },
      {
        nome: "data_nascimento",
        rotulo: "Data de nascimento",
      },
      {
        nome: "primeiro_acesso",
        rotulo: "Primeiro acesso",
      },
      {
        nome: "estado",
        rotulo: "Estado (UF)",
        relacionada: true,
      },
      {
        nome: "instituicao",
        rotulo: "Instituição",
        relacionada: true,
      },
    ],
    filtros: {
      id: ["IGUAL"],
      nome: ["IGUAL", "CONTEM"],
      esta_ativo: ["IGUAL"],
      email: ["IGUAL", "CONTEM"],
      data_criacao: ["IGUAL", "MAIOR_QUE", "MAIOR_OU_IGUAL", "MENOR_QUE", "MENOR_OU_IGUAL"],
      cargo: ["IGUAL", "CONTEM"],
      fk_endereco_id: ["IGUAL"],
      tipo_acesso: ["IGUAL"],
      data_nascimento: ["IGUAL", "MAIOR_QUE", "MAIOR_OU_IGUAL", "MENOR_QUE", "MENOR_OU_IGUAL"],
      primeiro_acesso: ["IGUAL"],
    },
    ignorarAcentosEspacos: true,
    camposOrdenaveis: {
      id: "id",
      nome: "nome",
      esta_ativo: "esta_ativo",
      email: "email",
      data_criacao: "data_criacao",
      cargo: "cargo",
      tipo_acesso: "tipo_acesso",
      endereco: "fk_endereco_id",
      data_nascimento: "data_nascimento",
      primeiro_acesso: "primeiro_acesso",
    },
  },
  enderecos: {
    titulo: "Endereços",
    campos: [
      {
        nome: "nome",
        rotulo: "Nome do endereço",
        tipo: "text",
      },
      {
        nome: "rua",
        rotulo: "Rua",
        tipo: "text",
      },
      {
        nome: "numero",
        rotulo: "Número",
        tipo: "text",
      },
      {
        nome: "bairro",
        rotulo: "Bairro",
        tipo: "text",
      },
      {
        nome: "complemento",
        rotulo: "Complemento",
        tipo: "text",
      },
      {
        nome: "cidade",
        rotulo: "Cidade",
        tipo: "text",
      },
      {
        nome: "estado",
        rotulo: "Estado (UF)",
        tipo: "select",
        opcoes: {
          AC: "AC",
          AL: "AL",
          AP: "AP",
          AM: "AM",
          BA: "BA",
          CE: "CE",
          DF: "DF",
          ES: "ES",
          GO: "GO",
          MA: "MA",
          MT: "MT",
          MS: "MS",
          MG: "MG",
          PA: "PA",
          PB: "PB",
          PR: "PR",
          PE: "PE",
          PI: "PI",
          RJ: "RJ",
          RN: "RN",
          RS: "RS",
          RO: "RO",
          RR: "RR",
          SC: "SC",
          SP: "SP",
          SE: "SE",
          TO: "TO",
        },
      },
      {
        nome: "cep",
        rotulo: "CEP",
        tipo: "text",
      },
      {
        nome: "fk_instituicao_id",
        rotulo: "Instituição",
        tipo: "select",
      },
      {
        nome: "cnpj",
        rotulo: "CNPJ",
        tipo: "text",
      },
    ],
    colunas: [
      {
        nome: "id",
        rotulo: "ID",
      },
      {
        nome: "nome",
        rotulo: "Nome do endereço",
      },
      {
        nome: "rua",
        rotulo: "Rua",
      },
      {
        nome: "numero",
        rotulo: "Número",
      },
      {
        nome: "complemento",
        rotulo: "Complemento",
      },
      {
        nome: "bairro",
        rotulo: "Bairro",
      },
      {
        nome: "cidade",
        rotulo: "Cidade",
      },
      {
        nome: "estado",
        rotulo: "Estado (UF)",
      },
      {
        nome: "cep",
        rotulo: "CEP",
      },
      {
        nome: "instituicao",
        rotulo: "Instituição",
        relacionada: true,
      },
      {
        nome: "cnpj",
        rotulo: "CNPJ",
      },
      {
        nome: "data_criacao",
        rotulo: "Data de criação",
      },
    ],
    filtros: {
      id: ["IGUAL"],
      rua: ["IGUAL", "CONTEM"],
      bairro: ["IGUAL", "CONTEM"],
      cidade: ["IGUAL", "CONTEM"],
      estado: ["IGUAL", "CONTEM"],
      cep: ["IGUAL", "CONTEM"],
      cnpj: ["IGUAL", "CONTEM"],
      fk_instituicao_id: ["IGUAL"],
    },
    ignorarAcentosEspacos: true,
    camposOrdenaveis: {
      id: "id",
      rua: "rua",
      bairro: "bairro",
      cidade: "cidade",
      estado: "estado",
      cep: "cep",
      instituicao: "fk_instituicao_id",
      cnpj: "cnpj",
    },
  },
  "super-administradores": {
    titulo: "Super administradores",
    campos: [
      {
        nome: "nome",
        rotulo: "Nome",
        tipo: "text",
      },
      {
        nome: "email",
        rotulo: "E-mail",
        tipo: "email",
      },
      {
        nome: "senha",
        rotulo: "Senha",
        tipo: "password",
      },
    ],
    colunas: [
      {
        nome: "id",
        rotulo: "ID",
      },
      {
        nome: "nome",
        rotulo: "Nome",
      },
      {
        nome: "email",
        rotulo: "E-mail",
      },
    ],
    filtros: {
      id: ["IGUAL"],
      nome: ["IGUAL", "CONTEM"],
      email: ["IGUAL", "CONTEM"],
    },
    ignorarAcentosEspacos: true,
    camposOrdenaveis: {
      id: "id",
      nome: "nome",
      email: "email",
    },
  },
  planos: {
    titulo: "Planos",
    campos: [
      {
        nome: "nome",
        rotulo: "Nome",
        tipo: "text",
      },
      {
        nome: "valor_mensal",
        rotulo: "Valor mensal (R$)",
        tipo: "number",
      },
      {
        nome: "duracao_meses",
        rotulo: "Duração (meses)",
        tipo: "number",
      },
      {
        nome: "descricao",
        rotulo: "Descrição",
        tipo: "textarea",
      },
    ],
    colunas: [
      {
        nome: "id",
        rotulo: "ID",
      },
      {
        nome: "nome",
        rotulo: "Nome",
      },
      {
        nome: "valor_mensal",
        rotulo: "Valor mensal (R$)",
      },
      {
        nome: "duracao_meses",
        rotulo: "Duração (meses)",
      },
      {
        nome: "descricao",
        rotulo: "Descrição",
      },
      {
        nome: "data_criacao",
        rotulo: "Data de criação",
      },
    ],
    filtros: {
      id: ["IGUAL"],
      nome: ["IGUAL", "CONTEM"],
      valor_mensal: ["IGUAL", "MAIOR_QUE", "MAIOR_OU_IGUAL", "MENOR_QUE", "MENOR_OU_IGUAL"],
      duracao_meses: ["IGUAL", "MAIOR_QUE", "MAIOR_OU_IGUAL", "MENOR_QUE", "MENOR_OU_IGUAL"],
      descricao: ["IGUAL", "CONTEM"],
    },
    ignorarAcentosEspacos: true,
    camposOrdenaveis: {
      id: "id",
      nome: "nome",
      valor_mensal: "valor_mensal",
      duracao_meses: "duracao_meses",
      descricao: "descricao",
      data_criacao: "data_criacao",
    },
  },
  contratos: {
    titulo: "Contratos",
    campos: [
      {
        nome: "data_inicio",
        rotulo: "Data de início",
        tipo: "date",
      },
      {
        nome: "data_vencimento",
        rotulo: "Data de vencimento",
        tipo: "date",
      },
      {
        nome: "fk_plano_id",
        rotulo: "Plano",
        tipo: "select",
      },
      {
        nome: "fk_endereco_id",
        rotulo: "Endereço",
        tipo: "select",
      },
      {
        nome: "status_contrato",
        rotulo: "Status do contrato",
        tipo: "select",
        opcoes: {
          1: "Ativo",
          2: "Inativo",
          3: "Cancelado",
        },
      },
    ],
    colunas: [
      {
        nome: "id",
        rotulo: "ID",
      },
      {
        nome: "data_inicio",
        rotulo: "Data de início",
      },
      {
        nome: "data_vencimento",
        rotulo: "Data de vencimento",
      },
      {
        nome: "plano",
        rotulo: "Plano",
      },
      {
        nome: "endereco",
        rotulo: "Endereço",
      },
      {
        nome: "status_contrato",
        rotulo: "Status do contrato",
      },
      {
        nome: "data_criacao",
        rotulo: "Data de criação",
      },
      {
        nome: "estado",
        rotulo: "Estado (UF)",
        relacionada: true,
      },
      {
        nome: "instituicao",
        rotulo: "Instituição",
        relacionada: true,
      },
    ],
    filtros: {
      id: ["IGUAL"],
      data_inicio: ["IGUAL", "MAIOR_QUE", "MAIOR_OU_IGUAL", "MENOR_QUE", "MENOR_OU_IGUAL"],
      data_vencimento: ["IGUAL", "MAIOR_QUE", "MAIOR_OU_IGUAL", "MENOR_QUE", "MENOR_OU_IGUAL"],
      fk_endereco_id: ["IGUAL"],
      fk_plano_id: ["IGUAL"],
      status_contrato: ["IGUAL"],
    },
    ignorarAcentosEspacos: false,
    camposOrdenaveis: {
      id: "id",
      data_inicio: "data_inicio",
      data_vencimento: "data_vencimento",
      plano: "fk_plano_id",
      endereco: "fk_endereco_id",
      status_contrato: "status_contrato",
      data_criacao: "data_criacao",
    },
  },
  pagamentos: {
    titulo: "Pagamentos",
    campos: [
      {
        nome: "valor",
        rotulo: "Valor (R$)",
        tipo: "number",
      },
      {
        nome: "data_pagamento",
        rotulo: "Data/hora do pagamento",
        tipo: "datetime-local",
      },
      {
        nome: "foi_realizado",
        rotulo: "Foi realizado",
        tipo: "checkbox",
      },
      {
        nome: "fk_contrato_id",
        rotulo: "Contrato",
        tipo: "select",
      },
      {
        nome: "metodo_pagamento",
        rotulo: "Método de pagamento",
        tipo: "select",
        opcoes: {
          1: "Crédito",
          2: "Débito",
          3: "Pix",
        },
      },
    ],
    colunas: [
      {
        nome: "id",
        rotulo: "ID",
      },
      {
        nome: "valor",
        rotulo: "Valor (R$)",
      },
      {
        nome: "data_pagamento",
        rotulo: "Data/hora do pagamento",
      },
      {
        nome: "foi_realizado",
        rotulo: "Foi realizado",
      },
      {
        nome: "contrato",
        rotulo: "Contrato",
      },
      {
        nome: "metodo_pagamento",
        rotulo: "Método de pagamento",
      },
      {
        nome: "data_criacao",
        rotulo: "Data de criação",
      },
      {
        nome: "status_contrato",
        rotulo: "Status do contrato",
        relacionada: true,
      },
      {
        nome: "data_vencimento",
        rotulo: "Data de vencimento",
        relacionada: true,
      },
      {
        nome: "plano",
        rotulo: "Plano",
        relacionada: true,
      },
      {
        nome: "estado",
        rotulo: "Estado (UF)",
        relacionada: true,
      },
      {
        nome: "instituicao",
        rotulo: "Instituição",
        relacionada: true,
      },
      {
        nome: "em_dia",
        rotulo: "Em dia?",
        relacionada: true,
      },
    ],
    filtros: {
      id: ["IGUAL"],
      valor: ["IGUAL", "MAIOR_QUE", "MAIOR_OU_IGUAL", "MENOR_QUE", "MENOR_OU_IGUAL"],
      data_pagamento: ["IGUAL", "MAIOR_QUE", "MAIOR_OU_IGUAL", "MENOR_QUE", "MENOR_OU_IGUAL"],
      foi_realizado: ["IGUAL"],
      fk_contrato_id: ["IGUAL"],
      metodo_pagamento: ["IGUAL"],
    },
    ignorarAcentosEspacos: false,
    camposOrdenaveis: {
      id: "id",
      valor: "valor",
      data_pagamento: "data_pagamento",
      foi_realizado: "foi_realizado",
      contrato: "fk_contrato_id",
      metodo_pagamento: "metodo_pagamento",
      data_criacao: "data_criacao",
    },
  },
  "fotos-usuario": {
    titulo: "Fotos de usuário",
    campos: [
      {
        nome: "data_registro",
        rotulo: "Data de registro",
        tipo: "datetime-local",
      },
      {
        nome: "url",
        rotulo: "URL da foto",
        tipo: "url",
      },
      {
        nome: "fk_usuario_id",
        rotulo: "Usuário",
        tipo: "select",
      },
    ],
    colunas: [
      {
        nome: "id",
        rotulo: "ID",
      },
      {
        nome: "data_registro",
        rotulo: "Data de registro",
      },
      {
        nome: "usuario",
        rotulo: "Usuário",
      },
      {
        nome: "usuario_nome",
        rotulo: "Nome do usuário",
        relacionada: true,
      },
      {
        nome: "email_usuario",
        rotulo: "E-mail do usuário",
        relacionada: true,
      },
    ],
    filtros: {
      id: ["IGUAL"],
      fk_usuario_id: ["IGUAL"],
    },
    ignorarAcentosEspacos: false,
    camposOrdenaveis: {},
  },
};
