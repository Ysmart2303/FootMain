const STORAGE_KEY = "footmain_temporadas";
const STORAGE_KEY_RANKING = "footmain_ranking";
const ANO_INICIAL = 2026;
const IDADE_LIMITE_PADRAO = 40;

const posicoes = {
    ata: {
        nome: "Atacante",
        jogos: [[45, 53], [54, 62], [63, 70]],
        gols: [[5, 40], [41, 80], [81, 100]],
        assistencias: [[4, 14], [15, 24], [25, 35]]
    },
    me: {
        nome: "Meio Campo",
        jogos: [[40, 45], [46, 50], [51, 55]],
        gols: [[3, 16], [17, 30], [31, 45]],
        assistencias: [[7, 21], [22, 35], [36, 50]]
    },
    zag: {
        nome: "Zagueiro",
        jogos: [[40, 45], [46, 50], [51, 55]],
        gols: [[0, 5], [6, 10], [11, 15]],
        assistencias: [[1, 7], [8, 14], [15, 20]]
    },
    go: {
        nome: "Goleiro",
        jogos: [[22, 34], [35, 47], [48, 60]],
        gols: [[0, 8], [9, 17], [18, 25]],
        assistencias: [[1, 2], [3, 4], [5, 10]]
    }
};

function sortearIndicePonderado(pesos) {
    const pesoTotal = pesos.reduce((total, peso) => total + peso, 0);
    let sorteio = Math.random() * pesoTotal;

    for (let indice = 0; indice < pesos.length; indice++) {
        if (sorteio < pesos[indice]) {
            return indice;
        }

        sorteio -= pesos[indice];
    }

    throw new Error("Não foi possível sortear um subconjunto.");
}

function sortearValorPorSubconjunto(subconjuntos) {
    const pesosSubconjuntos = subconjuntos.map((_, indice) => (subconjuntos.length - indice) ** 2);
    const indiceSorteado = sortearIndicePonderado(pesosSubconjuntos);
    const [min, max] = subconjuntos[indiceSorteado];
    const quantidade = max - min + 1;
    const pesoTotal = (quantidade * (quantidade + 1)) / 2;
    let sorteio = Math.random() * pesoTotal;

    for (let valor = min; valor <= max; valor++) {
        const peso = max - valor + 1;
        if (sorteio < peso) {
            return valor;
        }

        sorteio -= peso;
    }

    throw new Error("Não foi possível sortear um valor do subconjunto.");
}

function lerHistorico() {
    const historico = localStorage.getItem(STORAGE_KEY);
    return historico ? JSON.parse(historico) : [];
}

function salvarHistorico(historico) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historico));
}

