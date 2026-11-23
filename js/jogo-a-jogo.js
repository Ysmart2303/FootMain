/* FootMain — carreira principal jogo a jogo. */
(() => {
  "use strict";

  /* ============================================================
       CALENDÁRIO CENTRALIZADO — FootMain
       ============================================================ */

  const CALENDARIO_LIGAS = {
    // Europa — agosto a maio (atravessa o ano)
    "Premier League": { mesInicio: 8, mesFim: 5 },
    "La Liga": { mesInicio: 8, mesFim: 5 },
    "Serie A": { mesInicio: 8, mesFim: 5 },
    Bundesliga: { mesInicio: 8, mesFim: 5 },
    "Ligue 1": { mesInicio: 8, mesFim: 5 },
    "Primeira Liga": { mesInicio: 8, mesFim: 5 },
    Eredivisie: { mesInicio: 8, mesFim: 5 },
    "Süper Lig": { mesInicio: 8, mesFim: 5 },
    "Belgian Pro League": { mesInicio: 7, mesFim: 5 },
    "Scottish Premiership": { mesInicio: 8, mesFim: 5 },
    "Swiss Super League": { mesInicio: 7, mesFim: 5 },
    "Austrian Bundesliga": { mesInicio: 7, mesFim: 5 },
    "Russian Premier League": { mesInicio: 7, mesFim: 5 },
    "Ukrainian Premier League": { mesInicio: 7, mesFim: 5 },
    "Greek Super League": { mesInicio: 8, mesFim: 5 },

    // Brasil — abril a dezembro
    Brasileirão: { mesInicio: 4, mesFim: 12 },

    // Sul-americanas — fevereiro a novembro/dezembro
    "Argentine Primera División": { mesInicio: 1, mesFim: 12 },
    "Colombian Primera A": { mesInicio: 1, mesFim: 12 },
    "Chilean Primera División": { mesInicio: 2, mesFim: 11 },
    "Uruguayan Primera División": { mesInicio: 2, mesFim: 12 },
    "Ecuadorian Serie A": { mesInicio: 2, mesFim: 12 },
    "Paraguayan Primera División": { mesInicio: 1, mesFim: 12 },

    // Américas (EUA/México/Canadá) — fevereiro a dezembro
    MLS: { mesInicio: 2, mesFim: 12 },
    "Liga MX": { mesInicio: 1, mesFim: 12 },

    // Ásia — fevereiro a novembro/dezembro
    "Saudi Pro League": { mesInicio: 8, mesFim: 5 },
    "J1 League": { mesInicio: 2, mesFim: 12 },
    "K League 1": { mesInicio: 2, mesFim: 12 },
    "Chinese Super League": { mesInicio: 3, mesFim: 11 },

    // África — agosto a maio
    "Egyptian Premier League": { mesInicio: 8, mesFim: 5 },
    "South African Premier Division": { mesInicio: 8, mesFim: 5 },
    "Moroccan Botola": { mesInicio: 8, mesFim: 5 },

    // Oceania — outubro a maio
    "Australian A-League": { mesInicio: 10, mesFim: 5 },
  };

  const CALENDARIO_COPAS = {
    // Europa
    "Carabao Cup": { mesInicio: 8, mesFim: 2 },
    "Copa del Rey": { mesInicio: 10, mesFim: 4 },
    "Coppa Italia": { mesInicio: 8, mesFim: 5 },
    "DFB-Pokal": { mesInicio: 8, mesFim: 5 },
    "Coupe de France": { mesInicio: 11, mesFim: 5 },
    "Taça de Portugal": { mesInicio: 10, mesFim: 5 },
    "KNVB Beker": { mesInicio: 9, mesFim: 4 },
    "Türkiye Kupası": { mesInicio: 10, mesFim: 5 },
    "Belgian Cup": { mesInicio: 8, mesFim: 4 },
    "Scottish Cup": { mesInicio: 1, mesFim: 5 },
    "Schweizer Cup": { mesInicio: 8, mesFim: 5 },
    "ÖFB-Cup": { mesInicio: 7, mesFim: 5 },
    "Russian Cup": { mesInicio: 7, mesFim: 5 },
    "Ukrainian Cup": { mesInicio: 8, mesFim: 5 },
    "Greek Cup": { mesInicio: 9, mesFim: 5 },

    // Sul-americanas
    "Copa do Brasil": { mesInicio: 2, mesFim: 11 },
    "Copa Argentina": { mesInicio: 1, mesFim: 12 },
    "Copa Colombia": { mesInicio: 2, mesFim: 11 },
    "Copa Chile": { mesInicio: 4, mesFim: 11 },
    "Copa Uruguay": { mesInicio: 3, mesFim: 11 },
    "Copa Ecuador": { mesInicio: 3, mesFim: 11 },
    "Copa Paraguay": { mesInicio: 3, mesFim: 12 },

    // Outras
    "US Open Cup": { mesInicio: 3, mesFim: 9 },
    "Copa MX": { mesInicio: 1, mesFim: 12 },
    "King's Cup": { mesInicio: 9, mesFim: 5 },
    "Emperor's Cup": { mesInicio: 5, mesFim: 12 },
    "Korean FA Cup": { mesInicio: 3, mesFim: 12 },
    "Chinese FA Cup": { mesInicio: 3, mesFim: 11 },
    "Egypt Cup": { mesInicio: 9, mesFim: 6 },
    "Nedbank Cup": { mesInicio: 1, mesFim: 5 },
    "Coupe du Trône": { mesInicio: 8, mesFim: 11 },
    "Australia Cup": { mesInicio: 7, mesFim: 10 },

    // Estaduais brasileiros (jan-abr)
    Carioca: { mesInicio: 1, mesFim: 4 },
    Paulistão: { mesInicio: 1, mesFim: 4 },
    Gauchão: { mesInicio: 1, mesFim: 4 },
    Mineiro: { mesInicio: 1, mesFim: 4 },
    Baianão: { mesInicio: 1, mesFim: 4 },
    Pernambucano: { mesInicio: 1, mesFim: 4 },
    Cearense: { mesInicio: 1, mesFim: 4 },
  };

  const CALENDARIO_COMPETICOES = {
    // Torneios de seleção — concentrados
    "Copa do Mundo": {
      tipo: "concentrado",
      mesInicio: 6,
      diaInicio: 11,
      intervaloDias: 4,
    },
    Eurocopa: {
      tipo: "concentrado",
      mesInicio: 6,
      diaInicio: 14,
      intervaloDias: 4,
    },
    "Copa América": {
      tipo: "concentrado",
      mesInicio: 6,
      diaInicio: 20,
      intervaloDias: 4,
    },
    "Copa Ouro": {
      tipo: "concentrado",
      mesInicio: 6,
      diaInicio: 15,
      intervaloDias: 4,
    },
    "Copa das Nações Africanas": {
      tipo: "concentrado",
      mesInicio: 1,
      diaInicio: 9,
      intervaloDias: 4,
    },
    "Copa da Ásia": {
      tipo: "concentrado",
      mesInicio: 1,
      diaInicio: 12,
      intervaloDias: 4,
    },
    "Copa das Nações da OFC": {
      tipo: "concentrado",
      mesInicio: 6,
      diaInicio: 15,
      intervaloDias: 4,
    },
    Olimpíadas: {
      tipo: "concentrado",
      mesInicio: 7,
      diaInicio: 24,
      intervaloDias: 3,
    },
    "Mundial Sub-20": {
      tipo: "concentrado",
      mesInicio: 5,
      diaInicio: 20,
      intervaloDias: 3,
    },
    "Mundial Sub-17": {
      tipo: "concentrado",
      mesInicio: 10,
      diaInicio: 15,
      intervaloDias: 3,
    },
    "Copa do Mundo de Clubes": {
      tipo: "concentrado",
      mesInicio: 6,
      diaInicio: 15,
      intervaloDias: 4,
    },
    Intercontinental: {
      tipo: "concentrado",
      mesInicio: 12,
      diaInicio: 10,
      intervaloDias: 5,
    },
    "Supercopa Nacional": {
      tipo: "concentrado",
      mesInicio: 8,
      diaInicio: 10,
      intervaloDias: 2,
    },
    "Supercopa Continental": {
      tipo: "concentrado",
      mesInicio: 8,
      diaInicio: 12,
      intervaloDias: 2,
    },

    // Continentais europeias — setembro a maio
    "Champions League": {
      tipo: "continental",
      mesInicio: 9,
      mesFim: 5,
      fasesMeses: [9, 10, 11, 2, 3, 4, 5],
    },
    "Europa League": {
      tipo: "continental",
      mesInicio: 9,
      mesFim: 5,
      fasesMeses: [9, 10, 11, 2, 3, 4, 5],
    },
    "Conference League": {
      tipo: "continental",
      mesInicio: 9,
      mesFim: 5,
      fasesMeses: [9, 10, 11, 2, 3, 4, 5],
    },

    // Continentais sul-americanas — fevereiro a novembro
    Libertadores: {
      tipo: "continental",
      mesInicio: 2,
      mesFim: 11,
      fasesMeses: [2, 4, 5, 7, 8, 9, 11],
    },
    "Copa Sul-Americana": {
      tipo: "continental",
      mesInicio: 3,
      mesFim: 11,
      fasesMeses: [3, 4, 6, 7, 9, 10, 11],
    },

    // Outras continentais
    "CONCACAF Champions Cup": {
      tipo: "continental",
      mesInicio: 2,
      mesFim: 6,
      fasesMeses: [2, 3, 4, 5, 6],
    },
    "AFC Champions League": {
      tipo: "continental",
      mesInicio: 2,
      mesFim: 11,
      fasesMeses: [2, 4, 6, 8, 10, 11],
    },
    "AFC Champions League 2": {
      tipo: "continental",
      mesInicio: 2,
      mesFim: 11,
      fasesMeses: [2, 4, 6, 8, 10, 11],
    },
    "CAF Champions League": {
      tipo: "continental",
      mesInicio: 2,
      mesFim: 11,
      fasesMeses: [2, 4, 6, 8, 10, 11],
    },
    "CAF Confederation Cup": {
      tipo: "continental",
      mesInicio: 2,
      mesFim: 11,
      fasesMeses: [2, 4, 6, 8, 10, 11],
    },
  };

  const FASES_GRUPOS_SELECOES = {
    "Copa do Mundo": {
      regioes: [
        "africa",
        "americaNorte",
        "americaSul",
        "asia",
        "europa",
        "oceania",
      ],
      grupos: 12,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 8,
      fasesMataMata: 5,
    },
    "Copa América": {
      regioes: ["americaSul", "americaNorte"],
      grupos: 4,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 0,
      fasesMataMata: 3,
    },
    Eurocopa: {
      regioes: ["europa"],
      grupos: 6,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 4,
      fasesMataMata: 4,
    },
    "Copa Ouro": {
      regioes: ["americaNorte"],
      grupos: 4,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 0,
      fasesMataMata: 3,
    },
    "Copa das Nações Africanas": {
      regioes: ["africa"],
      grupos: 6,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 4,
      fasesMataMata: 4,
    },
    "Copa da Ásia": {
      regioes: ["asia"],
      grupos: 6,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 4,
      fasesMataMata: 4,
    },
    "Copa das Nações da OFC": {
      regioes: ["oceania"],
      grupos: 2,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 0,
      fasesMataMata: 2,
    },
    Olimpíadas: {
      regioes: [
        "africa",
        "americaNorte",
        "americaSul",
        "asia",
        "europa",
        "oceania",
      ],
      grupos: 4,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 0,
      fasesMataMata: 3,
    },
    "Mundial Sub-20": {
      regioes: [
        "africa",
        "americaNorte",
        "americaSul",
        "asia",
        "europa",
        "oceania",
      ],
      grupos: 6,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 4,
      fasesMataMata: 4,
    },
    "Mundial Sub-17": {
      regioes: [
        "africa",
        "americaNorte",
        "americaSul",
        "asia",
        "europa",
        "oceania",
      ],
      grupos: 12,
      timesPorGrupo: 4,
      classificadosPorGrupo: 2,
      melhoresTerceiros: 8,
      fasesMataMata: 5,
    },
  };

  FASES_GRUPOS_SELECOES["Eliminatórias da Copa do Mundo"] = {
    regioes: [
      "africa",
      "americaNorte",
      "americaSul",
      "asia",
      "europa",
      "oceania",
    ],
    grupos: 1,
    timesPorGrupo: 999,
    classificadosPorGrupo: 1,
    melhoresTerceiros: 0,
    fasesMataMata: 0,
    eliminatorias: true,
  };

  /* ============================================================
       LIGAS POR CONTINENTE
       ============================================================ */
  const LIGAS_AMERICA_SUL = [
    "Brasileirão",
    "Argentine Primera División",
    "Colombian Primera A",
    "Chilean Primera División",
    "Uruguayan Primera División",
    "Ecuadorian Serie A",
    "Paraguayan Primera División",
  ];

  const LIGAS_EUROPA = [
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "Primeira Liga",
    "Eredivisie",
    "Süper Lig",
    "Belgian Pro League",
    "Scottish Premiership",
    "Swiss Super League",
    "Austrian Bundesliga",
    "Russian Premier League",
    "Ukrainian Premier League",
    "Greek Super League",
  ];

  const LIGAS_ASIA = [
    "Saudi Pro League",
    "J1 League",
    "K League 1",
    "Chinese Super League",
    "Australian A-League",
  ];

  const LIGAS_AFRICA = [
    "Egyptian Premier League",
    "South African Premier Division",
    "Moroccan Botola",
  ];

  const LIGAS_AMERICA_NORTE = ["MLS", "Liga MX"];

  /* ============================================================
       CONFIGURAÇÃO DE CADA COMPETIÇÃO CONTINENTAL
       formato: "grupos" (grupos de 4) | "fase-liga" (tabela única)
       torneioPrefixo: usado para gerar o torneioId único
       ============================================================ */
  const CONTINENTAL_CONFS = {
    // ===== AMÉRICA DO SUL =====
    Libertadores: {
      formato: "grupos",
      ligas: LIGAS_AMERICA_SUL,
      vagasPorLiga: {
        Brasileirão: 6,
        "Argentine Primera División": 6,
        "Colombian Primera A": 4,
        "Chilean Primera División": 4,
        "Uruguayan Primera División": 4,
        "Ecuadorian Serie A": 4,
        "Paraguayan Primera División": 4,
      },
      totalTimes: 32,
      grupos: 8,
      timesPorGrupo: 4,
      jogosGrupo: 6,
      classificadosPorGrupo: 2,
      totalFasesMataMata: 4,
      torneioPrefixo: "sa",
    },
    "Copa Sul-Americana": {
      formato: "grupos",
      ligas: LIGAS_AMERICA_SUL,
      vagasPorLiga: {
        Brasileirão: 6,
        "Argentine Primera División": 6,
        "Colombian Primera A": 4,
        "Chilean Primera División": 4,
        "Uruguayan Primera División": 4,
        "Ecuadorian Serie A": 4,
        "Paraguayan Primera División": 4,
      },
      totalTimes: 32,
      grupos: 8,
      timesPorGrupo: 4,
      jogosGrupo: 6,
      classificadosPorGrupo: 2,
      totalFasesMataMata: 4,
      torneioPrefixo: "sa",
    },

    // ===== EUROPA =====
    "Champions League": {
      formato: "fase-liga",
      ligas: LIGAS_EUROPA,
      vagasPorLiga: {
        "Premier League": 4,
        "La Liga": 4,
        "Serie A": 4,
        Bundesliga: 4,
        "Ligue 1": 4,
        "Primeira Liga": 3,
        Eredivisie: 3,
        "Süper Lig": 2,
        "Belgian Pro League": 2,
        "Scottish Premiership": 1,
        "Swiss Super League": 1,
        "Austrian Bundesliga": 1,
        "Russian Premier League": 1,
        "Ukrainian Premier League": 1,
        "Greek Super League": 1,
      },
      totalTimes: 36,
      jogosFaseLiga: 8,
      classificadosParaKnockout: 16,
      totalFasesMataMata: 4,
      torneioPrefixo: "cl",
    },
    "Europa League": {
      formato: "grupos",
      ligas: LIGAS_EUROPA,
      vagasPorLiga: {
        "Premier League": 4,
        "La Liga": 4,
        "Serie A": 3,
        Bundesliga: 3,
        "Ligue 1": 3,
        "Primeira Liga": 2,
        Eredivisie: 2,
        "Süper Lig": 2,
        "Belgian Pro League": 2,
        "Scottish Premiership": 2,
        "Swiss Super League": 1,
        "Austrian Bundesliga": 1,
        "Russian Premier League": 1,
        "Ukrainian Premier League": 1,
        "Greek Super League": 1,
      },
      totalTimes: 32,
      grupos: 8,
      timesPorGrupo: 4,
      jogosGrupo: 6,
      classificadosPorGrupo: 2,
      totalFasesMataMata: 4,
      torneioPrefixo: "el",
    },
    "Conference League": {
      formato: "grupos",
      ligas: LIGAS_EUROPA,
      vagasPorLiga: {
        "Premier League": 4,
        "La Liga": 4,
        "Serie A": 3,
        Bundesliga: 3,
        "Ligue 1": 3,
        "Primeira Liga": 2,
        Eredivisie: 2,
        "Süper Lig": 2,
        "Belgian Pro League": 2,
        "Scottish Premiership": 2,
        "Swiss Super League": 1,
        "Austrian Bundesliga": 1,
        "Russian Premier League": 1,
        "Ukrainian Premier League": 1,
        "Greek Super League": 1,
      },
      totalTimes: 32,
      grupos: 8,
      timesPorGrupo: 4,
      jogosGrupo: 6,
      classificadosPorGrupo: 2,
      totalFasesMataMata: 4,
      torneioPrefixo: "conf",
    },

    // ===== ÁSIA =====
    "AFC Champions League": {
      formato: "grupos",
      ligas: LIGAS_ASIA,
      vagasPorLiga: {
        "Saudi Pro League": 8,
        "J1 League": 8,
        "K League 1": 6,
        "Chinese Super League": 6,
        "Australian A-League": 4,
      },
      totalTimes: 32,
      grupos: 8,
      timesPorGrupo: 4,
      jogosGrupo: 6,
      classificadosPorGrupo: 2,
      totalFasesMataMata: 4,
      torneioPrefixo: "afc1",
    },
    "AFC Champions League 2": {
      formato: "grupos",
      ligas: LIGAS_ASIA,
      vagasPorLiga: {
        "Saudi Pro League": 7,
        "J1 League": 7,
        "K League 1": 6,
        "Chinese Super League": 6,
        "Australian A-League": 6,
      },
      totalTimes: 32,
      grupos: 8,
      timesPorGrupo: 4,
      jogosGrupo: 6,
      classificadosPorGrupo: 2,
      totalFasesMataMata: 4,
      torneioPrefixo: "afc2",
    },

    // ===== ÁFRICA (16 times → 4 grupos de 4) =====
    "CAF Champions League": {
      formato: "grupos",
      ligas: LIGAS_AFRICA,
      vagasPorLiga: {
        "Egyptian Premier League": 6,
        "South African Premier Division": 5,
        "Moroccan Botola": 5,
      },
      totalTimes: 16,
      grupos: 4,
      timesPorGrupo: 4,
      jogosGrupo: 6,
      classificadosPorGrupo: 2,
      totalFasesMataMata: 3,
      torneioPrefixo: "caf1",
    },
    "CAF Confederation Cup": {
      formato: "grupos",
      ligas: LIGAS_AFRICA,
      vagasPorLiga: {
        "Egyptian Premier League": 6,
        "South African Premier Division": 5,
        "Moroccan Botola": 5,
      },
      totalTimes: 16,
      grupos: 4,
      timesPorGrupo: 4,
      jogosGrupo: 6,
      classificadosPorGrupo: 2,
      totalFasesMataMata: 3,
      torneioPrefixo: "caf2",
    },

    // ===== AMÉRICA DO NORTE (16 times → 4 grupos de 4) =====
    "CONCACAF Champions Cup": {
      formato: "grupos",
      ligas: LIGAS_AMERICA_NORTE,
      vagasPorLiga: { MLS: 8, "Liga MX": 8 },
      totalTimes: 16,
      grupos: 4,
      timesPorGrupo: 4,
      jogosGrupo: 6,
      classificadosPorGrupo: 2,
      totalFasesMataMata: 3,
      torneioPrefixo: "concacaf",
    },
  };

  /* Ordem hierárquica para cálculo de offset entre competições do mesmo continente.
       Ex.: EL começa depois das vagas de CL; Conference depois das vagas de EL. */
  const ORDEM_CONTINENTAL = {
    "Champions League": [],
    "Europa League": ["Champions League"],
    "Conference League": ["Champions League", "Europa League"],
    Libertadores: [],
    "Copa Sul-Americana": ["Libertadores"],
    "AFC Champions League": [],
    "AFC Champions League 2": ["AFC Champions League"],
    "CAF Champions League": [],
    "CAF Confederation Cup": ["CAF Champions League"],
    "CONCACAF Champions Cup": [],
  };

  /* Janelas FIFA — usadas para eliminatórias, amistosos e torneios curtos de seleção. */
  const JANELAS_FIFA = [
    { mes: 6, dia: 5, tipo: "Amistoso" },
    { mes: 11, dia: 14, tipo: "Amistoso" },
  ];

  /* Cria timestamp UTC ao meio-dia. Meses podem passar de 12 e virar o ano. */
  function criarDataUTC(ano, mes, dia) {
    return Date.UTC(ano, mes - 1, dia, 12);
  }

  /* Retorna quantos dias há entre dois meses (considerando virada de ano). */
  function mesesParaDias(mesInicio, mesFim) {
    return mesFim >= mesInicio
      ? (mesFim - mesInicio) * 30
      : (12 - mesInicio + mesFim) * 30;
  }

  /* Datas das fases de uma competição, com base no calendário central. */
  function calcularDatasFases(
    competicao,
    ano,
    quantidadeFases,
    mesInicialFallback = 2,
  ) {
    const calComp = CALENDARIO_COMPETICOES[competicao];
    const calCopa = CALENDARIO_COPAS[competicao];
    const calLiga = CALENDARIO_LIGAS[competicao];
    const cal = calComp || calCopa || calLiga;

    // Sem calendário específico → fallback antigo, mas sem estourar o ano.
    if (!cal) {
      return Array.from({ length: quantidadeFases }, (_, i) =>
        criarDataUTC(ano, Math.min(11, mesInicialFallback + i * 2), 8),
      );
    }

    // Torneio concentrado: dias consecutivos dentro do período.
    if (cal.tipo === "concentrado") {
      const inicio = criarDataUTC(ano, cal.mesInicio, cal.diaInicio || 10);
      return Array.from(
        { length: quantidadeFases },
        (_, i) => inicio + i * (cal.intervaloDias || 4) * 86400000,
      );
    }

    // Continental: distribui fases entre os meses listados.
    if (cal.tipo === "continental" && Array.isArray(cal.fasesMeses)) {
      const meses = cal.fasesMeses;
      return Array.from({ length: quantidadeFases }, (_, i) => {
        const idx =
          quantidadeFases === 1
            ? 0
            : Math.floor((i * (meses.length - 1)) / (quantidadeFases - 1));
        const mes = meses[Math.min(idx, meses.length - 1)];
        const anoFase = mes < cal.mesInicio ? ano + 1 : ano;
        return criarDataUTC(anoFase, mes, 10 + (i % 3) * 5);
      });
    }

    // Copa/liga nacional: distribui fases ao longo dos meses do período.
    const totalMeses = mesesParaDias(cal.mesInicio, cal.mesFim) / 30;
    return Array.from({ length: quantidadeFases }, (_, i) => {
      const offset =
        quantidadeFases === 1
          ? 0
          : Math.round((i * totalMeses) / (quantidadeFases - 1));
      let mes = cal.mesInicio + offset;
      let anoFase = ano;
      while (mes > 12) {
        mes -= 12;
        anoFase++;
      }
      return criarDataUTC(anoFase, mes, 10 + (i % 3) * 5);
    });
  }

  const KEY = "footmain_jogo_a_jogo_carreira_v2";
  const ANO_BASE_COPA_DO_MUNDO_SELECOES = 2002;
  const ANO_BASE_EVENTOS_SELECOES = 2004;
  const CICLO_COPA_DO_MUNDO_SELECOES = 4;
  const $ = (id) => document.getElementById(id);
  let estado = null;
  let salvamentoCompacto = false;
  let avisoArmazenamentoExibido = false;
  let simulandoCarreira = false;
  let bloqueioAcoesPartida = false;
  let decisaoEmAndamento = false;
  let fluxoDecisao = null;
  let loadingEl = null;
  let carregamentoAtivo = false;
  let filaModaisPartida = [];
  let simulandoTemporada = false;
  let adiarPromocaoBaseAteFim = false;
  let promocaoBasePendente = null;
  let clubesDisponiveisCache = null;
  const forcasClubesCache = new Map();
  let versaoResultados = 0;
  let cacheTabelasContinentais = new Map();
  let cacheEstatisticasBolaDeOuro = null;

  function invalidarCachesDerivados() {
    versaoResultados++;
    cacheTabelasContinentais.clear();
    cacheEstatisticasBolaDeOuro = null;
  }

  function mostrarCarregamento(texto = "Simulando...") {
    if (!loadingEl) {
      loadingEl = document.createElement("div");
      loadingEl.className = "footmain-loading-overlay";
      loadingEl.hidden = true;
      loadingEl.setAttribute("role", "status");
      loadingEl.setAttribute("aria-live", "polite");
      loadingEl.setAttribute("aria-busy", "true");
      loadingEl.innerHTML = `
                <div class="footmain-loading-spinner" aria-hidden="true"></div>
                <p class="footmain-loading-texto"></p>`;
      document.body.append(loadingEl);
    }
    carregamentoAtivo = true;
    loadingEl.querySelector(".footmain-loading-texto").textContent = texto;
    loadingEl.hidden = false;
    // Libera o frame para o navegador pintar o overlay antes da simulação bloquear a thread.
    return new Promise((resolve) => setTimeout(resolve, 30));
  }

  function ocultarCarregamento() {
    carregamentoAtivo = false;
    if (loadingEl) loadingEl.hidden = true;
  }

  async function aguardarCarregamentoLiberado() {
    while (carregamentoAtivo) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }

  function bloquearAcoesPartida() {
    bloqueioAcoesPartida = true;
    window.setTimeout(() => {
      bloqueioAcoesPartida = false;
      renderizar();
    }, 400);
  }

  /* ============================================================
       Fila de modais de evento / troféu
       ============================================================ */
  function ehPartidaFinal(partida) {
    if (!partida) return false;
    return (
      Number(partida.fase) > 0 &&
      Number(partida.totalFases) > 0 &&
      Number(partida.fase) === Number(partida.totalFases)
    );
  }

  function enfileirarTrofeu(competicao, tipoTrofeu) {
    filaModaisPartida.push({ tipo: "trofeu", competicao, tipoTrofeu });
  }

  function enfileirarPremioIndividual(titulo) {
    filaModaisPartida.push({ tipo: "premio-individual", titulo });
  }

  function enfileirarEvento(tipoEvento, mensagem, icone) {
    filaModaisPartida.push({ tipo: "evento", tipoEvento, mensagem, icone });
  }

  async function processarFilaModais() {
    const prioridadeModal = (item) =>
      item.tipo === "resumo-temporada"
        ? 3
        : item.tipo === "trofeu"
          ? 2
          : item.tipo === "ultima-partida"
            ? 1
            : 0;
    filaModaisPartida.sort(
      (a, b) => prioridadeModal(a) - prioridadeModal(b),
    );
    while (filaModaisPartida.length > 0) {
      await aguardarCarregamentoLiberado();
      const item = filaModaisPartida.shift();
      if (item.tipo === "trofeu") {
        await exibirModalTrofeu(item.competicao, item.tipoTrofeu);
      } else if (item.tipo === "premio-individual") {
        await exibirModalTrofeu(item.titulo, "individual");
      } else if (item.tipo === "bola-de-ouro") {
        await exibirModalBolaDeOuro(item.ranking);
      } else if (item.tipo === "evento") {
        await exibirModalEvento(item.tipoEvento, item.mensagem, item.icone);
      } else if (item.tipo === "ultima-partida") {
        await exibirModalUltimaPartida();
      } else if (item.tipo === "resumo-temporada") {
        await exibirModalResumoTemporada(item.temporada);
      }
    }
  }

  async function exibirModalResumoTemporada(temporada) {
    await aguardarCarregamentoLiberado();
    return new Promise((resolve) => {
      const modal = $("jja-modal-resumo-temporada");
      const continuar = $("jja-resumo-temporada-continuar");
      if (!modal || !continuar) {
        resolve();
        return;
      }

      const reputacao = Number(temporada.variacaoReputacao) || 0;
      const reputacaoEl = $("jja-resumo-temporada-reputacao");
      $("jja-resumo-temporada-ano").textContent = String(temporada.ano || "-");
      $("jja-resumo-temporada-gols").textContent = String(
        Number(temporada.gols) || 0,
      );
      $("jja-resumo-temporada-assistencias").textContent = String(
        Number(temporada.assistencias) || 0,
      );
      if (reputacaoEl) {
        reputacaoEl.textContent = `${reputacao > 0 ? "+" : ""}${reputacao} ${
          Math.abs(reputacao) === 1 ? "ponto" : "pontos"
        }`;
        reputacaoEl.classList.toggle("jja-reputacao-positiva", reputacao > 0);
        reputacaoEl.classList.toggle("jja-reputacao-negativa", reputacao < 0);
      }
      $("jja-resumo-temporada-coletivos").textContent = [
        ...new Set([
          ...(temporada.trofeusColetivos || []),
          ...(temporada.trofeusClube || []),
          ...(temporada.trofeusSelecao || []),
        ]),
      ].join(", ") || "Nenhum";
      $("jja-resumo-temporada-individuais").textContent = [
        ...new Set(temporada.trofeusIndividuais || []),
      ].join(", ") || "Nenhum";

      modal.hidden = false;
      continuar.focus();

      const fechar = () => {
        modal.hidden = true;
        continuar.removeEventListener("click", fechar);
        document.removeEventListener("keydown", aoTeclar);
        modal.removeEventListener("click", aoClicarFora);
        resolve();
      };
      const aoTeclar = (evento) => {
        if (evento.key === "Escape" || evento.key === "Enter") {
          evento.preventDefault();
          fechar();
        }
      };
      const aoClicarFora = (evento) => {
        if (evento.target === modal) fechar();
      };
      continuar.addEventListener("click", fechar);
      document.addEventListener("keydown", aoTeclar);
      modal.addEventListener("click", aoClicarFora);
    });
  }

  async function exibirModalTrofeu(competicao, tipoTrofeu) {
    await aguardarCarregamentoLiberado();
    return new Promise((resolve) => {
      const modal = $("jja-modal-trofeu");
      const titulo = $("jja-trofeu-titulo");
      const msg = $("jja-trofeu-mensagem");
      const continuar = $("jja-trofeu-continuar");
      if (!modal || !continuar) {
        resolve();
        return;
      }

      titulo.textContent = competicao;
      const chamada = modal.querySelector(".jja-trofeu-chamada");
      if (chamada)
        chamada.textContent =
          tipoTrofeu === "individual" ? "PRÊMIO INDIVIDUAL" : "CAMPEÃO";
      msg.textContent =
        tipoTrofeu === "individual"
          ? "Parabéns! Seu desempenho na temporada garantiu este prêmio individual."
          : tipoTrofeu === "selecao"
            ? "Parabéns! Você defendeu sua seleção e trouxe mais esse título para casa!"
            : "Parabéns! Mais uma conquista inesquecível na sua carreira!";

      modal.hidden = false;
      continuar.focus();

      const fechar = () => {
        modal.hidden = true;
        continuar.removeEventListener("click", fechar);
        document.removeEventListener("keydown", aoTeclar);
        resolve();
      };
      const aoTeclar = (e) => {
        if (e.key === "Escape" || e.key === "Enter") {
          e.preventDefault();
          fechar();
        }
      };
      continuar.addEventListener("click", fechar);
      document.addEventListener("keydown", aoTeclar);
    });
  }

  async function exibirModalBolaDeOuro(ranking) {
    await aguardarCarregamentoLiberado();
    return new Promise((resolve) => {
      const possuiDados =
        (Array.isArray(ranking?.jogadores) && ranking.jogadores.length > 0) ||
        (Array.isArray(ranking?.chuteira) && ranking.chuteira.length > 0);
      if (!ranking || !possuiDados) {
        resolve();
        return;
      }

      const modal = $("jja-modal-bola-de-ouro");
      const mensagem = $("jja-bola-de-ouro-mensagem");
      const vitorias = $("jja-bola-de-ouro-vitorias");
      const lista = $("jja-bola-de-ouro-lista");
      const abaBola = $("jja-bola-de-ouro-aba-bola");
      const abaChuteira = $("jja-bola-de-ouro-aba-chuteira");
      const colunaPontos = $("jja-bola-de-ouro-coluna-pontos");
      const continuar = $("jja-bola-de-ouro-continuar");
      if (
        !modal ||
        !lista ||
        !abaBola ||
        !abaChuteira ||
        !colunaPontos ||
        !continuar
      ) {
        resolve();
        return;
      }

      let exibindoChuteira = false;
      const renderizarRanking = () => {
        const jogadores = exibindoChuteira
          ? ranking.chuteira || []
          : ranking.jogadores || [];
        const nomeVencedor = exibindoChuteira
          ? ranking.chuteiraVencedor?.nome || jogadores[0]?.nome
          : ranking.vencedor?.nome || jogadores[0]?.nome;

        abaBola.setAttribute("aria-pressed", String(!exibindoChuteira));
        abaChuteira.setAttribute("aria-pressed", String(exibindoChuteira));
        modal.setAttribute(
          "aria-labelledby",
          exibindoChuteira
            ? "jja-chuteira-de-ouro-titulo"
            : "jja-bola-de-ouro-titulo",
        );
        colunaPontos.textContent = exibindoChuteira ? "Gols pond." : "Pontos";

        if (exibindoChuteira) {
          if (!nomeVencedor) {
            mensagem.textContent =
              "A temporada terminou sem jogadores elegíveis à Chuteira de Ouro.";
          } else if (ranking.chuteiraPosicaoUsuario === 1) {
            mensagem.textContent =
              "Você venceu a Chuteira de Ouro nesta temporada.";
          } else if (ranking.chuteiraPosicaoUsuario > 0) {
            mensagem.textContent = `Você terminou em ${ranking.chuteiraPosicaoUsuario}º lugar. ${nomeVencedor} venceu a Chuteira de Ouro nesta temporada.`;
          } else {
            mensagem.textContent = `Você não marcou gols elegíveis à Chuteira de Ouro nesta temporada. ${nomeVencedor} venceu a premiação.`;
          }
          vitorias.hidden = ranking.totalVitoriasChuteira < 1;
          if (ranking.totalVitoriasChuteira > 0) {
            const vezes = ranking.totalVitoriasChuteira === 1 ? "vez" : "vezes";
            vitorias.textContent = `Chuteira de Ouro na carreira: ${ranking.totalVitoriasChuteira} ${vezes}`;
          }
        } else {
          if (ranking.venceuNestaTemporada) {
            mensagem.textContent =
              "Você venceu a Bola de Ouro nesta temporada.";
          } else if (ranking.posicaoUsuario > 0 && nomeVencedor) {
            const foraDoTop10 =
              ranking.posicaoUsuario > jogadores.length
                ? " e ficou fora do TOP 10"
                : "";
            mensagem.textContent = `Você terminou em ${ranking.posicaoUsuario}º lugar${foraDoTop10}. ${nomeVencedor} venceu a Bola de Ouro nesta temporada.`;
          } else if (ranking.posicaoUsuario === 0 && nomeVencedor) {
            mensagem.textContent = `Você não foi elegível à Bola de Ouro nesta temporada. ${nomeVencedor} venceu a premiação.`;
          } else {
            mensagem.textContent =
              "A temporada terminou sem indicações elegíveis à Bola de Ouro.";
          }
          vitorias.hidden = ranking.totalVitorias < 1;
          if (ranking.totalVitorias > 0) {
            const vezes = ranking.totalVitorias === 1 ? "vez" : "vezes";
            vitorias.textContent = `Bola de Ouro na carreira: ${ranking.totalVitorias} ${vezes}`;
          }
        }

        lista.replaceChildren();
        jogadores.forEach((jogador, indice) => {
          const item = document.createElement("li");
          const colocacao = document.createElement("span");
          const identidade = document.createElement("span");
          const nome = document.createElement("strong");
          const clube = document.createElement("small");
          const detalhesBotao = document.createElement("button");
          const pontos = document.createElement("strong");
          const detalhes = document.createElement("div");

          item.className = "jja-bola-de-ouro-linha";
          if (jogador.ehUsuario) item.classList.add("jja-bola-de-ouro-usuario");
          colocacao.className = "jja-bola-de-ouro-colocacao";
          identidade.className = "jja-bola-de-ouro-identidade";
          detalhesBotao.className = "jja-bola-de-ouro-detalhes-botao";
          pontos.className = "jja-bola-de-ouro-pontos";
          detalhes.className = "jja-bola-de-ouro-detalhes";
          detalhes.hidden = true;
          colocacao.textContent = `${indice + 1}º`;
          colocacao.setAttribute("aria-label", `${indice + 1}º lugar`);
          nome.textContent = jogador.nome;
          clube.textContent = `${jogador.clube} · ${jogador.posicao}`;
          detalhesBotao.type = "button";
          detalhesBotao.textContent = "+";
          detalhesBotao.setAttribute("aria-expanded", "false");
          detalhesBotao.setAttribute(
            "aria-label",
            `Exibir detalhes de ${jogador.nome}`,
          );
          pontos.textContent = exibindoChuteira
            ? Math.round(Number(jogador.golsPonderados) || 0).toLocaleString(
                "pt-BR",
              )
            : Number(jogador.pontuacao).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
          const adicionarDetalhe = (rotulo, valores) => {
            const grupo = document.createElement("div");
            const titulo = document.createElement("strong");
            const conteudo = document.createElement("span");
            grupo.className = "jja-bola-de-ouro-detalhes-grupo";
            titulo.textContent = rotulo;
            conteudo.textContent = valores.length
              ? valores.join(" · ")
              : "Nenhum registrado";
            grupo.append(titulo, conteudo);
            detalhes.append(grupo);
          };
          const formatarNota = (nota) =>
            Number(nota || 0).toLocaleString("pt-BR", {
              maximumFractionDigits: 1,
            });
          if (exibindoChuteira) {
            adicionarDetalhe("Gols ponderados (arredondados)", [
              `${Math.round(Number(jogador.golsPonderados) || 0)} gols`,
            ]);
            adicionarDetalhe("Gols reais", [
              `${Number(jogador.gols) || 0} gols`,
            ]);
            adicionarDetalhe("Partidas/Jogos", [
              `${Number(jogador.jogos) || 0} partidas`,
            ]);
          } else {
            adicionarDetalhe("Desempenho", [
              `${Number(jogador.gols) || 0} gols`,
              `${Number(jogador.assistencias) || 0} assistências`,
              `${Number(jogador.jogos) || 0} jogos disputados`,
            ]);
            adicionarDetalhe(
              "Campanha Coletiva",
              jogador.campanhasColetivas || [],
            );
            adicionarDetalhe(
              "Títulos individuais",
              jogador.titulosIndividuais || [],
            );
            adicionarDetalhe("Ações da posição", [
              `${jogador.desarmes || 0} desarmes`,
              `${jogador.defesas || 0} defesas`,
              `${jogador.jogosSemSofrer || 0} jogos sem sofrer gols`,
            ]);
            adicionarDetalhe("Pontuação por Pilar", [
              `Individual (75%): ${formatarNota(jogador.notaIndividual)}`,
              `Coletivo (15%): ${formatarNota(jogador.notaColetiva)}`,
              `Participação (10%): ${formatarNota(jogador.notaParticipacao)}`,
            ]);
          }
          detalhesBotao.addEventListener("click", () => {
            const expandido =
              detalhesBotao.getAttribute("aria-expanded") === "true";
            detalhesBotao.setAttribute("aria-expanded", String(!expandido));
            detalhesBotao.setAttribute(
              "aria-label",
              `${expandido ? "Exibir" : "Ocultar"} detalhes de ${jogador.nome}`,
            );
            detalhesBotao.textContent = expandido ? "+" : "−";
            detalhes.hidden = expandido;
          });

          identidade.append(nome, clube);
          item.append(colocacao, identidade, detalhesBotao, pontos, detalhes);
          lista.append(item);
        });
      };
      renderizarRanking();

      const exibirBolaDeOuro = () => {
        exibindoChuteira = false;
        renderizarRanking();
      };
      const exibirChuteiraDeOuro = () => {
        exibindoChuteira = true;
        renderizarRanking();
      };
      abaBola.addEventListener("click", exibirBolaDeOuro);
      abaChuteira.addEventListener("click", exibirChuteiraDeOuro);

      modal.hidden = false;
      continuar.focus();

      const fechar = () => {
        modal.hidden = true;
        abaBola.removeEventListener("click", exibirBolaDeOuro);
        abaChuteira.removeEventListener("click", exibirChuteiraDeOuro);
        continuar.removeEventListener("click", fechar);
        document.removeEventListener("keydown", aoTeclar);
        resolve();
      };
      const aoTeclar = (evento) => {
        if (
          evento.key === "Escape" ||
          (evento.key === "Enter" && evento.target === continuar)
        ) {
          evento.preventDefault();
          fechar();
        }
      };
      continuar.addEventListener("click", fechar);
      document.addEventListener("keydown", aoTeclar);
    });
  }

  async function exibirModalEvento(tipoEvento, mensagem, icone) {
    await aguardarCarregamentoLiberado();
    return new Promise((resolve) => {
      const modal = $("jja-modal-evento");
      const iconeEl = $("jja-evento-icone");
      const titulo = $("jja-evento-titulo");
      const msg = $("jja-evento-mensagem");
      const continuar = $("jja-evento-continuar");
      if (!modal || !continuar) {
        resolve();
        return;
      }

      const mapa = {
        "hat-trick": { icone: "🎩", titulo: "Hat-trick!", cor: "gol" },
        "cartao-amarelo": {
          icone: "🟨",
          titulo: "Cartão amarelo",
          cor: "amarelo",
        },
        "cartao-vermelho": {
          icone: "🟥",
          titulo: "Cartão vermelho",
          cor: "vermelho",
        },
        "suspensao-amarelos": {
          icone: "🟨",
          titulo: "Suspensão",
          cor: "amarelo",
        },
        lesao: { icone: "🩹", titulo: "Lesão leve", cor: "lesao" },
        "lesao-moderada": {
          icone: "🤕",
          titulo: "Lesão moderada",
          cor: "lesao",
        },
        "lesao-grave": { icone: "🏥", titulo: "Lesão grave", cor: "lesao" },
        "lesao-carreira": {
          icone: "💔",
          titulo: "Lesão gravíssima",
          cor: "lesao",
        },
      }[tipoEvento] || { icone: icone || "⚡", titulo: "Evento", cor: "" };

      if (iconeEl) iconeEl.textContent = mapa.icone;
      titulo.textContent = mapa.titulo;
      msg.textContent = mensagem;
      modal.dataset.cor = mapa.cor;

      modal.hidden = false;
      continuar.focus();

      const fechar = () => {
        modal.hidden = true;
        continuar.removeEventListener("click", fechar);
        document.removeEventListener("keydown", aoTeclar);
        modal.removeEventListener("click", aoClicarFora);
        resolve();
      };
      const aoTeclar = (e) => {
        if (e.key === "Escape" || e.key === "Enter") {
          e.preventDefault();
          fechar();
        }
      };
      const aoClicarFora = (e) => {
        if (e.target === modal) fechar();
      };
      continuar.addEventListener("click", fechar);
      document.addEventListener("keydown", aoTeclar);
      modal.addEventListener("click", aoClicarFora);
    });
  }

  async function exibirModalUltimaPartida() {
    await aguardarCarregamentoLiberado();
    return new Promise((resolve) => {
      const modal = $("jja-modal-ultima-partida");
      const continuar = $("jja-ultima-partida-continuar");
      if (!modal || !continuar) {
        resolve();
        return;
      }

      modal.hidden = false;
      continuar.focus();

      const fechar = () => {
        modal.hidden = true;
        continuar.removeEventListener("click", fechar);
        document.removeEventListener("keydown", aoTeclar);
        modal.removeEventListener("click", aoClicarFora);
        resolve();
      };
      const aoTeclar = (evento) => {
        if (evento.key === "Escape" || evento.key === "Enter") {
          evento.preventDefault();
          fechar();
        }
      };
      const aoClicarFora = (evento) => {
        if (evento.target === modal) fechar();
      };
      continuar.addEventListener("click", fechar);
      document.addEventListener("keydown", aoTeclar);
      modal.addEventListener("click", aoClicarFora);
    });
  }

  function escapar(texto) {
    return String(texto ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  async function processarFilaModaisTitulos() {
    const tiposPermitidos = new Set([
      "trofeu",
      "premio-individual",
      "bola-de-ouro",
      "resumo-temporada",
    ]);
    filaModaisPartida = filaModaisPartida.filter((item) =>
      tiposPermitidos.has(item.tipo),
    );
    if (filaModaisPartida.length > 0) {
      await processarFilaModais();
    }
  }
  function sortearPoisson(lambda) {
    const limite = Math.exp(-Math.max(0, lambda));
    let p = 1,
      k = 0;
    do {
      k++;
      p *= Math.random();
    } while (p > limite && k < 12);
    return k - 1;
  }
  function clubesDisponiveis() {
    if (clubesDisponiveisCache) return clubesDisponiveisCache;
    const clubes = [
      ...(typeof CLUBES !== "undefined" ? CLUBES : []),
      ...(typeof CLUBES_BASE !== "undefined" ? CLUBES_BASE : []),
    ];
    clubesDisponiveisCache = [
      ...new Map(
        clubes
          .filter((c) => c && c.id && c.nome && c.liga)
          .map((c) => [c.id, c]),
      ).values(),
    ];
    return clubesDisponiveisCache;
  }

  function forcaClube(clube) {
    if (!clube?.id) return 65;
    const cfg = typeof getConfig === "function" ? getConfig() : {};
    const forcaConfig = Number(cfg.clubes?.potencias?.[clube.id]);
    const chave = `${clube.id}:${Number.isFinite(forcaConfig) ? forcaConfig : "regional"}`;
    if (forcasClubesCache.has(chave)) return forcasClubesCache.get(chave);
    let forca;
    if (Number.isFinite(forcaConfig) && forcaConfig > 0) {
      forca = Math.max(35, Math.min(99, forcaConfig));
    } else if (
      typeof FORCAS_CLUBES_REGIONAIS !== "undefined" &&
      FORCAS_CLUBES_REGIONAIS[clube.id]
    ) {
      forca = Math.max(35, Math.min(99, FORCAS_CLUBES_REGIONAIS[clube.id]));
    } else {
      forca = 65;
    }
    forcasClubesCache.set(chave, forca);
    return forca;
  }

  /**
   * Gera N rodadas de uma fase liga usando o método do círculo (round-robin).
   * n = 36 → 35 rodadas possíveis, pegamos apenas as 8 primeiras.
   * Cada time enfrenta 8 adversários diferentes.
   */
  function gerarAgendaFaseLiga(teamIds, numRounds) {
    const ids = [...teamIds];
    if (ids.length % 2 !== 0) ids.push(null); // bye
    const n = ids.length;
    if (n < 2) return [];

    const agenda = [];
    const fixed = ids[0];
    const rotation = ids.slice(1);

    for (let r = 0; r < numRounds; r++) {
      const current = [fixed, ...rotation];
      const roundGames = [];
      for (let i = 0; i < n / 2; i++) {
        const casaId = current[i];
        const foraId = current[n - 1 - i];
        if (casaId == null || foraId == null) continue;
        if ((r + i) % 2 === 0) roundGames.push({ casaId, foraId });
        else roundGames.push({ casaId: foraId, foraId: casaId });
      }
      agenda.push(roundGames);
      rotation.unshift(rotation.pop());
    }
    return agenda;
  }

  function calcularTabelaContinental(torneioId, timeIds) {
    const chaveCache = JSON.stringify([torneioId, timeIds]);
    const tabelaEmCache = cacheTabelasContinentais.get(chaveCache);
    if (tabelaEmCache?.versao === versaoResultados) {
      return tabelaEmCache.tabela.map((time) => ({ ...time }));
    }

    const tabela = timeIds.map((id) => ({
      id,
      nome: obterClube(id)?.nome || "Clube",
      pts: 0,
      pj: 0,
      v: 0,
      e: 0,
      d: 0,
      gm: 0,
      gc: 0,
      sg: 0,
    }));

    const tabelaPorId = new Map(tabela.map((time) => [time.id, time]));
    for (const jogo of estado.partidas) {
      if (
        jogo.torneioId !== torneioId ||
        (jogo.tipo !== "grupo" && jogo.tipo !== "grupo-ia") ||
        jogo.status !== "concluida"
      )
        continue;
      const casaId =
        jogo.tipo === "grupo"
          ? jogo.casa
            ? estado.clubeId
            : jogo.adversarioId
          : jogo.casaId;
      const foraId =
        jogo.tipo === "grupo"
          ? jogo.casa
            ? jogo.adversarioId
            : estado.clubeId
          : jogo.foraId;
      const golsCasa = jogo.golsCasa || 0;
      const golsFora = jogo.golsFora || 0;
      const casa = tabelaPorId.get(casaId);
      const fora = tabelaPorId.get(foraId);
      if (!casa || !fora) continue;

      casa.pj++;
      fora.pj++;
      casa.gm += golsCasa;
      casa.gc += golsFora;
      fora.gm += golsFora;
      fora.gc += golsCasa;

      if (golsCasa > golsFora) {
        casa.pts += 3;
        casa.v++;
        fora.d++;
      } else if (golsFora > golsCasa) {
        fora.pts += 3;
        fora.v++;
        casa.d++;
      } else {
        casa.pts += 1;
        fora.pts += 1;
        casa.e++;
        fora.e++;
      }
    }

    tabela.forEach((t) => (t.sg = t.gm - t.gc));
    tabela.sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.gm - a.gm);
    cacheTabelasContinentais.set(chaveCache, {
      versao: versaoResultados,
      tabela,
    });
    return tabela.map((time) => ({ ...time }));
  }

  function renderizarTabelaContinental(torneioId, timeIds) {
    const tabela = calcularTabelaContinental(torneioId, timeIds);
    const ehCopinha = estado.partidas.some(
      (partida) =>
        partida.torneioId === torneioId && partida.competicao === "Copinha",
    );
    const nomeGrupoCopinha = ehCopinha
      ? Object.entries(estado.copinha?.grupos || {}).find(
          ([, ids]) =>
            ids.length === timeIds.length &&
            ids.every((id) => timeIds.includes(id)),
        )?.[0]
      : "";
    const conf =
      CONTINENTAL_CONFS[
        Object.keys(CONTINENTAL_CONFS).find((c) =>
          estado.partidas.some(
            (p) => p.torneioId === torneioId && p.competicao === c,
          ),
        )
      ] || {};
    const cutoff = ehCopinha
      ? 2
      : conf.formato === "fase-liga"
        ? conf.classificadosParaKnockout
        : conf.classificadosPorGrupo;

    return `${ehCopinha ? `<p class="jja-grupo-resumo"><strong>Grupo ${escapar(nomeGrupoCopinha || "")}</strong> · Os dois primeiros avançam às quartas de final.</p>` : ""}
        <div class="jja-tabela-grupo-container">
            <table class="jja-tabela jja-tabela-grupo">
                <thead><tr>
                    <th>#</th><th>Clube</th><th>Pts</th><th>J</th>
                    <th class="hide-mobile">VIT</th><th class="hide-mobile">E</th>
                    <th class="hide-mobile">DER</th><th class="hide-mobile">GM</th>
                    <th class="hide-mobile">GC</th><th>SG</th>
                </tr></thead>
                <tbody>
                    ${tabela
                      .map((t, i) => {
                        const qualificado = cutoff && i < cutoff;
                        return `<tr class="${t.id === estado.clubeId ? "meu-clube" : ""} ${qualificado ? "qualificado" : ""}">
                            <td>${i + 1}</td>
                            <td class="jja-clube-celula">${htmlEscudoClube(clubesDisponiveis().find((clube) => clube.id === t.id) || { id: t.id, nome: t.nome, liga: estado.liga }, "pequeno")}${escapar(t.nome)}</td>
                            <td><strong>${t.pts}</strong></td>
                            <td>${t.pj}</td>
                            <td class="hide-mobile">${t.v}</td>
                            <td class="hide-mobile">${t.e}</td>
                            <td class="hide-mobile">${t.d}</td>
                            <td class="hide-mobile">${t.gm}</td>
                            <td class="hide-mobile">${t.gc}</td>
                            <td>${t.sg > 0 ? "+" : ""}${t.sg}</td>
                        </tr>`;
                      })
                      .join("")}
                </tbody>
            </table>
        </div>`;
  }

  function disponibilidadeInicial(jogosLesao = 0) {
    return {
      jogosLesao: Math.max(0, Math.floor(Number(jogosLesao) || 0)),
      suspensoes: { clube: 0, selecao: 0 },
      amarelos: { clube: 0, selecao: 0 },
      lesaoCarreira: false,
    };
  }
  function desempenhoPosicionalInicial() {
    return {
      jogos: 0,
      vitorias: 0,
      jogosSemSofrer: 0,
      gols: 0,
      assistencias: 0,
      acoes: {},
    };
  }
  function registrarAcaoPosicional(opcao, sucesso) {
    const desempenho = (estado.desempenhoPosicional ||=
      desempenhoPosicionalInicial());
    const acao = (desempenho.acoes[opcao.tipo] ||= {
      tentativas: 0,
      sucessos: 0,
    });
    acao.tentativas++;
    if (sucesso) acao.sucessos++;
  }
  function calcularDesempenhoPosicional(
    posicao,
    desempenho,
    estatisticas = {},
  ) {
    const jogos = Math.max(1, Number(desempenho.jogos) || 0);
    const porJogo = (tipo) =>
      (Number(desempenho.acoes?.[tipo]?.sucessos) || 0) / jogos;
    const gols = (Number(desempenho.gols) || 0) / jogos;
    const assistencias = (Number(desempenho.assistencias) || 0) / jogos;
    const desarmes = (Number(estatisticas.desarmes) || 0) / jogos;
    const defesas = (Number(estatisticas.defesas) || 0) / jogos;
    const vitorias = (Number(desempenho.vitorias) || 0) / jogos;
    const jogosSemSofrer = (Number(desempenho.jogosSemSofrer) || 0) / jogos;
    const categoria = ["PE", "CA", "PD"].includes(posicao)
      ? "ata"
      : ["ME", "MC", "MD"].includes(posicao)
        ? "me"
        : posicao === "GOL"
          ? "go"
          : "zag";
    const pontuacao =
      categoria === "go"
        ? defesas * 0.45 +
          jogosSemSofrer * 0.55 +
          porJogo("reposicao") * 0.25 +
          assistencias * 0.35 +
          vitorias * 0.18
        : categoria === "zag"
          ? desarmes * 0.35 +
            jogosSemSofrer * 0.45 +
            porJogo("passe") * 0.3 +
            (gols + assistencias) * 0.3 +
            vitorias * 0.18
          : categoria === "me"
            ? porJogo("passe") * 0.75 +
              porJogo("drible") * 0.45 +
              desarmes * 0.3 +
              assistencias * 0.55 +
              gols * 0.25 +
              vitorias * 0.18
            : gols * 0.7 +
              assistencias * 0.55 +
              desarmes * 0.2 +
              porJogo("drible") * 0.65 +
              porJogo("passe") * 0.25 +
              vitorias * 0.18;
    return { categoria, pontuacao };
  }
  function aplicarDesempenhoPosicional(temporada) {
    const desempenho =
      estado.desempenhoPosicional || desempenhoPosicionalInicial();
    const { categoria, pontuacao } = calcularDesempenhoPosicional(
      estado.posicao,
      desempenho,
      estado.estatisticas,
    );
    const aumento = pontuacao >= 1.2 ? 2 : pontuacao >= 0.45 ? 1 : 0;
    const atributosPrincipais = {
      go: ["reflexos", "fisico", "defesa", "passe"],
      zag: ["defesa", "fisico", "velocidade", "passe"],
      me: ["passe", "drible", "finalizacao", "velocidade", "defesa", "fisico"],
      ata: ["finalizacao", "drible", "velocidade", "passe", "fisico"],
    }[categoria];
    const atributos = { ...(estado.atributos || temporada.atributos || {}) };
    const carreira =
      typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
    atributosPrincipais.forEach((chave) => {
      let teto = 99;
      if (
        typeof obterModificadorPotencial === "function" &&
        Number(carreira.potencial) > 0
      ) {
        teto = Math.min(
          99,
          Math.round(
            carreira.potencial * obterModificadorPotencial(chave, categoria),
          ),
        );
      }
      atributos[chave] = Math.min(
        teto,
        (Number(atributos[chave]) || 1) + aumento,
      );
    });
    const overallBase =
      typeof calcularOverall === "function" && estado.atributos
        ? calcularOverall(categoria, estado.atributos)
        : Number(estado.overall) || Number(temporada.overall) || 0;
    const overall =
      typeof calcularOverall === "function"
        ? calcularOverall(categoria, atributos)
        : overallBase;
    estado.atributos = atributos;
    estado.overall = overall;
    estado.desempenhoPosicional = desempenho;
    temporada.atributos = atributos;
    temporada.overall = overall;
    return { pontuacao, overallBase, overall };
  }
  function obterHistoricoCarreira(carreira) {
    const historico = typeof lerHistorico === "function" ? lerHistorico() : [];
    return historico.filter(
      (t) => String(t.carreiraId) === String(carreira.id),
    );
  }

  function atualizarResumoCarreira(carreira, historico, temporada) {
    const resumo = {
      ...(carreira.resumoEstatisticas ||
        (typeof somarTotaisHistorico === "function"
          ? somarTotaisHistorico(historico)
          : {})),
    };
    const valoresTemporada = {
      jogos: temporada.jogos,
      gols: temporada.gols,
      assistencias: temporada.assistencias,
      jogosClube: temporada.jogosClube ?? temporada.jogos,
      golsClube: temporada.golsClube ?? temporada.gols,
      assistenciasClube: temporada.assistenciasClube ?? temporada.assistencias,
      jogosSelecao: temporada.jogosSelecao,
      golsSelecao: temporada.golsSelecao,
      assistenciasSelecao: temporada.assistenciasSelecao,
      caps: temporada.jogosSelecao,
      motm: temporada.motm,
      cartaoAmarelo: temporada.cartaoAmarelo,
      cartaoVermelho: temporada.cartaoVermelho,
      cleanSheets: temporada.cleanSheets,
      penaltisDefendidos: temporada.penaltisDefendidos,
      penaltisCometidos: temporada.penaltisCometidos,
      minutosJogados: temporada.minutosJogados,
      driblesCompletos: temporada.driblesCompletos,
      desarmes: temporada.desarmes,
      defesas: temporada.defesas,
      jogadasCriadas: temporada.jogadasCriadas,
      premios:
        typeof contarPremios === "function"
          ? contarPremios(temporada)
          : (temporada.trofeusColetivos || []).length +
            (temporada.trofeusIndividuais || []).length,
    };
    Object.entries(valoresTemporada).forEach(([campo, valor]) => {
      resumo[campo] = (Number(resumo[campo]) || 0) + (Number(valor) || 0);
    });
    carreira.resumoEstatisticas = resumo;

    const porClube = carreira.estatisticasPorClube || {};
    if (!carreira.estatisticasPorClube) {
      historico.forEach((item) => {
        if (!item.clube) return;
        const dados = (porClube[item.clube] ||= {
          jogos: 0,
          gols: 0,
          assistencias: 0,
        });
        dados.jogos += Number(item.jogosClube ?? item.jogos) || 0;
        dados.gols += Number(item.golsClube ?? item.gols) || 0;
        dados.assistencias +=
          Number(item.assistenciasClube ?? item.assistencias) || 0;
      });
    }
    if (temporada.clube) {
      const dados = (porClube[temporada.clube] ||= {
        jogos: 0,
        gols: 0,
        assistencias: 0,
      });
      dados.jogos += Number(temporada.jogosClube ?? temporada.jogos) || 0;
      dados.gols += Number(temporada.golsClube ?? temporada.gols) || 0;
      dados.assistencias +=
        Number(temporada.assistenciasClube ?? temporada.assistencias) || 0;
    }
    carreira.estatisticasPorClube = porClube;
  }

  function carreiraEncerrada(carreira, historico) {
    if (!historico.length) return false;
    const ultimaTemporada = historico[historico.length - 1];
    const idadeLimite =
      Number(carreira.idadeLimite) || Number(ultimaTemporada.idadeLimite) || 40;
    const constaNoRanking =
      typeof lerRanking === "function" &&
      lerRanking().some(
        (registro) => String(registro.id) === String(carreira.id),
      );
    return (
      !!carreira.aposentadoriaVoluntaria ||
      !!ultimaTemporada.lesaoCarreira ||
      Number(ultimaTemporada.idade) >= idadeLimite ||
      constaNoRanking
    );
  }

  function limitarAnoInicial(ano, fallback = 2026) {
    const numero = Number(ano);
    const anoValido =
      Number.isFinite(numero) && numero !== 0 ? numero : fallback;
    return Math.min(2050, Math.max(2000, Math.floor(anoValido)));
  }

  function atualizarCampoAnoInicial(carreira, historico) {
    const campo = $("ano-inicial-carreira");
    if (!campo) return;
    const temporadas = Array.isArray(historico) ? historico : [];
    const progressoAtivo =
      estado && String(estado.carreiraId) === String(carreira?.id);
    const carreiraAtiva =
      !carreiraEncerrada(carreira || {}, temporadas) &&
      (temporadas.length > 0 || progressoAtivo);
    if (carreiraAtiva) {
      const anoSalvo =
        Number(carreira?.anoInicial) ||
        Number(temporadas[0]?.ano) ||
        Number(estado?.ano);
      if (anoSalvo) campo.value = String(limitarAnoInicial(anoSalvo));
    }
    campo.disabled = carreiraAtiva;
  }

  function temporadaEmAndamento(carreira) {
    return (
      !!estado &&
      String(estado.carreiraId) === String(carreira.id) &&
      !estado.salvaOficialmente &&
      estado.partidas.some(
        (partida) => partida.status === "agendada" && !ehPartidaDeIA(partida),
      )
    );
  }

  function ehPartidaDeIA(partida) {
    return partida?.tipo === "grupo-ia" || partida?.tipo === "selecao-grupo-ia";
  }

  function sortearEstatisticasJogador(
    partida,
    meuClube,
    golsCasa,
    golsFora,
    participacaoForcada = null,
  ) {
    const pos = String(estado.posicao || "CA").toUpperCase();
    const forcaTime = forcaClube(meuClube);
    // O titular depende do nível do jogador em relação ao clube, não só do overall isolado.
    const relacaoTreinador = Number(estado.relacaoTreinador ?? 60);
    const fatorRelacaoTreinador = relacaoTreinador < 20 ? 0.78 : relacaoTreinador < 35 ? 0.86 : relacaoTreinador < 50 ? 0.93 : 1;
    const chanceJogar = Math.max(
      0.68,
      Math.min(0.99, (0.9 + (estado.overall - forcaTime) * 0.006) * fatorRelacaoTreinador),
    );
    const participou =
      participacaoForcada === null
        ? Math.random() < chanceJogar
        : participacaoForcada;
    if (!participou)
      return {
        participou: false,
        gols: 0,
        assistencias: 0,
        amarelo: 0,
        vermelho: 0,
      };
    const golsEquipe = partida.casa ? golsCasa : golsFora;
    const rel = Math.max(
      0.65,
      Math.min(1.55, 0.82 + (estado.overall - forcaTime) * 0.018),
    );
    const atacante = ["PE", "CA", "PD"].includes(pos);
    const meia = ["ME", "MC", "MD"].includes(pos);
    // A taxa por partida mantém a produção compatível com o calendário de cada competição.
    const baseGol =
      pos === "CA"
        ? 1.08
        : ["PE", "PD"].includes(pos)
          ? 0.78
          : ["ME", "MC", "MD"].includes(pos)
            ? 0.32
            : pos === "GOL"
              ? 0.001
              : 0.09;
    const gols = sortearPoisson(baseGol * rel);
    const baseAssist = ["ME", "MC", "MD"].includes(pos)
      ? 0.58
      : ["PE", "PD"].includes(pos)
        ? 0.48
        : pos === "CA"
          ? 0.32
          : pos === "GOL"
            ? 0.001
            : 0.2;
    const assistencias = sortearPoisson(baseAssist * rel);
    const cfg = typeof getConfig === "function" ? getConfig() : {};
    const cartoes = cfg.cartoes || {};
    const categoria = ["PE", "CA", "PD"].includes(pos)
      ? "Atacante"
      : ["ME", "MC", "MD"].includes(pos)
        ? "Meia"
        : ["GOL"].includes(pos)
          ? "Goleiro"
          : "Zagueiro";
    const fatorPosicao = Math.max(0, Number(cartoes[`fator${categoria}`] ?? 1));
    const amareloBase = Math.max(0, Number(cartoes.chanceAmareloBase ?? 0.08));
    const vermelhoBase = Math.max(
      0,
      Number(cartoes.chanceVermelhoBase ?? 0.004),
    );
    const segundoAmarelo = Math.max(
      0,
      Math.min(1, Number(cartoes.chanceDoisAmarelosMesmoJogo ?? 0.02)),
    );
    const recebeuAmarelo = Math.random() < amareloBase * fatorPosicao;
    const segundo = recebeuAmarelo && Math.random() < segundoAmarelo;
    const amarelo = (recebeuAmarelo ? 1 : 0) + (segundo ? 1 : 0);
    const vermelhoDireto = !segundo && Math.random() < vermelhoBase;
    const vermelho = segundo || vermelhoDireto ? 1 : 0;
    const motmChance = Math.min(
      0.78,
      0.025 +
        gols * 0.22 +
        assistencias * 0.14 +
        (pos === "GOL" && golsEquipe === 0 ? 0.14 : 0),
    );
    const motm = Math.random() < motmChance;
    return {
      participou: true,
      gols,
      assistencias,
      amarelo,
      vermelho,
      vermelhoDireto,
      motm,
    };
  }

  /* ============================================================
       DISPUTA DE PÊNALTIS
       ------------------------------------------------------------
       - Resolve empates em mata-mata (substitui o sorteio aleatório).
       - Cada cobrança é simulada individualmente e pode ser reproduzida
         pela animação em animations.css.
       - O jogador participa da primeira cobrança quando está em campo
         (ou da primeira defesa, se for goleiro).
       - Pênaltis NÃO entram nas estatísticas normais (gols, assist.).
       ============================================================ */

  function obterChancePenaltiAproveitamento(forcaTime) {
    // 72% base, ajusta ±10% pela força do time (força 35..99).
    const forca = Math.max(35, Math.min(99, Number(forcaTime) || 65));
    return Math.max(0.58, Math.min(0.86, 0.72 + (forca - 65) * 0.0035));
  }

  function simularCobrancaPenalti(timeForca) {
    return Math.random() < obterChancePenaltiAproveitamento(timeForca);
  }

  function obterLancePenaltiInicial(ehGoleiro) {
    if (ehGoleiro) {
      return {
        titulo: "Pênalti defendido",
        contexto:
          "O árbitro marca pênalti. Você precisa escolher o lado e a forma de defender.",
        opcoes: [
          {
            texto: "Defender para a esquerda",
            chance: 0.66,
            direcao: "esquerda",
            tipo: "penalti-defesa",
            atributo: "reflexos",
          },
          {
            texto: "Defender para a direita",
            chance: 0.66,
            direcao: "direita",
            tipo: "penalti-defesa",
            atributo: "reflexos",
          },
          {
            texto: "Esperar o chute e fechar o ângulo",
            chance: 0.62,
            direcao: "centro",
            tipo: "penalti-defesa",
            atributo: "reflexos",
          },
        ],
      };
    }
    const ladoChute = ["esquerda", "direita", "meio"][
      Math.floor(Math.random() * 3)
    ];
    const ladoOposto = ladoChute === "esquerda" ? "direita" : "esquerda";
    return {
      titulo: "Pênalti para decidir",
      contexto: "Você é chamado para cobrar um pênalti. Qual escolha faz?",
      opcoes: [
        {
          texto: `Chutar para a ${ladoChute}`,
          chance: 0.72,
          direcao: ladoChute,
          tipo: "penalti",
          atributo: "finalizacao",
        },
        {
          texto: "Mandar no centro do gol",
          chance: 0.68,
          direcao: "meio",
          tipo: "penalti",
          atributo: "finalizacao",
        },
        {
          texto: `Tentar um chute rasteiro para a ${ladoOposto}`,
          chance: 0.62,
          direcao: ladoOposto,
          tipo: "penalti",
          atributo: "finalizacao",
        },
      ],
    };
  }

  function calcularResultadoCobrancaJogador(opcao) {
    const atributo =
      Number(estado.atributos?.[opcao.atributo]) ||
      Number(estado.overall) ||
      50;
    const chance = Math.max(
      0.2,
      Math.min(
        0.92,
        opcao.chance +
          (Number(estado.overall) - 70) * 0.003 +
          (atributo - 60) * 0.004,
      ),
    );

    if (opcao.tipo === "penalti") {
      const lado = String(opcao.direcao || "meio").toLowerCase();
      const variacao = { esquerda: 0.08, meio: 0.0, direita: -0.08 }[lado] || 0;
      const chancePenalti = Math.max(0.42, Math.min(0.9, chance + variacao));
      const converteu = Math.random() < chancePenalti;
      return {
        gol: converteu,
        mensagem: converteu
          ? lado === "meio"
            ? "Pênalti convertido no meio do gol! Você marcou com categoria."
            : `Pênalti convertido para o ${lado}! O goleiro não conseguiu chegar.`
          : lado === "meio"
            ? "O goleiro adivinhou e defendeu o pênalti no centro."
            : `O goleiro chegou no lado ${lado} e falhou a sua escolha.`,
      };
    }

    if (opcao.tipo === "penalti-defesa") {
      const lado = ["esquerdo", "direito", "centro"][
        Math.floor(Math.random() * 3)
      ];
      const defesa =
        Math.random() < Math.max(0.46, Math.min(0.88, chance + 0.12));
      return {
        gol: !defesa,
        defendeu: defesa,
        mensagem: defesa
          ? `Defesa! Você antecipou a direção ${lado} e segurou o pênalti.`
          : `O atacante marcou para o ${lado}. Você não conseguiu impedir a cobrança.`,
      };
    }

    return { gol: false, mensagem: "Cobrança não realizada." };
  }

  function montarPlacarCobrancas(cobrancas) {
    let golsCasa = 0,
      golsFora = 0;
    cobrancas.forEach((cobranca) => {
      if (!cobranca.gol) return;
      if (cobranca.time === "casa") golsCasa++;
      else golsFora++;
    });
    return { golsCasa, golsFora };
  }

  /**
   * Simula a disputa de pênaltis.
   * - partida.casa define quem é "meu" time (casa ou fora).
   * - Cobranças alternam; começa pelo time do jogador se for de linha,
   *   ou pelo adversário se o jogador for goleiro (assim o jogador participa
   *   da primeira defesa).
   * - "primeiroGolJogador" pode ser pré-computado (via modal).
   * - Se "primeiroGolJogador" for undefined, a cobrança do jogador é auto.
   */
  function simularDisputaPenaltis(partida, meuTime, adversario, opcoes = {}) {
    const euSouCasa = !!partida.casa;
    const meuLado = euSouCasa ? "casa" : "fora";
    const advLado = euSouCasa ? "fora" : "casa";
    const forcaMeu = forcaClube(meuTime);
    const forcaAdv = forcaClube(adversario);

    const ehGoleiro =
      String(estado.posicao || "").toUpperCase() === "GOL" ||
      (typeof chavePosicaoCampo === "function" &&
        chavePosicaoCampo(estado.posicao) === "GOL");
    const jogadorParticipa = opcoes.jogadorParticipa !== false;
    const primeiroGol =
      typeof opcoes.primeiroGolJogador === "boolean"
        ? opcoes.primeiroGolJogador
        : null;

    const cobrancas = [];
    let golsCasa = 0,
      golsFora = 0;
    let playerShotFeito = false;

    // Decide quem começa:
    // - jogador de linha: meu time bate primeiro.
    // - goleiro: adversário bate primeiro (jogador defende a 1ª).
    let vezDoMeuLado = !ehGoleiro;

    const registrar = (time, gol, jogador = false) => {
      cobrancas.push({ time, gol, jogador });
      if (gol) {
        if (time === "casa") golsCasa++;
        else golsFora++;
      }
    };

    const simularCobranca = (time) => {
      const ladoMeu = time === meuLado;
      // Se for a vez do jogador (batedor de linha) e é a primeira cobrança dele:
      if (
        !ehGoleiro &&
        ladoMeu &&
        !playerShotFeito &&
        jogadorParticipa &&
        primeiroGol !== null
      ) {
        playerShotFeito = true;
        registrar(time, primeiroGol, true);
        return;
      }
      // Se for a vez do adversário e o jogador é goleiro (defende a 1ª):
      if (
        ehGoleiro &&
        !ladoMeu &&
        !playerShotFeito &&
        jogadorParticipa &&
        primeiroGol !== null
      ) {
        playerShotFeito = true;
        // Para goleiro, "primeiroGol = true" significa que o jogador SOFREU o gol.
        registrar(time, primeiroGol, true);
        return;
      }
      registrar(
        time,
        simularCobrancaPenalti(ladoMeu ? forcaMeu : forcaAdv),
        false,
      );
    };

    // 5 rodadas padrão
    for (let rodada = 0; rodada < 5; rodada++) {
      // Cobrança 1 da rodada
      simularCobranca(vezDoMeuLado ? meuLado : advLado);
      // Verifica encerramento antecipado após cada cobrança (a partir da 3ª rodada)
      if (rodada >= 2) {
        const cobrancasRestantesMeu = 5 - rodada - (vezDoMeuLado ? 0 : 1);
        const cobrancasRestantesAdv = 5 - rodada - (vezDoMeuLado ? 1 : 0);
        const golsMeu = meuLado === "casa" ? golsCasa : golsFora;
        const golsAdv = meuLado === "casa" ? golsFora : golsCasa;
        if (golsMeu > golsAdv + cobrancasRestantesAdv) {
          return finalizarDisputa(cobrancas, golsCasa, golsFora, meuLado);
        }
        if (golsAdv > golsMeu + cobrancasRestantesMeu) {
          return finalizarDisputa(cobrancas, golsCasa, golsFora, meuLado);
        }
      }
      vezDoMeuLado = !vezDoMeuLado;

      // Cobrança 2 da rodada
      simularCobranca(vezDoMeuLado ? meuLado : advLado);
      if (rodada >= 2) {
        const cobrancasRestantesMeu = 5 - rodada - (vezDoMeuLado ? 1 : 0);
        const cobrancasRestantesAdv = 5 - rodada - (vezDoMeuLado ? 0 : 1);
        const golsMeu = meuLado === "casa" ? golsCasa : golsFora;
        const golsAdv = meuLado === "casa" ? golsFora : golsCasa;
        if (golsMeu > golsAdv + cobrancasRestantesAdv) {
          return finalizarDisputa(cobrancas, golsCasa, golsFora, meuLado);
        }
        if (golsAdv > golsMeu + cobrancasRestantesMeu) {
          return finalizarDisputa(cobrancas, golsCasa, golsFora, meuLado);
        }
      }
      vezDoMeuLado = !vezDoMeuLado;
    }

    // Morte súbita
    let seguranca = 20;
    while (golsCasa === golsFora && seguranca-- > 0) {
      simularCobranca(meuLado);
      simularCobranca(advLado);
    }
    return finalizarDisputa(cobrancas, golsCasa, golsFora, meuLado);
  }

  function finalizarDisputa(cobrancas, golsCasa, golsFora, meuLado) {
    const vencedor =
      golsCasa === golsFora
        ? Math.random() < 0.5
          ? "casa"
          : "fora" // fallback de segurança
        : golsCasa > golsFora
          ? "casa"
          : "fora";
    return {
      cobrancas,
      golsCasa,
      golsFora,
      vencedor,
      vencedorCasa: vencedor === "casa",
      vencedorEhMeuTime: vencedor === meuLado,
    };
  }

  function serializarEstadoCompacto() {
    return JSON.stringify(estado, (chave, valor) => {
      if (
        chave !== "rankingGlobalOutrasLigas" ||
        !valor ||
        !Array.isArray(valor.jogadores)
      ) {
        return valor;
      }
      return {
        ano: valor.ano,
        jogadores: valor.jogadores.map((jogador) => ({
          id: jogador.id,
          titulosIndividuais: jogador.titulosIndividuais,
        })),
      };
    });
  }

  function ehErroDeQuota(erro) {
    return (
      erro?.name === "QuotaExceededError" ||
      erro?.code === 22 ||
      erro?.code === 1014
    );
  }

  function salvar() {
    invalidarCachesDerivados();
    const finalizarMedicao = window.FootMainPerformance?.start(
      "salvamento_jogo_a_jogo",
    );
    try {
      const conteudo = salvamentoCompacto
        ? serializarEstadoCompacto()
        : JSON.stringify(estado);
      if (localStorage.getItem(KEY) !== conteudo) {
        localStorage.setItem(KEY, conteudo);
      }
      avisoArmazenamentoExibido = false;
    } catch (e) {
      if (!ehErroDeQuota(e)) {
        console.error("Não foi possível salvar a carreira beta", e);
        finalizarMedicao?.();
        return;
      }
      try {
        const conteudoCompacto = serializarEstadoCompacto();
        if (localStorage.getItem(KEY) !== conteudoCompacto) {
          localStorage.setItem(KEY, conteudoCompacto);
        }
        salvamentoCompacto = true;
        avisoArmazenamentoExibido = false;
      } catch (erroCompacto) {
        console.error(
          "Não foi possível salvar a carreira beta mesmo após reduzir o cache de ranking",
          erroCompacto,
          e,
        );
        if (!avisoArmazenamentoExibido) {
          informar(
            "O armazenamento do navegador está cheio. A carreira não pôde ser salva; libere espaço nos dados deste site e tente novamente.",
            true,
          );
          avisoArmazenamentoExibido = true;
        }
      }
    }
    finalizarMedicao?.();
  }
  function carregar() {
    try {
      const valor = JSON.parse(localStorage.getItem(KEY) || "null");
      if (
        valor &&
        [1, 2, 3, 4].includes(valor.versao) &&
        Array.isArray(valor.partidas) &&
        Array.isArray(valor.tabela) &&
        Array.isArray(valor.rodadas)
      ) {
        estado = valor;
        estado.versao = 4;
        estado.pontosReputacaoTemporada = Number(estado.pontosReputacaoTemporada) || 0;
        estado.coletivasTemporada = Number(estado.coletivasTemporada) || 0;
        estado.relacaoTreinador = Number.isFinite(Number(estado.relacaoTreinador)) ? Math.max(0, Math.min(100, Number(estado.relacaoTreinador))) : 60;
        estado.desempenhoPosicional = {
          ...desempenhoPosicionalInicial(),
          ...(estado.desempenhoPosicional || {}),
          acoes: { ...(estado.desempenhoPosicional?.acoes || {}) },
        };
        estado.estatisticas = {
          jogos: 0,
          gols: 0,
          assistencias: 0,
          jogosClube: 0,
          golsClube: 0,
          assistenciasClube: 0,
          jogosSelecao: 0,
          golsSelecao: 0,
          assistenciasSelecao: 0,
          jogosSelecaoPorCompeticao: {},
          golsSelecaoPorCompeticao: {},
          amarelos: 0,
          vermelhos: 0,
          motm: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          driblesCompletos: 0,
          desarmes: 0,
          defesas: 0,
          jogadasCriadas: 0,
          ...estado.estatisticas,
        };
        ["driblesCompletos", "desarmes", "defesas", "jogadasCriadas"].forEach(
          (chave) => {
            estado.estatisticas[chave] = Math.max(
              0,
              Number(estado.estatisticas[chave]) || 0,
            );
          },
        );
        if (!Number.isFinite(Number(valor.estatisticas?.jogosClube)))
          estado.estatisticas.jogosClube =
            Number(estado.estatisticas.jogos) || 0;
        if (!Number.isFinite(Number(valor.estatisticas?.golsClube)))
          estado.estatisticas.golsClube = Number(estado.estatisticas.gols) || 0;
        if (!Number.isFinite(Number(valor.estatisticas?.assistenciasClube)))
          estado.estatisticas.assistenciasClube =
            Number(estado.estatisticas.assistencias) || 0;
        estado.trofeusColetivos = estado.trofeusColetivos || [];
        estado.trofeusIndividuais = estado.trofeusIndividuais || [];
        estado.trofeusClube = estado.trofeusClube || [];
        estado.trofeusSelecao = estado.trofeusSelecao || [];
        const disponibilidade = disponibilidadeInicial();
        estado.disponibilidade = {
          ...disponibilidade,
          ...(estado.disponibilidade || {}),
          suspensoes: {
            ...disponibilidade.suspensoes,
            ...(estado.disponibilidade?.suspensoes || {}),
          },
          amarelos: {
            ...disponibilidade.amarelos,
            ...(estado.disponibilidade?.amarelos || {}),
          },
        };

        estado.partidas.forEach((p, index) => {
          if (!p.tipo) p.tipo = "liga";
          if (!p.numero) p.numero = index + 1;
          if (!Number.isFinite(p.rodadaLiga) && p.tipo === "liga")
            p.rodadaLiga = index;
          if (!Number.isFinite(p.data))
            p.data = Date.UTC(
              Number(estado.ano) || 2026,
              1 +
                Math.floor((index / Math.max(1, estado.partidas.length)) * 10),
              4,
              12,
            );
          // Sanitiza dados de pênaltis antigos/parciais
          if (p.penaltis && typeof p.penaltis === "object") {
            const cobrancas = Array.isArray(p.penaltis.cobrancas)
              ? p.penaltis.cobrancas.filter(
                  (c) => c && (c.time === "casa" || c.time === "fora"),
                )
              : [];
            p.penaltis = {
              cobrancas,
              golsCasa: Math.max(
                0,
                Math.floor(Number(p.penaltis.golsCasa) || 0),
              ),
              golsFora: Math.max(
                0,
                Math.floor(Number(p.penaltis.golsFora) || 0),
              ),
              vencedorCasa: !!p.penaltis.vencedorCasa,
            };
          } else {
            delete p.penaltis;
          }
        });
      }
    } catch (e) {
      console.warn("Save beta inválido; aguardando nova carreira.", e);
    }
  }
  function gerarRodadasLiga(times) {
    const finalizarMedicao = window.FootMainPerformance?.start(
      "geracao_calendario_rodadas",
    );
    // Algoritmo de todos-contra-todos (circle method), com returno.
    const lista = [...times];
    if (lista.length % 2) lista.push(null);
    const fixos = lista[0],
      rotativos = lista.slice(1),
      ida = [];
    const totalRodadas = lista.length - 1;
    for (let r = 0; r < totalRodadas; r++) {
      const ordem = [fixos, ...rotativos];
      const confrontos = [];
      for (let i = 0; i < ordem.length / 2; i++) {
        let casa = ordem[i],
          fora = ordem[ordem.length - 1 - i];
        if (!casa || !fora) continue;
        if ((r + i) % 2) [casa, fora] = [fora, casa];
        confrontos.push({
          casaId: casa.id,
          foraId: fora.id,
          status: "agendado",
        });
      }
      ida.push(confrontos);
      rotativos.unshift(rotativos.pop());
    }
    const volta = ida.map((jogos) =>
      jogos.map((j) => ({
        casaId: j.foraId,
        foraId: j.casaId,
        status: "agendado",
      })),
    );
    const rodadas = [...ida, ...volta];
    finalizarMedicao?.();
    return rodadas;
  }

  function gerarCalendario(times, clubeUsuario, rodadas, ano) {
    const finalizarMedicao = window.FootMainPerformance?.start(
      "geracao_calendario_partidas_e_datas",
    );
    const jogos = [];
    const cal =
      clubeUsuario.tipo === "base"
        ? { mesInicio: 1, mesFim: 2 }
        : CALENDARIO_LIGAS[clubeUsuario.liga] || { mesInicio: 2, mesFim: 11 };

    // Datas de início e fim do campeonato (podem atravessar o ano).
    const dataInicio = criarDataUTC(ano, cal.mesInicio, 15);
    const anoFim = cal.mesFim < cal.mesInicio ? ano + 1 : ano;
    const dataFim = criarDataUTC(anoFim, cal.mesFim, 20);
    const intervalo = (dataFim - dataInicio) / Math.max(1, rodadas.length - 1);

    for (let r = 0; r < rodadas.length; r++) {
      let adversarioId;
      let jogaEmCasa;
      for (const confronto of rodadas[r]) {
        if (confronto.casaId === clubeUsuario.id) {
          adversarioId = confronto.foraId;
          jogaEmCasa = true;
          break;
        }
        if (confronto.foraId === clubeUsuario.id) {
          adversarioId = confronto.casaId;
          jogaEmCasa = false;
          break;
        }
      }
      if (adversarioId === undefined) continue;
      jogos.push({
        rodadaLiga: r,
        data: dataInicio + Math.round(r * intervalo),
        adversarioId,
        casa: jogaEmCasa,
        competicao: clubeUsuario.liga,
        tipo: "liga",
        status: "agendada",
      });
    }
    finalizarMedicao?.();
    return jogos;
  }

  function obterFormatoEliminatorias(regiao) {
    // Vagas diretas do ciclo de 48 seleções; vagas adicionais representam
    // as fases internas de classificação de cada confederação.
    const formatos = {
      americaSul: {
        vagas: 7,
        vagasGrupo: 7,
        tamanhoGrupo: 10,
        formato: "liga",
      },
      europa: {
        vagas: 16,
        vagasGrupo: 1,
        vagasAdicionais: 4,
        tamanhoGrupo: 5,
        formato: "grupos",
        grupos: 12,
      },
      africa: { vagas: 9, vagasGrupo: 1, tamanhoGrupo: 6, formato: "grupos" },
      asia: {
        vagas: 8,
        vagasGrupo: 2,
        vagasAdicionais: 2,
        tamanhoGrupo: 6,
        totalFinalistas: 18,
        formato: "grupos",
      },
      americaNorte: {
        vagas: 7,
        vagasGrupo: 2,
        vagasAdicionais: 1,
        tamanhoGrupo: 4,
        totalFinalistas: 12,
        formato: "grupos",
      },
      oceania: {
        vagas: 1,
        vagasGrupo: 0,
        vagasAdicionais: 1,
        tamanhoGrupo: 4,
        totalFinalistas: 8,
        formato: "grupos",
      },
    };
    return (
      formatos[regiao] || {
        vagas: 1,
        vagasGrupo: 1,
        tamanhoGrupo: 4,
        formato: "grupos",
      }
    );
  }

  function distribuirSelecoesEmGrupo(selecaoId, regiao, formato) {
    const elegiveis = SELECOES.filter(
      (s) => s.regiao === regiao && s.fifa !== false,
    ).sort(
      (a, b) =>
        forcaSelecao(b.id) - forcaSelecao(a.id) ||
        a.nome.localeCompare(b.nome, "pt-BR"),
    );
    const participantes = formato.totalFinalistas
      ? elegiveis.slice(0, formato.totalFinalistas)
      : elegiveis;
    const indice = participantes.findIndex((s) => s.id === selecaoId);
    if (indice < 0) return [];
    if (formato.formato === "liga") return participantes;
    if (regiao === "europa") {
      // UEFA: 12 grupos, sete com cinco seleções e cinco com quatro.
      const grupoIndice =
        indice < 35
          ? Math.floor(indice / 5)
          : 7 + Math.floor((indice - 35) / 4);
      const inicio =
        grupoIndice < 7 ? grupoIndice * 5 : 35 + (grupoIndice - 7) * 4;
      const tamanhoGrupo = grupoIndice < 7 ? 5 : 4;
      return participantes.slice(inicio, inicio + tamanhoGrupo);
    }
    const tamanho = formato.tamanhoGrupo;
    const grupoIndice = Math.floor(indice / tamanho);
    return participantes.slice(
      grupoIndice * tamanho,
      (grupoIndice + 1) * tamanho,
    );
  }

  function gerarRodadasTodosContraTodos(ids) {
    const times = [...ids];
    if (times.length % 2) times.push(null);
    const n = times.length;
    const metade = n / 2;
    const rodadas = [];
    for (let rodada = 0; rodada < n - 1; rodada++) {
      const jogos = [];
      for (let i = 0; i < metade; i++) {
        const a = times[i],
          b = times[n - 1 - i];
        if (a && b)
          jogos.push({ casa: rodada % 2 ? b : a, fora: rodada % 2 ? a : b });
      }
      rodadas.push(jogos);
      times.splice(1, 0, times.pop());
    }
    const turnoReturno = rodadas.map((jogos) =>
      jogos.map((j) => ({ casa: j.fora, fora: j.casa })),
    );
    return rodadas.concat(turnoReturno);
  }

  function adicionarEliminatoriasCopa(partidas, selecaoId, ano) {
    const selecao = SELECOES.find((s) => s.id === selecaoId);
    if (!selecao || ano < ANO_BASE_COPA_DO_MUNDO_SELECOES + 1) return;
    const cicloInicio =
      ANO_BASE_COPA_DO_MUNDO_SELECOES +
      1 +
      Math.floor(
        (ano - (ANO_BASE_COPA_DO_MUNDO_SELECOES + 1)) /
          CICLO_COPA_DO_MUNDO_SELECOES,
      ) *
        CICLO_COPA_DO_MUNDO_SELECOES;
    const cicloFim = cicloInicio + 2;
    if (ano < cicloInicio || ano > cicloFim) return;

    const formato = obterFormatoEliminatorias(selecao.regiao);
    const grupo = distribuirSelecoesEmGrupo(selecaoId, selecao.regiao, formato);
    if (grupo.length < 2) return;
    const ids = grupo.map((s) => s.id);
    const anoCopaAlvo = cicloInicio + 3;
    const torneioId = `eliminatorias:${selecao.regiao}:${anoCopaAlvo}`;
    const rodadas = gerarRodadasTodosContraTodos(ids);
    const rodadasPorTemporada = Math.ceil(rodadas.length / 3);
    const indiceTemporada = ano - cicloInicio;
    const inicioRodadas = indiceTemporada * rodadasPorTemporada;
    const fimRodadas = Math.min(
      rodadas.length,
      inicioRodadas + rodadasPorTemporada,
    );
    const datas = [3, 9, 10].flatMap((mes) =>
      [5, 19].map((dia) => criarDataUTC(ano, mes, dia)),
    );

    rodadas.slice(inicioRodadas, fimRodadas).forEach((jogos, indiceLocal) => {
      const indiceRodada = inicioRodadas + indiceLocal;
      const data =
        datas[indiceLocal] || criarDataUTC(ano, 11, 20 + indiceLocal);
      jogos.forEach((jogo) => {
        const ehJogador = jogo.casa === selecaoId || jogo.fora === selecaoId;
        if (ehJogador) {
          const adversarioId = jogo.casa === selecaoId ? jogo.fora : jogo.casa;
          const adversario = SELECOES.find((s) => s.id === adversarioId);
          partidas.push({
            data,
            adversarioId,
            adversarioNome: adversario?.nome || "Seleção adversária",
            casa: jogo.casa === selecaoId,
            competicao: "Eliminatórias da Copa do Mundo",
            tipo: "selecao",
            faseGrupo: true,
            torneioId,
            grupo: ids,
            rodadaGrupo: indiceRodada + 1,
            totalFasesGrupo: rodadas.length,
            vagasDiretas: formato.vagasGrupo ?? formato.vagas,
            vagasAdicionais: formato.vagasAdicionais || 0,
            confederacao: selecao.regiao,
            status: "agendada",
          });
        } else {
          partidas.push({
            data,
            casaId: jogo.casa,
            foraId: jogo.fora,
            competicao: "Eliminatórias da Copa do Mundo",
            tipo: "selecao-grupo-ia",
            torneioId,
            grupo: ids,
            rodadaGrupo: indiceRodada + 1,
            confederacao: selecao.regiao,
            status: "agendada",
          });
        }
      });
    });
  }

  function obterSelecoesAdversarias(competicao, selecaoId) {
    const selecao = (typeof SELECOES !== "undefined" ? SELECOES : []).find(
      (item) => item.id === selecaoId,
    );
    const todas = (typeof SELECOES !== "undefined" ? SELECOES : []).filter(
      (item) => item.id !== selecaoId,
    );
    const regioesPorCompeticao = {
      "Copa América": ["americaSul", "americaNorte"],
      "Copa Ouro": ["americaSul", "americaNorte"],
      Eurocopa: ["europa"],
      "Copa das Nações Africanas": ["africa"],
      "Copa da Ásia": ["asia"],
      "Copa das Nações da OFC": ["oceania"],
    };
    const regioes = regioesPorCompeticao[competicao];
    if (
      regioes === undefined ||
      ["Copa do Mundo", "Olimpíadas", "Amistoso"].includes(competicao)
    )
      return todas;
    const elegiveis = todas.filter((item) => regioes.includes(item.regiao));
    return elegiveis.length ? elegiveis : todas;
  }

  function forcaSelecao(selecaoId) {
    const potencia = Number(getConfig()?.selecao?.potencias?.[selecaoId]);
    return Math.max(
      1,
      Math.min(100, Number.isFinite(potencia) && potencia > 0 ? potencia : 50),
    );
  }

  function embaralharSelecoes(selecoes) {
    for (let indice = selecoes.length - 1; indice > 0; indice--) {
      const outroIndice = Math.floor(Math.random() * (indice + 1));
      [selecoes[indice], selecoes[outroIndice]] = [
        selecoes[outroIndice],
        selecoes[indice],
      ];
    }
    return selecoes;
  }

  function obterClassificadosCopaDoMundo() {
    const regioes = [
      "americaSul",
      "europa",
      "africa",
      "asia",
      "americaNorte",
      "oceania",
    ];
    return regioes
      .flatMap((regiao) => {
        const vagas = obterFormatoEliminatorias(regiao).vagas;
        return SELECOES.filter(
          (selecao) => selecao.regiao === regiao && selecao.fifa !== false,
        )
          .sort(
            (a, b) =>
              forcaSelecao(b.id) - forcaSelecao(a.id) ||
              a.nome.localeCompare(b.nome, "pt-BR"),
          )
          .slice(0, vagas);
      })
      .sort(
        (a, b) =>
          forcaSelecao(b.id) - forcaSelecao(a.id) ||
          a.nome.localeCompare(b.nome, "pt-BR"),
      );
  }

  function sortearGruposCopaDoMundo(classificados, selecaoId) {
    if (classificados.length !== 48) return [];
    const potes = Array.from({ length: 4 }, (_, indice) =>
      classificados.slice(indice * 12, (indice + 1) * 12),
    );
    const ordemSorteio = potes.flatMap((pote) => {
      const contagemRegioes = new Map();
      pote.forEach((selecao) =>
        contagemRegioes.set(
          selecao.regiao,
          (contagemRegioes.get(selecao.regiao) || 0) + 1,
        ),
      );
      const sorteado = [...pote];
      for (let indice = sorteado.length - 1; indice > 0; indice--) {
        const outroIndice = Math.floor(Math.random() * (indice + 1));
        [sorteado[indice], sorteado[outroIndice]] = [
          sorteado[outroIndice],
          sorteado[indice],
        ];
      }
      return sorteado.sort((a, b) => {
        if (a.id === selecaoId) return -1;
        if (b.id === selecaoId) return 1;
        return (
          contagemRegioes.get(b.regiao) - contagemRegioes.get(a.regiao) ||
          forcaSelecao(b.id) - forcaSelecao(a.id)
        );
      });
    });
    const grupos = Array.from({ length: 12 }, () => []);

    function distribuirSelecoes(indice) {
      if (indice === ordemSorteio.length) return true;
      const selecao = ordemSorteio[indice];
      const indicePote = Math.floor(indice / 12);
      const gruposPossiveis =
        selecao.id === selecaoId
          ? [0]
          : Array.from({ length: grupos.length }, (_, grupo) => grupo);
      for (let posicao = gruposPossiveis.length - 1; posicao > 0; posicao--) {
        const outroIndice = Math.floor(Math.random() * (posicao + 1));
        [gruposPossiveis[posicao], gruposPossiveis[outroIndice]] = [
          gruposPossiveis[outroIndice],
          gruposPossiveis[posicao],
        ];
      }

      for (const indiceGrupo of gruposPossiveis) {
        const grupo = grupos[indiceGrupo];
        const limiteConfederacao = selecao.regiao === "europa" ? 2 : 1;
        if (
          grupo.length !== indicePote ||
          grupo.filter((item) => item.regiao === selecao.regiao).length >=
            limiteConfederacao
        ) {
          continue;
        }
        grupo.push(selecao);
        if (distribuirSelecoes(indice + 1)) return true;
        grupo.pop();
      }
      return false;
    }

    return distribuirSelecoes(0) ? grupos : [];
  }

  function obterClassificadosMataMataCopa(grupos, selecaoId) {
    const terceiros = [];
    const classificados = [];
    grupos.forEach((grupo) => {
      const ordenado = [...grupo].sort(
        (a, b) =>
          forcaSelecao(b.id) - forcaSelecao(a.id) ||
          a.nome.localeCompare(b.nome, "pt-BR"),
      );
      classificados.push(...ordenado.slice(0, 2));
      if (ordenado[2]) terceiros.push(ordenado[2]);
    });
    classificados.push(
      ...terceiros
        .sort(
          (a, b) =>
            forcaSelecao(b.id) - forcaSelecao(a.id) ||
            a.nome.localeCompare(b.nome, "pt-BR"),
        )
        .slice(0, 8),
    );
    if (!classificados.some((selecao) => selecao.id === selecaoId)) {
      classificados[classificados.length - 1] = SELECOES.find(
        (selecao) => selecao.id === selecaoId,
      );
    }
    return classificados.filter(Boolean);
  }

  function sortearResultadoSelecao(timeCasaId, timeForaId) {
    const delta = (forcaSelecao(timeCasaId) - forcaSelecao(timeForaId)) / 25;
    return {
      golsCasa: sortearPoisson(Math.max(0.25, 1.3 + delta * 0.48)),
      golsFora: sortearPoisson(Math.max(0.25, 1.2 - delta * 0.42)),
    };
  }

  function adicionarFaseGruposSelecao(partidas, competicao, selecaoId, ano) {
    const conf = FASES_GRUPOS_SELECOES[competicao];
    const selecao = (typeof SELECOES !== "undefined" ? SELECOES : []).find(
      (item) => item.id === selecaoId,
    );
    if (!conf || !selecao) return;

    const copaDoMundo = competicao === "Copa do Mundo";
    const classificadosCopa = copaDoMundo
      ? obterClassificadosCopaDoMundo()
      : [];
    const gruposCopa = copaDoMundo
      ? sortearGruposCopaDoMundo(classificadosCopa, selecaoId)
      : [];
    const grupo = copaDoMundo
      ? gruposCopa
          .find((itens) => itens.some((item) => item.id === selecaoId))
          ?.map((item) => item.id) || []
      : [
          selecaoId,
          ...embaralharSelecoes(
            SELECOES.filter(
              (item) =>
                conf.regioes.includes(item.regiao) && item.id !== selecaoId,
            ),
          )
            .slice(0, conf.timesPorGrupo - 1)
            .map((item) => item.id),
        ];
    if (grupo.length !== conf.timesPorGrupo) return;
    const torneioId = `selecao:${selecaoId}:${competicao}:${ano}`;
    const jogosGrupo = grupo.length - 1;
    const datas = calcularDatasFases(
      competicao,
      ano,
      jogosGrupo + conf.fasesMataMata,
      5,
    );
    const confrontos = [
      { adversario: grupo[1], casa: true, iaCasa: grupo[2], iaFora: grupo[3] },
      { adversario: grupo[2], casa: false, iaCasa: grupo[1], iaFora: grupo[3] },
      { adversario: grupo[3], casa: true, iaCasa: grupo[1], iaFora: grupo[2] },
    ];

    confrontos.slice(0, jogosGrupo).forEach((confronto, indice) => {
      const adversario = SELECOES.find(
        (item) => item.id === confronto.adversario,
      );
      partidas.push({
        data: datas[indice],
        adversarioId: confronto.adversario,
        adversarioNome: adversario?.nome || "Seleção adversária",
        casa: confronto.casa,
        competicao,
        tipo: "selecao",
        faseGrupo: true,
        torneioId,
        grupo,
        rodadaGrupo: indice + 1,
        totalFasesGrupo: jogosGrupo,
        status: "agendada",
      });
      if (confronto.iaCasa && confronto.iaFora) {
        partidas.push({
          data: datas[indice] - 86400000,
          casaId: confronto.iaCasa,
          foraId: confronto.iaFora,
          competicao,
          tipo: "selecao-grupo-ia",
          torneioId,
          grupo,
          rodadaGrupo: indice + 1,
          status: "agendada",
        });
      }
    });

    const classificadosMataMata = copaDoMundo
      ? obterClassificadosMataMataCopa(gruposCopa, selecaoId)
      : [];
    adicionarEliminatoria(
      partidas,
      classificadosMataMata,
      selecaoId,
      competicao,
      ano,
      5,
      conf.fasesMataMata,
      `selecao:${selecaoId}`,
      competicao,
      "agendada",
      datas.slice(jogosGrupo),
      torneioId,
    );
  }

  function simularPartidaGrupoSelecaoIA(partida) {
    if (!partida || partida.status !== "agendada") return;
    const placar = sortearResultadoSelecao(partida.casaId, partida.foraId);
    invalidarCachesDerivados();
    Object.assign(partida, placar, { status: "concluida" });
    partida.eventosIndividuais = gerarEventosIndividuaisLiga(
      `${estado.ano}:${partida.torneioId}:${partida.rodadaGrupo}:${partida.casaId}:${partida.foraId}`,
      partida.casaId,
      partida.foraId,
      placar.golsCasa,
      placar.golsFora,
    );
  }

  function calcularTabelaGrupoSelecao(torneioId, selecoesGrupo) {
    const tabela = selecoesGrupo.map((id) => ({
      id,
      nome: SELECOES.find((item) => item.id === id)?.nome || "Seleção",
      pts: 0,
      pj: 0,
      gm: 0,
      gc: 0,
      sg: 0,
    }));
    const partidasGrupo = [
      ...(Array.isArray(estado.partidasEliminatoriasAnteriores)
        ? estado.partidasEliminatoriasAnteriores
        : []),
      ...estado.partidas,
    ].filter(
      (partida) =>
        partida.torneioId === torneioId &&
        partida.status === "concluida" &&
        (partida.faseGrupo || partida.tipo === "selecao-grupo-ia"),
    );

    partidasGrupo.forEach((partida) => {
      const casaId =
        partida.tipo === "selecao-grupo-ia"
          ? partida.casaId
          : partida.casa
            ? estado.nacionalidade
            : partida.adversarioId;
      const foraId =
        partida.tipo === "selecao-grupo-ia"
          ? partida.foraId
          : partida.casa
            ? partida.adversarioId
            : estado.nacionalidade;
      const casa = tabela.find((time) => time.id === casaId);
      const fora = tabela.find((time) => time.id === foraId);
      if (!casa || !fora) return;
      casa.pj++;
      fora.pj++;
      casa.gm += partida.golsCasa || 0;
      casa.gc += partida.golsFora || 0;
      fora.gm += partida.golsFora || 0;
      fora.gc += partida.golsCasa || 0;
      if (partida.golsCasa > partida.golsFora) casa.pts += 3;
      else if (partida.golsFora > partida.golsCasa) fora.pts += 3;
      else {
        casa.pts++;
        fora.pts++;
      }
    });

    tabela.forEach((time) => {
      time.sg = time.gm - time.gc;
    });
    return tabela.sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.gm - a.gm);
  }

  function renderizarTabelaGrupoSelecao(torneioId, selecoesGrupo, competicao) {
    const tabela = calcularTabelaGrupoSelecao(torneioId, selecoesGrupo);
    const conf = FASES_GRUPOS_SELECOES[competicao];
    const partidaQualificatoria = estado.partidas.find(
      (p) =>
        p.torneioId === torneioId &&
        p.competicao === "Eliminatórias da Copa do Mundo",
    );
    const formatoEliminatorias = partidaQualificatoria
      ? obterFormatoEliminatorias(partidaQualificatoria.confederacao)
      : null;
    // Compatibilidade com temporadas/saves criados antes da gravação das vagas.
    // Na CONMEBOL, as 7 primeiras posições garantem vaga direta.
    const vagasSalvas = Number(partidaQualificatoria?.vagasDiretas);
    const vagasDiretas = partidaQualificatoria
      ? Number.isFinite(vagasSalvas) &&
        partidaQualificatoria.vagasDiretas !== undefined
        ? vagasSalvas
        : Number(
            formatoEliminatorias?.vagasGrupo ??
              formatoEliminatorias?.vagas ??
              0,
          )
      : 0;
    const notaTerceiros = conf?.melhoresTerceiros
      ? `<p class="jja-grupo-resumo">Os melhores terceiros também podem avançar (${conf.melhoresTerceiros} vaga(s) no torneio).</p>`
      : "";

    return `<div class="jja-tabela-grupo-container">
            <table class="jja-tabela jja-tabela-grupo">
                <thead><tr><th>#</th><th>Seleção</th><th>Pts</th><th>J</th><th class="hide-mobile">GF</th><th class="hide-mobile">GA</th><th>SG</th></tr></thead>
                <tbody>${tabela
                  .map((time, indice) => {
                    const vagaDireta = partidaQualificatoria
                      ? indice < vagasDiretas
                      : indice < (conf?.classificadosPorGrupo || 0);
                    const zonaAdicional =
                      partidaQualificatoria &&
                      ((partidaQualificatoria.confederacao === "europa" &&
                        indice === 1) ||
                        (partidaQualificatoria.confederacao === "asia" &&
                          indice === 2) ||
                        (partidaQualificatoria.confederacao ===
                          "americaNorte" &&
                          indice === 2) ||
                        (partidaQualificatoria.confederacao === "oceania" &&
                          indice === 0));
                    return `<tr class="${time.id === estado.nacionalidade ? "meu-clube" : ""} ${vagaDireta ? "qualificado" : ""} ${zonaAdicional ? "playoff" : ""}">
                    <td>${indice + 1}</td><td>${escapar(time.nome)}</td><td><strong>${time.pts}</strong></td><td>${time.pj}</td>
                    <td class="hide-mobile">${time.gm}</td><td class="hide-mobile">${time.gc}</td><td>${time.sg > 0 ? "+" : ""}${time.sg}</td>
                </tr>`;
                  })
                  .join("")}</tbody>
            </table>
            ${partidaQualificatoria ? `<p class="jja-grupo-resumo">Verde: vaga direta. Amarelo: posição que pode avançar para a fase classificatória adicional. Vagas diretas nesta fase: ${vagasDiretas}.</p>` : notaTerceiros}
        </div>`;
  }

  function verificarClassificacaoGrupoSelecao(partida) {
    const jogosGrupo = estado.partidas.filter(
      (item) => item.torneioId === partida.torneioId && item.faseGrupo,
    );
    if (jogosGrupo.some((item) => item.status === "agendada")) return "";
    const jogosAnteriores = (
      Array.isArray(estado.partidasEliminatoriasAnteriores)
        ? estado.partidasEliminatoriasAnteriores
        : []
    ).filter(
      (item) =>
        item.torneioId === partida.torneioId &&
        item.faseGrupo &&
        item.status === "concluida",
    );
    if (
      partida.competicao === "Eliminatórias da Copa do Mundo" &&
      jogosAnteriores.length + jogosGrupo.length <
        Number(partida.totalFasesGrupo || 0)
    ) {
      return `Eliminatórias em andamento: ${jogosAnteriores.length + jogosGrupo.length} de ${partida.totalFasesGrupo} partidas disputadas no ciclo.`;
    }

    const conf = FASES_GRUPOS_SELECOES[partida.competicao];
    const tabela = calcularTabelaGrupoSelecao(partida.torneioId, partida.grupo);
    const posicao =
      tabela.findIndex((time) => time.id === estado.nacionalidade) + 1;
    const meuTime = tabela[posicao - 1];
    if (!conf || !meuTime) return "";

    const vagas =
      partida.competicao === "Eliminatórias da Copa do Mundo"
        ? Number(
            partida.vagasDiretas ??
              obterFormatoEliminatorias(partida.confederacao).vagas,
          )
        : Number(conf.classificadosPorGrupo) || 0;
    const classificadoDireto = posicao <= vagas;
    let classificaViaFaseAdicional = false;
    if (
      partida.competicao === "Eliminatórias da Copa do Mundo" &&
      !classificadoDireto
    ) {
      const regiao = partida.confederacao;
      if (regiao === "europa" && posicao === 2)
        classificaViaFaseAdicional =
          Math.random() < (Number(partida.vagasAdicionais) || 4) / 12;
      if (regiao === "asia" && posicao === 3)
        classificaViaFaseAdicional =
          Math.random() < (Number(partida.vagasAdicionais) || 2) / 3;
      if (regiao === "americaNorte" && posicao === 3)
        classificaViaFaseAdicional =
          Math.random() < (Number(partida.vagasAdicionais) || 1) / 3;
      if (regiao === "oceania" && posicao === 1)
        classificaViaFaseAdicional = Math.random() < 0.5;
    }
    const classificaComoTerceiro =
      partida.competicao !== "Eliminatórias da Copa do Mundo" &&
      posicao === conf.classificadosPorGrupo + 1 &&
      conf.melhoresTerceiros > 0 &&
      Math.random() < conf.melhoresTerceiros / conf.grupos;
    if (
      classificadoDireto ||
      classificaViaFaseAdicional ||
      classificaComoTerceiro
    ) {
      const criterio = classificaComoTerceiro
        ? "melhor terceiro"
        : `${posicao}º lugar`;
      if (partida.competicao === "Eliminatórias da Copa do Mundo") {
        estado.classificadoCopa = true;
        estado.posicaoEliminatorias = posicao;
        const via = classificadoDireto
          ? "vaga direta"
          : "fase classificatória adicional";
        return `${estado.nome} garantiu vaga na Copa do Mundo pela ${via} (${criterio}, ${meuTime.pts} pts).`;
      }
      return `${estado.nome} avançou na ${partida.competicao} (${criterio}, ${meuTime.pts} pts, saldo ${meuTime.sg >= 0 ? "+" : ""}${meuTime.sg}).`;
    }
    if (partida.competicao === "Eliminatórias da Copa do Mundo") {
      estado.classificadoCopa = false;
      estado.posicaoEliminatorias = posicao;
      return `${estado.nome} terminou fora das vagas para a Copa do Mundo (${posicao}º lugar).`;
    }

    estado.partidas
      .filter(
        (item) =>
          item.torneioId === partida.torneioId &&
          item.fase &&
          item.status === "agendada",
      )
      .forEach((item) => {
        item.status = "cancelada";
      });
    return `${estado.nome} foi eliminado na fase de grupos da ${partida.competicao} (${posicao}º lugar, ${meuTime.pts} pts).`;
  }

  function ehCompeticaoComFaseContinental(competicao) {
    return Object.prototype.hasOwnProperty.call(CONTINENTAL_CONFS, competicao);
  }

  function calcularOffset(competicao, liga) {
    const anteriores = ORDEM_CONTINENTAL[competicao] || [];
    return anteriores.reduce(
      (soma, anterior) =>
        soma + (CONTINENTAL_CONFS[anterior]?.vagasPorLiga?.[liga] || 0),
      0,
    );
  }

  function obterClubesPorLiga(ligas) {
    const cfg = typeof getConfig === "function" ? getConfig() : {};
    const resultado = {};
    ligas.forEach((liga) => {
      resultado[liga] = CLUBES.filter((c) => c.liga === liga)
        .map((c) => ({
          id: c.id,
          forca: Number(cfg.clubes?.potencias?.[c.id]) || 60,
        }))
        .sort((a, b) => b.forca - a.forca)
        .map((c) => c.id);
    });
    return resultado;
  }

  function obterParticipantesContinental(competicao, clubeId) {
    const conf = CONTINENTAL_CONFS[competicao];
    if (!conf) return null;

    const clubesPorLiga = obterClubesPorLiga(conf.ligas);
    const participantes = [];

    conf.ligas.forEach((liga) => {
      const vagas = conf.vagasPorLiga[liga] || 0;
      if (vagas === 0) return;
      const lista = clubesPorLiga[liga] || [];
      const offset = calcularOffset(competicao, liga);
      participantes.push(...lista.slice(offset, offset + vagas));
    });

    // Insere o clube do jogador caso ele tenha se classificado por posição,
    // mesmo que a força o deixasse de fora da lista.
    if (clubeId && !participantes.includes(clubeId)) {
      const clubeJogador = obterClube(clubeId);
      const ligaJogador = clubeJogador?.liga;
      const vagasLiga = conf.vagasPorLiga[ligaJogador] || 0;
      if (vagasLiga <= 0) return null;

      const daMesmaLiga = participantes.filter(
        (id) => obterClube(id)?.liga === ligaJogador,
      );
      if (daMesmaLiga.length >= vagasLiga) {
        let alvo = daMesmaLiga[0];
        let menorForca = forcaClube(obterClube(alvo));
        for (const id of daMesmaLiga) {
          const forca = forcaClube(obterClube(id));
          if (forca < menorForca) {
            menorForca = forca;
            alvo = id;
          }
        }
        const idx = participantes.indexOf(alvo);
        if (idx >= 0) participantes[idx] = clubeId;
        else participantes.push(clubeId);
      } else {
        participantes.push(clubeId);
      }
    }

    return participantes;
  }

  function obterDatasFaseContinental(competicao, ano) {
    const calendarios = {
      "Champions League": {
        mesInicio: 9,
        diaInicio: 17,
        mesFim: 1,
        diaFim: 29,
        numJogos: 8,
      },
      "Europa League": {
        mesInicio: 9,
        diaInicio: 21,
        mesFim: 12,
        diaFim: 12,
        numJogos: 6,
      },
      "Conference League": {
        mesInicio: 9,
        diaInicio: 21,
        mesFim: 12,
        diaFim: 12,
        numJogos: 6,
      },
      "AFC Champions League": {
        mesInicio: 2,
        diaInicio: 12,
        mesFim: 5,
        diaFim: 20,
        numJogos: 6,
      },
      "AFC Champions League 2": {
        mesInicio: 2,
        diaInicio: 12,
        mesFim: 5,
        diaFim: 20,
        numJogos: 6,
      },
      "CAF Champions League": {
        mesInicio: 2,
        diaInicio: 14,
        mesFim: 5,
        diaFim: 25,
        numJogos: 6,
      },
      "CAF Confederation Cup": {
        mesInicio: 2,
        diaInicio: 14,
        mesFim: 5,
        diaFim: 25,
        numJogos: 6,
      },
      "CONCACAF Champions Cup": {
        mesInicio: 2,
        diaInicio: 10,
        mesFim: 4,
        diaFim: 25,
        numJogos: 6,
      },
      Libertadores: {
        mesInicio: 2,
        diaInicio: 15,
        mesFim: 5,
        diaFim: 15,
        numJogos: 6,
      },
      "Copa Sul-Americana": {
        mesInicio: 3,
        diaInicio: 15,
        mesFim: 6,
        diaFim: 15,
        numJogos: 6,
      },
    };
    const cal = calendarios[competicao];
    if (!cal) return [];

    const inicio = criarDataUTC(ano, cal.mesInicio, cal.diaInicio);
    const anoFim = cal.mesFim < cal.mesInicio ? ano + 1 : ano;
    const fim = criarDataUTC(anoFim, cal.mesFim, cal.diaFim);
    const intervalo = (fim - inicio) / Math.max(1, cal.numJogos - 1);

    return Array.from(
      { length: cal.numJogos },
      (_, i) => inicio + Math.round(i * intervalo),
    );
  }

  function obterDatasMataMataContinental(competicao, ano, numFases) {
    const calendarios = {
      "Champions League": { inicio: [2, 18], fim: [5, 30], anoOffset: 1 },
      "Europa League": { inicio: [2, 18], fim: [5, 21], anoOffset: 1 },
      "Conference League": { inicio: [2, 18], fim: [5, 21], anoOffset: 1 },
      "AFC Champions League": { inicio: [6, 15], fim: [11, 25], anoOffset: 0 },
      "AFC Champions League 2": {
        inicio: [6, 15],
        fim: [11, 25],
        anoOffset: 0,
      },
      "CAF Champions League": { inicio: [6, 15], fim: [11, 25], anoOffset: 0 },
      "CAF Confederation Cup": { inicio: [6, 15], fim: [11, 25], anoOffset: 0 },
      "CONCACAF Champions Cup": { inicio: [5, 5], fim: [6, 15], anoOffset: 0 },
      Libertadores: { inicio: [7, 20], fim: [11, 25], anoOffset: 0 },
      "Copa Sul-Americana": { inicio: [8, 15], fim: [11, 20], anoOffset: 0 },
    };
    const cal = calendarios[competicao];
    if (!cal) return [];

    const inicio = criarDataUTC(
      ano + cal.anoOffset,
      cal.inicio[0],
      cal.inicio[1],
    );
    const fim = criarDataUTC(ano + cal.anoOffset, cal.fim[0], cal.fim[1]);
    const intervalo = (fim - inicio) / Math.max(1, numFases - 1);

    return Array.from(
      { length: numFases },
      (_, i) => inicio + Math.round(i * intervalo),
    );
  }

  function adicionarFaseGrupos(
    partidas,
    competicao,
    clubeId,
    ano,
    participantes,
  ) {
    const conf = CONTINENTAL_CONFS[competicao];
    const outros = participantes.filter((id) => id !== clubeId);
    const sorteados = [];
    for (let i = 0; i < 3 && outros.length > 0; i++) {
      const idx = Math.floor(Math.random() * outros.length);
      sorteados.push(outros.splice(idx, 1)[0]);
    }
    const grupo = [clubeId, ...sorteados];
    const torneioId = `${conf.torneioPrefixo}:${competicao}:${ano}`;
    const datas = obterDatasFaseContinental(competicao, ano);

    const confrontosUser = [
      { adversario: sorteados[0], casa: true },
      { adversario: sorteados[1], casa: false },
      { adversario: sorteados[2], casa: true },
      { adversario: sorteados[2], casa: false },
      { adversario: sorteados[1], casa: true },
      { adversario: sorteados[0], casa: false },
    ];
    confrontosUser.forEach((conf, i) => {
      const adv = obterClube(conf.adversario);
      partidas.push({
        data: datas[i],
        adversarioId: conf.adversario,
        adversarioNome: adv?.nome || "Adversário",
        casa: conf.casa,
        competicao,
        tipo: "grupo",
        torneioId,
        grupo,
        rodadaGrupo: i + 1,
        status: "agendada",
      });
    });

    const confrontosIA = [
      { casa: sorteados[1], fora: sorteados[2] },
      { casa: sorteados[0], fora: sorteados[2] },
      { casa: sorteados[0], fora: sorteados[1] },
      { casa: sorteados[1], fora: sorteados[0] },
      { casa: sorteados[2], fora: sorteados[0] },
      { casa: sorteados[2], fora: sorteados[1] },
    ];
    confrontosIA.forEach((conf, i) => {
      partidas.push({
        data: datas[i] - 86400000,
        casaId: conf.casa,
        foraId: conf.fora,
        competicao,
        tipo: "grupo-ia",
        torneioId,
        grupo,
        rodadaGrupo: i + 1,
        status: "agendada",
      });
    });

    return { grupo, torneioId, participantes, faseLiga: false };
  }

  function adicionarFaseLiga(
    partidas,
    competicao,
    clubeId,
    ano,
    participantes,
  ) {
    const conf = CONTINENTAL_CONFS[competicao];
    const torneioId = `${conf.torneioPrefixo}:${competicao}:${ano}`;
    const datas = obterDatasFaseContinental(competicao, ano);
    const agenda = gerarAgendaFaseLiga(participantes, conf.jogosFaseLiga);

    agenda.forEach((roundGames, rodada) => {
      roundGames.forEach((pair) => {
        const userInGame = pair.casaId === clubeId || pair.foraId === clubeId;
        if (userInGame) {
          const advId = pair.casaId === clubeId ? pair.foraId : pair.casaId;
          const adv = obterClube(advId);
          partidas.push({
            data: datas[rodada],
            adversarioId: advId,
            adversarioNome: adv?.nome || "Adversário",
            casa: pair.casaId === clubeId,
            competicao,
            tipo: "grupo",
            faseLiga: true,
            torneioId,
            grupo: participantes,
            rodadaGrupo: rodada + 1,
            status: "agendada",
          });
        } else {
          partidas.push({
            data: datas[rodada] - 86400000,
            casaId: pair.casaId,
            foraId: pair.foraId,
            competicao,
            tipo: "grupo-ia",
            faseLiga: true,
            torneioId,
            grupo: participantes,
            rodadaGrupo: rodada + 1,
            status: "agendada",
          });
        }
      });
    });

    return { grupo: participantes, torneioId, participantes, faseLiga: true };
  }

  function adicionarFaseContinental(partidas, competicao, clubeId, ano) {
    const conf = CONTINENTAL_CONFS[competicao];
    if (!conf) return null;
    const participantes = obterParticipantesContinental(competicao, clubeId);
    if (!participantes || !participantes.includes(clubeId)) return null;

    if (conf.formato === "fase-liga") {
      return adicionarFaseLiga(
        partidas,
        competicao,
        clubeId,
        ano,
        participantes,
      );
    }
    return adicionarFaseGrupos(
      partidas,
      competicao,
      clubeId,
      ano,
      participantes,
    );
  }

  function adicionarMataMataContinental(
    partidas,
    competicao,
    clubeId,
    ano,
    grupoInfo,
  ) {
    if (!grupoInfo) return;
    const conf = CONTINENTAL_CONFS[competicao];
    const { participantes, torneioId, grupo, faseLiga } = grupoInfo;

    const pool = faseLiga
      ? participantes.filter((id) => id !== clubeId)
      : participantes.filter((id) => !grupo.includes(id));
    if (!pool.length) return;

    const datas = obterDatasMataMataContinental(
      competicao,
      ano,
      conf.totalFasesMataMata,
    );

    for (let fase = 1; fase <= conf.totalFasesMataMata; fase++) {
      const advId = pool[Math.floor(Math.random() * pool.length)];
      const adv = obterClube(advId);
      partidas.push({
        data: datas[fase - 1],
        adversarioId: advId,
        adversarioNome: adv?.nome || "Adversário",
        casa: Math.random() < 0.5,
        competicao,
        tipo: "mata-mata",
        torneioId,
        fase,
        totalFases: conf.totalFasesMataMata,
        status: "agendada",
      });
    }
  }

  function cancelarMataMataRestante(torneioId) {
    estado.partidas
      .filter(
        (p) =>
          p.torneioId === torneioId &&
          p.status === "agendada" &&
          p.tipo === "mata-mata",
      )
      .forEach((p) => {
        p.status = "cancelada";
      });
  }

  function verificarClassificacaoContinental(partida) {
    const conf = CONTINENTAL_CONFS[partida.competicao];
    if (!conf) return "";

    const torneioId = partida.torneioId;
    const jogosUser = estado.partidas.filter(
      (p) => p.torneioId === torneioId && p.tipo === "grupo",
    );
    if (jogosUser.some((p) => p.status === "agendada")) return "";

    const tabelaFinal = calcularTabelaContinental(torneioId, partida.grupo);
    const posicao = tabelaFinal.findIndex((t) => t.id === estado.clubeId) + 1;
    const meuTime = tabelaFinal[posicao - 1];
    if (!meuTime) return "";

    const cutoff =
      conf.formato === "fase-liga"
        ? conf.classificadosParaKnockout
        : conf.classificadosPorGrupo;

    if (posicao <= cutoff) {
      const descricao =
        conf.formato === "fase-liga"
          ? `${posicao}º na fase liga`
          : `${posicao}º no grupo`;
      return `${estado.nome} avançou (${descricao}, ${meuTime.pts} pts, saldo ${meuTime.sg >= 0 ? "+" : ""}${meuTime.sg}).`;
    }

    cancelarMataMataRestante(torneioId);
    const descricao =
      conf.formato === "fase-liga"
        ? `${posicao}º na fase liga`
        : `${posicao}º no grupo`;
    return `${estado.nome} foi eliminado (${descricao}, ${meuTime.pts} pts).`;
  }

  function embaralharTimesCopinha(times) {
    const resultado = [...times];
    for (let indice = resultado.length - 1; indice > 0; indice--) {
      const sorteado = Math.floor(Math.random() * (indice + 1));
      [resultado[indice], resultado[sorteado]] = [
        resultado[sorteado],
        resultado[indice],
      ];
    }
    return resultado;
  }

  function adicionarFaseCopinha(partidas, times, clube, ano) {
    if (times.length < 8) {
      throw new Error(
        "A Copinha precisa de pelo menos oito clubes de base para formar quatro grupos e as quartas de final.",
      );
    }

    const nomesGrupos = ["A", "B", "C", "D"];
    const grupos = Object.fromEntries(nomesGrupos.map((nome) => [nome, []]));
    embaralharTimesCopinha(times).forEach((time, indice) => {
      grupos[nomesGrupos[indice % nomesGrupos.length]].push(time.id);
    });

    const torneioId = `copinha:${clube.nacionalidade}:${ano}`;

    nomesGrupos.forEach((nomeGrupo) => {
      const grupo = grupos[nomeGrupo];
      const timesGrupo = grupo.map((id) => obterClube(id)).filter(Boolean);
      const rodadas = gerarRodadasLiga(timesGrupo).slice(
        0,
        grupo.length % 2 === 0 ? grupo.length - 1 : grupo.length,
      );
      rodadas.forEach((confrontos, indiceRodada) => {
        confrontos.forEach((confronto) => {
          const data = criarDataUTC(ano, 1, 3 + indiceRodada * 3);
          if (confronto.casaId === clube.id || confronto.foraId === clube.id) {
            const adversarioId =
              confronto.casaId === clube.id
                ? confronto.foraId
                : confronto.casaId;
            const adversario = obterClube(adversarioId);
            partidas.push({
              data,
              adversarioId,
              adversarioNome: adversario?.nome || "Adversário",
              casa: confronto.casaId === clube.id,
              competicao: "Copinha",
              tipo: "grupo",
              torneioId,
              grupo,
              grupoCopinha: nomeGrupo,
              rodadaGrupo: indiceRodada + 1,
              status: "agendada",
            });
          } else {
            partidas.push({
              data,
              casaId: confronto.casaId,
              foraId: confronto.foraId,
              competicao: "Copinha",
              tipo: "grupo-ia",
              torneioId,
              grupo,
              grupoCopinha: nomeGrupo,
              rodadaGrupo: indiceRodada + 1,
              status: "agendada",
            });
          }
        });
      });
    });

    const primeiraPartidaDeGrupo = partidas.find(
      (partida) => partida.torneioId === torneioId && partida.tipo === "grupo",
    );
    if (primeiraPartidaDeGrupo) primeiraPartidaDeGrupo.gruposCopinha = grupos;
    const datasMataMata = [1, 2, 3].map((fase) =>
      criarDataUTC(ano, 1, 25 + (fase - 1) * 3),
    );
    datasMataMata.forEach((fase, indice) => {
      partidas.push({
        data: fase,
        adversarioId: "",
        adversarioNome: "Aguardando classificação",
        casa: true,
        competicao: "Copinha",
        tipo: "mata-mata",
        torneioId,
        fase: indice + 1,
        totalFases: 3,
        status: "bloqueada",
      });
    });
  }

  function simularVencedorCopinha(timeCasaId, timeForaId) {
    const forcaCasa = forcaClube(obterClube(timeCasaId));
    const forcaFora = forcaClube(obterClube(timeForaId));
    const chanceCasa = Math.max(
      0.2,
      Math.min(0.8, 0.5 + (forcaCasa - forcaFora) / 100),
    );
    return Math.random() < chanceCasa ? timeCasaId : timeForaId;
  }

  function inicializarChaveCopinha(torneioId, grupos) {
    const primeiros = Object.keys(grupos).map(
      (nome) => calcularTabelaContinental(torneioId, grupos[nome])[0]?.id,
    );
    const segundos = Object.keys(grupos).map(
      (nome) => calcularTabelaContinental(torneioId, grupos[nome])[1]?.id,
    );
    const quartas = [
      { casaId: primeiros[0], foraId: segundos[1], vencedorId: null },
      { casaId: primeiros[1], foraId: segundos[0], vencedorId: null },
      { casaId: primeiros[2], foraId: segundos[3], vencedorId: null },
      { casaId: primeiros[3], foraId: segundos[2], vencedorId: null },
    ];
    quartas.forEach((partida) => {
      if (
        partida.casaId !== estado.clubeId &&
        partida.foraId !== estado.clubeId
      ) {
        partida.vencedorId = simularVencedorCopinha(
          partida.casaId,
          partida.foraId,
        );
      }
    });

    const semifinais = [0, 1].map((indice) => {
      const partida = { casaId: null, foraId: null, vencedorId: null };
      const qfCasa = quartas[indice * 2];
      const qfFora = quartas[indice * 2 + 1];
      if (qfCasa.vencedorId && qfFora.vencedorId) {
        partida.casaId = qfCasa.vencedorId;
        partida.foraId = qfFora.vencedorId;
        if (
          partida.casaId !== estado.clubeId &&
          partida.foraId !== estado.clubeId
        ) {
          partida.vencedorId = simularVencedorCopinha(
            partida.casaId,
            partida.foraId,
          );
        }
      }
      return partida;
    });
    return {
      quartas,
      semifinais,
      final: { casaId: null, foraId: null, vencedorId: null },
    };
  }

  function verificarClassificacaoCopinha(partida) {
    const jogosDoClube = estado.partidas.filter(
      (item) => item.torneioId === partida.torneioId && item.tipo === "grupo",
    );
    if (jogosDoClube.some((item) => item.status === "agendada")) return "";

    estado.partidas
      .filter(
        (item) =>
          item.torneioId === partida.torneioId &&
          item.tipo === "grupo-ia" &&
          item.status === "agendada",
      )
      .forEach((item) => {
        const vencedorId = simularVencedorCopinha(item.casaId, item.foraId);
        const delta = vencedorId === item.casaId ? 1 : -1;
        const golsCasa = Math.max(
          0,
          Math.round(1.3 + delta * 0.45 + Math.random() * 2),
        );
        const golsFora = Math.max(
          0,
          Math.round(1.2 - delta * 0.45 + Math.random() * 2),
        );
        Object.assign(item, { golsCasa, golsFora, status: "concluida" });
        if (golsCasa === golsFora) item.golsCasa++;
        if (
          (item.golsCasa > item.golsFora ? item.casaId : item.foraId) !==
          vencedorId
        ) {
          [item.golsCasa, item.golsFora] = [item.golsFora, item.golsCasa];
        }
      });

    const grupos = estado.copinha?.grupos;
    if (!grupos)
      throw new Error(
        "Não foi possível recuperar a formação dos grupos da Copinha.",
      );
    const grupoDoClube = Object.entries(grupos).find(([, ids]) =>
      ids.includes(estado.clubeId),
    );
    const tabelaDoClube = grupoDoClube
      ? calcularTabelaContinental(partida.torneioId, grupoDoClube[1])
      : [];
    const posicao = tabelaDoClube.findIndex(
      (time) => time.id === estado.clubeId,
    );
    if (posicao < 0)
      throw new Error(
        "O clube não foi encontrado na classificação do grupo da Copinha.",
      );

    if (posicao > 1) {
      estado.partidas
        .filter(
          (item) =>
            item.torneioId === partida.torneioId &&
            item.fase &&
            item.status === "bloqueada",
        )
        .forEach((item) => {
          item.status = "cancelada";
        });
      return `${estado.nome} foi eliminado na fase de grupos da Copinha (${posicao + 1}º lugar).`;
    }

    const chave = inicializarChaveCopinha(partida.torneioId, grupos);
    estado.copinha.chave = chave;
    const indiceQuartas = chave.quartas.findIndex(
      (item) =>
        item.casaId === estado.clubeId || item.foraId === estado.clubeId,
    );
    const jogoQuartas = estado.partidas.find(
      (item) => item.torneioId === partida.torneioId && item.fase === 1,
    );
    const confrontoQuartas = chave.quartas[indiceQuartas];
    if (!jogoQuartas || !confrontoQuartas)
      throw new Error(
        "Não foi possível montar as quartas de final da Copinha.",
      );
    const adversarioId =
      confrontoQuartas.casaId === estado.clubeId
        ? confrontoQuartas.foraId
        : confrontoQuartas.casaId;
    const adversario = obterClube(adversarioId);
    Object.assign(jogoQuartas, {
      adversarioId,
      adversarioNome: adversario?.nome || "Adversário",
      casa: confrontoQuartas.casaId === estado.clubeId,
      status: "agendada",
    });
    return `${estado.nome} avançou às quartas de final da Copinha (${posicao + 1}º lugar do Grupo ${grupoDoClube[0]}).`;
  }

  function processarEliminatoriaCopinha(partida, golsCasa, golsFora) {
    const venceuCasa = partida.vencedorCasa;
    const vencedorId =
      partida.casa === venceuCasa ? estado.clubeId : partida.adversarioId;
    const clubeVenceu = vencedorId === estado.clubeId;
    const chave = estado.copinha?.chave;
    if (!chave)
      throw new Error("A chave eliminatória da Copinha não foi inicializada.");

    const fixture =
      partida.fase === 1
        ? chave.quartas.find(
            (item) =>
              item.casaId === estado.clubeId || item.foraId === estado.clubeId,
          )
        : partida.fase === 2
          ? chave.semifinais.find(
              (item) =>
                item.casaId === estado.clubeId ||
                item.foraId === estado.clubeId,
            )
          : chave.final;
    if (!fixture)
      throw new Error(
        "Não foi possível localizar o confronto da Copinha na chave.",
      );

    if (!clubeVenceu) {
      estado.partidas
        .filter(
          (item) =>
            item.torneioId === partida.torneioId &&
            item.fase > partida.fase &&
            item.status !== "concluida",
        )
        .forEach((item) => {
          item.status = "cancelada";
        });
      return `${estado.nome} foi eliminado da Copinha.`;
    }

    fixture.vencedorId = estado.clubeId;
    if (partida.fase === 3) {
      const titulos = (estado.trofeusClube ||= []);
      if (!titulos.includes("Copinha")) titulos.push("Copinha");
      return "Campeão: Copinha.";
    }

    const proximaFase = partida.fase + 1;
    let adversarioId;
    if (partida.fase === 1) {
      const indiceQuartas = chave.quartas.indexOf(fixture);
      const semifinalIndice = Math.floor(indiceQuartas / 2);
      const quartasPar =
        chave.quartas[semifinalIndice * 2 + (indiceQuartas % 2 === 0 ? 1 : 0)];
      const semifinal = chave.semifinais[semifinalIndice];
      if (!quartasPar?.vencedorId)
        throw new Error(
          "O adversário da semifinal da Copinha ainda não foi definido.",
        );
      semifinal.casaId = estado.clubeId;
      semifinal.foraId = quartasPar.vencedorId;
      adversarioId = quartasPar.vencedorId;

      const outraSemifinal = chave.semifinais[1 - semifinalIndice];
      if (
        !outraSemifinal.vencedorId &&
        outraSemifinal.casaId &&
        outraSemifinal.foraId
      ) {
        outraSemifinal.vencedorId = simularVencedorCopinha(
          outraSemifinal.casaId,
          outraSemifinal.foraId,
        );
      }
    } else {
      const indiceSemifinal = chave.semifinais.indexOf(fixture);
      const outraSemifinal = chave.semifinais[1 - indiceSemifinal];
      if (!outraSemifinal?.vencedorId)
        throw new Error(
          "O adversário da final da Copinha ainda não foi definido.",
        );
      chave.final.casaId = estado.clubeId;
      chave.final.foraId = outraSemifinal.vencedorId;
      adversarioId = outraSemifinal.vencedorId;
    }

    const proximaPartida = estado.partidas.find(
      (item) =>
        item.torneioId === partida.torneioId && item.fase === proximaFase,
    );
    const adversario = obterClube(adversarioId);
    if (!proximaPartida || !adversario)
      throw new Error("Não foi possível preparar a próxima fase da Copinha.");
    Object.assign(proximaPartida, {
      adversarioId,
      adversarioNome: adversario.nome,
      casa: Math.random() < 0.5,
      status: "agendada",
    });
    return `Classificado para a próxima fase da Copinha.`;
  }

  function adicionarEliminatoria(
    partidas,
    times,
    clubeId,
    competicao,
    ano,
    mesInicial,
    quantidadeRodadas,
    prefixo,
    selecao = null,
    statusInicial = "agendada",
    datasPersonalizadas = null,
    torneioIdPersonalizado = "",
  ) {
    const adversarios =
      selecao && !times.length
        ? obterSelecoesAdversarias(competicao, clubeId)
        : times;
    const oponentes = adversarios.filter((t) => t.id !== clubeId);
    const datas =
      datasPersonalizadas ||
      calcularDatasFases(competicao, ano, quantidadeRodadas, mesInicial);
    const adversariosUsados = new Set();

    for (let fase = 0; fase < quantidadeRodadas; fase++) {
      let adversario;
      if (selecao === "Copa do Mundo") {
        const disponiveis = oponentes
          .filter((time) => !adversariosUsados.has(time.id))
          .sort(
            (a, b) =>
              forcaSelecao(a.id) - forcaSelecao(b.id) ||
              a.nome.localeCompare(b.nome, "pt-BR"),
          );
        const indiceAdversario = Math.min(
          disponiveis.length - 1,
          Math.floor(
            ((fase + 1) * disponiveis.length) / (quantidadeRodadas + 1),
          ),
        );
        adversario = disponiveis[indiceAdversario];
        if (adversario) adversariosUsados.add(adversario.id);
      } else {
        adversario = oponentes[Math.floor(Math.random() * oponentes.length)];
      }
      partidas.push({
        data: datas[fase],
        adversarioId: adversario?.id || "",
        adversarioNome: adversario?.nome || "Adversário",
        casa: Math.random() < 0.5,
        competicao,
        tipo: selecao ? "selecao" : "mata-mata",
        torneioId: torneioIdPersonalizado || `${prefixo}:${competicao}`,
        fase: fase + 1,
        totalFases: quantidadeRodadas,
        selecao: selecao || null,
        status: statusInicial,
      });
    }
  }

  function obterConvocacao(estadoTemporada, carreira, historico) {
    const selecao = (typeof SELECOES !== "undefined" ? SELECOES : []).find(
      (s) => s.id === estadoTemporada.nacionalidade,
    );
    if (!selecao || carreira.aposentadoriaSelecao === true) return null;

    const cfg = typeof getConfig === "function" ? getConfig() : {};
    const potencia = Number(cfg.selecao?.potencias?.[selecao.id]) || 50;
    const temporadas = Array.isArray(historico) ? historico : [];
    const convocacoesAnteriores = temporadas.filter(
      (t) => t.convocado || Number(t.jogosSelecao) > 0,
    ).length;
    const ultimaTemporada = temporadas[temporadas.length - 1];
    const convocadoNaTemporadaAnterior = !!(
      ultimaTemporada &&
      (ultimaTemporada.convocado || Number(ultimaTemporada.jogosSelecao) > 0)
    );

    // Overall alto aumenta bastante a chance; seleções mais fortes têm maior concorrência.
    const overall = Math.max(
      1,
      Math.min(99, Number(estadoTemporada.overall) || 50),
    );
    const notaOverall = Math.max(0, Math.min(1, (overall - 55) / 35));
    let chance = 0.12 + notaOverall * 0.76;
    chance -= Math.max(-20, Math.min(40, potencia - 50)) / 300;

    const clube =
      typeof obterClube === "function" ? obterClube(carreira.clube) : null;
    const jogaEuropa =
      !!clube?.pais &&
      [
        "Inglaterra",
        "Espanha",
        "Alemanha",
        "Itália",
        "França",
        "Portugal",
        "Holanda",
      ].some((pais) => String(clube.pais).includes(pais));
    chance += jogaEuropa ? 0.04 : 0;
    chance += Math.min(0.2, convocacoesAnteriores * 0.025);
    if (convocadoNaTemporadaAnterior) chance += 0.12;

    const idade = Number(estadoTemporada.idade) || 18;
    if (idade < 18) chance *= 0.35;
    else if (idade > 35) chance *= 0.7;
    if (idade > 38) chance *= 0.6;

    chance = Math.max(0, Math.min(0.97, chance));
    return Math.random() < chance ? selecao : null;
  }
  function montarCalendarioTemporada(
    times,
    clube,
    rodadas,
    ano,
    carreira,
    historico,
    perfil,
  ) {
    const partidas =
      clube.tipo === "base" ? [] : gerarCalendario(times, clube, rodadas, ano);
    if (clube.tipo === "base")
      adicionarFaseCopinha(partidas, times, clube, ano);
    const nomes =
      typeof obterNomesTrofeusClube === "function"
        ? obterNomesTrofeusClube(clube.id)
        : { liga: clube.liga, copa: "Copa Nacional" };

    const estadual =
      typeof ESTADUAIS_BRASIL !== "undefined"
        ? ESTADUAIS_BRASIL[clube.id]
        : null;
    if (clube.tipo !== "base") {
      adicionarEliminatoria(
        partidas,
        times,
        clube.id,
        nomes.copa || "Copa Nacional",
        ano,
        2,
        4,
        "clube",
      );
    }

    if (estadual) {
      const todosClubes = [
        ...(typeof CLUBES !== "undefined" ? CLUBES : []),
        ...(typeof CLUBES_REGIONAIS !== "undefined" ? CLUBES_REGIONAIS : []),
      ];
      const clubesEstaduais = todosClubes.filter(
        (t) => ESTADUAIS_BRASIL[t.id] === estadual,
      );
      const timesEstaduais =
        clubesEstaduais.length >= 2 ? clubesEstaduais : times;
      adicionarEliminatoria(
        partidas,
        timesEstaduais,
        clube.id,
        estadual,
        ano,
        0,
        3,
        "estadual",
      );
    }

    const qualificadas =
      carreira.clubeQualificado === clube.id &&
      Array.isArray(carreira.competicoesQualificadas)
        ? carreira.competicoesQualificadas
        : [];

    qualificadas
      .filter(() => clube.tipo !== "base")
      .forEach((competicao) => {
        if (ehCompeticaoComFaseContinental(competicao)) {
          const grupoInfo = adicionarFaseContinental(
            partidas,
            competicao,
            clube.id,
            ano,
          );
          if (grupoInfo)
            adicionarMataMataContinental(
              partidas,
              competicao,
              clube.id,
              ano,
              grupoInfo,
            );
        } else {
          adicionarEliminatoria(
            partidas,
            times,
            clube.id,
            competicao,
            ano,
            1,
            5,
            "continental",
          );
        }
      });

    const ultimaTemporada = historico[historico.length - 1];
    const trofeusAnteriores =
      ultimaTemporada?.clube === clube.id
        ? ultimaTemporada.trofeusColetivos || []
        : [];
    const ganhouLigaECopa =
      trofeusAnteriores.includes(nomes.liga) &&
      trofeusAnteriores.includes(nomes.copa);
    const ganhouContinental = trofeusAnteriores.includes(nomes.continental);
    if (clube.tipo !== "base" && ganhouLigaECopa)
      adicionarEliminatoria(
        partidas,
        times,
        clube.id,
        "Supercopa Nacional",
        ano,
        1,
        1,
        "supercopa",
      );
    if (clube.tipo !== "base" && ganhouContinental)
      adicionarEliminatoria(
        partidas,
        times,
        clube.id,
        "Supercopa Continental",
        ano,
        1,
        1,
        "supercopa",
      );
    const classificadoContinental = qualificadas.includes(nomes.continental);
    if (clube.tipo !== "base" && classificadoContinental)
      adicionarEliminatoria(
        partidas,
        times,
        clube.id,
        "Intercontinental",
        ano,
        11,
        1,
        "intercontinental",
        null,
        "bloqueada",
      );
    const cfgTitulos =
      typeof getConfig === "function" ? getConfig().titulos : {};
    const ciclo = Math.max(1, Number(cfgTitulos?.cicloCopaDoMundo) || 4);
    const inicioMundial = Number(cfgTitulos?.anoInicioMundialClubes) || 2029;
    if (
      clube.tipo !== "base" &&
      ano >= inicioMundial &&
      (ano - inicioMundial) % ciclo === 0
    ) {
      const inicioCiclo =
        (typeof ANO_INICIAL !== "undefined" ? ANO_INICIAL : 2026) +
        Math.floor(
          (ano - (typeof ANO_INICIAL !== "undefined" ? ANO_INICIAL : 2026)) /
            ciclo,
        ) *
          ciclo;
      const ganhouNoCiclo = historico.some(
        (t) =>
          t.clube === clube.id &&
          Number(t.ano) >= inicioCiclo &&
          Number(t.ano) < ano &&
          (t.trofeusColetivos || []).includes(nomes.continental),
      );
      if (ganhouNoCiclo || classificadoContinental) {
        const status =
          classificadoContinental && !ganhouNoCiclo ? "bloqueada" : "agendada";
        adicionarEliminatoria(
          partidas,
          times,
          clube.id,
          "Copa do Mundo de Clubes",
          ano,
          11,
          3,
          "mundial-clubes",
          null,
          status,
        );
      }
    }

    const anoCopaDoMundo =
      ano >= ANO_BASE_COPA_DO_MUNDO_SELECOES &&
      (ano - ANO_BASE_COPA_DO_MUNDO_SELECOES) % CICLO_COPA_DO_MUNDO_SELECOES ===
        0 &&
      obterClassificacaoCopaPorForca(perfil.nacionalidade).classificado;
    const convocada = obterConvocacao({ ...perfil, ano }, carreira, historico);
    const jogosSelecao = [];
    if (convocada) {
      // Eliminatórias oficiais, separadas dos amistosos e com tabela própria.
      adicionarEliminatoriasCopa(partidas, convocada.id, ano);
      const adversariosAmistosos = obterSelecoesAdversarias(
        "Amistoso",
        convocada.id,
      );
      JANELAS_FIFA.forEach((janela, i) => {
        const indice = Math.floor(Math.random() * adversariosAmistosos.length);
        const [adversario] = adversariosAmistosos.splice(indice, 1);
        if (!adversario) return;
        jogosSelecao.push({
          data: criarDataUTC(ano, janela.mes, janela.dia),
          adversarioId: adversario.id,
          adversarioNome: adversario.nome,
          casa: i % 2 === 0,
          competicao: "Amistoso",
          tipo: "selecao",
          selecao: "amistoso",
          status: "agendada",
        });
      });

      const anoInicioContinental = ANO_BASE_EVENTOS_SELECOES;
      const anoTorneioRegional =
        ano >= anoInicioContinental &&
        (ano - anoInicioContinental) % CICLO_COPA_DO_MUNDO_SELECOES === 0;
      if (anoCopaDoMundo || anoTorneioRegional) {
        const competicaoRegional = {
          americaSul: "Copa América",
          europa: "Eurocopa",
          americaNorte: "Copa Ouro",
          africa: "Copa das Nações Africanas",
          asia: "Copa da Ásia",
          oceania: "Copa das Nações da OFC",
        }[convocada.regiao];
        const competicoesSelecao = anoCopaDoMundo
          ? ["Copa do Mundo"]
          : [competicaoRegional, "Olimpíadas"];
        competicoesSelecao.forEach((competicao, indice) => {
          if (competicao === "Olimpíadas" && Number(perfil.idade) > 23) return;
          adicionarFaseGruposSelecao(partidas, competicao, convocada.id, ano);
        });
      }
      const anoBaseSelecoes = ANO_BASE_COPA_DO_MUNDO_SELECOES;
      const anoMundialDeBase =
        ano > anoBaseSelecoes &&
        (ano - (anoBaseSelecoes + 1)) % 2 === 0 &&
        !anoCopaDoMundo;
      if (anoMundialDeBase) {
        if (perfil.idade <= 20)
          adicionarFaseGruposSelecao(
            partidas,
            "Mundial Sub-20",
            convocada.id,
            ano,
          );
        if (perfil.idade <= 17)
          adicionarFaseGruposSelecao(
            partidas,
            "Mundial Sub-17",
            convocada.id,
            ano,
          );
      }
      partidas.push(...jogosSelecao);
    }
    return partidas.sort((a, b) => a.data - b.data);
  }

  function idadeInicialDentroDoLimite(idade, idadeLimite) {
    if (idade <= idadeLimite) return true;
    informar(
      `A idade inicial (${idade}) não pode ser maior que a idade limite (${idadeLimite}).`,
      true,
    );
    return false;
  }

  async function iniciar() {
    const carreira =
      typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
    if (!simulandoCarreira && temporadaEmAndamento(carreira)) {
      informar(
        "Conclua a temporada atual antes de avançar para a próxima.",
        true,
      );
      return;
    }
    const posRadio = document.querySelector('input[name="posicao"]:checked');
    if (!posRadio) {
      informar("Selecione a posição do jogador no perfil principal.", true);
      return;
    }
    const nome =
      (typeof normalizarNome === "function"
        ? normalizarNome($("nome").value)
        : $("nome").value.trim()) ||
      carreira.nome ||
      "Jogador";
    const posicao = posRadio.id.toUpperCase();
    const nacionalidade =
      $("nacionalidade")?.value || carreira.nacionalidade || "";
    const historicoCompleto =
      typeof lerHistorico === "function" ? lerHistorico() : [];
    let historicoCarreira = historicoCompleto.filter(
      (t) => String(t.carreiraId) === String(carreira.id),
    );
    // Compatibilidade com temporadas antigas que não tinham carreiraId uniforme.
    if (
      !historicoCarreira.length &&
      typeof obterHistoricoDaCarreira === "function"
    ) {
      const nomeNormalizado = String(nome).trim().toLocaleLowerCase("pt-BR");
      historicoCarreira = obterHistoricoDaCarreira(nome, {
        nome:
          (typeof POSICOES_CAMPO !== "undefined" &&
            POSICOES_CAMPO[posicao]?.nome) ||
          posicao,
      }).filter(
        (t) =>
          !t.carreiraId &&
          String(t.nome || "")
            .trim()
            .toLocaleLowerCase("pt-BR") === nomeNormalizado,
      );
    }
    if (!historicoCarreira.length) {
      carreira.clube = "";
      carreira.subiuProfissional = false;
      carreira.anosContratoRestantes = 0;
    }
    let ultimaTemporada = historicoCarreira[historicoCarreira.length - 1];
    if (ultimaTemporada?.lesaoCarreira) {
      informar(
        "A carreira foi encerrada por uma lesão gravíssima registrada na temporada anterior.",
        true,
      );
      return;
    }
    const idadeInformada = Math.max(16, Number($("idade").value) || 18);
    const idade = ultimaTemporada
      ? Number(ultimaTemporada.idade) + 1
      : idadeInformada;
    const ano = ultimaTemporada
      ? typeof proximoAno === "function"
        ? proximoAno(historicoCarreira)
        : Number(ultimaTemporada.ano) + 1
      : Number(typeof ANO_INICIAL !== "undefined" ? ANO_INICIAL : 2026) || 2026;
    let overall = Math.max(
      1,
      Math.min(
        99,
        Number(ultimaTemporada?.overall) ||
          Number(typeof OVERALL_PADRAO !== "undefined" ? OVERALL_PADRAO : 50),
      ),
    );
    const idadeLimite = ultimaTemporada
      ? Number(carreira.idadeLimite) ||
        (typeof obterIdadeLimite === "function" ? obterIdadeLimite() : 40)
      : Math.max(
          1,
          Math.floor(
            Number($("idade-limite").value) ||
              Number(carreira.idadeLimite) ||
              40,
          ),
        );
    if (!ultimaTemporada && !idadeInicialDentroDoLimite(idade, idadeLimite))
      return;
    if (idade > idadeLimite) {
      informar(
        `A carreira chegou à idade limite (${idadeLimite}). Use a opção de aposentadoria ou inicie outra carreira.`,
        true,
      );
      return;
    }

    let clubeId = ultimaTemporada?.clube || carreira.clube || "";
    const temporadaInicial =
      !ultimaTemporada ||
      !clubesDisponiveis().some((c) => c.id === clubeId) ||
      (carreira.subiuProfissional &&
        typeof temporadaDaBase === "function" &&
        temporadaDaBase(ultimaTemporada));
    const contratoAtivo =
      !temporadaInicial && Number(carreira.anosContratoRestantes) > 0;
    let contratoEscolhido = null;
    let carregamentoTemporadaAtivo = false;
    try {
      carreira.nome = nome;
      carreira.posicaoDetalhe = posicao;
      carreira.posicao =
        (typeof POSICOES_CAMPO !== "undefined" &&
          POSICOES_CAMPO[posicao]?.nome) ||
        posicao;
      carreira.nacionalidade = nacionalidade;
      carreira.idadeLimite = idadeLimite;
      if (!Number.isFinite(Number(carreira.rompimentosContratoUsados)))
        carreira.rompimentosContratoUsados = 0;

      if (simulandoCarreira && carreira.clubeBaseDestinoPendente) {
        const clubeDestino = obterClube(carreira.clubeBaseDestinoPendente);
        if (!clubeDestino)
          throw new Error(
            "O clube escolhido para sair da base não existe mais.",
          );
        contratoEscolhido = criarOfertaContrato(
          clubeDestino,
          idade,
          idadeLimite,
          ultimaTemporada,
          historicoCarreira,
        );
        contratoEscolhido = await confirmarContratoFechado(
          contratoEscolhido,
          ultimaTemporada?.clube || carreira.clube,
        );
        clubeId = contratoEscolhido.clube;
        carreira.clube = clubeId;
        carreira.subiuProfissional = true;
        carreira.clubeBaseDestinoPendente = "";
        carreira.anosContratoRestantes = Math.max(
          0,
          Number(contratoEscolhido.anosContrato) || 0,
        );
        carreira.salarioAtual = Number(contratoEscolhido.salarioProposto) || 0;
      } else if (
        temporadaInicial &&
        simulandoCarreira &&
        carreira.subiuProfissional
      ) {
        const clubesOfertados = sortearClubesParaCarreira(
          3,
          "",
          carreira.clubeAlvo,
          historicoCarreira,
        );
        const clubePrincipalBase = CLUBES_BASE.find(
          (base) => base.id === carreira.baseClube,
        )?.clubePrincipal;
        const clubeBaseAtual = obterClube(
          ultimaTemporada?.clube || carreira.clube,
        );
        const clubeOfertado =
          clubeBaseAtual?.tipo === "base"
            ? obterClube(clubePrincipalBase) || clubesOfertados[0]
            : clubesOfertados.find(
                (clube) => clube.id === clubePrincipalBase,
              ) || clubesOfertados[0];
        if (!clubeOfertado)
          throw new Error(
            "Não foi possível encontrar um clube profissional para receber o jogador promovido.",
          );
        contratoEscolhido = criarOfertaContrato(
          clubeOfertado,
          idade,
          idadeLimite,
          ultimaTemporada,
          historicoCarreira,
        );
        contratoEscolhido = await confirmarContratoFechado(
          contratoEscolhido,
          ultimaTemporada?.clube || carreira.clube,
        );
        clubeId = contratoEscolhido.clube;
        carreira.clube = clubeId;
        carreira.anosContratoRestantes = Math.max(
          0,
          Number(contratoEscolhido.anosContrato) || 0,
        );
        carreira.salarioAtual = Number(contratoEscolhido.salarioProposto) || 0;
      } else if (temporadaInicial) {
        contratoEscolhido = await escolherContratoParaTemporada(
          ultimaTemporada?.clube || carreira.clube,
          true,
          idade,
          idadeLimite,
          carreira,
        );
        if (!contratoEscolhido) return;
        clubeId = contratoEscolhido.clube;
        carreira.clube = clubeId;
        carreira.anosContratoRestantes = Math.max(
          0,
          Number(contratoEscolhido.anosContrato) || 0,
        );
        carreira.salarioAtual = Number(contratoEscolhido.salarioProposto) || 0;
      } else if (contratoAtivo && simulandoCarreira) {
        carreira.anosContratoRestantes =
          Number(carreira.anosContratoRestantes) || 0;
      } else if (contratoAtivo) {
        const acao = await escolherAcaoContrato(
          clubeId,
          carreira.anosContratoRestantes,
        );
        if (!acao) return;
        if (acao === "transferencias") {
          contratoEscolhido = await escolherContratoParaTemporada(
            clubeId,
            false,
            idade,
            idadeLimite,
            carreira,
          );
          if (!contratoEscolhido) return;
          if (contratoEscolhido.clube !== clubeId)
            carreira.rompimentosContratoUsados++;
          clubeId = contratoEscolhido.clube;
          carreira.clube = clubeId;
          carreira.anosContratoRestantes = Math.max(
            0,
            Number(contratoEscolhido.anosContrato) || 0,
          );
          carreira.salarioAtual =
            Number(contratoEscolhido.salarioProposto) ||
            carreira.salarioAtual ||
            0;
        }
      } else if (!contratoAtivo && simulandoCarreira) {
        const clubeAtual = clubesDisponiveis().find((c) => c.id === clubeId);
        contratoEscolhido =
          !carreira.subiuProfissional && clubeAtual?.tipo === "base"
            ? obterOfertaBase(clubeAtual, ultimaTemporada)
            : criarOfertaContrato(
                clubeAtual,
                idade,
                idadeLimite,
                ultimaTemporada,
                historicoCarreira,
              );
        carreira.anosContratoRestantes = Math.max(
          0,
          Number(contratoEscolhido.anosContrato) || 0,
        );
        carreira.salarioAtual =
          clubeAtual?.tipo === "base"
            ? 0
            : Number(contratoEscolhido.salarioProposto) ||
              carreira.salarioAtual ||
              0;
      } else {
        contratoEscolhido = await escolherContratoParaTemporada(
          clubeId,
          false,
          idade,
          idadeLimite,
          carreira,
        );
        if (!contratoEscolhido) return;
        clubeId = contratoEscolhido.clube;
        carreira.clube = clubeId;
        carreira.anosContratoRestantes = Math.max(
          0,
          Number(contratoEscolhido.anosContrato) || 0,
        );
        carreira.salarioAtual =
          Number(contratoEscolhido.salarioProposto) ||
          carreira.salarioAtual ||
          0;
      }
      const clube = clubesDisponiveis().find((c) => c.id === clubeId);
      if (!clube) {
        informar(
          `Não foi possível confirmar o clube escolhido no contrato (${clubeId || "sem clube"}).`,
          true,
        );
        return;
      }
      if (clube.tipo === "base") carreira.baseClube = clube.id;
      const times =
        clube.tipo === "base"
          ? typeof obterClubesCopinhaDaNacionalidade === "function"
            ? obterClubesCopinhaDaNacionalidade(nacionalidade)
            : clubesDisponiveis().filter(
                (c) => c.tipo === "base" && c.nacionalidade === nacionalidade,
              )
          : clubesDisponiveis().filter(
              (c) => c.tipo !== "base" && c.liga === clube.liga,
            );
      if (times.length < 2) {
        informar(
          "Esta liga não tem clubes suficientes para montar o calendário.",
          true,
        );
        return;
      }
      await mostrarCarregamento("Montando calendário e temporada...");
      carregamentoTemporadaAtivo = true;
      if (typeof salvarCarreiraAtual === "function")
        salvarCarreiraAtual(carreira);
      const posicaoDetalhe = posicao;
      const modeloTemporada =
        typeof criarTemporada === "function"
          ? criarTemporada(
              nome,
              idade,
              ano,
              posicaoDetalhe,
              historicoCarreira,
              nacionalidade,
              clubeId,
            )
          : null;
      if (modeloTemporada)
        overall = Math.max(
          1,
          Math.min(99, Number(modeloTemporada.overall) || overall),
        );
      const perfilClube = $("perfil-clube");
      if (perfilClube) perfilClube.textContent = clube.nome;
      const perfilContrato = $("perfil-contrato");
      if (perfilContrato)
        perfilContrato.textContent =
          carreira.anosContratoRestantes > 0
            ? `Contrato ativo · ${carreira.anosContratoRestantes} temporada(s)`
            : "Contrato até o fim da temporada";
      const perfilRompimentos = $("perfil-rompimentos");
      if (perfilRompimentos)
        perfilRompimentos.textContent = `Rompimentos: ${Number(carreira.rompimentosContratoUsados) || 0}/${Number(getConfig()?.geral?.limiteRompimentosContrato) || 3}`;
      const perfilAno = $("perfil-ano");
      if (perfilAno) perfilAno.textContent = String(ano);
      $("nome").value = nome;
      $("idade").value = idade;
      const tabela = times.map((t) => ({
        id: t.id,
        nome: t.nome,
        forca: forcaClube(t),
        j: 0,
        v: 0,
        e: 0,
        d: 0,
        gp: 0,
        gc: 0,
        pts: 0,
      }));
      const rodadas = gerarRodadasLiga(times);
      const perfil = { overall, idade, nacionalidade, posicao };
      const partidas = montarCalendarioTemporada(
        times,
        clube,
        rodadas,
        ano,
        carreira,
        historicoCarreira,
        perfil,
      );
      const gruposCopinha =
        partidas.find((partida) => partida.gruposCopinha)?.gruposCopinha ||
        null;
      partidas.forEach((partida, indice) => {
        partida.numero = indice + 1;
      });
      const classificacaoCopa = obterClassificacaoCopaNaTemporada(
        nacionalidade,
        ano,
      );
      const jogosLesaoAnterior =
        Number(ultimaTemporada?.jogosForaProximaTemporada) || 0;
      estado = {
        versao: 4,
        integrado: true,
        carreiraId: carreira.id,
        nome,
        posicao,
        nacionalidade,
        overall,
        atributos: modeloTemporada?.atributos || null,
        idade,
        idadeLimite,
        ano,
        classificadoCopa: classificacaoCopa.classificado,
        posicaoEliminatorias: classificacaoCopa.posicao,
        clubeId,
        liga: clube.liga,
        rodada: 0,
        rodadas,
        partidas,
        partidasEliminatoriasAnteriores: historicoCarreira.flatMap((t) =>
          Array.isArray(t.partidasEliminatorias) ? t.partidasEliminatorias : [],
        ),
        tabela,
        copinha: gruposCopinha
          ? {
              torneioId: `copinha:${nacionalidade}:${ano}`,
              grupos: gruposCopinha,
              chave: null,
            }
          : null,
        disponibilidade: disponibilidadeInicial(jogosLesaoAnterior),
        desempenhoPosicional: desempenhoPosicionalInicial(),
        estatisticas: {
          jogos: 0,
          gols: 0,
          assistencias: 0,
          jogosClube: 0,
          golsClube: 0,
          assistenciasClube: 0,
          jogosSelecao: 0,
          golsSelecao: 0,
          assistenciasSelecao: 0,
          jogosSelecaoPorCompeticao: {},
          golsSelecaoPorCompeticao: {},
          convocado: partidas.some((p) => p.tipo === "selecao"),
          amarelos: 0,
          vermelhos: 0,
          motm: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          driblesCompletos: 0,
          desarmes: 0,
          defesas: 0,
          jogadasCriadas: 0,
        },
        eventos: [],
        pontosReputacaoTemporada: 0,
        coletivasTemporada: 0,
        relacaoTreinador: 60,
        competicoes: {},
        trofeusClube: [],
        trofeusSelecao: [],
        trofeusColetivos: [],
        trofeusIndividuais: [],
        ultima: null,
        feed: [],
        salvaOficialmente: false,
      };
      prepararElencosLiga();
      salvar();
      renderizar();
      ocultarCarregamento();
      carregamentoTemporadaAtivo = false;
      const convocado = estado.estatisticas.convocado
        ? ` Convocado para ${SELECOES.find((s) => s.id === nacionalidade)?.nome || "a seleção"}; partidas internacionais adicionadas ao calendário.`
        : "";
      informar(
        `Temporada ${ano} iniciada por contrato com ${clube.nome}.${convocado}`,
      );
    } catch (erro) {
      if (carregamentoTemporadaAtivo) ocultarCarregamento();
      console.error("Falha ao preparar temporada jogo a jogo:", erro);
      informar(
        `Não foi possível iniciar a temporada: ${erro.message || erro}`,
        true,
      );
    }
  }
  async function iniciarOuAvancar() {
    if (decisaoEmAndamento) return;
    const carreira =
      typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
    const historico = obterHistoricoCarreira(carreira);
    const novaCarreira =
      carreiraEncerrada(carreira, historico) || !historico.length;
    const campoAnoInicial = $("ano-inicial-carreira");
    if (novaCarreira) {
      const configAno =
        typeof getConfig === "function"
          ? Number(getConfig()?.geral?.anoInicial)
          : Number(typeof ANO_INICIAL !== "undefined" ? ANO_INICIAL : 2026);
      const anoInformado = campoAnoInicial?.value || configAno;
      ANO_INICIAL = limitarAnoInicial(anoInformado, configAno || 2026);
      carreira.anoInicial = ANO_INICIAL;
    } else {
      const anoSalvo =
        Number(carreira.anoInicial) || Number(historico[0]?.ano) || 2026;
      ANO_INICIAL = limitarAnoInicial(anoSalvo);
      carreira.anoInicial = ANO_INICIAL;
    }
    if (campoAnoInicial) {
      campoAnoInicial.value = String(ANO_INICIAL);
      campoAnoInicial.disabled = !novaCarreira;
    }
    if (carreiraEncerrada(carreira, historico)) {
      const idadeInicial = Math.max(16, Number($("idade").value) || 18);
      const idadeLimite = Math.max(
        1,
        Math.floor(
          Number($("idade-limite").value) || Number(carreira.idadeLimite) || 40,
        ),
      );
      if (!idadeInicialDentroDoLimite(idadeInicial, idadeLimite)) return;
      carreira.id =
        typeof gerarIdRanking === "function"
          ? gerarIdRanking()
          : `carreira-${Date.now()}`;
      carreira.clube = "";
      carreira.clubeAlvo = "";
      carreira.clubeBaseDestinoPendente = "";
      carreira.anosContratoRestantes = 0;
      carreira.rompimentosContratoUsados = 0;
      carreira.salarioAtual = 0;
      carreira.saldo = 0;
      carreira.clubeQualificado = "";
      carreira.competicoesQualificadas = [];
      carreira.aposentadoriaSelecao = false;
      carreira.aposentadoriaVoluntaria = false;
      estado = null;
      try {
        localStorage.removeItem(KEY);
      } catch (erro) {
        console.error(
          "Não foi possível limpar o progresso da carreira encerrada:",
          erro,
        );
        informar(
          "Não foi possível iniciar uma nova carreira porque o progresso anterior não pôde ser limpo.",
          true,
        );
        return;
      }
      if (
        typeof salvarCarreiraAtual !== "function" ||
        !salvarCarreiraAtual(carreira)
      ) {
        informar(
          "Não foi possível salvar a nova carreira. Verifique o armazenamento do navegador e tente novamente.",
          true,
        );
        return;
      }
      const resumoFinal = $("resumo-final");
      if (resumoFinal) resumoFinal.hidden = true;
      const resultados = $("resultados");
      if (resultados) resultados.hidden = false;
      renderizar();
    }
    if (campoAnoInicial) campoAnoInicial.disabled = true;
    await iniciar();
    atualizarCampoAnoInicial(
      typeof obterCarreiraAtual === "function"
        ? obterCarreiraAtual()
        : carreira,
      obterHistoricoCarreira(
        typeof obterCarreiraAtual === "function"
          ? obterCarreiraAtual()
          : carreira,
      ),
    );
  }
  async function aposentarJogador() {
    if (decisaoEmAndamento) return;
    if (typeof aposentarVoluntariamente !== "function") {
      informar(
        "A opção de aposentadoria não está disponível nesta página.",
        true,
      );
      return;
    }
    if (typeof confirmarAcao !== "function") {
      informar(
        "O modal de confirmação não está disponível nesta página.",
        true,
      );
      return;
    }

    const carreira =
      typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
    const emAndamento = temporadaEmAndamento(carreira);

    const mensagem = emAndamento
      ? "A temporada atual será concluída automaticamente antes da aposentadoria.\n\nTem certeza que deseja aposentar o jogador agora?"
      : "Tem certeza que deseja aposentar o jogador agora?\n\nA carreira será registrada no ranking e não poderá ser retomada.";

    const confirmado = await confirmarAcao(mensagem, "Confirmar aposentadoria");
    if (!confirmado) return;

    if (emAndamento) {
      await mostrarCarregamento(
        "Concluindo a temporada atual antes da aposentadoria...",
      );
      try {
        simularRestantes();
      } finally {
        ocultarCarregamento();
      }
      if (!estado?.salvaOficialmente) return;
    }

    // Já confirmamos acima; evita a segunda confirmação dentro de aposentarVoluntariamente().
    await aposentarVoluntariamente(true);
    atualizarCampoAnoInicial(
      typeof obterCarreiraAtual === "function"
        ? obterCarreiraAtual()
        : carreira,
      obterHistoricoCarreira(
        typeof obterCarreiraAtual === "function"
          ? obterCarreiraAtual()
          : carreira,
      ),
    );
    renderizar();
  }

  function registrarResultado(timeCasa, timeFora, golsCasa, golsFora) {
    const casa = estado.tabela.find((t) => t.id === timeCasa.id),
      fora = estado.tabela.find((t) => t.id === timeFora.id);
    if (!casa || !fora) return;
    casa.j++;
    fora.j++;
    casa.gp += golsCasa;
    casa.gc += golsFora;
    fora.gp += golsFora;
    fora.gc += golsCasa;
    if (golsCasa > golsFora) {
      casa.v++;
      casa.pts += 3;
      fora.d++;
    } else if (golsFora > golsCasa) {
      fora.v++;
      fora.pts += 3;
      casa.d++;
    } else {
      casa.e++;
      fora.e++;
      casa.pts++;
      fora.pts++;
    }
  }

  const POSICOES_ELENCO_LIGA = [
    "GOL",
    "ZCE",
    "ZCD",
    "LE",
    "LD",
    "ME",
    "MC",
    "MD",
    "PE",
    "CA",
    "PD",
  ];
  const NOMES_JOGADORES_LIGA = [
    "Rafael",
    "Lucas",
    "Mateus",
    "Caio",
    "Bruno",
    "Daniel",
    "Enzo",
    "Felipe",
    "Gabriel",
    "Igor",
    "Joao",
    "Leandro",
    "Marcos",
    "Nicolas",
    "Otavio",
    "Pedro",
    "Renan",
    "Samuel",
    "Thiago",
    "Vitor",
    "Andre",
    "Davi",
    "Eduardo",
    "Gustavo",
    "Heitor",
    "Murilo",
    "Ruan",
    "Yuri",
    "Alisson",
    "Anderson",
    "Arthur",
    "Bernardo",
    "Breno",
    "Carlos",
    "Cristian",
    "Diego",
    "Douglas",
    "Everton",
    "Fabio",
    "Fernando",
    "Francisco",
    "Guilherme",
    "Hugo",
    "Jackson",
    "Jefferson",
    "Jorge",
    "Julio",
    "Kaua",
    "Kevin",
    "Leonardo",
    "Lorenzo",
    "Luis",
    "Marcelo",
    "Miguel",
    "Nathan",
    "Paulo",
    "Raul",
    "Ricardo",
    "Robson",
    "Rodrigo",
    "Ronaldo",
    "Romulo",
    "Sergio",
    "Tadeu",
    "Vinicius",
    "Wallace",
    "Wesley",
    "William",
    "Abel",
    "Adriano",
    "Alessandro",
    "Alex",
    "Alexandre",
    "Afonso",
    "Amadou",
    "André",
    "Antoine",
    "Bastien",
    "Benjamin",
    "Boubacar",
    "Cédric",
    "Demba",
    "Denis",
    "Emmanuel",
    "Enrique",
    "Esteban",
    "Fabian",
    "Farid",
    "Gerson",
    "Hakim",
    "Hassan",
    "Ibrahim",
    "Ismael",
    "Jean",
    "Jonathan",
    "Josué",
    "Karim",
    "Lamine",
    "Manuel",
    "Mehdi",
    "Nabil",
    "Omar",
    "Pablo",
    "Rayan",
    "Santiago",
    "Sergio",
    "Souleymane",
    "Tiago",
    "Youssef",
    "Zinedine",
  ];
  const SOBRENOMES_JOGADORES_LIGA = [
    "Almeida",
    "Barbosa",
    "Cardoso",
    "Dias",
    "Esteves",
    "Ferreira",
    "Gomes",
    "Lopes",
    "Martins",
    "Mendes",
    "Nogueira",
    "Oliveira",
    "Pereira",
    "Ramos",
    "Ribeiro",
    "Rocha",
    "Santana",
    "Silva",
    "Teixeira",
    "Vieira",
    "Azevedo",
    "Castro",
    "Freitas",
    "Monteiro",
    "Moreira",
    "Rezende",
    "Santos",
    "Tavares",
    "Abreu",
    "Aguiar",
    "Andrade",
    "Antunes",
    "Assis",
    "Batista",
    "Brito",
    "Bueno",
    "Cabral",
    "Camargo",
    "Campos",
    "Cavalcante",
    "Chagas",
    "Coelho",
    "Correia",
    "Cunha",
    "Dantas",
    "Duarte",
    "Farias",
    "Figueiredo",
    "Fonseca",
    "Franco",
    "Garcia",
    "Guimaraes",
    "Leite",
    "Macedo",
    "Machado",
    "Marques",
    "Melo",
    "Miranda",
    "Moraes",
    "Neves",
    "Pacheco",
    "Paiva",
    "Peixoto",
    "Pinheiro",
    "Queiroz",
    "Reis",
    "Sales",
    "Sampaio",
    "Saraiva",
    "Soares",
    "Souza",
    "Torres",
    "Valente",
    "Abdallah",
    "Alves",
    "Benali",
    "Borges",
    "Camara",
    "Carvalho",
    "Costa",
    "Diallo",
    "Fernandes",
    "Ferreira Lima",
    "Gonçalves",
    "Haddad",
    "Ibrahim",
    "Jallow",
    "Kaboré",
    "Kone",
    "Lima",
    "Machado Silva",
    "Mendes Costa",
    "Morel",
    "Nascimento",
    "Ndiaye",
    "Pinto",
    "Quevedo",
    "Rodrigues",
    "Sanchez",
    "Sow",
    "Traoré",
    "Varela",
    "Vieira Costa",
    "Williams",
    "Yilmaz",
    "Zouma",
  ];

  const JOGADORES_REAIS = [
    {
      id: "messi",
      nome: "Lionel Messi",
      anoNascimento: 1987,
      clube: "inter-miami",
      posicao: "PD",
      idadeAposentadoria: 41,
      destinos: ["newells-old-boys"],
      chanceTransferencia: 0.05,
      pesoRanking: 8.0,
      pesoRankingPico: 12,
      anoInicioProfissional: 2004,
      anosPico: [2009, 2022],
      clubesHistoricos: [
        { inicio: 2004, fim: 2020, clube: "barcelona" },
        { inicio: 2021, fim: 2022, clube: "paris-saint-germain" },
        { inicio: 2023, fim: 2025, clube: "inter-miami" },
      ],
    },
    {
      id: "cristiano-ronaldo",
      nome: "Cristiano Ronaldo",
      anoNascimento: 1985,
      clube: "al-nassr",
      posicao: "CA",
      idadeAposentadoria: 42,
      destinos: ["sporting-cp", "al-hilal"],
      chanceTransferencia: 0.08,
      pesoRanking: 8.0,
      pesoRankingPico: 12,
      anoInicioProfissional: 2002,
      anosPico: [2008, 2019],
      clubesHistoricos: [
        { inicio: 2002, fim: 2003, clube: "sporting-cp" },
        { inicio: 2004, fim: 2008, clube: "manchester-united" },
        { inicio: 2009, fim: 2017, clube: "real-madrid" },
        { inicio: 2018, fim: 2020, clube: "juventus" },
        { inicio: 2021, fim: 2022, clube: "manchester-united" },
        { inicio: 2023, fim: 2025, clube: "al-nassr" },
      ],
    },
    {
      id: "neymar",
      nome: "Neymar Jr.",
      anoNascimento: 1992,
      clube: "santos",
      posicao: "PE",
      idadeAposentadoria: 39,
      destinos: ["al-hilal", "inter-miami"],
      chanceTransferencia: 0.16,
      pesoRanking: 8.0,
      pesoRankingPico: 12,
      anoInicioProfissional: 2009,
      anosPico: [2011, 2022],
      clubesHistoricos: [
        { inicio: 2009, fim: 2013, clube: "santos" },
        { inicio: 2014, fim: 2017, clube: "barcelona" },
        { inicio: 2018, fim: 2023, clube: "paris-saint-germain" },
        { inicio: 2024, fim: 2024, clube: "al-hilal" },
        { inicio: 2025, fim: 2025, clube: "santos" },
      ],
    },
    {
      id: "haydex",
      nome: "Haydex",
      anoNascimento: 2009,
      clube: "ceara",
      posicao: "CA",
      idadeAposentadoria: 41,
      destinos: ["ceara", "sao-paulo"],
      chanceTransferencia: 0.1,
      pesoRanking: 10,
      pesoRankingPico: 12,
      anoInicioProfissional: 2026,
      anosPico: [2033, 2046],
      clubesHistoricos: [
        { inicio: 2026, fim: 2027, clube: "ceara" },
        { inicio: 2028, fim: 2029, clube: "sao-paulo" },
        { inicio: 2030, fim: 2038, clube: "milan" },
        { inicio: 2039, fim: 2050, clube: "barcelona" },
      ],
    },
    {
      id: "ysmart",
      nome: "Ysmart",
      anoNascimento: 2009,
      clube: "santos",
      posicao: "CA",
      idadeAposentadoria: 41,
      destinos: ["santos", "chelsea"],
      chanceTransferencia: 0.1,
      pesoRanking: 10,
      pesoRankingPico: 12,
      anoInicioProfissional: 2026,
      anosPico: [2033, 2046],
      clubesHistoricos: [
        { inicio: 2026, fim: 2030, clube: "santos" },
        { inicio: 2031, fim: 2037, clube: "bayern-munich" },
        { inicio: 2038, fim: 2044, clube: "inter" },
        { inicio: 2045, fim: 2050, clube: "barcelona" },
      ],
    },
    {
      id: "luis-suarez",
      nome: "Luis Suárez",
      anoNascimento: 1987,
      clube: "inter-miami",
      posicao: "CA",
      idadeAposentadoria: 40,
      destinos: ["santos", "newells-old-boys"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.1,
    },
    {
      id: "modric",
      nome: "Luka Modrić",
      anoNascimento: 1985,
      clube: "milan",
      posicao: "MC",
      idadeAposentadoria: 41,
      destinos: ["real-madrid", "inter"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.8,
    },
    {
      id: "lewandowski",
      nome: "Robert Lewandowski",
      anoNascimento: 1988,
      clube: "barcelona",
      posicao: "CA",
      idadeAposentadoria: 40,
      destinos: ["bayern-munich", "milan"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.2,
    },
    {
      id: "mohamed-salah",
      nome: "Mohamed Salah",
      anoNascimento: 1992,
      clube: "liverpool",
      posicao: "PD",
      idadeAposentadoria: 39,
      destinos: ["al-nassr", "inter-miami"],
      chanceTransferencia: 0.14,
      pesoRanking: 3.3,
    },
    {
      id: "virgil-van-dijk",
      nome: "Virgil van Dijk",
      anoNascimento: 1991,
      clube: "liverpool",
      posicao: "ZCD",
      idadeAposentadoria: 39,
      destinos: ["bayern-munich", "paris-saint-germain"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.8,
    },
    {
      id: "kevin-de-bruyne",
      nome: "Kevin De Bruyne",
      anoNascimento: 1991,
      clube: "napoli",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["manchester-city", "inter-miami"],
      chanceTransferencia: 0.14,
      pesoRanking: 3.1,
    },
    {
      id: "harry-kane",
      nome: "Harry Kane",
      anoNascimento: 1993,
      clube: "bayern-munich",
      posicao: "CA",
      idadeAposentadoria: 40,
      destinos: ["manchester-city", "tottenham"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.6,
    },
    {
      id: "kylian-mbappe",
      nome: "Kylian Mbappé",
      anoNascimento: 1998,
      clube: "real-madrid",
      posicao: "PE",
      idadeAposentadoria: 39,
      destinos: ["paris-saint-germain", "liverpool"],
      chanceTransferencia: 0.1,
      pesoRanking: 6.0,
      pesoRankingPico: 12,
      anoInicioProfissional: 2015,
      anosPico: [2018, 2026],
      clubesHistoricos: [
        { inicio: 2015, fim: 2017, clube: "monaco" },
        { inicio: 2018, fim: 2024, clube: "paris-saint-germain" },
        { inicio: 2025, fim: 2025, clube: "real-madrid" },
      ],
    },
    {
      id: "vinicius-junior",
      nome: "Vinícius Júnior",
      anoNascimento: 2000,
      clube: "real-madrid",
      posicao: "PE",
      idadeAposentadoria: 40,
      destinos: ["paris-saint-germain", "manchester-city"],
      chanceTransferencia: 0.12,
      pesoRanking: 4.2,
      pesoRankingPico: 10,
      anoInicioProfissional: 2017,
      anosPico: [2022, 2030],
      clubesHistoricos: [
        { inicio: 2017, fim: 2018, clube: "flamengo" },
        { inicio: 2019, fim: 2025, clube: "real-madrid" },
      ],
    },
    {
      id: "jude-bellingham",
      nome: "Jude Bellingham",
      anoNascimento: 2003,
      clube: "real-madrid",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["liverpool", "manchester-city"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.4,
    },
    {
      id: "rodrygo",
      nome: "Rodrygo",
      anoNascimento: 2001,
      clube: "real-madrid",
      posicao: "PD",
      idadeAposentadoria: 39,
      destinos: ["liverpool", "manchester-city"],
      chanceTransferencia: 0.14,
      pesoRanking: 2.9,
    },
    {
      id: "lamine-yamal",
      nome: "Lamine Yamal",
      anoNascimento: 2007,
      clube: "barcelona",
      posicao: "PD",
      idadeAposentadoria: 40,
      destinos: ["paris-saint-germain", "manchester-city"],
      chanceTransferencia: 0.1,
      pesoRanking: 7,
      pesoRankingPico: 10,
      anoInicioProfissional: 2023,
      anosPico: [2026, 2035],
      clubesHistoricos: [{ inicio: 2023, fim: 2025, clube: "barcelona" }],
    },
    {
      id: "pedri",
      nome: "Pedri",
      anoNascimento: 2002,
      clube: "barcelona",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["manchester-city", "bayern-munich"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.0,
    },
    {
      id: "erling-haaland",
      nome: "Erling Haaland",
      anoNascimento: 2000,
      clube: "manchester-city",
      posicao: "CA",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "bayern-munich"],
      chanceTransferencia: 0.12,
      pesoRanking: 7,
      pesoRankingPico: 10,
      anoInicioProfissional: 2020,
      anosPico: [2022, 2031],
      clubesHistoricos: [
        { inicio: 2020, fim: 2021, clube: "borussia-dortmund" },
        { inicio: 2022, fim: 2025, clube: "manchester-city" },
      ],
    },
    {
      id: "bukayo-saka",
      nome: "Bukayo Saka",
      anoNascimento: 2001,
      clube: "arsenal",
      posicao: "PD",
      idadeAposentadoria: 40,
      destinos: ["liverpool", "manchester-city"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.0,
    },
    {
      id: "lautaro-martinez",
      nome: "Lautaro Martínez",
      anoNascimento: 1997,
      clube: "inter",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["barcelona", "atletico-madrid"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.1,
    },
    {
      id: "endrick",
      nome: "Endrick",
      anoNascimento: 2006,
      clube: "real-madrid",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["santos", "liverpool"],
      chanceTransferencia: 0.14,
      pesoRanking: 2.9,
    },
    {
      id: "alisson-becker",
      nome: "Alisson Becker",
      anoNascimento: 1992,
      clube: "liverpool",
      posicao: "GOL",
      idadeAposentadoria: 40,
      destinos: ["bayern-munich", "juventus"],
      chanceTransferencia: 0.08,
      pesoRanking: 2.5,
    },
    {
      id: "alexis-mac-allister",
      nome: "Alexis Mac Allister",
      anoNascimento: 1998,
      clube: "liverpool",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "inter"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.9,
    },
    {
      id: "dominik-szoboszlai",
      nome: "Dominik Szoboszlai",
      anoNascimento: 2000,
      clube: "liverpool",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "bayern-munich"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.7,
    },
    {
      id: "cody-gakpo",
      nome: "Cody Gakpo",
      anoNascimento: 1999,
      clube: "liverpool",
      posicao: "PE",
      idadeAposentadoria: 39,
      destinos: ["barcelona", "bayern-munich"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.8,
    },
    {
      id: "florian-wirtz",
      nome: "Florian Wirtz",
      anoNascimento: 2003,
      clube: "liverpool",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "manchester-city"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.2,
    },
    {
      id: "hugo-ekitike",
      nome: "Hugo Ekitike",
      anoNascimento: 2002,
      clube: "liverpool",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["paris-saint-germain", "real-madrid"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.7,
    },
    {
      id: "gabriel-magalhaes",
      nome: "Gabriel Magalhães",
      anoNascimento: 1997,
      clube: "arsenal",
      posicao: "ZCE",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "juventus"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.7,
    },
    {
      id: "william-saliba",
      nome: "William Saliba",
      anoNascimento: 2001,
      clube: "arsenal",
      posicao: "ZCD",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "paris-saint-germain"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.8,
    },
    {
      id: "declan-rice",
      nome: "Declan Rice",
      anoNascimento: 1999,
      clube: "arsenal",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["manchester-city", "real-madrid"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.1,
    },
    {
      id: "martin-odegaard",
      nome: "Martin Ødegaard",
      anoNascimento: 1998,
      clube: "arsenal",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["real-madrid", "inter"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.9,
    },
    {
      id: "phil-foden",
      nome: "Phil Foden",
      anoNascimento: 2000,
      clube: "manchester-city",
      posicao: "PD",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "bayern-munich"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.0,
    },
    {
      id: "rodri",
      nome: "Rodri",
      anoNascimento: 1996,
      clube: "manchester-city",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["real-madrid", "inter"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.3,
    },
    {
      id: "ruben-dias",
      nome: "Rúben Dias",
      anoNascimento: 1997,
      clube: "manchester-city",
      posicao: "ZCD",
      idadeAposentadoria: 40,
      destinos: ["bayern-munich", "paris-saint-germain"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.7,
    },
    {
      id: "bernardo-silva",
      nome: "Bernardo Silva",
      anoNascimento: 1994,
      clube: "manchester-city",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["barcelona", "benfica"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.0,
    },
    {
      id: "cole-palmer",
      nome: "Cole Palmer",
      anoNascimento: 2002,
      clube: "chelsea",
      posicao: "PD",
      idadeAposentadoria: 40,
      destinos: ["manchester-city", "real-madrid"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.8,
    },
    {
      id: "enzo-fernandez",
      nome: "Enzo Fernández",
      anoNascimento: 2001,
      clube: "chelsea",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "inter"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.8,
    },
    {
      id: "reece-james",
      nome: "Reece James",
      anoNascimento: 1999,
      clube: "chelsea",
      posicao: "LD",
      idadeAposentadoria: 38,
      destinos: ["real-madrid", "bayern-munich"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.5,
    },
    {
      id: "bruno-fernandes",
      nome: "Bruno Fernandes",
      anoNascimento: 1994,
      clube: "manchester-united",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["inter", "bayern-munich"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.9,
    },
    {
      id: "kobbie-mainoo",
      nome: "Kobbie Mainoo",
      anoNascimento: 2005,
      clube: "manchester-united",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "barcelona"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.7,
    },
    {
      id: "james-maddison",
      nome: "James Maddison",
      anoNascimento: 1996,
      clube: "tottenham",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["manchester-united", "aston-villa"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.6,
    },
    {
      id: "micky-van-de-ven",
      nome: "Micky van de Ven",
      anoNascimento: 2001,
      clube: "tottenham",
      posicao: "ZCE",
      idadeAposentadoria: 40,
      destinos: ["liverpool", "bayern-munich"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.6,
    },
    {
      id: "dominic-solanke",
      nome: "Dominic Solanke",
      anoNascimento: 1997,
      clube: "tottenham",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["liverpool", "aston-villa"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.6,
    },
    {
      id: "bruno-guimaraes",
      nome: "Bruno Guimarães",
      anoNascimento: 1997,
      clube: "newcastle",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["manchester-city", "paris-saint-germain"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.8,
    },
    {
      id: "anthony-gordon",
      nome: "Anthony Gordon",
      anoNascimento: 2001,
      clube: "newcastle",
      posicao: "PE",
      idadeAposentadoria: 39,
      destinos: ["liverpool", "manchester-city"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.7,
    },
    {
      id: "sandro-tonali",
      nome: "Sandro Tonali",
      anoNascimento: 2000,
      clube: "newcastle",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["milan", "juventus"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.7,
    },
    {
      id: "ollie-watkins",
      nome: "Ollie Watkins",
      anoNascimento: 1995,
      clube: "aston-villa",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["arsenal", "manchester-united"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.7,
    },
    {
      id: "emiliano-martinez",
      nome: "Emiliano Martínez",
      anoNascimento: 1992,
      clube: "aston-villa",
      posicao: "GOL",
      idadeAposentadoria: 40,
      destinos: ["manchester-united", "inter"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.5,
    },
    {
      id: "thibaut-courtois",
      nome: "Thibaut Courtois",
      anoNascimento: 1992,
      clube: "real-madrid",
      posicao: "GOL",
      idadeAposentadoria: 40,
      destinos: ["chelsea", "bayern-munich"],
      chanceTransferencia: 0.08,
      pesoRanking: 2.6,
    },
    {
      id: "federico-valverde",
      nome: "Federico Valverde",
      anoNascimento: 1998,
      clube: "real-madrid",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["manchester-city", "liverpool"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.0,
    },
    {
      id: "eduardo-camavinga",
      nome: "Eduardo Camavinga",
      anoNascimento: 2002,
      clube: "real-madrid",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["paris-saint-germain", "liverpool"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.9,
    },
    {
      id: "aurelien-tchouameni",
      nome: "Aurélien Tchouaméni",
      anoNascimento: 2000,
      clube: "real-madrid",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["liverpool", "paris-saint-germain"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.9,
    },
    {
      id: "arda-guler",
      nome: "Arda Güler",
      anoNascimento: 2005,
      clube: "real-madrid",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["liverpool", "manchester-city"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.6,
    },
    {
      id: "raphinha",
      nome: "Raphinha",
      anoNascimento: 1996,
      clube: "barcelona",
      posicao: "PD",
      idadeAposentadoria: 39,
      destinos: ["paris-saint-germain", "arsenal"],
      chanceTransferencia: 0.1,
      pesoRanking: 7,
    },
    {
      id: "gavi",
      nome: "Gavi",
      anoNascimento: 2004,
      clube: "barcelona",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["manchester-city", "bayern-munich"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.8,
    },
    {
      id: "dani-olmo",
      nome: "Dani Olmo",
      anoNascimento: 1998,
      clube: "barcelona",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["manchester-city", "bayern-munich"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.8,
    },
    {
      id: "ronald-araujo",
      nome: "Ronald Araújo",
      anoNascimento: 1999,
      clube: "barcelona",
      posicao: "ZCD",
      idadeAposentadoria: 40,
      destinos: ["manchester-united", "bayern-munich"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.8,
    },
    {
      id: "jules-kounde",
      nome: "Jules Koundé",
      anoNascimento: 1998,
      clube: "barcelona",
      posicao: "LD",
      idadeAposentadoria: 39,
      destinos: ["chelsea", "paris-saint-germain"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.7,
    },
    {
      id: "jan-oblak",
      nome: "Jan Oblak",
      anoNascimento: 1993,
      clube: "atletico-madrid",
      posicao: "GOL",
      idadeAposentadoria: 40,
      destinos: ["paris-saint-germain", "inter"],
      chanceTransferencia: 0.08,
      pesoRanking: 2.7,
    },
    {
      id: "julian-alvarez",
      nome: "Julián Álvarez",
      anoNascimento: 2000,
      clube: "atletico-madrid",
      posicao: "CA",
      idadeAposentadoria: 40,
      destinos: ["manchester-city", "barcelona"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.4,
    },
    {
      id: "antoine-griezmann",
      nome: "Antoine Griezmann",
      anoNascimento: 1991,
      clube: "atletico-madrid",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["real-madrid", "inter-miami"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.0,
    },
    {
      id: "manuel-neuer",
      nome: "Manuel Neuer",
      anoNascimento: 1986,
      clube: "bayern-munich",
      posicao: "GOL",
      idadeAposentadoria: 41,
      destinos: ["real-madrid", "inter"],
      chanceTransferencia: 0.06,
      pesoRanking: 3.1,
    },
    {
      id: "sergio-ramos",
      nome: "Sergio Ramos",
      anoNascimento: 1986,
      clube: "real-madrid",
      posicao: "ZCD",
      idadeAposentadoria: 40,
      destinos: ["paris-saint-germain", "inter-miami"],
      chanceTransferencia: 0.09,
      pesoRanking: 3.1,
    },
    {
      id: "marquinhos",
      nome: "Marquinhos",
      anoNascimento: 1994,
      clube: "paris-saint-germain",
      posicao: "ZCD",
      idadeAposentadoria: 40,
      destinos: ["barcelona", "real-madrid"],
      chanceTransferencia: 0.08,
      pesoRanking: 3.2,
    },
    {
      id: "gianluigi-donnarumma",
      nome: "Gianluigi Donnarumma",
      anoNascimento: 1999,
      clube: "paris-saint-germain",
      posicao: "GOL",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "manchester-city"],
      chanceTransferencia: 0.08,
      pesoRanking: 3.2,
    },
    {
      id: "antonio-rudiger",
      nome: "Antonio Rüdiger",
      anoNascimento: 1993,
      clube: "real-madrid",
      posicao: "ZCD",
      idadeAposentadoria: 40,
      destinos: ["chelsea", "bayern-munich"],
      chanceTransferencia: 0.08,
      pesoRanking: 2.9,
    },
    {
      id: "david-alaba",
      nome: "David Alaba",
      anoNascimento: 1992,
      clube: "real-madrid",
      posicao: "ZCD",
      idadeAposentadoria: 39,
      destinos: ["bayern-munich", "inter"],
      chanceTransferencia: 0.09,
      pesoRanking: 2.9,
    },
    {
      id: "joao-cancelo",
      nome: "João Cancelo",
      anoNascimento: 1994,
      clube: "manchester-city",
      posicao: "LD",
      idadeAposentadoria: 39,
      destinos: ["real-madrid", "barcelona"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.9,
    },
    {
      id: "kim-min-jae",
      nome: "Kim Min-jae",
      anoNascimento: 1996,
      clube: "bayern-munich",
      posicao: "ZCD",
      idadeAposentadoria: 40,
      destinos: ["inter", "real-madrid"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.8,
    },
    {
      id: "jamal-musiala",
      nome: "Jamal Musiala",
      anoNascimento: 2003,
      clube: "bayern-munich",
      posicao: "PE",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "manchester-city"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.6,
    },
    {
      id: "joshua-kimmich",
      nome: "Joshua Kimmich",
      anoNascimento: 1995,
      clube: "bayern-munich",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["real-madrid", "manchester-city"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.2,
    },
    {
      id: "osimhen",
      nome: "Victor Osimhen",
      anoNascimento: 1998,
      clube: "napoli",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["real-madrid", "paris-saint-germain"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.7,
    },
    {
      id: "dusan-vlahovic",
      nome: "Dušan Vlahović",
      anoNascimento: 2000,
      clube: "juventus",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["real-madrid", "manchester-city"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.1,
    },
    {
      id: "alexander-isak",
      nome: "Alexander Isak",
      anoNascimento: 1999,
      clube: "newcastle",
      posicao: "CA",
      idadeAposentadoria: 40,
      destinos: ["arsenal", "liverpool"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.2,
    },
    {
      id: "heung-min-son",
      nome: "Heung-Min Son",
      anoNascimento: 1992,
      clube: "tottenham",
      posicao: "PE",
      idadeAposentadoria: 39,
      destinos: ["al-nassr", "inter-miami"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.0,
    },
    {
      id: "kieran-trippier",
      nome: "Kieran Trippier",
      anoNascimento: 1990,
      clube: "newcastle",
      posicao: "LD",
      idadeAposentadoria: 39,
      destinos: ["arsenal", "real-madrid"],
      chanceTransferencia: 0.08,
      pesoRanking: 2.6,
    },
    {
      id: "martinelli",
      nome: "Gabriel Martinelli",
      anoNascimento: 2001,
      clube: "arsenal",
      posicao: "PE",
      idadeAposentadoria: 39,
      destinos: ["barcelona", "manchester-city"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.9,
    },
    {
      id: "gabriel-jesus",
      nome: "Gabriel Jesus",
      anoNascimento: 1997,
      clube: "arsenal",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["inter", "milan"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.9,
    },
    {
      id: "ivan-toney",
      nome: "Ivan Toney",
      anoNascimento: 1996,
      clube: "brentford",
      posicao: "CA",
      idadeAposentadoria: 38,
      destinos: ["arsenal", "chelsea"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.7,
    },
    {
      id: "sergio-busquets",
      nome: "Sergio Busquets",
      anoNascimento: 1988,
      clube: "inter-miami",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["barcelona", "real-madrid"],
      chanceTransferencia: 0.08,
      pesoRanking: 2.8,
    },
    {
      id: "alvaro-morata",
      nome: "Álvaro Morata",
      anoNascimento: 1992,
      clube: "milan",
      posicao: "CA",
      idadeAposentadoria: 39,
      destinos: ["barcelona", "inter"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.8,
    },
    {
      id: "franck-kessie",
      nome: "Franck Kessié",
      anoNascimento: 1996,
      clube: "barcelona",
      posicao: "MC",
      idadeAposentadoria: 40,
      destinos: ["milan", "al-nassr"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.8,
    },
    {
      id: "khvicha-kvaratskhelia",
      nome: "Khvicha Kvaratskhelia",
      anoNascimento: 2001,
      clube: "napoli",
      posicao: "PE",
      idadeAposentadoria: 40,
      destinos: ["paris-saint-germain", "real-madrid"],
      chanceTransferencia: 0.12,
      pesoRanking: 6,
    },
    {
      id: "sadio-mane",
      nome: "Sadio Mané",
      anoNascimento: 1992,
      clube: "al-nassr",
      posicao: "PE",
      idadeAposentadoria: 39,
      destinos: ["liverpool", "bayern-munich"],
      chanceTransferencia: 0.1,
      pesoRanking: 3.1,
    },
    {
      id: "michael-olise",
      nome: "Michael Olise",
      anoNascimento: 2001,
      clube: "chelsea",
      posicao: "PE",
      idadeAposentadoria: 40,
      destinos: ["manchester-city", "real-madrid"],
      chanceTransferencia: 0.12,
      pesoRanking: 3.1,
    },
    {
      id: "pedro-neto",
      nome: "Pedro Neto",
      anoNascimento: 2000,
      clube: "chelsea",
      posicao: "PE",
      idadeAposentadoria: 39,
      destinos: ["arsenal", "manchester-city"],
      chanceTransferencia: 0.12,
      pesoRanking: 2.7,
    },
    {
      id: "leo-paredes",
      nome: "Leandro Paredes",
      anoNascimento: 1994,
      clube: "paris-saint-germain",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["inter", "juventus"],
      chanceTransferencia: 0.09,
      pesoRanking: 2.7,
    },
    {
      id: "ruben-neves",
      nome: "Rúben Neves",
      anoNascimento: 1997,
      clube: "al-nassr",
      posicao: "MC",
      idadeAposentadoria: 39,
      destinos: ["barcelona", "manchester-city"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.8,
    },
    {
      id: "samuel-umtiti",
      nome: "Samuel Umtiti",
      anoNascimento: 1993,
      clube: "inter-miami",
      posicao: "ZCD",
      idadeAposentadoria: 38,
      destinos: ["barcelona", "milan"],
      chanceTransferencia: 0.08,
      pesoRanking: 2.6,
    },
    {
      id: "milan-skriniar",
      nome: "Milan Škriniar",
      anoNascimento: 1995,
      clube: "inter",
      posicao: "ZCD",
      idadeAposentadoria: 39,
      destinos: ["real-madrid", "paris-saint-germain"],
      chanceTransferencia: 0.1,
      pesoRanking: 2.8,
    },
    {
      id: "nicolas-otamendi",
      nome: "Nicolás Otamendi",
      anoNascimento: 1988,
      clube: "inter-miami",
      posicao: "ZCD",
      idadeAposentadoria: 40,
      destinos: ["benfica", "porto"],
      chanceTransferencia: 0.08,
      pesoRanking: 2.5,
    },
    {
      id: "jordan-henderson",
      nome: "Jordan Henderson",
      anoNascimento: 1990,
      clube: "al-nassr",
      posicao: "MC",
      idadeAposentadoria: 38,
      destinos: ["liverpool", "newcastle"],
      chanceTransferencia: 0.08,
      pesoRanking: 2.6,
    },
    {
      id: "zinedine-zidane",
      nome: "Zinedine Zidane",
      anoNascimento: 1972,
      clube: "real-madrid",
      posicao: "MC",
      idadeAposentadoria: 34,
      pesoRanking: 4.2,
      pesoRankingPico: 8.5,
      anoInicioProfissional: 1989,
      anosPico: [2000, 2006],
      clubesHistoricos: [
        { inicio: 2000, fim: 2001, clube: "juventus" },
        { inicio: 2002, fim: 2006, clube: "real-madrid" },
      ],
    },
    {
      id: "ronaldo-nazario",
      nome: "Ronaldo Nazário",
      anoNascimento: 1976,
      clube: "real-madrid",
      posicao: "CA",
      idadeAposentadoria: 35,
      pesoRanking: 4.4,
      pesoRankingPico: 9,
      anoInicioProfissional: 1993,
      anosPico: [1997, 2002],
      clubesHistoricos: [
        { inicio: 2000, fim: 2002, clube: "inter" },
        { inicio: 2003, fim: 2007, clube: "real-madrid" },
        { inicio: 2008, fim: 2008, clube: "milan" },
        { inicio: 2009, fim: 2011, clube: "corinthians" },
      ],
    },
    {
      id: "ronaldinho-gaucho",
      nome: "Ronaldinho Gaúcho",
      anoNascimento: 1980,
      clube: "flamengo",
      posicao: "PE",
      idadeAposentadoria: 35,
      pesoRanking: 5.5,
      pesoRankingPico: 11,
      anoInicioProfissional: 1998,
      anosPico: [2004, 2006],
      clubesHistoricos: [
        { inicio: 2001, fim: 2003, clube: "paris-saint-germain" },
        { inicio: 2004, fim: 2008, clube: "barcelona" },
        { inicio: 2009, fim: 2010, clube: "milan" },
        { inicio: 2011, fim: 2012, clube: "flamengo" },
        { inicio: 2013, fim: 2014, clube: "fluminense" },
      ],
    },
    {
      id: "luis-figo",
      nome: "Luís Figo",
      anoNascimento: 1972,
      clube: "inter",
      posicao: "PD",
      idadeAposentadoria: 36,
      pesoRanking: 3.6,
      pesoRankingPico: 7.2,
      anoInicioProfissional: 1989,
      anosPico: [2000, 2002],
      clubesHistoricos: [
        { inicio: 2000, fim: 2000, clube: "barcelona" },
        { inicio: 2001, fim: 2005, clube: "real-madrid" },
        { inicio: 2006, fim: 2009, clube: "inter" },
      ],
    },
    {
      id: "thierry-henry",
      nome: "Thierry Henry",
      anoNascimento: 1977,
      clube: "barcelona",
      posicao: "CA",
      idadeAposentadoria: 37,
      pesoRanking: 4,
      pesoRankingPico: 8,
      anoInicioProfissional: 1994,
      anosPico: [2002, 2006],
      clubesHistoricos: [
        { inicio: 2000, fim: 2007, clube: "arsenal" },
        { inicio: 2008, fim: 2010, clube: "barcelona" },
        { inicio: 2011, fim: 2014, clube: "arsenal" },
      ],
    },
    {
      id: "david-beckham",
      nome: "David Beckham",
      anoNascimento: 1975,
      clube: "real-madrid",
      posicao: "MD",
      idadeAposentadoria: 38,
      pesoRanking: 3.4,
      pesoRankingPico: 6.8,
      anoInicioProfissional: 1992,
      anosPico: [2000, 2003],
      clubesHistoricos: [
        { inicio: 2000, fim: 2003, clube: "manchester-united" },
        { inicio: 2004, fim: 2007, clube: "real-madrid" },
        { inicio: 2008, fim: 2009, clube: "milan" },
      ],
    },
    {
      id: "raul-gonzalez",
      nome: "Raúl González",
      anoNascimento: 1977,
      clube: "real-madrid",
      posicao: "CA",
      idadeAposentadoria: 37,
      pesoRanking: 3.8,
      pesoRankingPico: 7.5,
      anoInicioProfissional: 1994,
      anosPico: [2000, 2002],
      clubesHistoricos: [
        { inicio: 2000, fim: 2010, clube: "real-madrid" },
        { inicio: 2011, fim: 2012, clube: "schalke-04" },
      ],
    },
    {
      id: "francesco-totti",
      nome: "Francesco Totti",
      anoNascimento: 1976,
      clube: "roma",
      posicao: "CA",
      idadeAposentadoria: 40,
      pesoRanking: 3.7,
      pesoRankingPico: 7.2,
      anoInicioProfissional: 1993,
      anosPico: [2000, 2007],
      clubesHistoricos: [{ inicio: 2000, fim: 2017, clube: "roma" }],
    },
    {
      id: "alessandro-del-piero",
      nome: "Alessandro Del Piero",
      anoNascimento: 1974,
      clube: "juventus",
      posicao: "CA",
      idadeAposentadoria: 39,
      pesoRanking: 3.6,
      pesoRankingPico: 7,
      anoInicioProfissional: 1991,
      anosPico: [2000, 2003],
      clubesHistoricos: [{ inicio: 2000, fim: 2012, clube: "juventus" }],
    },
    {
      id: "paolo-maldini",
      nome: "Paolo Maldini",
      anoNascimento: 1968,
      clube: "milan",
      posicao: "ZCE",
      idadeAposentadoria: 41,
      pesoRanking: 3.6,
      pesoRankingPico: 7,
      anoInicioProfissional: 1985,
      anosPico: [2000, 2005],
      clubesHistoricos: [{ inicio: 2000, fim: 2009, clube: "milan" }],
    },
    {
      id: "andriy-shevchenko",
      nome: "Andriy Shevchenko",
      anoNascimento: 1976,
      clube: "milan",
      posicao: "CA",
      idadeAposentadoria: 35,
      pesoRanking: 3.8,
      pesoRankingPico: 7.8,
      anoInicioProfissional: 1994,
      anosPico: [2000, 2004],
      clubesHistoricos: [
        { inicio: 2000, fim: 2006, clube: "milan" },
        { inicio: 2007, fim: 2008, clube: "chelsea" },
        { inicio: 2009, fim: 2009, clube: "milan" },
      ],
    },
    {
      id: "pavel-nedved",
      nome: "Pavel Nedvěd",
      anoNascimento: 1972,
      clube: "juventus",
      posicao: "ME",
      idadeAposentadoria: 36,
      pesoRanking: 3.5,
      pesoRankingPico: 7.4,
      anoInicioProfissional: 1991,
      anosPico: [2001, 2004],
      clubesHistoricos: [
        { inicio: 2000, fim: 2001, clube: "lazio" },
        { inicio: 2002, fim: 2009, clube: "juventus" },
      ],
    },
    {
      id: "oliver-kahn",
      nome: "Oliver Kahn",
      anoNascimento: 1969,
      clube: "bayern-munich",
      posicao: "GOL",
      idadeAposentadoria: 39,
      pesoRanking: 3.2,
      pesoRankingPico: 6.8,
      anoInicioProfissional: 1987,
      anosPico: [2000, 2002],
      clubesHistoricos: [{ inicio: 2000, fim: 2008, clube: "bayern-munich" }],
    },
    {
      id: "michael-ballack",
      nome: "Michael Ballack",
      anoNascimento: 1976,
      clube: "chelsea",
      posicao: "MC",
      idadeAposentadoria: 36,
      pesoRanking: 3.4,
      pesoRankingPico: 7,
      anoInicioProfissional: 1995,
      anosPico: [2002, 2006],
      clubesHistoricos: [
        { inicio: 2000, fim: 2002, clube: "bayer-leverkusen" },
        { inicio: 2003, fim: 2006, clube: "bayern-munich" },
        { inicio: 2007, fim: 2010, clube: "chelsea" },
        { inicio: 2011, fim: 2012, clube: "bayer-leverkusen" },
      ],
    },
    {
      id: "deco",
      nome: "Deco",
      anoNascimento: 1977,
      clube: "barcelona",
      posicao: "MC",
      idadeAposentadoria: 35,
      pesoRanking: 3.3,
      pesoRankingPico: 7.2,
      anoInicioProfissional: 1997,
      anosPico: [2003, 2006],
      clubesHistoricos: [
        { inicio: 2000, fim: 2003, clube: "porto" },
        { inicio: 2004, fim: 2008, clube: "barcelona" },
        { inicio: 2009, fim: 2010, clube: "chelsea" },
      ],
    },
    {
      id: "roberto-carlos",
      nome: "Roberto Carlos",
      anoNascimento: 1973,
      clube: "real-madrid",
      posicao: "LE",
      idadeAposentadoria: 39,
      pesoRanking: 3.3,
      pesoRankingPico: 6.6,
      anoInicioProfissional: 1991,
      anosPico: [2000, 2003],
      clubesHistoricos: [
        { inicio: 2000, fim: 2007, clube: "real-madrid" },
        { inicio: 2008, fim: 2009, clube: "fenerbahce" },
        { inicio: 2010, fim: 2011, clube: "corinthians" },
      ],
    },
    {
      id: "cafu",
      nome: "Cafu",
      anoNascimento: 1970,
      clube: "milan",
      posicao: "LD",
      idadeAposentadoria: 38,
      pesoRanking: 3.2,
      pesoRankingPico: 6.6,
      anoInicioProfissional: 1989,
      anosPico: [2000, 2004],
      clubesHistoricos: [
        { inicio: 2000, fim: 2003, clube: "roma" },
        { inicio: 2004, fim: 2008, clube: "milan" },
      ],
    },
    {
      id: "patrick-vieira",
      nome: "Patrick Vieira",
      anoNascimento: 1976,
      clube: "inter",
      posicao: "MC",
      idadeAposentadoria: 35,
      pesoRanking: 3.2,
      pesoRankingPico: 6.5,
      anoInicioProfissional: 1994,
      anosPico: [2000, 2004],
      clubesHistoricos: [
        { inicio: 2000, fim: 2005, clube: "arsenal" },
        { inicio: 2006, fim: 2006, clube: "juventus" },
        { inicio: 2007, fim: 2010, clube: "inter" },
        { inicio: 2011, fim: 2011, clube: "manchester-city" },
      ],
    },
    {
      id: "claude-makelele",
      nome: "Claude Makélélé",
      anoNascimento: 1973,
      clube: "chelsea",
      posicao: "MC",
      idadeAposentadoria: 37,
      pesoRanking: 3,
      pesoRankingPico: 6.4,
      anoInicioProfissional: 1990,
      anosPico: [2001, 2006],
      clubesHistoricos: [
        { inicio: 2000, fim: 2000, clube: "real-madrid" },
        { inicio: 2001, fim: 2003, clube: "real-madrid" },
        { inicio: 2004, fim: 2008, clube: "chelsea" },
        { inicio: 2009, fim: 2011, clube: "paris-saint-germain" },
      ],
    },
    {
      id: "rio-ferdinand",
      nome: "Rio Ferdinand",
      anoNascimento: 1978,
      clube: "manchester-united",
      posicao: "ZCD",
      idadeAposentadoria: 36,
      pesoRanking: 3.1,
      pesoRankingPico: 6.4,
      anoInicioProfissional: 1996,
      anosPico: [2002, 2009],
      clubesHistoricos: [
        { inicio: 2000, fim: 2001, clube: "west-ham" },
        { inicio: 2002, fim: 2014, clube: "manchester-united" },
      ],
    },
    {
      id: "carles-puyol",
      nome: "Carles Puyol",
      anoNascimento: 1978,
      clube: "barcelona",
      posicao: "ZCD",
      idadeAposentadoria: 36,
      pesoRanking: 3,
      pesoRankingPico: 6.4,
      anoInicioProfissional: 1999,
      anosPico: [2006, 2010],
      clubesHistoricos: [{ inicio: 2000, fim: 2014, clube: "barcelona" }],
    },
    {
      id: "kaka",
      nome: "Kaká",
      anoNascimento: 1982,
      clube: "milan",
      posicao: "ME",
      idadeAposentadoria: 35,
      pesoRanking: 7,
      pesoRankingPico: 11,
      anoInicioProfissional: 2001,
      anosPico: [2006, 2007],
      clubesHistoricos: [
        { inicio: 2001, fim: 2003, clube: "sao-paulo" },
        { inicio: 2004, fim: 2009, clube: "milan" },
        { inicio: 2010, fim: 2013, clube: "real-madrid" },
        { inicio: 2014, fim: 2014, clube: "milan" },
      ],
    },
    {
      id: "xavi-hernandez",
      nome: "Xavi Hernández",
      anoNascimento: 1980,
      clube: "barcelona",
      posicao: "MC",
      idadeAposentadoria: 39,
      pesoRanking: 3.6,
      pesoRankingPico: 7.8,
      anoInicioProfissional: 1998,
      anosPico: [2008, 2012],
      clubesHistoricos: [{ inicio: 2000, fim: 2015, clube: "barcelona" }],
    },
    {
      id: "andres-iniesta",
      nome: "Andrés Iniesta",
      anoNascimento: 1984,
      clube: "barcelona",
      posicao: "MC",
      idadeAposentadoria: 39,
      pesoRanking: 3.7,
      pesoRankingPico: 8,
      anoInicioProfissional: 2002,
      anosPico: [2009, 2012],
      clubesHistoricos: [{ inicio: 2002, fim: 2018, clube: "barcelona" }],
    },
    {
      id: "samuel-etoo",
      nome: "Samuel Eto'o",
      anoNascimento: 1981,
      clube: "barcelona",
      posicao: "CA",
      idadeAposentadoria: 37,
      pesoRanking: 4,
      pesoRankingPico: 8,
      anoInicioProfissional: 1997,
      anosPico: [2005, 2010],
      clubesHistoricos: [
        { inicio: 2000, fim: 2004, clube: "mallorca" },
        { inicio: 2005, fim: 2009, clube: "barcelona" },
        { inicio: 2010, fim: 2011, clube: "inter" },
        { inicio: 2012, fim: 2013, clube: "chelsea" },
      ],
    },
    {
      id: "didier-drogba",
      nome: "Didier Drogba",
      anoNascimento: 1978,
      clube: "chelsea",
      posicao: "CA",
      idadeAposentadoria: 40,
      pesoRanking: 3.7,
      pesoRankingPico: 7.6,
      anoInicioProfissional: 1998,
      anosPico: [2004, 2012],
      clubesHistoricos: [
        { inicio: 2000, fim: 2002, clube: "guingamp" },
        { inicio: 2003, fim: 2004, clube: "marseille" },
        { inicio: 2005, fim: 2012, clube: "chelsea" },
        { inicio: 2013, fim: 2014, clube: "galatasaray" },
        { inicio: 2015, fim: 2015, clube: "chelsea" },
      ],
    },
    {
      id: "frank-lampard",
      nome: "Frank Lampard",
      anoNascimento: 1978,
      clube: "chelsea",
      posicao: "MC",
      idadeAposentadoria: 38,
      pesoRanking: 3.6,
      pesoRankingPico: 7.4,
      anoInicioProfissional: 1995,
      anosPico: [2004, 2010],
      clubesHistoricos: [
        { inicio: 2000, fim: 2001, clube: "west-ham" },
        { inicio: 2002, fim: 2014, clube: "chelsea" },
        { inicio: 2015, fim: 2016, clube: "manchester-city" },
      ],
    },
    {
      id: "steven-gerrard",
      nome: "Steven Gerrard",
      anoNascimento: 1980,
      clube: "liverpool",
      posicao: "MC",
      idadeAposentadoria: 36,
      pesoRanking: 3.6,
      pesoRankingPico: 7.4,
      anoInicioProfissional: 1998,
      anosPico: [2005, 2009],
      clubesHistoricos: [{ inicio: 2000, fim: 2015, clube: "liverpool" }],
    },
    {
      id: "wayne-rooney",
      nome: "Wayne Rooney",
      anoNascimento: 1985,
      clube: "manchester-united",
      posicao: "CA",
      idadeAposentadoria: 35,
      pesoRanking: 3.8,
      pesoRankingPico: 7.8,
      anoInicioProfissional: 2002,
      anosPico: [2009, 2012],
      clubesHistoricos: [
        { inicio: 2002, fim: 2004, clube: "everton" },
        { inicio: 2005, fim: 2017, clube: "manchester-united" },
        { inicio: 2018, fim: 2018, clube: "everton" },
      ],
    },
    {
      id: "zlatan-ibrahimovic",
      nome: "Zlatan Ibrahimović",
      anoNascimento: 1981,
      clube: "milan",
      posicao: "CA",
      idadeAposentadoria: 41,
      pesoRanking: 3.9,
      pesoRankingPico: 7.8,
      anoInicioProfissional: 1999,
      anosPico: [2004, 2016],
      clubesHistoricos: [
        { inicio: 2000, fim: 2001, clube: "ajax" },
        { inicio: 2002, fim: 2004, clube: "juventus" },
        { inicio: 2005, fim: 2006, clube: "inter" },
        { inicio: 2007, fim: 2009, clube: "inter" },
        { inicio: 2010, fim: 2011, clube: "milan" },
        { inicio: 2012, fim: 2016, clube: "paris-saint-germain" },
        { inicio: 2017, fim: 2018, clube: "manchester-united" },
        { inicio: 2019, fim: 2020, clube: "milan" },
        { inicio: 2021, fim: 2023, clube: "milan" },
      ],
    },
    {
      id: "arjen-robben",
      nome: "Arjen Robben",
      anoNascimento: 1984,
      clube: "bayern-munich",
      posicao: "PD",
      idadeAposentadoria: 35,
      pesoRanking: 3.5,
      pesoRankingPico: 7.4,
      anoInicioProfissional: 2000,
      anosPico: [2010, 2014],
      clubesHistoricos: [
        { inicio: 2000, fim: 2002, clube: "chelsea" },
        { inicio: 2003, fim: 2004, clube: "chelsea" },
        { inicio: 2005, fim: 2007, clube: "chelsea" },
        { inicio: 2008, fim: 2009, clube: "real-madrid" },
        { inicio: 2010, fim: 2019, clube: "bayern-munich" },
      ],
    },
    {
      id: "franck-ribery",
      nome: "Franck Ribéry",
      anoNascimento: 1983,
      clube: "bayern-munich",
      posicao: "PE",
      idadeAposentadoria: 39,
      pesoRanking: 3.5,
      pesoRankingPico: 8,
      anoInicioProfissional: 2000,
      anosPico: [2008, 2013],
      clubesHistoricos: [
        { inicio: 2000, fim: 2004, clube: "galatasaray" },
        { inicio: 2005, fim: 2006, clube: "marseille" },
        { inicio: 2007, fim: 2019, clube: "bayern-munich" },
        { inicio: 2020, fim: 2021, clube: "fiorentina" },
      ],
    },
    {
      id: "david-villa",
      nome: "David Villa",
      anoNascimento: 1981,
      clube: "barcelona",
      posicao: "CA",
      idadeAposentadoria: 37,
      pesoRanking: 3.7,
      pesoRankingPico: 7.4,
      anoInicioProfissional: 2000,
      anosPico: [2008, 2011],
      clubesHistoricos: [
        { inicio: 2000, fim: 2003, clube: "valencia" },
        { inicio: 2004, fim: 2010, clube: "valencia" },
        { inicio: 2011, fim: 2013, clube: "barcelona" },
        { inicio: 2014, fim: 2014, clube: "atletico-madrid" },
      ],
    },
    {
      id: "fernando-torres",
      nome: "Fernando Torres",
      anoNascimento: 1984,
      clube: "liverpool",
      posicao: "CA",
      idadeAposentadoria: 35,
      pesoRanking: 3.6,
      pesoRankingPico: 7.4,
      anoInicioProfissional: 2001,
      anosPico: [2008, 2009],
      clubesHistoricos: [
        { inicio: 2001, fim: 2007, clube: "atletico-madrid" },
        { inicio: 2008, fim: 2010, clube: "liverpool" },
        { inicio: 2011, fim: 2014, clube: "chelsea" },
        { inicio: 2015, fim: 2015, clube: "milan" },
        { inicio: 2016, fim: 2018, clube: "atletico-madrid" },
      ],
    },
    {
      id: "alexandre-pato",
      nome: "Alexandre Pato",
      anoNascimento: 1989,
      clube: "sao-paulo",
      posicao: "CA",
      idadeAposentadoria: 35,
      pesoRanking: 6,
      pesoRankingPico: 9,
      anoInicioProfissional: 2006,
      anosPico: [2009, 2011],
      clubesHistoricos: [
        { inicio: 2007, fim: 2012, clube: "milan" },
        { inicio: 2013, fim: 2013, clube: "corinthians" },
        { inicio: 2014, fim: 2015, clube: "sao-paulo" },
        { inicio: 2016, fim: 2016, clube: "chelsea" },
        { inicio: 2017, fim: 2017, clube: "sao-paulo" },
        { inicio: 2018, fim: 2020, clube: "sao-paulo" },
      ],
    },
    {
      id: "cesc-fabregas",
      nome: "Cesc Fàbregas",
      anoNascimento: 1987,
      clube: "chelsea",
      posicao: "MC",
      idadeAposentadoria: 36,
      pesoRanking: 3.5,
      pesoRankingPico: 7.3,
      anoInicioProfissional: 2003,
      anosPico: [2008, 2012],
      clubesHistoricos: [
        { inicio: 2003, fim: 2011, clube: "arsenal" },
        { inicio: 2012, fim: 2014, clube: "barcelona" },
        { inicio: 2015, fim: 2018, clube: "chelsea" },
        { inicio: 2019, fim: 2022, clube: "monaco" },
      ],
    },
    {
      id: "sergio-aguero",
      nome: "Sergio Agüero",
      anoNascimento: 1988,
      clube: "manchester-city",
      posicao: "CA",
      idadeAposentadoria: 33,
      pesoRanking: 3.8,
      pesoRankingPico: 8,
      anoInicioProfissional: 2003,
      anosPico: [2012, 2019],
      clubesHistoricos: [
        { inicio: 2003, fim: 2006, clube: "atletico-madrid" },
        { inicio: 2007, fim: 2011, clube: "atletico-madrid" },
        { inicio: 2012, fim: 2021, clube: "manchester-city" },
        { inicio: 2022, fim: 2022, clube: "barcelona" },
      ],
    },
    {
      id: "gareth-bale",
      nome: "Gareth Bale",
      anoNascimento: 1989,
      clube: "real-madrid",
      posicao: "PD",
      idadeAposentadoria: 33,
      pesoRanking: 3.7,
      pesoRankingPico: 7.8,
      anoInicioProfissional: 2006,
      anosPico: [2013, 2018],
      clubesHistoricos: [
        { inicio: 2007, fim: 2013, clube: "tottenham" },
        { inicio: 2014, fim: 2020, clube: "real-madrid" },
        { inicio: 2021, fim: 2021, clube: "tottenham" },
        { inicio: 2022, fim: 2022, clube: "real-madrid" },
      ],
    },
    {
      id: "angel-di-maria",
      nome: "Ángel Di María",
      anoNascimento: 1988,
      clube: "benfica",
      posicao: "PD",
      idadeAposentadoria: 38,
      pesoRanking: 3.7,
      pesoRankingPico: 7.5,
      anoInicioProfissional: 2005,
      anosPico: [2014, 2022],
      clubesHistoricos: [
        { inicio: 2007, fim: 2010, clube: "benfica" },
        { inicio: 2011, fim: 2014, clube: "real-madrid" },
        { inicio: 2015, fim: 2015, clube: "manchester-united" },
        { inicio: 2016, fim: 2022, clube: "paris-saint-germain" },
        { inicio: 2023, fim: 2023, clube: "juventus" },
        { inicio: 2024, fim: 2025, clube: "benfica" },
      ],
    },
    {
      id: "eden-hazard",
      nome: "Eden Hazard",
      anoNascimento: 1991,
      clube: "real-madrid",
      posicao: "PE",
      idadeAposentadoria: 32,
      pesoRanking: 3.7,
      pesoRankingPico: 7.8,
      anoInicioProfissional: 2007,
      anosPico: [2015, 2019],
      clubesHistoricos: [
        { inicio: 2007, fim: 2012, clube: "lille" },
        { inicio: 2013, fim: 2019, clube: "chelsea" },
        { inicio: 2020, fim: 2023, clube: "real-madrid" },
      ],
    },
    {
      id: "karim-benzema",
      nome: "Karim Benzema",
      anoNascimento: 1987,
      clube: "al-ittihad",
      posicao: "CA",
      idadeAposentadoria: 40,
      pesoRanking: 4,
      pesoRankingPico: 9,
      anoInicioProfissional: 2004,
      anosPico: [2021, 2022],
      clubesHistoricos: [
        { inicio: 2005, fim: 2009, clube: "lyon" },
        { inicio: 2010, fim: 2023, clube: "real-madrid" },
        { inicio: 2024, fim: 2025, clube: "al-ittihad" },
      ],
    },
    {
      id: "philippe-coutinho",
      nome: "Philippe Coutinho",
      anoNascimento: 1992,
      clube: "vasco",
      posicao: "ME",
      idadeAposentadoria: 40,
      pesoRanking: 6,
      pesoRankingPico: 11,
      anoInicioProfissional: 2009,
      anosPico: [2017, 2020],
      clubesHistoricos: [
        { inicio: 2009, fim: 2010, clube: "vasco" },
        { inicio: 2011, fim: 2012, clube: "inter" },
        { inicio: 2013, fim: 2013, clube: "liverpool" },
        { inicio: 2014, fim: 2017, clube: "liverpool" },
        { inicio: 2018, fim: 2019, clube: "barcelona" },
        { inicio: 2020, fim: 2020, clube: "bayern-munich" },
        { inicio: 2021, fim: 2024, clube: "barcelona" },
        { inicio: 2025, fim: 2025, clube: "vasco" },
        { inicio: 2026, fim: 2032, clube: "santos" },
      ],
    },
    {
      id: "sergio-ramos-historico",
      nome: "Sergio Ramos",
      anoNascimento: 1986,
      clube: "real-madrid",
      posicao: "ZCD",
      idadeAposentadoria: 39,
      pesoRanking: 3.5,
      pesoRankingPico: 7.3,
      anoInicioProfissional: 2003,
      anosPico: [2010, 2017],
      clubesHistoricos: [
        { inicio: 2004, fim: 2005, clube: "sevilla" },
        { inicio: 2006, fim: 2021, clube: "real-madrid" },
        { inicio: 2022, fim: 2023, clube: "paris-saint-germain" },
        { inicio: 2024, fim: 2025, clube: "sevilla" },
      ],
    },
    {
      id: "thiago-silva",
      nome: "Thiago Silva",
      anoNascimento: 1984,
      clube: "chelsea",
      posicao: "ZCD",
      idadeAposentadoria: 41,
      pesoRanking: 3.2,
      pesoRankingPico: 7,
      anoInicioProfissional: 2002,
      anosPico: [2012, 2015],
      clubesHistoricos: [
        { inicio: 2006, fim: 2008, clube: "milan" },
        { inicio: 2009, fim: 2012, clube: "milan" },
        { inicio: 2013, fim: 2020, clube: "paris-saint-germain" },
        { inicio: 2021, fim: 2024, clube: "chelsea" },
        { inicio: 2025, fim: 2025, clube: "fluminense" },
      ],
    },
    {
      id: "luka-modric-historico",
      nome: "Luka Modrić",
      anoNascimento: 1985,
      clube: "milan",
      posicao: "MC",
      idadeAposentadoria: 41,
      pesoRanking: 3.4,
      pesoRankingPico: 7.5,
      anoInicioProfissional: 2003,
      anosPico: [2016, 2018],
      clubesHistoricos: [
        { inicio: 2008, fim: 2012, clube: "tottenham" },
        { inicio: 2013, fim: 2025, clube: "real-madrid" },
      ],
    },
    {
      id: "robert-lewandowski-historico",
      nome: "Robert Lewandowski",
      anoNascimento: 1988,
      clube: "barcelona",
      posicao: "CA",
      idadeAposentadoria: 40,
      pesoRanking: 3.8,
      pesoRankingPico: 8.2,
      anoInicioProfissional: 2006,
      anosPico: [2015, 2021],
      clubesHistoricos: [
        { inicio: 2008, fim: 2010, clube: "le-poznan" },
        { inicio: 2011, fim: 2014, clube: "borussia-dortmund" },
        { inicio: 2015, fim: 2022, clube: "bayern-munich" },
        { inicio: 2023, fim: 2025, clube: "barcelona" },
      ],
    },
    {
      id: "mohamed-salah-historico",
      nome: "Mohamed Salah",
      anoNascimento: 1992,
      clube: "liverpool",
      posicao: "PD",
      idadeAposentadoria: 39,
      pesoRanking: 3.6,
      pesoRankingPico: 7.8,
      anoInicioProfissional: 2010,
      anosPico: [2018, 2025],
      clubesHistoricos: [
        { inicio: 2012, fim: 2013, clube: "basel" },
        { inicio: 2014, fim: 2015, clube: "chelsea" },
        { inicio: 2016, fim: 2016, clube: "roma" },
        { inicio: 2017, fim: 2025, clube: "liverpool" },
      ],
    },
    {
      id: "kevin-de-bruyne-historico",
      nome: "Kevin De Bruyne",
      anoNascimento: 1991,
      clube: "napoli",
      posicao: "MC",
      idadeAposentadoria: 39,
      pesoRanking: 3.6,
      pesoRankingPico: 7.8,
      anoInicioProfissional: 2008,
      anosPico: [2018, 2023],
      clubesHistoricos: [
        { inicio: 2009, fim: 2012, clube: "chelsea" },
        { inicio: 2013, fim: 2014, clube: "wolfsburg" },
        { inicio: 2015, fim: 2025, clube: "manchester-city" },
      ],
    },
    {
      id: "harry-kane-historico",
      nome: "Harry Kane",
      anoNascimento: 1993,
      clube: "bayern-munich",
      posicao: "CA",
      idadeAposentadoria: 40,
      pesoRanking: 6,
      pesoRankingPico: 11,
      anoInicioProfissional: 2010,
      anosPico: [2017, 2024],
      clubesHistoricos: [
        { inicio: 2011, fim: 2012, clube: "tottenham" },
        { inicio: 2013, fim: 2023, clube: "tottenham" },
        { inicio: 2024, fim: 2025, clube: "bayern-munich" },
      ],
    },
    {
      id: "antoine-griezmann-historico",
      nome: "Antoine Griezmann",
      anoNascimento: 1991,
      clube: "atletico-madrid",
      posicao: "CA",
      idadeAposentadoria: 39,
      pesoRanking: 3.5,
      pesoRankingPico: 7.4,
      anoInicioProfissional: 2009,
      anosPico: [2016, 2018],
      clubesHistoricos: [
        { inicio: 2010, fim: 2014, clube: "real-sociedad" },
        { inicio: 2015, fim: 2019, clube: "atletico-madrid" },
        { inicio: 2020, fim: 2021, clube: "barcelona" },
        { inicio: 2022, fim: 2025, clube: "atletico-madrid" },
      ],
    },
    {
      id: "heung-min-son-historico",
      nome: "Heung-Min Son",
      anoNascimento: 1992,
      clube: "tottenham",
      posicao: "PE",
      idadeAposentadoria: 39,
      pesoRanking: 3.3,
      pesoRankingPico: 7.2,
      anoInicioProfissional: 2010,
      anosPico: [2020, 2022],
      clubesHistoricos: [
        { inicio: 2010, fim: 2013, clube: "hamburger-sv" },
        { inicio: 2014, fim: 2015, clube: "bayer-leverkusen" },
        { inicio: 2016, fim: 2025, clube: "tottenham" },
      ],
    },
  ];

  function hashIdentificador(texto) {
    return Array.from(String(texto)).reduce(
      (hash, caractere) => (hash * 31 + caractere.charCodeAt(0)) >>> 0,
      7,
    );
  }

  const cacheNomesElencoPorAno = new Map();

  function normalizarNomeElenco(nome) {
    return String(nome || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function obterNomeFicticio(clubeId, indiceJogador, ano = estado?.ano) {
    const anoTemporada = Number(ano) || 0;
    if (!cacheNomesElencoPorAno.has(anoTemporada)) {
      const combinacoes = NOMES_JOGADORES_LIGA.flatMap((nome) =>
        SOBRENOMES_JOGADORES_LIGA.map((sobrenome) => `${nome} ${sobrenome}`),
      );
      const usados = new Set([
        ...JOGADORES_REAIS.map((jogador) => normalizarNomeElenco(jogador.nome)),
        normalizarNomeElenco(estado?.nome),
      ]);
      const nomes = new Map();
      const clubes = clubesDisponiveis()
        .filter((clube) => clube.tipo !== "base")
        .sort((a, b) => a.id.localeCompare(b.id));

      clubes.forEach((clube) => {
        const base = hashIdentificador(`${anoTemporada}:${clube.id}`);
        POSICOES_ELENCO_LIGA.forEach((_, indice) => {
          let tentativa = (base + indice * 977) % combinacoes.length;
          let nome = combinacoes[tentativa];
          while (usados.has(normalizarNomeElenco(nome))) {
            tentativa = (tentativa + 1) % combinacoes.length;
            nome = combinacoes[tentativa];
          }
          usados.add(normalizarNomeElenco(nome));
          nomes.set(`${clube.id}:${indice}`, nome);
        });
      });

      cacheNomesElencoPorAno.set(anoTemporada, nomes);
      while (cacheNomesElencoPorAno.size > 4) {
        cacheNomesElencoPorAno.delete(
          cacheNomesElencoPorAno.keys().next().value,
        );
      }
    }

    const nomes = cacheNomesElencoPorAno.get(anoTemporada);
    const chave = `${clubeId}:${indiceJogador}`;
    if (nomes.has(chave)) return nomes.get(chave);

    const combinacoes = NOMES_JOGADORES_LIGA.flatMap((nome) =>
      SOBRENOMES_JOGADORES_LIGA.map((sobrenome) => `${nome} ${sobrenome}`),
    );
    const usados = new Set([
      ...JOGADORES_REAIS.map((jogador) => normalizarNomeElenco(jogador.nome)),
      normalizarNomeElenco(estado?.nome),
      ...[...nomes.values()].map(normalizarNomeElenco),
    ]);
    let tentativa =
      hashIdentificador(`${anoTemporada}:${chave}`) % combinacoes.length;
    for (let indice = 0; indice < combinacoes.length; indice++) {
      const nome = combinacoes[tentativa];
      if (!usados.has(normalizarNomeElenco(nome))) {
        nomes.set(chave, nome);
        return nome;
      }
      tentativa = (tentativa + 1) % combinacoes.length;
    }
    return `${combinacoes[0]} ${hashIdentificador(chave)}`;
  }

  function criarElencoLiga(clube) {
    const base = hashIdentificador(clube.id);
    const elenco = POSICOES_ELENCO_LIGA.map((posicao, indice) => ({
      id: `liga:${estado.ano}:${clube.id}:${indice}`,
      nome: obterNomeFicticio(clube.id, indice, estado.ano),
      posicao,
      clubeId: clube.id,
      idade: Math.min(
        40,
        18 +
          ((base + indice * 7 + 2026) % 17) +
          Math.max(0, Number(estado.ano) - 2026),
      ),
      pesoRanking: 1,
    }));
    elenco.forEach((jogador) => {
      jogador.pesoRanking =
        calcularMultiplicadorAuge(jogador.idade) *
        calcularMultiplicadorFormaTemporada(
          jogador.id,
          estado.ano,
          jogador.posicao,
        );
    });
    return elenco.concat(obterJogadoresReaisDoClube(clube.id, estado.ano));
  }

  function calcularMultiplicadorAuge(idade) {
    const distanciaAuge = Math.abs((Number(idade) || 27) - 27);
    return Math.max(0.55, 1.48 - Math.max(0, distanciaAuge - 2) * 0.08);
  }

  function calcularMultiplicadorFormaTemporada(id, ano, posicao) {
    const aleatorio = criarSorteadorRanking(
      `${id}:${ano}:forma:${posicao || ""}`,
    );
    const formaBase = (aleatorio() + aleatorio() + aleatorio()) / 3;
    const pico = aleatorio() > 0.84 ? 0.12 + aleatorio() * 0.12 : 0;
    return Math.max(0.72, Math.min(1.24, 0.88 + formaBase * 0.2 + pico));
  }

  function calcularPesoRankingReal(jogador, ano) {
    const pesoBase = Math.sqrt(Number(jogador.pesoRanking) || 1);
    const estaNoAuge =
      jogador.anosPico &&
      Number(ano) >= jogador.anosPico[0] &&
      Number(ano) <= jogador.anosPico[1];
    if (estaNoAuge) return Number(jogador.pesoRankingPico) || pesoBase * 1.6;
    return (
      pesoBase * calcularMultiplicadorAuge(Number(ano) - jogador.anoNascimento)
    );
  }

  const CLUBES_GRANDES_PARA_TRANSFERENCIA = [
    "arsenal",
    "barcelona",
    "bayern-munich",
    "chelsea",
    "inter",
    "juventus",
    "liverpool",
    "manchester-city",
    "manchester-united",
    "milan",
    "paris-saint-germain",
    "real-madrid",
  ];

  function clubeJogadorRealNaTemporada(jogador, ano) {
    const anoAposentadoria = jogador.anoNascimento + jogador.idadeAposentadoria;
    const anoInicioProfissional =
      Number(jogador.anoInicioProfissional) || jogador.anoNascimento + 17;
    if (ano < anoInicioProfissional || ano > anoAposentadoria) return "";
    const clubeHistorico = jogador.clubesHistoricos?.find(
      (periodo) => ano >= periodo.inicio && ano <= periodo.fim,
    )?.clube;
    if (ano < 2026 || clubeHistorico) {
      return clubeHistorico || "";
    }

    let clubeId = jogador.clube;
    for (
      let anoTransferencia = 2027;
      anoTransferencia <= ano;
      anoTransferencia++
    ) {
      const sortear = criarSorteadorRanking(
        `${jogador.id}:${anoTransferencia}`,
      );
      const chanceTransferencia = Math.min(
        0.08,
        Math.max(0, Number(jogador.chanceTransferencia) || 0.06),
      );
      if (sortear() >= chanceTransferencia) continue;
      const destinos = [
        ...new Set([
          jogador.clube,
          ...(jogador.destinos || []),
          ...CLUBES_GRANDES_PARA_TRANSFERENCIA,
        ]),
      ].filter(
        (id) => id !== clubeId && CLUBES.some((clube) => clube.id === id),
      );
      if (destinos.length)
        clubeId = destinos[Math.floor(sortear() * destinos.length)];
    }
    return clubeId;
  }

  function obterJogadoresReaisDoClube(clubeId, ano) {
    const anoNumerico = Number(ano);
    const porNome = new Map();
    JOGADORES_REAIS.forEach((jogador) => {
      const clubeTemporada = clubeJogadorRealNaTemporada(jogador, anoNumerico);
      if (!clubeTemporada) return;
      const nomeNormalizado = String(jogador.nome || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
      const existente = porNome.get(nomeNormalizado);
      const preferirCadastroAtual =
        anoNumerico >= 2026 && !jogador.clubesHistoricos;
      if (
        !existente ||
        (preferirCadastroAtual && existente.jogador.clubesHistoricos)
      ) {
        porNome.set(nomeNormalizado, { jogador, clubeId: clubeTemporada });
      }
    });
    return [...porNome.values()]
      .filter((registro) => registro.clubeId === clubeId)
      .map(({ jogador }) => ({
        id: `real:${jogador.id}`,
        nome: jogador.nome,
        posicao: jogador.posicao,
        clubeId,
        idade: anoNumerico - jogador.anoNascimento,
        pesoRanking:
          calcularPesoRankingReal(jogador, anoNumerico) *
          calcularMultiplicadorFormaTemporada(
            `real:${jogador.id}`,
            anoNumerico,
            jogador.posicao,
          ),
      }));
  }

  function chaveIdentidadeRanking(jogadorId, nome) {
    const id = String(jogadorId || "").trim();
    if (id.startsWith("real:")) return `id:${id}`;
    if (id) return `id:${id}`;
    return String(nome || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  const anoElencosPreparadosPorEstado = new WeakMap();

  function prepararElencosLiga() {
    if (
      !estado ||
      (typeof ehClubeBase === "function" && ehClubeBase(estado.clubeId))
    )
      return;
    estado.elencosLiga ||= {};
    if (
      !anoElencosPreparadosPorEstado.has(estado) ||
      anoElencosPreparadosPorEstado.get(estado) !== estado.ano
    ) {
      const clubesLiga = estado.tabela
        .filter((time) => !String(time.id).startsWith("__rodada__"))
        .map((time) => obterClube(time.id) || time)
        .filter((clube) => clube.id);

      clubesLiga.forEach((clube) => {
        if (
          !Array.isArray(estado.elencosLiga[clube.id]) ||
          !estado.elencosLiga[clube.id].length
        )
          estado.elencosLiga[clube.id] = criarElencoLiga(clube);
        estado.elencosLiga[clube.id] = estado.elencosLiga[clube.id]
          .filter((jogador) => !String(jogador.id).startsWith("real:"))
          .concat(obterJogadoresReaisDoClube(clube.id, estado.ano));
        estado.elencosLiga[clube.id].forEach((jogador, indice) => {
          const id = String(jogador.id || "");
          if (id.startsWith("liga:")) {
            const indiceOriginal = Number(id.split(":").at(-1));
            jogador.nome = obterNomeFicticio(
              clube.id,
              Number.isInteger(indiceOriginal) ? indiceOriginal : indice,
              estado.ano,
            );
          }
        });
      });
      anoElencosPreparadosPorEstado.set(estado, estado.ano);
    }

    const elencoMeuClube = estado.elencosLiga[estado.clubeId];
    if (!elencoMeuClube || !estado.carreiraId) return;
    let jogador = elencoMeuClube.find((item) => item.id === estado.carreiraId);
    if (!jogador) {
      const posicao = String(estado.posicao || "CA").toUpperCase();
      const indice = Math.max(0, POSICOES_ELENCO_LIGA.indexOf(posicao));
      jogador = { id: estado.carreiraId, posicao, clubeId: estado.clubeId };
      elencoMeuClube[indice] = jogador;
    }
    jogador.nome = estado.nome || jogador.nome || "Jogador";
    jogador.clubeId = estado.clubeId;
  }

  function escolherJogadorLiga(jogadores, pesos) {
    const pesoTotal = jogadores.reduce(
      (total, jogador) =>
        total +
        (pesos[jogador.posicao] || 1) * (Number(jogador.pesoRanking) || 1),
      0,
    );
    let sorteio = Math.random() * pesoTotal;
    return (
      jogadores.find((jogador) => {
        sorteio -=
          (pesos[jogador.posicao] || 1) * (Number(jogador.pesoRanking) || 1);
        return sorteio < 0;
      }) || jogadores[jogadores.length - 1]
    );
  }

  function gerarEventosIndividuaisLiga(
    partidaId,
    casaId,
    foraId,
    golsCasa,
    golsFora,
    opcoes = {},
  ) {
    prepararElencosLiga();
    estado.elencosLiga ||= {};
    const jogadorId = opcoes.jogadorId ?? estado.carreiraId;
    const clubeJogadorId = opcoes.clubeJogadorId ?? estado.clubeId;
    const nomeJogador = opcoes.nomeJogador || estado.nome;
    const eventos = [];
    const pesosGols = {
      GOL: 0.01,
      ZCE: 0.18,
      ZCD: 0.18,
      LE: 0.28,
      LD: 0.28,
      ME: 0.8,
      MC: 0.7,
      MD: 0.8,
      PE: 2.2,
      CA: 3.2,
      PD: 2.2,
    };
    const pesosAssistencias = {
      GOL: 0.05,
      ZCE: 0.25,
      ZCD: 0.25,
      LE: 0.65,
      LD: 0.65,
      ME: 2.6,
      MC: 2.2,
      MD: 2.6,
      PE: 1.8,
      CA: 0.7,
      PD: 1.8,
    };
    const pesosEscalacao = Object.fromEntries(
      POSICOES_ELENCO_LIGA.map((posicao) => [posicao, 1]),
    );
    const participantes = [];
    const times = [
      { lado: "casa", clubeId: casaId, gols: golsCasa },
      { lado: "fora", clubeId: foraId, gols: golsFora },
    ];

    times.forEach((time) => {
      const elenco =
        estado.elencosLiga[time.clubeId] ||
        (estado.elencosLiga[time.clubeId] = criarElencoLiga(
          obterClube(time.clubeId) || { id: time.clubeId },
        ));
      let jogadorDoUsuario =
        time.clubeId === clubeJogadorId
          ? elenco.find((jogador) => jogador.id === jogadorId)
          : null;
      if (
        time.clubeId === clubeJogadorId &&
        opcoes.jogadorParticipou &&
        !jogadorDoUsuario
      ) {
        const posicao = String(estado.posicao || "CA").toUpperCase();
        const indice = Math.max(0, POSICOES_ELENCO_LIGA.indexOf(posicao));
        jogadorDoUsuario = {
          id: jogadorId,
          nome: nomeJogador || "Jogador",
          posicao,
          clubeId: time.clubeId,
        };
        elenco[indice] = jogadorDoUsuario;
      }
      const podeJogar = jogadorDoUsuario && opcoes.jogadorParticipou;
      const jogadores = elenco.filter(
        (jogador) => jogador.id !== jogadorId || podeJogar,
      );
      const elegiveis = jogadores.length ? jogadores : elenco;
      const escalacao = POSICOES_ELENCO_LIGA.map((posicao) => {
        const porPosicao = elegiveis.filter(
          (jogador) => jogador.posicao === posicao,
        );
        return porPosicao.length
          ? escolherJogadorLiga(porPosicao, pesosEscalacao)
          : null;
      }).filter(Boolean);
      if (podeJogar) {
        const indicePosicao = escalacao.findIndex(
          (jogador) => jogador.posicao === jogadorDoUsuario.posicao,
        );
        if (indicePosicao >= 0) escalacao[indicePosicao] = jogadorDoUsuario;
        else escalacao.push(jogadorDoUsuario);
      }
      escalacao.forEach((jogador) => {
        const sorteadorAcoes = criarSorteadorRanking(
          `${partidaId}:${jogador.id}:acoes`,
        );
        const posicao = String(jogador.posicao || "").toUpperCase();
        participantes.push({
          id: jogador.id,
          nome: jogador.nome,
          posicao: jogador.posicao,
          clubeId: jogador.clubeId || time.clubeId,
          desarmes: ["ZCE", "ZCD", "LE", "LD"].includes(posicao)
            ? sortearPoissonRanking(1.7, sorteadorAcoes)
            : ["ME", "MC", "MD"].includes(posicao)
              ? sortearPoissonRanking(0.9, sorteadorAcoes)
              : ["PE", "CA", "PD"].includes(posicao)
                ? sortearPoissonRanking(0.35, sorteadorAcoes)
                : 0,
          defesas:
            posicao === "GOL" ? sortearPoissonRanking(2.2, sorteadorAcoes) : 0,
        });
      });
      const goleadoresAleatorios = escalacao.filter(
        (jogador) => jogador.id !== estado.carreiraId,
      );
      const gols = Math.max(0, Math.floor(Number(time.gols) || 0));
      const golsForcadosUsuario = podeJogar
        ? Math.min(
            gols,
            Math.max(0, Math.floor(Number(opcoes.golsJogador) || 0)),
          )
        : 0;
      const golsTime = [];

      for (let indice = 0; indice < gols; indice++) {
        const autor =
          indice < golsForcadosUsuario
            ? jogadorDoUsuario
            : escolherJogadorLiga(
                goleadoresAleatorios.length ? goleadoresAleatorios : escalacao,
                pesosGols,
              );
        golsTime.push({
          id: `${partidaId}:${time.lado}:${indice + 1}`,
          partidaId,
          clubeId: time.clubeId,
          autorId: autor.id,
          autorNome: autor.nome,
          autorPosicao: autor.posicao,
          assistenteId: null,
          assistenteNome: null,
          assistentePosicao: null,
        });
      }

      let assistenciasForcadasUsuario = podeJogar
        ? Math.max(0, Math.floor(Number(opcoes.assistenciasJogador) || 0))
        : 0;
      golsTime.forEach((gol) => {
        const podeAssistir = escalacao.filter(
          (jogador) => jogador.id !== gol.autorId,
        );
        if (!podeAssistir.length) return;
        const assistentesAleatorios = podeAssistir.filter(
          (jogador) => jogador.id !== estado.carreiraId,
        );
        let assistente = null;
        if (
          assistenciasForcadasUsuario > 0 &&
          jogadorDoUsuario &&
          gol.autorId !== jogadorDoUsuario.id
        ) {
          assistente = jogadorDoUsuario;
          assistenciasForcadasUsuario--;
        } else if (Math.random() < 0.68) {
          assistente = escolherJogadorLiga(
            assistentesAleatorios.length ? assistentesAleatorios : podeAssistir,
            pesosAssistencias,
          );
        }
        if (assistente) {
          gol.assistenteId = assistente.id;
          gol.assistenteNome = assistente.nome;
          gol.assistentePosicao = assistente.posicao;
        }
      });
      eventos.push(...golsTime);
    });
    if (opcoes.partida && typeof opcoes.partida === "object") {
      opcoes.partida.jogadoresParticipantes = participantes;
    }

    return eventos;
  }

  function obterRankingsLiga() {
    return obterRankingsCompeticao(estado?.liga || "");
  }

  function criarSorteadorRanking(seedTexto) {
    let seed = hashIdentificador(seedTexto) || 1;
    return () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function sortearPoissonRanking(lambda, aleatorio) {
    const limite = Math.exp(-Math.max(0, lambda));
    let produto = 1;
    let quantidade = 0;
    do {
      quantidade++;
      produto *= aleatorio();
    } while (produto > limite && quantidade < 12);
    return quantidade - 1;
  }

  const LIGAS_PRINCIPAIS_NPCS = new Set([
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "Brasileirão",
  ]);
  const JOGADORES_FAMOSOS_NPCS = new Set([
    "messi",
    "cristiano-ronaldo",
    "neymar",
  ]);

  function limitarNumeroRanking(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, Number(valor) || 0));
  }

  function escolherComPesoRanking(jogadores, obterPeso, aleatorio) {
    if (!jogadores.length) return null;
    const pesos = jogadores.map((jogador) =>
      Math.max(0.001, obterPeso(jogador)),
    );
    const total = pesos.reduce((soma, peso) => soma + peso, 0);
    let sorteio = aleatorio() * total;
    for (let indice = 0; indice < jogadores.length; indice++) {
      sorteio -= pesos[indice];
      if (sorteio <= 0) return jogadores[indice];
    }
    return jogadores[jogadores.length - 1];
  }

  function obterPesoQualidadeNpc(jogador) {
    const peso = Math.max(0.5, Number(jogador.pesoRanking) || 1);
    return limitarNumeroRanking(0.9 + Math.log2(peso) * 0.12, 0.78, 1.42);
  }

  function obterMultiplicadorHistoricoNpc(jogador, ano) {
    const id = String(jogador.id || "").replace(/^real:/, "");
    // Bônus restritos a temporadas históricas específicas; não são aplicados
    // a jogadores fictícios nem a todos os anos de auge dos jogadores reais.
    if (id === "messi" && Number(ano) === 2012) return 3.35;
    if (id === "cristiano-ronaldo" && Number(ano) === 2008) return 2.25;
    return 1;
  }

  function obterEscalacaoNpc(elenco, clubeId, rodada, ano) {
    const escalacao = [];
    POSICOES_ELENCO_LIGA.forEach((posicao) => {
      const candidatos = elenco.filter(
        (jogador) => String(jogador.posicao || "").toUpperCase() === posicao,
      );
      if (!candidatos.length) return;
      const sorteador = criarSorteadorRanking(
        `${ano}:${clubeId}:${rodada}:titular:${posicao}`,
      );
      const escolhido = escolherComPesoRanking(
        candidatos,
        (jogador) =>
          limitarNumeroRanking(Number(jogador.pesoRanking) || 1, 0.5, 15),
        sorteador,
      );
      if (escolhido) escalacao.push(escolhido);
    });
    return escalacao;
  }

  function obterPesosGolsNpc(jogador, ano) {
    const posicao = String(jogador.posicao || "").toUpperCase();
    const pesos = {
      GOL: 0.015,
      ZCE: 0.16,
      ZCD: 0.16,
      LE: 0.28,
      LD: 0.28,
      ME: 0.78,
      MC: 0.68,
      MD: 0.78,
      PE: 2.0,
      CA: 2.8,
      PD: 2.0,
    };
    return (
      (pesos[posicao] || 0.5) *
      obterPesoQualidadeNpc(jogador) *
      obterMultiplicadorHistoricoNpc(jogador, ano)
    );
  }

  function obterPesosAssistenciasNpc(jogador) {
    const posicao = String(jogador.posicao || "").toUpperCase();
    const pesos = {
      GOL: 0.02,
      ZCE: 0.18,
      ZCD: 0.18,
      LE: 0.62,
      LD: 0.62,
      ME: 2.15,
      MC: 2.3,
      MD: 2.15,
      PE: 1.65,
      CA: 0.72,
      PD: 1.65,
    };
    return (pesos[posicao] || 0.5) * obterPesoQualidadeNpc(jogador);
  }

  function obterForcaRelativaNpc(clube, mediaForca) {
    const forca = clube ? forcaClube(clube) : 65;
    return limitarNumeroRanking(1 + (forca - mediaForca) * 0.008, 0.78, 1.22);
  }

  function simularPartidaNpc(
    mandante,
    visitante,
    rodada,
    ano,
    jogadoresPorClube,
    mediaForca,
  ) {
    const sorteador = criarSorteadorRanking(
      `${ano}:${mandante.liga || ""}:${rodada}:${mandante.id}:${visitante.id}:placar`,
    );
    const elencoCasa = jogadoresPorClube.get(mandante.id) || [];
    const elencoFora = jogadoresPorClube.get(visitante.id) || [];
    const escalaCasa = obterEscalacaoNpc(elencoCasa, mandante.id, rodada, ano);
    const escalaFora = obterEscalacaoNpc(elencoFora, visitante.id, rodada, ano);
    if (!escalaCasa.length || !escalaFora.length) return;

    const fatorCasa = obterForcaRelativaNpc(mandante, mediaForca);
    const fatorFora = obterForcaRelativaNpc(visitante, mediaForca);
    const equilibrio = limitarNumeroRanking(fatorCasa / fatorFora, 0.78, 1.28);
    // Os gols são sorteados uma única vez por equipe e partida. Depois são
    // distribuídos entre os titulares: a soma individual nunca supera o placar.
    const golsCasa = Math.min(
      7,
      sortearPoissonRanking(1.42 * 1.07 * equilibrio, sorteador),
    );
    const golsFora = Math.min(
      7,
      sortearPoissonRanking(1.16 / equilibrio, sorteador),
    );
    const times = [
      {
        clube: mandante,
        escalacao: escalaCasa,
        gols: golsCasa,
        golsSofridos: golsFora,
        lado: "casa",
      },
      {
        clube: visitante,
        escalacao: escalaFora,
        gols: golsFora,
        golsSofridos: golsCasa,
        lado: "fora",
      },
    ];

    times.forEach((time) => {
      time.escalacao.forEach((jogador) => {
        jogador.jogos++;
        jogador.jogosLiga++;
        if (time.gols > time.golsSofridos) jogador.vitorias++;
        const posicao = String(jogador.posicao || "").toUpperCase();
        if (
          time.golsSofridos === 0 &&
          ["GOL", "ZCE", "ZCD", "LE", "LD"].includes(posicao)
        ) {
          jogador.jogosSemSofrer++;
        }
        const sorteadorAcao = criarSorteadorRanking(
          `${ano}:${rodada}:${time.clube.id}:${jogador.id}:acoes`,
        );
        if (["ZCE", "ZCD", "LE", "LD"].includes(posicao)) {
          jogador.desarmes += sortearPoissonRanking(1.45, sorteadorAcao);
        } else if (["ME", "MC", "MD"].includes(posicao)) {
          jogador.desarmes += sortearPoissonRanking(0.85, sorteadorAcao);
        } else if (["PE", "CA", "PD"].includes(posicao)) {
          jogador.desarmes += sortearPoissonRanking(0.28, sorteadorAcao);
        }
        if (posicao === "GOL") {
          jogador.defesas += Math.max(
            0,
            sortearPoissonRanking(
              2.15 + time.golsSofridos * 0.45,
              sorteadorAcao,
            ) - time.golsSofridos,
          );
        }
      });

      const golsDaEquipe = [];
      for (let indice = 0; indice < time.gols; indice++) {
        const sorteadorGol = criarSorteadorRanking(
          `${ano}:${rodada}:${time.clube.id}:gol:${indice}`,
        );
        const autor = escolherComPesoRanking(
          time.escalacao,
          (jogador) => obterPesosGolsNpc(jogador, ano),
          sorteadorGol,
        );
        if (!autor) continue;
        autor.gols++;
        golsDaEquipe.push(autor);
      }

      golsDaEquipe.forEach((autor, indice) => {
        const sorteadorAssistencia = criarSorteadorRanking(
          `${ano}:${rodada}:${time.clube.id}:assistencia:${indice}`,
        );
        if (sorteadorAssistencia() >= 0.66) return;
        const candidatos = time.escalacao.filter(
          (jogador) => jogador.id !== autor.id,
        );
        const assistente = escolherComPesoRanking(
          candidatos,
          obterPesosAssistenciasNpc,
          sorteadorAssistencia,
        );
        if (assistente) assistente.assistencias++;
      });
    });
  }

  function contarJogosConcluidosTemporada() {
    const jogosLiga = (estado?.rodadas || [])
      .flat()
      .filter(
        (partida) =>
          (partida.status === "concluida" || partida.status === "concluido") &&
          ((partida.casaId || partida.clubeCasaId) === estado.clubeId ||
            (partida.foraId || partida.clubeForaId) === estado.clubeId) &&
          !ehPartidaDeIA(partida),
      ).length;
    const jogosOutrasCompeticoes = (estado?.partidas || []).filter(
      (partida) =>
        (partida.status === "concluida" || partida.status === "concluido") &&
        partida.competicao !== estado?.liga &&
        !ehPartidaDeIA(partida),
    ).length;
    return jogosLiga + jogosOutrasCompeticoes;
  }

  function obterRankingOutrasLigas() {
    const finalizarMedicao = window.FootMainPerformance?.start(
      "simulacao_outras_ligas_e_clubes",
    );
    const base =
      typeof ehClubeBase === "function" && ehClubeBase(estado?.clubeId);
    const jogosUsuario = contarJogosConcluidosTemporada();
    const cache = estado.rankingGlobalOutrasLigas;
    const cacheValido =
      cache?.versao === 16 &&
      cache?.ano === estado.ano &&
      Array.isArray(cache.jogadores);
    if (cacheValido && cache.jogosUsuario === jogosUsuario) {
      finalizarMedicao?.();
      return cache.jogadores;
    }

    const clubesAlvo = base
      ? (estado.tabela || [])
          .map((time) => obterClube(time.id) || time)
          .filter((clube) => clube.tipo === "base" && clube.id)
      : clubesDisponiveis().filter(
          (clube) =>
            clube.tipo !== "base" &&
            clube.liga !== estado.liga &&
            LIGAS_PRINCIPAIS_NPCS.has(clube.liga),
        );

    const clubesPorId = new Map(clubesAlvo.map((clube) => [clube.id, clube]));
    const jogadoresPorClube = new Map();
    const jogadores = [];
    clubesAlvo.forEach((clube) => {
      const elenco = criarElencoLiga(clube);
      jogadoresPorClube.set(clube.id, elenco);
      jogadores.push(...elenco);
    });

    if (!base) {
      JOGADORES_REAIS.filter((jogador) =>
        JOGADORES_FAMOSOS_NPCS.has(jogador.id),
      ).forEach((jogador) => {
        const clubeId = clubeJogadorRealNaTemporada(jogador, estado.ano);
        const clube = obterClube(clubeId);
        if (!clube || clube.liga === estado.liga || !clubesPorId.has(clubeId))
          return;
        const id = `real:${jogador.id}`;
        if (jogadores.some((item) => item.id === id)) return;
        const real = {
          id,
          nome: jogador.nome,
          posicao: jogador.posicao,
          clubeId,
          idade: Number(estado.ano) - jogador.anoNascimento,
          pesoRanking:
            calcularPesoRankingReal(jogador, estado.ano) *
            calcularMultiplicadorFormaTemporada(
              id,
              estado.ano,
              jogador.posicao,
            ),
          gols: 0,
          assistencias: 0,
          jogos: 0,
          vitorias: 0,
          jogosSemSofrer: 0,
          desarmes: 0,
          defesas: 0,
          titulosIndividuais: [],
        };
        jogadores.push(real);
        jogadoresPorClube.get(clubeId)?.push(real);
      });
    }

    // Zera estatísticas calculadas: o resultado é reconstruído deterministicamente
    // para o número atual de partidas, sem acumular uma simulação antiga.
    const jogadoresAntigos = new Map(
      (cache?.ano === estado.ano && Array.isArray(cache.jogadores)
        ? cache.jogadores
        : []
      ).map((jogador) => [jogador.id, jogador]),
    );
    jogadores.forEach((jogador) => {
      const antigo = jogadoresAntigos.get(jogador.id);
      jogador.gols = 0;
      jogador.assistencias = 0;
      jogador.jogos = 0;
      jogador.jogosLiga = 0;
      jogador.vitorias = 0;
      jogador.jogosSemSofrer = 0;
      jogador.desarmes = 0;
      jogador.defesas = 0;
      jogador.titulosIndividuais = Array.isArray(antigo?.titulosIndividuais)
        ? antigo.titulosIndividuais
        : [];
    });

    // NPCs não recebem automaticamente a mesma quantidade ilimitada de jogos
    // de uma carreira: usamos um calendário de até 55 partidas por temporada.
    const quantidadeRodadas = Math.min(55, Math.max(0, jogosUsuario));
    jogadores.forEach((jogador) => {
      jogador.jogosReferencia = quantidadeRodadas;
    });
    const ligas = new Map();
    clubesAlvo.forEach((clube) => {
      const chaveLiga = clube.liga || (base ? "base" : "outras");
      if (!ligas.has(chaveLiga)) ligas.set(chaveLiga, []);
      ligas.get(chaveLiga).push(clube);
    });
    const mediaForca = clubesAlvo.length
      ? clubesAlvo.reduce((soma, clube) => soma + forcaClube(clube), 0) /
        clubesAlvo.length
      : 65;

    ligas.forEach((clubesLiga) => {
      const participantes = [...clubesLiga].sort((a, b) =>
        String(a.id).localeCompare(String(b.id)),
      );
      if (participantes.length < 2) return;
      if (participantes.length % 2 !== 0) participantes.push(null);
      const tamanho = participantes.length;
      let rotacao = [...participantes];
      for (let rodada = 0; rodada < quantidadeRodadas; rodada++) {
        for (let indice = 0; indice < tamanho / 2; indice++) {
          let mandante = rotacao[indice];
          let visitante = rotacao[tamanho - 1 - indice];
          if (!mandante || !visitante) continue;
          if (rodada % 2 === 1) [mandante, visitante] = [visitante, mandante];
          simularPartidaNpc(
            mandante,
            visitante,
            rodada,
            estado.ano,
            jogadoresPorClube,
            mediaForca,
          );
        }
        // Método do círculo: cada equipe disputa exatamente uma partida por rodada.
        rotacao = [
          rotacao[0],
          rotacao[tamanho - 1],
          ...rotacao.slice(1, tamanho - 1),
        ];
      }
    });

    estado.rankingGlobalOutrasLigas = {
      versao: 16,
      ano: estado.ano,
      jogosUsuario,
      jogadores,
    };
    finalizarMedicao?.();
    return jogadores;
  }

  function eventosDaPartidaRanking(partidas) {
    return partidas.flatMap((partida) => partida.eventosIndividuais || []);
  }

  function obterRankingsCompeticao(competicao) {
    const jogadores = new Map();
    const obterJogador = (id, nome, clubeId, posicao) => {
      if (!id) return null;
      const posicaoElenco = estado.elencosLiga?.[clubeId]?.find(
        (jogador) => jogador.id === id,
      )?.posicao;
      const identidade = chaveIdentidadeRanking(id, nome);
      if (!jogadores.has(identidade)) {
        jogadores.set(identidade, {
          id,
          nome: nome || "Jogador",
          clubeId,
          posicao: posicao || posicaoElenco || "",
          gols: 0,
          assistencias: 0,
        });
      }
      const jogador = jogadores.get(identidade);
      if (id === estado?.carreiraId) jogador.id = id;
      if (nome) jogador.nome = nome;
      if (clubeId) jogador.clubeId = clubeId;
      if (posicao || posicaoElenco) jogador.posicao = posicao || posicaoElenco;
      return jogador;
    };

    const partidasLiga = (estado?.rodadas || []).flatMap((rodada) => rodada);
    const partidasOutras = (estado?.partidas || []).filter(
      (partida) =>
        partida.status === "concluida" && partida.competicao !== estado?.liga,
    );
    let eventos = [];
    if (competicao === "global") {
      eventos = eventosDaPartidaRanking([...partidasLiga, ...partidasOutras]);
      obterRankingOutrasLigas().forEach((jogador) => {
        const agregado = obterJogador(
          jogador.id,
          jogador.nome,
          jogador.clubeId,
          jogador.posicao,
        );
        agregado.gols += jogador.gols;
        agregado.assistencias += jogador.assistencias;
      });
    } else if (competicao === estado?.liga) {
      eventos = eventosDaPartidaRanking(
        partidasLiga.filter((partida) => partida.status === "concluido"),
      );
    } else {
      eventos = eventosDaPartidaRanking(
        partidasOutras.filter((partida) => partida.competicao === competicao),
      );
    }
    eventos.forEach((evento) => {
      const autor = obterJogador(
        evento.autorId,
        evento.autorNome,
        evento.clubeId,
        evento.autorPosicao,
      );
      if (autor) autor.gols++;
      const assistente = obterJogador(
        evento.assistenteId,
        evento.assistenteNome,
        evento.clubeId,
        evento.assistentePosicao,
      );
      if (assistente) assistente.assistencias++;
    });

    const montarRanking = (metrica, desempate) =>
      [...jogadores.values()]
        .filter((jogador) => jogador[metrica] > 0)
        .sort(
          (a, b) =>
            b[metrica] - a[metrica] ||
            b[desempate] - a[desempate] ||
            a.nome.localeCompare(b.nome, "pt-BR"),
        )
        .slice(0, 50)
        .map((jogador, indice) => ({
          ...jogador,
          posicao: indice + 1,
          clube:
            obterClube(jogador.clubeId)?.nome ||
            SELECOES.find((selecao) => selecao.id === jogador.clubeId)?.nome ||
            jogador.clubeId ||
            "Clube",
        }));

    return {
      artilharia: montarRanking("gols", "assistencias"),
      assistencias: montarRanking("assistencias", "gols"),
    };
  }

  const PESOS_TITULOS_BOLA_DE_OURO = new Map([
    ["Copa do Mundo", 18],
    ["Copa do Mundo de Clubes", 15],
    ["Intercontinental", 13],
    ["Champions League", 12],
    ["Libertadores", 12],
    ["Eurocopa", 11],
    ["Copa América", 11],
    ["Olimpíadas", 8],
    ["Copa das Nações Africanas", 10],
    ["Copa da Ásia", 10],
    ["Copa Ouro", 10],
    ["Copa das Nações da OFC", 9],
    ["CONCACAF Champions Cup", 10],
    ["AFC Champions League", 10],
    ["CAF Champions League", 10],
    ["Europa League", 8],
    ["Copa Sul-Americana", 8],
    ["AFC Champions League 2", 7],
    ["CAF Confederation Cup", 7],
    ["Conference League", 6],
    ["Mundial Sub-20", 4],
    ["Mundial Sub-17", 3],
    ["Premier League", 11],
    ["La Liga", 10],
    ["Serie A", 10],
    ["Bundesliga", 10],
    ["Brasileirão", 10],
    ["Série A Br", 10],
    ["Ligue 1", 9],
    ["Primeira Liga", 8],
    ["Eredivisie", 8],
    ["Serie A Argentina", 9],
    ["Liga Profesional", 9],
    ["Liga BetPlay", 7],
    ["Primera División", 7],
    ["LigaPro", 7],
    ["Liga MX", 8],
    ["MLS Cup", 7],
    ["Saudi Pro League", 7],
    ["Carabao Cup", 5],
    ["Copa del Rey", 7],
    ["Coppa Italia", 7],
    ["DFB-Pokal", 7],
    ["Coupe de France", 6],
    ["Taça de Portugal", 6],
    ["KNVB Beker", 6],
    ["Copa do Brasil", 8],
    ["Copa Argentina", 7],
    ["Copa Colombia", 6],
    ["Copa Chile", 6],
    ["Copa Uruguay", 6],
    ["Copa Ecuador", 6],
    ["Copa Paraguay", 6],
    ["US Open Cup", 5],
    ["Copa MX", 5],
    ["King's Cup", 5],
    ["Emperor's Cup", 5],
    ["Carioca", 3],
    ["Paulistão", 3],
    ["Gauchão", 2],
    ["Mineiro", 3],
    ["Baianão", 2],
    ["Pernambucano", 2],
    ["Cearense", 2],
  ]);

  const FATORES_DIFICULDADE_LIGAS = new Map([
    ["Premier League", 1.35],
    ["Serie A", 1.24],
    ["La Liga", 1.22],
    ["Bundesliga", 1.18],
    ["Brasileirão", 1],
    ["Argentine Primera División", 1.07],
    ["Primeira Liga", 1.05],
    ["Ligue 1", 1.03],
    ["Eredivisie", 1.02],
    ["Süper Lig", 0.98],
    ["Belgian Pro League", 0.96],
    ["Scottish Premiership", 0.95],
    ["Swiss Super League", 0.92],
    ["Austrian Bundesliga", 0.92],
    ["Russian Premier League", 0.91],
    ["Ukrainian Premier League", 0.86],
    ["Greek Super League", 0.86],
    ["Colombian Primera A", 0.9],
    ["Chilean Primera División", 0.86],
    ["Uruguayan Primera División", 0.85],
    ["Ecuadorian Serie A", 0.83],
    ["Paraguayan Primera División", 0.81],
    ["Liga MX", 0.94],
    ["MLS", 0.88],
    ["Saudi Pro League", 0.88],
    ["J1 League", 0.86],
    ["K League 1", 0.81],
    ["Chinese Super League", 0.79],
    ["Ekstraklasa", 0.8],
    ["Australian A-League", 0.77],
    ["Egyptian Premier League", 0.82],
    ["Moroccan Botola", 0.77],
    ["South African Premier Division", 0.74],
    ["Carioca", 0.68],
    ["Paulistão", 0.67],
    ["Mineiro", 0.65],
    ["Gauchão", 0.64],
    ["Baianão", 0.61],
    ["Pernambucano", 0.6],
    ["Cearense", 0.59],
    ["League One", 0.66],
    ["EFL League One", 0.66],
    ["Série A Br", 1.15],
    ["Liga Profesional", 1.07],
    ["Liga BetPlay", 0.9],
    ["Primera División", 0.85],
    ["LigaPro", 0.83],
    ["MLS Cup", 0.88],
    ["A-League", 0.77],
    ["Betway Premiership", 0.74],
    ["Botola Pro", 0.77],
  ]);

  const TITULOS_GLOBAIS_BOLA_DE_OURO = new Set([
    "Copa do Mundo",
    "Copa do Mundo de Clubes",
    "Intercontinental",
  ]);

  const FATORES_DIFICULDADE_CONTINENTAIS = new Map([
    ["Champions League", 1.4],
    ["Libertadores", 1.1],
    ["Eurocopa", 1.18],
    ["Copa América", 1.14],
    ["CONCACAF Champions Cup", 0.98],
    ["Copa das Nações Africanas", 0.86],
    ["CAF Champions League", 0.82],
    ["AFC Champions League", 0.9],
    ["Copa da Ásia", 0.9],
    ["Copa Ouro", 0.88],
    ["Copa das Nações da OFC", 0.72],
    ["Copa Sul-Americana", 1.02],
    ["Europa League", 1.08],
    ["Conference League", 0.96],
    ["AFC Champions League 2", 0.78],
    ["CAF Confederation Cup", 0.72],
  ]);

  const COMPETICOES_ESTADUAIS_BOLA_DE_OURO = new Set([
    "Carioca",
    "Paulistão",
    "Gauchão",
    "Mineiro",
    "Baianão",
    "Pernambucano",
    "Cearense",
  ]);

  function obterFatorDificuldadeLiga(liga) {
    return FATORES_DIFICULDADE_LIGAS.get(liga) || 0.78;
  }

  function obterFatorDificuldadeCompeticao(competicao, ligaFallback) {
    if (FATORES_DIFICULDADE_CONTINENTAIS.has(competicao)) {
      return FATORES_DIFICULDADE_CONTINENTAIS.get(competicao);
    }
    const fatorLiga = obterFatorDificuldadeLiga(ligaFallback);
    if (COMPETICOES_ESTADUAIS_BOLA_DE_OURO.has(competicao)) {
      return competicao === ligaFallback ? fatorLiga : fatorLiga * 0.62;
    }
    if (FATORES_DIFICULDADE_LIGAS.has(competicao)) {
      return obterFatorDificuldadeLiga(competicao);
    }
    return fatorLiga;
  }

  function obterEstatisticasPonderadasBolaDeOuro() {
    if (cacheEstatisticasBolaDeOuro?.versao === versaoResultados) {
      return cacheEstatisticasBolaDeOuro.estatisticas;
    }
    const estatisticas = new Map();
    const obterJogador = (id, clubeId = "") => {
      if (!id) return null;
      const chave = String(id);
      if (!estatisticas.has(chave)) {
        estatisticas.set(chave, {
          clubeId,
          gols: 0,
          assistencias: 0,
          golsPonderados: 0,
          assistenciasPonderadas: 0,
          jogos: 0,
          jogosLiga: 0,
          jogosReferencia: 0,
          vitorias: 0,
          jogosSemSofrer: 0,
          desarmes: 0,
          defesas: 0,
        });
      }
      const jogador = estatisticas.get(chave);
      if (clubeId) jogador.clubeId = clubeId;
      return jogador;
    };

    const partidasLiga = (estado?.rodadas || []).flatMap((rodada) => rodada);
    const partidasOutras = (estado?.partidas || []).filter(
      (partida) =>
        partida.status === "concluida" && partida.competicao !== estado?.liga,
    );
    const partidas = [...partidasLiga, ...partidasOutras].filter(
      (partida) =>
        partida.status === "concluida" || partida.status === "concluido",
    );

    partidas.forEach((partida) => {
      const competicao = partida.competicao || estado?.liga || "";
      const casaId = partida.casaId || partida.clubeCasaId;
      const foraId = partida.foraId || partida.clubeForaId;
      const golsCasa = Number(partida.golsCasa);
      const golsFora = Number(partida.golsFora);
      const participantes = Array.isArray(partida.jogadoresParticipantes)
        ? partida.jogadoresParticipantes
        : [];

      participantes.forEach((jogador) => {
        const agregado = obterJogador(jogador.id, jogador.clubeId);
        if (!agregado) return;
        agregado.jogos++;
        if (competicao === estado?.liga) agregado.jogosLiga++;
        const clubeId = jogador.clubeId;
        const venceu =
          clubeId === casaId
            ? golsCasa > golsFora
            : clubeId === foraId
              ? golsFora > golsCasa
              : false;
        const semSofrer =
          clubeId === casaId
            ? golsFora === 0
            : clubeId === foraId
              ? golsCasa === 0
              : false;
        if (venceu) agregado.vitorias++;
        if (semSofrer) agregado.jogosSemSofrer++;
        agregado.desarmes += Math.max(0, Number(jogador.desarmes) || 0);
        agregado.defesas += Math.max(0, Number(jogador.defesas) || 0);
      });

      const envolvidosNoJogo = new Set(
        participantes.map((jogador) => String(jogador.id)),
      );
      (partida.eventosIndividuais || []).forEach((evento) => {
        // Compatibilidade com partidas antigas, salvas antes do registro das escalações.
        [evento.autorId, evento.assistenteId].filter(Boolean).forEach((id) => {
          const chave = String(id);
          if (!envolvidosNoJogo.has(chave)) {
            const envolvido = obterJogador(id, evento.clubeId);
            if (envolvido) envolvidosNoJogo.add(chave);
          }
        });
        const fator = obterFatorDificuldadeCompeticao(
          competicao,
          obterClube(evento.clubeId)?.liga,
        );
        const autor = obterJogador(evento.autorId, evento.clubeId);
        if (autor) {
          autor.gols++;
          autor.golsPonderados += fator;
        }
        const assistente = obterJogador(evento.assistenteId, evento.clubeId);
        if (assistente) {
          assistente.assistencias++;
          assistente.assistenciasPonderadas += fator;
        }
      });
      if (!participantes.length) {
        envolvidosNoJogo.forEach((id) => {
          const envolvido = obterJogador(id);
          if (envolvido) {
            envolvido.jogos++;
            if (competicao === estado?.liga) envolvido.jogosLiga++;
          }
        });
      }
    });

    obterRankingOutrasLigas().forEach((jogador) => {
      const agregado = obterJogador(jogador.id, jogador.clubeId);
      if (!agregado) return;
      const fator = obterFatorDificuldadeCompeticao(
        obterClube(jogador.clubeId)?.liga || "",
        obterClube(jogador.clubeId)?.liga,
      );
      const gols = Math.max(0, Number(jogador.gols) || 0);
      const assistencias = Math.max(0, Number(jogador.assistencias) || 0);
      agregado.gols += gols;
      agregado.assistencias += assistencias;
      agregado.golsPonderados += gols * fator;
      agregado.assistenciasPonderadas += assistencias * fator;
      agregado.jogos = Math.max(agregado.jogos, Number(jogador.jogos) || 0);
      agregado.jogosLiga = Math.max(
        agregado.jogosLiga,
        Number(jogador.jogosLiga ?? jogador.jogos) || 0,
      );
      agregado.jogosReferencia = Math.max(
        agregado.jogosReferencia,
        Number(jogador.jogosReferencia) || 0,
      );
      agregado.vitorias = Math.max(
        agregado.vitorias,
        Number(jogador.vitorias) || 0,
      );
      agregado.jogosSemSofrer = Math.max(
        agregado.jogosSemSofrer,
        Number(jogador.jogosSemSofrer) || 0,
      );
      agregado.desarmes = Math.max(
        agregado.desarmes || 0,
        Number(jogador.desarmes) || 0,
      );
      agregado.defesas = Math.max(
        agregado.defesas || 0,
        Number(jogador.defesas) || 0,
      );
    });

    cacheEstatisticasBolaDeOuro = { versao: versaoResultados, estatisticas };
    return estatisticas;
  }

  function obterCategoriaBolaDeOuro(posicao) {
    const pos = String(posicao || "").toUpperCase();
    if (pos === "GOL") return "goleiro";
    if (["ZCE", "ZCD", "LE", "LD"].includes(pos)) return "defensor";
    if (["ME", "MC", "MD"].includes(pos)) return "meio-campista";
    if (["PE", "CA", "PD"].includes(pos)) return "atacante";
    return "";
  }

  function calcularDesempenhoBolaDeOuro(jogador, dados, liga = "") {
    const jogos = Math.max(0, Number(dados.jogos) || 0);
    const gols = Math.max(0, Number(dados.gols ?? jogador.gols) || 0);
    const assistencias = Math.max(
      0,
      Number(dados.assistencias ?? jogador.assistencias) || 0,
    );
    const fatorDificuldadeLiga = obterFatorDificuldadeCompeticao(liga, liga);
    const obterEstatisticaPonderada = (valor, registrado, ponderado) => {
      const totalRegistrado = Math.max(0, Number(registrado) || 0);
      const totalPonderado = Math.max(0, Number(ponderado) || 0);
      if (totalRegistrado > 0 && totalPonderado > 0) {
        return totalPonderado * (valor / totalRegistrado);
      }
      return valor * fatorDificuldadeLiga;
    };
    const golsPonderados = obterEstatisticaPonderada(
      gols,
      dados.gols,
      dados.golsPonderados,
    );
    const assistenciasPonderadas = obterEstatisticaPonderada(
      assistencias,
      dados.assistencias,
      dados.assistenciasPonderadas,
    );
    const desarmes = Math.max(0, Number(dados.desarmes) || 0);
    const defesas = Math.max(0, Number(dados.defesas) || 0);
    const jogosSemSofrer = Math.max(0, Number(dados.jogosSemSofrer) || 0);
    const categoria = obterCategoriaBolaDeOuro(jogador.posicao);
    const taxa = (valor) => (jogos > 0 ? valor / jogos : 0);
    const pontuarTaxa = (valor, referencia) =>
      Math.max(0, Math.min(100, (valor / referencia) * 100));
    const golsPorJogo = taxa(gols);
    const assistenciasPorJogo = taxa(assistencias);
    const golsPonderadosPorJogo = taxa(golsPonderados);
    const assistenciasPonderadasPorJogo = taxa(assistenciasPonderadas);
    const desarmesPorJogo = taxa(desarmes);
    const defesasPorJogo = taxa(defesas);
    const jogosSemSofrerPorJogo = taxa(jogosSemSofrer);
    if (!categoria) {
      return {
        categoria,
        notaIndividual: 0,
        temContribuicaoIndividual: false,
        gols,
        assistencias,
        jogos,
        desarmes,
        defesas,
        jogosSemSofrer,
        golsPorJogo,
        assistenciasPorJogo,
        golsPonderados,
        assistenciasPonderadas,
        golsPonderadosPorJogo,
        assistenciasPonderadasPorJogo,
        desarmesPorJogo,
        defesasPorJogo,
        jogosSemSofrerPorJogo,
      };
    }
    let desempenho;

    if (categoria === "atacante") {
      desempenho =
        pontuarTaxa(golsPonderadosPorJogo, 0.75) * 0.6 +
        pontuarTaxa(assistenciasPonderadasPorJogo, 0.45) * 0.4;
    } else if (categoria === "meio-campista") {
      desempenho =
        pontuarTaxa(golsPonderadosPorJogo, 0.3) * 0.25 +
        pontuarTaxa(assistenciasPonderadasPorJogo, 0.5) * 0.35 +
        pontuarTaxa(desarmesPorJogo, 1.8) * 0.4;
    } else if (categoria === "defensor") {
      desempenho =
        pontuarTaxa(desarmesPorJogo, 1.8) * 0.35 +
        pontuarTaxa(jogosSemSofrerPorJogo, 0.35) * 0.35 +
        pontuarTaxa(golsPonderadosPorJogo, 0.12) * 0.15 +
        pontuarTaxa(assistenciasPonderadasPorJogo, 0.18) * 0.15;
    } else {
      desempenho =
        pontuarTaxa(defesasPorJogo, 3) * 0.55 +
        pontuarTaxa(jogosSemSofrerPorJogo, 0.35) * 0.45;
    }

    const overall = Math.max(0, Math.min(100, Number(jogador.overall) || 0));
    const notaIndividual = desempenho * 0.95 + overall * 0.05;
    const temDesempenhoDefensivo =
      categoria === "defensor"
        ? desarmes > 0 || jogosSemSofrer > 0
        : categoria === "goleiro"
          ? defesas > 0 || jogosSemSofrer > 0
          : false;

    return {
      categoria,
      notaIndividual,
      temContribuicaoIndividual:
        categoria === "atacante"
          ? gols > 0 || assistencias > 0
          : categoria === "meio-campista"
            ? gols > 0 || assistencias > 0 || desarmes > 0
            : temDesempenhoDefensivo || gols > 0 || assistencias > 0,
      gols,
      assistencias,
      jogos,
      desarmes,
      defesas,
      jogosSemSofrer,
      golsPorJogo,
      assistenciasPorJogo,
      golsPonderados,
      assistenciasPonderadas,
      golsPonderadosPorJogo,
      assistenciasPonderadasPorJogo,
      desarmesPorJogo,
      defesasPorJogo,
      jogosSemSofrerPorJogo,
    };
  }

  function calcularPesoTituloBolaDeOuro(titulo, liga) {
    let pesoBase = 1;
    if (PESOS_TITULOS_BOLA_DE_OURO.has(titulo)) {
      pesoBase = PESOS_TITULOS_BOLA_DE_OURO.get(titulo);
    } else if (/supercopa|super cup/i.test(titulo)) {
      pesoBase = 3;
    } else if (
      /estadual|carioca|paulist[aã]o|gauch[aã]o|mineiro|baian[aã]o|pernambucano|cearense/i.test(
        titulo,
      )
    ) {
      pesoBase = 2;
    } else if (/liga|league|division|división|brasileir[aã]o/i.test(titulo)) {
      pesoBase = 7;
    } else if (/copa|cup|pokal|taça/i.test(titulo)) {
      pesoBase = 4;
    }
    if (TITULOS_GLOBAIS_BOLA_DE_OURO.has(titulo)) return pesoBase;
    const fatorCompeticao = FATORES_DIFICULDADE_CONTINENTAIS.get(titulo);
    return pesoBase * (fatorCompeticao || obterFatorDificuldadeLiga(liga));
  }

  function obterJogosReferenciaClube(clubeId, estatisticas = {}) {
    const partidasLiga = (estado?.rodadas || []).flatMap((rodada) => rodada);
    const jogosLiga = partidasLiga.filter(
      (partida) => partida.casaId === clubeId || partida.foraId === clubeId,
    ).length;
    if (jogosLiga > 0) return jogosLiga;
    return Math.max(0, Number(estatisticas.jogosReferencia) || 0);
  }

  function ordenarClubesCampanha(
    clubes,
    identificador,
    usarTabelaReal = false,
  ) {
    if (usarTabelaReal) {
      const posicoes = new Map(
        (estado.tabela || [])
          .filter((time) => !String(time.id).startsWith("__rodada__"))
          .map((time) => [time.id, time]),
      );
      if (clubes.every((clube) => posicoes.has(clube.id))) {
        return [...clubes].sort((a, b) => {
          const timeA = posicoes.get(a.id);
          const timeB = posicoes.get(b.id);
          return (
            Number(timeB.pts || 0) - Number(timeA.pts || 0) ||
            Number(timeB.gp || 0) -
              Number(timeB.gc || 0) -
              (Number(timeA.gp || 0) - Number(timeA.gc || 0)) ||
            Number(timeB.gp || 0) - Number(timeA.gp || 0) ||
            String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR")
          );
        });
      }
    }

    const sorteador = criarSorteadorRanking(`${estado.ano}:${identificador}`);
    return clubes
      .map((clube) => ({
        clube,
        nivel: forcaClube(clube) * (0.9 + sorteador() * 0.2),
      }))
      .sort(
        (a, b) =>
          b.nivel - a.nivel ||
          String(a.clube.nome || "").localeCompare(
            String(b.clube.nome || ""),
            "pt-BR",
          ),
      )
      .map((item) => item.clube);
  }

  function obterNivelCampanha(indice, tipo, vagasContinentais) {
    if (indice === 0) return 1;
    if (indice === 1) return 0.75;
    if (tipo === "liga" && indice < 4) return 0.5;
    if (indice < 8) return 0.3;
    if (tipo === "liga" && indice < vagasContinentais) return 0.15;
    return 0;
  }

  function obterResultadosColetivosTemporada() {
    const clubes = clubesDisponiveis().filter((clube) => clube.tipo !== "base");
    const jogosUsuario = contarJogosConcluidosTemporada();
    const titulosUsuario = [...new Set(estado.trofeusClube || [])]
      .sort()
      .join("|");
    const classificacaoUsuario = (estado.tabela || [])
      .filter((time) => !String(time.id).startsWith("__rodada__"))
      .map(
        (time) =>
          `${time.id}:${Number(time.pts) || 0}:${Number(time.gp) || 0}:${Number(time.gc) || 0}`,
      )
      .sort()
      .join("|");
    const cache = estado.resultadosColetivosTemporada;
    if (
      cache?.versao === 3 &&
      cache.ano === estado.ano &&
      cache.jogosUsuario === jogosUsuario &&
      cache.titulosUsuario === titulosUsuario &&
      cache.classificacaoUsuario === classificacaoUsuario
    ) {
      return new Map(
        (cache.clubes || []).map(([id, campanhas]) => [id, campanhas]),
      );
    }

    const campanhasPorClube = new Map(clubes.map((clube) => [clube.id, []]));
    const nomesPorLiga = new Map();
    const ligas = new Map();
    const titulosReais = new Set(estado.trofeusClube || []);
    clubes.forEach((clube) => {
      const nomes = obterNomesTrofeusClube(clube.id);
      nomesPorLiga.set(clube.liga, nomes);
      if (!ligas.has(clube.liga)) ligas.set(clube.liga, []);
      ligas.get(clube.liga).push(clube);
    });

    const registrarCampanha = (titulo, participantes, tipo, identificador) => {
      if (!titulo || participantes.length === 0) return;
      const participantesDaCampanha = [...participantes];
      if (
        titulosReais.has(titulo) &&
        !participantesDaCampanha.some((clube) => clube.id === estado.clubeId)
      ) {
        const clubeUsuario = clubes.find(
          (clube) => clube.id === estado.clubeId,
        );
        if (clubeUsuario) participantesDaCampanha.push(clubeUsuario);
      }
      const ordem = ordenarClubesCampanha(
        participantesDaCampanha,
        identificador,
        tipo === "liga" && participantesDaCampanha[0]?.liga === estado.liga,
      );
      const ligaComResultadoReal =
        tipo === "liga" && participantesDaCampanha[0]?.liga === estado.liga;
      if (titulosReais.has(titulo) && !ligaComResultadoReal) {
        const indiceUsuario = ordem.findIndex(
          (clube) => clube.id === estado.clubeId,
        );
        if (indiceUsuario > 0) {
          ordem.unshift(...ordem.splice(indiceUsuario, 1));
        }
      }
      const vagasContinentais =
        tipo === "liga"
          ? participantesDaCampanha.filter((clube) => {
              const continental = determinarCompeticaoContinental(clube.id);
              return continental.principal || continental.secundaria;
            }).length
          : 0;
      ordem.forEach((clube, indice) => {
        const nivel = obterNivelCampanha(indice, tipo, vagasContinentais);
        campanhasPorClube.get(clube.id)?.push({
          titulo,
          nivel,
          tipo,
          posicao: indice + 1,
        });
      });
    };

    ligas.forEach((participantes, liga) => {
      const nomes = nomesPorLiga.get(liga) || {};
      registrarCampanha(nomes.liga, participantes, "liga", `${liga}:liga`);
      registrarCampanha(nomes.copa, participantes, "mata-mata", `${liga}:copa`);
    });

    const clubesPorId = new Map(clubes.map((clube) => [clube.id, clube]));
    const clubesPorCompeticao = new Map(
      Object.keys(CONTINENTAL_CONFS)
        .map((competicao) => [
          competicao,
          (obterParticipantesContinental(competicao) || [])
            .map((id) => clubesPorId.get(id))
            .filter(Boolean),
        ])
        .filter(([, participantes]) => participantes.length > 0),
    );
    const campeoesContinentais = [];
    clubesPorCompeticao.forEach((participantes, titulo) => {
      registrarCampanha(
        titulo,
        participantes,
        "mata-mata",
        `continental:${titulo}`,
      );
      const campeao = participantes.find((clube) =>
        campanhasPorClube
          .get(clube.id)
          ?.some(
            (campanha) => campanha.titulo === titulo && campanha.nivel === 1,
          ),
      );
      if (campeao) campeoesContinentais.push(campeao);
    });
    const participantesMundiais = [
      ...new Map(
        campeoesContinentais.map((clube) => [clube.id, clube]),
      ).values(),
    ];
    registrarCampanha(
      "Copa do Mundo de Clubes",
      participantesMundiais,
      "mata-mata",
      "club-world-cup",
    );
    registrarCampanha(
      "Intercontinental",
      participantesMundiais,
      "mata-mata",
      "intercontinental",
    );

    const resultados = [...campanhasPorClube.entries()];
    estado.resultadosColetivosTemporada = {
      versao: 3,
      ano: estado.ano,
      jogosUsuario,
      titulosUsuario,
      classificacaoUsuario,
      clubes: resultados,
    };
    return new Map(resultados);
  }

  function premiarBolaDeOuro(temporada, estatisticas, historicoCarreira = []) {
    const rankings = obterRankingsCompeticao("global");
    const candidatos = new Map();
    const adicionarCandidato = (jogador) => {
      if (!jogador?.id) return;
      const chave = String(jogador.id);
      const candidato = candidatos.get(chave) || {
        ...jogador,
        gols: 0,
        assistencias: 0,
      };
      candidato.gols = Math.max(
        Number(candidato.gols) || 0,
        Number(jogador.gols) || 0,
      );
      candidato.assistencias = Math.max(
        Number(candidato.assistencias) || 0,
        Number(jogador.assistencias) || 0,
      );
      if (jogador.ehUsuario) candidato.ehUsuario = true;
      candidato.nome = jogador.nome || candidato.nome;
      candidato.clubeId = jogador.clubeId || candidato.clubeId;
      candidato.posicao = jogador.posicao || candidato.posicao;
      candidato.overall = Math.max(
        Number(candidato.overall) || 0,
        Number(jogador.overall) || 0,
      );
      candidatos.set(chave, candidato);
    };

    [rankings.artilharia, rankings.assistencias].forEach((lista) =>
      lista.forEach(adicionarCandidato),
    );
    obterRankingOutrasLigas().forEach(adicionarCandidato);
    Object.entries(estado.elencosLiga || {}).forEach(([clubeId, elenco]) => {
      (elenco || []).forEach((jogador) =>
        adicionarCandidato({ ...jogador, clubeId }),
      );
    });

    const idUsuario = String(estado.carreiraId);
    const clubeUsuario = obterClube(estado.clubeId);
    const usuarioElegivel = !!clubeUsuario && clubeUsuario.tipo !== "base";
    if (usuarioElegivel) {
      adicionarCandidato({
        ...(candidatos.get(idUsuario) || {}),
        id: idUsuario,
        nome: estado.nome,
        clubeId: estado.clubeId,
        posicao: estado.posicao,
        overall: estado.overall,
        gols: Number(estatisticas.golsClube ?? estatisticas.gols) || 0,
        assistencias:
          Number(estatisticas.assistenciasClube ?? estatisticas.assistencias) ||
          0,
        ehUsuario: true,
      });
    } else {
      candidatos.delete(idUsuario);
    }

    const campanhasPorClube = obterResultadosColetivosTemporada();
    const estatisticasPonderadas = obterEstatisticasPonderadasBolaDeOuro();
    temporada.trofeusIndividuais = (temporada.trofeusIndividuais || []).filter(
      (titulo) => titulo !== "Chuteira de Ouro",
    );
    const golsPonderadosMaximos = [...estatisticasPonderadas.values()]
      .filter(
        (dados) => dados.gols > 0 && obterClube(dados.clubeId)?.tipo !== "base",
      )
      .reduce((maximo, dados) => Math.max(maximo, dados.golsPonderados), 0);
    const dadosUsuarioPonderados = estatisticasPonderadas.get(idUsuario);
    if (
      usuarioElegivel &&
      dadosUsuarioPonderados?.gols > 0 &&
      Math.abs(dadosUsuarioPonderados.golsPonderados - golsPonderadosMaximos) <=
        1e-9
    ) {
      temporada.trofeusIndividuais.push("Chuteira de Ouro");
    }
    const rankingChuteira = [...estatisticasPonderadas.entries()]
      .filter(
        ([, dados]) =>
          dados.gols > 0 && obterClube(dados.clubeId)?.tipo !== "base",
      )
      .map(([id, dados]) => {
        const jogador = candidatos.get(id);
        if (!jogador) return null;
        return {
          nome: jogador.nome || "Jogador",
          clube:
            obterClube(jogador.clubeId)?.nome ||
            jogador.clubeId ||
            "Clube não informado",
          posicao: jogador.posicao || "Não informada",
          golsPonderados: dados.golsPonderados,
          gols: dados.gols,
          jogos: dados.jogos,
          ehUsuario: id === idUsuario,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          b.golsPonderados - a.golsPonderados ||
          b.gols - a.gols ||
          a.nome.localeCompare(b.nome, "pt-BR"),
      );
    const posicaoUsuarioChuteira =
      rankingChuteira.findIndex((jogador) => jogador.ehUsuario) + 1;
    const jogosReferenciaPorClube = new Map();
    const pesoMaximoColetivoGlobal = [...campanhasPorClube.entries()].reduce(
      (maximo, [clubeId, campanhas]) => {
        const ligaClube = obterClube(clubeId)?.liga || "";
        const pesoMaximoClube = campanhas.reduce(
          (total, campanha) =>
            total + calcularPesoTituloBolaDeOuro(campanha.titulo, ligaClube),
          0,
        );
        return Math.max(maximo, pesoMaximoClube);
      },
      0,
    );

    const avaliados = [...candidatos.values()]
      .filter(
        (jogador) => jogador.id && obterClube(jogador.clubeId)?.tipo !== "base",
      )
      .map((jogador) => {
        const clube = obterClube(jogador.clubeId);
        const liga = clube?.liga || "";
        const dados = {
          gols: 0,
          assistencias: 0,
          jogos: 0,
          jogosLiga: 0,
          jogosReferencia: 0,
          jogosSemSofrer: 0,
          desarmes: 0,
          defesas: 0,
          ...(estatisticasPonderadas.get(String(jogador.id)) || {}),
        };
        if (jogador.ehUsuario) {
          dados.jogos = Math.max(
            dados.jogos || 0,
            Number(
              estado.estatisticas?.jogosClube ?? estado.estatisticas?.jogos,
            ) || 0,
          );
          dados.vitorias = Math.max(
            dados.vitorias || 0,
            Number(estado.desempenhoPosicional?.vitorias) || 0,
          );
          dados.jogosSemSofrer = Math.max(
            dados.jogosSemSofrer || 0,
            Number(estado.desempenhoPosicional?.jogosSemSofrer) || 0,
          );
          dados.desarmes = Number(estado.estatisticas?.desarmes) || 0;
          dados.defesas = Number(estado.estatisticas?.defesas) || 0;
          dados.gols =
            Number(
              estado.estatisticas?.golsClube ?? estado.estatisticas?.gols,
            ) || 0;
          dados.assistencias =
            Number(
              estado.estatisticas?.assistenciasClube ??
                estado.estatisticas?.assistencias,
            ) || 0;
        }
        if (!jogosReferenciaPorClube.has(jogador.clubeId)) {
          jogosReferenciaPorClube.set(
            jogador.clubeId,
            obterJogosReferenciaClube(jogador.clubeId, dados),
          );
        }
        dados.jogosReferencia = jogosReferenciaPorClube.get(jogador.clubeId);
        const jogosParticipacao = Math.max(0, Number(dados.jogosLiga) || 0);
        const gols = Math.max(0, Number(dados.gols) || 0);
        const assistencias = Math.max(0, Number(dados.assistencias) || 0);
        const desempenho = calcularDesempenhoBolaDeOuro(
          { ...jogador, gols, assistencias },
          dados,
          liga,
        );
        const participacao =
          dados.jogosReferencia > 0
            ? Math.min(1, jogosParticipacao / dados.jogosReferencia)
            : 0;
        const fatorParticipacaoCampanha =
          participacao >= 0.8
            ? 1
            : participacao >= 0.6
              ? 0.85
              : participacao >= 0.4
                ? 0.65
                : participacao >= 0.2
                  ? 0.4
                  : 0.15;
        const campanhas = campanhasPorClube.get(jogador.clubeId) || [];
        const pontosColetivos = campanhas.reduce(
          (total, campanha) =>
            total +
            calcularPesoTituloBolaDeOuro(campanha.titulo, liga) *
              campanha.nivel *
              fatorParticipacaoCampanha,
          0,
        );
        const notaColetiva =
          pesoMaximoColetivoGlobal > 0
            ? Math.min(100, (pontosColetivos / pesoMaximoColetivoGlobal) * 100)
            : 0;
        const notaParticipacao = participacao * 100;
        const notaIndividual = desempenho.notaIndividual;
        const pontuacao =
          notaIndividual * 0.75 + notaColetiva * 0.15 + notaParticipacao * 0.1;
        const campanhasComResultado = campanhas
          .filter((campanha) => campanha.nivel > 0)
          .map((campanha) => {
            if (campanha.tipo === "liga") {
              return `${campanha.posicao}º lugar — ${campanha.titulo}`;
            }
            if (campanha.nivel === 1) return campanha.titulo;
            if (campanha.nivel === 0.75)
              return `Vice-campeão da ${campanha.titulo}`;
            if (campanha.nivel === 0.5)
              return `Semifinalista da ${campanha.titulo}`;
            if (campanha.nivel === 0.3)
              return `Quartas de final da ${campanha.titulo}`;
            return `Classificado para competição continental`;
          });
        return {
          ...jogador,
          clube,
          gols,
          assistencias,
          jogos: desempenho.jogos,
          jogosLiga: jogosParticipacao,
          jogosReferencia: dados.jogosReferencia,
          desarmes: desempenho.desarmes,
          defesas: desempenho.defesas,
          jogosSemSofrer: desempenho.jogosSemSofrer,
          golsPonderados: desempenho.golsPonderados,
          assistenciasPonderadas: desempenho.assistenciasPonderadas,
          golsPorJogo: desempenho.golsPorJogo,
          assistenciasPorJogo: desempenho.assistenciasPorJogo,
          golsPonderadosPorJogo: desempenho.golsPonderadosPorJogo,
          assistenciasPonderadasPorJogo:
            desempenho.assistenciasPonderadasPorJogo,
          desarmesPorJogo: desempenho.desarmesPorJogo,
          defesasPorJogo: desempenho.defesasPorJogo,
          jogosSemSofrerPorJogo: desempenho.jogosSemSofrerPorJogo,
          categoria: desempenho.categoria,
          pontuacaoDesempenho: notaIndividual,
          notaIndividual,
          notaColetiva,
          notaParticipacao,
          temContribuicaoIndividual: desempenho.temContribuicaoIndividual,
          campanhasColetivas: campanhasComResultado,
          pontuacao,
          titulosColetivos: campanhasComResultado,
          titulosIndividuais: jogador.ehUsuario
            ? (temporada.trofeusIndividuais || []).filter(
                (titulo) => titulo !== "Bola de Ouro",
              )
            : Array.isArray(jogador.titulosIndividuais)
              ? jogador.titulosIndividuais
              : [],
        };
      })
      .filter(
        (jogador) =>
          ["atacante", "meio-campista"].includes(jogador.categoria) &&
          jogador.jogosReferencia > 0 &&
          jogador.jogosLiga >= Math.ceil(jogador.jogosReferencia * 0.4) &&
          jogador.temContribuicaoIndividual,
      )
      .sort((a, b) => {
        const diferenca = b.pontuacao - a.pontuacao;
        if (Math.abs(diferenca) > 0.0001) return diferenca;
        if (a.notaIndividual !== b.notaIndividual)
          return b.notaIndividual - a.notaIndividual;
        const criterios =
          a.categoria === "meio-campista"
            ? [
                "assistenciasPonderadasPorJogo",
                "desarmesPorJogo",
                "golsPonderadosPorJogo",
              ]
            : ["golsPonderadosPorJogo", "assistenciasPonderadasPorJogo"];
        for (const criterio of criterios) {
          if (a[criterio] !== b[criterio]) return b[criterio] - a[criterio];
        }
        if (a.gols !== b.gols) return b.gols - a.gols;
        if (a.assistencias !== b.assistencias)
          return b.assistencias - a.assistencias;
        if (a.jogos !== b.jogos) return b.jogos - a.jogos;
        return String(a.nome || "").localeCompare(
          String(b.nome || ""),
          "pt-BR",
        );
      });

    const posicaoUsuario = avaliados.findIndex(
      (jogador) => String(jogador.id) === idUsuario,
    );
    temporada.trofeusIndividuais = (temporada.trofeusIndividuais || []).filter(
      (titulo) => titulo !== "Bola de Ouro",
    );
    const venceuNestaTemporada = usuarioElegivel && posicaoUsuario === 0;
    if (venceuNestaTemporada) temporada.trofeusIndividuais.push("Bola de Ouro");
    const vitoriasAnteriores = historicoCarreira.filter((item) =>
      (item.trofeusIndividuais || []).includes("Bola de Ouro"),
    ).length;
    const vitoriasAnterioresChuteira = historicoCarreira.filter((item) =>
      (item.trofeusIndividuais || []).includes("Chuteira de Ouro"),
    ).length;

    return {
      vencedor: avaliados[0] ? { nome: avaliados[0].nome || "Jogador" } : null,
      chuteira: rankingChuteira.slice(0, 10),
      chuteiraVencedor: rankingChuteira[0]
        ? { nome: rankingChuteira[0].nome }
        : null,
      chuteiraPosicaoUsuario: posicaoUsuarioChuteira,
      totalVitoriasChuteira:
        vitoriasAnterioresChuteira +
        ((temporada.trofeusIndividuais || []).includes("Chuteira de Ouro")
          ? 1
          : 0),
      jogadores: avaliados.slice(0, 10).map((jogador) => ({
        nome: jogador.nome || "Jogador",
        clube: jogador.clube?.nome || jogador.clubeId || "Clube não informado",
        pontuacao: jogador.pontuacao,
        pontuacaoDesempenho: jogador.pontuacaoDesempenho,
        notaIndividual: jogador.notaIndividual,
        golsPonderados: jogador.golsPonderados,
        assistenciasPonderadas: jogador.assistenciasPonderadas,
        notaColetiva: jogador.notaColetiva,
        notaParticipacao: jogador.notaParticipacao,
        ehUsuario: String(jogador.id) === idUsuario,
        gols: jogador.gols,
        assistencias: jogador.assistencias,
        jogos: jogador.jogos,
        jogosLiga: jogador.jogosLiga,
        jogosReferencia: jogador.jogosReferencia,
        desarmes: jogador.desarmes,
        defesas: jogador.defesas,
        jogosSemSofrer: jogador.jogosSemSofrer,
        posicao: jogador.posicao,
        categoria: jogador.categoria,
        campanhasColetivas: jogador.campanhasColetivas,
        titulosColetivos: jogador.titulosColetivos,
        titulosIndividuais: jogador.titulosIndividuais,
      })),
      posicaoUsuario: posicaoUsuario + 1,
      totalCandidatos: avaliados.length,
      venceuNestaTemporada,
      totalVitorias: vitoriasAnteriores + (venceuNestaTemporada ? 1 : 0),
    };
  }

  function localizarConfrontoLiga(partida, casaId, foraId) {
    return estado.rodadas?.[partida.rodadaLiga]?.find(
      (jogo) => jogo.casaId === casaId && jogo.foraId === foraId,
    );
  }

  function obterCompeticoesQualificadas(tabela, liga) {
    const ordenada = [...tabela].sort(
      (a, b) => b.pts - a.pts || b.gp - b.gc - (a.gp - a.gc) || b.gp - a.gp,
    );
    const posicao = ordenada.findIndex((t) => t.id === estado.clubeId);
    if (posicao < 0) return [];
    let qualificadas = [];
    if (
      [
        "Premier League",
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Ligue 1",
      ].includes(liga)
    ) {
      if (posicao < 4) qualificadas = ["Champions League"];
      else if (posicao < 8) qualificadas = ["Europa League"];
      else if (posicao < 12) qualificadas = ["Conference League"];
    } else if (
      [
        "Primeira Liga",
        "Eredivisie",
        "Süper Lig",
        "Belgian Pro League",
        "Scottish Premiership",
        "Swiss Super League",
        "Austrian Bundesliga",
        "Russian Premier League",
        "Ukrainian Premier League",
        "Greek Super League",
      ].includes(liga)
    ) {
      if (posicao < 2) qualificadas = ["Champions League"];
      else if (posicao < 4) qualificadas = ["Europa League"];
      else if (posicao < 6) qualificadas = ["Conference League"];
    } else if (
      liga === "Brasileirão" ||
      liga === "Argentine Primera División"
    ) {
      // 6 vagas CL + 6 vagas CS (32 total por competição)
      if (posicao < 6) qualificadas = ["Libertadores"];
      else if (posicao < 12) qualificadas = ["Copa Sul-Americana"];
    } else if (
      [
        "Colombian Primera A",
        "Chilean Primera División",
        "Uruguayan Primera División",
        "Ecuadorian Serie A",
        "Paraguayan Primera División",
      ].includes(liga)
    ) {
      if (posicao < 4) qualificadas = ["Libertadores"];
      else if (posicao < 8) qualificadas = ["Copa Sul-Americana"];
    } else if (["MLS", "Liga MX"].includes(liga)) {
      if (posicao < 4) qualificadas = ["CONCACAF Champions Cup"];
    } else if (
      [
        "Saudi Pro League",
        "J1 League",
        "K League 1",
        "Chinese Super League",
        "Australian A-League",
      ].includes(liga)
    ) {
      if (posicao < (liga === "Australian A-League" ? 2 : 3))
        qualificadas = ["AFC Champions League"];
      else if (posicao < 6) qualificadas = ["AFC Champions League 2"];
    } else if (
      [
        "Egyptian Premier League",
        "South African Premier Division",
        "Moroccan Botola",
      ].includes(liga)
    ) {
      if (posicao < 2) qualificadas = ["CAF Champions League"];
      else if (posicao < 5) qualificadas = ["CAF Confederation Cup"];
    }

    const trofeus = estado.trofeusClube || [];
    const nomes =
      typeof obterNomesTrofeusClube === "function"
        ? obterNomesTrofeusClube(estado.clubeId)
        : {};
    if (trofeus.includes(nomes.copa)) {
      const acessoCopa =
        liga === "Brasileirão" || liga === "Argentine Primera División"
          ? "Libertadores"
          : liga === "MLS" || liga === "Liga MX"
            ? "CONCACAF Champions Cup"
            : liga === "Premier League"
              ? "Conference League"
              : [
                    "Premier League",
                    "La Liga",
                    "Serie A",
                    "Bundesliga",
                    "Ligue 1",
                    "Primeira Liga",
                    "Eredivisie",
                    "Süper Lig",
                    "Belgian Pro League",
                    "Scottish Premiership",
                    "Swiss Super League",
                    "Austrian Bundesliga",
                    "Russian Premier League",
                    "Ukrainian Premier League",
                    "Greek Super League",
                  ].includes(liga)
                ? "Europa League"
                : liga === "Australian A-League"
                  ? "AFC Champions League 2"
                  : liga === "Egyptian Premier League" ||
                      liga === "South African Premier Division" ||
                      liga === "Moroccan Botola"
                    ? "CAF Confederation Cup"
                    : [
                          "Saudi Pro League",
                          "J1 League",
                          "K League 1",
                          "Chinese Super League",
                        ].includes(liga)
                      ? "AFC Champions League"
                      : "Copa Sul-Americana";
      const prioridade = (nome) =>
        [
          "Champions League",
          "Libertadores",
          "CONCACAF Champions Cup",
          "AFC Champions League",
          "CAF Champions League",
        ].includes(nome)
          ? 3
          : [
                "Europa League",
                "Copa Sul-Americana",
                "AFC Champions League 2",
                "CAF Confederation Cup",
              ].includes(nome)
            ? 2
            : nome === "Conference League"
              ? 1
              : 0;
      if (
        !qualificadas.includes(acessoCopa) &&
        !qualificadas.some((nome) => prioridade(nome) > prioridade(acessoCopa))
      ) {
        qualificadas = qualificadas.filter(
          (nome) => prioridade(nome) >= prioridade(acessoCopa),
        );
        qualificadas.push(acessoCopa);
      }
    }
    return qualificadas;
  }
  function processarEliminatoria(partida, golsCasa, golsFora) {
    if (
      partida.tipo !== "mata-mata" &&
      !(partida.tipo === "selecao" && partida.fase)
    )
      return "";
    let vencedorCasa = golsCasa > golsFora;

    if (golsCasa === golsFora) {
      // Empate no tempo normal: a decisão vem da disputa de pênaltis.
      partida.decidePenaltis = true;
      if (
        partida.penaltis &&
        typeof partida.penaltis.vencedorCasa === "boolean"
      ) {
        vencedorCasa = partida.penaltis.vencedorCasa;
      } else {
        // Fallback defensivo: só ocorre se um save antigo tiver empate sem penaltis.
        console.warn(
          "[FootMain] Empate em mata-mata sem dados de pênaltis; sorteio de segurança.",
        );
        vencedorCasa = Math.random() < 0.5;
      }
    }

    partida.vencedorCasa = vencedorCasa;
    if (partida.competicao === "Copinha") {
      return processarEliminatoriaCopinha(partida, golsCasa, golsFora);
    }
    const venceu = partida.casa === vencedorCasa;
    if (!venceu) {
      estado.partidas
        .filter(
          (p) =>
            p.torneioId === partida.torneioId &&
            p.fase > partida.fase &&
            p.status === "agendada",
        )
        .forEach((p) => {
          p.status = "cancelada";
        });
      return `${estado.nome} foi eliminado(a) de ${partida.competicao}.`;
    }
    if (partida.fase === partida.totalFases) {
      const lista =
        partida.tipo === "selecao"
          ? (estado.trofeusSelecao ||= [])
          : (estado.trofeusClube ||= []);
      if (!lista.includes(partida.competicao)) lista.push(partida.competicao);
      const nomesTrofeus =
        typeof obterNomesTrofeusClube === "function"
          ? obterNomesTrofeusClube(estado.clubeId)
          : {};
      if (
        partida.tipo === "mata-mata" &&
        partida.competicao === nomesTrofeus.continental
      ) {
        estado.partidas
          .filter(
            (p) =>
              p.status === "bloqueada" &&
              ["Intercontinental", "Copa do Mundo de Clubes"].includes(
                p.competicao,
              ),
          )
          .forEach((p) => {
            p.status = "agendada";
          });
      }
      return `Campeão: ${partida.competicao}.`;
    }
    return `Classificado para a próxima fase de ${partida.competicao}.`;
  }

  function exibirModalPenaltiInicial(lance) {
    return new Promise((resolve) => {
      const modal = $("jja-modal-penalti");
      const opcoesEl = $("jja-penalti-opcoes");
      const continuarBtn = $("jja-penalti-continuar");
      const feedbackEl = $("jja-penalti-feedback");
      if (!modal || !opcoesEl || !continuarBtn) {
        resolve(null);
        return;
      }

      $("jja-penalti-titulo").textContent = lance.titulo;
      $("jja-penalti-contexto").textContent = lance.contexto;
      feedbackEl.textContent = "";
      opcoesEl.innerHTML = lance.opcoes
        .map(
          (opcao, indice) =>
            `<button type="button" class="jja-decisao-opcao" data-penalti-opcao="${indice}">${escapar(opcao.texto)}</button>`,
        )
        .join("");
      opcoesEl.hidden = false;
      continuarBtn.hidden = true;
      modal.hidden = false;

      const aoEscolher = (evento) => {
        const btn = evento.target.closest("[data-penalti-opcao]");
        if (!btn) return;
        const opcao = lance.opcoes[Number(btn.dataset.penaltiOpcao)];
        if (!opcao) return;
        const resultado = calcularResultadoCobrancaJogador(opcao);
        feedbackEl.textContent = resultado.mensagem;
        opcoesEl.hidden = true;
        continuarBtn.hidden = false;
        continuarBtn.focus();
        // Pré-resolve para exibir a disputa sem esperar novo clique
        const concluir = () => {
          modal.hidden = true;
          opcoesEl.removeEventListener("click", aoEscolher);
          continuarBtn.removeEventListener("click", concluir);
          resolve(resultado);
        };
        continuarBtn.addEventListener("click", concluir, { once: true });
        // Mantém a escolha viva mesmo se o usuário pressionar Enter rapidamente
        modal._penaltiConcluir = concluir;
      };
      opcoesEl.addEventListener("click", aoEscolher);
    });
  }

  async function executarDisputaPenaltisInterativa(
    partida,
    meuTime,
    adversario,
    jogadorDisponivel,
  ) {
    const euSouCasa = !!partida.casa;
    const meuLado = euSouCasa ? "casa" : "fora";
    const adversarioLado = euSouCasa ? "fora" : "casa";
    const ehGoleiro = chavePosicaoCampo(estado.posicao) === "GOL";

    let primeiroGolJogador = null;
    if (jogadorDisponivel) {
      const lance = obterLancePenaltiInicial(ehGoleiro);
      const resultado = await exibirModalPenaltiInicial(lance);
      if (resultado) primeiroGolJogador = !!resultado.gol;
    }

    const resultado = simularDisputaPenaltis(partida, meuTime, adversario, {
      jogadorParticipa: jogadorDisponivel,
      primeiroGolJogador,
    });

    await animarDisputaPenaltis(resultado, meuTime, adversario, euSouCasa);

    return resultado;
  }

  function animarDisputaPenaltis(resultado, meuTime, adversario, euSouCasa) {
    return new Promise((resolve) => {
      const modal = $("penaltis-modal");
      const lista = $("penaltis-lista");
      const placarCasa = $("penaltis-placar-casa");
      const placarFora = $("penaltis-placar-fora");
      const finalEl = $("penaltis-final");
      if (!modal || !lista || !placarCasa || !placarFora || !finalEl) {
        resolve();
        return;
      }

      $("penaltis-time-casa").textContent = euSouCasa
        ? meuTime.nome
        : adversario.nome;
      $("penaltis-time-fora").textContent = euSouCasa
        ? adversario.nome
        : meuTime.nome;
      placarCasa.textContent = "0";
      placarFora.textContent = "0";
      lista.innerHTML = "";
      finalEl.hidden = true;
      finalEl.innerHTML = "";
      modal.hidden = false;

      let golsCasa = 0,
        golsFora = 0;
      let indice = 0;

      const proximaCobranca = () => {
        if (indice >= resultado.cobrancas.length) {
          const vencedorNome = resultado.vencedorCasa
            ? $("penaltis-time-casa").textContent
            : $("penaltis-time-fora").textContent;
          const perdedorNome = resultado.vencedorCasa
            ? $("penaltis-time-fora").textContent
            : $("penaltis-time-casa").textContent;
          finalEl.hidden = false;
          finalEl.innerHTML = `
                      <div class="penaltis-vencedor">🏆 ${escapar(vencedorNome)} venceu!</div>
                      <div class="penaltis-derrotado">${escapar(perdedorNome)} eliminado</div>
                      <div class="penaltis-final-placar">Placar dos pênaltis: ${resultado.golsCasa} × ${resultado.golsFora}</div>
                      <button type="button" class="penaltis-continuar" data-fechar-penaltis>Continuar</button>
                  `;
          finalEl
            .querySelector("[data-fechar-penaltis]")
            .addEventListener("click", () => {
              modal.hidden = true;
              resolve();
            });
          finalEl.querySelector("[data-fechar-penaltis]").focus();
          return;
        }
        const cobranca = resultado.cobrancas[indice];
        const ehCasa = cobranca.time === "casa";
        const nomeTime = ehCasa
          ? $("penaltis-time-casa").textContent
          : $("penaltis-time-fora").textContent;
        const div = document.createElement("div");
        div.className = `penaltis-cobranca ${cobranca.gol ? "gol" : "erro"}${cobranca.jogador ? " jogador" : ""}`;
        div.innerHTML = `
                  <span class="penaltis-icone" aria-hidden="true">${cobranca.gol ? "⚽" : "❌"}</span>
                  <span class="penaltis-time-nome"><strong>${escapar(nomeTime)}</strong>${cobranca.jogador ? " (você)" : ""}</span>
                  <span class="penaltis-resultado ${cobranca.gol ? "gol" : "erro"}">${cobranca.gol ? "GOL" : "ERROU"}</span>
              `;
        lista.appendChild(div);
        lista.scrollTop = lista.scrollHeight;
        if (cobranca.gol) {
          if (ehCasa) golsCasa++;
          else golsFora++;
          placarCasa.textContent = golsCasa;
          placarFora.textContent = golsFora;
          const alvo = ehCasa ? placarCasa : placarFora;
          alvo.classList.remove("penaltis-pulso");
          // força reflow para reiniciar a animação
          void alvo.offsetWidth;
          alvo.classList.add("penaltis-pulso");
        }
        indice++;
        setTimeout(proximaCobranca, 550);
      };

      setTimeout(proximaCobranca, 350);
    });
  }

  async function simularPartida(
    indice,
    mostrarResultado = true,
    interacao = null,
    opcoesPenaltis = null,
  ) {
    const partida = estado.partidas[indice];
    if (!partida || partida.status !== "agendada") return;
    const times = clubesDisponiveis();
    const pelaSelecao = partida.tipo === "selecao";
    const meuClube = pelaSelecao
      ? typeof SELECOES !== "undefined"
        ? SELECOES.find((s) => s.id === estado.nacionalidade)
        : null
      : times.find((c) => c.id === estado.clubeId);

    const adversario = partida.adversarioId
      ? pelaSelecao
        ? typeof SELECOES !== "undefined"
          ? SELECOES.find((s) => s.id === partida.adversarioId)
          : null
        : times.find((c) => c.id === partida.adversarioId) ||
          (typeof CLUBES_REGIONAIS !== "undefined"
            ? CLUBES_REGIONAIS.find((c) => c.id === partida.adversarioId)
            : null)
      : null;

    if (!meuClube || (!pelaSelecao && !adversario)) {
      informar("Não foi possível localizar uma equipe do calendário.", true);
      return;
    }
    const visitante = adversario || {
      id: `${meuClube.id}-adversario`,
      nome: partida.adversarioNome || "Seleção adversária",
    };
    const casa = partida.casa ? meuClube : visitante,
      fora = partida.casa ? visitante : meuClube;
    const vantagemCasa = partida.casa ? 0.22 : -0.22;
    const forcaBaseMinhaEquipe = pelaSelecao
      ? Number(getConfig()?.selecao?.potencias?.[meuClube.id]) || 60
      : forcaClube(meuClube);
    const posicaoDefensiva = ["GOL", "ZCE", "ZCD", "LE", "LD"].includes(
      String(estado.posicao).toUpperCase(),
    );
    const impactoBaseJogador = ((Number(estado.overall) || 65) - 70) * 0.3;
    const impactoJogador = Math.max(
      -5,
      Math.min(8, impactoBaseJogador * (posicaoDefensiva ? 1.35 : 1)),
    );
    const forcaMinhaEquipe = Math.max(
      35,
      Math.min(99, forcaBaseMinhaEquipe + impactoJogador),
    );
    const forcaAdversaria = adversario
      ? pelaSelecao
        ? Number(getConfig()?.selecao?.potencias?.[adversario.id]) || 60
        : forcaClube(adversario)
      : 60 + Math.random() * 20;
    const delta =
      (partida.casa
        ? forcaMinhaEquipe - forcaAdversaria
        : forcaAdversaria - forcaMinhaEquipe) /
        25 +
      vantagemCasa;
    let golsCasa = sortearPoisson(Math.max(0.25, 1.35 + delta * 0.55));
    let golsFora = sortearPoisson(Math.max(0.25, 1.15 - delta * 0.45));
    const disponibilidade = (estado.disponibilidade ||=
      disponibilidadeInicial());
    estado.eventos ||= [];
    const chaveEquipe = pelaSelecao ? "selecao" : "clube";
    let motivoAusencia = "";
    let jogosSuspensaoCartao = 0;
    let suspensaoPorAmarelos = false;
    let eventoLesaoAtual = null;
    if (disponibilidade.lesaoCarreira || disponibilidade.jogosLesao > 0) {
      motivoAusencia = disponibilidade.lesaoCarreira
        ? "fora por lesão gravíssima"
        : "fora por lesão";
      if (!disponibilidade.lesaoCarreira) disponibilidade.jogosLesao--;
    } else if (Number(disponibilidade.suspensoes[chaveEquipe]) > 0) {
      disponibilidade.suspensoes[chaveEquipe]--;
      motivoAusencia = "suspenso por cartão";
    }
    const statsJogador = motivoAusencia
      ? {
          participou: false,
          gols: 0,
          assistencias: 0,
          amarelo: 0,
          vermelho: 0,
          motm: false,
        }
      : sortearEstatisticasJogador(
          partida,
          meuClube,
          golsCasa,
          golsFora,
          interacao?.participou ?? null,
        );
    const participou = statsJogador.participou;
    const posicao =
      typeof chavePosicaoCampo === "function"
        ? chavePosicaoCampo(estado.posicao)
        : String(estado.posicao || "").toUpperCase();
    const ehGoleiro = posicao === "GOL";
    const ehDefensor = ["ZCE", "ZCD", "LE", "LD"].includes(posicao);
    const ehMeiaOuAtacante = ["ME", "MC", "MD", "PE", "CA", "PD"].includes(
      posicao,
    );
    const estatisticasComplementares = {
      driblesCompletos:
        participou && ehMeiaOuAtacante ? sortearPoisson(0.8) : 0,
      desarmes: participou && ehDefensor ? sortearPoisson(1.7) : 0,
      defesas: participou && ehGoleiro ? sortearPoisson(0.9) : 0,
      jogadasCriadas: participou
        ? sortearPoisson(ehGoleiro ? 0.15 : ehDefensor ? 0.25 : 0.45)
        : 0,
    };
    if (participou && interacao) {
      estatisticasComplementares.driblesCompletos += Math.max(
        0,
        Number(interacao.driblesCompletos) || 0,
      );
      estatisticasComplementares.desarmes += Math.max(
        0,
        Number(interacao.desarmes) || 0,
      );
      estatisticasComplementares.defesas += Math.max(
        0,
        Number(interacao.defesas) || 0,
      );
      estatisticasComplementares.jogadasCriadas += Math.max(
        0,
        Number(interacao.jogadasCriadas) || 0,
      );
    }
    let golsJogador = statsJogador.gols;
    let assistJogador = statsJogador.assistencias;
    const golsEquipeCriados = Math.max(0, interacao?.golsEquipeCriados || 0);
    const {
      amarelo,
      vermelho,
      vermelhoDireto = false,
      motm = false,
    } = statsJogador;
    if (participou && interacao) {
      golsJogador += interacao.gols || 0;
      assistJogador += interacao.assistencias || 0;
      const golsEvitados = Math.max(0, interacao.golsEvitados || 0);
      if (partida.casa) golsFora = Math.max(0, golsFora - golsEvitados);
      else golsCasa = Math.max(0, golsCasa - golsEvitados);
    }
    if (participou) {
      const golsNecessarios = golsJogador + assistJogador + golsEquipeCriados;
      if (partida.casa) golsCasa = Math.max(golsCasa, golsNecessarios);
      else golsFora = Math.max(golsFora, golsNecessarios);
    }

    // ---------- DISPUTA DE PÊNALTIS (se for mata-mata e empatar) ----------
    let penaltis = null;

    const ehMataMata =
      partida.tipo === "mata-mata" ||
      (partida.tipo === "selecao" && partida.fase);

    // DEV HOOK: força empate no próximo mata-mata para testar a disputa de pênaltis
    if (ehMataMata && window.__footmainDevForcarPenaltis) {
      window.__footmainDevForcarPenaltis = false;
      golsCasa = 1;
      golsFora = 1;
    }

    if (ehMataMata && golsCasa === golsFora) {
      const interativo = !!opcoesPenaltis?.interativo;
      const jogadorDisponivel = participou && !motivoAusencia;
      try {
        if (interativo) {
          penaltis = await executarDisputaPenaltisInterativa(
            partida,
            meuClube,
            visitante,
            jogadorDisponivel,
          );
        } else {
          penaltis = simularDisputaPenaltis(partida, meuClube, visitante, {
            jogadorParticipa: jogadorDisponivel,
            primeiroGolJogador: null,
          });
        }
        partida.penaltis = penaltis;
      } catch (erro) {
        console.error(
          "[FootMain] Falha na disputa de pênaltis; usando fallback:",
          erro,
        );
        partida.penaltis = null;
      }
    }

    if (!pelaSelecao && partida.tipo === "liga")
      registrarResultado(casa, fora, golsCasa, golsFora);
    if (!pelaSelecao && partida.tipo === "liga") {
      const partidaLigaId = `${estado.ano}:${partida.rodadaLiga}:${casa.id}:${fora.id}`;
      const eventosIndividuais = gerarEventosIndividuaisLiga(
        partidaLigaId,
        casa.id,
        fora.id,
        golsCasa,
        golsFora,
        {
          jogadorParticipou: participou && !motivoAusencia,
          golsJogador,
          assistenciasJogador: assistJogador,
          partida,
        },
      );
      partida.eventosIndividuais = eventosIndividuais;
      const confrontoLiga = localizarConfrontoLiga(partida, casa.id, fora.id);
      if (confrontoLiga) {
        confrontoLiga.status = "concluido";
        confrontoLiga.golsCasa = golsCasa;
        confrontoLiga.golsFora = golsFora;
        confrontoLiga.eventosIndividuais = eventosIndividuais;
        confrontoLiga.jogadoresParticipantes =
          partida.jogadoresParticipantes || [];
      }
      golsJogador = eventosIndividuais.filter(
        (evento) => evento.autorId === estado.carreiraId,
      ).length;
      assistJogador = eventosIndividuais.filter(
        (evento) => evento.assistenteId === estado.carreiraId,
      ).length;
    } else {
      const clubeCasaId = partida.casa
        ? pelaSelecao
          ? estado.nacionalidade
          : estado.clubeId
        : partida.adversarioId;
      const clubeForaId = partida.casa
        ? partida.adversarioId
        : pelaSelecao
          ? estado.nacionalidade
          : estado.clubeId;
      partida.casaId = clubeCasaId;
      partida.foraId = clubeForaId;
      const eventosIndividuais = gerarEventosIndividuaisLiga(
        `${estado.ano}:${partida.torneioId || partida.competicao}:${partida.numero}:${clubeCasaId}:${clubeForaId}`,
        clubeCasaId,
        clubeForaId,
        golsCasa,
        golsFora,
        {
          jogadorId: estado.carreiraId,
          clubeJogadorId: pelaSelecao ? estado.nacionalidade : estado.clubeId,
          nomeJogador: estado.nome,
          jogadorParticipou: participou && !motivoAusencia,
          golsJogador,
          assistenciasJogador: assistJogador,
          partida,
        },
      );
      partida.eventosIndividuais = eventosIndividuais;
      golsJogador = eventosIndividuais.filter(
        (evento) => evento.autorId === estado.carreiraId,
      ).length;
      assistJogador = eventosIndividuais.filter(
        (evento) => evento.assistenteId === estado.carreiraId,
      ).length;
    }
    if (participou) {
      const prefixo = pelaSelecao ? "Selecao" : "Clube";
      estado.estatisticas[`jogos${prefixo}`] =
        (estado.estatisticas[`jogos${prefixo}`] || 0) + 1;
      estado.estatisticas[`gols${prefixo}`] =
        (estado.estatisticas[`gols${prefixo}`] || 0) + golsJogador;
      estado.estatisticas[`assistencias${prefixo}`] =
        (estado.estatisticas[`assistencias${prefixo}`] || 0) + assistJogador;
      if (pelaSelecao) {
        const competicao = partida.competicao;
        const jogosPorCompeticao =
          estado.estatisticas.jogosSelecaoPorCompeticao;
        const golsPorCompeticao = estado.estatisticas.golsSelecaoPorCompeticao;
        jogosPorCompeticao[competicao] =
          (jogosPorCompeticao[competicao] || 0) + 1;
        golsPorCompeticao[competicao] =
          (golsPorCompeticao[competicao] || 0) + golsJogador;
      }
      estado.estatisticas.jogos++;
      estado.estatisticas.gols += golsJogador;
      estado.estatisticas.assistencias += assistJogador;
      estado.estatisticas.driblesCompletos +=
        estatisticasComplementares.driblesCompletos;
      estado.estatisticas.desarmes += estatisticasComplementares.desarmes;
      estado.estatisticas.defesas += estatisticasComplementares.defesas;
      estado.estatisticas.jogadasCriadas +=
        estatisticasComplementares.jogadasCriadas;
      estado.estatisticas.amarelos += amarelo;
      estado.estatisticas.vermelhos += vermelho;
      if (motm) estado.estatisticas.motm = (estado.estatisticas.motm || 0) + 1;
      if (vermelho) {
        const jogosSuspensao = vermelhoDireto
          ? 1 + Math.floor(Math.random() * 2)
          : 1;
        disponibilidade.suspensoes[chaveEquipe] = Math.max(
          Number(disponibilidade.suspensoes[chaveEquipe]) || 0,
          jogosSuspensao,
        );
        disponibilidade.amarelos[chaveEquipe] = 0;
        estado.eventos.push({
          tipo: "cartao-vermelho",
          jogo: estado.estatisticas.jogos,
          jogosPerdidos: jogosSuspensao,
        });
        jogosSuspensaoCartao = jogosSuspensao;
      }
      if (amarelo && !vermelho) {
        const cfgCartoes = getConfig()?.cartoes || {};
        const limiteAmarelos = Math.max(
          1,
          Math.floor(Number(cfgCartoes.limiteAmarelosSuspensao) || 5),
        );
        disponibilidade.amarelos[chaveEquipe] =
          (Number(disponibilidade.amarelos[chaveEquipe]) || 0) + amarelo;
        if (disponibilidade.amarelos[chaveEquipe] >= limiteAmarelos) {
          disponibilidade.suspensoes[chaveEquipe] = Math.max(
            Number(disponibilidade.suspensoes[chaveEquipe]) || 0,
            1,
          );
          disponibilidade.amarelos[chaveEquipe] = 0;
          estado.eventos.push({
            tipo: "suspensao-amarelos",
            jogo: estado.estatisticas.jogos,
            jogosPerdidos: 1,
          });
          jogosSuspensaoCartao = 1;
          suspensaoPorAmarelos = true;
        }
      }
    }
    if (participou) {
      const desempenho = (estado.desempenhoPosicional ||=
        desempenhoPosicionalInicial());
      const golsMeuTime = partida.casa ? golsCasa : golsFora;
      const golsAdversario = partida.casa ? golsFora : golsCasa;
      desempenho.jogos++;
      desempenho.gols += golsJogador;
      desempenho.assistencias += assistJogador;
      if (golsMeuTime > golsAdversario) desempenho.vitorias++;
      if (golsAdversario === 0) desempenho.jogosSemSofrer++;
    }
    if (partida.tipo === "liga") {
      if (
        (partida.casa && golsCasa > golsFora) ||
        (!partida.casa && golsFora > golsCasa)
      )
        estado.estatisticas.vitorias++;
      else if (golsCasa === golsFora) estado.estatisticas.empates++;
      else estado.estatisticas.derrotas++;
    }
    invalidarCachesDerivados();
    partida.status = "concluida";
    partida.golsCasa = golsCasa;
    partida.golsFora = golsFora;
    partida.participou = participou;
    partida.motivoAusencia = motivoAusencia;
    partida.golsJogador = golsJogador;
    partida.assistenciasJogador = assistJogador;
    partida.amarelo = amarelo;
    partida.vermelho = vermelho;
    partida.motmJogador = !!motm;
    partida.driblesCompletos = participou
      ? estatisticasComplementares.driblesCompletos
      : 0;
    partida.desarmes = participou ? estatisticasComplementares.desarmes : 0;
    partida.defesas = participou ? estatisticasComplementares.defesas : 0;
    partida.jogadasCriadas = participou
      ? estatisticasComplementares.jogadasCriadas
      : 0;
    if (typeof concluirColetivaImprensa === "function") {
      concluirColetivaImprensa(partida, estado);
    }
    partida.casaNome = casa.nome;
    partida.foraNome = fora.nome;

    estado.rodada++;

    let resumoTorneio = "";
    // Simula as partidas dos outros clubes do grupo
    if (partida.tipo === "grupo" || partida.faseGrupo) {
      const jogosIA = estado.partidas.filter(
        (p) =>
          p.torneioId === partida.torneioId &&
          (partida.faseGrupo
            ? p.tipo === "selecao-grupo-ia"
            : p.tipo === "grupo-ia") &&
          p.rodadaGrupo === partida.rodadaGrupo &&
          p.status === "agendada",
      );
      jogosIA.forEach((jogoIA) => {
        if (jogoIA.tipo === "selecao-grupo-ia") {
          simularPartidaGrupoSelecaoIA(jogoIA);
          return;
        }
        const timeCasa = obterClube(jogoIA.casaId);
        const timeFora = obterClube(jogoIA.foraId);
        if (timeCasa && timeFora) {
          const delta = (forcaClube(timeCasa) - forcaClube(timeFora)) / 25;
          jogoIA.golsCasa = sortearPoisson(Math.max(0.25, 1.35 + delta * 0.55));
          jogoIA.golsFora = sortearPoisson(Math.max(0.25, 1.15 - delta * 0.45));
          invalidarCachesDerivados();
          jogoIA.status = "concluida";
          jogoIA.eventosIndividuais = gerarEventosIndividuaisLiga(
            `${estado.ano}:${jogoIA.torneioId}:${jogoIA.rodadaGrupo}:${jogoIA.casaId}:${jogoIA.foraId}`,
            jogoIA.casaId,
            jogoIA.foraId,
            jogoIA.golsCasa,
            jogoIA.golsFora,
            { partida: jogoIA },
          );
        }
      });
      resumoTorneio = partida.faseGrupo
        ? verificarClassificacaoGrupoSelecao(partida)
        : partida.competicao === "Copinha"
          ? verificarClassificacaoCopinha(partida)
          : verificarClassificacaoContinental(partida);
    } else {
      resumoTorneio = processarEliminatoria(partida, golsCasa, golsFora);
      // ─── NOVO: conquista de troféu em mata-mata ───
      if (resumoTorneio.startsWith("Campeão:")) {
        enfileirarTrofeu(
          partida.competicao,
          partida.tipo === "selecao" ? "selecao" : "clube",
        );
      }
    }

    let resumo = `${casa.nome} ${golsCasa} × ${golsFora} ${fora.nome}`;

    if (partida.penaltis) {
      resumo += ` (pênaltis ${partida.penaltis.golsCasa} × ${partida.penaltis.golsFora})`;
    }
    const hatTrick = golsJogador >= 3;
    let detalheLesao = "";
    if (participou) {
      const cfgLesoes = getConfig()?.lesoes || {};
      const fatorIdade =
        estado.idade >= 33
          ? Number(cfgLesoes.fatorIdoso ?? 1.8)
          : estado.idade >= 29
            ? Number(cfgLesoes.fatorVeterano ?? 1.3)
            : estado.idade <= 24
              ? Number(cfgLesoes.fatorJovem ?? 0.8)
              : 1;
      const escalaLesao =
        Math.max(0, Number(cfgLesoes.multiplicador ?? 1)) *
        Math.max(0, fatorIdade);
      const chanceCarreira =
        Math.max(0, Number(cfgLesoes.chanceCarreira ?? 0.00003)) * escalaLesao;
      const chanceGrave =
        Math.max(0, Number(cfgLesoes.chanceGrave ?? 0.0003)) * escalaLesao;
      const chanceModerada =
        Math.max(0, Number(cfgLesoes.chanceModerada ?? 0.0015)) * escalaLesao;
      const chanceLeve =
        Math.max(0, Number(cfgLesoes.chanceLeve ?? 0.012)) * escalaLesao;
      const sorteioLesao = Math.random();
      let tipoLesao = "";
      let jogosLesao = 0;
      if (sorteioLesao < chanceCarreira) {
        tipoLesao = "lesao-carreira";
        disponibilidade.lesaoCarreira = true;
        jogosLesao = estado.partidas.filter(
          (p) => p.status === "agendada",
        ).length;
      } else if (sorteioLesao < chanceCarreira + chanceGrave) {
        tipoLesao = "lesao-grave";
        jogosLesao =
          estado.partidas.filter((p) => p.status === "agendada").length +
          Math.floor(Math.random() * 25);
      } else if (sorteioLesao < chanceCarreira + chanceGrave + chanceModerada) {
        tipoLesao = "lesao-moderada";
        jogosLesao = 8 + Math.floor(Math.random() * 13);
      } else if (
        sorteioLesao <
        chanceCarreira + chanceGrave + chanceModerada + chanceLeve
      ) {
        tipoLesao = "lesao";
        jogosLesao = 1 + Math.floor(Math.random() * 6);
      }
      if (tipoLesao) {
        disponibilidade.jogosLesao = Math.max(
          disponibilidade.jogosLesao,
          jogosLesao,
        );
        estado.eventos.push({
          tipo: tipoLesao,
          jogo: estado.estatisticas.jogos,
          jogosPerdidos: jogosLesao,
        });
        eventoLesaoAtual = { tipo: tipoLesao, jogosPerdidos: jogosLesao };
        detalheLesao = disponibilidade.lesaoCarreira
          ? " Lesão gravíssima: encerra a carreira."
          : ` Lesão: ficará fora das próximas ${jogosLesao} partidas do calendário.`;
      }
    }
    const penaltisTexto = partida.penaltis
      ? ` Decisão por pênaltis: ${partida.penaltis.golsCasa} × ${partida.penaltis.golsFora}.`
      : "";
    const detalhes = participou
      ? `${estado.nome}: ${golsJogador} gol(s)${hatTrick ? " — HAT-TRICK!" : ""}, ${assistJogador} assistência(s)${motm ? ", MOTM (melhor em campo)" : ""}${amarelo ? ", cartão amarelo" : ""}${vermelho ? ", cartão vermelho" : ""}.${jogosSuspensaoCartao ? ` Suspenso por ${jogosSuspensaoCartao} próxima(s) partida(s)${suspensaoPorAmarelos ? " por acúmulo de amarelos" : ""}.` : ""}${detalheLesao}${penaltisTexto}${resumoTorneio ? ` ${resumoTorneio}` : ""}`
      : `${estado.nome} não entrou em campo${motivoAusencia ? ` (${motivoAusencia})` : ""}.${penaltisTexto}${resumoTorneio ? ` ${resumoTorneio}` : ""}`;
    estado.ultima = {
      resumo,
      detalhes,
      competicao: partida.competicao,
      rodada: partida.numero,
      participou,
      golsJogador,
      assistJogador,
      driblesCompletos: partida.driblesCompletos,
      desarmes: partida.desarmes,
      defesas: partida.defesas,
      jogadasCriadas: partida.jogadasCriadas,
      motm: !!motm,
      hatTrick,
      amarelo,
      vermelho,
      penaltis: partida.penaltis || null,
      coletiva: partida.coletivaPendente
        ? {
            categoria: partida.coletivaPendente.categoria,
            resposta: partida.coletivaPendente.resposta,
            impacto: Number(partida.coletivaResultado) || 0,
          }
        : null,
    };
    estado.eventos = estado.eventos || [];
    if (hatTrick)
      estado.eventos.push({
        tipo: "hat-trick",
        jogo: estado.estatisticas.jogos,
      });
    if (amarelo)
      estado.eventos.push({
        tipo: "cartao-amarelo",
        jogo: estado.estatisticas.jogos,
      });
    estado.feed.unshift({
      titulo: `${partida.competicao} · ${resumo}`,
      texto: detalhes,
    });
    if (partida.coletivaPendente) {
      const impacto = Number(partida.coletivaResultado) || 0;
      estado.feed.unshift({
        titulo: "Coletiva de imprensa",
        texto: `${partida.coletivaPendente.resposta} · ${impacto > 0 ? "+" : ""}${impacto} pontos de reputação`,
      });
    }
    estado.feed = estado.feed.slice(0, 12);
    if (partida.tipo === "liga") simularOutrosJogosDaRodada(partida.rodadaLiga);
    if (!opcoesPenaltis?.simulacaoEmLote) obterRankingOutrasLigas();

    // ─── NOVO: enfileirar eventos para modal (só quando o jogador está acompanhando) ───
    if (mostrarResultado) {
      if (hatTrick) {
        enfileirarEvento(
          "hat-trick",
          `Você marcou ${golsJogador} gols em uma única partida! Que atuação!`,
          "🎩",
        );
      }
      if (vermelho) {
        enfileirarEvento(
          "cartao-vermelho",
          `Você foi expulso${jogosSuspensaoCartao ? ` e ficará suspenso por ${jogosSuspensaoCartao} jogo(s)` : ""}.`,
          "🟥",
        );
      } else if (amarelo) {
        const cfgCartoes = getConfig()?.cartoes || {};
        const limiteA = Math.max(
          1,
          Math.floor(Number(cfgCartoes.limiteAmarelosSuspensao) || 5),
        );
        const acumulados = Number(disponibilidade.amarelos[chaveEquipe]) || 0;
        enfileirarEvento(
          "cartao-amarelo",
          `Cartão amarelo${amarelo > 1 ? " (dois amarelos no jogo)" : ""}${suspensaoPorAmarelos ? " — suspenso por acúmulo" : ` — ${acumulados}/${limiteA} acumulados`}.`,
          "🟨",
        );
      }
      if (suspensaoPorAmarelos && !vermelho) {
        enfileirarEvento(
          "suspensao-amarelos",
          "Você acumulou cartões amarelos e ficará suspenso pela próxima partida.",
          "🟨",
        );
      }
      if (eventoLesaoAtual) {
        const msgs = {
          lesao: `Lesão leve: você ficará de fora por ${eventoLesaoAtual.jogosPerdidos} jogo(s).`,
          "lesao-moderada": `Lesão moderada: você ficará de fora por ${eventoLesaoAtual.jogosPerdidos} jogo(s).`,
          "lesao-grave": `Lesão grave: você ficará de fora por ${eventoLesaoAtual.jogosPerdidos} jogo(s).`,
          "lesao-carreira": "Lesão gravíssima: sua carreira foi encerrada.",
        };
        enfileirarEvento(
          eventoLesaoAtual.tipo,
          msgs[eventoLesaoAtual.tipo] || "Você sofreu uma lesão.",
          "🩹",
        );
      }
    }
    if (mostrarResultado && !opcoesPenaltis?.simulacaoEmLote)
      filaModaisPartida.push({ tipo: "ultima-partida" });

    if (!opcoesPenaltis?.simulacaoEmLote) {
      salvar();
      renderizar();
    }

    // NOVO: se acabaram os seus jogos, mas a IA tem jogos pendentes, simula a IA na hora
    const temJogoMeu = estado.partidas.some(
      (p) => p.status === "agendada" && !ehPartidaDeIA(p),
    );
    if (!temJogoMeu && !estado.salvaOficialmente) {
      const jogosIARestantes = estado.partidas.filter(
        (p) => p.status === "agendada" && ehPartidaDeIA(p),
      );
      jogosIARestantes.forEach((jogoIA) => {
        if (jogoIA.tipo === "selecao-grupo-ia") {
          simularPartidaGrupoSelecaoIA(jogoIA);
          return;
        }
        const timeCasa = obterClube(jogoIA.casaId);
        const timeFora = obterClube(jogoIA.foraId);
        if (timeCasa && timeFora) {
          const delta = (forcaClube(timeCasa) - forcaClube(timeFora)) / 25;
          jogoIA.golsCasa = sortearPoisson(Math.max(0.25, 1.35 + delta * 0.55));
          jogoIA.golsFora = sortearPoisson(Math.max(0.25, 1.15 - delta * 0.45));
          invalidarCachesDerivados();
          jogoIA.status = "concluida";
          jogoIA.eventosIndividuais = gerarEventosIndividuaisLiga(
            `${estado.ano}:${jogoIA.torneioId}:${jogoIA.rodadaGrupo}:${jogoIA.casaId}:${jogoIA.foraId}`,
            jogoIA.casaId,
            jogoIA.foraId,
            jogoIA.golsCasa,
            jogoIA.golsFora,
            { partida: jogoIA },
          );
        }
      });
      await finalizarTemporadaOficial();
    } else if (mostrarResultado) {
      const totalValidas =
        estado.rodada +
        estado.partidas.filter(
          (p) => p.status === "agendada" && !ehPartidaDeIA(p),
        ).length;
      informar(
        `Partida ${estado.rodada}/${totalValidas} concluída. ${detalhes}`,
      );
    }

    // ─── NOVO: processar fila de modais (troféus e eventos) ───
    if (
      mostrarResultado &&
      !opcoesPenaltis?.adiarModais &&
      filaModaisPartida.length > 0
    ) {
      await processarFilaModais();
    }
  }

  function simularOutrosJogosDaRodada(indiceRodada) {
    const finalizarMedicao = window.FootMainPerformance?.start(
      "simulacao_outros_jogos_da_rodada",
    );
    const confrontos = estado.rodadas?.[indiceRodada] || [];
    const times = clubesDisponiveis();
    confrontos.forEach((j) => {
      if (
        j.status === "concluido" ||
        j.casaId === estado.clubeId ||
        j.foraId === estado.clubeId
      )
        return;
      const casa = times.find((t) => t.id === j.casaId),
        fora = times.find((t) => t.id === j.foraId);
      if (!casa || !fora) return;
      const delta = (forcaClube(casa) - forcaClube(fora)) / 25;
      const gc = sortearPoisson(Math.max(0.25, 1.3 + delta * 0.48));
      const gf = sortearPoisson(Math.max(0.25, 1.2 - delta * 0.42));
      const partidaId = `${estado.ano}:${indiceRodada}:${casa.id}:${fora.id}`;
      j.eventosIndividuais = gerarEventosIndividuaisLiga(
        partidaId,
        casa.id,
        fora.id,
        gc,
        gf,
        { partida: j },
      );
      registrarResultado(casa, fora, gc, gf);
      j.status = "concluido";
      j.golsCasa = gc;
      j.golsFora = gf;
    });
    confrontos.forEach((j) => {
      if (j.casaId === estado.clubeId || j.foraId === estado.clubeId)
        j.status = "concluido";
    });
    finalizarMedicao?.();
  }
  function criarLancesDaPartida() {
    const posicao =
      typeof chavePosicaoCampo === "function"
        ? chavePosicaoCampo(estado.posicao)
        : String(estado.posicao || "CA").toUpperCase();
    const normalizarOpcao = (opcao, tipo, atributo) => {
      if (opcao && typeof opcao === "object" && !Array.isArray(opcao)) {
        return { ...opcao, tipo, atributo };
      }
      const [texto, chance, direcao] = Array.isArray(opcao)
        ? opcao
        : [opcao, 0, undefined];
      return {
        texto,
        chance,
        tipo,
        atributo,
        ...(direcao !== undefined ? { direcao } : {}),
      };
    };
    const criarLance = (titulo, contexto, tipo, atributo, opcoes) => ({
      titulo,
      contexto,
      opcoes: opcoes.map((opcao) => normalizarOpcao(opcao, tipo, atributo)),
    });
    const finalizacao = criarLance(
      "Chance de gol",
      "Você recebe a bola perto da área. Como finaliza?",
      "finalizacao",
      "finalizacao",
      [
        ["Chutar colocado no canto", 0.58],
        ["Bater forte no meio do gol", 0.49],
        ["Tentar uma cavadinha", 0.4],
      ],
    );
    const passe = criarLance(
      "Passe decisivo",
      "Um companheiro dispara em direção à área. Qual passe você tenta?",
      "passe",
      "passe",
      [
        ["Enfiada entre os zagueiros", 0.57],
        ["Cruzamento na área", 0.51],
        ["Tabelar e avançar", 0.65],
      ],
    );
    const drible = criarLance(
      "Um contra um",
      "Um marcador fecha seu caminho. Como você tenta superá-lo?",
      "drible",
      "drible",
      [
        ["Cortar para dentro", 0.57],
        ["Tentar uma pedalada", 0.45],
        ["Proteger a bola e tocar", 0.72],
      ],
    );
    const opcoesAtaque = (titulo, contexto, atributo = "finalizacao") =>
      criarLance(titulo, contexto, "finalizacao", atributo, [
        ["Finalizar rápido", 0.59],
        ["Dominar e bater colocado", 0.55],
        ["Tentar o chute de primeira", 0.43],
      ]);
    const opcoesPasse = (titulo, contexto, opcoes) =>
      criarLance(titulo, contexto, "passe", "passe", opcoes);
    const opcoesDefesa = (titulo, contexto, atributo, opcoes) =>
      criarLance(titulo, contexto, "defesa", atributo, opcoes);
    const opcoesDesarme = (titulo, contexto, atributo, opcoes) => {
      const lance = opcoesDefesa(titulo, contexto, atributo, opcoes);
      return {
        ...lance,
        opcoes: lance.opcoes.map((opcao) => ({
          ...opcao,
          contaComoDesarme: true,
        })),
      };
    };
    const opcoesDrible = (titulo, contexto, opcoes) =>
      criarLance(titulo, contexto, "drible", "drible", opcoes);
    const penaltiComum = (titulo, contexto, lado = "meio") => {
      // Se o lado sorteado for "meio", usa esquerda/direita para manter 3 opções distintas
      const ladoChute =
        lado === "meio" ? (Math.random() < 0.5 ? "esquerda" : "direita") : lado;
      const ladoOposto = ladoChute === "esquerda" ? "direita" : "esquerda";
      return criarLance(titulo, contexto, "penalti", "finalizacao", [
        [`Chutar para a ${ladoChute}`, 0.72, ladoChute],
        ["Mandar no centro do gol", 0.68, "meio"],
        [`Tentar um chute rasteiro para a ${ladoOposto}`, 0.62, ladoOposto],
      ]);
    };
    const penaltiGoleiro = (titulo, contexto) =>
      criarLance(titulo, contexto, "penalti-defesa", "reflexos", [
        ["Defender para a esquerda", 0.66, "esquerda"],
        ["Defender para a direita", 0.66, "direita"],
        ["Esperar o chute e fechar o ângulo", 0.62, "centro"],
      ]);
    const posicoes = {
      GOL: [
        opcoesDefesa(
          "Cara a cara",
          "O atacante invade a área. Como você tenta defender?",
          "reflexos",
          [
            ["Fechar o ângulo", 0.76],
            ["Esperar o chute e reagir", 0.72],
            ["Sair nos pés do atacante", 0.62],
          ],
        ),
        opcoesDefesa(
          "Bola cruzada",
          "Um cruzamento fechado atravessa a pequena área. Qual decisão toma?",
          "reflexos",
          [
            ["Sair para encaixar", 0.7],
            ["Espalmar para longe", 0.77],
            ["Proteger o primeiro poste", 0.73],
          ],
        ),
        opcoesDesarme(
          "Saída da área",
          "Um atacante dispara nas costas da defesa e a bola fica fora da área. Como você intervém?",
          "velocidade",
          [
            ["Chegar primeiro e afastar para longe", 0.68],
            ["Antecipar o domínio e tocar para um lado", 0.64],
            ["Deslizar para cortar a bola com segurança", 0.56],
          ],
        ),
        opcoesDesarme(
          "Cobertura como último homem",
          "Um passe longo supera a defesa e você precisa agir longe do gol.",
          "defesa",
          [
            ["Afastar de primeira para a lateral", 0.72],
            ["Dominar e iniciar a saída", 0.62],
            ["Antecipar a disputa antes do atacante", 0.58],
          ],
        ),
        penaltiGoleiro(
          "Pênalti defendido",
          "O árbitro marca pênalti. Você precisa escolher o lado e a forma de defender.",
        ),
        criarLance(
          "Reposição do goleiro",
          "Após a defesa, você inicia a jogada. Como repõe a bola?",
          "reposicao",
          "passe",
          [
            ["Passe curto para o zagueiro", 0.77],
            ["Lançamento no contra-ataque", 0.51],
            ["Reposição rápida no espaço", 0.61],
          ],
        ),
      ],
      ZCE: [
        opcoesDefesa(
          "Cobertura central",
          "Um atacante tenta passar entre você e o outro zagueiro. Como fecha o espaço?",
          "defesa",
          [
            ["Antecipar a enfiada", 0.65],
            ["Acompanhar e bloquear o chute", 0.7],
            ["Dar o bote para desarmar", 0.55],
          ],
        ),
        opcoesDefesa(
          "Bola aérea",
          "A bola vem alta na área. Como disputa a jogada?",
          "fisico",
          [
            ["Subir para afastar de cabeça", 0.71],
            ["Ganhar posição e proteger", 0.74],
            ["Tentar dominar para sair jogando", 0.55],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "esquerda",
        ),
        opcoesPasse(
          "Construção por dentro",
          "Seu time recupera a bola no campo defensivo. Qual saída escolhe?",
          [
            ["Passe vertical entre as linhas", 0.56],
            ["Inversão para o lado oposto", 0.64],
            ["Passe curto para manter a posse", 0.76],
          ],
        ),
      ],
      ZCD: [
        opcoesDefesa(
          "Proteção do lado direito",
          "O ponta adversário avança pela sua faixa. Como marca?",
          "defesa",
          [
            ["Conduzir o atacante para a lateral", 0.74],
            ["Desarmar no momento certo", 0.56],
            ["Bloquear o cruzamento", 0.69],
          ],
        ),
        opcoesDefesa(
          "Disputa pelo alto",
          "Um cruzamento busca o centroavante. Qual ação escolhe?",
          "fisico",
          [
            ["Atacar a bola de cabeça", 0.7],
            ["Fazer a cobertura do companheiro", 0.75],
            ["Afastar de primeira", 0.66],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "direita",
        ),
        opcoesPasse(
          "Saída pelo lado direito",
          "Você recupera a bola e encontra espaço à frente.",
          [
            ["Passe para o lateral avançar", 0.72],
            ["Lançamento para o ponta", 0.54],
            ["Passe vertical no meio", 0.59],
          ],
        ),
      ],
      LE: [
        opcoesDefesa(
          "Duelo na lateral esquerda",
          "O ponta tenta avançar pela sua faixa. Como reage?",
          "defesa",
          [
            ["Fechar o corredor e esperar apoio", 0.75],
            ["Tentar o desarme", 0.58],
            ["Bloquear o cruzamento", 0.68],
          ],
        ),
        opcoesPasse(
          "Apoio pela esquerda",
          "Você encontra espaço para apoiar o ataque. O que faz?",
          [
            ["Cruzar na área", 0.55],
            ["Tocar por baixo para trás", 0.69],
            ["Conduzir até a linha de fundo", 0.59],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "esquerda",
        ),
        opcoesDefesa(
          "Cobertura do zagueiro",
          "Um atacante aparece nas suas costas.",
          "velocidade",
          [
            ["Voltar em velocidade", 0.67],
            ["Fechar a linha de passe", 0.73],
            ["Fazer o corte antes do domínio", 0.61],
          ],
        ),
      ],
      LD: [
        opcoesDefesa(
          "Duelo na lateral direita",
          "O ponta adversário tenta ganhar a linha de fundo. Como defende?",
          "defesa",
          [
            ["Fechar o corredor", 0.75],
            ["Dar o bote por dentro", 0.56],
            ["Bloquear o cruzamento", 0.68],
          ],
        ),
        opcoesPasse(
          "Apoio pela direita",
          "Você passa pelo marcador e chega perto da área.",
          [
            ["Cruzar no segundo poste", 0.56],
            ["Tocar rasteiro para trás", 0.7],
            ["Buscar a tabela e invadir a área", 0.61],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "direita",
        ),
        opcoesDefesa(
          "Recuperação defensiva",
          "Um contra-ataque ameaça o seu lado.",
          "velocidade",
          [
            ["Acompanhar o atacante", 0.68],
            ["Cortar a linha de passe", 0.72],
            ["Pressionar junto ao companheiro", 0.64],
          ],
        ),
      ],
      ME: [
        opcoesPasse(
          "Criação pelo lado esquerdo",
          "Você recebe entre o meio e a ponta. Como cria perigo?",
          [
            ["Enfiada para o atacante", 0.6],
            ["Cruzamento antecipado", 0.55],
            ["Inverter para o lado oposto", 0.68],
          ],
        ),
        opcoesDrible(
          "Progressão pela esquerda",
          "Há espaço para avançar com a bola.",
          [
            ["Cortar para o meio e finalizar", 0.55],
            ["Driblar pela linha lateral", 0.61],
            ["Proteger e esperar a ultrapassagem", 0.75],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "esquerda",
        ),
        opcoesDefesa(
          "Pressão no meio-campo",
          "O adversário tenta sair jogando pela sua faixa.",
          "defesa",
          [
            ["Pressionar para forçar o erro", 0.61],
            ["Fechar o passe por dentro", 0.72],
            ["Tentar interceptar a bola", 0.64],
          ],
        ),
        opcoesDefesa(
          "Volta para recompor",
          "O adversário dispara em velocidade e seu time está em inferioridade numérica.",
          "velocidade",
          [
            ["Acompanhar o corredor e bloquear o passe", 0.7],
            ["Voltar até a área e fechar o chute", 0.66],
            ["Pressionar junto do lateral para recuperar", 0.61],
          ],
        ),
      ],
      MC: [
        opcoesPasse(
          "Passe entre linhas",
          "Você recebe de frente para a defesa adversária.",
          [
            ["Enfiada para deixar o atacante na cara do gol", 0.59],
            ["Virar o jogo para o lado livre", 0.69],
            ["Tabela curta para avançar", 0.66],
          ],
        ),
        opcoesDefesa(
          "Disputa no círculo central",
          "O adversário tenta iniciar um contra-ataque.",
          "defesa",
          [
            ["Antecipar o passe", 0.66],
            ["Pressionar o portador", 0.62],
            ["Recuar e proteger a defesa", 0.77],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "meio",
        ),
        opcoesDrible(
          "Condução pelo centro",
          "Você encontra espaço para carregar a bola.",
          [
            ["Avançar entre os marcadores", 0.57],
            ["Proteger a posse e girar o jogo", 0.76],
            ["Tentar uma tabela rápida", 0.65],
          ],
        ),
        opcoesDefesa(
          "Cobertura dos zagueiros",
          "Um atacante recebe entre as linhas e ameaça avançar.",
          "defesa",
          [
            ["Recuar e fechar o espaço à frente da área", 0.74],
            ["Desarmar sem fazer falta", 0.58],
            ["Interceptar o passe para o centroavante", 0.65],
          ],
        ),
      ],
      MD: [
        opcoesPasse(
          "Criação pelo lado direito",
          "Você recebe aberto com espaço para avançar.",
          [
            ["Lançar o ponta em profundidade", 0.59],
            ["Cruzar na área", 0.56],
            ["Inverter a jogada", 0.68],
          ],
        ),
        opcoesDrible(
          "Progressão pela direita",
          "O marcador fecha a linha lateral.",
          [
            ["Cortar para dentro", 0.58],
            ["Passar em velocidade pela lateral", 0.62],
            ["Segurar a bola e buscar apoio", 0.75],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "direita",
        ),
        opcoesDefesa(
          "Cobertura do meio",
          "O adversário tenta avançar pelo seu setor.",
          "defesa",
          [
            ["Pressionar para recuperar", 0.62],
            ["Fechar o passe central", 0.73],
            ["Acompanhar a ultrapassagem", 0.68],
          ],
        ),
        opcoesDefesa(
          "Recomposição pelo lado",
          "Seu lateral foi superado e o adversário acelera na sua direção.",
          "velocidade",
          [
            ["Voltar e dobrar a marcação", 0.7],
            ["Cortar o passe para a área", 0.66],
            ["Pressionar para recuperar a bola", 0.6],
          ],
        ),
      ],
      PE: [
        opcoesDrible(
          "Um contra um pela esquerda",
          "Você encara o lateral perto da área.",
          [
            ["Cortar para dentro e chutar", 0.57],
            ["Ganhar na velocidade pela linha", 0.62],
            ["Fingir o chute e buscar o passe", 0.56],
          ],
        ),
        opcoesPasse(
          "Ataque pela ponta esquerda",
          "Um companheiro entra na área enquanto você avança.",
          [
            ["Cruzar no primeiro poste", 0.55],
            ["Tocar rasteiro para trás", 0.7],
            ["Enfiar a bola entre lateral e zagueiro", 0.6],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "esquerda",
        ),
        opcoesAtaque(
          "Finalização de ponta",
          "A defesa abre espaço para você finalizar.",
          "finalizacao",
        ),
        opcoesDefesa(
          "Volta para ajudar o lateral",
          "O adversário inicia um contra-ataque pelo seu lado.",
          "velocidade",
          [
            ["Acompanhar o ponta até a defesa", 0.7],
            ["Fechar a linha de passe e recuperar", 0.64],
            ["Pressionar para forçar o erro", 0.58],
          ],
        ),
      ],
      CA: [
        opcoesAtaque(
          "Bola na área",
          "O cruzamento chega e você precisa finalizar sob pressão.",
          "finalizacao",
        ),
        opcoesDrible(
          "Disputa com o zagueiro",
          "Você recebe de costas para o gol, marcado de perto.",
          [
            ["Girar rápido e chutar", 0.55],
            ["Proteger a bola até chegar apoio", 0.76],
            ["Tocar de primeira para a infiltração", 0.68],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "meio",
        ),
        opcoesDrible(
          "Ataque à profundidade",
          "A defesa sobe e aparece espaço nas costas.",
          [
            ["Disparar para receber em velocidade", 0.64],
            ["Fazer o pivô para o meia", 0.74],
            ["Atacar o primeiro poste", 0.61],
          ],
        ),
        opcoesDefesa(
          "Pressão na saída de bola",
          "Os zagueiros adversários trocam passes e seu time precisa recuperar a bola.",
          "fisico",
          [
            ["Pressionar o portador e fechar o passe", 0.63],
            ["Perseguir a devolução para o goleiro", 0.57],
            ["Fechar a saída curta e forçar o lançamento", 0.7],
          ],
        ),
      ],
      PD: [
        opcoesDrible(
          "Um contra um pela direita",
          "Você encara o lateral perto da área.",
          [
            ["Cortar para dentro e chutar", 0.57],
            ["Ganhar na velocidade pela linha", 0.62],
            ["Fingir o chute e buscar o passe", 0.56],
          ],
        ),
        opcoesPasse(
          "Ataque pela ponta direita",
          "Um companheiro invade a área enquanto você avança.",
          [
            ["Cruzar no segundo poste", 0.56],
            ["Tocar rasteiro para trás", 0.7],
            ["Enfiar a bola entre lateral e zagueiro", 0.6],
          ],
        ),
        penaltiComum(
          "Pênalti para decidir",
          "Você é chamado para cobrar um pênalti. Qual escolha faz?",
          "direita",
        ),
        opcoesAtaque(
          "Finalização de ponta",
          "A defesa abre espaço para você finalizar.",
          "finalizacao",
        ),
        opcoesDefesa(
          "Recomposição pelo lado direito",
          "O time perde a bola e o adversário avança pela sua faixa.",
          "velocidade",
          [
            ["Voltar em velocidade e fechar o corredor", 0.7],
            ["Acompanhar a ultrapassagem", 0.66],
            ["Tentar o desarme por trás com cuidado", 0.55],
          ],
        ),
      ],
    };
    const pool = posicoes[posicao] || [finalizacao, passe, drible];
    const penaltiExtra = (() => {
      if (Math.random() > 0.18) return null;
      if (posicao === "GOL") {
        return penaltiGoleiro(
          "Pênalti defendido",
          "O árbitro marca pênalti. Você precisa escolher o lado e a forma de defender.",
        );
      }
      return penaltiComum(
        "Pênalti para decidir",
        "Você é chamado para cobrar um pênalti. Qual escolha faz?",
        ["esquerda", "meio", "direita"][Math.floor(Math.random() * 3)],
      );
    })();
    const poolComPenalti =
      penaltiExtra &&
      !pool.some((lance) =>
        lance?.opcoes?.some((opcao) =>
          ["penalti", "penalti-defesa"].includes(opcao.tipo),
        ),
      )
        ? [penaltiExtra, ...pool]
        : pool;
    const quantidade = 2 + Math.floor(Math.random() * 2);
    const embaralhados = [...poolComPenalti];
    for (let indice = embaralhados.length - 1; indice > 0; indice--) {
      const troca = Math.floor(Math.random() * (indice + 1));
      [embaralhados[indice], embaralhados[troca]] = [
        embaralhados[troca],
        embaralhados[indice],
      ];
    }
    return embaralhados.slice(0, Math.min(quantidade, embaralhados.length));
  }
  function exibirLanceDecisao() {
    if (
      !fluxoDecisao ||
      !Array.isArray(fluxoDecisao.lances) ||
      !fluxoDecisao.lances.length
    ) {
      encerrarDecisoesPartida(true);
      return;
    }
    const lance = fluxoDecisao.lances[fluxoDecisao.indiceLance];
    const modal = $("jja-modal-decisao");
    const opcoes = $("jja-decisao-opcoes");
    $("jja-decisao-progresso").textContent =
      `Lance ${fluxoDecisao.indiceLance + 1} de ${fluxoDecisao.lances.length}`;
    $("jja-decisao-titulo").textContent = lance.titulo;
    $("jja-decisao-contexto").textContent = lance.contexto;
    $("jja-decisao-feedback").textContent = "";
    opcoes.innerHTML = lance.opcoes
      .map(
        (opcao, indice) =>
          `<button type="button" class="jja-decisao-opcao" data-opcao="${indice}">${escapar(opcao.texto)}</button>`,
      )
      .join("");
    opcoes.hidden = false;
    $("jja-decisao-voltar").hidden = fluxoDecisao.escolhaConfirmada;
    $("jja-decisao-continuar").hidden = true;
    $("jja-decisao-continuar").textContent =
      fluxoDecisao.indiceLance + 1 < fluxoDecisao.lances.length
        ? "Próximo lance"
        : "Concluir e jogar partida";
    modal.hidden = false;
    opcoes.querySelector("button")?.focus();
  }
  function resolverDecisao(opcao) {
    const atributo =
      Number(estado.atributos?.[opcao.atributo]) ||
      Number(estado.overall) ||
      50;
    const chance = Math.max(
      0.2,
      Math.min(
        0.92,
        opcao.chance +
          (Number(estado.overall) - 70) * 0.003 +
          (atributo - 60) * 0.004,
      ),
    );
    const sucesso = Math.random() < chance;
    const posicao =
      typeof chavePosicaoCampo === "function"
        ? chavePosicaoCampo(estado.posicao)
        : String(estado.posicao || "").toUpperCase();
    const ehGoleiro = posicao === "GOL";
    registrarAcaoPosicional(opcao, sucesso);

    if (opcao.tipo === "penalti") {
      const lado = String(opcao.direcao || "meio").toLowerCase();
      const variacaoDirecao =
        { esquerda: 0.08, meio: 0.0, direita: -0.08 }[lado] || 0;
      const chancePenalti = Math.max(
        0.42,
        Math.min(0.9, chance + variacaoDirecao),
      );
      const converteu = Math.random() < chancePenalti;
      if (converteu) {
        fluxoDecisao.resultado.gols++;
        return lado === "meio"
          ? "Pênalti convertido no meio do gol! Você marcou com categoria."
          : `Pênalti convertido para o ${lado}! O goleiro não conseguiu chegar.`;
      }
      return lado === "meio"
        ? "O goleiro adivinhou e defendeu o pênalti no centro."
        : `O goleiro chegou no lado ${lado} e falhou a sua escolha.`;
    }

    if (opcao.tipo === "penalti-defesa") {
      const lado = ["esquerdo", "direito", "centro"][
        Math.floor(Math.random() * 3)
      ];
      const defesa =
        Math.random() < Math.max(0.46, Math.min(0.88, chance + 0.12));
      if (defesa) {
        fluxoDecisao.resultado.golsEvitados++;
        fluxoDecisao.resultado.defesas++;
        return `Defesa! Você antecipou a direção ${lado} e segurou o pênalti.`;
      }
      return `O atacante marcou para o ${lado}. Você não conseguiu impedir a cobrança.`;
    }

    if (!sucesso) {
      return ["defesa", "reflexos", "fisico", "velocidade"].includes(
        opcao.atributo,
      )
        ? "O adversário conseguiu passar. A jogada continua perigosa."
        : "A defesa adversária leu a jogada e recuperou a bola.";
    }
    if (opcao.tipo === "finalizacao") {
      fluxoDecisao.resultado.gols++;
      return "GOL! Sua finalização encontrou o caminho da rede.";
    }
    if (opcao.tipo === "passe") {
      fluxoDecisao.resultado.jogadasCriadas++;
      if (Math.random() < 0.68) {
        fluxoDecisao.resultado.assistencias++;
        return "Passe perfeito! A jogada terminou em gol e você deu a assistência.";
      }
      return "Seu passe encontrou o companheiro e criou uma boa chance.";
    }
    if (opcao.tipo === "reposicao") {
      fluxoDecisao.resultado.jogadasCriadas++;
      if (Math.random() < 0.3) {
        fluxoDecisao.resultado.assistencias++;
        return "Reposição precisa! O contra-ataque terminou em gol e você deu a assistência.";
      }
      return "Sua reposição encontrou um companheiro e iniciou o contra-ataque.";
    }
    if (opcao.tipo === "drible") {
      fluxoDecisao.resultado.driblesCompletos++;
      const recompensa = Math.random();
      if (recompensa < 0.3) {
        fluxoDecisao.resultado.gols++;
        return "Você superou a marcação e marcou!";
      }
      if (recompensa < 0.68) {
        fluxoDecisao.resultado.assistencias++;
        return "Você venceu o marcador e serviu o companheiro para o gol.";
      }
      return "Você venceu o marcador e manteve a posse no ataque.";
    }
    if (ehGoleiro && !opcao.contaComoDesarme) fluxoDecisao.resultado.defesas++;
    else fluxoDecisao.resultado.desarmes++;
    fluxoDecisao.resultado.golsEvitados++;
    const acoesDefensivasBemSucedidas =
      fluxoDecisao.resultado.defesas + fluxoDecisao.resultado.desarmes;
    const chanceContraAtaqueBase = ehGoleiro ? 0.25 : 0.15;
    const chanceContraAtaque = Math.min(
      0.65,
      chanceContraAtaqueBase + acoesDefensivasBemSucedidas * 0.1,
    );
    if (Math.random() < chanceContraAtaque) {
      fluxoDecisao.resultado.golsEquipeCriados++;
      fluxoDecisao.resultado.jogadasCriadas++;
      if (opcao.contaComoDesarme)
        return "Você saiu da área, afastou a bola e ainda iniciou um contra-ataque perigoso.";
      if (opcao.atributo === "reflexos")
        return "Defesaça! Você evitou o gol e iniciou um contra-ataque que terminou em gol.";
      return "Ação defensiva perfeita! Você interrompeu o ataque e iniciou um contra-ataque que terminou em gol.";
    }
    if (opcao.contaComoDesarme)
      return "Boa saída! Você chegou antes do atacante e afastou o perigo para contar como desarme.";
    if (opcao.atributo === "reflexos")
      return "Defesaça! Você evitou o gol e manteve sua equipe na partida.";
    if (opcao.atributo === "fisico")
      return "Você ganhou a disputa e afastou o perigo da área.";
    if (opcao.atributo === "velocidade")
      return "Recuperação decisiva! Você chegou a tempo e cortou a jogada.";
    return "Ação defensiva perfeita! Você interrompeu o ataque adversário.";
  }

  function encerrarDecisoesPartida(jogarPartida) {
    const fluxo = fluxoDecisao;
    if (!fluxo || (!jogarPartida && fluxo.escolhaConfirmada)) return;
    $("jja-modal-decisao").hidden = true;
    fluxoDecisao = null;
    decisaoEmAndamento = false;
    renderizar();
    if (jogarPartida) {
      bloquearAcoesPartida();
      // Executa assíncrono; usa interativo=true para o jogador bater/defender a 1ª cobrança
      (async () => {
        try {
          await simularPartida(
            fluxo.indice,
            true,
            { participou: fluxo.participou, ...fluxo.resultado },
            { interativo: true },
          );
        } catch (erro) {
          console.error(
            "[FootMain] Falha ao concluir partida com decisões:",
            erro,
          );
        }
      })();
    }
  }

  function configurarDecisoesPartida() {
    $("jja-decisao-opcoes")?.addEventListener("click", (evento) => {
      const botao = evento.target.closest("[data-opcao]");
      if (!botao || !fluxoDecisao) return;
      const lance = fluxoDecisao.lances[fluxoDecisao.indiceLance];
      const opcao = lance.opcoes[Number(botao.dataset.opcao)];
      if (!opcao || fluxoDecisao.decisaoRespondida) return;
      fluxoDecisao.decisaoRespondida = true;
      fluxoDecisao.escolhaConfirmada = true;
      $("jja-decisao-feedback").textContent = resolverDecisao(opcao);
      $("jja-decisao-opcoes").hidden = true;
      $("jja-decisao-voltar").hidden = true;
      $("jja-decisao-continuar").hidden = false;
      $("jja-decisao-continuar").focus();
    });
    $("jja-decisao-continuar")?.addEventListener("click", () => {
      if (!fluxoDecisao) return;
      fluxoDecisao.indiceLance++;
      if (fluxoDecisao.indiceLance >= fluxoDecisao.lances.length)
        encerrarDecisoesPartida(true);
      else {
        fluxoDecisao.decisaoRespondida = false;
        exibirLanceDecisao();
      }
    });
    $("jja-decisao-voltar")?.addEventListener("click", () =>
      encerrarDecisoesPartida(false),
    );
    $("jja-modal-decisao")?.addEventListener("click", (evento) => {
      if (
        evento.target === evento.currentTarget &&
        !fluxoDecisao?.escolhaConfirmada
      )
        encerrarDecisoesPartida(false);
    });
    document.addEventListener("keydown", (evento) => {
      if (
        evento.key === "Escape" &&
        fluxoDecisao &&
        !fluxoDecisao.escolhaConfirmada
      )
        encerrarDecisoesPartida(false);
    });
  }

  function configurarModalProximaPartida() {
    const modal = $("jja-modal-proxima");
    const dialogo = modal?.querySelector('[role="dialog"]');
    let elementoAnterior = null;

    const fechar = () => {
      if (!modal || modal.hidden) return;
      modal.hidden = true;
      elementoAnterior?.focus();
    };

    $("jja-jogar")?.addEventListener("click", () => {
      if (!modal) return;
      elementoAnterior = document.activeElement;
      const jogosLesao = Number(estado?.disponibilidade?.jogosLesao) || 0;
      const botaoLesao = $("jja-proxima-lesao");
      if (botaoLesao) {
        botaoLesao.hidden =
          jogosLesao <= 0 || !!estado?.disponibilidade?.lesaoCarreira;
        botaoLesao.textContent = `Simular partidas até o fim da lesão (${jogosLesao})`;
      }
      $("jja-proxima-contexto").textContent =
        jogosLesao > 0
          ? `Você está lesionado e ficará fora das próximas ${jogosLesao} partidas. Como deseja avançar?`
          : "Como deseja avançar nesta partida?";
      modal.hidden = false;
      $("jja-proxima-jogar")?.focus();
    });
    $("jja-proxima-cancelar")?.addEventListener("click", fechar);
    $("jja-proxima-jogar")?.addEventListener("click", () => {
      fechar();
      simularProxima();
    });
    $("jja-proxima-simular")?.addEventListener("click", () => {
      fechar();
      simularProximaAutomaticamente();
    });
    $("jja-proxima-lesao")?.addEventListener("click", () => {
      fechar();
      simularAteFimLesao();
    });
    modal?.addEventListener("click", (evento) => {
      if (evento.target === evento.currentTarget) fechar();
    });
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && modal && !modal.hidden) fechar();
      if (evento.key === "Tab" && modal && !modal.hidden && dialogo) {
        const botoes = [
          ...dialogo.querySelectorAll("button:not([disabled])"),
        ].filter((botao) => !botao.hidden);
        if (!botoes.length) return;
        const primeiro = botoes[0];
        const ultimo = botoes[botoes.length - 1];
        if (evento.shiftKey && document.activeElement === primeiro) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primeiro.focus();
        }
      }
    });
  }

  function configurarModalOpcoesSimulacao() {
    const modal = $("jja-modal-simulacao");
    const dialogo = modal?.querySelector('[role="dialog"]');
    let elementoAnterior = null;

    const fechar = () => {
      if (!modal || modal.hidden) return;
      modal.hidden = true;
      elementoAnterior?.focus();
    };

    const abrir = (gatilho) => {
      if (!modal || gatilho?.disabled) return;
      elementoAnterior = gatilho;
      modal.hidden = false;
      const primeiraOpcao = [
        ...modal.querySelectorAll("button:not([disabled])"),
      ].find((botao) => !botao.hidden);
      (primeiraOpcao || dialogo)?.focus();
    };

    $("jja-opcoes-simulacao")?.addEventListener("click", (evento) =>
      abrir(evento.currentTarget),
    );
    $("mobile-action-options")?.addEventListener("click", (evento) =>
      abrir(evento.currentTarget),
    );
    $("jja-simulacao-cancelar")?.addEventListener("click", fechar);
    $("jja-simular-restantes")?.addEventListener("click", () => {
      fechar();
      simularRestantes(false, true);
    });
    $("jja-simular-carreira")?.addEventListener("click", () => {
      fechar();
      simularFimCarreira();
    });
    modal?.addEventListener("click", (evento) => {
      if (evento.target === evento.currentTarget) fechar();
    });
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && modal && !modal.hidden) fechar();
      if (evento.key !== "Tab" || !modal || modal.hidden || !dialogo) return;
      const botoes = [
        ...dialogo.querySelectorAll("button:not([disabled])"),
      ].filter((botao) => !botao.hidden);
      if (!botoes.length) return;
      const primeiro = botoes[0];
      const ultimo = botoes[botoes.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    });
  }

  async function simularProximaAutomaticamente() {
    filaModaisPartida = [];
    if (bloqueioAcoesPartida || decisaoEmAndamento) return;
    if (!estado) {
      informar("Inicie sua carreira primeiro.", true);
      return;
    }

    const indice = estado.partidas.findIndex(
      (partida) => partida.status === "agendada" && !ehPartidaDeIA(partida),
    );
    if (indice < 0) {
      informar("A temporada já foi concluída.");
      return;
    }

    const partida = estado.partidas[indice];
    bloqueioAcoesPartida = true;
    renderizar();
    try {
      if (
        !partida.coletivaPendente &&
        !partida.coletivaProcessada &&
        typeof abrirColetivaImprensa === "function"
      ) {
        await abrirColetivaImprensa(partida, estado, false);
        salvar();
      }
      await simularPartidaComCarregamento(indice, "Simulando partida...");
    } finally {
      bloqueioAcoesPartida = false;
      renderizar();
    }
  }

  async function simularPartidaComCarregamento(
    indice,
    texto = "Simulando partida...",
    interacao = null,
  ) {
    await mostrarCarregamento(texto);
    try {
      await simularPartida(indice, true, interacao, {
        interativo: false,
        adiarModais: true,
      });
    } finally {
      ocultarCarregamento();
    }
    if (filaModaisPartida.length > 0) await processarFilaModais();
  }

  async function simularAteFimLesao() {
    filaModaisPartida = [];
    if (bloqueioAcoesPartida || decisaoEmAndamento) return;
    if (!estado) {
      informar("Inicie sua carreira primeiro.", true);
      return;
    }

    const disponibilidade = estado.disponibilidade || disponibilidadeInicial();
    if (
      disponibilidade.lesaoCarreira ||
      Number(disponibilidade.jogosLesao) <= 0
    ) {
      informar("Não há uma lesão com partidas restantes para simular.", true);
      return;
    }

    bloqueioAcoesPartida = true;
    let partidasSimuladas = 0;
    try {
      await mostrarCarregamento("Simulando partidas até o fim da lesão...");
      while (
        !estado.disponibilidade?.lesaoCarreira &&
        Number(estado.disponibilidade?.jogosLesao) > 0
      ) {
        const indice = estado.partidas.findIndex(
          (partida) => partida.status === "agendada" && !ehPartidaDeIA(partida),
        );
        if (indice < 0) break;

        const partida = estado.partidas[indice];
        await simularPartida(indice, false, null, { interativo: false });
        if (partida.status !== "concluida") {
          informar(
            "A simulação foi interrompida porque uma partida não pôde ser concluída.",
            true,
          );
          return;
        }
        partidasSimuladas++;
      }

      const jogosRestantes = Number(estado.disponibilidade?.jogosLesao) || 0;
      informar(
        estado.disponibilidade?.lesaoCarreira
          ? "A simulação foi interrompida porque uma lesão gravíssima encerrou a carreira."
          : jogosRestantes > 0
            ? `${partidasSimuladas} partida(s) simulada(s). Você segue lesionado por mais ${jogosRestantes} partida(s), que poderão ser simuladas na próxima temporada.`
            : `Lesão encerrada após simular ${partidasSimuladas} partida(s).`,
      );
    } finally {
      ocultarCarregamento();
      bloqueioAcoesPartida = false;
      renderizar();
    }
  }

  async function simularProxima() {
    filaModaisPartida = [];
    if (bloqueioAcoesPartida || decisaoEmAndamento) return;
    if (!estado) {
      informar("Inicie sua carreira primeiro.", true);
      return;
    }

    const indice = estado.partidas.findIndex(
      (p) => p.status === "agendada" && !ehPartidaDeIA(p),
    );
    if (indice < 0) {
      informar("A temporada já foi concluída.");
      return;
    }
    const partida = estado.partidas[indice];
    if (
      !partida.coletivaPendente &&
      !partida.coletivaProcessada &&
      typeof abrirColetivaImprensa === "function"
    ) {
      await abrirColetivaImprensa(partida, estado, false);
      salvar();
    }
    const pelaSelecao = partida.tipo === "selecao";
    const disponibilidade = estado.disponibilidade || disponibilidadeInicial();
    const chaveEquipe = pelaSelecao ? "selecao" : "clube";
    const indisponivel =
      disponibilidade.lesaoCarreira ||
      disponibilidade.jogosLesao > 0 ||
      Number(disponibilidade.suspensoes?.[chaveEquipe]) > 0;
    if (indisponivel) {
      bloquearAcoesPartida();
      await simularPartidaComCarregamento(indice);
      return;
    }
    const times = clubesDisponiveis();
    const meuClube = pelaSelecao
      ? typeof SELECOES !== "undefined"
        ? SELECOES.find((selecao) => selecao.id === estado.nacionalidade)
        : null
      : times.find((clube) => clube.id === estado.clubeId);
    const adversario = times.find((clube) => clube.id === partida.adversarioId);
    if (!meuClube || (!pelaSelecao && !adversario)) {
      bloquearAcoesPartida();
      await simularPartidaComCarregamento(indice);
      return;
    }
    const forcaTime = pelaSelecao
      ? Number(getConfig()?.selecao?.potencias?.[meuClube.id]) || 60
      : forcaClube(meuClube);
    const relacaoTreinador = Number(estado.relacaoTreinador ?? 60);
    const fatorRelacaoTreinador = relacaoTreinador < 20 ? 0.78 : relacaoTreinador < 35 ? 0.86 : relacaoTreinador < 50 ? 0.93 : 1;
    const chanceJogar = Math.max(
      0.68,
      Math.min(0.99, (0.9 + (estado.overall - forcaTime) * 0.006) * fatorRelacaoTreinador),
    );
    const participou = Math.random() < chanceJogar;
    if (!participou) {
      bloquearAcoesPartida();
      await simularPartidaComCarregamento(indice, "Preparando a partida...", {
        participou: false,
      });
      return;
    }
    await mostrarCarregamento("Preparando a partida...");
    try {
      const lances = criarLancesDaPartida();
      if (!Array.isArray(lances) || !lances.length) {
        await simularPartidaComCarregamento(indice, "Preparando a partida...", {
          participou: true,
        });
        return;
      }
      fluxoDecisao = {
        indice,
        participou: true,
        lances,
        indiceLance: 0,
        escolhaConfirmada: false,
        decisaoRespondida: false,
        resultado: {
          gols: 0,
          assistencias: 0,
          golsEvitados: 0,
          golsEquipeCriados: 0,
          driblesCompletos: 0,
          desarmes: 0,
          defesas: 0,
          jogadasCriadas: 0,
        },
      };
      decisaoEmAndamento = true;
      renderizar();
    } finally {
      ocultarCarregamento();
    }
    exibirLanceDecisao();
  }

  async function simularRestantes(
    simulacaoAutomatica = false,
    comLoading = false,
  ) {
    if (decisaoEmAndamento || (bloqueioAcoesPartida && !simulacaoAutomatica))
      return;
    if (!estado) {
      informar("Inicie sua carreira primeiro.", true);
      return;
    }
    if (!estado.partidas.some((p) => p.status === "agendada")) {
      informar("A temporada já foi concluída.");
      return;
    }

    filaModaisPartida = [];

    if (!simulacaoAutomatica && typeof confirmarAcao === "function") {
      const confirmado = await confirmarAcao(
        "A temporada será concluída automaticamente e todos os jogos restantes serão simulados.\n\nDeseja continuar?",
        "Confirmar simulação da temporada",
      );
      if (!confirmado) return;
    }

    if (comLoading)
      await mostrarCarregamento("Simulando o restante da temporada...");
    simulandoTemporada = true;
    adiarPromocaoBaseAteFim = !simulacaoAutomatica && !simulandoCarreira;
    promocaoBasePendente = null;
    bloqueioAcoesPartida = true;

    try {
      let indice;
      let partidasSimuladas = 0;
      while (
        (indice = estado.partidas.findIndex(
          (p) => p.status === "agendada" && !ehPartidaDeIA(p),
        )) >= 0
      ) {
        const partida = estado.partidas[indice];
        if (
          !partida.coletivaPendente &&
          !partida.coletivaProcessada &&
          typeof abrirColetivaImprensa === "function"
        ) {
          await abrirColetivaImprensa(partida, estado, true);
        }
        await simularPartida(indice, false, null, {
          interativo: false,
          simulacaoEmLote: true,
        });
        if (partida.status === "agendada") {
          informar(
            "A simulação foi interrompida porque um jogo do calendário não pôde ser resolvido.",
            true,
          );
          return;
        }
        partidasSimuladas++;
        if (partidasSimuladas % 20 === 0) {
          const textoCarregamento = loadingEl?.querySelector(
            ".footmain-loading-texto",
          );
          if (textoCarregamento) {
            textoCarregamento.textContent = `Simulando a temporada ${estado.ano}... (${partidasSimuladas} partidas concluídas)`;
          }
          salvar();
          await new Promise((resolver) => {
            if (document.visibilityState === "hidden") {
              setTimeout(resolver, 0);
              return;
            }
            requestAnimationFrame(resolver);
          });
        }
      }

      salvar();
      if (
        !estado.partidas.some((p) => p.status === "agendada") &&
        !estado.salvaOficialmente
      )
        await finalizarTemporadaOficial();
    } finally {
      bloqueioAcoesPartida = false;
      simulandoTemporada = false;
      adiarPromocaoBaseAteFim = false;
      if (comLoading) ocultarCarregamento();
      renderizar();
    }

    if (promocaoBasePendente) {
      const promocao = promocaoBasePendente;
      promocaoBasePendente = null;
      const aceitou = await perguntarPromocaoDaBase(
        promocao.temporada,
        promocao.clubeBase,
      );
      if (aceitou) {
        const carreira =
          typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
        if (String(carreira.id) === String(promocao.carreiraId)) {
          carreira.subiuProfissional = true;
          carreira.clubeBaseDestinoPendente = "";
          if (typeof salvarCarreiraAtual === "function")
            salvarCarreiraAtual(carreira);
        }
      }
    }

    await processarFilaModaisTitulos();
    filaModaisPartida = [];
  }

  async function finalizarTemporadaOficial() {
    if (!estado || estado.salvaOficialmente || !estado.integrado) {
      return;
    }
    try {
      const carreira =
        typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
      if (String(carreira.id) !== String(estado.carreiraId))
        throw new Error(
          "A carreira ativa mudou durante a temporada. Os resultados não foram anexados para evitar misturar carreiras.",
        );
      const historicoCompleto =
        typeof lerHistorico === "function" ? lerHistorico() : [];
      const historicoCarreira = historicoCompleto.filter(
        (t) => String(t.carreiraId) === String(estado.carreiraId),
      );
      if (historicoCarreira.some((t) => Number(t.ano) === Number(estado.ano))) {
        estado.salvaOficialmente = true;
        salvar();
        return;
      }
      const posRadio = document.querySelector(
        `input[name="posicao"]#${estado.posicao}`,
      );
      const posicaoArg = posRadio ? posRadio.id : estado.posicao;
      const temporada =
        typeof criarTemporada === "function"
          ? criarTemporada(
              estado.nome,
              estado.idade,
              estado.ano,
              posicaoArg,
              historicoCarreira,
              estado.nacionalidade,
              estado.clubeId,
            )
          : null;
      if (!temporada)
        throw new Error("Não foi possível construir a temporada oficial.");
      const e = estado.estatisticas;
      aplicarDesempenhoPosicional(temporada);
      temporada.jogos = e.jogos;
      temporada.gols = e.gols;
      temporada.assistencias = e.assistencias;
      temporada.jogosClube = e.jogosClube || 0;
      temporada.golsClube = e.golsClube || 0;
      temporada.assistenciasClube = e.assistenciasClube || 0;
      temporada.jogosSelecao = e.jogosSelecao || 0;
      temporada.golsSelecao = e.golsSelecao || 0;
      temporada.assistenciasSelecao = e.assistenciasSelecao || 0;
      temporada.convocado = !!e.convocado;
      temporada.jogosSelecaoPorCompeticao = e.jogosSelecaoPorCompeticao || {};
      temporada.golsSelecaoPorCompeticao = e.golsSelecaoPorCompeticao || {};
      temporada.classificadoCopa = !!estado.classificadoCopa;
      temporada.posicaoEliminatorias =
        Number(estado.posicaoEliminatorias) || null;
      temporada.partidasEliminatorias = estado.partidas.filter(
        (p) =>
          p.competicao === "Eliminatórias da Copa do Mundo" &&
          p.status === "concluida",
      );
      temporada.cartaoAmarelo = e.amarelos;
      temporada.cartaoVermelho = e.vermelhos;
      temporada.motm = Number(e.motm) || 0;
      temporada.driblesCompletos = Number(e.driblesCompletos) || 0;
      temporada.desarmes = Number(e.desarmes) || 0;
      temporada.defesas = Number(e.defesas) || 0;
      temporada.jogadasCriadas = Number(e.jogadasCriadas) || 0;

      // Garante que o estado tem um array e que a temporada compartilha a mesma referência.
      estado.eventos = Array.isArray(estado.eventos) ? estado.eventos : [];
      temporada.eventos = estado.eventos;

      temporada.lesaoGrave = temporada.eventos.some(
        (evento) => evento.tipo === "lesao-grave",
      );
      temporada.lesaoCarreira = !!estado.disponibilidade?.lesaoCarreira;
      temporada.jogosForaProximaTemporada =
        Number(estado.disponibilidade?.jogosLesao) || 0;
      temporada.cleanSheets =
        estado.posicao === "GOL"
          ? Number(estado.desempenhoPosicional?.jogosSemSofrer) || 0
          : 0;
      temporada.penaltisDefendidos = 0;
      temporada.penaltisCometidos = 0;
      temporada.minutosJogados = e.jogos * 90;
      temporada.clube = estado.clubeId;
      temporada.rankingLiga = estado.liga
        ? {
            ano: estado.ano,
            liga: estado.liga,
            ...obterRankingsLiga(),
          }
        : null;
      temporada.ano = estado.ano;
      temporada.idade = estado.idade;
      temporada.nome = estado.nome;
      temporada.nacionalidade = estado.nacionalidade;
      temporada.posicaoDetalhe = estado.posicao;
      temporada.posicao =
        (typeof POSICOES_CAMPO !== "undefined" &&
          POSICOES_CAMPO[estado.posicao]?.nome) ||
        estado.posicao;

      // --- Eventos sintéticos de defesa/goleiro -----------------------------
      // Entram em estado.eventos (jogo: 0 = "sem partida específica") e por isso
      // aparecem no resumo da temporada E são considerados nos prêmios.
      const eventosSinteticos = [];
      if (Number(e.defesas) >= 10 && Math.random() < 0.65)
        eventosSinteticos.push("defesa-ultimo-lance");
      if (Number(e.defesas) >= 20 && Math.random() < 0.55)
        eventosSinteticos.push("penalti-defendido");
      if (Number(e.desarmes) >= 30 && Math.random() < 0.6)
        eventosSinteticos.push("interceptacao-decisiva");
      if (Number(e.desarmes) >= 50 && Math.random() < 0.5)
        eventosSinteticos.push("contra-ataque-desarmado");

      eventosSinteticos.forEach((tipo) => {
        estado.eventos.push({ tipo, jogo: 0 });
      });

      // Passa a referência real (a função só faz .filter(), não muta).
      const trofeusCalculados = gerarTrofeusTemporada(
        temporada.posicaoKey,
        e.jogos,
        e.gols,
        e.assistencias,
        estado.ano,
        estado.idade,
        historicoCarreira,
        estado.nacionalidade,
        estado.clubeId,
        estado.eventos,
        temporada.overall,
        estado.posicao,
        !!e.convocado,
        temporada.atributos,
        false,
        temporada.rankingLiga,
        estado.carreiraId,
      );

      const tabela = estado.tabela
        .filter((t) => !String(t.id).startsWith("__rodada__"))
        .sort(
          (a, b) => b.pts - a.pts || b.gp - b.gc - (a.gp - a.gc) || b.gp - a.gp,
        );
      const campeao =
        !ehClubeBase(estado.clubeId) && tabela[0]?.id === estado.clubeId;
      const nomesTrofeus =
        typeof obterNomesTrofeusClube === "function"
          ? obterNomesTrofeusClube(estado.clubeId)
          : { liga: estado.liga };

      const trofeusClube = [...(estado.trofeusClube || [])];
      if (campeao && !trofeusClube.includes(nomesTrofeus.liga || estado.liga)) {
        trofeusClube.push(nomesTrofeus.liga || estado.liga);
        enfileirarTrofeu(nomesTrofeus.liga || estado.liga, "clube"); // ← NOVO
      }

      const trofeusSelecao = [...(estado.trofeusSelecao || [])];
      temporada.trofeusClube = trofeusClube;
      temporada.trofeusSelecao = trofeusSelecao;
      temporada.trofeusColetivos = [
        ...new Set([...trofeusClube, ...trofeusSelecao]),
      ];
      temporada.base =
        typeof ehClubeBase === "function" && ehClubeBase(estado.clubeId);
      temporada.campeaoCopinha =
        temporada.base && trofeusClube.includes("Copinha");
      temporada.trofeusIndividuais = (
        trofeusCalculados.trofeusIndividuais || []
      ).filter((titulo) => titulo !== "Bola de Ouro");
      const rankingBolaDeOuro = temporada.base
        ? null
        : premiarBolaDeOuro(temporada, e, historicoCarreira);
      temporada.trofeusIndividuais
        .filter((titulo) => titulo !== "Bola de Ouro")
        .forEach(enfileirarPremioIndividual);
      const possuiDadosBolaDeOuro =
        !temporada.base &&
        ((rankingBolaDeOuro?.jogadores || []).length > 0 ||
          (rankingBolaDeOuro?.chuteira || []).length > 0);
      if (possuiDadosBolaDeOuro) {
        filaModaisPartida.push({
          tipo: "bola-de-ouro",
          ranking: rankingBolaDeOuro,
        });
      }
      estado.trofeusColetivos = temporada.trofeusColetivos;
      estado.trofeusIndividuais = temporada.trofeusIndividuais;
      temporada.pontosReputacaoTemporada = Number(estado.pontosReputacaoTemporada) || 0;
      const reputacao =
        typeof consolidarReputacaoTemporada === "function"
          ? consolidarReputacaoTemporada(carreira, temporada)
          : typeof calcularReputacao === "function"
            ? calcularReputacao(carreira, [...historicoCarreira, temporada])
            : 0;
      temporada.coletivasTemporada = Number(estado.coletivasTemporada) || 0;
      temporada.reputacao = reputacao;
      temporada.valorMercado = temporada.base
        ? 0
        : typeof calcularValorMercado === "function"
          ? calcularValorMercado(
              temporada.overall,
              estado.idade,
              reputacao,
              carreira.anosContratoRestantes || 1,
            )
          : 0;
      temporada.salario = temporada.base
        ? 0
        : typeof calcularSalario === "function"
          ? calcularSalario(temporada.valorMercado, reputacao, estado.clubeId)
          : 0;

      temporada.anosContrato = Math.max(
        0,
        Number(carreira.anosContratoRestantes) || 0,
      );

      const competicoesClubeProxima = obterCompeticoesQualificadas(
        tabela,
        estado.liga,
      );
      temporada.competicoesQualificadas = estado.estatisticas.convocado
        ? obterCompeticoesSelecao(estado.nacionalidade, estado.ano)
        : [];

      const premiacaoTitulos =
        temporada.trofeusColetivos.length *
        Math.round(
          50000 +
            forcaClube(
              clubesDisponiveis().find((c) => c.id === estado.clubeId),
            ) *
              10000,
        );

      const premiacaoIndividual = temporada.trofeusIndividuais.length * 50000;
      temporada.premioFinanceiro = premiacaoTitulos + premiacaoIndividual;
      temporada.rendaTemporada =
        (Number(temporada.salario) || 0) + temporada.premioFinanceiro;
      carreira.saldo =
        Math.max(0, Number(carreira.saldo) || 0) + temporada.rendaTemporada;
      estado.resumoFinanceiro = {
        reputacao,
        valorMercado: temporada.valorMercado,
        salario: temporada.salario,
        premioFinanceiro: temporada.premioFinanceiro,
        renda: temporada.rendaTemporada,
        saldo: carreira.saldo,
      };

      carreira.competicoesQualificadas = competicoesClubeProxima;
      carreira.clubeQualificado = estado.clubeId;

      carreira.nome = estado.nome;
      carreira.clube = estado.clubeId;
      carreira.posicaoDetalhe = estado.posicao;
      carreira.posicao = temporada.posicao;
      carreira.nacionalidade = estado.nacionalidade;
      const destaqueBase =
        !carreira.subiuProfissional &&
        typeof jogadorMerecePromocaoDaBase === "function" &&
        jogadorMerecePromocaoDaBase(temporada);
      const promovidoAgora =
        destaqueBase &&
        (simulandoCarreira ||
          (simulandoTemporada && !adiarPromocaoBaseAteFim) ||
          (!simulandoTemporada &&
            (await perguntarPromocaoDaBase(
              temporada,
              obterClube(estado.clubeId),
            ))));
      if (destaqueBase && adiarPromocaoBaseAteFim) {
        promocaoBasePendente = {
          temporada,
          clubeBase: obterClube(estado.clubeId),
          carreiraId: estado.carreiraId,
        };
      }
      if (promovidoAgora) carreira.subiuProfissional = true;
      let aposentarPorLimiteBase = false;
      if (!promovidoAgora && temporada.base && estado.idade >= 20) {
        const clubeDestino = sortearClubeFracoDaLigaDaBase(temporada.clube);
        const decisao =
          simulandoCarreira || simulandoTemporada
            ? "destino"
            : await perguntarDestinoOuAposentadoriaBase(
                temporada,
                clubeDestino,
              );
        if (decisao === "destino" && clubeDestino) {
          carreira.clubeBaseDestinoPendente = clubeDestino.id;
        } else {
          aposentarPorLimiteBase = true;
        }
      }
      carreira.anosContratoRestantes = Math.max(
        0,
        (Number(carreira.anosContratoRestantes) || 0) - 1,
      );
      carreira.salarioAtual =
        Number(temporada.salario) || Number(carreira.salarioAtual) || 0;
      const perfilContrato = $("perfil-contrato");
      if (perfilContrato)
        perfilContrato.textContent =
          carreira.anosContratoRestantes > 0
            ? `Contrato ativo · ${carreira.anosContratoRestantes} temporada(s)`
            : "Contrato encerrado; negociar na próxima temporada";
      atualizarResumoCarreira(carreira, historicoCarreira, temporada);
      const novoHistorico = [...historicoCompleto, temporada];
      if (
        typeof salvarHistorico !== "function" ||
        !salvarHistorico(novoHistorico)
      )
        throw new Error("Falha ao salvar o Histórico oficial.");
      if (typeof salvarCarreiraAtual === "function")
        salvarCarreiraAtual(carreira);
      estado.salvaOficialmente = true;
      salvar();
      if (typeof renderHistorico === "function") renderHistorico();
      if (typeof renderAtributos === "function") renderAtributos(temporada);
      const put = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
      };
      put("jogos", temporada.jogos);
      put("gols", temporada.gols);
      put("assi", temporada.assistencias);
      if (typeof atualizarTitulosResultados === "function")
        atualizarTitulosResultados(temporada);
      if (typeof atualizarMercadoResultados === "function")
        atualizarMercadoResultados(temporada);
      renderizar();
      const valor =
        typeof formatarValorEuro === "function" ? formatarValorEuro : String;
      put("perfil-nome", estado.nome);
      put("perfil-idade", estado.idade);
      put("perfil-ano", estado.ano + 1);
      const clubeFinal = clubesDisponiveis().find(
        (c) => c.id === estado.clubeId,
      );
      put("perfil-clube", clubeFinal?.nome || estado.clubeId);
      put("perfil-reputacao", temporada.reputacao);
      put("perfil-valor", valor(temporada.valorMercado));
      put("perfil-salario", valor(temporada.salario));
      put("perfil-saldo", valor(carreira.saldo));
      const selecaoNome =
        typeof SELECOES !== "undefined"
          ? SELECOES.find((s) => s.id === estado.nacionalidade)?.nome
          : "";
      put("perfil-selecao", selecaoNome || "Não definida");
      put(
        "perfil-caps",
        `${temporada.jogosSelecao} jogos · ${temporada.golsSelecao} gols`,
      );
      const carreiraEncerradaAgora =
        estado.idade >= estado.idadeLimite || temporada.lesaoCarreira;
      atualizarCampoAnoInicial(carreira, [...historicoCarreira, temporada]);
      if (carreiraEncerradaAgora && typeof mostrarResumoFinal === "function") {
        mostrarResumoFinal(
          estado.nome,
          estado.idadeLimite,
          estado.ano,
          [...historicoCarreira, temporada],
          temporada.posicao,
        );
        abrirModalFimCarreira();
      }
      if (
        aposentarPorLimiteBase &&
        typeof aposentarVoluntariamente === "function"
      ) {
        await aposentarVoluntariamente(true);
        atualizarCampoAnoInicial(carreira, [...historicoCarreira, temporada]);
        renderizar();
      }
      limparInformacao();
      filaModaisPartida.push({ tipo: "resumo-temporada", temporada });
    } catch (erro) {
      console.error("Falha ao registrar temporada jogo a jogo:", erro);
      informar(
        `Temporada concluída, mas não foi possível registrar no Histórico: ${erro.message || erro}`,
        true,
      );
    }
  }
  function limparCamposConfiguracao() {
    const nome = $("nome");
    const idade = $("idade");
    const limite = $("idade-limite");
    const nacionalidade = $("nacionalidade");
    const baseClube = $("base-clube");
    const clubeAlvo = $("clube-alvo");
    const ano = $("ano-inicial-carreira");
    if (nome) nome.value = "";
    if (idade) idade.value = "18";
    if (limite)
      limite.value = String(
        typeof IDADE_LIMITE_PADRAO !== "undefined" ? IDADE_LIMITE_PADRAO : 40,
      );
    if (ano) {
      ano.value = String(
        typeof getConfig === "function"
          ? Number(getConfig()?.geral?.anoInicial) || 2026
          : 2026,
      );
      ano.disabled = false;
    }
    document.querySelectorAll('input[name="posicao"]').forEach((radio) => {
      radio.checked = false;
    });
    if (nacionalidade) nacionalidade.value = "";
    const filtroRegiao = $("filtro-regiao-nacionalidade");
    if (filtroRegiao) filtroRegiao.value = "";
    const posicaoSelecionada = $("posicao-selecionada");
    if (posicaoSelecionada)
      posicaoSelecionada.textContent = "Nenhuma posição selecionada";
    if (baseClube) {
      baseClube.innerHTML =
        '<option value="">Escolha a nacionalidade primeiro</option>';
      baseClube.disabled = true;
    }
    if (clubeAlvo) clubeAlvo.textContent = "Escolher clube-alvo";
    const painel = $("configuracao-jogador");
    if (painel) painel.open = false;
    $("jja-confirmar-inicio").hidden = false;
    $("jja-iniciar").hidden = false;
    $("jja-iniciar").textContent = "Iniciar";
    $("mobile-action-start").hidden = false;
    $("mobile-action-active").hidden = true;
  }

  function finalizarFluxoFimCarreira() {
    $("jja-modal-fim-carreira").hidden = true;
    $("resumo-final").hidden = true;
    $("resultados").hidden = false;
    const carreira =
      typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
    carreira.nome = "";
    carreira.posicao = "";
    carreira.posicaoDetalhe = "";
    carreira.nacionalidade = "";
    carreira.baseClube = "";
    carreira.clubeAlvo = "";
    if (typeof salvarCarreiraAtual === "function")
      salvarCarreiraAtual(carreira);
    estado = null;
    try {
      localStorage.removeItem(KEY);
    } catch (erro) {
      console.warn("Não foi possível limpar o progresso finalizado:", erro);
    }
    limparCamposConfiguracao();
    renderizar();
  }

  function abrirModalFimCarreira() {
    const modal = $("jja-modal-fim-carreira");
    if (modal) modal.hidden = false;
  }

  function informar(texto, erro = false) {
    const el = $("jja-status");
    if (el) {
      el.textContent = texto;
      el.hidden = false;
      el.classList.toggle("erro", erro);
    }
  }
  function limparInformacao() {
    const el = $("jja-status");
    if (el) {
      el.textContent = "";
      el.hidden = true;
      el.classList.remove("erro");
    }
  }
  function nomeFaseCompeticao(fase, totalFases) {
    const fasesPorQuantidade = {
      1: ["Final"],
      2: ["Semifinal", "Final"],
      3: ["Quartas de final", "Semifinal", "Final"],
      4: ["Oitavas de final", "Quartas de final", "Semifinal", "Final"],
      5: [
        "Fase preliminar",
        "Oitavas de final",
        "Quartas de final",
        "Semifinal",
        "Final",
      ],
    };
    return fasesPorQuantidade[totalFases]?.[fase - 1] || `Fase ${fase}`;
  }
  function venceuFaseCompeticao(partida, fases) {
    if (typeof partida.vencedorCasa === "boolean")
      return partida.casa === partida.vencedorCasa;
    if (partida.golsCasa !== partida.golsFora) {
      return partida.casa
        ? partida.golsCasa > partida.golsFora
        : partida.golsFora > partida.golsCasa;
    }
    const proximaFase = fases.find((fase) => fase.fase > partida.fase);
    if (proximaFase) return proximaFase.status !== "cancelada";
    const trofeus =
      partida.tipo === "selecao" ? estado.trofeusSelecao : estado.trofeusClube;
    return (trofeus || []).includes(partida.competicao);
  }

  /* ============================================================
     Zonas de classificação por liga.
     ============================================================ */
  function obterZonasClassificacao(liga) {
    if (liga === "Brasileirão")
      return [
        { ate: 4, tipo: "libertadores", nome: "Libertadores", cor: "#22c55e" },
        {
          ate: 5,
          tipo: "pre-libertadores",
          nome: "Pré-Libertadores",
          cor: "#60a5fa",
        },
        {
          ate: 11,
          tipo: "sul-americana",
          nome: "Copa Sul-Americana",
          cor: "#facc15",
        },
        {
          ultimos: 4,
          tipo: "rebaixamento",
          nome: "Rebaixamento",
          cor: "#ef4444",
        },
      ];
    if (
      [
        "Premier League",
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Ligue 1",
      ].includes(liga)
    )
      return [
        { ate: 4, tipo: "champions", nome: "Champions League", cor: "#22c55e" },
        {
          ate: 6,
          tipo: "europa-league",
          nome: "Europa League",
          cor: "#60a5fa",
        },
        {
          ate: 7,
          tipo: "conference-league",
          nome: "Conference League",
          cor: "#a78bfa",
        },
        {
          ultimos: 3,
          tipo: "rebaixamento",
          nome: "Rebaixamento",
          cor: "#ef4444",
        },
      ];
    if (
      [
        "Primeira Liga",
        "Eredivisie",
        "Süper Lig",
        "Belgian Pro League",
        "Scottish Premiership",
        "Swiss Super League",
        "Austrian Bundesliga",
        "Russian Premier League",
        "Ukrainian Premier League",
        "Greek Super League",
      ].includes(liga)
    )
      return [
        { ate: 2, tipo: "champions", nome: "Champions League", cor: "#22c55e" },
        {
          ate: 4,
          tipo: "europa-league",
          nome: "Europa League",
          cor: "#60a5fa",
        },
        {
          ate: 6,
          tipo: "conference-league",
          nome: "Conference League",
          cor: "#a78bfa",
        },
        {
          ultimos: 3,
          tipo: "rebaixamento",
          nome: "Rebaixamento",
          cor: "#ef4444",
        },
      ];
    if (
      [
        "Argentine Primera División",
        "Colombian Primera A",
        "Chilean Primera División",
        "Uruguayan Primera División",
        "Ecuadorian Serie A",
        "Paraguayan Primera División",
      ].includes(liga)
    )
      return [
        { ate: 4, tipo: "libertadores", nome: "Libertadores", cor: "#22c55e" },
        {
          ate: 8,
          tipo: "sul-americana",
          nome: "Copa Sul-Americana",
          cor: "#facc15",
        },
        {
          ultimos: 2,
          tipo: "rebaixamento",
          nome: "Rebaixamento",
          cor: "#ef4444",
        },
      ];
    if (["MLS", "Liga MX"].includes(liga))
      return [
        {
          ate: 4,
          tipo: "concacaf",
          nome: "CONCACAF Champions Cup",
          cor: "#22c55e",
        },
        { ate: 8, tipo: "playoffs", nome: "Playoffs", cor: "#60a5fa" },
      ];
    if (
      [
        "Saudi Pro League",
        "J1 League",
        "K League 1",
        "Chinese Super League",
      ].includes(liga)
    )
      return [
        { ate: 3, tipo: "afc", nome: "AFC Champions League", cor: "#22c55e" },
        {
          ate: 6,
          tipo: "afc-2",
          nome: "AFC Champions League 2",
          cor: "#60a5fa",
        },
        {
          ultimos: 3,
          tipo: "rebaixamento",
          nome: "Rebaixamento",
          cor: "#ef4444",
        },
      ];
    if (
      [
        "Egyptian Premier League",
        "South African Premier Division",
        "Moroccan Botola",
      ].includes(liga)
    )
      return [
        { ate: 2, tipo: "caf", nome: "CAF Champions League", cor: "#22c55e" },
        {
          ate: 5,
          tipo: "caf-conf",
          nome: "CAF Confederation Cup",
          cor: "#60a5fa",
        },
        {
          ultimos: 3,
          tipo: "rebaixamento",
          nome: "Rebaixamento",
          cor: "#ef4444",
        },
      ];
    if (liga === "Australian A-League")
      return [
        { ate: 2, tipo: "afc", nome: "AFC Champions League", cor: "#22c55e" },
        { ate: 6, tipo: "playoffs", nome: "Playoffs", cor: "#60a5fa" },
      ];
    return [];
  }

  function obterZonaPosicao(zonas, posicao, totalTimes) {
    for (const zona of zonas) {
      if (zona.ate !== undefined && posicao <= zona.ate) return zona;
      if (zona.ultimos !== undefined && posicao > totalTimes - zona.ultimos)
        return zona;
    }
    return null;
  }

  function renderizarLegendaZonas(zonas) {
    if (!zonas || !zonas.length) return "";
    return `<ul class="jja-legenda-zonas" aria-label="Legenda das zonas da classificação">
            ${zonas
              .map(
                (zona) => `<li class="jja-legenda-item">
                <span class="jja-legenda-cor" style="background:${zona.cor}" aria-hidden="true"></span>
                <span class="jja-legenda-texto">${escapar(zona.nome)}</span>
            </li>`,
              )
              .join("")}
        </ul>`;
  }

  function renderizarProgressoCompeticoes() {
    const partidas = estado.partidas.filter(
      (partida) =>
        partida.torneioId &&
        (partida.tipo === "grupo" ||
          partida.faseGrupo ||
          Number(partida.fase) > 0),
    );
    const competicoes = new Map();
    partidas.forEach((partida) => {
      if (!competicoes.has(partida.torneioId))
        competicoes.set(partida.torneioId, []);
      competicoes.get(partida.torneioId).push(partida);
    });
    if (!competicoes.size) {
      return '<section class="jja-competicoes"><h3>Outras competições da temporada</h3><p>Nenhuma outra competição nesta temporada.</p></section>';
    }

    const conteudo = [...competicoes.values()]
      .map((fases) => {
        // ---- Ordenação: grupo primeiro (por rodada), depois mata-mata (por fase) ----
        fases.sort((a, b) => {
          const aG = a.tipo === "grupo" || a.faseGrupo,
            bG = b.tipo === "grupo" || b.faseGrupo;
          if (aG && !bG) return -1;
          if (!aG && bG) return 1;
          if (aG && bG) return (a.rodadaGrupo || 0) - (b.rodadaGrupo || 0);
          return a.fase - b.fase;
        });

        const fasesGrupo = fases.filter(
          (p) => p.tipo === "grupo" || p.faseGrupo,
        );
        const fasesMataMata = fases.filter((p) => p.fase && !p.faseGrupo);

        // Total de fases do mata-mata (0 se ainda não houver mata-mata).
        const totalFases = fasesMataMata.length
          ? Number(fasesMataMata[0].totalFases) || fasesMataMata.length
          : 0;

        // ---- Resumo da fase de grupos ----
        let resumoGrupoHtml = "";
        let eliminadoNoGrupo = false;
        let grupoEmAndamento = false;
        const ehFaseLiga = !!fasesGrupo[0]?.faseLiga;
        if (fasesGrupo.length) {
          const concluidosGrupo = fasesGrupo.filter(
            (p) => p.status === "concluida",
          ).length;
          let pontos = 0,
            saldo = 0;
          fasesGrupo.forEach((p) => {
            if (p.status !== "concluida") return;
            const gm = p.casa ? p.golsCasa : p.golsFora;
            const ga = p.casa ? p.golsFora : p.golsCasa;
            saldo += gm - ga;
            if (gm > ga) pontos += 3;
            else if (gm === ga) pontos += 1;
          });
          const grupoCompleto = concluidosGrupo === fasesGrupo.length;
          const mataMataCancelado =
            fasesMataMata.length > 0 &&
            fasesMataMata.every((p) => p.status === "cancelada");
          eliminadoNoGrupo = grupoCompleto && mataMataCancelado;
          grupoEmAndamento = !grupoCompleto;
          const saldoTexto = `${saldo >= 0 ? "+" : ""}${saldo}`;
          resumoGrupoHtml = `<p class="jja-grupo-resumo"><strong>${ehFaseLiga ? "Fase liga" : "Fase de grupos"}:</strong> ${concluidosGrupo}/${fasesGrupo.length} jogos · ${pontos} pts · saldo ${saldoTexto}</p>`;
        }

        // ---- Mata-mata ----
        const faseEliminacao = fasesMataMata.find(
          (partida) =>
            partida.status === "concluida" &&
            !venceuFaseCompeticao(partida, fasesMataMata),
        );
        const nomeEliminador = faseEliminacao
          ? clubesDisponiveis().find(
              (clube) => clube.id === faseEliminacao.adversarioId,
            )?.nome ||
            (typeof CLUBES_REGIONAIS !== "undefined"
              ? CLUBES_REGIONAIS.find(
                  (clube) => clube.id === faseEliminacao.adversarioId,
                )?.nome
              : "") ||
            (typeof SELECOES !== "undefined"
              ? SELECOES.find(
                  (selecao) => selecao.id === faseEliminacao.adversarioId,
                )?.nome
              : "") ||
            faseEliminacao.adversarioNome
          : "";
        const campeao = fasesMataMata.some(
          (partida) =>
            partida.status === "concluida" &&
            partida.fase === totalFases &&
            venceuFaseCompeticao(partida, fasesMataMata),
        );
        const proximaFase = fasesMataMata.find(
          (partida) => partida.status === "agendada",
        );
        const bloqueada = fasesMataMata.some(
          (partida) => partida.status === "bloqueada",
        );
        const concluidasMataMata = fasesMataMata.filter(
          (p) => p.status === "concluida",
        ).length;

        // ---- Resumo da competição ----
        let resumo;
        if (grupoEmAndamento) {
          resumo = ehFaseLiga
            ? "Fase liga em andamento"
            : "Fase de grupos em andamento";
        } else if (eliminadoNoGrupo) {
          resumo = ehFaseLiga
            ? "Eliminado na fase liga"
            : "Eliminado na fase de grupos";
        } else if (campeao) {
          resumo = "Campeão";
        } else if (faseEliminacao) {
          resumo = `Eliminado na ${nomeFaseCompeticao(faseEliminacao.fase, totalFases)}${nomeEliminador ? ` por ${nomeEliminador}` : ""}`;
        } else if (proximaFase) {
          resumo = `${nomeFaseCompeticao(proximaFase.fase, totalFases)} em andamento`;
        } else if (bloqueada) {
          resumo = "Aguardando classificação";
        } else if (!fasesMataMata.length) {
          resumo = fasesGrupo.length
            ? ehFaseLiga
              ? "Fase liga"
              : "Fase de grupos"
            : "Competição concluída";
        } else {
          resumo = "Competição concluída";
        }

        // ---- Etapas do mata-mata ----
        const etapas = fasesMataMata
          .map((partida) => {
            const venceu =
              partida.status === "concluida" &&
              venceuFaseCompeticao(partida, fasesMataMata);
            const status =
              partida.status === "concluida"
                ? venceu
                  ? partida.fase === totalFases
                    ? "Campeão"
                    : "Classificado"
                  : "Eliminado"
                : partida.status === "cancelada"
                  ? faseEliminacao
                    ? `Eliminado na ${nomeFaseCompeticao(faseEliminacao.fase, totalFases)}`
                    : eliminadoNoGrupo
                      ? ehFaseLiga
                        ? "Eliminado na fase liga"
                        : "Eliminado na fase de grupos"
                      : "Não disputada"
                  : partida.status === "bloqueada"
                    ? "Aguardando classificação"
                    : partida === proximaFase
                      ? "Próxima fase"
                      : "Aguardando avanço";
            const classe =
              partida.status === "concluida"
                ? venceu
                  ? "concluida"
                  : "eliminada"
                : partida.status === "cancelada"
                  ? "eliminada"
                  : partida.status === "bloqueada"
                    ? "bloqueada"
                    : partida === proximaFase
                      ? "atual"
                      : "pendente";
            const resultado =
              partida.status === "concluida"
                ? `<strong>${escapar(`${partida.golsCasa}–${partida.golsFora}${partida.decidePenaltis ? " · pênaltis" : ""}`)}</strong>`
                : "";
            return `<li class="jja-fase jja-fase--${classe}"><span>${escapar(nomeFaseCompeticao(partida.fase, totalFases))}</span><small>${escapar(status)}</small>${resultado}</li>`;
          })
          .join("");

        const etapasHtml = etapas
          ? `<ol class="jja-fases">${etapas}</ol>`
          : fasesGrupo.length
            ? `<p class="jja-competicao__vazio">Mata-mata ainda não definido.</p>`
            : "";

        // ---- Progresso total = grupo + mata-mata ----
        const totalEtapas = fasesGrupo.length + fasesMataMata.length;
        const etapasConcluidas =
          fasesGrupo.filter((p) => p.status === "concluida").length +
          concluidasMataMata;
        const progresso =
          totalEtapas > 0
            ? Math.round((etapasConcluidas / totalEtapas) * 100)
            : 0;

        // ... (código de ordenação e contagem de pontos anterior)

        // NOVO: Tabela do Grupo (ou da Fase Liga)
        let tabelaGrupoHtml = "";
        if (fasesGrupo.length > 0 && fasesGrupo[0].grupo) {
          tabelaGrupoHtml = fasesGrupo[0].faseGrupo
            ? renderizarTabelaGrupoSelecao(
                fasesGrupo[0].torneioId,
                fasesGrupo[0].grupo,
                fasesGrupo[0].competicao,
              )
            : renderizarTabelaContinental(
                fasesGrupo[0].torneioId,
                fasesGrupo[0].grupo,
              );
        }

        // ... (código de resumo, etapas, progresso)

        return `<article class="jja-competicao">
                <div class="jja-competicao__topo"><h4>${escapar(fases[0].competicao)}</h4><strong>${escapar(resumo)}</strong></div>
                <div class="jja-competicao__progresso" ...><span style="width:${progresso}%"></span></div>
                ${resumoGrupoHtml}
                ${tabelaGrupoHtml}  <!-- NOVO -->
                ${etapasHtml}
                <p>${etapasConcluidas} de ${totalEtapas} etapas concluídas</p>
            </article>`;
      })
      .join("");
    return `<section class="jja-competicoes"><h3>Outras competições da temporada</h3>${conteudo}</section>`;
  }

  function renderizarRankingLiga() {
    const secao = $("jja-ranking-liga");
    if (!secao) return;
    const clube = clubesDisponiveis().find(
      (item) => item.id === estado?.clubeId,
    );
    secao.hidden = !estado || !clube;
    if (secao.hidden || !secao.open) return;

    const seletor = $("jja-ranking-competicao");
    const competicaoAtual = seletor?.value || "global";
    if (seletor) {
      const competicoes = [
        ...new Set(
          [
            estado.liga,
            ...(estado.partidas || []).map((partida) => partida.competicao),
          ].filter(Boolean),
        ),
      ];
      const valorAnterior =
        competicoes.includes(competicaoAtual) || competicaoAtual === "global"
          ? competicaoAtual
          : "global";
      seletor.innerHTML = [
        '<option value="global">Geral</option>',
        ...competicoes.map(
          (nome) =>
            `<option value="${escapar(nome)}">${escapar(nome)}</option>`,
        ),
      ].join("");
      seletor.value = valorAnterior;
    }
    const competicao = seletor?.value || "global";
    const rankings = obterRankingsCompeticao(competicao);
    const metricaSelecionada =
      secao.querySelector("[data-ranking-metrica].is-active")?.dataset
        .rankingMetrica || "artilharia";
    const metrica =
      metricaSelecionada === "assistencias" ? "assistencias" : "gols";
    const rotulo = metrica === "gols" ? "Gols" : "Assistências";
    const renderTabela = (lista) =>
      lista.length
        ? `<div class="jja-ranking-wrap"><table class="jja-ranking-tabela"><thead><tr><th>#</th><th>Jogador</th><th>Clube</th><th>${rotulo}</th></tr></thead><tbody>${lista
            .map((jogador) => {
              const sigla = jogador.clube
                .split(/\s+/)
                .map((parte) => parte[0] || "")
                .slice(0, 3)
                .join("")
                .toUpperCase();
              const clubeRanking = CLUBES.find(
                (item) =>
                  item.nome.toLocaleLowerCase("pt-BR") ===
                  String(jogador.clube).toLocaleLowerCase("pt-BR"),
              );
              return `<tr><td>${jogador.posicao}</td><td>${escapar(jogador.nome)}</td><td><span class="jja-ranking-clube" title="${escapar(jogador.clube)}">${htmlEscudoClube(clubeRanking || { nome: jogador.clube }, "mini")}<span>${escapar(jogador.clube)}</span></span></td><td><strong>${jogador[metrica]}</strong></td></tr>`;
            })
            .join("")}</tbody></table></div>`
        : `<p class="jja-ranking-vazio">Nenhum ${rotulo.toLowerCase()} registrado nesta temporada.</p>`;
    $("jja-ranking-painel").innerHTML = renderTabela(
      rankings[metricaSelecionada],
    );
  }

  function renderizar() {
    if (simulandoCarreira) return;
    const ativo = !!estado;
    if (ativo && !estado.salvaOficialmente) {
      if (typeof atualizarTitulosResultados === "function")
        atualizarTitulosResultados(null);
      if (typeof atualizarMercadoResultados === "function")
        atualizarMercadoResultados(null);
    }

    const proxima = ativo
      ? estado.partidas.find(
          (p) => p.status === "agendada" && !ehPartidaDeIA(p),
        )
      : null;
    const carreira =
      typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
    const historicoCarreira = obterHistoricoCarreira(carreira);
    const encerrada = carreiraEncerrada(carreira, historicoCarreira);
    const emAndamento = temporadaEmAndamento(carreira);
    // Informações específicas da temporada só aparecem depois que uma carreira
    // foi iniciada. Mantém os painéis visíveis entre temporadas, mas os recolhe
    // ao encerrar e voltar à tela inicial.
    const conteudoTemporada = $("jja-conteudo-temporada");
    if (conteudoTemporada) {
      conteudoTemporada.hidden = !(
        ativo ||
        (historicoCarreira.length > 0 && !!carreira.nome)
      );
    }
    const botaoIniciar = $("jja-iniciar");
    botaoIniciar.textContent = encerrada
      ? "Iniciar"
      : historicoCarreira.length
        ? "Próxima temporada"
        : "Iniciar";
    botaoIniciar.hidden = emAndamento;
    botaoIniciar.disabled =
      bloqueioAcoesPartida ||
      emAndamento ||
      (!!estado && !estado.salvaOficialmente && !proxima);
    const botaoAposentar = $("jja-aposentar");

    const proximoCard = $("jja-proximo");
    if (proximoCard) {
      proximoCard.classList.toggle("tem-proxima-partida", !!proxima);
      proximoCard.classList.toggle(
        "proxima-e-final",
        !!proxima && ehPartidaFinal(proxima),
      ); // ← NOVO
    }

    botaoAposentar.hidden = !historicoCarreira.length || encerrada;
    botaoAposentar.disabled = !historicoCarreira.length || encerrada;
    botaoIniciar.disabled =
      bloqueioAcoesPartida ||
      emAndamento ||
      (!!estado && !estado.salvaOficialmente && !proxima) ||
      decisaoEmAndamento;
    $("jja-jogar").disabled =
      decisaoEmAndamento || bloqueioAcoesPartida || !ativo || !proxima;
    $("jja-simular-restantes").disabled =
      decisaoEmAndamento || bloqueioAcoesPartida || !ativo || !proxima;
    $("jja-simular-carreira").disabled =
      decisaoEmAndamento || bloqueioAcoesPartida || encerrada;
    const inicioPendente = !ativo && !historicoCarreira.length;
    $("jja-jogar").hidden = inicioPendente || encerrada || !emAndamento;
    $("jja-simular-restantes").hidden = inicioPendente || encerrada || !proxima;
    const botaoOpcoesSimulacao = $("jja-opcoes-simulacao");
    botaoOpcoesSimulacao.disabled =
      $("jja-simular-restantes").disabled &&
      $("jja-simular-carreira").disabled;
    botaoOpcoesSimulacao.hidden = inicioPendente || encerrada;
    botaoAposentar.disabled =
      decisaoEmAndamento ||
      bloqueioAcoesPartida ||
      !historicoCarreira.length ||
      encerrada;

    // A barra mobile deve espelhar o estado FINAL dos botões originais.
    // Esta sincronização fica depois de todas as regras de disabled acima.
    const mobileBar = $("mobile-action-bar");
    const mobileActive = $("mobile-action-active");
    const mobileStart = $("mobile-action-start");
    const mobileIsActive =
      !encerrada && (!!estado || historicoCarreira.length > 0);
    if (mobileBar) mobileBar.hidden = false;
    if (mobileActive) mobileActive.hidden = !mobileIsActive;
    if (mobileStart) {
      mobileStart.hidden = mobileIsActive;
      mobileStart.textContent = botaoIniciar.textContent;
      mobileStart.disabled = botaoIniciar.disabled;
    }
    const mobilePlay = $("mobile-action-play");
    const mobileOptions = $("mobile-action-options");
    const mobileRetire = $("mobile-action-retire");
    if (mobilePlay) {
      mobilePlay.disabled = $("jja-jogar").disabled;
      mobilePlay.hidden = $("jja-jogar").hidden;
    }
    if (mobileOptions)
      mobileOptions.disabled = botaoOpcoesSimulacao.disabled;
    if (mobileRetire) mobileRetire.disabled = botaoAposentar.disabled;

    if (!ativo) {
      const ranking = $("jja-ranking-liga");
      if (ranking) ranking.hidden = true;
      return;
    }
    renderizarRankingLiga();

    const clube = clubesDisponiveis().find((c) => c.id === estado.clubeId);
    const equipeSelecao =
      typeof SELECOES !== "undefined"
        ? SELECOES.find((s) => s.id === estado.nacionalidade)
        : null;
    const nomeMeuTime =
      proxima?.tipo === "selecao"
        ? equipeSelecao?.nome || "Seleção"
        : clube?.nome || "Clube";
    const nomeAdversario = proxima
      ? clubesDisponiveis().find((c) => c.id === proxima.adversarioId)?.nome ||
        proxima.adversarioNome ||
        "Adversário"
      : "";
    const estatisticasTemporada = estado.estatisticas || {};

    const estatisticaTemporadaHtml = `<p>Defesas: ${Number(estatisticasTemporada.defesas) || 0} · Desarmes: ${Number(estatisticasTemporada.desarmes) || 0} · Dribles completos: ${Number(estatisticasTemporada.driblesCompletos) || 0} · Jogadas criadas: ${Number(estatisticasTemporada.jogadasCriadas) || 0}</p>`;
    const faseProxima =
      proxima && Number(proxima.fase) > 0 && Number(proxima.totalFases) > 0
        ? nomeFaseCompeticao(proxima.fase, proxima.totalFases)
        : "";
    const ehFinalProxima = ehPartidaFinal(proxima);
    const rotuloCompeticaoProxima = proxima
      ? `${ehFinalProxima ? "🏆 FINAL" : "PRÓXIMA PARTIDA"} · ${escapar(proxima.competicao)}${faseProxima ? ` · ${escapar(faseProxima)}` : ""}`
      : "";

    $("jja-proximo").innerHTML = proxima
      ? `<div class="jja-proximo-topo"><span>${rotuloCompeticaoProxima}</span><span>${proxima.data ? new Date(proxima.data).toLocaleDateString("pt-BR") : `Temporada ${estado.ano}`}</span></div><div class="jja-confronto"><strong>${escapar(proxima.casa ? nomeMeuTime : nomeAdversario)}</strong><span>VS</span><strong>${escapar(proxima.casa ? nomeAdversario : nomeMeuTime)}</strong></div><p>${proxima.casa ? "Jogo em casa" : "Jogo fora de casa"} · Temporada ${estado.ano}</p>`
      : `<div class="jja-concluida"><h3>Temporada encerrada</h3><p>Todos os jogos deste calendário foram concluídos.</p>${estatisticaTemporadaHtml}</div>`;

    const e = estado.estatisticas;
    const ultimaPartida = estado.ultima;
    const partidaSalva = ultimaPartida
      ? estado.partidas.find(
          (partida) => Number(partida.numero) === Number(ultimaPartida.rodada),
        )
      : null;
    const ultimaDribles =
      Number(
        ultimaPartida?.driblesCompletos ?? partidaSalva?.driblesCompletos,
      ) || 0;
    const ultimaDesarmes =
      Number(ultimaPartida?.desarmes ?? partidaSalva?.desarmes) || 0;
    const ultimaDefesas =
      Number(ultimaPartida?.defesas ?? partidaSalva?.defesas) || 0;
    const ultimaJogadas =
      Number(ultimaPartida?.jogadasCriadas ?? partidaSalva?.jogadasCriadas) ||
      0;
    const estatisticaUltimaPartida = `<p><strong>Defesas:</strong> ${ultimaDefesas} · <strong>Desarmes:</strong> ${ultimaDesarmes} · <strong>Dribles completos:</strong> ${ultimaDribles} · <strong>Jogadas criadas:</strong> ${ultimaJogadas}</p>`;
    const coletivaUltima =
      ultimaPartida?.coletiva || partidaSalva?.coletivaPendente;
    const impactoColetiva = Number(
      ultimaPartida?.coletiva?.impacto ?? partidaSalva?.coletivaResultado,
    ) || 0;
    const feedbackColetiva = coletivaUltima
      ? `<p class="coletiva-feedback ${impactoColetiva > 0 ? "coletiva-feedback--positivo" : impactoColetiva < 0 ? "coletiva-feedback--negativo" : "coletiva-feedback--neutro"}" role="status">Sua declaração${coletivaUltima.categoria ? ` · ${escapar(coletivaUltima.categoria)}` : ""}: ${escapar(coletivaUltima.resposta)} · ${impactoColetiva > 0 ? "+" : ""}${impactoColetiva} pontos de reputação</p>`
      : "";

    // ---------- NOVO: bloco de pênaltis na última partida ----------
    const penaltisUltima =
      ultimaPartida?.penaltis || partidaSalva?.penaltis || null;
    let blocoPenaltisUltima = "";
    if (penaltisUltima) {
      const venceuCasa = !!penaltisUltima.vencedorCasa;
      const partidaReferencia = partidaSalva || ultimaPartida;
      const euSouCasa = !!partidaReferencia?.casa;
      const meuVenceu =
        (euSouCasa && venceuCasa) || (!euSouCasa && !venceuCasa);
      const resultadoTexto = meuVenceu
        ? "✅ Vitória nos pênaltis"
        : "❌ Derrota nos pênaltis";
      blocoPenaltisUltima = `<p class="jja-penaltis-resumo"><strong>Pênaltis:</strong> ${penaltisUltima.golsCasa} × ${penaltisUltima.golsFora} · ${resultadoTexto}</p>`;
    }

    $("jja-ultima").innerHTML = ultimaPartida
      ? `<div class="jja-placar">${escapar(ultimaPartida.resumo)}</div><p>${escapar(ultimaPartida.detalhes)}</p>${feedbackColetiva}${ultimaPartida.participou ? estatisticaUltimaPartida : ""}${blocoPenaltisUltima}`
      : "Nenhuma partida disputada.";

    $("jogos").textContent = String(Number(e.jogos) || 0);
    $("gols").textContent = String(Number(e.gols) || 0);
    $("assi").textContent = String(Number(e.assistencias) || 0);
    const trofeusColetivos = new Set([
      ...(estado.trofeusColetivos || []),
      ...(estado.trofeusClube || []),
      ...(estado.trofeusSelecao || []),
    ]);
    $("prem").textContent = String(
      trofeusColetivos.size + (estado.trofeusIndividuais || []).length,
    );
    $("jja-motm").textContent = String(Number(e.motm) || 0);
    $("jja-amarelos").textContent = String(Number(e.amarelos) || 0);
    $("jja-vermelhos").textContent = String(Number(e.vermelhos) || 0);
    $("jja-hattricks").textContent = String(
      estado.partidas.filter((p) => Number(p.golsJogador) >= 3).length,
    );
    $("jja-dribles").textContent = String(Number(e.driblesCompletos) || 0);
    $("jja-desarmes").textContent = String(Number(e.desarmes) || 0);
    $("jja-defesas").textContent = String(Number(e.defesas) || 0);
    $("jja-jogadas-criadas").textContent = String(
      Number(e.jogadasCriadas) || 0,
    );
    const variacaoReputacao = Math.round(
      Number(estado.pontosReputacaoTemporada) || 0,
    );
    const variacaoReputacaoEl = $("jja-variacao-reputacao");
    if (variacaoReputacaoEl) {
      variacaoReputacaoEl.textContent = String(variacaoReputacao);
      variacaoReputacaoEl.classList.toggle(
        "jja-reputacao-positiva",
        variacaoReputacao > 0,
      );
      variacaoReputacaoEl.classList.toggle(
        "jja-reputacao-negativa",
        variacaoReputacao < 0,
      );
    }
    if (typeof atualizarVisibilidadeEstatisticasTemporada === "function")
      atualizarVisibilidadeEstatisticasTemporada();

    const tabelaEl = $("jja-tabela");
    const painelTabela = tabelaEl?.closest("details");
    if (tabelaEl && (!painelTabela || painelTabela.open)) {
      const tabela = estado.tabela
        .filter((t) => !t.id.startsWith("__rodada__"))
        .sort(
          (a, b) => b.pts - a.pts || b.gp - b.gc - (a.gp - a.gc) || b.gp - a.gp,
        );

      const ligaParaZonas =
        estado.liga ||
        clubesDisponiveis().find((c) => c.id === estado.clubeId)?.liga ||
        "";
      const zonasClassificacao = obterZonasClassificacao(ligaParaZonas);
      const totalTimesTabela = tabela.length;
      const linhasTabela = tabela
        .map((t, i) => {
          const posicao = i + 1;
          const zona = obterZonaPosicao(
            zonasClassificacao,
            posicao,
            totalTimesTabela,
          );
          const attrs = zona
            ? ` data-zona="${escapar(zona.tipo)}" style="--zona-cor:${zona.cor}"`
            : "";
          const classe = t.id === estado.clubeId ? "meu-clube" : "";
          return `<tr class="${classe}"${attrs}>
                <td>${posicao}</td>
                <td class="jja-clube-celula">${htmlEscudoClube(clubesDisponiveis().find((clube) => clube.id === t.id) || { id: t.id, nome: t.nome, liga: ligaParaZonas }, "pequeno")}${escapar(t.nome)}</td>
                <td>${t.j}</td>
                <td>${t.gp - t.gc}</td>
                <td><strong>${t.pts}</strong></td>
            </tr>`;
        })
        .join("");

      const grupoDoJogador = Object.values(estado.copinha?.grupos || {}).find(
        (grupo) => grupo.includes(estado.clubeId),
      );
      tabelaEl.innerHTML =
        estado.copinha && grupoDoJogador
          ? renderizarProgressoCompeticoes()
          : `
                <div class="jja-tabela-wrap">
                    <table class="jja-tabela">
                        <thead><tr><th>#</th><th>Clube</th><th>J</th><th>SG</th><th>Pts</th></tr></thead>
                        <tbody>${linhasTabela}</tbody>
                    </table>
                </div>
                ${renderizarLegendaZonas(zonasClassificacao)}
                ${renderizarProgressoCompeticoes()}`;
    }

    // ---------- NOVO: calendário com pênaltis ----------
    const calendarioEl = $("jja-calendario");
    const painelCalendario = calendarioEl?.closest("details");
    if (calendarioEl && (!painelCalendario || painelCalendario.open)) {
      calendarioEl.innerHTML = `<div class="jja-lista-jogos">${estado.partidas
        .filter((p) => !ehPartidaDeIA(p))
        .map((p) => {
          const adv = clubesDisponiveis().find((c) => c.id === p.adversarioId);
          const nomeCasa = p.casa
            ? p.tipo === "selecao"
              ? equipeSelecao?.nome
              : clube?.nome
            : adv?.nome || p.adversarioNome;
          const nomeFora = p.casa
            ? adv?.nome || p.adversarioNome
            : p.tipo === "selecao"
              ? equipeSelecao?.nome
              : clube?.nome;

          // Pênaltis aparecem no status da partida concluída
          const penaltisInfo =
            p.status === "concluida" && p.penaltis
              ? ` · Pên. ${p.penaltis.golsCasa}–${p.penaltis.golsFora}`
              : "";
          const status =
            p.status === "concluida"
              ? `${p.golsCasa}–${p.golsFora}${penaltisInfo}${p.motmJogador ? " · MOTM" : ""}${p.motivoAusencia ? ` · Ausente: ${p.motivoAusencia}` : ""}`
              : p.status === "cancelada"
                ? "Eliminado"
                : p.status === "bloqueada"
                  ? "Aguardando classificação"
                  : "Agendado";

          return `<div class="jja-jogo ${p.status === "concluida" ? "jja-jogo--feito" : ""}">
                <span class="jja-jogo-num">${p.data ? new Date(p.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : String(p.numero).padStart(2, "0")}</span>
                <span class="jja-jogo-adversario">
                  ${ehPartidaFinal(p) ? "🏆 " : ""}${escapar(p.competicao)} ·
                  <span class="jja-confronto-equipe">${htmlEscudoClube(p.casa ? clube : adv || { nome: nomeCasa }, "mini")}${escapar(nomeCasa || "Equipe")}</span>
                  <span aria-hidden="true">×</span>
                  <span class="jja-confronto-equipe">${htmlEscudoClube(p.casa ? adv || { nome: nomeFora } : clube, "mini")}${escapar(nomeFora || "Adversário")}</span>
                </span>
                <span class="jja-jogo-resultado">${escapar(status)}</span>
            </div>`;
        })
        .join("")}</div>`;
    }
  }
  function mostrarDesempenhoTemporada(temporada) {
    const resultados = $("resultados");
    if (resultados) resultados.hidden = false;
    if (!temporada) {
      resultados
        ?.querySelectorAll(".resultado-estatistica")
        .forEach((cartao) => {
          cartao.hidden = true;
        });
      if (typeof atualizarTitulosResultados === "function")
        atualizarTitulosResultados(null);
      if (typeof atualizarMercadoResultados === "function")
        atualizarMercadoResultados(null);
      return;
    }
    const coletivos = new Set([
      ...(temporada.trofeusColetivos || []),
      ...(temporada.trofeusClube || []),
      ...(temporada.trofeusSelecao || []),
    ]);
    const hatTricks = (temporada.eventos || []).filter(
      (evento) => evento.tipo === "hat-trick",
    ).length;
    const put = (id, value) => {
      const elemento = $(id);
      if (elemento) elemento.textContent = String(value);
    };
    put("jogos", temporada.jogos);
    put("gols", temporada.gols);
    put("assi", temporada.assistencias);
    put("prem", coletivos.size + (temporada.trofeusIndividuais || []).length);
    put("jja-motm", temporada.motm);
    put("jja-amarelos", temporada.cartaoAmarelo);
    put("jja-vermelhos", temporada.cartaoVermelho);
    put("jja-hattricks", hatTricks);
    put("jja-dribles", temporada.driblesCompletos);
    put("jja-desarmes", temporada.desarmes);
    put("jja-defesas", temporada.defesas);
    put("jja-jogadas-criadas", temporada.jogadasCriadas);
    const variacaoReputacao = Number(temporada.variacaoReputacao) || 0;
    put("jja-variacao-reputacao", variacaoReputacao);
    if (typeof atualizarTitulosResultados === "function")
      atualizarTitulosResultados(temporada);
    if (typeof atualizarMercadoResultados === "function")
      atualizarMercadoResultados(temporada);
    if (typeof atualizarVisibilidadeEstatisticasTemporada === "function")
      atualizarVisibilidadeEstatisticasTemporada();
  }

  async function simularFimCarreira() {
    if (decisaoEmAndamento) return;
    if (typeof confirmarAcao !== "function") {
      informar(
        "O modal de confirmação não está disponível nesta página.",
        true,
      );
      return;
    }

    const confirmado = await confirmarAcao(
      "Deseja simular automaticamente todas as temporadas restantes até a aposentadoria?\n\nA simulação continuará a partir da temporada atual e pode levar alguns segundos.",
      "Simular fim de carreira",
    );
    if (!confirmado) return;

    try {
      if (!estado) {
        await iniciar();
        if (!estado) return;
      }
      simulandoCarreira = true;

      while (estado && estado.idade <= estado.idadeLimite) {
        if (!estado.salvaOficialmente) {
          await mostrarCarregamento(`Simulando a temporada ${estado.ano}...`);
          try {
            await simularRestantes(true);
          } finally {
            ocultarCarregamento();
          }
        }
        if (
          !estado.salvaOficialmente ||
          estado.idade >= estado.idadeLimite ||
          estado.disponibilidade?.lesaoCarreira
        )
          break;

        const temporadaAnterior = estado;
        await iniciar();
        if (estado === temporadaAnterior) break;
      }

      ocultarCarregamento();
      const carreira =
        typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
      const historico = obterHistoricoCarreira(carreira);
      const temporadaFinal = historico[historico.length - 1];
      if (temporadaFinal && typeof mostrarResumoFinal === "function") {
        mostrarResumoFinal(
          carreira.nome || temporadaFinal.nome,
          carreira.idadeLimite || temporadaFinal.idade,
          temporadaFinal.ano,
          historico,
          temporadaFinal.posicao,
        );
        mostrarDesempenhoTemporada(temporadaFinal);
        abrirModalFimCarreira();
      }
      atualizarCampoAnoInicial(carreira, historico);
      informar(
        `Fim da carreira simulada até ${temporadaFinal?.idade || estado?.idade || "a última temporada"} anos. O Histórico contém o resumo de cada temporada.`,
      );
    } catch (erro) {
      console.error("Falha ao simular o fim da carreira:", erro);
      informar(
        `Não foi possível concluir a simulação da carreira: ${erro.message || erro}`,
        true,
      );
    } finally {
      ocultarCarregamento();
      simulandoCarreira = false;
      renderizar();
    }
  }

  function criarCarreiraTesteRapida(opcoes = {}) {
    const {
      nome = "Dev Tester",
      idade = 18,
      posicao = "CA",
      nacionalidade = "brasil",
      clubeId = "flamengo",
      idadeLimite = 40,
      anosContrato = 3,
    } = opcoes;

    try {
      localStorage.removeItem(KEY);
    } catch {}

    const clube = clubesDisponiveis().find((c) => c.id === clubeId);
    if (!clube) throw new Error("Clube inválido: " + clubeId);

    // Carreira
    const carreira =
      typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
    carreira.id =
      typeof gerarIdRanking === "function"
        ? gerarIdRanking()
        : `dev-${Date.now()}`;
    carreira.nome = nome;
    carreira.posicaoDetalhe = posicao;
    carreira.posicao = POSICOES_CAMPO[posicao]?.nome || posicao;
    carreira.nacionalidade = nacionalidade;
    carreira.clube = clubeId;
    carreira.idadeLimite = idadeLimite;
    carreira.anosContratoRestantes = anosContrato;
    carreira.rompimentosContratoUsados = 0;
    carreira.salarioAtual = 500000;
    carreira.saldo = 0;
    carreira.aposentadoriaSelecao = false;
    carreira.aposentadoriaVoluntaria = false;
    carreira.clubeQualificado = "";
    carreira.competicoesQualificadas = [];
    delete carreira.potencial;
    if (typeof salvarCarreiraAtual === "function")
      salvarCarreiraAtual(carreira);

    // Histórico desta carreira: limpo. Outras carreiras preservadas.
    const historicoAtual =
      typeof lerHistorico === "function" ? lerHistorico() : [];
    const outrosHistoricos = historicoAtual.filter(
      (t) => t.carreiraId !== carreira.id,
    );
    if (typeof salvarHistorico === "function")
      salvarHistorico(outrosHistoricos);

    // Estado direto, sem modais
    const times =
      clube.tipo === "base"
        ? obterClubesCopinhaDaNacionalidade(nacionalidade)
        : clubesDisponiveis().filter((c) => c.liga === clube.liga);
    const ano = typeof ANO_INICIAL !== "undefined" ? ANO_INICIAL : 2026;
    const tabela = times.map((t) => ({
      id: t.id,
      nome: t.nome,
      forca: forcaClube(t),
      j: 0,
      v: 0,
      e: 0,
      d: 0,
      gp: 0,
      gc: 0,
      pts: 0,
    }));
    const rodadas = gerarRodadasLiga(times);
    const perfil = { overall: 65, idade, nacionalidade, posicao };
    const partidas = montarCalendarioTemporada(
      times,
      clube,
      rodadas,
      ano,
      carreira,
      outrosHistoricos,
      perfil,
    );
    const gruposCopinha =
      partidas.find((partida) => partida.gruposCopinha)?.gruposCopinha || null;
    partidas.forEach((partida, indice) => {
      partida.numero = indice + 1;
    });

    estado = {
      versao: 4,
      integrado: true,
      carreiraId: carreira.id,
      nome,
      posicao,
      nacionalidade,
      overall: 65,
      atributos: null,
      idade,
      idadeLimite,
      ano,
      clubeId,
      liga: clube.liga,
      rodada: 0,
      rodadas,
      partidas,
      tabela,
      copinha: gruposCopinha
        ? {
            torneioId: `copinha:${nacionalidade}:${ano}`,
            grupos: gruposCopinha,
            chave: null,
          }
        : null,
      disponibilidade: disponibilidadeInicial(0),
      desempenhoPosicional: desempenhoPosicionalInicial(),
      estatisticas: {
        jogos: 0,
        gols: 0,
        assistencias: 0,
        jogosClube: 0,
        golsClube: 0,
        assistenciasClube: 0,
        jogosSelecao: 0,
        golsSelecao: 0,
        assistenciasSelecao: 0,
        jogosSelecaoPorCompeticao: {},
        golsSelecaoPorCompeticao: {},
        convocado: partidas.some((p) => p.tipo === "selecao"),
        amarelos: 0,
        vermelhos: 0,
        motm: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        driblesCompletos: 0,
        desarmes: 0,
        defesas: 0,
        jogadasCriadas: 0,
      },
      eventos: [],
      competicoes: {},
      trofeusClube: [],
      trofeusSelecao: [],
      trofeusColetivos: [],
      trofeusIndividuais: [],
      ultima: null,
      feed: [],
      salvaOficialmente: false,
    };
    prepararElencosLiga();
    salvar();
    renderizar();

    // Preenche o formulário para bater com o estado
    const nomeInput = document.getElementById("nome");
    const idadeInput = document.getElementById("idade");
    const idadeLimiteInput = document.getElementById("idade-limite");
    const nacionalidadeInput = document.getElementById("nacionalidade");
    if (nomeInput) nomeInput.value = nome;
    if (idadeInput) idadeInput.value = idade;
    if (idadeLimiteInput) idadeLimiteInput.value = idadeLimite;
    if (nacionalidadeInput) nacionalidadeInput.value = nacionalidade;
    const radio = document.querySelector(`input[name="posicao"]#${posicao}`);
    if (radio) radio.checked = true;

    return {
      ok: true,
      clube: clube.nome,
      liga: clube.liga,
      partidas: partidas.length,
    };
  }

  function inicializar() {
    carregar();
    const campoAnoInicial = $("ano-inicial-carreira");
    if (campoAnoInicial) {
      const anoConfigurado =
        typeof getConfig === "function"
          ? Number(getConfig()?.geral?.anoInicial)
          : Number(typeof ANO_INICIAL !== "undefined" ? ANO_INICIAL : 2026);
      campoAnoInicial.min = "2000";
      campoAnoInicial.max = "2050";
      campoAnoInicial.value = String(limitarAnoInicial(anoConfigurado));
      campoAnoInicial.addEventListener("change", () => {
        campoAnoInicial.value = String(
          limitarAnoInicial(campoAnoInicial.value, anoConfigurado),
        );
      });
    }
    if (estado) {
      prepararElencosLiga();
      salvar();
    }
    const carreira =
      typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
    const historicoCarreira = obterHistoricoCarreira(carreira);
    const temCarreiraSalva = historicoCarreira.length > 0;
    atualizarCampoAnoInicial(carreira, historicoCarreira);
    if (temCarreiraSalva || estado) {
      $("nome").value = estado?.nome || carreira.nome || "";
      const idadeProximaTemporada =
        Number(historicoCarreira[historicoCarreira.length - 1]?.idade) + 1;
      $("idade").value =
        estado && !estado.salvaOficialmente
          ? estado.idade
          : carreiraEncerrada(carreira, historicoCarreira)
            ? 18
            : idadeProximaTemporada || estado?.idade || 18;
      $("idade-limite").value = carreira.idadeLimite || 40;
      const posicao = estado?.posicao || carreira.posicaoDetalhe;
      const radio = document.querySelector(`input[name="posicao"]#${posicao}`);
      if (radio) radio.checked = true;
      $("nacionalidade").value =
        estado?.nacionalidade || carreira.nacionalidade || "";
    }
    configurarDecisoesPartida();
    ["jja-tabela", "jja-calendario"].forEach((id) => {
      const painel = $(id)?.closest("details");
      painel?.addEventListener("toggle", () => {
        if (painel.open) renderizar();
      });
    });
    $("jja-ranking-liga")?.addEventListener("toggle", () => {
      if ($("jja-ranking-liga").open) renderizarRankingLiga();
    });
    $("jja-ranking-liga")?.addEventListener("click", (evento) => {
      const botao = evento.target.closest("[data-ranking-metrica]");
      if (!botao) return;
      $("jja-ranking-liga")
        .querySelectorAll("[data-ranking-metrica]")
        .forEach((item) => {
          const selecionado = item === botao;
          item.classList.toggle("is-active", selecionado);
          item.setAttribute("aria-pressed", String(selecionado));
        });
      renderizarRankingLiga();
    });
    $("jja-ranking-competicao")?.addEventListener(
      "change",
      renderizarRankingLiga,
    );
    configurarModalProximaPartida();
    configurarModalOpcoesSimulacao();
    $("mobile-action-start")?.addEventListener("click", () =>
      $("jja-iniciar").click(),
    );
    $("mobile-action-play")?.addEventListener("click", () =>
      $("jja-jogar").click(),
    );
    $("mobile-action-retire")?.addEventListener("click", () => {
      $("jja-aposentar").click();
      $("mobile-action-menu").hidden = true;
      $("mobile-action-more").setAttribute("aria-expanded", "false");
    });
    $("mobile-action-more")?.addEventListener("click", () => {
      const menu = $("mobile-action-menu");
      menu.hidden = !menu.hidden;
      $("mobile-action-more").setAttribute(
        "aria-expanded",
        String(!menu.hidden),
      );
    });
    const ajustarAccordionsMobile = () => {
      const mobile = window.matchMedia("(max-width: 600px)").matches;
      document.querySelectorAll(".mobile-accordion").forEach((el) => {
        if (el.id !== "configuracao-jogador") el.open = !mobile;
      });
      const desempenho = document.querySelector(".jja-desempenho-painel");
      if (desempenho) desempenho.open = !mobile;
    };
    ajustarAccordionsMobile();
    window
      .matchMedia("(max-width: 600px)")
      .addEventListener?.("change", ajustarAccordionsMobile);
    $("configuracao-jogador")?.addEventListener("toggle", () => {
      const carreiraAtual =
        typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
      const historicoAtual = obterHistoricoCarreira(carreiraAtual);
      const podeConfigurar =
        !estado &&
        (!historicoAtual.length ||
          carreiraEncerrada(carreiraAtual, historicoAtual));
      if ($("configuracao-jogador").open && podeConfigurar) {
        $("jja-confirmar-inicio").hidden = false;
        $("jja-iniciar").hidden = true;
        $("mobile-action-start").hidden = true;
      } else if (!$("configuracao-jogador").open && podeConfigurar) {
        $("jja-confirmar-inicio").hidden = true;
        $("jja-iniciar").hidden = false;
        $("mobile-action-start").hidden = false;
      }
    });
    const abrirConfiguracaoInicial = () => {
      const painel = $("configuracao-jogador");
      if (painel) {
        painel.open = true;
        painel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      $("jja-iniciar").hidden = true;
      $("mobile-action-start").hidden = true;
      $("jja-confirmar-inicio").hidden = false;
    };
    $("jja-iniciar")?.addEventListener("click", () => {
      const carreiraAtual =
        typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
      const historicoAtual = obterHistoricoCarreira(carreiraAtual);
      if (
        !estado &&
        (!historicoAtual.length ||
          carreiraEncerrada(carreiraAtual, historicoAtual))
      ) {
        abrirConfiguracaoInicial();
        return;
      }
      iniciarOuAvancar();
    });
    $("jja-confirmar-inicio")?.addEventListener("click", async () => {
      await iniciarOuAvancar();
      if (estado) {
        const painel = $("configuracao-jogador");
        if (painel) painel.open = false;
        $("jja-confirmar-inicio").hidden = true;
        const carreiraAtual =
          typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
        $("jja-iniciar").hidden = temporadaEmAndamento(carreiraAtual);
      }
    });
    $("jja-aposentar")?.addEventListener("click", aposentarJogador);
    $("jja-fim-encerrar")?.addEventListener("click", () =>
      finalizarFluxoFimCarreira(),
    );
    $("jja-fim-resumo")?.addEventListener("click", () => {
      $("jja-modal-fim-carreira").hidden = true;
      $("resumo-final").hidden = false;
      $("resultados").hidden = true;
      const carreira =
        typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
      carreira.nome = "";
      carreira.posicao = "";
      carreira.posicaoDetalhe = "";
      carreira.nacionalidade = "";
      carreira.baseClube = "";
      carreira.clubeAlvo = "";
      if (typeof salvarCarreiraAtual === "function")
        salvarCarreiraAtual(carreira);
      estado = null;
      try {
        localStorage.removeItem(KEY);
      } catch (erro) {
        console.warn("Não foi possível limpar o progresso finalizado:", erro);
      }
      $("resumo-final").scrollIntoView({ behavior: "smooth", block: "start" });
      limparCamposConfiguracao();
      renderizar();
    });
    if (estado) {
      estado.trofeusClube = estado.trofeusClube || [];
      estado.trofeusSelecao = estado.trofeusSelecao || [];
      renderizar();
      informar(
        estado.salvaOficialmente
          ? `Temporada ${estado.ano} registrada no Histórico oficial.`
          : "Progresso jogo a jogo recuperado do armazenamento local.",
      );
    } else renderizar();
    if (
      carreiraEncerrada(carreira, historicoCarreira) &&
      typeof mostrarResumoFinal === "function"
    ) {
      const temporadaFinal = historicoCarreira[historicoCarreira.length - 1];
      mostrarResumoFinal(
        carreira.nome || temporadaFinal.nome,
        carreira.idadeLimite || temporadaFinal.idade,
        temporadaFinal.ano,
        historicoCarreira,
        temporadaFinal.posicao,
      );
      abrirModalFimCarreira();
    }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", inicializar);
  else inicializar();

  /* ============================================================
       API DE DESENVOLVIMENTO (FootMain Dev Tools)
       Ativada apenas quando js/dev-tools.js define window.__FOOTMAIN_DEV__ = true
       (via ?dev=1 na URL). Nada é exposto em produção.
       ============================================================ */
  if (window.__FOOTMAIN_DEV__) {
    window.FMD = {
      // ---- Estado ----
      getEstado: () => estado,
      setEstado: (novo) => {
        estado = novo;
        salvar();
        renderizar();
      },
      salvar: () => salvar(),
      carregar: () => carregar(),
      renderizar: () => renderizar(),
      prepararElencosLiga: () => prepararElencosLiga(),
      gerarEventosIndividuaisLiga: (...args) =>
        gerarEventosIndividuaisLiga(...args),
      obterRankingsLiga: () => obterRankingsLiga(),

      // ---- Simulação ----
      simularPartida: (
        indice,
        mostrar = false,
        interacao = null,
        opcoes = null,
      ) => simularPartida(indice, mostrar, interacao, opcoes),
      simularRestantesAuto: () => simularRestantes(true, false),

      async simularFimCarreiraAuto() {
        const original = window.confirmarAcao;
        window.confirmarAcao = async () => true;
        try {
          return await simularFimCarreira();
        } finally {
          window.confirmarAcao = original;
        }
      },

      // ---- Penalidades ----
      forcarEmpateProximoMataMata: () => {
        window.__footmainDevForcarPenaltis = true;
      },

      async irParaProximoMataMata() {
        if (!estado)
          return {
            ok: false,
            msg: "Nenhuma carreira ativa. Crie uma carreira de teste primeiro.",
          };
        for (let tentativa = 0; tentativa < 300; tentativa++) {
          const idx = estado.partidas.findIndex(
            (p) =>
              p.status === "agendada" &&
              (p.tipo === "mata-mata" || (p.tipo === "selecao" && p.fase)),
          );
          if (idx < 0)
            return {
              ok: false,
              msg: "Não há mais mata-mata nesta temporada. Use 'Simular carreira' para avançar.",
            };

          let simulou = 0;
          while (true) {
            const nextIdx = estado.partidas.findIndex(
              (p) => p.status === "agendada",
            );
            if (nextIdx < 0 || nextIdx === idx) break;
            await simularPartida(nextIdx, false, null, { interativo: false });
            simulou++;
          }
          if (estado.partidas[idx]?.status === "agendada") {
            const p = estado.partidas[idx];
            return {
              ok: true,
              msg: `Chegamos ao ${p.competicao} (fase ${p.fase}/${p.totalFases}). ${simulou} jogo(s) simulado(s).`,
            };
          }
        }
        return {
          ok: false,
          msg: "Não foi possível chegar a um mata-mata (limite de tentativas).",
        };
      },

      animarPenaltisMock(resultado = null) {
        const mock = resultado || {
          cobrancas: [
            { time: "casa", gol: true, jogador: true },
            { time: "fora", gol: true, jogador: false },
            { time: "casa", gol: true, jogador: false },
            { time: "fora", gol: false, jogador: false },
            { time: "casa", gol: false, jogador: false },
            { time: "fora", gol: true, jogador: false },
            { time: "casa", gol: true, jogador: false },
            { time: "fora", gol: true, jogador: false },
            { time: "casa", gol: true, jogador: false },
            { time: "fora", gol: false, jogador: false },
          ],
          golsCasa: 5,
          golsFora: 3,
          vencedor: "casa",
          vencedorCasa: true,
        };
        return animarDisputaPenaltis(
          mock,
          { nome: "Time do Jogador" },
          { nome: "Adversário FC" },
          true,
        );
      },

      // ---- Setup rápido ----
      criarCarreiraTesteRapida: (opcoes) => criarCarreiraTesteRapida(opcoes),

      async iniciarAuto() {
        const origEscolher = window.escolherContratoParaTemporada;
        const origAcao = window.escolherAcaoContrato;
        window.escolherAcaoContrato = async () => "manter";
        window.escolherContratoParaTemporada = async (
          clubeAtual,
          temporadaInicial,
          idade,
          idadeLimite,
          carreira,
        ) => {
          if (carreira.clube) {
            return {
              clube: carreira.clube,
              anosContrato: Math.max(1, Math.min(2, idadeLimite - idade + 1)),
              rompeContrato: false,
              salarioProposto: carreira.salarioAtual || 500000,
              valorMercado: 0,
            };
          }
          const lista = clubesDisponiveis();
          const clubeFallback = lista[Math.floor(Math.random() * lista.length)];
          return {
            clube: clubeFallback.id,
            anosContrato: 2,
            rompeContrato: false,
            salarioProposto: 500000,
            valorMercado: 0,
          };
        };
        try {
          return await iniciar();
        } finally {
          window.escolherContratoParaTemporada = origEscolher;
          window.escolherAcaoContrato = origAcao;
        }
      },
    };
    console.info(
      "[FootMain Dev] API exposta em window.FMD. Painel: botão 🛠️ no canto inferior direito.",
    );
  }
})();
