(function (root) {
  "use strict";

  function contarHatTricks(temporadas) {
    return temporadas.reduce(
      (total, temporada) =>
        total +
        (Array.isArray(temporada.eventos)
          ? temporada.eventos.filter((evento) => evento.tipo === "hat-trick")
              .length
          : 0),
      0,
    );
  }

  function obterPontuacaoTemporada(temporada) {
    const trofeusColetivos = Array.isArray(temporada.trofeusColetivos)
      ? temporada.trofeusColetivos
      : [];
    const trofeusIndividuais = Array.isArray(temporada.trofeusIndividuais)
      ? temporada.trofeusIndividuais
      : [];
    const premios = trofeusColetivos.length + trofeusIndividuais.length;

    return (
      (Number(temporada.gols) || 0) * 3 +
      (Number(temporada.assistencias) || 0) * 2 +
      premios * 5 +
      (Number(temporada.jogos) || 0) +
      trofeusColetivos.length * 12 +
      trofeusIndividuais.length * 15
    );
  }

  function maiorPorCampo(itens, campo) {
    return itens.reduce(
      (melhor, item) =>
        !melhor || item[campo] > melhor[campo] ? item : melhor,
      null,
    );
  }

  function calcularRecordes(carreiras) {
    if (!Array.isArray(carreiras)) {
      throw new TypeError("A lista de carreiras deve ser um array.");
    }

    const temporadasDeTodas = [];
    const carreirasComMetricas = carreiras.map((carreira) => {
      const temporadas = Array.isArray(carreira.temporadas)
        ? carreira.temporadas
        : [];
      const temporadasCarreira = temporadas.map((temporada) => {
        const trofeusColetivos = Array.isArray(temporada.trofeusColetivos)
          ? temporada.trofeusColetivos
          : [];
        const trofeusIndividuais = Array.isArray(temporada.trofeusIndividuais)
          ? temporada.trofeusIndividuais
          : [];
        const temporadaComRecordes = {
          carreiraNome: carreira.nome,
          ano: temporada.ano,
          gols: Number(temporada.gols) || 0,
          assistencias: Number(temporada.assistencias) || 0,
          hatTricksTemporada: contarHatTricks([temporada]),
          pontosTemporada: obterPontuacaoTemporada(temporada),
          titulosTemporada: trofeusColetivos.length + trofeusIndividuais.length,
        };
        temporadasDeTodas.push(temporadaComRecordes);
        return temporada;
      });

      return {
        nome: carreira.nome,
        gols: Number(carreira.gols) || 0,
        hatTricksCarreira: contarHatTricks(temporadasCarreira),
        maiorOver: Math.max(
          0,
          ...temporadasCarreira.map(
            (temporada) => Number(temporada.overall) || 0,
          ),
        ),
      };
    });

    return [
      {
        nome: "Mais gols em uma temporada",
        campo: "gols",
        sufixo: "gols",
        melhor: maiorPorCampo(temporadasDeTodas, "gols"),
      },
      {
        nome: "Mais assistências em uma temporada",
        campo: "assistencias",
        sufixo: "assistências",
        melhor: maiorPorCampo(temporadasDeTodas, "assistencias"),
      },
      {
        nome: "Mais títulos em uma temporada",
        campo: "titulosTemporada",
        sufixo: "títulos",
        melhor: maiorPorCampo(temporadasDeTodas, "titulosTemporada"),
      },
      {
        nome: "Maior pontuação em uma temporada",
        campo: "pontosTemporada",
        sufixo: "pontos",
        melhor: maiorPorCampo(temporadasDeTodas, "pontosTemporada"),
      },
      {
        nome: "Mais hat-tricks em uma temporada",
        campo: "hatTricksTemporada",
        sufixo: "hat-tricks",
        melhor: maiorPorCampo(temporadasDeTodas, "hatTricksTemporada"),
      },
      {
        nome: "Carreira com mais hat-tricks",
        campo: "hatTricksCarreira",
        sufixo: "hat-tricks",
        melhor: maiorPorCampo(carreirasComMetricas, "hatTricksCarreira"),
        carreira: true,
      },
      {
        nome: "Carreira com maior Over",
        campo: "maiorOver",
        sufixo: "Over",
        melhor: maiorPorCampo(carreirasComMetricas, "maiorOver"),
        carreira: true,
      },
      {
        nome: "Carreira com mais gols",
        campo: "gols",
        sufixo: "gols",
        melhor: maiorPorCampo(carreirasComMetricas, "gols"),
        carreira: true,
      },
    ];
  }

  root.FootMainCareerAnalysis = Object.freeze({ calcularRecordes });
})(typeof self === "undefined" ? globalThis : self);