function gerarIdRanking() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `ranking-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizarRanking(ranking) {
    if (!Array.isArray(ranking)) {
        return [];
    }

    return ranking.map((carreira) => ({
        ...carreira,
        id: carreira.id || gerarIdRanking()
    }));
}

function lerRanking() {
    const ranking = localStorage.getItem(STORAGE_KEY_RANKING);
    if (!ranking) {
        return [];
    }

    try {
        return normalizarRanking(JSON.parse(ranking));
    } catch (erro) {
        console.error("Erro ao ler o ranking armazenado:", erro);
        return [];
    }
}

function salvarRanking(ranking) {
    localStorage.setItem(STORAGE_KEY_RANKING, JSON.stringify(normalizarRanking(ranking)));
}

function removerItemRanking(id) {
    const rankingAtual = lerRanking();
    const rankingFiltrado = rankingAtual.filter((carreira) => String(carreira.id) !== String(id));

    salvarRanking(rankingFiltrado);
    renderRanking();
}

function calcularPontuacao(carreira) {
    const trofeusColetivos = Array.isArray(carreira.trofeusColetivos) ? carreira.trofeusColetivos.length : 0;
    const trofeusIndividuais = Array.isArray(carreira.trofeusIndividuais) ? carreira.trofeusIndividuais.length : 0;

    return (
        Number(carreira.gols || 0) * 3 +
        Number(carreira.assistencias || 0) * 2 +
        Number(carreira.premios || 0) * 5 +
        Number(carreira.jogos || 0) +
        trofeusColetivos * 12 +
        trofeusIndividuais * 15
    );
}

function sortearPremio(chance) {
    return Math.random() < chance;
}

function gerarTrofeusTemporada(posicao, jogos, gols, assistencias, ano) {
    const trofeusColetivos = [];
    const trofeusIndividuais = [];
    const temporadaAtual = Number(ano) || ANO_INICIAL;
    const cicloCopaDoMundo = (temporadaAtual - ANO_INICIAL) % 4 === 0;

    if (jogos >= 35 && sortearPremio(0.18)) trofeusColetivos.push("Copa Continental");
    if (jogos >= 30 && sortearPremio(0.28)) trofeusColetivos.push("Liga Nacional");
    if (jogos >= 25 && sortearPremio(0.22)) trofeusColetivos.push("Copa Nacional");
    if (jogos >= 35 && cicloCopaDoMundo && sortearPremio(0.12)) trofeusColetivos.push("Copa do Mundo");

    if (posicao !== "Goleiro" && trofeusColetivos.length > 0 && (gols >= 20 || assistencias >= 15 || gols + assistencias >= 25) && sortearPremio(0.12)) {
        trofeusIndividuais.push("Bola de Ouro");
    }

    if (gols > jogos && sortearPremio(0.2)) {
        trofeusIndividuais.push("Chuteira de Ouro");
    }

    if (posicao === "Goleiro" && jogos >= 30 && sortearPremio(0.18)) {
        trofeusIndividuais.push("Luva de Ouro");
    }

    return { trofeusColetivos, trofeusIndividuais };
}

function formatarTrofeus(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
        return "Nenhum";
    }

    const contagem = lista.reduce((acumulador, trofeu) => {
        acumulador[trofeu] = (acumulador[trofeu] || 0) + 1;
        return acumulador;
    }, {});

    return Object.entries(contagem)
        .map(([trofeu, quantidade]) => `${quantidade}x ${trofeu}`)
        .join(", ");
}

function contarPremios(temporada) {
    const trofeusColetivos = Array.isArray(temporada.trofeusColetivos) ? temporada.trofeusColetivos.length : 0;
    const trofeusIndividuais = Array.isArray(temporada.trofeusIndividuais) ? temporada.trofeusIndividuais.length : 0;

    return trofeusColetivos + trofeusIndividuais;
}

function renderRanking() {
    const listaRanking = document.getElementById("lista-ranking");
    const filtroRanking = document.getElementById("filtro-ranking");

    if (!listaRanking) return;

    const criterio = filtroRanking?.value || "pontuacao";
    const ranking = lerRanking()
        .sort((a, b) => (Number(b[criterio]) || 0) - (Number(a[criterio]) || 0))
        .slice(0, 5);

    if (ranking.length === 0) {
        listaRanking.innerHTML = "<li>Nenhuma carreira finalizada ainda.</li>";
        return;
    }

    listaRanking.innerHTML = ranking
        .map((carreira, index) => {
            const trofeusColetivos = Array.isArray(carreira.trofeusColetivos) ? carreira.trofeusColetivos : [];
            const trofeusIndividuais = Array.isArray(carreira.trofeusIndividuais) ? carreira.trofeusIndividuais : [];
            const premios = contarPremios(carreira);

            const trofeusHtml = [
                ...(trofeusColetivos.length
                    ? [
                          `<span class="ranking-trofeu coletivo">${formatarTrofeus(trofeusColetivos)}</span>`
                      ]
                    : []),
                ...(trofeusIndividuais.length
                    ? [
                          `<span class="ranking-trofeu individual">${formatarTrofeus(trofeusIndividuais)}</span>`
                      ]
                    : [])
            ];

            const conteudoTrofeus = trofeusHtml.length
                ? trofeusHtml.join("")
                : '<span class="ranking-trofeu coletivo">Nenhum</span>';

            const medalha = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "#";
            const classeTop = index === 0 ? "top-1" : index === 1 ? "top-2" : index === 2 ? "top-3" : "";

            return `
                <li class="${classeTop}">
                    <span class="rank-medal">${medalha}</span>
                    <strong>#${index + 1} - ${carreira.nome}</strong>
                    <p>Posição: ${carreira.posicao} | Pontuação: ${carreira.pontuacao}</p>
                    <p>Jogos: ${carreira.jogos} | Gols: ${carreira.gols} | Assistências: ${carreira.assistencias} | Prêmios: ${premios}</p>
                    <div class="ranking-trofeus">${conteudoTrofeus}</div>
                    <small>Idade limite: ${carreira.idadeLimite} anos</small>
                    <button type="button" class="remover-ranking" data-id="${carreira.id || ""}" aria-label="Apagar ${carreira.nome} do ranking">Apagar</button>
                </li>
            `;
        })
        .join("");
}

function proximoAno(historico = lerHistorico()) {
    if (historico.length === 0) {
        return ANO_INICIAL;
    }

    const maioresAnos = historico.map((temporada) => Number(temporada.ano) || ANO_INICIAL);
    return Math.max(...maioresAnos) + 1;
}

function atualizarResumoJogador(nome, idade, ano) {
    const perfilNome = document.getElementById("perfil-nome");
    const perfilIdade = document.getElementById("perfil-idade");
    const perfilAno = document.getElementById("perfil-ano");

    if (perfilNome) perfilNome.textContent = nome || "Jogador";
    if (perfilIdade) perfilIdade.textContent = idade ?? 0;
    if (perfilAno) perfilAno.textContent = ano ?? ANO_INICIAL;
}

function renderHistorico() {
    const lista = document.getElementById("lista-temporadas");
    const filtroHistorico = document.getElementById("filtro-historico");
    const criterio = filtroHistorico?.value || "ordem";
    const historico = lerHistorico();

    if (!lista) return;

    if (historico.length === 0) {
        lista.innerHTML = "<li>Nenhuma temporada salva ainda.</li>";
        return;
    }

    const temporadas = criterio === "ordem"
        ? historico
        : historico.slice().sort((a, b) => {
              const valorA = criterio === "premios" ? contarPremios(a) : Number(a[criterio]) || 0;
              const valorB = criterio === "premios" ? contarPremios(b) : Number(b[criterio]) || 0;
              return valorB - valorA;
          });

    lista.innerHTML = temporadas
        .map((temporada) => {
            const trofeusColetivos = Array.isArray(temporada.trofeusColetivos) ? temporada.trofeusColetivos : [];
            const trofeusIndividuais = Array.isArray(temporada.trofeusIndividuais) ? temporada.trofeusIndividuais : [];
            const premios = contarPremios(temporada);

            const renderTrofeus = (trofeus) => {
                if (!trofeus.length) {
                    return '<span class="titulo-tag">Nenhum</span>';
                }

                return trofeus
                    .map((trofeu) => `<span class="titulo-tag">${trofeu}</span>`)
                    .join("");
            };

            return `
                <li>
                    <strong>Temporada ${temporada.ano}</strong>
                    <span> - ${temporada.posicao}</span>
                    <p>Jogador: ${temporada.nome} | Idade: ${temporada.idade} anos</p>
                    <p>Jogos: ${temporada.jogos} | Gols: ${temporada.gols} | Assistências: ${temporada.assistencias} | Prêmios: ${premios}</p>
                    <p class="titulo-categoria">Títulos coletivos:</p>
                    <div class="titulo-tags">${renderTrofeus(trofeusColetivos)}</div>
                    <p class="titulo-categoria">Títulos individuais:</p>
                    <div class="titulo-tags">${renderTrofeus(trofeusIndividuais)}</div>
                    <small>${temporada.data}</small>
                </li>
            `;
        })
        .join("");
}

function proximaIdade(historico = lerHistorico()) {
    if (historico.length === 0) {
        const idadeInicial = Number(document.getElementById("idade").value) || 0;
        return idadeInicial;
    }

    const ultimaIdade = Number(historico[historico.length - 1].idade) || 0;
    return ultimaIdade + 1;
}

function obterIdadeLimite() {
    const idadeLimiteInput = document.getElementById("idade-limite");
    const valor = Number(idadeLimiteInput ? idadeLimiteInput.value : "");

    if (!Number.isFinite(valor) || valor <= 0) {
        return IDADE_LIMITE_PADRAO;
    }

    return Math.floor(valor);
}

function somarTotaisHistorico(historico) {
    return historico.reduce(
        (acumulador, temporada) => {
            acumulador.jogos += Number(temporada.jogos) || 0;
            acumulador.gols += Number(temporada.gols) || 0;
            acumulador.assistencias += Number(temporada.assistencias) || 0;
            acumulador.premios += contarPremios(temporada);
            return acumulador;
        },
        { jogos: 0, gols: 0, assistencias: 0, premios: 0 }
    );
}

function mostrarResumoFinal(nome, idadeLimite, anoAtual, historico, posicao) {
    const totais = somarTotaisHistorico(historico);
    const resumoFinal = document.getElementById("resumo-final");

    const trofeus = historico.reduce(
        (resultado, temporada) => {
            resultado.coletivos.push(...(Array.isArray(temporada.trofeusColetivos) ? temporada.trofeusColetivos : []));
            resultado.individuais.push(...(Array.isArray(temporada.trofeusIndividuais) ? temporada.trofeusIndividuais : []));
            return resultado;
        },
        { coletivos: [], individuais: [] }
    );

    const carreira = {
        id: gerarIdRanking(),
        nome,
        posicao: posicao || "-",
        idadeLimite,
        jogos: totais.jogos,
        gols: totais.gols,
        assistencias: totais.assistencias,
        premios: totais.premios,
        trofeusColetivos: trofeus.coletivos,
        trofeusIndividuais: trofeus.individuais,
        pontuacao: 0,
        data: new Date().toLocaleString("pt-BR")
    };

    carreira.pontuacao = calcularPontuacao(carreira);

    document.getElementById("nome").value = nome;
    document.getElementById("idade").value = idadeLimite;
    atualizarResumoJogador(nome, idadeLimite, anoAtual);

    document.getElementById("jogos").textContent = totais.jogos;
    document.getElementById("gols").textContent = totais.gols;
    document.getElementById("assi").textContent = totais.assistencias;
    document.getElementById("prem").textContent = totais.premios;

    document.getElementById("resumo-nome").textContent = nome;
    document.getElementById("resumo-posicao").textContent = posicao || "-";
    document.getElementById("resumo-idade-limite").textContent = idadeLimite;
    document.getElementById("resumo-jogos").textContent = totais.jogos;
    document.getElementById("resumo-gols").textContent = totais.gols;
    document.getElementById("resumo-assistencias").textContent = totais.assistencias;
    document.getElementById("resumo-premios").textContent = totais.premios;
    document.getElementById("resumo-coletivos").textContent = formatarTrofeus(trofeus.coletivos);
    document.getElementById("resumo-individuais").textContent = formatarTrofeus(trofeus.individuais);

    const rankingAtual = lerRanking();
    rankingAtual.push(carreira);
    salvarRanking(rankingAtual);
    renderRanking();

    if (resumoFinal) {
        resumoFinal.hidden = false;
    }
}

function obterNomeAtual() {
    const nomeDigitado = document.getElementById("nome").value.trim();

    if (nomeDigitado) {
        return nomeDigitado;
    }

    const historico = lerHistorico();
    if (historico.length > 0) {
        return historico[historico.length - 1].nome || "Jogador";
    }

    return "Jogador";
}

function obterHistoricoDaCarreira(nome, dadosPosicao) {
    const historico = lerHistorico();
    const pertenceACarreiraAtual = historico.every(
        (temporada) => temporada.nome === nome && temporada.posicao === dadosPosicao.nome
    );

    return pertenceACarreiraAtual ? historico : [];
}

function criarTemporada(nome, idade, ano, posicao) {
    const dados = posicoes[posicao];
    const jogos = sortearValorPorSubconjunto(dados.jogos);
    const gols = sortearValorPorSubconjunto(dados.gols);
    const assistencias = sortearValorPorSubconjunto(dados.assistencias);
    const trofeus = gerarTrofeusTemporada(dados.nome, jogos, gols, assistencias, ano);

    return {
        nome,
        idade,
        posicao: dados.nome,
        ano,
        jogos,
        gols,
        assistencias,
        trofeusColetivos: trofeus.trofeusColetivos,
        trofeusIndividuais: trofeus.trofeusIndividuais,
        data: new Date().toLocaleString("pt-BR")
    };
}

function gerar() {
    const posicaoSelecionada = document.querySelector('input[name="posicao"]:checked');
    const resumoFinal = document.getElementById("resumo-final");

    if (resumoFinal) {
        resumoFinal.hidden = true;
    }

    if (!posicaoSelecionada) {
        alert("Selecione uma posição antes de gerar o jogador.");
        return;
    }

    const nome = obterNomeAtual();
    const dadosPosicao = posicoes[posicaoSelecionada.id];
    const historicoAnterior = lerHistorico();
    const historico = obterHistoricoDaCarreira(nome, dadosPosicao);
    const idadeLimite = obterIdadeLimite();
    const idadeInput = document.getElementById("idade");
    const idadeInformada = Number(idadeInput.value) || 0;
    const identidadeMudou = historicoAnterior.length > 0 && historico.length === 0;
    const ultimaIdadeAnterior = Number(historicoAnterior[historicoAnterior.length - 1]?.idade) || 0;
    if (
        (identidadeMudou && idadeInformada === ultimaIdadeAnterior) ||
        (historico.length === 0 && idadeInformada >= idadeLimite)
    ) {
        idadeInput.value = "0";
    }
    const idade = proximaIdade(historico);
    const ano = proximoAno(historico);

    if (idade >= idadeLimite) {
        mostrarResumoFinal(nome, idadeLimite, ano, historico, posicoes[posicaoSelecionada.id].nome);
        return;
    }

    document.getElementById("nome").value = nome;
    document.getElementById("idade").value = idade;
    atualizarResumoJogador(nome, idade, ano);

    const temporada = criarTemporada(nome, idade, ano, posicaoSelecionada.id);

    document.getElementById("jogos").textContent = temporada.jogos;
    document.getElementById("gols").textContent = temporada.gols;
    document.getElementById("assi").textContent = temporada.assistencias;
    document.getElementById("prem").textContent = contarPremios(temporada);

    historico.push(temporada);
    salvarHistorico(historico);
    renderHistorico();
}

function simularTudo() {
    const posicaoSelecionada = document.querySelector('input[name="posicao"]:checked');
    const resumoFinal = document.getElementById("resumo-final");

    if (resumoFinal) {
        resumoFinal.hidden = true;
    }

    if (!posicaoSelecionada) {
        alert("Selecione uma posição antes de simular a carreira completa.");
        return;
    }

    const nome = obterNomeAtual();
    const dadosPosicao = posicoes[posicaoSelecionada.id];
    const idadeLimite = obterIdadeLimite();
    const historicoAnterior = lerHistorico();
    let historico = obterHistoricoDaCarreira(nome, dadosPosicao);
    const idadeInput = document.getElementById("idade");
    let idadeInicial = Number(idadeInput.value) || 0;
    const identidadeMudou = historicoAnterior.length > 0 && historico.length === 0;
    const ultimaIdadeAnterior = Number(historicoAnterior[historicoAnterior.length - 1]?.idade) || 0;

    if (
        (identidadeMudou && idadeInicial === ultimaIdadeAnterior) ||
        (historico.length === 0 && idadeInicial >= idadeLimite)
    ) {
        idadeInicial = 0;
    }

    if (historico.length > 0) {
        const ultimaIdade = Number(historico[historico.length - 1].idade) || 0;
        if (ultimaIdade + 1 >= idadeLimite) {
            historico = [];
            if (idadeInicial >= idadeLimite) {
                idadeInicial = 0;
            }
        }
    }

    let idade = historico.length === 0 ? idadeInicial : Number(historico[historico.length - 1].idade) + 1;
    let ano = historico.length === 0 ? ANO_INICIAL : Math.max(...historico.map((temporada) => Number(temporada.ano) || ANO_INICIAL)) + 1;

    while (idade < idadeLimite) {
        historico.push(criarTemporada(nome, idade, ano, posicaoSelecionada.id));
        idade = historico.length === 0 ? Number(document.getElementById("idade").value) || 0 : Number(historico[historico.length - 1].idade) + 1;
        ano = historico.length === 0 ? ANO_INICIAL : Math.max(...historico.map((temporada) => Number(temporada.ano) || ANO_INICIAL)) + 1;
    }

    salvarHistorico(historico);
    renderHistorico();
    mostrarResumoFinal(nome, idadeLimite, ano, historico, posicoes[posicaoSelecionada.id].nome);
}

function limparHistorico() {
    localStorage.removeItem(STORAGE_KEY);
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "0";
    document.getElementById("idade-limite").value = IDADE_LIMITE_PADRAO;
    atualizarResumoJogador("Jogador", 0, ANO_INICIAL);
    renderHistorico();
}

function limparRanking() {
    localStorage.removeItem(STORAGE_KEY_RANKING);
    renderRanking();
}

document.addEventListener("DOMContentLoaded", () => {
    const botaoLimpar = document.getElementById("limparHistorico");
    const botaoLimparRanking = document.getElementById("limparRanking");
    const listaRanking = document.getElementById("lista-ranking");
    const filtroRanking = document.getElementById("filtro-ranking");
    const filtroHistorico = document.getElementById("filtro-historico");

    if (botaoLimpar) {
        botaoLimpar.addEventListener("click", limparHistorico);
    }

    if (botaoLimparRanking) {
        botaoLimparRanking.addEventListener("click", limparRanking);
    }

    if (filtroHistorico) {
        filtroHistorico.addEventListener("change", renderHistorico);
    }

    if (filtroRanking) {
        filtroRanking.addEventListener("change", renderRanking);
    }

    if (listaRanking) {
        listaRanking.addEventListener("click", (evento) => {
            const botaoRemover = evento.target.closest(".remover-ranking");

            if (!botaoRemover) {
                return;
            }

            const { id } = botaoRemover.dataset;

            if (!id) {
                return;
            }

            removerItemRanking(id);
        });
    }

    const idadeLimiteInput = document.getElementById("idade-limite");
    if (idadeLimiteInput && !idadeLimiteInput.value) {
        idadeLimiteInput.value = IDADE_LIMITE_PADRAO;
    }

    const idadeInicial = Number(document.getElementById("idade").value) || 0;
    atualizarResumoJogador("Jogador", idadeInicial, ANO_INICIAL);
    renderHistorico();
    renderRanking();
});