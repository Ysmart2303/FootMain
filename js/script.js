const STORAGE_KEY = "footmain_temporadas";
const STORAGE_KEY_RANKING = "footmain_ranking";
const ANO_BASE_COPA_DO_MUNDO_SELECOES = 2026;
const CICLO_COPA_DO_MUNDO_SELECOES = 4;
const STORAGE_KEY_CARREIRA_ATUAL = "footmain_carreira_atual";
const REGIOES_SELECOES = {
    africa: "África",
    americaNorte: "América do Norte",
    americaSul: "América do Sul",
    asia: "Ásia",
    europa: "Europa",
    oceania: "Oceania"
};

const OVERALL_PADRAO = 50;

/* ========== Competições secundárias e estaduais ========== */

const ESTADUAIS_BRASIL = {
    flamengo: "Carioca", fluminense: "Carioca", vasco: "Carioca", botafogo: "Carioca",
    corinthians: "Paulistão", palmeiras: "Paulistão", "sao-paulo": "Paulistão", santos: "Paulistão",
    bragantino: "Paulistão", mirassol: "Paulistão",
    gremio: "Gauchão", internacional: "Gauchão", juventude: "Gauchão",
    "atletico-mg": "Mineiro", cruzeiro: "Mineiro",
    bahia: "Baianão", vitoria: "Baianão",
    sport: "Pernambucano",
    fortaleza: "Cearense", ceara: "Cearense"
};

const LIGAS_EUROPA_FORTES = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"];
const LIGAS_EUROPA_MEDIAS = ["Primeira Liga", "Eredivisie", "Süper Lig", "Belgian Pro League",
    "Scottish Premiership", "Swiss Super League", "Austrian Bundesliga",
    "Russian Premier League", "Ukrainian Premier League", "Greek Super League"];
const LIGAS_SUL_AMERICANAS = ["Brasileirão", "Argentine Primera División", "Colombian Primera A",
    "Chilean Primera División", "Uruguayan Primera División",
    "Ecuadorian Serie A", "Paraguayan Primera División"];

function obterPosicaoClubeNaLiga(clubeId) {
    const clube = obterClube(clubeId);
    if (!clube) return 99;
    const cfg = getConfig();
    const clubesLiga = CLUBES
        .filter((c) => c.liga === clube.liga)
        .map((c) => ({ id: c.id, forca: Number(cfg.clubes?.potencias?.[c.id]) || 60 }))
        .sort((a, b) => b.forca - a.forca);
    return Math.max(0, clubesLiga.findIndex((c) => c.id === clubeId));
}

function determinarCompeticaoContinental(clubeId) {
    const clube = obterClube(clubeId);
    if (!clube) return { principal: null, secundaria: null };
    const posicao = obterPosicaoClubeNaLiga(clubeId);
    const liga = clube.liga;

    if (LIGAS_EUROPA_FORTES.includes(liga)) {
        if (posicao < 4) return { principal: "Champions League", secundaria: null };
        if (posicao < 8) return { principal: null, secundaria: "Europa League" };
        if (posicao < 12) return { principal: null, secundaria: "Conference League" };
        return { principal: null, secundaria: null };
    }
    if (LIGAS_EUROPA_MEDIAS.includes(liga)) {
        if (posicao < 2) return { principal: "Champions League", secundaria: null };
        if (posicao < 4) return { principal: null, secundaria: "Europa League" };
        if (posicao < 6) return { principal: null, secundaria: "Conference League" };
        return { principal: null, secundaria: null };
    }
    if (liga === "Brasileirão") {
        if (posicao < 6) return { principal: "Libertadores", secundaria: null };
        if (posicao < 12) return { principal: null, secundaria: "Copa Sul-Americana" };
        return { principal: null, secundaria: null };
    }
    if (LIGAS_SUL_AMERICANAS.includes(liga)) {
        if (posicao < 4) return { principal: "Libertadores", secundaria: null };
        if (posicao < 8) return { principal: null, secundaria: "Copa Sul-Americana" };
        return { principal: null, secundaria: null };
    }
    if (liga === "MLS" || liga === "Liga MX") {
        if (posicao < 4) return { principal: "CONCACAF Champions Cup", secundaria: null };
        return { principal: null, secundaria: null };
    }
    if (["Saudi Pro League", "J1 League", "K League 1", "Chinese Super League"].includes(liga)) {
        if (posicao < 3) return { principal: "AFC Champions League", secundaria: null };
        if (posicao < 6) return { principal: null, secundaria: "AFC Champions League 2" };
        return { principal: null, secundaria: null };
    }
    if (["Egyptian Premier League", "South African Premier Division", "Moroccan Botola"].includes(liga)) {
        if (posicao < 2) return { principal: "CAF Champions League", secundaria: null };
        if (posicao < 5) return { principal: null, secundaria: "CAF Confederation Cup" };
        return { principal: null, secundaria: null };
    }
    if (liga === "Australian A-League") {
        if (posicao < 2) return { principal: "AFC Champions League", secundaria: null };
        return { principal: null, secundaria: "AFC Champions League 2" };
    }
    return { principal: null, secundaria: null };
}

function calcularStatusClube(historico, clubeId) {
    if (!clubeId || !Array.isArray(historico)) return { status: "jogador", anos: 0, titulos: 0 };
    const temporadas = historico.filter((t) => t.clube === clubeId);
    const anos = temporadas.length;
    const titulos = temporadas.reduce((n, t) => n + (t.trofeusColetivos || []).length, 0);
    let status = "jogador";
    if (anos >= 15 && titulos >= 10) status = "camisa-aposentada";
    else if (anos >= 10 || (anos >= 7 && titulos >= 5)) status = "lenda";
    else if (anos >= 5 || titulos >= 3) status = "idolo";
    return { status, anos, titulos };
}

function obterStatusClubeTexto(status) {
    return ({
        "camisa-aposentada": "🏛️ Camisa Aposentada",
        "lenda": "👑 Lenda do Clube",
        "idolo": "⭐ Ídolo da Torcida",
        "jogador": "Jogador"
    })[status] || "Jogador";
}

const PESOS_OVERALL = {
    ata: { finalizacao: 0.35, drible: 0.22, velocidade: 0.18, passe: 0.15, fisico: 0.10 },
    me:  { passe: 0.35, drible: 0.25, finalizacao: 0.15, velocidade: 0.15, fisico: 0.10 },
    zag: { defesa: 0.45, fisico: 0.30, passe: 0.15, velocidade: 0.10 },
    go:  { reflexos: 0.50, fisico: 0.20, defesa: 0.20, passe: 0.10 }
};

function calcularOverall(posicao, atributos) {
    // Sem atributos? Cai no padrão. Nunca lança.
    if (!atributos || typeof atributos !== "object") {
        return OVERALL_PADRAO;
    }

    const pesos = PESOS_OVERALL[posicao] || PESOS_OVERALL.ata;
    let soma = 0;
    let total = 0;

    for (const chave in pesos) {
        const valor = Number(atributos[chave]);
        if (Number.isFinite(valor)) {
            soma += valor * pesos[chave];
            total += pesos[chave];
        }
    }

    if (total === 0) {
        return OVERALL_PADRAO;
    }

    const overall = Math.round(soma / total);
    return Math.max(1, Math.min(99, overall));
}

function obterClube(clubeId) {
    return CLUBES.find((clube) => clube.id === clubeId) || null;
}

const MAPA_TROFEUS_POR_LIGA = {
    // Europa
    "Premier League": { liga: "Premier League", copa: "Carabao Cup", continental: "Champions League" },
    "La Liga": { liga: "La Liga", copa: "Copa del Rey", continental: "Champions League" },
    "Serie A": { liga: "Serie A", copa: "Coppa Italia", continental: "Champions League" },
    "Bundesliga": { liga: "Bundesliga", copa: "DFB-Pokal", continental: "Champions League" },
    "Ligue 1": { liga: "Ligue 1", copa: "Coupe de France", continental: "Champions League" },
    "Primeira Liga": { liga: "Primeira Liga", copa: "Taça de Portugal", continental: "Champions League" },
    "Eredivisie": { liga: "Eredivisie", copa: "KNVB Beker", continental: "Champions League" },
    "Süper Lig": { liga: "Süper Lig", copa: "Türkiye Kupası", continental: "Champions League" },
    "Belgian Pro League": { liga: "Belgian Pro League", copa: "Belgian Cup", continental: "Champions League" },
    "Scottish Premiership": { liga: "Scottish Premiership", copa: "Scottish Cup", continental: "Champions League" },
    "Swiss Super League": { liga: "Swiss Super League", copa: "Schweizer Cup", continental: "Champions League" },
    "Austrian Bundesliga": { liga: "Austrian Bundesliga", copa: "ÖFB-Cup", continental: "Champions League" },
    "Russian Premier League": { liga: "Russian Premier League", copa: "Russian Cup", continental: "Champions League" },
    "Ukrainian Premier League": { liga: "Ukrainian Premier League", copa: "Ukrainian Cup", continental: "Champions League" },
    "Greek Super League": { liga: "Greek Super League", copa: "Greek Cup", continental: "Champions League" },

    // América do Sul
    "Brasileirão": { liga: "Série A Br", copa: "Copa do Brasil", continental: "Libertadores" },
    "Argentine Primera División": { liga: "Liga Profesional", copa: "Copa Argentina", continental: "Libertadores" },
    "Colombian Primera A": { liga: "Liga BetPlay", copa: "Copa Colombia", continental: "Libertadores" },
    "Chilean Primera División": { liga: "Primera División", copa: "Copa Chile", continental: "Libertadores" },
    "Uruguayan Primera División": { liga: "Primera División", copa: "Copa Uruguay", continental: "Libertadores" },
    "Ecuadorian Serie A": { liga: "LigaPro", copa: "Copa Ecuador", continental: "Libertadores" },
    "Paraguayan Primera División": { liga: "Primera División", copa: "Copa Paraguay", continental: "Libertadores" },

    // América do Norte / Central
    "MLS": { liga: "MLS Cup", copa: "US Open Cup", continental: "CONCACAF Champions Cup" },
    "Liga MX": { liga: "Liga MX", copa: "Copa MX", continental: "CONCACAF Champions Cup" },

    // Ásia
    "Saudi Pro League": { liga: "Saudi Pro League", copa: "King's Cup", continental: "AFC Champions League" },
    "J1 League": { liga: "J1 League", copa: "Emperor's Cup", continental: "AFC Champions League" },
    "K League 1": { liga: "K League 1", copa: "Korean FA Cup", continental: "AFC Champions League" },
    "Chinese Super League": { liga: "Chinese Super League", copa: "Chinese FA Cup", continental: "AFC Champions League" },

    // África
    "Egyptian Premier League": { liga: "Egyptian Premier League", copa: "Egypt Cup", continental: "CAF Champions League" },
    "South African Premier Division": { liga: "Betway Premiership", copa: "Nedbank Cup", continental: "CAF Champions League" },
    "Moroccan Botola": { liga: "Botola Pro", copa: "Coupe du Trône", continental: "CAF Champions League" },

    // Oceania
    "Australian A-League": { liga: "A-League", copa: "Australia Cup", continental: "AFC Champions League" }
};

function obterNomesTrofeusClube(clubeId) {
    const clube = obterClube(clubeId);
    return MAPA_TROFEUS_POR_LIGA[clube?.liga] || {
        liga: "Liga Nacional",
        copa: "Copa Nacional",
        continental: "Copa Continental"
    };
}

function ehTituloContinental(trofeu) {
    return trofeu === "Copa Continental"
        || trofeu === "Champions League"
        || trofeu === "Libertadores"
        || trofeu === "CONCACAF Champions Cup"
        || trofeu === "AFC Champions League"
        || trofeu === "CAF Champions League";
}

function ehTituloCompeticaoContinental(trofeu) {
    return ehTituloContinental(trofeu)
        || trofeu === "Europa League"
        || trofeu === "Conference League"
        || trofeu === "Copa Sul-Americana"
        || trofeu === "AFC Champions League 2"
        || trofeu === "CAF Confederation Cup";
}

function normalizarNomeTrofeu(trofeu, clubeId) {
    if (typeof trofeu !== "string") return trofeu;

    const nomes = obterNomesTrofeusClube(clubeId);

    if (trofeu === "Liga Nacional") return nomes.liga;
    if (trofeu === "Copa Nacional") return nomes.copa;
    if (trofeu === "Copa Continental") return nomes.continental;

    return trofeu;
}

function mapearTrofeusTemporada(temporada, campo = "trofeusColetivos") {
    const lista = Array.isArray(temporada?.[campo]) ? temporada[campo] : [];

    if (campo !== "trofeusColetivos") {
        return lista.slice();
    }

    return lista.map((trofeu) => normalizarNomeTrofeu(trofeu, temporada?.clube));
}

function obterTrofeusColetivosDaCarreira(carreira) {
    const temporadas = obterTemporadasDaCarreira(carreira);

    if (temporadas.length > 0) {
        return temporadas.flatMap((temporada) =>
            mapearTrofeusTemporada(temporada, "trofeusColetivos")
        );
    }

    return (Array.isArray(carreira.trofeusColetivos) ? carreira.trofeusColetivos : [])
        .map((trofeu) => normalizarNomeTrofeu(trofeu, carreira.clube));
}

function jogadorTeveBomDesempenho(temporada) {
    if (!temporada) return false;
    const overall = Number(temporada.overall) || 0;
    const jogos = Number(temporada.jogosClube ?? temporada.jogos) || 0;
    const gols = Number(temporada.golsClube ?? temporada.gols) || 0;
    const assistencias = Number(temporada.assistenciasClube ?? temporada.assistencias) || 0;
    const participacoes = gols + assistencias;
    return overall >= 75 || (jogos >= 20 && participacoes / jogos >= 0.65);
}

function sortearClubes(quantidade, clubeExcluir = "", clubeAlvo = "", desempenhoBom = false) {
    const disponiveis = CLUBES.filter((clube) => clube.id !== clubeExcluir);
    for (let indice = 0; indice < quantidade; indice++) {
        const indiceAleatorio = indice + Math.floor(Math.random() * (disponiveis.length - indice));
        [disponiveis[indice], disponiveis[indiceAleatorio]] = [disponiveis[indiceAleatorio], disponiveis[indice]];
    }
    const sorteados = disponiveis.slice(0, quantidade);
    const alvo = obterClube(clubeAlvo);

    if (
        alvo
        && alvo.id !== clubeExcluir
        && !sorteados.some((clube) => clube.id === alvo.id)
        && sorteados.length > 0
        && desempenhoBom
        && Math.random() < 0.6
    ) {
        sorteados[Math.floor(Math.random() * sorteados.length)] = alvo;
    }

    return sorteados;
}

function jogadorTeveMauDesempenho(temporada) {
    if (!temporada) return false;
    const overall = Number(temporada.overall) || 0;
    const jogos = Number(temporada.jogosClube ?? temporada.jogos) || 0;
    const participacoes = (Number(temporada.golsClube ?? temporada.gols) || 0)
        + (Number(temporada.assistenciasClube ?? temporada.assistencias) || 0);
    return overall < 65 || (jogos > 15 && participacoes / jogos < 0.15);
}

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

function gerarIdRanking() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `ranking-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeStorageGet(chave) {
    try {
        return localStorage.getItem(chave);
    } catch (erro) {
        console.error(`Não foi possível ler ${chave}:`, erro);
        return null;
    }
}

function safeStorageSet(chave, valor) {
    try {
        localStorage.setItem(chave, valor);
        return true;
    } catch (erro) {
        console.error(`Não foi possível salvar ${chave}:`, erro);
        return false;
    }
}

function normalizarNome(valor) {
    return typeof valor === "string" ? valor.trim() : "";
}

function normalizarPosicao(valor) {
    return categoriaPosicao(valor);
}

function normalizarPosicaoDetalhada(valor) {
    return chavePosicaoCampo(valor);
}

function validarTemporada(temporada) {
    if (!temporada || typeof temporada !== "object") {
        return null;
    }

    const nome = normalizarNome(temporada.nome) || "Jogador";
    const posicaoDetalhe = normalizarPosicaoDetalhada(temporada.posicaoDetalhe || temporada.posicao);
    const posicaoNormalizada = normalizarPosicao(temporada.posicaoKey || temporada.posicaoDetalhe || temporada.posicao) || "ata";
    const dadosPosicao = posicoes[posicaoNormalizada] || posicoes.ata;
    const nomePosicao = POSICOES_CAMPO[posicaoDetalhe]?.nome || dadosPosicao.nome;
    const idade = Number.isFinite(Number(temporada.idade)) ? Math.max(0, Math.floor(Number(temporada.idade))) : 0;
    const ano = Number.isFinite(Number(temporada.ano)) ? Math.floor(Number(temporada.ano)) : ANO_INICIAL;
    const jogos = Number.isFinite(Number(temporada.jogos)) ? Math.max(0, Math.floor(Number(temporada.jogos))) : 0;
    const gols = Number.isFinite(Number(temporada.gols)) ? Math.max(0, Math.floor(Number(temporada.gols))) : 0;
    const assistencias = Number.isFinite(Number(temporada.assistencias)) ? Math.max(0, Math.floor(Number(temporada.assistencias))) : 0;
    const jogosClube = Math.max(0, Math.floor(Number(temporada.jogosClube ?? jogos) || 0));
    const golsClube = Math.max(0, Math.floor(Number(temporada.golsClube ?? gols) || 0));
    const assistenciasClube = Math.max(0, Math.floor(Number(temporada.assistenciasClube ?? assistencias) || 0));
    const jogosSelecao = Math.max(0, Math.floor(Number(temporada.jogosSelecao) || 0));
    const golsSelecao = Math.max(0, Math.floor(Number(temporada.golsSelecao) || 0));
    const assistenciasSelecao = Math.max(0, Math.floor(Number(temporada.assistenciasSelecao) || 0));
    const trofeusColetivos = Array.isArray(temporada.trofeusColetivos) ? temporada.trofeusColetivos.filter((t) => typeof t === "string") : [];
    const trofeusIndividuais = Array.isArray(temporada.trofeusIndividuais) ? temporada.trofeusIndividuais.filter((t) => typeof t === "string") : [];
    const trofeusClube = Array.isArray(temporada.trofeusClube) ? temporada.trofeusClube.filter((t) => typeof t === "string") : trofeusColetivos.filter((t) => t !== "Copa do Mundo" && t !== "Copa América" && t !== "Eurocopa" && t !== "Copa Ouro" && t !== "Copa das Nações Africanas" && t !== "Copa da Ásia" && t !== "Copa das Nações da OFC" && t !== "Olimpíadas" && t !== "Mundial Sub-20" && t !== "Mundial Sub-17");
    const trofeusSelecao = Array.isArray(temporada.trofeusSelecao) ? temporada.trofeusSelecao.filter((t) => typeof t === "string") : [];
    const competicoesQualificadas = Array.isArray(temporada.competicoesQualificadas) ? temporada.competicoesQualificadas.filter((t) => typeof t === "string") : [];
    const eventos = normalizarEventosTemporada(temporada.eventos);

    const atributos = normalizarAtributos(temporada.atributos, posicaoNormalizada, idade);

    // Overall: tenta o salvo, senão recalcula, senão cai no padrão.
    const overallSalvo = Number(temporada.overall);
    const overall = Number.isFinite(overallSalvo)
        ? Math.max(1, Math.min(99, Math.round(overallSalvo)))
        : calcularOverall(posicaoNormalizada, atributos);

    const reputacao = Math.max(0, Math.min(100, Math.floor(Number(temporada.reputacao) || 0)));
    const valorMercado = Math.max(0, Math.floor(Number(temporada.valorMercado) || 0));
    const salario = Math.max(0, Math.floor(Number(temporada.salario) || 0));
    const anosContrato = Math.max(0, Math.min(5, Math.floor(Number(temporada.anosContrato) || 0)));

    return {
        nome,
        idade,
        posicao: nomePosicao,
        posicaoKey: posicaoNormalizada,
        posicaoDetalhe,
        nacionalidade: SELECOES.some((s) => s.id === temporada.nacionalidade) ? temporada.nacionalidade : "",
        clube: obterClube(temporada.clube)?.id || "",
        ano,
        jogos: jogosClube + jogosSelecao,
        gols: golsClube + golsSelecao,
        assistencias: assistenciasClube + assistenciasSelecao,
        jogosClube, golsClube, assistenciasClube,
        jogosSelecao, golsSelecao, assistenciasSelecao,
        convocado: !!temporada.convocado,
        motm: Math.max(0, Math.floor(Number(temporada.motm) || 0)),
        cartaoAmarelo: Math.max(0, Math.floor(Number(temporada.cartaoAmarelo) || 0)),
        cartaoVermelho: Math.max(0, Math.floor(Number(temporada.cartaoVermelho) || 0)),
        cleanSheets: Math.max(0, Math.floor(Number(temporada.cleanSheets) || 0)),
        penaltisDefendidos: Math.max(0, Math.floor(Number(temporada.penaltisDefendidos) || 0)),
        penaltisCometidos: Math.max(0, Math.floor(Number(temporada.penaltisCometidos) || 0)),
        driblesCompletos: Math.max(0, Math.floor(Number(temporada.driblesCompletos) || 0)),
        desarmes: Math.max(0, Math.floor(Number(temporada.desarmes) || 0)),
        defesas: Math.max(0, Math.floor(Number(temporada.defesas) || 0)),
        jogadasCriadas: Math.max(0, Math.floor(Number(temporada.jogadasCriadas) || 0)),
        minutosJogados: Math.max(0, Math.floor(Number(temporada.minutosJogados) || jogos * 90)),
        jogosSelecaoPorCompeticao: temporada.jogosSelecaoPorCompeticao && typeof temporada.jogosSelecaoPorCompeticao === "object" ? temporada.jogosSelecaoPorCompeticao : {},
        golsSelecaoPorCompeticao: temporada.golsSelecaoPorCompeticao && typeof temporada.golsSelecaoPorCompeticao === "object" ? temporada.golsSelecaoPorCompeticao : {},
        atributos,
        overall,
        trofeusColetivos,
        trofeusClube,
        trofeusSelecao,
        trofeusIndividuais,
        competicoesQualificadas,
        eventos,
        lesaoGrave: !!temporada.lesaoGrave,
        lesaoCarreira: !!temporada.lesaoCarreira,
        jogosForaProximaTemporada: Math.max(0, Math.min(62, Math.floor(Number(temporada.jogosForaProximaTemporada) || 0))),
        data: typeof temporada.data === "string" && temporada.data ? temporada.data : new Date().toLocaleString("pt-BR"),
        carreiraId: typeof temporada.carreiraId === "string" && temporada.carreiraId ? temporada.carreiraId : "legacy",
        reputacao,
        valorMercado,
        salario,
        anosContrato,
        premioFinanceiro: Math.max(0, Math.floor(Number(temporada.premioFinanceiro) || 0)),
        rendaTemporada: Math.max(0, Math.floor(Number(temporada.rendaTemporada) || salario)),
    };
}

function normalizarEventosTemporada(eventos) {
    if (!Array.isArray(eventos)) {
        return [];
    }

    const tiposValidos = new Set([
        "hat-trick", "assistencia", "lesao", "lesao-moderada",
        "lesao-grave", "lesao-carreira", "cartao-vermelho",
        "defesa-ultimo-lance", "penalti-defendido", "falta-defendida",
        "falta-sofrida-goleiro", "penalti-causado", "contra-ataque-desarmado",
        "cartao-amarelo", "interceptacao-decisiva", "suspensao-amarelos",
        "troca-treinador", "conflito-treinador", "idolo-torcida", "capitao-time",
        "aposentadoria-selecao", "pedido-transferencia", "rumor-transferencia",
        "convocacao-surpresa", "pedido-aumento", "aposentadoria-voluntaria"
    ]);

    return eventos
        .filter((evento) => evento && tiposValidos.has(evento.tipo))
        .map((evento) => ({
            tipo: evento.tipo,
            jogo: Number(evento.jogo) === 0 ? 0 : Math.max(1, Math.min(1000, Math.floor(Number(evento.jogo) || 1))),
            jogosPerdidos: Math.max(1, Math.min(1000, Math.floor(Number(evento.jogosPerdidos) || 1))),
            jogosForaProximaTemporada: Math.max(0, Math.min(62, Math.floor(Number(evento.jogosForaProximaTemporada) || 0))),
            idade: Math.max(0, Math.min(99, Math.floor(Number(evento.idade) || 0))),
            clube: typeof evento.clube === "string" ? evento.clube : "",
            motivo: typeof evento.motivo === "string" ? evento.motivo.slice(0, 120) : ""
        }));
}

function lerHistorico() {
    const historicoRaw = safeStorageGet(STORAGE_KEY);
    if (!historicoRaw) {
        return [];
    }

    try {
        const historico = JSON.parse(historicoRaw);
        if (!Array.isArray(historico)) {
            return [];
        }

        return historico
            .map((temporada) => validarTemporada(temporada))
            .filter(Boolean);
    } catch (erro) {
        console.error("Erro ao ler o histórico salvo:", erro);
        return [];
    }
}

function salvarHistorico(historico) {
    if (!Array.isArray(historico)) {
        return false;
    }

    const historicoValidado = historico
        .map((temporada) => validarTemporada(temporada))
        .filter(Boolean);

    return safeStorageSet(STORAGE_KEY, JSON.stringify(historicoValidado));
}

function obterCarreiraAtual() {
    const carreiraRaw = safeStorageGet(STORAGE_KEY_CARREIRA_ATUAL);
    const carreiraPadrao = {
        id: gerarIdRanking(),
        nome: "Jogador",
        posicao: "Centroavante",
        posicaoDetalhe: "CA",
        idadeLimite: IDADE_LIMITE_PADRAO,
        nacionalidade: "",
        clubeAlvo: "",
        anosContratoRestantes: 0,
        rompimentosContratoUsados: 0,
        saldo: 0,
        clubeQualificado: "",
        competicoesQualificadas: []
    };
    carreiraPadrao.potencial = calcularPotencialDaCarreira(carreiraPadrao);

    if (!carreiraRaw) {
        return carreiraPadrao;
    }

    try {
        const carreira = JSON.parse(carreiraRaw);
        if (!carreira || typeof carreira !== "object") {
            return carreiraPadrao;
        }

        return {
            id: typeof carreira.id === "string" && carreira.id ? carreira.id : gerarIdRanking(),
            nome: normalizarNome(carreira.nome) || "Jogador",
            posicao: typeof carreira.posicao === "string" ? carreira.posicao : "Centroavante",
            posicaoDetalhe: normalizarPosicaoDetalhada(carreira.posicaoDetalhe || carreira.posicao),
            idadeLimite: Number.isFinite(Number(carreira.idadeLimite)) ? Math.max(1, Math.floor(Number(carreira.idadeLimite))) : IDADE_LIMITE_PADRAO,
            nacionalidade: SELECOES.some((selecao) => selecao.id === carreira.nacionalidade) ? carreira.nacionalidade : "",
            clube: obterClube(carreira.clube)?.id || "",
            clubeAlvo: obterClube(carreira.clubeAlvo)?.id || "",
            anosContratoRestantes: Number.isFinite(Number(carreira.anosContratoRestantes))
                ? Math.max(0, Math.min(5, Math.floor(Number(carreira.anosContratoRestantes))))
                : 0,
            rompimentosContratoUsados: Number.isFinite(Number(carreira.rompimentosContratoUsados))
                ? Math.max(0, Math.min(10, Math.floor(Number(carreira.rompimentosContratoUsados))))
                : 0,
            potencial: calcularPotencialDaCarreira(carreira),
            aposentadoriaSelecao: !!carreira.aposentadoriaSelecao,
            aposentadoriaVoluntaria: !!carreira.aposentadoriaVoluntaria,
            salarioAtual: Number.isFinite(Number(carreira.salarioAtual))
                ? Math.max(0, Math.floor(Number(carreira.salarioAtual)))
                : 0,
            saldo: Number.isFinite(Number(carreira.saldo)) ? Math.max(0, Math.floor(Number(carreira.saldo))) : 0,
            clubeQualificado: obterClube(carreira.clubeQualificado)?.id || "",
            competicoesQualificadas: Array.isArray(carreira.competicoesQualificadas)
                ? carreira.competicoesQualificadas.filter((nome) => typeof nome === "string")
                : [],
        };
    } catch (erro) {
        console.error("Erro ao ler a carreira atual:", erro);
        return carreiraPadrao;
    }
}

function salvarCarreiraAtual(carreira) {
    const carreiraAtual = carreira || obterCarreiraAtual();
    return safeStorageSet(STORAGE_KEY_CARREIRA_ATUAL, JSON.stringify({
        id: typeof carreiraAtual.id === "string" && carreiraAtual.id ? carreiraAtual.id : gerarIdRanking(),
        nome: normalizarNome(carreiraAtual.nome) || "Jogador",
        posicao: typeof carreiraAtual.posicao === "string" ? carreiraAtual.posicao : "Centroavante",
        posicaoDetalhe: normalizarPosicaoDetalhada(carreiraAtual.posicaoDetalhe || carreiraAtual.posicao),
        idadeLimite: Number.isFinite(Number(carreiraAtual.idadeLimite)) ? Math.max(1, Math.floor(Number(carreiraAtual.idadeLimite))) : IDADE_LIMITE_PADRAO,
        nacionalidade: SELECOES.some((selecao) => selecao.id === carreiraAtual.nacionalidade) ? carreiraAtual.nacionalidade : "",
        clube: obterClube(carreiraAtual.clube)?.id || "",
        clubeAlvo: obterClube(carreiraAtual.clubeAlvo)?.id || "",
        anosContratoRestantes: Number.isFinite(Number(carreiraAtual.anosContratoRestantes))
            ? Math.max(0, Math.min(5, Math.floor(Number(carreiraAtual.anosContratoRestantes))))
            : 0,
        rompimentosContratoUsados: Number.isFinite(Number(carreiraAtual.rompimentosContratoUsados))
            ? Math.max(0, Math.min(10, Math.floor(Number(carreiraAtual.rompimentosContratoUsados))))
            : 0,
        potencial: calcularPotencialDaCarreira(carreiraAtual),

        aposentadoriaSelecao: !!carreiraAtual.aposentadoriaSelecao,
        aposentadoriaVoluntaria: !!carreiraAtual.aposentadoriaVoluntaria,
        salarioAtual: Number.isFinite(Number(carreiraAtual.salarioAtual))
            ? Math.max(0, Math.floor(Number(carreiraAtual.salarioAtual)))
            : 0,
        saldo: Number.isFinite(Number(carreiraAtual.saldo)) ? Math.max(0, Math.floor(Number(carreiraAtual.saldo))) : 0,
        clubeQualificado: obterClube(carreiraAtual.clubeQualificado)?.id || "",
        competicoesQualificadas: Array.isArray(carreiraAtual.competicoesQualificadas)
            ? carreiraAtual.competicoesQualificadas.filter((nome) => typeof nome === "string")
            : [],
    }));
}

function normalizarRanking(ranking) {
    if (!Array.isArray(ranking)) {
        return [];
    }

    return ranking
        .filter((carreira) => carreira && typeof carreira === "object")
        .map((carreira) => ({
            ...carreira,
            id: carreira.id || gerarIdRanking(),
            nome: normalizarNome(carreira.nome) || "Jogador",
            posicao: typeof carreira.posicao === "string" ? carreira.posicao : "-",
            posicaoDetalhe: normalizarPosicaoDetalhada(carreira.posicaoDetalhe || carreira.posicao),
            nacionalidade: SELECOES.some((selecao) => selecao.id === carreira.nacionalidade) ? carreira.nacionalidade : "",
            clube: obterClube(carreira.clube)?.id || "",
            idadeLimite: Number.isFinite(Number(carreira.idadeLimite)) ? Math.max(1, Math.floor(Number(carreira.idadeLimite))) : IDADE_LIMITE_PADRAO,
            jogos: Number.isFinite(Number(carreira.jogos)) ? Math.max(0, Math.floor(Number(carreira.jogos))) : 0,
            gols: Number.isFinite(Number(carreira.gols)) ? Math.max(0, Math.floor(Number(carreira.gols))) : 0,
            assistencias: Number.isFinite(Number(carreira.assistencias)) ? Math.max(0, Math.floor(Number(carreira.assistencias))) : 0,
            premios: Number.isFinite(Number(carreira.premios)) ? Math.max(0, Math.floor(Number(carreira.premios))) : 0,
            trofeusColetivos: Array.isArray(carreira.trofeusColetivos) ? carreira.trofeusColetivos.filter((trofeu) => typeof trofeu === "string") : [],
            trofeusIndividuais: Array.isArray(carreira.trofeusIndividuais) ? carreira.trofeusIndividuais.filter((trofeu) => typeof trofeu === "string") : [],
            temporadas: Array.isArray(carreira.temporadas) ? carreira.temporadas.map(validarTemporada).filter(Boolean) : []
        }));
}

function lerRanking() {
    const ranking = safeStorageGet(STORAGE_KEY_RANKING);
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
    if (!Array.isArray(ranking)) {
        return false;
    }

    return safeStorageSet(STORAGE_KEY_RANKING, JSON.stringify(normalizarRanking(ranking)));
}

function confirmarAcao(mensagem, titulo = "Confirmar ação") {
    return new Promise((resolve) => {
        const overlay = document.getElementById("modal-confirmacao");
        const tituloEl = document.getElementById("modal-titulo");
        const mensagemEl = document.getElementById("modal-mensagem");
        const btnCancelar = document.getElementById("modal-cancelar");
        const btnConfirmar = document.getElementById("modal-confirmar");

        if (!overlay || !btnCancelar || !btnConfirmar) {
            // Fallback: se o modal não existir, usa o confirm() nativo.
            resolve(confirm(mensagem));
            return;
        }

        tituloEl.textContent = titulo;
        mensagemEl.textContent = mensagem;

        const fechar = (resultado) => {
            overlay.hidden = true;
            document.removeEventListener("keydown", aoTeclar);
            btnCancelar.removeEventListener("click", aoCancelar);
            btnConfirmar.removeEventListener("click", aoConfirmar);
            overlay.removeEventListener("click", aoClicarFora);
            resolve(resultado);
        };

        const aoCancelar = () => fechar(false);
        const aoConfirmar = () => fechar(true);
        const aoClicarFora = (evento) => {
            if (evento.target === overlay) {
                fechar(false);
            }
        };
        const aoTeclar = (evento) => {
            if (evento.key === "Escape") {
                fechar(false);
            } else if (evento.key === "Enter") {
                fechar(true);
            }
        };

        btnCancelar.addEventListener("click", aoCancelar);
        btnConfirmar.addEventListener("click", aoConfirmar);
        overlay.addEventListener("click", aoClicarFora);
        document.addEventListener("keydown", aoTeclar);

        overlay.hidden = false;
        btnConfirmar.focus();
    });
}

function escolherAcaoContrato(clube, temporadasRestantes) {
    return new Promise((resolve) => {
        const overlay = document.getElementById("modal-confirmacao");
        const caixa = overlay?.querySelector(".modal-caixa");
        const tituloEl = document.getElementById("modal-titulo");
        const mensagemEl = document.getElementById("modal-mensagem");
        const btnManter = document.getElementById("modal-cancelar");
        const btnTransferencias = document.getElementById("modal-confirmar");
        const filtroLigaContainer = document.getElementById("filtro-liga-clube-alvo");
        const opcoesEl = document.getElementById("modal-opcoes-clube");
        const icone = overlay?.querySelector(".modal-icone");

        if (!overlay || !caixa || !tituloEl || !mensagemEl || !btnManter || !btnTransferencias) {
            throw new Error("O diálogo de contrato ativo não está disponível.");
        }

        const estadoAnterior = {
            titulo: tituloEl.textContent,
            mensagem: mensagemEl.textContent,
            manter: btnManter.textContent,
            transferencias: btnTransferencias.textContent,
            classeManter: btnManter.className,
            classeTransferencias: btnTransferencias.className,
            icone: icone?.textContent,
            classeCaixa: caixa.className,
            filtroOculto: filtroLigaContainer?.hidden,
            opcoesOcultas: opcoesEl?.hidden
        };
        const fechar = (escolha) => {
            overlay.hidden = true;
            document.removeEventListener("keydown", aoTeclar);
            btnManter.removeEventListener("click", aoManter);
            btnTransferencias.removeEventListener("click", aoTransferencias);
            overlay.removeEventListener("click", aoClicarFora);
            tituloEl.textContent = estadoAnterior.titulo;
            mensagemEl.textContent = estadoAnterior.mensagem;
            btnManter.textContent = estadoAnterior.manter;
            btnTransferencias.textContent = estadoAnterior.transferencias;
            btnManter.className = estadoAnterior.classeManter;
            btnTransferencias.className = estadoAnterior.classeTransferencias;
            caixa.className = estadoAnterior.classeCaixa;
            if (icone) icone.textContent = estadoAnterior.icone;
            if (filtroLigaContainer) filtroLigaContainer.hidden = estadoAnterior.filtroOculto;
            if (opcoesEl) opcoesEl.hidden = estadoAnterior.opcoesOcultas;
            resolve(escolha);
        };
        const aoManter = () => fechar("manter");
        const aoTransferencias = () => fechar("transferencias");
        const aoClicarFora = (evento) => {
            if (evento.target === overlay) fechar(null);
        };
        const aoTeclar = (evento) => {
            if (evento.key === "Escape") fechar(null);
            else if (evento.key === "Enter") fechar("transferencias");
        };

        tituloEl.textContent = "Contrato ativo";
        mensagemEl.textContent = `Você ainda tem contrato com ${obterClube(clube)?.nome || "seu clube atual"} por ${temporadasRestantes} ${temporadasRestantes === 1 ? "temporada" : "temporadas"}.`;
        btnManter.textContent = "Gerar nova temporada";
        btnTransferencias.textContent = "Janela de transferências";
        btnManter.className = "modal-btn modal-btn--decisao modal-btn--continuar";
        btnTransferencias.className = "modal-btn modal-btn--decisao modal-btn--transferencias";
        caixa.classList.add("modal-caixa--decisao-contrato");
        if (icone) icone.textContent = "⚽";
        if (filtroLigaContainer) filtroLigaContainer.hidden = true;
        if (opcoesEl) opcoesEl.hidden = true;
        btnManter.addEventListener("click", aoManter);
        btnTransferencias.addEventListener("click", aoTransferencias);
        overlay.addEventListener("click", aoClicarFora);
        document.addEventListener("keydown", aoTeclar);
        overlay.hidden = false;
        btnManter.focus();
    });
}

async function removerItemRanking(id) {
    const rankingAtual = lerRanking();
    const carreira = rankingAtual.find((item) => String(item.id) === String(id));
    const nomeCarreira = carreira ? carreira.nome : "esta carreira";

    const confirmado = await confirmarAcao(
        `Tem certeza que deseja apagar "${nomeCarreira}" do ranking?\n\nEsta ação não pode ser desfeita.`,
        "Apagar carreira"
    );

    if (!confirmado) {
        return;
    }

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
        Number(carreira.motmTotal || 0) * 4 - Number(carreira.cartoesTotais?.vermelhos || 0) * 2 +
        trofeusColetivos * 12 +
        trofeusIndividuais * 15
    );
}

function sortearPremio(chance) {
    return Math.random() < chance;
}

function gerarTrofeusSelecao(nacionalidade, ano, multiplicadorTitulos) {
    const selecao = SELECOES.find((item) => item.id === nacionalidade);
    const anoCopaDoMundo = ano >= ANO_BASE_COPA_DO_MUNDO_SELECOES
        && (ano - ANO_BASE_COPA_DO_MUNDO_SELECOES) % CICLO_COPA_DO_MUNDO_SELECOES === 0;
    const anoInicioContinental = ANO_BASE_COPA_DO_MUNDO_SELECOES + 2;
    const anoTorneioRegional = ano >= anoInicioContinental
        && (ano - anoInicioContinental) % CICLO_COPA_DO_MUNDO_SELECOES === 0;
    if (!selecao || (!anoCopaDoMundo && !anoTorneioRegional)) {
        return [];
    }

    const competicoes = [];
    if (anoTorneioRegional) {
        const regioesAmerica = ["americaSul", "americaNorte"];
        const regioesElegiveis = regioesAmerica.includes(selecao.regiao) ? regioesAmerica : [selecao.regiao];
        competicoes.push({
            nome: {
                americaSul: "Copa América",
                europa: "Eurocopa",
                americaNorte: "Copa Ouro",
                africa: "Copa das Nações Africanas",
                asia: "Copa da Ásia",
                oceania: "Copa das Nações da OFC"
            }[selecao.regiao],
            participantes: SELECOES.filter((item) => regionesElegiveis.includes(item.regiao))
        });
    }
    if (anoTorneioRegional) competicoes.push({ nome: "Olimpíadas", participantes: SELECOES });
    const configPotencias = getConfig().selecao.potencias;
    const obterPotencia = (item) => Math.min(100, Math.max(1, Number(configPotencias[item.id]) || 1));
    const potenciaSelecionada = obterPotencia(selecao);
    const trofeus = [];

    for (const competicao of competicoes) {
        if (!competicao.participantes.some((item) => item.id === nacionalidade)) {
            continue;
        }

        const potenciaTotal = competicao.participantes.reduce((total, item) => total + obterPotencia(item), 0);
        if (sortearPremio((potenciaSelecionada / potenciaTotal) * multiplicadorTitulos)) {
            trofeus.push(competicao.nome);
        }
    }

    return trofeus;
}

function gerarTrofeusTemporada(posicao, jogos, gols, assistencias, ano, idade, temporadasAnteriores = [], nacionalidade = "", clubeId = "", eventos = [], overall = OVERALL_PADRAO, posicaoDetalhe = "", convocado = false, atributos = null) {
    const cfg = getConfig();
    const t = cfg.titulos;
    const multColetivos = cfg.geral.multiplicadorTitulos;
    const multIndividuais = cfg.geral.multiplicadorPremios;
    const forcaClube = Math.max(1, Math.min(100, Number(cfg.clubes?.potencias?.[clubeId]) || 70));
    const fatorClube = 0.4 + forcaClube / 125;
    const nomesTrofeus = obterNomesTrofeusClube(clubeId);

    const trofeusColetivos = [];
    const trofeusIndividuais = [];
    const temporadaAtual = Number(ano) || ANO_INICIAL;
    const ciclo = Math.max(1, Number(t.cicloCopaDoMundo) || 4);
    const cicloCopaDoMundo = temporadaAtual >= ANO_BASE_COPA_DO_MUNDO_SELECOES
        && (temporadaAtual - ANO_BASE_COPA_DO_MUNDO_SELECOES) % CICLO_COPA_DO_MUNDO_SELECOES === 0;
    const anoInicioMundial = Number(t.anoInicioMundialClubes) || 2029;
    const anoCopaDoMundoDeClubes = temporadaAtual >= anoInicioMundial && (temporadaAtual - anoInicioMundial) % ciclo === 0;
    const competicao = determinarCompeticaoContinental(clubeId);

    // ====== Competição continental principal (já existente) ======
    if (competicao.principal && jogos >= 35 && sortearPremio(t.chanceCopaContinental * multColetivos * fatorClube)) {
        trofeusColetivos.push(competicao.principal);
    }
    if (jogos >= 30 && sortearPremio(t.chanceLigaNacional * multColetivos * fatorClube)) {
        trofeusColetivos.push(nomesTrofeus.liga);
    }
    if (jogos >= 25 && sortearPremio(t.chanceCopaNacional * multColetivos * fatorClube)) {
        trofeusColetivos.push(nomesTrofeus.copa);
    }

    // ====== Competições secundárias (novas) ======
    if (competicao.secundaria && jogos >= 30) {
        const chance = competicao.secundaria === "Europa League"
            ? (t.chanceEuropaLeague || 0.20)
            : competicao.secundaria === "Copa Sul-Americana"
            ? (t.chanceSulAmericana || 0.16)
            : (t.chanceConferenceLeague || 0.18);
        if (sortearPremio(chance * multColetivos * fatorClube)) {
            trofeusColetivos.push(competicao.secundaria);
        }
    }

    // ====== Estaduais (clubes brasileiros) ======
    const estadual = ESTADUAIS_BRASIL[clubeId];
    if (estadual && jogos >= 20 && sortearPremio((t.chanceEstadual || 0.40) * multColetivos * fatorClube)) {
        trofeusColetivos.push(estadual);
    }

    // ====== Copa do Mundo / torneios de seleção (existente) ======
    if (convocado && jogos >= 1 && cicloCopaDoMundo && sortearPremio(t.chanceCopaDoMundo * multColetivos)) {
        trofeusColetivos.push("Copa do Mundo");
    }
    if (convocado) {
        trofeusColetivos.push(...gerarTrofeusSelecao(nacionalidade, temporadaAtual, multColetivos));
    }

    // ====== Mundial de Clubes / Intercontinental ======
    const ganhouContinentalNestaTemporada = trofeusColetivos.includes(nomesTrofeus.continental);
    const inicioCicloMundial = ANO_INICIAL + Math.floor((temporadaAtual - ANO_INICIAL) / ciclo) * ciclo;
    const ganhouContinentalNoCiclo = ganhouContinentalNestaTemporada ||
        temporadasAnteriores.some((temporada) =>
            Number(temporada.ano) >= inicioCicloMundial && Number(temporada.ano) <= temporadaAtual &&
            Array.isArray(temporada.trofeusColetivos) && temporada.trofeusColetivos.some(ehTituloContinental));

    if (jogos >= 35 && ganhouContinentalNestaTemporada && sortearPremio(t.chanceIntercontinental * multColetivos * fatorClube)) {
        trofeusColetivos.push("Intercontinental");
    }
    if (jogos >= 35 && anoCopaDoMundoDeClubes && ganhouContinentalNoCiclo && sortearPremio(t.chanceMundialClubes * multColetivos * fatorClube)) {
        trofeusColetivos.push("Copa do Mundo de Clubes");
    }

    // ====== Supercopas (novas) ======
    const tempAnterior = temporadasAnteriores[temporadasAnteriores.length - 1];
    if (tempAnterior) {
        const ganhouLigaAnt = (tempAnterior.trofeusColetivos || []).includes(nomesTrofeus.liga);
        const ganhouCopaAnt = (tempAnterior.trofeusColetivos || []).includes(nomesTrofeus.copa);
        const ganhouContAnt = (tempAnterior.trofeusColetivos || []).some(ehTituloCompeticaoContinental);
        if (ganhouLigaAnt && ganhouCopaAnt && sortearPremio((t.chanceSupercopaNacional || 0.28) * multColetivos)) {
            trofeusColetivos.push("Supercopa Nacional");
        }
        if (ganhouContAnt && sortearPremio((t.chanceSupercopaContinental || 0.30) * multColetivos)) {
            trofeusColetivos.push("Supercopa Continental");
        }
    }

    // ====== Competições de base (novas) ======
    const anoMundialDeBase = temporadaAtual > ANO_INICIAL
        && (temporadaAtual - (ANO_INICIAL + 1)) % 2 === 0
        && !cicloCopaDoMundo;
    if (convocado && Number(idade) <= 20 && anoMundialDeBase && sortearPremio((t.chanceMundialSub20 || 0.14) * multColetivos)) {
        trofeusColetivos.push("Mundial Sub-20");
    }
    if (convocado && Number(idade) <= 17 && anoMundialDeBase && sortearPremio((t.chanceMundialSub17 || 0.10) * multColetivos)) {
        trofeusColetivos.push("Mundial Sub-17");
    }

    // ====== Prêmios individuais existentes ======
    if (posicao !== "Goleiro" && trofeusColetivos.length >= 2 && (gols >= 20 || assistencias >= 15 || gols + assistencias >= 25) && sortearPremio(t.chanceBolaDeOuro * multIndividuais)) {
        trofeusIndividuais.push("Bola de Ouro");
    }

    const eventosDeDesempenho = Array.isArray(eventos) ? eventos : [];
    const defesasDecisivas = eventosDeDesempenho.filter((evento) =>
        ["defesa-ultimo-lance", "penalti-defendido", "falta-defendida"].includes(evento.tipo)).length;
    const acoesDefensivasDecisivas = eventosDeDesempenho.filter((evento) =>
        ["contra-ataque-desarmado", "interceptacao-decisiva"].includes(evento.tipo)).length;

    if (posicao === "Zagueiro" && ["ZCE", "ZCD"].includes(posicaoDetalhe) && jogos >= 30 &&
        (acoesDefensivasDecisivas >= 2 || (acoesDefensivasDecisivas >= 1 && overall >= 80)) &&
        sortearPremio(t.chanceBolaDeOuroZagueiro * multIndividuais)) {
        trofeusIndividuais.push("Defender of the Year");
    }
    if (posicao === "Goleiro" && jogos >= 25 &&
        (defesasDecisivas >= 2 || (defesasDecisivas >= 1 && overall >= 80)) &&
        sortearPremio(t.chanceBolaDeOuroGoleiro * multIndividuais)) {
        trofeusIndividuais.push("GoalKeeper of the year");
    }

    const jaGanhouGoldenBoy = temporadasAnteriores.some((temporada) =>
        Array.isArray(temporada.trofeusIndividuais) && temporada.trofeusIndividuais.includes("Golden Boy"));
    if (!jaGanhouGoldenBoy && Number(idade) <= 20 && Number(idade) >= 0 &&
        (gols >= 10 || assistencias >= 8 || gols + assistencias >= 15) &&
        sortearPremio(t.chanceGoldenBoy * multIndividuais)) {
        trofeusIndividuais.push("Golden Boy");
    }
    if (gols > jogos && sortearPremio(t.chanceChuteiraDeOuro * multIndividuais)) {
        trofeusIndividuais.push("Chuteira de Ouro");
    }
    if (posicao === "Goleiro" && jogos >= 30 && sortearPremio(t.chanceLuvaDeOuro * multIndividuais)) {
        trofeusIndividuais.push("Luva de Ouro");
    }

    // ====== Novos prêmios individuais ======
    const fin = Number(atributos?.finalizacao) || 50;
    const dri = Number(atributos?.drible) || 50;
    const pas = Number(atributos?.passe) || 50;
    const totalGolsAssist = gols + assistencias;

    // Puskás
    if (totalGolsAssist >= 5 && fin >= 72 && dri >= 72 &&
        sortearPremio((t.chancePuskas || 0.04) * multIndividuais)) {
        trofeusIndividuais.push("Puskás");
    }
    // Equipe do Ano
    if (jogos >= 30 && overall >= 78 &&
        sortearPremio((t.chanceEquipeDoAno || 0.22) * multIndividuais * fatorClube)) {
        trofeusIndividuais.push("Equipe do Ano");
    }
    // MVP do Clube
    if (jogos >= 25 && totalGolsAssist >= 12 &&
        sortearPremio((t.chanceMVPClube || 0.24) * multIndividuais)) {
        trofeusIndividuais.push("MVP do Clube");
    }
    // Rei da América
    const selecaoJogador = SELECOES.find((s) => s.id === nacionalidade);
    const clubeJogador = obterClube(clubeId);
    if (selecaoJogador?.regiao === "americaSul" && clubeJogador && LIGAS_SUL_AMERICANAS.includes(clubeJogador.liga) &&
        totalGolsAssist >= 18 && sortearPremio((t.chanceReiDaAmerica || 0.15) * multIndividuais)) {
        trofeusIndividuais.push("Rei da América");
    }

    // Melhor / Artilheiro / Melhor Jovem de cada competição continental conquistada
    for (const titulo of trofeusColetivos) {
        if (!ehTituloCompeticaoContinental(titulo)) continue;

        if (sortearPremio((t.chanceMelhorJogadorCompeticao || 0.15) * multIndividuais)) {
            trofeusIndividuais.push(`Melhor da ${titulo}`);
        }
        if (gols >= 5 && sortearPremio((t.chanceArtilheiroCompeticao || 0.24) * multIndividuais)) {
            trofeusIndividuais.push(`Artilheiro da ${titulo}`);
        }
        if (Number(idade) <= 21 && sortearPremio((t.chanceMelhorJovemCompeticao || 0.20) * multIndividuais)) {
            trofeusIndividuais.push(`Melhor Jovem da ${titulo}`);
        }
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

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, (caractere) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[caractere]);
}

function obterTemporadasDaCarreira(carreira) {
    if (Array.isArray(carreira.temporadas) && carreira.temporadas.length > 0) {
        return carreira.temporadas.slice().sort((a, b) => a.ano - b.ano);
    }

    // Compatibilidade com carreiras antigas salvas antes da inclusão dos detalhes.
    return lerHistorico()
        .filter((temporada) => temporada.carreiraId === carreira.id)
        .sort((a, b) => a.ano - b.ano);
}


const ICONES_TROFEUS_VISUAIS = {
    "Champions League": "🏆", "Libertadores": "🏆", "Copa do Mundo": "🌍",
    "Bola de Ouro": "🌟", "Golden Boy": "👑", "Chuteira de Ouro": "⚽",
    "Luva de Ouro": "🧤", "Defender of the Year": "🛡️",
    "GoalKeeper of the year": "🧤", "Premier League": "🥇", "La Liga": "🥇",
    "Serie A": "🥇", "Bundesliga": "🥇", "Ligue 1": "🥇", "Brasileirão": "🥇"
};

function obterIconeTrofeu(nome) {
    if (ICONES_TROFEUS_VISUAIS[nome]) return ICONES_TROFEUS_VISUAIS[nome];
    if (/mundial|world cup|intercontinental/i.test(nome)) return "🌍";
    if (/champions|libertadores|continental|europa league|conference league|sul-americana/i.test(nome)) return "🏆";
    if (/goleiro|luva|goalkeeper/i.test(nome)) return "🧤";
    if (/defender|defensor/i.test(nome)) return "🛡️";
    if (/ouro|golden|bola de ouro|jovem/i.test(nome)) return "🌟";
    return "🏅";
}

function renderSalaTrofeus(temporadas) {
    const lista = temporadas.flatMap(t => [
        ...mapearTrofeusTemporada(t, "trofeusColetivos"),
        ...mapearTrofeusTemporada(t, "trofeusIndividuais")
    ]);
    const contagem = lista.reduce((acc, nome) => {
        acc[nome] = (acc[nome] || 0) + 1;
        return acc;
    }, {});
    if (!Object.keys(contagem).length) {
        return '<p class="visual-vazio">Ainda não há troféus registrados nesta carreira.</p>';
    }

    const trofeus = Object.entries(contagem)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"))
        .map(([nome, qtd]) => ({ nome, qtd }));

    // Troféus "grandes" ganham um brilho dourado extra na estante.
    const ehDestaque = (nome) => /champions|libertadores|mundial|mundo|intercontinental|bola de ouro|europa league|sul-americana|conference|golden boy/i.test(nome);

    // Distribui em prateleiras de até 5 troféus.
    const porPrateleira = 5;
    const prateleiras = [];
    for (let i = 0; i < trofeus.length; i += porPrateleira) {
        prateleiras.push(trofeus.slice(i, i + porPrateleira));
    }

    return `<div class="sala-trofeus-estante">
        ${prateleiras.map(prateleira => `
            <div class="estante-prateleira">
                <div class="estante-trofeus">
                    ${prateleira.map(({ nome, qtd }) => `
                        <div class="trofeu-item${ehDestaque(nome) ? " trofeu-item--destaque" : ""}" 
                            title="${escaparHTML(nome)}">
                            ${qtd > 1 ? `<span class="trofeu-badge">${qtd}x</span>` : ""}
                            <span class="trofeu-icone" aria-hidden="true">${obterIconeTrofeu(nome)}</span>
                            <div class="trofeu-placa">${escaparHTML(nome)}</div>
                        </div>
                    `).join("")}
                </div>
                <div class="estante-tabua"></div>
            </div>
        `).join("")}
    </div>`;
}

function gerarGraficoEvolucao(temporadas) {
    const pontos = temporadas.filter(t => Number.isFinite(Number(t.ano)) && Number.isFinite(Number(t.overall)))
        .slice().sort((a, b) => Number(a.ano) - Number(b.ano));
    if (!pontos.length) return '<p class="visual-vazio">Não há dados de overall por temporada para desenhar o gráfico.</p>';
    const W = 600, H = 220, P = 36;
    const minA = Number(pontos[0].ano), maxA = Number(pontos[pontos.length - 1].ano);
    const x = ano => P + ((Number(ano) - minA) / (maxA - minA || 1)) * (W - 2 * P);
    const y = ovr => H - P - ((Math.max(30, Math.min(99, Number(ovr) || 30)) - 30) / 69) * (H - 2 * P);
    const coords = pontos.map(t => `${x(t.ano)},${y(t.overall)}`);
    const path = coords.join(" ");
    const area = `M${x(pontos[0].ano)},${H-P} L${coords.join(" L")} L${x(pontos[pontos.length-1].ano)},${H-P} Z`;
    return `<div class="grafico-evolucao-wrap"><svg viewBox="0 0 ${W} ${H}" class="grafico-evolucao" role="img" aria-label="Evolução do overall por temporada">
        <defs><linearGradient id="grad-evolucao-carreira" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#22c55e" stop-opacity=".35"/><stop offset="100%" stop-color="#22c55e" stop-opacity="0"/></linearGradient></defs>
        ${[30,50,70,90].map(v=>`<line x1="${P}" y1="${y(v)}" x2="${W-P}" y2="${y(v)}" stroke="currentColor" opacity=".12"/><text x="${P-7}" y="${y(v)+4}" text-anchor="end" fill="currentColor" opacity=".7" font-size="10">${v}</text>`).join("")}
        <path d="${area}" fill="url(#grad-evolucao-carreira)"/>
        <polyline points="${path}" fill="none" stroke="#22c55e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
        ${pontos.map(t=>`<circle cx="${x(t.ano)}" cy="${y(t.overall)}" r="3.5" fill="#22c55e"><title>${escaparHTML(t.ano)} · OVR ${Number(t.overall)} · ${Number(t.gols)||0} gols</title></circle>`).join("")}
        <line x1="${P}" y1="${H-P}" x2="${W-P}" y2="${H-P}" stroke="currentColor" opacity=".3"/>
        <text x="${P}" y="${H-10}" fill="currentColor" font-size="11">${minA}</text><text x="${W-P}" y="${H-10}" text-anchor="end" fill="currentColor" font-size="11">${maxA}</text>
    </svg></div>`;
}

function renderMapaCalorTemporadas(temporadas) {
    if (!temporadas.length) return '<p class="visual-vazio">Sem temporadas para exibir.</p>';
    const max = Math.max(1, ...temporadas.map(t => (Number(t.gols)||0) + (Number(t.assistencias)||0)));
    return `<div class="heatmap-temporadas" role="list" aria-label="Mapa de calor de gols e assistências">${temporadas.map(t => {
        const gols = Number(t.gols)||0, ast = Number(t.assistencias)||0, total = gols + ast;
        const intensidade = Math.round(12 + (total/max)*68);
        return `<div class="heatmap-celula" role="listitem" style="--heat:${intensidade}%" title="${escaparHTML(t.ano)}: ${gols} gols, ${ast} assistências">
            <strong>${escaparHTML(t.ano)}</strong><span>${gols} G</span><span>${ast} A</span>
        </div>`;
    }).join("")}</div><p class="heatmap-legenda">Cada célula mostra gols (G) e assistências (A); quanto mais intensa, maior a produção ofensiva.</p>`;
}

function renderDetalhesCarreira(carreira) {
    const temporadas = obterTemporadasDaCarreira(carreira);
    const totalTemporadas = temporadas.length;
    const totalTitulos = (carreira.trofeusColetivos || []).length;
    const mediaGols = carreira.jogos > 0
        ? (carreira.gols / carreira.jogos).toFixed(2).replace(".", ",")
        : "0,00";
    const melhorTemporada = temporadas.reduce(
        (melhor, temporada) => !melhor || (Number(temporada.gols) || 0) > (Number(melhor.gols) || 0) ? temporada : melhor,
        null
    );
    const titulosMelhorTemporada = melhorTemporada
        ? [
            ...mapearTrofeusTemporada(melhorTemporada, "trofeusColetivos"),
            ...mapearTrofeusTemporada(melhorTemporada, "trofeusIndividuais")
        ]
        : [];

    const listaTemporadas = totalTemporadas
        ? temporadas.map((temporada) => {
            const trofeus = [
                ...mapearTrofeusTemporada(temporada, "trofeusColetivos"),
                ...mapearTrofeusTemporada(temporada, "trofeusIndividuais")
            ];
            const clube = obterClube(temporada.clube);
            const trofeusHtml = trofeus.length
                ? trofeus.map(t => `<span class="trajetoria-trofeu">${escaparHTML(t)}</span>`).join("")
                : '<span class="trajetoria-trofeu trajetoria-trofeu--vazio">Sem títulos</span>';
            const hatTricks = contarHatTricks([temporada]);

            return `<div class="trajetoria-temporada">
                <div class="trajetoria-temporada-header">
                    <span class="trajetoria-ano">${escaparHTML(temporada.ano)}</span>
                    <span class="trajetoria-idade">${escaparHTML(temporada.idade)} anos</span>
                    <span class="trajetoria-clube">${escaparHTML(clube?.nome || "Sem clube")}</span>
                </div>
                <div class="trajetoria-stats">
                    <span><strong>${temporada.jogos}</strong> jogos</span>
                    <span><strong>${temporada.gols}</strong> gols</span>
                    <span><strong>${temporada.assistencias}</strong> assist.</span>
                    <span><strong>${hatTricks}</strong> hat-tricks</span>
                    <span><strong>${Number(temporada.motm) || 0}</strong> MOTM</span>
                </div>
                <div class="trajetoria-stats">
                    <span><strong>${Number(temporada.defesas) || 0}</strong> defesas</span>
                    <span><strong>${Number(temporada.desarmes) || 0}</strong> desarmes</span>
                    <span><strong>${Number(temporada.driblesCompletos) || 0}</strong> dribles completos</span>
                    <span><strong>${Number(temporada.jogadasCriadas) || 0}</strong> jogadas criadas</span>
                </div>
                <div class="trajetoria-stats-split">
                    <span class="split-pill split-pill--clube">🏟️ ${temporada.jogosClube ?? temporada.jogos}j · ${temporada.golsClube ?? temporada.gols}g · ${temporada.assistenciasClube ?? temporada.assistencias}a</span>
                    <span class="split-pill split-pill--selecao${(temporada.jogosSelecao || 0) === 0 ? " split-pill--vazio" : ""}">🌍 ${temporada.jogosSelecao || 0}j · ${temporada.golsSelecao || 0}g · ${temporada.assistenciasSelecao || 0}a</span>
                </div>
                <div class="trajetoria-trofeus">${trofeusHtml}</div>
                <div class="trajetoria-eventos">${formatarEventosTemporada(temporada.eventos)}</div>
            </div>`;
        }).join("")
        : '<p class="trajetoria-vazio">Os dados por temporada não estão disponíveis para esta carreira antiga.</p>';

    return `<details class="detalhes-carreira">
        <summary class="detalhes-carreira-summary">
            <span class="detalhes-carreira-icone">📊</span>
            <span>Ver trajetória completa</span>
            ${totalTemporadas ? `<span class="detalhes-carreira-badge">${totalTemporadas} temp.</span>` : ""}
            <span class="detalhes-carreira-seta">▾</span>
        </summary>
        <div class="detalhes-carreira-conteudo">
            <div class="trajetoria-resumo">
                <div class="trajetoria-resumo-card">
                    <span class="trajetoria-resumo-label">Temporadas</span>
                    <strong class="trajetoria-resumo-valor">${totalTemporadas || "—"}</strong>
                </div>
                <div class="trajetoria-resumo-card">
                    <span class="trajetoria-resumo-label">Média gols/jogo</span>
                    <strong class="trajetoria-resumo-valor">${mediaGols}</strong>
                </div>
                <div class="trajetoria-resumo-card">
                    <span class="trajetoria-resumo-label">Hat-tricks</span>
                    <strong class="trajetoria-resumo-valor">${contarHatTricks(temporadas)}</strong>
                </div>
                <div class="trajetoria-resumo-card">
                    <span class="trajetoria-resumo-label">Títulos coletivos</span>
                    <strong class="trajetoria-resumo-valor">${totalTitulos}</strong>
                </div>
                <div class="trajetoria-resumo-card trajetoria-resumo-card--destaque">
                    <span class="trajetoria-resumo-label">Melhor temporada</span>
                    <strong class="trajetoria-resumo-valor">${melhorTemporada ? `${Number(melhorTemporada.gols) || 0} gols` : "—"}</strong>
                    ${melhorTemporada
                        ? `<small class="trajetoria-resumo-extra">${escaparHTML(melhorTemporada.ano)} · ${Number(melhorTemporada.assistencias) || 0} assist.${titulosMelhorTemporada.length ? ` · ${titulosMelhorTemporada.length} título${titulosMelhorTemporada.length === 1 ? "" : "s"}` : ""}</small>`
                        : ""}
                </div>
            </div>
            <h4 class="trajetoria-titulo-lista">Evolução do overall</h4>
            ${gerarGraficoEvolucao(temporadas)}
            <h4 class="trajetoria-titulo-lista">Sala de troféus</h4>
            ${renderSalaTrofeus(temporadas)}
            <h4 class="trajetoria-titulo-lista">Mapa de gols e assistências</h4>
            ${renderMapaCalorTemporadas(temporadas)}
            <h4 class="trajetoria-titulo-lista">Temporada por temporada</h4>
            <div class="trajetoria-lista">${listaTemporadas}</div>
        </div>
    </details>`;
}


const CONQUISTAS = [
    { id: "gols-25", nome: "Primeiros passos", descricao: "Marque 25 gols na carreira.", categoria: "Gols", icone: "⚽", metrica: "gols", meta: 25 },
    { id: "gols-50", nome: "Artilheiro", descricao: "Marque 50 gols na carreira.", categoria: "Gols", icone: "⚽", metrica: "gols", meta: 50 },
    { id: "gols-100", nome: "Centenário", descricao: "Marque 100 gols na carreira.", categoria: "Gols", icone: "🎯", metrica: "gols", meta: 100 },
        { id: "gols-250", nome: "Matador", descricao: "Marque 250 gols na carreira.", categoria: "Gols", icone: "🥅", metrica: "gols", meta: 250 },
    { id: "gols-500", nome: "Lenda do gol", descricao: "Marque 500 gols na carreira.", categoria: "Gols", icone: "🔥", metrica: "gols", meta: 500 },
    { id: "gols-750", nome: "Imparável", descricao: "Marque 750 gols na carreira.", categoria: "Gols", icone: "🌋", metrica: "gols", meta: 750 },
    { id: "gols-1000", nome: "Novo Pelé", descricao: "Marque 1000 gols na carreira.", categoria: "Gols", icone: "👑", metrica: "gols", meta: 1000 },

    { id: "ass-25", nome: "Bom garçom", descricao: "Distribua 25 assistências.", categoria: "Assistências", icone: "🅰️", metrica: "assistencias", meta: 25 },
    { id: "ass-50", nome: "Garçom", descricao: "Distribua 50 assistências.", categoria: "Assistências", icone: "🅰️", metrica: "assistencias", meta: 50 },
    { id: "ass-100", nome: "Mestre das assistências", descricao: "Distribua 100 assistências.", categoria: "Assistências", icone: "🎯", metrica: "assistencias", meta: 100 },
    { id: "ass-250", nome: "Criador de jogadas", descricao: "Distribua 250 assistências.", categoria: "Assistências", icone: "✨", metrica: "assistencias", meta: 250 },
    { id: "ass-500", nome: "Maestro", descricao: "Distribua 500 assistências.", categoria: "Assistências", icone: "🎼", metrica: "assistencias", meta: 500 },

    { id: "jogos-50", nome: "Presença constante", descricao: "Dispute 50 jogos.", categoria: "Jogos", icone: "👟", metrica: "jogos", meta: 50 },
    { id: "jogos-100", nome: "Camisa 100", descricao: "Dispute 100 jogos.", categoria: "Jogos", icone: "👕", metrica: "jogos", meta: 100 },
    { id: "jogos-250", nome: "Titular absoluto", descricao: "Dispute 250 jogos.", categoria: "Jogos", icone: "🏟️", metrica: "jogos", meta: 250 },
    { id: "jogos-500", nome: "Veterano dos gramados", descricao: "Dispute 500 jogos.", categoria: "Jogos", icone: "🧤", metrica: "jogos", meta: 500 },
    { id: "jogos-1000", nome: "Ícone do futebol", descricao: "Dispute 1.000 jogos.", categoria: "Jogos", icone: "🌟", metrica: "jogos", meta: 1000 },

    { id: "coletivos-1", nome: "Primeira taça", descricao: "Conquiste seu primeiro título coletivo.", categoria: "Títulos coletivos", icone: "🏆", metrica: "titulosColetivos", meta: 1 },
    { id: "coletivos-5", nome: "Vitrine de taças", descricao: "Conquiste 5 títulos coletivos.", categoria: "Títulos coletivos", icone: "🏆", metrica: "titulosColetivos", meta: 5 },
    { id: "coletivos-10", nome: "Colecionador de taças", descricao: "Conquiste 10 títulos coletivos.", categoria: "Títulos coletivos", icone: "🥇", metrica: "titulosColetivos", meta: 10 },
    { id: "coletivos-20", nome: "Rei das competições", descricao: "Conquiste 20 títulos coletivos.", categoria: "Títulos coletivos", icone: "👑", metrica: "titulosColetivos", meta: 20 },
    { id: "coletivos-30", nome: "Dinastia vencedora", descricao: "Conquiste 30 títulos coletivos.", categoria: "Títulos coletivos", icone: "💎", metrica: "titulosColetivos", meta: 30 },

    { id: "individuais-1", nome: "Talento reconhecido", descricao: "Conquiste seu primeiro título individual.", categoria: "Títulos individuais", icone: "🌟", metrica: "titulosIndividuais", meta: 1 },
    { id: "individuais-5", nome: "Destaque da temporada", descricao: "Conquiste 5 títulos individuais.", categoria: "Títulos individuais", icone: "🎖️", metrica: "titulosIndividuais", meta: 5 },
    { id: "individuais-10", nome: "Estrela consagrada", descricao: "Conquiste 10 títulos individuais.", categoria: "Títulos individuais", icone: "🥇", metrica: "titulosIndividuais", meta: 10 },
    { id: "individuais-15", nome: "Lenda individual", descricao: "Conquiste 15 títulos individuais.", categoria: "Títulos individuais", icone: "🏅", metrica: "titulosIndividuais", meta: 15 },
    { id: "individuais-20", nome: "Melhor dos melhores", descricao: "Conquiste 20 títulos individuais.", categoria: "Títulos individuais", icone: "👑", metrica: "titulosIndividuais", meta: 20 },

    { id: "temp-1", nome: "Estreia profissional", descricao: "Conclua sua primeira temporada.", categoria: "Longevidade", icone: "📅", metrica: "temporadas", meta: 1 },
    { id: "temp-5", nome: "Já é de casa", descricao: "Conclua 5 temporadas.", categoria: "Longevidade", icone: "📅", metrica: "temporadas", meta: 5 },
    { id: "temp-10", nome: "Veterano", descricao: "Conclua 10 temporadas.", categoria: "Longevidade", icone: "🗓️", metrica: "temporadas", meta: 10 },
    { id: "temp-15", nome: "Carreira duradoura", descricao: "Conclua 15 temporadas.", categoria: "Longevidade", icone: "⏳", metrica: "temporadas", meta: 15 },
    { id: "temp-20", nome: "Lenda eterna", descricao: "Conclua 20 temporadas.", categoria: "Longevidade", icone: "♾️", metrica: "temporadas", meta: 20 },

    { id: "hattrick-1", nome: "Hat-trick de estreia", descricao: "Faça 1 hat-trick na carreira.", categoria: "Hat-tricks", icone: "⚽", metrica: "hatTricks", meta: 1 },
    { id: "hattrick-10", nome: "Especialista em hat-tricks", descricao: "Faça 10 hat-tricks na carreira.", categoria: "Hat-tricks", icone: "🎩", metrica: "hatTricks", meta: 10 },
    { id: "hattrick-25", nome: "Trinca lendária", descricao: "Faça 25 hat-tricks na carreira.", categoria: "Hat-tricks", icone: "🔥", metrica: "hatTricks", meta: 25 },
    { id: "hattrick-50", nome: "Rei dos hat-tricks", descricao: "Faça 50 hat-tricks na carreira.", categoria: "Hat-tricks", icone: "👑", metrica: "hatTricks", meta: 50 },

    { id: "over-80", nome: "Destaque mundial", descricao: "Alcance Over 80 na carreira.", categoria: "Over", icone: "⭐", metrica: "maiorOver", meta: 80 },
    { id: "over-90", nome: "Craque mundial", descricao: "Alcance Over 90 na carreira.", categoria: "Over", icone: "🌟", metrica: "maiorOver", meta: 90 },
    { id: "over-95", nome: "Lenda do futebol", descricao: "Alcance Over 95 na carreira.", categoria: "Over", icone: "💎", metrica: "maiorOver", meta: 95 },
    { id: "over-99", nome: "Over máximo", descricao: "Alcance Over 99 na carreira.", categoria: "Over", icone: "👑", metrica: "maiorOver", meta: 99 },
    { id: "caps-50", nome: "Internacional", descricao: "Faça 50 jogos pela seleção.", categoria: "Seleção", icone: "🌍", metrica: "caps", meta: 50 },
    { id: "convocacao-5", nome: "Presença internacional", descricao: "Seja convocado em 5 temporadas seguidas.", categoria: "Seleção", icone: "🌍", metrica: "convocacoesSeguidasMax", meta: 5 },
    { id: "clean-sheets-50", nome: "Muralha", descricao: "Consiga 50 jogos sem sofrer gols como goleiro.", categoria: "Desempenho", icone: "🧤", metrica: "cleanSheets", meta: 50 },
    { id: "gols-selecao-10", nome: "Artilheiro internacional", descricao: "Marque 10 gols pela seleção.", categoria: "Seleção", icone: "⚽", metrica: "golsSelecao", meta: 10 },
    { id: "motm-10", nome: "Dono da partida", descricao: "Consiga 10 prêmios de melhor em campo.", categoria: "Desempenho", icone: "⭐", metrica: "motmTotal", meta: 10 },
    { id: "motm-50", nome: "Craque decisivo", descricao: "Consiga 50 prêmios de melhor em campo.", categoria: "Desempenho", icone: "🌟", metrica: "motmTotal", meta: 50 },

    { id: "puskas-1", nome: "Gol de Placa", descricao: "Ganhe o prêmio Puskás.", categoria: "Desempenho", icone: "🎨", metrica: "puskasTotal", meta: 1 },
    { id: "puskas-3", nome: "Artista da bola", descricao: "Ganhe o Puskás 3 vezes.", categoria: "Desempenho", icone: "🎨", metrica: "puskasTotal", meta: 3 },
    { id: "equipe-ano-1", nome: "Time dos sonhos", descricao: "Entre na Equipe do Ano.", categoria: "Desempenho", icone: "⭐", metrica: "equipeAnoTotal", meta: 1 },
    { id: "equipe-ano-5", nome: "Seleção natural", descricao: "Entre na Equipe do Ano 5 vezes.", categoria: "Desempenho", icone: "🌟", metrica: "equipeAnoTotal", meta: 5 },
    { id: "melhor-comp-1", nome: "Destaque continental", descricao: "Seja eleito melhor jogador de uma competição continental.", categoria: "Desempenho", icone: "🏅", metrica: "melhorCompTotal", meta: 1 },
    { id: "artilheiro-comp-1", nome: "Artilheiro continental", descricao: "Seja artilheiro de uma competição continental.", categoria: "Gols", icone: "⚽", metrica: "artilheiroCompTotal", meta: 1 },
    { id: "melhor-jovem-1", nome: "Joia jovem", descricao: "Seja o melhor jovem de uma competição continental.", categoria: "Desempenho", icone: "💎", metrica: "melhorJovemTotal", meta: 1 },
    { id: "mvp-clube-1", nome: "Dono do time", descricao: "Seja MVP do seu clube.", categoria: "Desempenho", icone: "🎯", metrica: "mvpClubeTotal", meta: 1 },
    { id: "mvp-clube-5", nome: "Indispensável", descricao: "Seja MVP do seu clube 5 vezes.", categoria: "Desempenho", icone: "🎯", metrica: "mvpClubeTotal", meta: 5 },
    { id: "rei-america-1", nome: "Rei da América", descricao: "Ganhe o prêmio Rei da América.", categoria: "Desempenho", icone: "👑", metrica: "reiAmericaTotal", meta: 1 },
    { id: "europa-league-1", nome: "Campeão da Europa League", descricao: "Ganhe a Europa League.", categoria: "Títulos coletivos", icone: "🏆", metrica: "europaLeagueTotal", meta: 1 },
    { id: "sul-americana-1", nome: "Campeão da Sul-Americana", descricao: "Ganhe a Copa Sul-Americana.", categoria: "Títulos coletivos", icone: "🏆", metrica: "sulAmericanaTotal", meta: 1 },
    { id: "supercopa-1", nome: "Campeão de Supercopa", descricao: "Conquiste uma Supercopa.", categoria: "Títulos coletivos", icone: "🏆", metrica: "supercopaTotal", meta: 1 },
    { id: "estadual-1", nome: "Campeão regional", descricao: "Ganhe um campeonato estadual.", categoria: "Títulos coletivos", icone: "🏆", metrica: "estadualTotal", meta: 1 },

    { id: "reputacao-50", nome: "Reconhecido", descricao: "Alcance 50 de reputação.", categoria: "Desempenho", icone: "⭐", metrica: "maiorReputacao", meta: 50 },
    { id: "reputacao-75", nome: "Estrela mundial", descricao: "Alcance 75 de reputação.", categoria: "Desempenho", icone: "🌟", metrica: "maiorReputacao", meta: 75 },
    { id: "reputacao-90", nome: "Lenda global", descricao: "Alcance 90 de reputação.", categoria: "Desempenho", icone: "👑", metrica: "maiorReputacao", meta: 90 },
    
    { id: "valor-50m",  nome: "Jogador valioso",  descricao: "Alcance €50M de valor de mercado.",  categoria: "Desempenho", icone: "💰", metrica: "maiorValor", meta: 50000000, formato: "euro" },
    { id: "valor-100m", nome: "Craque do mercado", descricao: "Alcance €100M de valor de mercado.", categoria: "Desempenho", icone: "💎", metrica: "maiorValor", meta: 100000000, formato: "euro" },
    { id: "valor-200m", nome: "Fora de série",    descricao: "Alcance €200M de valor de mercado.", categoria: "Desempenho", icone: "🏆", metrica: "maiorValor", meta: 200000000, formato: "euro" },
    
    { id: "salario-10m", nome: "Milionário",       descricao: "Ganhe €10M por temporada.", categoria: "Desempenho", icone: "💵", metrica: "maiorSalario", meta: 10000000, formato: "euro" },
    { id: "salario-25m", nome: "Salário de elite", descricao: "Ganhe €25M por temporada.", categoria: "Desempenho", icone: "🤑", metrica: "maiorSalario", meta: 25000000, formato: "euro" },
    
    { id: "ganhos-100m", nome: "Centenário financeiro", descricao: "Acumule €100M em salários.", categoria: "Desempenho", icone: "🏦", metrica: "ganhosTotais", meta: 100000000, formato: "euro" },
    { id: "ganhos-500m", nome: "Magnata do futebol",    descricao: "Acumule €500M em salários.", categoria: "Desempenho", icone: "🏛️", metrica: "ganhosTotais", meta: 500000000, formato: "euro" },

];

function obterMetricasCarreira(carreira) {
    const temporadas = obterTemporadasDaCarreira(carreira);
    const titulosColetivos = Array.isArray(carreira.trofeusColetivos) ? carreira.trofeusColetivos.length : 0;
    const titulosIndividuais = Array.isArray(carreira.trofeusIndividuais) ? carreira.trofeusIndividuais.length : 0;
    const totalTitulos = titulosColetivos + titulosIndividuais;

    const todosIndividuais = temporadas.flatMap((t) => Array.isArray(t.trofeusIndividuais) ? t.trofeusIndividuais : []);
    const todosColetivos = temporadas.flatMap((t) => Array.isArray(t.trofeusColetivos) ? t.trofeusColetivos : []);
    const ESTADUAIS = ["Carioca", "Paulistão", "Gauchão", "Mineiro", "Baianão", "Pernambucano", "Cearense"];
    const reputacaoMax = Math.max(0, ...temporadas.map(t => Number(t.reputacao) || 0));
    const valorMax = Math.max(0, ...temporadas.map(t => Number(t.valorMercado) || 0));
    const salarioMax = Math.max(0, ...temporadas.map(t => Number(t.salario) || 0));
    const ganhosTotais = temporadas.reduce((s, t) => s + (Number(t.rendaTemporada ?? t.salario) || 0), 0);
  
    return {
        gols: Number(carreira.gols) || 0,
        assistencias: Number(carreira.assistencias) || 0,
        jogos: Number(carreira.jogos) || 0,
        titulosColetivos,
        titulosIndividuais,
        temporadas: temporadas.length,
        hatTricks: contarHatTricks(temporadas),
        motmTotal: temporadas.reduce((n,t)=>n+(Number(t.motm)||0),0),
        driblesCompletos: temporadas.reduce((n, t) => n + (Number(t.driblesCompletos) || 0), 0) || Number(carreira.driblesCompletos) || 0,
        desarmes: temporadas.reduce((n, t) => n + (Number(t.desarmes) || 0), 0) || Number(carreira.desarmes) || 0,
        defesas: temporadas.reduce((n, t) => n + (Number(t.defesas) || 0), 0) || Number(carreira.defesas) || 0,
        jogadasCriadas: temporadas.reduce((n, t) => n + (Number(t.jogadasCriadas) || 0), 0) || Number(carreira.jogadasCriadas) || 0,
        cartoesTotais: { amarelos: temporadas.reduce((n,t)=>n+(Number(t.cartaoAmarelo)||0),0), vermelhos: temporadas.reduce((n,t)=>n+(Number(t.cartaoVermelho)||0),0) },
        caps: temporadas.reduce((n,t)=>n+(Number(t.jogosSelecao)||0),0),
        cleanSheets: temporadas.reduce((n,t)=>n+(Number(t.cleanSheets)||0),0),
        convocacoesSeguidasMax: temporadas.reduce((r,t)=>{r.atual=(t.convocado||Number(t.jogosSelecao)>0)?r.atual+1:0;r.max=Math.max(r.max,r.atual);return r;},{atual:0,max:0}).max,
        golsSelecao: temporadas.reduce((n,t)=>n+(Number(t.golsSelecao)||0),0),
        maiorOver: Math.max(0, ...temporadas.map((temporada) => Number(temporada.overall) || 0)),
        premios: Number(carreira.premios) || totalTitulos,
        pontuacao: Number(carreira.pontuacao) || calcularPontuacao(carreira),
        puskasTotal: todosIndividuais.filter((t) => t === "Puskás").length,
        equipeAnoTotal: todosIndividuais.filter((t) => t === "Equipe do Ano").length,
        melhorCompTotal: todosIndividuais.filter((t) => t.startsWith("Melhor da ")).length,
        artilheiroCompTotal: todosIndividuais.filter((t) => t.startsWith("Artilheiro da ")).length,
        melhorJovemTotal: todosIndividuais.filter((t) => t.startsWith("Melhor Jovem da ")).length,
        mvpClubeTotal: todosIndividuais.filter((t) => t === "MVP do Clube").length,
        reiAmericaTotal: todosIndividuais.filter((t) => t === "Rei da América").length,
        europaLeagueTotal: todosColetivos.filter((t) => t === "Europa League").length,
        sulAmericanaTotal: todosColetivos.filter((t) => t === "Copa Sul-Americana").length,
        supercopaTotal: todosColetivos.filter((t) => String(t).includes("Supercopa")).length,
        estadualTotal: todosColetivos.filter((t) => ESTADUAIS.includes(t)).length,
        maiorReputacao: reputacaoMax,
        maiorValor: valorMax,
        maiorSalario: salarioMax,
        ganhosTotais,
    };
}

function atualizarNotificacaoConquista(carreira, forcarExibicao = false) {
    const notificacao = document.getElementById("notificacao-conquista");
    if (!notificacao || (!forcarExibicao && notificacao.hidden)) return;

    if (!carreira) {
        notificacao.hidden = true;
        return;
    }

    const metricas = obterMetricasCarreira(carreira);
    const desbloqueadas = CONQUISTAS.filter((conquista) => metricas[conquista.metrica] >= conquista.meta);
    notificacao.textContent = desbloqueadas.length
        ? `Carreira registrada! ${desbloqueadas.length} de ${CONQUISTAS.length} conquistas desbloqueadas nesta carreira.`
        : "Carreira registrada! Continue jogando para desbloquear conquistas.";
    notificacao.hidden = false;
}

function renderConquistas() {
    const seletor = document.getElementById("filtro-carreira-conquistas");
    const lista = document.getElementById("lista-conquistas");
    const listaRecordes = document.getElementById("lista-recordes");
    if (!seletor || !lista || !listaRecordes) return;

    const filtroCategoria = document.getElementById("filtro-categoria-conquistas");
    const categoriaSelecionada = filtroCategoria?.value || "todas";

    const ranking = lerRanking();
    const selecaoAnterior = seletor.value;
    const ordenadas = ranking.slice().reverse();
    seletor.innerHTML = ordenadas.length
        ? ordenadas.map((carreira) => `<option value="${escaparHTML(carreira.id)}">${escaparHTML(carreira.nome)} — ${escaparHTML(carreira.posicao)}</option>`).join("")
        : '<option value="">Nenhuma carreira salva</option>';

    if (ordenadas.some((carreira) => String(carreira.id) === selecaoAnterior)) {
        seletor.value = selecaoAnterior;
    }

    const carreira = ordenadas.find((item) => String(item.id) === String(seletor.value)) || ordenadas[0];
    if (carreira && !seletor.value) seletor.value = String(carreira.id);
    atualizarNotificacaoConquista(carreira);

    if (!carreira) {
        lista.innerHTML = '<p class="conquistas-vazio">Finalize uma carreira para começar a desbloquear conquistas.</p>';
        document.getElementById("conquistas-desbloqueadas").textContent = "0";
        document.getElementById("conquistas-total").textContent = String(CONQUISTAS.length);
        document.getElementById("conquistas-percentual").textContent = "0%";
    } else {
        const metricas = obterMetricasCarreira(carreira);

        // O percentual e a contagem SEMPRE consideram todas as conquistas,
        // independente do filtro de categoria ativo.
        const desbloqueadas = CONQUISTAS.filter((conquista) => metricas[conquista.metrica] >= conquista.meta);
        const percentual = Math.round((desbloqueadas.length / CONQUISTAS.length) * 100);
        document.getElementById("conquistas-desbloqueadas").textContent = String(desbloqueadas.length);
        document.getElementById("conquistas-total").textContent = String(CONQUISTAS.length);
        document.getElementById("conquistas-percentual").textContent = `${percentual}%`;

        // Filtro apenas para exibição.
        const conquistasVisiveis = categoriaSelecionada === "todas"
            ? CONQUISTAS
            : CONQUISTAS.filter((conquista) => conquista.categoria === categoriaSelecionada);

        if (conquistasVisiveis.length === 0) {
            lista.innerHTML = '<p class="conquistas-vazio">Nenhuma conquista nesta categoria.</p>';
        } else {
            lista.innerHTML = conquistasVisiveis.map((conquista) => {
                const valor = metricas[conquista.metrica] || 0;
                const desbloqueada = valor >= conquista.meta;
                const progresso = Math.min(100, Math.round((valor / conquista.meta) * 100));

                // Formatação: moeda compacta para conquistas financeiras,
                // número inteiro formatado para as demais.
                const fmt = (v) => conquista.formato === "euro"
                    ? formatarValorCompacto(v)
                    : Math.floor(v).toLocaleString("pt-BR");
                const valorExibido = fmt(valor);
                const metaExibida = fmt(conquista.meta);

                return `<article class="conquista-card ${desbloqueada ? "desbloqueada" : "bloqueada"}">
                    <div class="conquista-icone">${desbloqueada ? conquista.icone : "🔒"}</div>
                    <div class="conquista-conteudo">
                        <span class="conquista-categoria">${escaparHTML(conquista.categoria)}</span>
                        <strong>${escaparHTML(conquista.nome)}</strong>
                        <p>${escaparHTML(conquista.descricao)}</p>
                        <div class="conquista-progresso"><span style="width:${progresso}%"></span></div>
                        <small>${valorExibido} / ${metaExibida}${desbloqueada ? " · Desbloqueada" : ""}</small>
                    </div>
                </article>`;
            }).join("");
        }
    }

    // ----- Recordes -----
    const temporadasDeTodas = ordenadas.flatMap((item) => obterTemporadasDaCarreira(item).map((temporada) => ({
        ...temporada,
        carreiraNome: item.nome,
        hatTricksTemporada: contarHatTricks([temporada]),
        pontosTemporada: calcularPontuacao({
            jogos: temporada.jogos,
            gols: temporada.gols,
            assistencias: temporada.assistencias,
            premios: contarPremios(temporada),
            trofeusColetivos: temporada.trofeusColetivos || [],
            trofeusIndividuais: temporada.trofeusIndividuais || []
        }),
        titulosTemporada: (temporada.trofeusColetivos || []).length + (temporada.trofeusIndividuais || []).length
    })));
    const carreirasComMetricas = ordenadas.map((item) => ({
        ...item,
        hatTricksCarreira: contarHatTricks(obterTemporadasDaCarreira(item)),
        maiorOver: obterMetricasCarreira(item).maiorOver
    }));

    const recordes = [
        { nome: "Mais gols em uma temporada", campo: "gols", sufixo: "gols", melhor: temporadasDeTodas.reduce((a, b) => !a || b.gols > a.gols ? b : a, null) },
        { nome: "Mais assistências em uma temporada", campo: "assistencias", sufixo: "assistências", melhor: temporadasDeTodas.reduce((a, b) => !a || b.assistencias > a.assistencias ? b : a, null) },
        { nome: "Mais títulos em uma temporada", campo: "titulosTemporada", sufixo: "títulos", melhor: temporadasDeTodas.reduce((a, b) => !a || b.titulosTemporada > a.titulosTemporada ? b : a, null) },
        { nome: "Maior pontuação em uma temporada", campo: "pontosTemporada", sufixo: "pontos", melhor: temporadasDeTodas.reduce((a, b) => !a || b.pontosTemporada > a.pontosTemporada ? b : a, null) },
        { nome: "Mais hat-tricks em uma temporada", campo: "hatTricksTemporada", sufixo: "hat-tricks", melhor: temporadasDeTodas.reduce((a, b) => !a || b.hatTricksTemporada > a.hatTricksTemporada ? b : a, null) },
        { nome: "Carreira com mais hat-tricks", campo: "hatTricksCarreira", sufixo: "hat-tricks", melhor: carreirasComMetricas.reduce((a, b) => !a || b.hatTricksCarreira > a.hatTricksCarreira ? b : a, null), carreira: true },
        { nome: "Carreira com maior Over", campo: "maiorOver", sufixo: "Over", melhor: carreirasComMetricas.reduce((a, b) => !a || b.maiorOver > a.maiorOver ? b : a, null), carreira: true },
        { nome: "Carreira com mais gols", campo: "gols", sufixo: "gols", melhor: ordenadas.reduce((a, b) => !a || b.gols > a.gols ? b : a, null), carreira: true }
    ];

    listaRecordes.innerHTML = recordes.map((recorde) => {
        const melhor = recorde.melhor;
        const valor = melhor ? Number(melhor[recorde.campo]) || 0 : 0;
        return `<article class="recorde-card">
            <span class="recorde-icone">🏆</span>
            <div><strong>${escaparHTML(recorde.nome)}</strong>
            <p>${melhor ? `${valor.toLocaleString("pt-BR")} ${recorde.sufixo}` : "Ainda sem dados"}</p>
            <small>${melhor ? `${escaparHTML(recorde.carreira ? melhor.nome : melhor.carreiraNome)}${recorde.carreira ? "" : ` · ${escaparHTML(melhor.ano)}`}` : "Finalize uma carreira para registrar recordes"}</small></div>
        </article>`;
    }).join("");
}

function renderRanking() {
    const listaRanking = document.getElementById("lista-ranking");
    const filtroRanking = document.getElementById("filtro-ranking");
  
    if (!listaRanking) return;

    const criterio = filtroRanking?.value || "pontuacao";
    const filtroPosicao = document.getElementById("filtro-posicao-ranking");
    const posicaoSelecionada = filtroPosicao?.value || "todas";
    const filtroSelecao = document.getElementById("filtro-selecao-ranking");
    const selecaoSelecionada = filtroSelecao?.value || "";
    const carreiras = lerRanking();
    const ranking = carreiras
        .filter((carreira) => {
            const correspondeSelecao = !selecaoSelecionada || carreira.nacionalidade === selecaoSelecionada;
            if (!correspondeSelecao) return false;
            if (posicaoSelecionada === "todas") return true;
            // Compatibilidade com carreiras antigas: normalizarPosicaoDetalhada usa CA
            // como fallback quando a posição salva é inválida ou desconhecida.
            const detalhe = normalizarPosicaoDetalhada(carreira.posicaoDetalhe || carreira.posicao);
            const categoria = categoriaPosicao(detalhe);
            return POSICOES_CAMPO[posicaoSelecionada]
                ? detalhe === posicaoSelecionada
                : categoria === posicaoSelecionada;
        })
        .sort((a, b) => {
            const maiorOver = (carreira) => Math.max(0, ...(carreira.temporadas || []).map((temporada) => Number(temporada.overall) || 0));
            const valorOrdenacao = (carreira) => {
                if (criterio === "over") return maiorOver(carreira);
                if (criterio === "hattricks") return contarHatTricks(carreira.temporadas || []);
                if (criterio === "motm") return obterMetricasCarreira(carreira).motmTotal;
                if (criterio === "caps") return obterMetricasCarreira(carreira).caps;
                if (["driblesCompletos", "desarmes", "defesas", "jogadasCriadas"].includes(criterio)) return obterMetricasCarreira(carreira)[criterio];
                return Number(carreira[criterio]) || 0;
            };
            const valorA = valorOrdenacao(a);
            const valorB = valorOrdenacao(b);
            return valorB - valorA;
        })
        .slice(0, 5);

    if (ranking.length === 0) {
        const mensagem = carreiras.length === 0
            ? "Nenhuma carreira finalizada ainda."
            : "Nenhuma carreira corresponde aos filtros selecionados.";
        listaRanking.innerHTML = `<li>${mensagem}</li>`;
        renderConquistas();
        return;
    }

    listaRanking.innerHTML = ranking.map((carreira, index) => {
      const trofeusColetivos = obterTrofeusColetivosDaCarreira(carreira);
      const trofeusIndividuais = Array.isArray(carreira.trofeusIndividuais) ? carreira.trofeusIndividuais : [];
      const premios = contarPremios(carreira);
      const medalha = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
      const classeTop = index === 0 ? "top-1" : index === 1 ? "top-2" : index === 2 ? "top-3" : "";
      const maiorOver = Math.max(0, ...(carreira.temporadas || []).map(t => Number(t.overall) || 0));
      const hatTricks = contarHatTricks(carreira.temporadas || []);      
      const selecao = SELECOES.find(s => s.id === carreira.nacionalidade);
      const clube = obterClube(carreira.clube);

      const reputacaoMax = Math.max(0, ...(carreira.temporadas || []).map(t => Number(t.reputacao) || 0));
      const ganhosTotais = (carreira.temporadas || []).reduce((s, t) => s + (Number(t.rendaTemporada ?? t.salario) || 0), 0);
      const metricasCarreira = obterMetricasCarreira(carreira);
  
      const renderTrofeus = (trofeus, tipo) => {
          if (!trofeus.length) {
              return '<span class="titulo-tag titulo-tag--vazio">Nenhum</span>';
          }
          
          // Agrupa os troféus repetidos e conta a quantidade
          const contagem = trofeus.reduce((acc, t) => {
              acc[t] = (acc[t] || 0) + 1;
              return acc;
          }, {});
      
          // Gera uma pill para cada tipo de troféu (ex: 3x Copa do Mundo)
          return Object.entries(contagem)
              .map(([nome, qtd]) => `<span class="titulo-tag titulo-tag--${tipo}">${qtd}x ${escaparHTML(nome)}</span>`)
              .join("");
      };  
      return `
          <li class="ranking-card ${classeTop}">
              <div class="ranking-header">
                  <span class="rank-medal">${medalha}</span>
                  <div class="ranking-titulo-bloco">
                      <strong class="ranking-nome">${escaparHTML(carreira.nome)}</strong>
                      <div class="ranking-badges">
                          <span class="badge badge--pos">${escaparHTML(carreira.posicao)}</span>
                          <span class="badge badge--selecao">${escaparHTML(selecao?.nome || "Sem seleção")}</span>
                          <span class="badge badge--clube">${escaparHTML(clube?.nome || "Sem clube")}</span>
                      </div>
                  </div>
                  <div class="ranking-pontos">
                      <span class="stat-label">Pontos</span>
                      <strong class="stat-value">${carreira.pontuacao}</strong>
                  </div>
              </div>
              <div class="temporada-stats ranking-stats">
                  <div class="stat-card"><span class="stat-label">Jogos</span><strong class="stat-value">${carreira.jogos}</strong></div>
                  <div class="stat-card"><span class="stat-label">Gols</span><strong class="stat-value stat-value--gol">${carreira.gols}</strong></div>
                  <div class="stat-card"><span class="stat-label">Assist.</span><strong class="stat-value stat-value--assist">${carreira.assistencias}</strong></div>
                  <div class="stat-card"><span class="stat-label">Hat-tricks</span><strong class="stat-value">${hatTricks}</strong></div>
                  <div class="stat-card"><span class="stat-label">Prêmios</span><strong class="stat-value stat-value--premio">${premios}</strong></div>
                  <div class="stat-card"><span class="stat-label">Maior OVR</span><strong class="stat-value">${maiorOver}</strong></div>
                  <div class="stat-card"><span class="stat-label">MOTM</span><strong class="stat-value">${obterMetricasCarreira(carreira).motmTotal}</strong></div>
                  <div class="stat-card"><span class="stat-label">Dribles completos</span><strong class="stat-value">${metricasCarreira.driblesCompletos}</strong></div>
                  <div class="stat-card"><span class="stat-label">Desarmes</span><strong class="stat-value">${metricasCarreira.desarmes}</strong></div>
                  <div class="stat-card"><span class="stat-label">Defesas</span><strong class="stat-value">${metricasCarreira.defesas}</strong></div>
                  <div class="stat-card"><span class="stat-label">Jogadas criadas</span><strong class="stat-value">${metricasCarreira.jogadasCriadas}</strong></div>
                  <div class="stat-card"><span class="stat-label">Reputação</span><strong class="stat-value">${reputacaoMax}</strong></div>
                  <div class="stat-card"><span class="stat-label">Ganhos</span><strong class="stat-value">${formatarValorCompacto(ganhosTotais)}</strong></div>
              </div>
              <div class="temporada-titulos">
                  <div class="titulos-grupo">
                      <span class="titulos-grupo-label">🏆 Coletivos (${trofeusColetivos.length})</span>
                      <div class="titulo-tags">${renderTrofeus(trofeusColetivos, "coletivo")}</div>
                  </div>
                  <div class="titulos-grupo">
                      <span class="titulos-grupo-label">🌟 Individuais (${trofeusIndividuais.length})</span>
                      <div class="titulo-tags">${renderTrofeus(trofeusIndividuais, "individual")}</div>
                  </div>
              </div>
              ${renderDetalhesCarreira(carreira)}
              <button type="button" class="remover-ranking" data-id="${escaparHTML(carreira.id || "")}" aria-label="Apagar ${escaparHTML(carreira.nome)} do ranking">Apagar</button>
          </li>
      `;
  }).join("");

    renderConquistas();
}

function proximoAno(historico = lerHistorico()) {
    if (historico.length === 0) {
        return ANO_INICIAL;
    }

    const maioresAnos = historico.map((temporada) => Number(temporada.ano) || ANO_INICIAL);
    return Math.max(...maioresAnos) + 1;
}

function atualizarResumoJogador(nome, idade, ano, nacionalidade = obterCarreiraAtual().nacionalidade, clubeId = obterCarreiraAtual().clube) {
    const perfilNome = document.getElementById("perfil-nome");
    const perfilIdade = document.getElementById("perfil-idade");
    const perfilAno = document.getElementById("perfil-ano");
    const perfilSelecao = document.getElementById("perfil-selecao");
    const selecao = SELECOES.find((item) => item.id === nacionalidade);
    const perfilCaps = document.getElementById("perfil-caps");
    const perfilClube = document.getElementById("perfil-clube");
    const clube = obterClube(clubeId);
    const perfilContrato = document.getElementById("perfil-contrato");
    const carreiraAtual = obterCarreiraAtual();
    const limiteRompimentos = getConfig().geral.limiteRompimentosContrato;

    if (perfilNome) perfilNome.textContent = nome || "Jogador";
    if (perfilIdade) perfilIdade.textContent = idade ?? 0;
    if (perfilAno) perfilAno.textContent = ano ?? ANO_INICIAL;
    if (perfilSelecao) perfilSelecao.textContent = selecao ? selecao.nome : "Não definida";
    if (perfilCaps) { const h=lerHistoricoAtiva(); const t=somarTotaisHistorico(h); perfilCaps.textContent=`${t.caps} jogos · ${t.golsSelecao} gols`; }
    if (perfilClube) perfilClube.textContent = clube ? clube.nome : "Ainda não escolhido";
    if (perfilContrato) {
        const contrato = carreiraAtual.anosContratoRestantes > 0
            ? `${carreiraAtual.anosContratoRestantes} ${carreiraAtual.anosContratoRestantes === 1 ? "temporada" : "temporadas"} restantes`
            : clube ? "Vencido" : "Sem contrato";
        perfilContrato.textContent = contrato;
    }
    
    const perfilRompimentos = document.getElementById("perfil-rompimentos");
    if (perfilRompimentos) {
        perfilRompimentos.textContent = `Rompimentos: ${carreiraAtual.rompimentosContratoUsados}/${limiteRompimentos}`;
    }
    
    const statusEl = document.getElementById("perfil-status-clube");
    if (statusEl) {
        const historicoAtual = lerHistoricoAtiva();
        const status = calcularStatusClube(historicoAtual, clubeId);
        if (!clubeId || status.status === "jogador") {
            statusEl.hidden = true;
            statusEl.textContent = "";
            statusEl.removeAttribute("data-status");
        } else {
            statusEl.hidden = false;
            statusEl.textContent = obterStatusClubeTexto(status.status);
            statusEl.dataset.status = status.status;
        }
    }

    const historicoAtual = lerHistoricoAtiva();
    const ultimaTemp = historicoAtual[historicoAtual.length - 1];
    const reputacaoAtual = ultimaTemp ? Number(ultimaTemp.reputacao) || 0 : 0;
    const valorAtual = ultimaTemp ? Number(ultimaTemp.valorMercado) || 0 : 0;
    const salarioAtualMostrar = carreiraAtual.salarioAtual || (ultimaTemp ? Number(ultimaTemp.salario) || 0 : 0);
    
    const perfilRep = document.getElementById("perfil-reputacao");
    if (perfilRep) perfilRep.textContent = reputacaoAtual;
    
    const perfilValor = document.getElementById("perfil-valor");
    if (perfilValor) perfilValor.textContent = formatarValorCompacto(valorAtual);
    
    const perfilSalario = document.getElementById("perfil-salario");
    if (perfilSalario) perfilSalario.textContent = formatarValorCompacto(salarioAtualMostrar);
    const perfilSaldo = document.getElementById("perfil-saldo");
    if (perfilSaldo) perfilSaldo.textContent = formatarValorCompacto(carreiraAtual.saldo || 0);
  
}

function lerHistoricoAtiva() {
    const carreiraAtual = obterCarreiraAtual();
    const historico = lerHistorico();

    if (!carreiraAtual.id || historico.length === 0) {
        return historico;
    }

    return historico.filter((temporada) => {
        if (temporada.carreiraId) {
            return temporada.carreiraId === carreiraAtual.id;
        }

        return temporada.nome === carreiraAtual.nome || temporada.nome === "Jogador";
    });
}

let paginaHistoricoAtual = 0;
const TEMPORADAS_POR_PAGINA = 25;

function renderHistorico() {
    const lista = document.getElementById("lista-temporadas");
    const filtroHistorico = document.getElementById("filtro-historico");
    const criterio = filtroHistorico?.value || "ordem";
    const historico = lerHistoricoAtiva();

    if (!lista) return;

    let paginacao = document.getElementById("paginacao-temporadas");
    if (!paginacao) {
        paginacao = document.createElement("div");
        paginacao.id = "paginacao-temporadas";
        paginacao.className = "paginacao-temporadas";
        paginacao.setAttribute("aria-label", "Paginação do histórico de temporadas");
        lista.insertAdjacentElement("afterend", paginacao);
    }

    if (historico.length === 0) {
        lista.innerHTML = '<li class="temporada-vazia">Nenhuma temporada salva ainda.</li>';
        paginacao.innerHTML = "";
        paginaHistoricoAtual = 0;
        return;
    }

    const temporadas = criterio === "ordem"
        ? historico
        : historico.slice().sort((a, b) => {
              const valorOrdenacao = (temporada) => {
                  if (criterio === "premios") return contarPremios(temporada);
                  if (criterio === "over") return Number(temporada.overall) || 0;
                  if (criterio === "hattricks") return contarHatTricks([temporada]);
                  return Number(temporada[criterio]) || 0;
              };
              const valorA = valorOrdenacao(a);
              const valorB = valorOrdenacao(b);
              return valorB - valorA;
          });

    const renderTrofeus = (trofeus, tipo) => trofeus.length
        ? trofeus.map(t => `<span class="titulo-tag titulo-tag--${tipo}">${escaparHTML(t)}</span>`).join("")
        : '<span class="titulo-tag titulo-tag--vazio">Nenhum</span>';

    // Para históricos longos, renderiza apenas a página visível para evitar
    // reconstruir dezenas/centenas de cards e formatar eventos desnecessariamente.
    const usarPaginacao = temporadas.length > 50;
    const totalPaginas = usarPaginacao ? Math.ceil(temporadas.length / TEMPORADAS_POR_PAGINA) : 1;
    paginaHistoricoAtual = Math.max(0, Math.min(paginaHistoricoAtual, totalPaginas - 1));
    const inicio = usarPaginacao ? paginaHistoricoAtual * TEMPORADAS_POR_PAGINA : 0;
    const temporadasVisiveis = usarPaginacao
        ? temporadas.slice(inicio, inicio + TEMPORADAS_POR_PAGINA)
        : temporadas;

    lista.innerHTML = temporadasVisiveis.map((temporada) => {
        const trofeusColetivos = mapearTrofeusTemporada(temporada, "trofeusColetivos");
        const trofeusIndividuais = mapearTrofeusTemporada(temporada, "trofeusIndividuais");
        const premios = contarPremios(temporada);
        const hatTricks = contarHatTricks([temporada]);
        const clube = obterClube(temporada.clube);

        return `
            <li class="temporada-card">
                <div class="temporada-header">
                    <div class="temporada-ano">
                        <span class="temporada-ano-label">Temporada</span>
                        <strong>${temporada.ano}</strong>
                    </div>
                    <div class="temporada-identidade">
                        <span class="temporada-nome">${escaparHTML(temporada.nome)}</span>
                        <span class="temporada-idade">${temporada.idade} anos</span>
                    </div>
                    <div class="temporada-badges">
                        <span class="badge badge--pos">${escaparHTML(temporada.posicao)}</span>
                        <span class="badge badge--clube">${escaparHTML(clube?.nome || "Sem clube")}</span>
                        <span class="badge badge--over">OVR ${temporada.overall}</span>
                        ${(Number(temporada.reputacao) || 0) > 0 ? `<span class="badge badge--rep">Rep ${temporada.reputacao}</span>` : ""}
                        ${(Number(temporada.valorMercado) || 0) > 0 ? `<span class="badge badge--valor">${formatarValorCompacto(temporada.valorMercado)}</span>` : ""}
                    </div>
                </div>
                
                <div class="temporada-stats-blocos">
                  <div class="temporada-stats temporada-stats--principal">
                      <div class="stat-card stat-card--split">
                          <span class="stat-label">Jogos</span>
                          <strong class="stat-value">${temporada.jogos}</strong>
                          <div class="stat-sub">
                              <span class="stat-sub-item stat-sub-item--clube">🏟️ ${temporada.jogosClube ?? temporada.jogos}</span>
                              <span class="stat-sub-item stat-sub-item--selecao${(temporada.jogosSelecao || 0) === 0 ? " stat-sub-item--vazio" : ""}">🌍 ${temporada.jogosSelecao || 0}</span>
                          </div>
                      </div>
                      <div class="stat-card stat-card--split">
                          <span class="stat-label">Gols</span>
                          <strong class="stat-value stat-value--gol">${temporada.gols}</strong>
                          <div class="stat-sub">
                              <span class="stat-sub-item stat-sub-item--clube">🏟️ ${temporada.golsClube ?? temporada.gols}</span>
                              <span class="stat-sub-item stat-sub-item--selecao${(temporada.golsSelecao || 0) === 0 ? " stat-sub-item--vazio" : ""}">🌍 ${temporada.golsSelecao || 0}</span>
                          </div>
                      </div>
                      <div class="stat-card stat-card--split">
                          <span class="stat-label">Assist.</span>
                          <strong class="stat-value stat-value--assist">${temporada.assistencias}</strong>
                          <div class="stat-sub">
                              <span class="stat-sub-item stat-sub-item--clube">🏟️ ${temporada.assistenciasClube ?? temporada.assistencias}</span>
                              <span class="stat-sub-item stat-sub-item--selecao${(temporada.assistenciasSelecao || 0) === 0 ? " stat-sub-item--vazio" : ""}">🌍 ${temporada.assistenciasSelecao || 0}</span>
                          </div>
                      </div>
                  </div>
                  <div class="temporada-stats temporada-stats--secundaria">
                      <div class="stat-card"><span class="stat-label">Hat-tricks</span><strong class="stat-value">${hatTricks}</strong></div>
                      <div class="stat-card"><span class="stat-label">MOTM</span><strong class="stat-value">${Number(temporada.motm) || 0}</strong></div>
                      <div class="stat-card"><span class="stat-label">Dribles completos</span><strong class="stat-value">${Number(temporada.driblesCompletos) || 0}</strong></div>
                      <div class="stat-card"><span class="stat-label">Desarmes</span><strong class="stat-value">${Number(temporada.desarmes) || 0}</strong></div>
                      <div class="stat-card"><span class="stat-label">Defesas</span><strong class="stat-value">${Number(temporada.defesas) || 0}</strong></div>
                      <div class="stat-card"><span class="stat-label">Jogadas criadas</span><strong class="stat-value">${Number(temporada.jogadasCriadas) || 0}</strong></div>
                      <div class="stat-card"><span class="stat-label">Cartões 🟨/🟥</span><strong class="stat-value">${Number(temporada.cartaoAmarelo) || 0} / ${Number(temporada.cartaoVermelho) || 0}</strong></div>
                      <div class="stat-card"><span class="stat-label">Prêmios</span><strong class="stat-value stat-value--premio">${premios}</strong></div>
                      <div class="stat-card"><span class="stat-label">Salário</span><strong class="stat-value">${formatarValorCompacto(temporada.salario || 0)}</strong></div>
                  </div>
              </div>
                
                <div class="temporada-titulos">
                    <div class="titulos-grupo">
                        <span class="titulos-grupo-label">🏆 Coletivos</span>
                        <div class="titulo-tags">${renderTrofeus(trofeusColetivos, "coletivo")}</div>
                    </div>
                    <div class="titulos-grupo">
                        <span class="titulos-grupo-label">🌟 Individuais</span>
                        <div class="titulo-tags">${renderTrofeus(trofeusIndividuais, "individual")}</div>
                    </div>
                </div>
                <div class="temporada-eventos">
                    <span class="titulos-grupo-label">⚡ Eventos da temporada</span>
                    ${formatarEventosTemporada(temporada.eventos)}
                </div>
                <div class="temporada-footer"><small>${temporada.data}</small></div>
            </li>
        `;
    }).join("");

    if (usarPaginacao) {
        paginacao.innerHTML = `
            <button type="button" data-pagina-historico="anterior" ${paginaHistoricoAtual === 0 ? "disabled" : ""} aria-label="Página anterior">Anterior</button>
            <span aria-live="polite">Página ${paginaHistoricoAtual + 1} de ${totalPaginas} · ${temporadas.length} temporadas</span>
            <button type="button" data-pagina-historico="proxima" ${paginaHistoricoAtual >= totalPaginas - 1 ? "disabled" : ""} aria-label="Próxima página">Próxima</button>`;
        paginacao.querySelectorAll("button[data-pagina-historico]").forEach((botao) => {
            botao.addEventListener("click", () => {
                paginaHistoricoAtual += botao.dataset.paginaHistorico === "proxima" ? 1 : -1;
                renderHistorico();
                lista.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    } else {
        paginacao.innerHTML = "";
    }
}

function formatarEventosTemporada(eventos) {
    const eventosValidos = normalizarEventosTemporada(eventos);
    if (eventosValidos.length === 0) {
        return '<div class="eventos-tags"><span class="evento-tag sem-eventos">Nenhum evento</span></div>';
    }

    const descricoes = {
        "hat-trick": (evento) => `⚽ Hat-trick no jogo ${evento.jogo}: +3 gols`,
        assistencia: (evento) => `🎯 Passe decisivo no jogo ${evento.jogo}: +2 assistências`,
        lesao: (evento) => `🩹 Lesão no jogo ${evento.jogo}: fora por ${evento.jogosPerdidos} ${evento.jogosPerdidos === 1 ? "jogo" : "jogos"}`,
        "lesao-moderada": (evento) => `🤕 Lesão moderada no jogo ${evento.jogo}: fora por ${evento.jogosPerdidos} jogos`,
        "lesao-grave": (evento) => `🏥 Lesão grave no jogo ${evento.jogo}: perdeu o resto da temporada${evento.jogosForaProximaTemporada ? ` e mais ${evento.jogosForaProximaTemporada} jogos da próxima` : ""}`,
        "lesao-carreira": (evento) => `💔 Lesão gravíssima no jogo ${evento.jogo}: encerrou a carreira`,
        "cartao-vermelho": (evento) => `🟥 Cartão vermelho no jogo ${evento.jogo}: suspensão de ${evento.jogosPerdidos} ${evento.jogosPerdidos === 1 ? "jogo" : "jogos"}`,
        "defesa-ultimo-lance": (evento) => `🧤 Defesa no último lance no jogo ${evento.jogo}`,
        "penalti-defendido": (evento) => `🧤 Pênalti defendido no jogo ${evento.jogo}`,
        "falta-defendida": (evento) => `🧤 Cobrança de falta defendida no jogo ${evento.jogo}`,
        "falta-sofrida-goleiro": (evento) => `🤕 Goleiro sofreu falta no jogo ${evento.jogo}`,
        "penalti-causado": (evento) => `⚠️ Cometeu pênalti no jogo ${evento.jogo}`,
        "contra-ataque-desarmado": (evento) => `🛡️ Desarmou um contra-ataque decisivo e garantiu a vitória no jogo ${evento.jogo}`,
        "cartao-amarelo": (evento) => `🟨 Cartão amarelo no jogo ${evento.jogo}`,
        "interceptacao-decisiva": (evento) => `🛡️ Interceptação decisiva no jogo ${evento.jogo}`,
        "suspensao-amarelos": (evento) => `🟨 Acúmulo de amarelos no jogo ${evento.jogo}: suspenso por ${evento.jogosPerdidos} ${evento.jogosPerdidos === 1 ? "jogo" : "jogos"}`,
        "troca-treinador": () => "🔄 Novo treinador chegou ao clube",
        "conflito-treinador": (evento) => `⚔️ Conflito com o treinador: afastado por ${evento.jogosPerdidos} jogos`,
        "idolo-torcida": () => "❤️ Você virou ídolo da torcida",
        "capitao-time": () => "©️ Você foi escolhido capitão do time",
        "aposentadoria-selecao": () => "🌍 Você se aposentou da seleção",
        "pedido-transferencia": () => "📣 Você pediu para ser negociado",
        "rumor-transferencia": (evento) => `📰 Rumores de transferência${evento.clube ? ` envolvendo ${evento.clube}` : ""}`,
        "convocacao-surpresa": () => "🌍 Convocação surpresa para a seleção",
        "pedido-aumento": () => "💶 Você pediu um aumento salarial",
        "aposentadoria-voluntaria": () => "🏁 Você anunciou sua aposentadoria voluntária"
    };

    return `<div class="eventos-tags">${eventosValidos
        .map((evento) => `<span class="evento-tag ${evento.tipo}">${escaparHTML(descricoes[evento.tipo](evento))}</span>`)
        .join("")}</div>`;
}

function proximaIdade(historico = lerHistoricoAtiva()) {
    if (historico.length === 0) {
        const idadeInicial = Number(document.getElementById("idade").value) || 0;
        return idadeInicial;
    }

    const ultimaIdade = Number(historico[historico.length - 1].idade) || 0;
    return ultimaIdade + 1;
}

function validarNumeroInteiro(valor, fallback, minimo = 0) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return fallback;
    }

    const arredondado = Math.floor(numero);
    return Math.max(minimo, arredondado);
}

function obterIdadeLimite() {
    const idadeLimiteInput = document.getElementById("idade-limite");
    const valor = idadeLimiteInput ? idadeLimiteInput.value : "";
    const numero = Number(valor);

    if (!Number.isFinite(numero) || numero <= 0) {
        return IDADE_LIMITE_PADRAO;
    }

    return Math.max(1, Math.floor(numero));
}

function somarTotaisHistorico(historico) {
    return historico.reduce((a, t) => {
        a.jogos += Number(t.jogos) || 0; a.gols += Number(t.gols) || 0; a.assistencias += Number(t.assistencias) || 0;
        a.jogosClube += Number(t.jogosClube ?? t.jogos) || 0; a.golsClube += Number(t.golsClube ?? t.gols) || 0; a.assistenciasClube += Number(t.assistenciasClube ?? t.assistencias) || 0;
        a.jogosSelecao += Number(t.jogosSelecao) || 0; a.golsSelecao += Number(t.golsSelecao) || 0; a.assistenciasSelecao += Number(t.assistenciasSelecao) || 0;
        a.caps += Number(t.jogosSelecao) || 0; a.motm += Number(t.motm) || 0; a.cartaoAmarelo += Number(t.cartaoAmarelo) || 0; a.cartaoVermelho += Number(t.cartaoVermelho) || 0;
        a.cleanSheets += Number(t.cleanSheets) || 0; a.penaltisDefendidos += Number(t.penaltisDefendidos) || 0; a.penaltisCometidos += Number(t.penaltisCometidos) || 0; a.minutosJogados += Number(t.minutosJogados) || 0;
        a.driblesCompletos += Number(t.driblesCompletos) || 0; a.desarmes += Number(t.desarmes) || 0; a.defesas += Number(t.defesas) || 0; a.jogadasCriadas += Number(t.jogadasCriadas) || 0;
        a.premios += contarPremios(t); return a;
    }, { jogos:0,gols:0,assistencias:0,jogosClube:0,golsClube:0,assistenciasClube:0,jogosSelecao:0,golsSelecao:0,assistenciasSelecao:0,caps:0,motm:0,cartaoAmarelo:0,cartaoVermelho:0,cleanSheets:0,penaltisDefendidos:0,penaltisCometidos:0,driblesCompletos:0,desarmes:0,defesas:0,jogadasCriadas:0,minutosJogados:0,premios:0 });
}

function contarHatTricks(temporadas) {
    return temporadas.reduce(
        (total, temporada) => total + (temporada.eventos || []).filter((evento) => evento.tipo === "hat-trick").length,
        0
    );
}

function mostrarResumoFinal(nome, idadeLimite, anoAtual, historico, posicao, opcoes = {}) {

    const totais = somarTotaisHistorico(historico);
    const resumoFinal = document.getElementById("resumo-final");
    const carreiraAtual = obterCarreiraAtual();

    const trofeus = historico.reduce(
        (resultado, temporada) => {
            resultado.coletivos.push(...mapearTrofeusTemporada(temporada, "trofeusColetivos"));
            resultado.individuais.push(...mapearTrofeusTemporada(temporada, "trofeusIndividuais"));
            return resultado;
        },
        { coletivos: [], individuais: [] }
    );

    const carreira = {
        id: carreiraAtual.id || gerarIdRanking(),
        nome,
        posicao: posicao || "-",
        posicaoDetalhe: carreiraAtual.posicaoDetalhe || normalizarPosicaoDetalhada(posicao),
        nacionalidade: carreiraAtual.nacionalidade,
        clube: carreiraAtual.clube,
        idadeLimite,
        jogos: totais.jogos, gols: totais.gols, assistencias: totais.assistencias,
        jogosClube: totais.jogosClube, golsClube: totais.golsClube, assistenciasClube: totais.assistenciasClube,
        jogosSelecao: totais.jogosSelecao, golsSelecao: totais.golsSelecao, assistenciasSelecao: totais.assistenciasSelecao,
        driblesCompletos: totais.driblesCompletos, desarmes: totais.desarmes, defesas: totais.defesas, jogadasCriadas: totais.jogadasCriadas,
        motmTotal: totais.motm, cartoesTotais: { amarelos: totais.cartaoAmarelo, vermelhos: totais.cartaoVermelho },
        premios: totais.premios,
        trofeusColetivos: trofeus.coletivos,
        trofeusIndividuais: trofeus.individuais,
        // Cópia permanente para os detalhes do ranking continuarem disponíveis
        // mesmo quando o histórico temporário da tela for limpo.
        temporadas: historico.map((temporada) => ({ ...temporada })),
        pontuacao: 0,
        data: new Date().toLocaleString("pt-BR")
    };

    carreira.pontuacao = calcularPontuacao(carreira);

    document.getElementById("nome").value = nome;
    document.getElementById("idade").value = idadeLimite;
    atualizarResumoJogador(nome, idadeLimite, anoAtual, carreiraAtual.nacionalidade, carreiraAtual.clube);

    document.getElementById("jogos").textContent = totais.jogos;
    document.getElementById("gols").textContent = totais.gols;
    document.getElementById("assi").textContent = totais.assistencias;
    document.getElementById("prem").textContent = totais.premios;

    document.getElementById("resumo-nome").textContent = nome;
    document.getElementById("resumo-posicao").textContent = posicao || "-";
    const resumoSelecao = document.getElementById("resumo-selecao");
    const selecao = SELECOES.find((item) => item.id === carreiraAtual.nacionalidade);
    if (resumoSelecao) resumoSelecao.textContent = selecao ? selecao.nome : "Não definida";
    const resumoClube = document.getElementById("resumo-clube");
    if (resumoClube) resumoClube.textContent = obterClube(carreiraAtual.clube)?.nome || "Não definido";
    
    const idadeEncerramento = historico.length > 0
        ? (Number(historico[historico.length - 1].idade) || idadeLimite)
        : idadeLimite;
    document.getElementById("resumo-idade-limite").textContent = idadeEncerramento;
  
    document.getElementById("resumo-jogos").textContent = totais.jogos;
    document.getElementById("resumo-gols").textContent = totais.gols;
    document.getElementById("resumo-assistencias").textContent = totais.assistencias;
    document.getElementById("resumo-hat-tricks").textContent = contarHatTricks(historico);
    document.getElementById("resumo-premios").textContent = totais.premios;
    const setResumo=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
    setResumo("resumo-caps",totais.caps); setResumo("resumo-gols-selecao",totais.golsSelecao); setResumo("resumo-assistencias-selecao",totais.assistenciasSelecao);
    setResumo("resumo-jogos-clube",totais.jogosClube); setResumo("resumo-motm",totais.motm); setResumo("resumo-cartoes",`${totais.cartaoAmarelo} amarelos / ${totais.cartaoVermelho} vermelhos`);
    setResumo("resumo-dribles-completos", totais.driblesCompletos);
    setResumo("resumo-desarmes", totais.desarmes);
    setResumo("resumo-defesas", totais.defesas);
    setResumo("resumo-jogadas-criadas", totais.jogadasCriadas);
    document.getElementById("resumo-coletivos").textContent = formatarTrofeus(trofeus.coletivos);
    document.getElementById("resumo-individuais").textContent = formatarTrofeus(trofeus.individuais);

    const reputacoes = historico.map(t => Number(t.reputacao) || 0).filter(Boolean);
    const valores = historico.map(t => Number(t.valorMercado) || 0).filter(Boolean);
    const salarios = historico.map(t => Number(t.salario) || 0).filter(Boolean);
    const ganhosTotais = historico.reduce((s, t) => s + (Number(t.rendaTemporada ?? t.salario) || 0), 0);
    
    const setTexto = (id, valor) => {
        const el = document.getElementById(id);
        if (el) el.textContent = valor;
    };
    
    setTexto("resumo-reputacao-max", reputacoes.length ? Math.max(...reputacoes) : 0);
    setTexto("resumo-valor-max", formatarValorCompacto(valores.length ? Math.max(...valores) : 0));
    setTexto("resumo-salario-max", formatarValorCompacto(salarios.length ? Math.max(...salarios) : 0));
    setTexto("resumo-ganhos-totais", formatarValorCompacto(ganhosTotais));

    const rankingAtual = lerRanking();
    const indiceExistente = rankingAtual.findIndex(
        (registro) => String(registro.id) === String(carreira.id)
    );

    if (indiceExistente >= 0) {
        rankingAtual[indiceExistente] = carreira;
    } else {
        rankingAtual.push(carreira);
    }

    salvarRanking(rankingAtual);

    const filtroCarreiraConquistas = document.getElementById("filtro-carreira-conquistas");
    if (filtroCarreiraConquistas) {
        filtroCarreiraConquistas.value = String(carreira.id);
    }

    renderRanking();

    atualizarNotificacaoConquista(carreira, true);

    const resultados = document.getElementById("resultados");
    if (resultados) {
        resultados.hidden = true;
    }
    if (resumoFinal) {
        resumoFinal.hidden = false;
    }

    const clubeDespedida = obterClubeDespedida(historico);
    const statusClube = calcularStatusClube(historico, clubeDespedida);
    const resumoStatusClube = document.getElementById("resumo-status-clube");
    if (resumoStatusClube) {
        resumoStatusClube.textContent = obterStatusClubeTexto(statusClube.status);
    }
    const statusEl = document.getElementById("perfil-status-clube");
    if (statusEl) {
        statusEl.textContent = obterStatusClubeTexto(statusClube.status);
    }
}

function obterNomeAtual() {
    const campoNome = document.getElementById("nome");
    const nomeDigitado = campoNome ? campoNome.value.trim() : "";

    if (nomeDigitado) {
        return nomeDigitado;
    }

    const carreiraAtual = obterCarreiraAtual();
    if (carreiraAtual.nome && carreiraAtual.nome !== "Jogador") {
        return carreiraAtual.nome;
    }

    const historico = lerHistorico();
    if (historico.length > 0) {
        return historico[historico.length - 1].nome || "Jogador";
    }

    return "Jogador";
}

function validarDadosJogador({ nome, idade, idadeLimite, posicao, nacionalidade }) {
    const nomeValidado = normalizarNome(nome);
    if (!nomeValidado) {
        return { valido: false, mensagem: "Informe um nome válido para o jogador." };
    }

    const idadeNumero = Number(idade);
    if (!Number.isFinite(idadeNumero) || idadeNumero < 0 || idadeNumero > 99) {
        return { valido: false, mensagem: "Informe uma idade inicial válida entre 0 e 99 anos." };
    }

    const idadeLimiteNumero = Number(idadeLimite);
    if (!Number.isFinite(idadeLimiteNumero) || idadeLimiteNumero < idadeNumero) {
        return { valido: false, mensagem: "A idade limite deve ser maior que a idade inicial." };
    }

    if (!posicao || !categoriaPosicao(posicao)) {
        return { valido: false, mensagem: "Selecione uma posição válida para a carreira." };
    }

    if (!SELECOES.some((selecao) => selecao.id === nacionalidade)) {
        return { valido: false, mensagem: "Selecione uma nacionalidade válida para a carreira." };
    }

    return { valido: true, nome: nomeValidado, idade: Math.floor(idadeNumero), idadeLimite: Math.floor(idadeLimiteNumero), posicao, nacionalidade };
}

function obterHistoricoDaCarreira(nome, dadosPosicao) {
    const historico = lerHistorico();
    const carreiraAtual = obterCarreiraAtual();

    if (!carreiraAtual.id || historico.length === 0) {
        return historico;
    }

    return historico.filter((temporada) => {
        if (temporada.carreiraId) {
            return temporada.carreiraId === carreiraAtual.id;
        }

        return temporada.nome === nome && temporada.posicao === dadosPosicao.nome;
    });
}

const ATRIBUTOS_NOMES = {
    finalizacao: "Finalização", passe: "Passe", drible: "Drible",
    velocidade: "Velocidade", defesa: "Defesa", fisico: "Físico", reflexos: "Reflexos"
};

function limitarAtributo(valor) { return Math.max(1, Math.min(99, Math.round(Number(valor) || 1))); }

function normalizarAtributos(atributos, posicao, idade = 18) {
    const bases = {
        ata: { finalizacao: 64, passe: 48, drible: 59, velocidade: 63, defesa: 24, fisico: 55, reflexos: 12 },
        me:  { finalizacao: 48, passe: 65, drible: 62, velocidade: 56, defesa: 45, fisico: 53, reflexos: 12 },
        zag: { finalizacao: 22, passe: 43, drible: 35, velocidade: 48, defesa: 67, fisico: 66, reflexos: 12 },
        go:  { finalizacao: 1, passe: 38, drible: 18, velocidade: 38, defesa: 20, fisico: 57, reflexos: 68 }
    };
    const base = bases[posicao] || bases.ata;
    const dados = {};
    Object.keys(ATRIBUTOS_NOMES).forEach((chave) => {
        const valor = atributos && Number.isFinite(Number(atributos[chave]))
            ? Number(atributos[chave])
            : base[chave] + Math.max(0, Math.min(8, 25 - Number(idade || 18))) * 1.4;
        dados[chave] = limitarAtributo(valor);
    });
    return dados;
}

function evoluirAtributos(temporadasAnteriores, posicao, idade, potencial = 85) {
    const anterior = temporadasAnteriores.length
        ? normalizarAtributos(temporadasAnteriores[temporadasAnteriores.length - 1].atributos, posicao, idade - 1)
        : normalizarAtributos(null, posicao, idade);
    const resultado = {};

    Object.keys(ATRIBUTOS_NOMES).forEach((chave) => {
        let variacao = 0;

        // Curva mais generosa: 18-20: +2 a +6 | 21-23: +2 a +5 | 24-27: +1 a +3
        // 28-30: +0 a +1 | 31-33: ~estável | 34+: queda
        if (idade <= 20) {
            variacao = Math.random() < 0.90 ? 2 + Math.floor(Math.random() * 5) : 0;
        } else if (idade <= 23) {
            variacao = Math.random() < 0.85 ? 2 + Math.floor(Math.random() * 4) : 0;
        } else if (idade <= 27) {
            variacao = Math.random() < 0.75 ? 1 + Math.floor(Math.random() * 3) : 0;
        } else if (idade <= 30) {
            variacao = Math.random() < 0.60 ? 1 : 0;
        } else if (idade <= 33) {
            variacao = Math.random() < 0.30 ? 1 : (Math.random() < 0.40 ? -1 : 0);
        } else if (idade <= 36) {
            variacao = Math.random() < 0.70 ? -1 : 0;
        } else {
            variacao = -(1 + Math.floor(Math.random() * 2));
        }

        // Teto deste atributo, dado o potencial do jogador e sua posição.
        const modificador = obterModificadorPotencial(chave, posicao);
        const teto = Math.min(99, Math.round(potencial * modificador));

        let novoValor = anterior[chave] + variacao;

        // Não deixa crescer acima do teto — o jogador bate o próprio limite.
        if (variacao > 0 && novoValor > teto) {
            novoValor = teto;
        }

        // Reflexos: goleiros treinam, jogadores de linha não.
        if (chave === "reflexos" && posicao !== "go") {
            resultado[chave] = limitarAtributo(Math.min(20, novoValor));
        } else {
            resultado[chave] = limitarAtributo(novoValor);
        }
    });

    return resultado;
}

function mediaAtributos(atributos, chaves) {
    return chaves.reduce((total, chave) => total + (Number(atributos[chave]) || 0), 0) / chaves.length;
}

function renderAtributos(temporada) {
    const painel = document.getElementById("painel-atributos");
    if (!painel) return;
    if (!temporada) {
        painel.innerHTML = '<p class="atributos-vazio">Gere uma temporada para acompanhar a evolução do jogador.</p>';
        return;
    }
    const posicao = temporada.posicaoKey || normalizarPosicao(temporada.posicao) || "ata";
    const atributos = normalizarAtributos(temporada.atributos, posicao, temporada.idade);

    // *** NOVO: overall da engine ***
    const overall = temporada.overall || calcularOverall(posicao, atributos);

    const anterior = lerHistoricoAtiva()
        .filter((item) => item.ano < temporada.ano)
        .sort((a, b) => b.ano - a.ano)[0];
    const atributosAnteriores = anterior
        ? normalizarAtributos(anterior.atributos, anterior.posicaoKey || normalizarPosicao(anterior.posicao) || "ata", anterior.idade)
        : null;

    const linhas = Object.entries(ATRIBUTOS_NOMES).map(([chave, nome]) => {
        const valor = atributos[chave];
        const diferenca = atributosAnteriores ? valor - atributosAnteriores[chave] : 0;
        const tendencia = !atributosAnteriores
            ? "Primeira temporada"
            : diferenca > 0 ? `+${diferenca} nesta temporada`
            : diferenca < 0 ? `${diferenca} nesta temporada`
            : "Estável nesta temporada";
        const classe = diferenca > 0 ? "atributo-subiu" : diferenca < 0 ? "atributo-caiu" : "";
        return `<div class="atributo-linha"><div class="atributo-cabecalho"><span>${nome}</span><strong>${valor}<small class="${classe}">${tendencia}</small></strong></div><div class="atributo-trilho"><span class="${classe}" style="width:${valor}%"></span></div></div>`;
    }).join("");

    const fase = temporada.idade < 23 ? "Em desenvolvimento"
        : temporada.idade <= 28 ? "Pico de evolução"
        : temporada.idade <= 32 ? "Experiência e maturidade"
        : "Declínio físico";

    painel.innerHTML = `
        <div class="atributos-resumo">
            <div><span>Overall</span><strong>${overall}</strong></div>
            <div><span>Fase da carreira</span><strong>${fase}</strong></div>
        </div>
        <div class="atributos-lista">${linhas}</div>`;
}

/* ========== Nova engine de simulação por overall ========== */

// Amostra uma Poisson (Knuth). Serve para "quantos gols nesse jogo".
function amostrarPoisson(lambda) {
    if (lambda <= 0) return 0;
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}

/* ============================================================
   Potencial — teto de evolução por jogador.
   Derivado do id da carreira (estável, sem precisar salvar).
   Distribuição:
     30% → 78-85  (comum)
     35% → 85-91  (bom)
     25% → 91-95  (craque)
     10% → 95-99  (gênio)
   ============================================================ */
function calcularPotencialDaCarreira(carreira) {
    if (carreira && Number.isFinite(Number(carreira.potencial))) {
        return Math.max(60, Math.min(99, Math.round(Number(carreira.potencial))));
    }

    const seed = String(carreira?.id || carreira?.nome || "jogador-padrao");
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);

    const r = (hash % 1000) / 1000;
    if (r < 0.30) return 78 + (hash % 8);   // 78-85
    if (r < 0.65) return 85 + (hash % 7);   // 85-91
    if (r < 0.90) return 91 + (hash % 5);   // 91-95
    return 95 + (hash % 5);                  // 95-99
}

function obterModificadorPotencial(chave, posicao) {
    const modificadores = {
        ata: { finalizacao: 1.05, drible: 1.05, velocidade: 1.00, passe: 0.90, fisico: 0.85, defesa: 0.60, reflexos: 0.10 },
        me:  { finalizacao: 1.00, drible: 1.00, velocidade: 1.00, passe: 1.10, fisico: 1.00, defesa: 0.85, reflexos: 0.10 },
        zag: { finalizacao: 0.60, drible: 0.85, velocidade: 1.00, passe: 1.00, fisico: 1.05, defesa: 1.05, reflexos: 0.10 },
        go:  { finalizacao: 0.30, drible: 0.50, velocidade: 0.85, passe: 1.00, fisico: 1.00, defesa: 1.00, reflexos: 1.10 }
    };
    return modificadores[posicao]?.[chave] ?? 1.0;
}

// Simula a temporada jogo a jogo com base no overall e nos atributos.
function simularTemporadaPorJogo(posicao, atributos, idade, jogosForaInicioTemporada = 0, posicaoDetalhe = "", nacionalidade = "", clubeId = "", temporadasAnteriores = []) {
    const cfg = getConfig(), overall = calcularOverall(posicao, atributos);
    const fatorIdade = idade <= 19 ? .82 : idade <= 22 ? .92 : idade <= 25 ? 1 : idade <= 29 ? 1.05 : idade <= 32 ? 1 : idade <= 35 ? .88 : .72;
    const historicoEventos = temporadasAnteriores.flatMap(t => Array.isArray(t.eventos) ? t.eventos : []);
    const ultimaTemporada = temporadasAnteriores[temporadasAnteriores.length - 1];
    const houveTrocaTreinador = (ultimaTemporada?.eventos || []).some(e => e.tipo === "troca-treinador");
    const eCapitao = historicoEventos.some(e => e.tipo === "capitao-time" && e.clube === clubeId);
    const probParticipar = Math.max(.05, Math.min(.99, ((overall - 10) / 90) * fatorIdade * (houveTrocaTreinador ? .94 : 1) * (eCapitao ? 1.025 : 1)));
    const maxJogosClube = clubeId ? Math.round((posicao === "go" ? 45 : 50) * (cfg.geral.multiplicadorJogos || 1)) : 0;
    const fin=Number(atributos?.finalizacao)||OVERALL_PADRAO, pas=Number(atributos?.passe)||OVERALL_PADRAO, dri=Number(atributos?.drible)||OVERALL_PADRAO;
    const carreiraAtualRef = typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
    const idadeAposentadoriaSelecao = Number(cfg.geral.idadeAposentadoriaSelecao) || 32;
    const aposentadoSelecao = temporadasAnteriores.some(t => (t.eventos || []).some(e => e.tipo === "aposentadoria-selecao"))
        || (carreiraAtualRef.aposentadoriaSelecao === true && idade >= idadeAposentadoriaSelecao);

    let lambdaGol=0, lambdaAssist=0;
    if(posicao==="ata"){lambdaGol=Math.pow(fin/100,3)+Math.pow(dri/100,3)*.15;lambdaAssist=Math.pow(pas/100,2.5)*.45+Math.pow(dri/100,3)*.15;}
    else if(posicao==="me"){lambdaGol=Math.pow(fin/100,3)*.55+Math.pow(dri/100,3)*.1;lambdaAssist=Math.pow(pas/100,2.5)*.85+Math.pow(dri/100,3)*.2;}
    else if(posicao==="zag"){lambdaGol=Math.pow(fin/100,3)*.15;lambdaAssist=Math.pow(pas/100,3)*.15;}
    else {lambdaGol=.003;lambdaAssist=Math.pow(pas/100,4)*.06;}
    lambdaGol*=fatorIdade*(cfg.geral.multiplicadorGols||1); lambdaAssist*=fatorIdade*(cfg.geral.multiplicadorAssistencias||1);
    const cfgL=cfg.lesoes||{}, escala=(idade>=33?(Number(cfgL.fatorIdoso)||1.8):idade>=29?(Number(cfgL.fatorVeterano)||1.3):idade<=24?(Number(cfgL.fatorJovem)||.8):1)*(Number.isFinite(Number(cfgL.multiplicador))?Math.max(0,Number(cfgL.multiplicador)):1);

    // ====== Configuração de cartões ======
    const cfgC = cfg.cartoes || {};
    const chanceAmareloBase   = Math.max(0, Number(cfgC.chanceAmareloBase)   || 0.08);
    const chanceVermelhoBase  = Math.max(0, Number(cfgC.chanceVermelhoBase)  || 0.004);
    const chanceDoisAmarelosMesmoJogo = Math.max(0, Math.min(1, Number(cfgC.chanceDoisAmarelosMesmoJogo ?? 0.02)));
    const limiteAmarelosSuspensao = Math.max(1, Math.floor(Number(cfgC.limiteAmarelosSuspensao) || 5));
    const fatorCartaoPosicao = {
        ata: Number(cfgC.fatorAtacante) || 0.35,
        me:  Number(cfgC.fatorMeia)     || 0.9,
        zag: Number(cfgC.fatorZagueiro) || 1.2,
        go:  Number(cfgC.fatorGoleiro)  || 0.15
    }[posicao] || 1;
    const fatorFisicoCartao = 1 + (100 - (Number(atributos?.fisico) || 50)) / 200;
    const chanceCartaoAmarelo = chanceAmareloBase * fatorCartaoPosicao * fatorFisicoCartao;

    const cCar=Math.max(0,(Number(cfgL.chanceCarreira)||.00003)*escala), cGr=cCar+Math.max(0,(Number(cfgL.chanceGrave)||.0003)*escala), cMo=cGr+Math.max(0,(Number(cfgL.chanceModerada)||.0015)*escala), cLe=cMo+Math.max(0,(Number(cfgL.chanceLeve)||.012)*escala);
    let jogosClube=0,golsClube=0,assistenciasClube=0,jogosAfastado=Math.max(0,Math.floor(jogosForaInicioTemporada)||0),motm=0,cartaoAmarelo=0,cartaoVermelho=0,cleanSheets=0,penaltisDefendidos=0,penaltisCometidos=0;
    let amarelosDesdeUltimaSuspensao = 0;   // NOVO
    const eventos=[]; let lesaoGrave=false,lesaoCarreira=false,jogosForaProximaTemporada=0;
    // Eventos narrativos fora de campo: cada um é registrado uma vez por temporada.
    if (clubeId && Math.random() < .05) eventos.push({ tipo: "troca-treinador", jogo: 0, clube: clubeId });
    if (clubeId && temporadasAnteriores.filter(t => t.clube === clubeId).length >= 4 &&
        !historicoEventos.some(e => e.tipo === "idolo-torcida" && e.clube === clubeId) && Math.random() < .15) {
        eventos.push({ tipo: "idolo-torcida", jogo: 0, clube: clubeId });
    }
    if (clubeId && temporadasAnteriores.filter(t => t.clube === clubeId).length >= 2 &&
        overall > 80 && !historicoEventos.some(e => e.tipo === "capitao-time" && e.clube === clubeId) && Math.random() < .10) {
        eventos.push({ tipo: "capitao-time", jogo: 0, clube: clubeId });
    }
    if (clubeId && overall > 75 && Math.random() < .035) eventos.push({ tipo: "pedido-aumento", jogo: 0, clube: clubeId });
    if (clubeId && temporadasAnteriores.length >= 1 && Math.random() < .045) eventos.push({ tipo: "rumor-transferencia", jogo: 0, clube: clubeId });
    if (clubeId && temporadasAnteriores.filter(t => t.clube === clubeId).length >= 2 && overall < 68 && Math.random() < .015) {
        eventos.push({ tipo: "pedido-transferencia", jogo: 0, clube: clubeId });
    }

    for(let i=0;i<maxJogosClube;i++){
      if(jogosAfastado>0){jogosAfastado--;continue;} if(Math.random()>probParticipar)continue;
      jogosClube++; let golsJ=amostrarPoisson(lambdaGol), assJ=amostrarPoisson(lambdaAssist); const numeroJogo=jogosClube;
      // Um conflito pode afastar o jogador e reduzir sua participação nos jogos seguintes.
      if (posicao === "ata" && overall > 75 && Math.random() < .02) {
          const perdidos = 2 + Math.floor(Math.random() * 4);
          eventos.push({ tipo: "conflito-treinador", jogo: numeroJogo, jogosPerdidos: perdidos, clube: clubeId });
          jogosAfastado = Math.max(jogosAfastado, perdidos);
      }
      golsClube+=golsJ;assistenciasClube+=assJ;
      if(Math.random()<({ata:.04,me:.025,zag:.008,go:0}[posicao]||0)){golsClube+=3;golsJ+=3;eventos.push({tipo:"hat-trick",jogo:numeroJogo});}
      if(Math.random()<({ata:.008,me:.012,zag:.003,go:.001}[posicao]||0)){assistenciasClube+=2;assJ+=2;eventos.push({tipo:"assistencia",jogo:numeroJogo});}
      let cleanSheetNesteJogo = false;
      if(posicao==="go"){
        cleanSheetNesteJogo = Math.random()<.30; if(cleanSheetNesteJogo)cleanSheets++; if(Math.random()<.012){eventos.push({tipo:"defesa-ultimo-lance",jogo:numeroJogo});}
        if(Math.random()<.012){penaltisDefendidos++;eventos.push({tipo:"penalti-defendido",jogo:numeroJogo});}
        if(Math.random()<.003){penaltisCometidos++;eventos.push({tipo:"penalti-causado",jogo:numeroJogo});}
      }
      if(posicao==="zag"&&["ZCE","ZCD"].includes(posicaoDetalhe)&&Math.random()<.04)eventos.push({tipo:"interceptacao-decisiva",jogo:numeroJogo});

      // ====== CARTÕES (nova lógica) ======
      let expulsoNesteJogo = false;

      // 1) Amarelo (e eventual 2º amarelo no MESMO jogo → vermelho)
      if (Math.random() < chanceCartaoAmarelo) {
          cartaoAmarelo++;
          amarelosDesdeUltimaSuspensao++;
          eventos.push({ tipo: "cartao-amarelo", jogo: numeroJogo });

          if (Math.random() < chanceDoisAmarelosMesmoJogo) {
              cartaoAmarelo++;
              amarelosDesdeUltimaSuspensao++;
              eventos.push({ tipo: "cartao-amarelo", jogo: numeroJogo });
              cartaoVermelho++;
              eventos.push({ tipo: "cartao-vermelho", jogo: numeroJogo, jogosPerdidos: 1 });
              jogosAfastado = Math.max(jogosAfastado, 1);
              amarelosDesdeUltimaSuspensao = 0;
              expulsoNesteJogo = true;
          }
      }

      // 2) Vermelho direto
      if (!expulsoNesteJogo && Math.random() < chanceVermelhoBase) {
          cartaoVermelho++;
          const perdidos = 1 + Math.floor(Math.random() * 2);
          eventos.push({ tipo: "cartao-vermelho", jogo: numeroJogo, jogosPerdidos: perdidos });
          jogosAfastado = Math.max(jogosAfastado, perdidos);
          amarelosDesdeUltimaSuspensao = 0;
          expulsoNesteJogo = true;
      }

      // 3) Acúmulo de amarelos → 1 jogo de suspensão
      if (!expulsoNesteJogo && amarelosDesdeUltimaSuspensao >= limiteAmarelosSuspensao) {
          jogosAfastado = Math.max(jogosAfastado, 1);
          eventos.push({ tipo: "suspensao-amarelos", jogo: numeroJogo, jogosPerdidos: 1 });
          amarelosDesdeUltimaSuspensao = 0;
      }

      let chanceMOTM=.015+golsJ*.14+assJ*.09;
      if(posicao==="go"&&cleanSheetNesteJogo)chanceMOTM+=.18;
      if(posicao==="zag"&&eventos.some(e=>e.jogo===numeroJogo&&e.tipo==="interceptacao-decisiva"))chanceMOTM+=.12;
      if(Math.random()<Math.min(chanceMOTM,.60))motm++;
      const lesao=Math.random();
      if(lesao<cCar){eventos.push({tipo:"lesao-carreira",jogo:numeroJogo,idade});lesaoCarreira=true;break;}
      if(lesao<cGr){const perdidos=maxJogosClube-i,prox=Math.floor(Math.random()*25);eventos.push({tipo:"lesao-grave",jogo:numeroJogo,jogosPerdidos:perdidos,jogosForaProximaTemporada:prox});lesaoGrave=true;jogosForaProximaTemporada=prox;break;}
      if(lesao<cMo)jogosAfastado=Math.max(jogosAfastado, 8+Math.floor(Math.random()*13));
      else if(lesao<cLe)jogosAfastado=Math.max(jogosAfastado, 1+Math.floor(Math.random()*6));
    }
    // Seleção: convocação depende de overall, idade, força nacional e histórico; não substitui jogos do clube.
    const selecao=SELECOES.find(x=>x.id===nacionalidade), potencia=Number(cfg.selecao?.potencias?.[nacionalidade])||50;
    const jogaEuropa=!!obterClube(clubeId)?.pais && ["Inglaterra","Espanha","Alemanha","Itália","França","Portugal","Holanda"].some(p=>String(obterClube(clubeId).pais).includes(p));
    const convocacoesAnteriores=temporadasAnteriores.filter(t=>t.convocado||Number(t.jogosSelecao)>0).length;
    let chanceConvocacao=Math.max(0,Math.min(.95,(overall-65)/35));
    chanceConvocacao+=Math.max(0,potencia-50)/250+(jogaEuropa?.06:0)+Math.min(.18,convocacoesAnteriores*.035);
    if(idade<18)chanceConvocacao*=.25;else if(idade>35)chanceConvocacao*=.7;
    chanceConvocacao=Math.max(0,Math.min(.95,chanceConvocacao));

    let convocado = !aposentadoSelecao && !!selecao && Math.random() < chanceConvocacao && !lesaoCarreira;
    if (!convocado && !aposentadoSelecao && !!selecao && !lesaoCarreira && idade <= 30 && overall >= 72 && Math.random() < .025) {
        convocado = true;
        eventos.push({ tipo: "convocacao-surpresa", jogo: 0 });
    }
    // A aposentadoria da seleção persiste no histórico, não apenas na temporada atual.
    let jogosSelecao=0,golsSelecao=0,assistenciasSelecao=0;const jogosSelecaoPorCompeticao={},golsSelecaoPorCompeticao={};
    if(convocado){
      const ano=Number(temporadasAnteriores.length?temporadasAnteriores[temporadasAnteriores.length-1].ano+1:ANO_INICIAL);
      const anoTorneio = ano >= ANO_BASE_COPA_DO_MUNDO_SELECOES + 2
        && (ano - (ANO_BASE_COPA_DO_MUNDO_SELECOES + 2)) % CICLO_COPA_DO_MUNDO_SELECOES === 0;
      const maxSelecao=(8+Math.floor(Math.random()*5)+(anoTorneio?4:0));
      for(let i=0;i<maxSelecao;i++){if(Math.random()>Math.min(.98,probParticipar+.08))continue;jogosSelecao++;
        const competicao=anoTorneio&&i>=8?(selecao.regiao==="europa"?"Continental":"Copa"):i%3===0?"Eliminatórias":"Amistoso";
        jogosSelecaoPorCompeticao[competicao]=(jogosSelecaoPorCompeticao[competicao]||0)+1;
        const g=amostrarPoisson(lambdaGol*.58),a=amostrarPoisson(lambdaAssist*.62);golsSelecao+=g;assistenciasSelecao+=a;golsSelecaoPorCompeticao[competicao]=(golsSelecaoPorCompeticao[competicao]||0)+g;
      }
    }
    return {jogosClube,golsClube,assistenciasClube,jogosSelecao,golsSelecao,assistenciasSelecao,convocado,jogosSelecaoPorCompeticao,golsSelecaoPorCompeticao,
      jogos:jogosClube+jogosSelecao,gols:golsClube+golsSelecao,assistencias:assistenciasClube+assistenciasSelecao,
      motm,cartaoAmarelo,cartaoVermelho,cleanSheets,penaltisDefendidos,penaltisCometidos,minutosJogados:Math.round((jogosClube+jogosSelecao)*90*(.5+overall/200)),overall,eventos,lesaoGrave,lesaoCarreira,jogosForaProximaTemporada};
}

function criarTemporada(nome, idade, ano, posicao, temporadasAnteriores = [], nacionalidade = "", clubeId = "") {
    const posicaoDetalhe = normalizarPosicaoDetalhada(posicao);
    const categoria = categoriaPosicao(posicao);
    const dados = posicoes[categoria];
    if (!dados) {
        throw new Error(`Posição inválida: ${posicao}`);
    }
    const carreiraAtual = obterCarreiraAtual();

    // NOVO: se a temporada anterior teve lesão grave, o jogador começa
    // a atual já afastado por N jogos.
    const ultima = temporadasAnteriores[temporadasAnteriores.length - 1];
    const jogosForaInicio = ultima?.jogosForaProximaTemporada || 0;

    const atributos = evoluirAtributos(temporadasAnteriores, categoria, idade, carreiraAtual.potencial);
    const overall = calcularOverall(categoria, atributos);
    const sim = simularTemporadaPorJogo(categoria, atributos, idade, jogosForaInicio, posicaoDetalhe, nacionalidade, clubeId, temporadasAnteriores);

    const trofeus = gerarTrofeusTemporada(
        dados.nome, sim.jogos, sim.gols, sim.assistencias,
        ano, idade, temporadasAnteriores, nacionalidade, clubeId, sim.eventos,
        overall, posicaoDetalhe, sim.convocado, atributos
    );

    const clube = obterClube(clubeId);

    return {
        nome, idade,
        posicao: POSICOES_CAMPO[posicaoDetalhe]?.nome || dados.nome,
        posicaoKey: categoria,
        posicaoDetalhe,
        nacionalidade,
        clube: clube ? clube.id : "",
        ano,
        jogos: sim.jogos, gols: sim.gols, assistencias: sim.assistencias,
        jogosClube: sim.jogosClube, golsClube: sim.golsClube, assistenciasClube: sim.assistenciasClube,
        jogosSelecao: sim.jogosSelecao, golsSelecao: sim.golsSelecao, assistenciasSelecao: sim.assistenciasSelecao, convocado: sim.convocado,
        jogosSelecaoPorCompeticao: sim.jogosSelecaoPorCompeticao, golsSelecaoPorCompeticao: sim.golsSelecaoPorCompeticao,
        motm: sim.motm, cartaoAmarelo: sim.cartaoAmarelo, cartaoVermelho: sim.cartaoVermelho, cleanSheets: sim.cleanSheets,
        penaltisDefendidos: sim.penaltisDefendidos, penaltisCometidos: sim.penaltisCometidos, minutosJogados: sim.minutosJogados,
        eventos: sim.eventos,
        overall: overall,
        potencial: carreiraAtual.potencial,
        atributos: atributos,
        trofeusColetivos: trofeus.trofeusColetivos,
        trofeusIndividuais: trofeus.trofeusIndividuais,
        lesaoGrave: sim.lesaoGrave || false,                    // NOVO
        lesaoCarreira: sim.lesaoCarreira || false,              // NOVO
        jogosForaProximaTemporada: sim.jogosForaProximaTemporada || 0, // NOVO
        data: new Date().toLocaleString("pt-BR"),
        carreiraId: carreiraAtual.id || gerarIdRanking()
    };
}

function exibirEscolhaClube(opcoes, titulo, mensagem, clubeSelecionado = "", exibirFiltroLiga = false) {
    const overlay = document.getElementById("modal-confirmacao");
    const tituloEl = document.getElementById("modal-titulo");
    const mensagemEl = document.getElementById("modal-mensagem");
    const opcoesEl = document.getElementById("modal-opcoes-clube");
    const btnCancelar = document.getElementById("modal-cancelar");
    const btnConfirmar = document.getElementById("modal-confirmar");
    const filtroLigaContainer = document.getElementById("filtro-liga-clube-alvo");
    const filtroLiga = document.getElementById("selecionar-liga-clube-alvo");
    const icone = overlay?.querySelector(".modal-icone");

    if (!overlay || !tituloEl || !mensagemEl || !opcoesEl || !btnCancelar || !btnConfirmar) {
        throw new Error("O diálogo para escolha de clube não está disponível.");
    }

    return new Promise((resolve) => {
        const tituloAnterior = tituloEl.textContent;
        const mensagemAnterior = mensagemEl.textContent;
        const cancelarAnterior = btnCancelar.textContent;
        const confirmarAnterior = btnConfirmar.textContent;
        const classeConfirmarAnterior = btnConfirmar.className;
        const iconeAnterior = icone?.textContent;
        const clubeInicial = opcoes.some((clube) => clube.id === clubeSelecionado)
            ? clubeSelecionado
            : opcoes[0]?.id;

        const clubeAlvo = exibirFiltroLiga;
        let clubeSelecionadoAtual = clubeInicial;
        if (filtroLigaContainer && filtroLiga) {
            filtroLigaContainer.hidden = !clubeAlvo;
            filtroLiga.value = "";
        }
        if (clubeAlvo && filtroLiga) {
            const ligas = [...new Set(opcoes.map((clube) => clube.liga).filter(Boolean))];
            filtroLiga.innerHTML = '<option value="">Todas as ligas</option>' +
                ligas.map((liga) => `<option value="${escaparHTML(liga)}">${escaparHTML(liga)}</option>`).join("");
        }

        const renderOpcoes = () => {
          const clubesFiltrados = clubeAlvo && filtroLiga?.value
              ? opcoes.filter((clube) => clube.liga === filtroLiga.value)
              : opcoes;
      
          if (!clubesFiltrados.some((clube) => clube.id === clubeSelecionadoAtual)) {
              clubeSelecionadoAtual = clubesFiltrados[0]?.id || "";
          }
      
          opcoesEl.innerHTML = clubesFiltrados.map((clube) => {
              const detalhePartes = [];
              if (clube.liga) detalhePartes.push(clube.liga);
              if (clube.detalheContrato) detalhePartes.push(clube.detalheContrato);
              const detalheTexto = detalhePartes.map(escaparHTML).join(" · ");
      
              let salarioHtml = "";
              if (Number(clube.salarioProposto) > 0) {
                  let comparativo = "";
                  if (Number(clube.salarioAnterior) > 0) {
                      const variacao = ((clube.salarioProposto - clube.salarioAnterior) / clube.salarioAnterior) * 100;
                      const classe = variacao > 0 ? "salario-aumento" : variacao < 0 ? "salario-reducao" : "";
                      const sinal = variacao > 0 ? "+" : "";
                      comparativo = `<small class="${classe}">${sinal}${variacao.toFixed(1)}% vs atual (${formatarValorEuro(clube.salarioAnterior)})</small>`;
                  }
                  salarioHtml = `<div class="opcao-clube-salario">
                      <small>💰 ${formatarValorEuro(clube.salarioProposto)}/ano</small>
                      ${comparativo}
                  </div>`;
              }
      
              return `
                  <label class="opcao-clube${clube.desabilitado ? " opcao-clube--desabilitada" : ""}">
                      <input type="radio" name="escolha-clube" value="${escaparHTML(clube.id)}" ${clube.id === clubeSelecionadoAtual ? "checked" : ""} ${clube.desabilitado ? "disabled" : ""}>
                      <span>
                          <strong>${escaparHTML(clube.nome)}</strong>
                          ${detalheTexto ? `<small>${detalheTexto}</small>` : ""}
                          ${salarioHtml}
                      </span>
                  </label>
              `;
          }).join("");
        };
        const aoAlterarLiga = () => {
            clubeSelecionadoAtual = opcoesEl.querySelector('input[name="escolha-clube"]:checked')?.value || clubeSelecionadoAtual;
            renderOpcoes();
        };
        const aoSelecionarClube = (evento) => {
            if (evento.target.matches('input[name="escolha-clube"]')) {
                clubeSelecionadoAtual = evento.target.value;
            }
        };
        renderOpcoes();
        filtroLiga?.addEventListener("change", aoAlterarLiga);
        opcoesEl.addEventListener("change", aoSelecionarClube);
        tituloEl.textContent = titulo;
        mensagemEl.textContent = mensagem;
        btnCancelar.textContent = "Cancelar";
        btnConfirmar.textContent = "Confirmar clube";
        btnConfirmar.className = "modal-btn modal-btn--confirmar modal-btn--clube";
        if (icone) icone.textContent = "⚽";
        opcoesEl.hidden = false;

        const fechar = (clubeId) => {
            overlay.hidden = true;
            document.removeEventListener("keydown", aoTeclar);
            btnCancelar.removeEventListener("click", aoCancelar);
            btnConfirmar.removeEventListener("click", aoConfirmar);
            overlay.removeEventListener("click", aoClicarFora);
            filtroLiga?.removeEventListener("change", aoAlterarLiga);
            opcoesEl.removeEventListener("change", aoSelecionarClube);
            tituloEl.textContent = tituloAnterior;
            mensagemEl.textContent = mensagemAnterior;
            btnCancelar.textContent = cancelarAnterior;
            btnConfirmar.textContent = confirmarAnterior;
            btnConfirmar.className = classeConfirmarAnterior;
            if (icone) icone.textContent = iconeAnterior;
            opcoesEl.hidden = true;
            if (filtroLigaContainer) filtroLigaContainer.hidden = true;
            opcoesEl.replaceChildren();
            resolve(clubeId);
        };

        const aoCancelar = () => fechar(null);
        const aoConfirmar = () => {
            const selecionado = opcoesEl.querySelector('input[name="escolha-clube"]:checked');
            fechar(selecionado?.value || null);
        };
        const aoClicarFora = (evento) => {
            if (evento.target === overlay) fechar(null);
        };
        const aoTeclar = (evento) => {
            if (evento.key === "Escape") fechar(null);
            else if (evento.key === "Enter" && evento.target !== filtroLiga) aoConfirmar();
        };

        btnCancelar.addEventListener("click", aoCancelar);
        btnConfirmar.addEventListener("click", aoConfirmar);
        overlay.addEventListener("click", aoClicarFora);
        document.addEventListener("keydown", aoTeclar);
        overlay.hidden = false;
        opcoesEl.querySelector('input[name="escolha-clube"]:checked')?.focus();
    });
}

function obterLimiteDuracaoContrato(idade, idadeLimite) {
    return Math.max(1, Math.min(5, Math.floor(idadeLimite) - Math.floor(idade) + 1));
}

function obterDuracaoContrato(idade, idadeLimite) {
    const anosDisponiveis = obterLimiteDuracaoContrato(idade, idadeLimite);
    return Math.floor(Math.random() * anosDisponiveis) + 1;
}

function criarOfertaContrato(clube, idade, idadeLimite, temporadaAnterior = null, historico = []) {
    const anosContrato = obterDuracaoContrato(idade, idadeLimite);
    const overall = Number(temporadaAnterior?.overall) || 50;
    const reputacao = temporadaAnterior
        ? calcularReputacao({ clube: clube.id }, historico)
        : 50;
    const valorMercado = calcularValorMercado(overall, idade, reputacao, anosContrato);
    const salarioCalculado = calcularSalario(valorMercado, reputacao, clube.id);
    const salarioProposto = Math.max(50000, salarioCalculado);
    const salarioAnterior = Number(temporadaAnterior?.salario) || 0;

    return {
        ...clube,
        anosContrato,
        valorMercado,
        salarioProposto,
        salarioAnterior,
        detalheContrato: `Contrato por ${anosContrato} ${anosContrato === 1 ? "ano" : "anos"}`
    };
}

async function escolherContratoParaTemporada(clubeAtual, temporadaInicial, idade, idadeLimite, carreiraAtual, clubePreferidoExtra = "") {
    const limiteRompimentos = getConfig().geral.limiteRompimentosContrato;
    const rompimentosRestantes = Math.max(0, limiteRompimentos - carreiraAtual.rompimentosContratoUsados);
    const contratoAtivo = !temporadaInicial && carreiraAtual.anosContratoRestantes > 0;
  
    const historicoCarreira = obterHistoricoDaCarreira(
        carreiraAtual.nome,
        { nome: carreiraAtual.posicao }  // ← envolve em objeto
    ); 
  
    const ultimaTemporada = historicoCarreira[historicoCarreira.length - 1] || null;
    const desempenhoBom = jogadorTeveBomDesempenho(ultimaTemporada);

    // Migração: se já tem contrato mas salário nunca foi salvo, deriva da última temporada.
    if (contratoAtivo && !carreiraAtual.salarioAtual && ultimaTemporada) {
        carreiraAtual.salarioAtual = Number(ultimaTemporada.salario) || 0;
    }

    const clubesOfertados = temporadaInicial
        ? sortearClubesParaCarreira(3, "", carreiraAtual.clubeAlvo, [])
        : sortearClubes(3, clubeAtual, carreiraAtual.clubeAlvo, desempenhoBom);
    // O modo jogo a jogo pode acrescentar o clube escolhido como preferência,
    // sem perder as três ofertas aleatórias da carreira clássica.
    if (temporadaInicial && clubePreferidoExtra && !clubesOfertados.some((clube) => clube.id === clubePreferidoExtra)) {
        const preferido = obterClube(clubePreferidoExtra);
        if (preferido) clubesOfertados.push(preferido);
    }
    const ofertas = clubesOfertados
        .map((clube) => criarOfertaContrato(clube, idade, idadeLimite, ultimaTemporada, historicoCarreira));

    let opcoes;
    let mensagem;
    let clubeSelecionado = "";

    if (temporadaInicial) {
        opcoes = ofertas;
        mensagem = `Escolha uma das ofertas para iniciar sua carreira. O contrato não passará da idade limite de ${idadeLimite} anos.`;
        clubeSelecionado = carreiraAtual.clubeAlvo;
    } else if (contratoAtivo) {
        const clube = obterClube(clubeAtual);
        const permanencia = {
            ...(clube || { id: clubeAtual, nome: "Clube atual", liga: "" }),
            anosContrato: carreiraAtual.anosContratoRestantes,
            valorMercado: ultimaTemporada
                ? calcularValorMercado(ultimaTemporada.overall, idade, ultimaTemporada.reputacao || 0, carreiraAtual.anosContratoRestantes)
                : 0,
            salarioProposto: carreiraAtual.salarioAtual || 0,
            salarioAnterior: carreiraAtual.salarioAtual || 0,
            detalheContrato: `Contrato vigente: ${carreiraAtual.anosContratoRestantes} ${carreiraAtual.anosContratoRestantes === 1 ? "temporada" : "temporadas"} restantes`
        };
        const semRompimentos = rompimentosRestantes === 0;
        opcoes = [
            permanencia,
            ...ofertas.map((oferta) => ({
                ...oferta,
                desabilitado: semRompimentos,
                detalheContrato: `${oferta.detalheContrato}${semRompimentos ? " · sem rompimentos disponíveis" : " · custa 1 rompimento"}`
            }))
        ];
        mensagem = semRompimentos
            ? `Você ainda tem contrato por ${carreiraAtual.anosContratoRestantes} ${carreiraAtual.anosContratoRestantes === 1 ? "temporada" : "temporadas"} e não possui rompimentos disponíveis. As outras ofertas não podem ser aceitas.`
            : `Você tem ${rompimentosRestantes} ${rompimentosRestantes === 1 ? "rompimento disponível" : "rompimentos disponíveis"}. Mudar antes do vencimento consome 1.`;
        clubeSelecionado = clubeAtual;
    } else {
        const clube = obterClube(clubeAtual);
        const renovacao = criarOfertaContrato({
            ...(clube || { id: clubeAtual, nome: "Clube atual", liga: "" })
        }, idade, idadeLimite, ultimaTemporada, historicoCarreira);

        // Aplicar redução salarial em caso de mau desempenho
        if (ultimaTemporada && jogadorTeveMauDesempenho(ultimaTemporada) && renovacao.salarioProposto > 0) {
            const reducao = 0.7 + Math.random() * 0.2;
            const novoSalario = Math.round(renovacao.salarioProposto * reducao);
            const variacao = renovacao.salarioAnterior > 0
                ? ((novoSalario - renovacao.salarioAnterior) / renovacao.salarioAnterior) * 100
                : 0;
            renovacao.salarioProposto = novoSalario;
            renovacao.detalheContrato = `Renovação com redução salarial${variacao < 0 ? ` (${variacao.toFixed(1)}%)` : ""}`;
        } else {
            renovacao.detalheContrato = `Renovação por ${renovacao.anosContrato} ${renovacao.anosContrato === 1 ? "ano" : "anos"}`;
        }

        opcoes = [renovacao, ...ofertas];
        mensagem = `Seu contrato venceu. Você pode renovar no ${clube?.nome || "clube atual"} ou aceitar uma oferta sem gastar rompimento. Nenhum contrato passará da idade limite de ${idadeLimite} anos.`;
        clubeSelecionado = clubeAtual;
    }

    const clubeEscolhido = await exibirEscolhaClube(
        opcoes,
        temporadaInicial ? "Escolha seu primeiro clube" : "Ofertas de contrato",
        mensagem,
        clubeSelecionado
    );
    const ofertaEscolhida = opcoes.find((opcao) => opcao.id === clubeEscolhido);
    if (!ofertaEscolhida) return null;

    return {
        clube: ofertaEscolhida.id,
        anosContrato: ofertaEscolhida.anosContrato,
        rompeContrato: contratoAtivo && ofertaEscolhida.id !== clubeAtual,
        salarioProposto: ofertaEscolhida.salarioProposto || 0,
        valorMercado: ofertaEscolhida.valorMercado || 0
    };
}

function escolherClubeAlvo(clubeAlvo) {
    return exibirEscolhaClube(
        CLUBES,
        "Escolha seu clube-alvo",
        "O clube escolhido terá 60% de chance de aparecer entre as ofertas quando você estiver tendo uma boa temporada. A escolha não garante uma oferta.",
        clubeAlvo,
        true
    );
}

// Estima a relevância de cada destino para orientar transferências automáticas.
// A força configurada do clube é combinada com o prestígio geral da liga.
function obterPrestigioClube(clube) {
    if (!clube) return 0;

    const prestigioLigas = {
        "Premier League": 24, "La Liga": 24, "Serie A": 22,
        "Bundesliga": 22, "Ligue 1": 20, "Primeira Liga": 16,
        "Eredivisie": 16, "Brasileirão": 19, "Saudi Pro League": 16,
        "MLS": 13, "Liga MX": 14, "Argentine Primera División": 14,
        "Belgian Pro League": 13, "Süper Lig": 14, "Scottish Premiership": 12,
        "Swiss Super League": 11, "Austrian Bundesliga": 11,
        "Russian Premier League": 12, "Ukrainian Premier League": 9,
        "Greek Super League": 10, "Colombian Primera A": 10,
        "Chilean Primera División": 10, "Uruguayan Primera División": 9,
        "Ecuadorian Serie A": 9, "Paraguayan Primera División": 8,
        "J1 League": 11, "K League 1": 9, "Chinese Super League": 9,
        "Egyptian Premier League": 9, "South African Premier Division": 8,
        "Moroccan Botola": 8, "Australian A-League": 8
    };

    const config = typeof getConfig === "function" ? getConfig() : null;
    const forca = Number(config?.clubes?.potencias?.[clube.id]);
    return (Number.isFinite(forca) ? forca : 60) * 0.72
        + (prestigioLigas[clube.liga] || 8) * 1.15;
}

function sortearIndicePorPesos(pesos) {
    const total = pesos.reduce((soma, peso) => soma + peso, 0);
    if (total <= 0) return 0;
    let sorteio = Math.random() * total;
    for (let i = 0; i < pesos.length; i++) {
        sorteio -= pesos[i];
        if (sorteio <= 0) return i;
    }
    return Math.max(0, pesos.length - 1);
}


function calcularReputacao(carreira, temporadas = []) {
    const lista = Array.isArray(temporadas) ? temporadas : [];
    const maiorOverall = Math.max(0, ...lista.map(t => Number(t.overall) || 0));
    const individuais = lista.flatMap(t => Array.isArray(t.trofeusIndividuais) ? t.trofeusIndividuais : []);
    const coletivos = lista.flatMap(t => Array.isArray(t.trofeusColetivos) ? t.trofeusColetivos : []);
    let rep = maiorOverall * 0.4 + individuais.length * 3 + coletivos.length * 1.2;
    rep += individuais.filter(t => t === "Bola de Ouro").length * 8;
    const clubeId = carreira?.clube || lista[lista.length - 1]?.clube;
    const forca = Number(getConfig()?.clubes?.potencias?.[clubeId]) || 50;
    rep += (forca - 50) * 0.2;
    const ultima = lista[lista.length - 1];
    if (ultima) {
        rep += Math.min(10, ((Number(ultima.gols) || 0) + (Number(ultima.assistencias) || 0)) / 10);
        rep += Math.min(5, (Number(ultima.motm) || 0) * 0.5);
    }
    return Math.max(0, Math.min(100, Math.round(rep)));
}

function calcularValorMercado(overall, idade, reputacao, anosContrato) {
    const over = Math.max(1, Number(overall) || 1);
    let valor = Math.pow(over / 50, 3.5) * 3000000;
    const fatorIdade = idade <= 21 ? 1.2 : idade <= 24 ? 1.4 : idade <= 27 ? 1.5
        : idade <= 30 ? 1 : idade <= 33 ? 0.5 : 0.15;
    valor *= fatorIdade;
    valor *= 0.7 + (Math.max(0, Math.min(100, Number(reputacao) || 0)) / 100) * 1.1;
    if (Number(anosContrato) === 0) valor *= 0.5;
    else if (Number(anosContrato) === 1) valor *= 0.75;
    return Math.max(0, Math.round(valor / 100000) * 100000);
}

function calcularSalario(valorMercado, reputacao, clubeId) {
    const forca = Number(getConfig()?.clubes?.potencias?.[clubeId]) || 50;
    return Math.round(Math.max(0, Number(valorMercado) || 0) * 0.10 * (0.6 + forca / 100));
}

function formatarValorCompacto(valor) {
    const v = Math.max(0, Number(valor) || 0);
    if (v >= 1000000) return `${(v / 1000000).toFixed(1).replace(".", ",")}M€`;
    if (v >= 1000) return `${Math.round(v / 1000)}k€`;
    return `${v}€`;
}

function formatarValorEuro(valor) {
    return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(valor) || 0);
}

function sortearClubesParaCarreira(quantidade, clubeExcluir, clubeAlvo, historico) {
    const temporadas = Array.isArray(historico) ? historico : [];
    // Na primeira temporada, a reputação começa em zero: favorece clubes menores,
    // mas mantém uma chance baixa de surgir uma oferta de clube grande.
    if (temporadas.length === 0) {
        const disponiveis = CLUBES.filter((clube) => clube.id !== clubeExcluir);
        const sorteados = [];
        while (sorteados.length < Math.min(quantidade, disponiveis.length)) {
            const pesos = disponiveis.map((clube) => {
                const prestigio = obterPrestigioClube(clube);
                const forca = Number(getConfig()?.clubes?.potencias?.[clube.id]) || prestigio || 50;
                let peso = Math.exp(-Math.max(0, forca - 35) / 18);
                if (clube.id === clubeAlvo) peso *= 1.8;
                return Math.max(0.015, peso);
            });
            sorteados.push(disponiveis.splice(sortearIndicePorPesos(pesos), 1)[0]);
        }
        return sorteados;
    }
    const clubesAnteriores = temporadas.map((temporada) => obterClube(temporada.clube)).filter(Boolean);
    const prestigiosAnteriores = clubesAnteriores.map(obterPrestigioClube);
    const maiorPrestigio = Math.max(0, ...prestigiosAnteriores);
    const prestigioMedio = prestigiosAnteriores.length
        ? prestigiosAnteriores.reduce((soma, valor) => soma + valor, 0) / prestigiosAnteriores.length
        : 0;
    const ultimoOver = Number(temporadas[temporadas.length - 1]?.overall) || 50;
    const melhorOver = Math.max(0, ...temporadas.map((temporada) => Number(temporada.overall) || 0));

    // O histórico pesa mais que uma temporada isolada; o Over atual ajuda a
    // diferenciar um veterano ainda de elite de outro já em declínio.
    const reputacao = prestigiosAnteriores.length
        ? maiorPrestigio * 0.62 + prestigioMedio * 0.18 + Math.max(ultimoOver, melhorOver) * 0.20
        : Math.max(ultimoOver, 50);

    const disponiveis = CLUBES.filter((clube) => clube.id !== clubeExcluir);
    const sorteados = [];
    while (sorteados.length < Math.min(quantidade, disponiveis.length)) {
        const pesos = disponiveis.map((clube) => {
            const prestigio = obterPrestigioClube(clube);
            const reputacaoJogador = calcularReputacao({ clube: temporadas[temporadas.length - 1]?.clube }, temporadas);
            const forcaClube = Number(getConfig()?.clubes?.potencias?.[clube.id]) || 50;
            const gap = forcaClube - reputacaoJogador;
            const compatibilidade = gap < -10 ? 1 : gap < 10 ? 0.6 : gap < 20 ? 0.15 : 0.02;
            // O prestígio do destino ainda importa, mas reputação limita saltos irreais.
            const distancia = (prestigio - reputacao) / 17;
            let peso = Math.exp(Math.max(-2.2, Math.min(2.2, distancia))) * compatibilidade;
            if (clube.id === clubeAlvo) peso *= jogadorTeveBomDesempenho(temporadas[temporadas.length - 1]) ? 1.8 : 1;
            return Math.max(0.01, peso);
        });
        const indice = sortearIndicePorPesos(pesos);
        sorteados.push(disponiveis.splice(indice, 1)[0]);
    }
    return sorteados;
}

function sortearClubeParaTemporada(clubeAtual, temporadaInicial, clubeAlvo = "", historico = []) {
    const alvoValido = obterClube(clubeAlvo);
    if (temporadaInicial && (!Array.isArray(historico) || historico.length === 0)) {
        const ofertasIniciais = sortearClubesParaCarreira(3, "", clubeAlvo, []);
        return ofertasIniciais[Math.floor(Math.random() * ofertasIniciais.length)].id;
    }
    const ofertas = sortearClubesParaCarreira(3, temporadaInicial ? "" : clubeAtual, clubeAlvo, historico);
    const candidatos = temporadaInicial ? ofertas : [{ id: clubeAtual }, ...ofertas];
    const temporadas = Array.isArray(historico) ? historico : [];
    const prestigiosAnteriores = temporadas.map((temporada) => obterPrestigioClube(obterClube(temporada.clube))).filter((valor) => valor > 0);
    const maiorPrestigio = Math.max(0, ...prestigiosAnteriores);
    const ultimoOver = Number(temporadas[temporadas.length - 1]?.overall) || 50;
    const reputacao = Math.max(maiorPrestigio, ultimoOver);
    const pesos = candidatos.map((candidato) => {
        const prestigio = obterPrestigioClube(obterClube(candidato.id));
        // Permanecer é uma opção real, mas um destino compatível pode vencer.
        let peso = Math.exp(Math.max(-2.2, Math.min(2.2, (prestigio - reputacao) / 20)));
        if (candidato.id === clubeAtual) peso *= 1.25;
        if (candidato.id === clubeAlvo) peso *= jogadorTeveBomDesempenho(temporadas[temporadas.length - 1]) ? 3.2 : 1.15;
        return Math.max(0.1, peso);
    });
    return candidatos[sortearIndicePorPesos(pesos)].id;
}

function calcularChanceNaoRenovacao(clubeId, temporada) {
    const config = getConfig();
    const chanceInicial = Math.max(0, Math.min(1, Number(config.geral.chanceNaoRenovacaoInicial ?? 0.08)));
    const clube = obterClube(clubeId);
    const forcaClube = Number(config.clubes?.potencias?.[clubeId]) || 60;
    const overall = Number(temporada?.overall) || 50;
    const jogos = Number(temporada?.jogosClube ?? temporada?.jogos) || 0;
    const participacoes = (Number(temporada?.golsClube ?? temporada?.gols) || 0)
        + (Number(temporada?.assistenciasClube ?? temporada?.assistencias) || 0);
    let chance = chanceInicial;

    // Mau desempenho individual: maior risco em clubes exigentes.
    if (overall < 60) chance += 0.28;
    else if (overall < 68) chance += 0.16;
    else if (overall < 74) chance += 0.07;
    if (jogos >= 15 && participacoes / jogos < 0.18 && !/GOL|Goleiro/i.test(temporada?.posicaoDetalhe || temporada?.posicao || '')) chance += 0.12;
    if (forcaClube >= 80 && overall < 75) chance += 0.08;

    // Em clubes fortes, a falta de conquistas continentais pesa como objetivo não cumprido.
    // Os nomes variam por liga, então a verificação usa termos comuns dos torneios continentais.
    const trofeus = Array.isArray(temporada?.trofeusColetivos) ? temporada.trofeusColetivos : [];
    const ganhouContinental = trofeus.some((nome) => /champions|continental|libertadores|europa league|conference league|sul-americana|afc champions|caf champions/i.test(String(nome)));
    if (forcaClube >= 82 && !ganhouContinental) chance += 0.08;
    else if (forcaClube >= 65 && !ganhouContinental) chance += 0.04;

    return Math.max(0, Math.min(0.9, chance));
}

function clubeNaoRenovaContrato(clubeId, temporada) {
    return Math.random() < calcularChanceNaoRenovacao(clubeId, temporada);
}

let processamentoEmAndamento = false;

function mostrarNotificacaoFootMain(mensagem, tipo = "info") {
    let elemento = document.getElementById("notificacao-footmain");
    if (!elemento) {
        elemento = document.createElement("div");
        elemento.id = "notificacao-footmain";
        elemento.className = "notificacao-config notificacao-footmain";
        elemento.setAttribute("role", "status");
        elemento.setAttribute("aria-live", "polite");
        elemento.hidden = true;
        document.body.append(elemento);
    }
    elemento.textContent = mensagem;
    elemento.dataset.tipo = tipo;
    elemento.hidden = false;
    clearTimeout(mostrarNotificacaoFootMain._timer);
    mostrarNotificacaoFootMain._timer = setTimeout(() => { elemento.hidden = true; }, 6000);
}

function haTemporadaJogoAJogoEmAndamento() {
    try {
        const estadoJJA = JSON.parse(localStorage.getItem("footmain_jogo_a_jogo_carreira_v2") || "null");
        return !!(estadoJJA && estadoJJA.integrado && !estadoJJA.salvaOficialmente && Array.isArray(estadoJJA.partidas)
            && Number(estadoJJA.rodada) < estadoJJA.partidas.length);
    } catch (_) { return false; }
}

async function gerar() {
    if (haTemporadaJogoAJogoEmAndamento()) {
        alert("Conclua a temporada jogo a jogo antes de usar a simulação clássica. Assim, os resultados e os clubes não se misturam no Histórico.");
        return;
    }
    if (processamentoEmAndamento) {
        return;
    }
    processamentoEmAndamento = true;

    try {
        const posicaoSelecionada = document.querySelector('input[name="posicao"]:checked');
        const resumoFinal = document.getElementById("resumo-final");

        if (!posicaoSelecionada) {
            alert("Selecione uma posição antes de gerar o jogador.");
            return;
        }

        const idadeInput = document.getElementById("idade");
        const nomeInput = document.getElementById("nome");
        const nacionalidadeInput = document.getElementById("nacionalidade");
        const nacionalidade = nacionalidadeInput ? nacionalidadeInput.value : "";
        const nome = normalizarNome(nomeInput ? nomeInput.value : "") || obterNomeAtual();
        const posicaoDetalhe = posicaoSelecionada.id.toUpperCase();
        const dadosPosicao = posicoes[categoriaPosicao(posicaoDetalhe)];
        const idadeLimite = obterIdadeLimite();
        const carreiraAtual = obterCarreiraAtual();
        const carreiraIdAnterior = carreiraAtual.id;
        const carreiraFinalizada = lerRanking().some(
            (carreira) => String(carreira.id) === String(carreiraAtual.id)
        );
        const idadeInformada = Number(idadeInput ? idadeInput.value : "") || 0;
        const idadeInicial = carreiraFinalizada && idadeInformada === carreiraAtual.idadeLimite
            ? getConfig().geral.idadeInicialPadrao
            : idadeInformada;
        const dadosValidos = validarDadosJogador({ nome, idade: idadeInicial, idadeLimite, posicao: posicaoSelecionada.id, nacionalidade });

        if (!dadosValidos.valido) {
            alert(dadosValidos.mensagem);
            return;
        }

        const historico = carreiraFinalizada
            ? []
            : obterHistoricoDaCarreira(nome, dadosPosicao);

        if (carreiraFinalizada) {
            carreiraAtual.id = gerarIdRanking();
            carreiraAtual.clube = "";
            carreiraAtual.anosContratoRestantes = 0;
            carreiraAtual.rompimentosContratoUsados = 0;
            carreiraAtual.aposentadoriaSelecao = false;
            carreiraAtual.aposentadoriaVoluntaria = false;
            delete carreiraAtual.potencial;
        }
        carreiraAtual.nome = nome;
        carreiraAtual.posicao = POSICOES_CAMPO[posicaoDetalhe]?.nome || dadosPosicao.nome;
        carreiraAtual.posicaoDetalhe = posicaoDetalhe;
        carreiraAtual.idadeLimite = idadeLimite;
        carreiraAtual.nacionalidade = nacionalidade;
        if (!carreiraFinalizada) {
            salvarCarreiraAtual(carreiraAtual);
        }

        const idade = historico.length === 0 ? dadosValidos.idade : (Number(historico[historico.length - 1].idade) || 0) + 1;
        const ano = proximoAno(historico);
        const clubeAtual = obterClube(historico[historico.length - 1]?.clube)?.id || carreiraAtual.clube;
        const temporadaInicial = historico.length === 0 || !obterClube(clubeAtual);
        carreiraAtual.anosContratoRestantes = Math.min(
            carreiraAtual.anosContratoRestantes,
            obterLimiteDuracaoContrato(idade, idadeLimite)
        );

        if (idade > idadeLimite) {
            mostrarResumoFinal(nome, idadeLimite, ano, historico, POSICOES_CAMPO[posicaoDetalhe]?.nome || dadosPosicao.nome);
            return;
        }

        let contratoEscolhido;
        if (!temporadaInicial && carreiraAtual.anosContratoRestantes > 0) {
            const acaoContrato = await escolherAcaoContrato(clubeAtual, carreiraAtual.anosContratoRestantes);
            if (!acaoContrato) return;

            contratoEscolhido = acaoContrato === "manter"
                ? { clube: clubeAtual, anosContrato: carreiraAtual.anosContratoRestantes, rompeContrato: false }
                : await escolherContratoParaTemporada(
                    clubeAtual,
                    temporadaInicial,
                    idade,
                    idadeLimite,
                    carreiraAtual
                );
        } else {
            contratoEscolhido = await escolherContratoParaTemporada(
                clubeAtual,
                temporadaInicial,
                idade,
                idadeLimite,
                carreiraAtual
            );
        }
        if (!contratoEscolhido) return;

        carreiraAtual.clube = contratoEscolhido.clube;
        carreiraAtual.anosContratoRestantes = Math.max(0, contratoEscolhido.anosContrato - 1);
        if (contratoEscolhido.rompeContrato) {
            carreiraAtual.rompimentosContratoUsados += 1;
        }
        if (!salvarCarreiraAtual(carreiraAtual)) {
            throw new Error("Não foi possível salvar o contrato da carreira.");
        }
        if (resumoFinal) {
            resumoFinal.hidden = true;
        }
        const resultados = document.getElementById("resultados");
        if (resultados) {
            resultados.hidden = false;
        }
        if (!carreiraFinalizada) {
            await perguntarAposentadoriaSelecao(idade);
        }
        const temporada = criarTemporada(nome, idade, ano, posicaoSelecionada.id, historico, nacionalidade, contratoEscolhido.clube);
        
        // Persistir o salário negociado
        if (contratoEscolhido.salarioProposto !== undefined && contratoEscolhido.salarioProposto >= 0) {
            carreiraAtual.salarioAtual = contratoEscolhido.salarioProposto;
        }
        
        // Calcular reputação, valor e salário da temporada
        const temporadasParaReputacao = [...historico, temporada];
        temporada.reputacao = calcularReputacao({ clube: contratoEscolhido.clube }, temporadasParaReputacao);
        temporada.anosContrato = carreiraAtual.anosContratoRestantes;
        temporada.valorMercado = calcularValorMercado(
            temporada.overall,
            idade,
            temporada.reputacao,
            temporada.anosContrato
        );
        temporada.salario = carreiraAtual.salarioAtual
            || calcularSalario(temporada.valorMercado, temporada.reputacao, contratoEscolhido.clube);
        
        // Salvar contrato + salário na carreira ANTES de renderizar
        if (!salvarCarreiraAtual(carreiraAtual)) {
            throw new Error("Não foi possível salvar o estado da carreira.");
        }
        
        const historicoAtualizado = [...historico, temporada];
        
        // Salvar histórico ANTES de atualizar UI (para que lerHistoricoAtiva veja a nova temporada)
        const historicoDeOutrasCarreiras = lerHistorico().filter(
            (temporadaSalva) => temporadaSalva.carreiraId !== carreiraIdAnterior
                && temporadaSalva.carreiraId !== carreiraAtual.id
        );
        salvarHistorico([...historicoDeOutrasCarreiras, ...historicoAtualizado]);
        
        // Agora atualizar a UI
        document.getElementById("nome").value = nome;
        document.getElementById("idade").value = idade;
        atualizarResumoJogador(nome, idade, ano, nacionalidade, contratoEscolhido.clube);
        document.getElementById("jogos").textContent = temporada.jogos;
        document.getElementById("gols").textContent = temporada.gols;
        document.getElementById("assi").textContent = temporada.assistencias;
        document.getElementById("prem").textContent = contarPremios(temporada);
        atualizarTitulosResultados(temporada);
        atualizarMercadoResultados(temporada);
        
        renderHistorico();
        renderAtributos(temporada);
        // Lesão gravíssima encerra a carreira imediatamente.
        if (temporada.lesaoCarreira) {
            const posicaoNome = POSICOES_CAMPO[posicaoDetalhe]?.nome || dadosPosicao.nome;
            mostrarResumoFinal(nome, idadeLimite, ano, historicoAtualizado, posicaoNome);
            alert(`💔 ${nome} sofreu uma lesão gravíssima e precisou encerrar a carreira aos ${idade} anos.`);
        }
      
    } catch (erro) {
        console.error("[FootMain] Erro em gerar():", erro);
        const detalhe = erro instanceof Error && erro.message ? `: ${erro.message}` : "";
        mostrarNotificacaoFootMain(`Não foi possível gerar a temporada${detalhe}`, "erro");
    } finally {
        processamentoEmAndamento = false;
    }
}

function atualizarTitulosResultados(temporada) {
    const anoElemento = document.getElementById("ano-titulos-resultados");
    const coletivosElemento = document.getElementById("titulos-coletivos-resultados");
    const individuaisElemento = document.getElementById("titulos-individuais-resultados");
    if (!anoElemento || !coletivosElemento || !individuaisElemento) return;

    if (!temporada) {
        anoElemento.textContent = "Títulos da temporada";
        coletivosElemento.textContent = "Nenhum";
        individuaisElemento.textContent = "Nenhum";
        return;
    }

    const coletivos = mapearTrofeusTemporada(temporada, "trofeusColetivos");
    const individuais = mapearTrofeusTemporada(temporada, "trofeusIndividuais");
    anoElemento.textContent = `Títulos da temporada ${temporada.ano}`;
    coletivosElemento.textContent = coletivos.length ? coletivos.join(", ") : "Nenhum";
    individuaisElemento.textContent = individuais.length ? individuais.join(", ") : "Nenhum";
}

function simularTudo() {
    if (haTemporadaJogoAJogoEmAndamento()) {
        alert("Conclua a temporada jogo a jogo antes de usar a simulação clássica. Assim, os resultados e os clubes não se misturam no Histórico.");
        return;
    }
    if (processamentoEmAndamento) {
        return;
    }
    processamentoEmAndamento = true;

    try {
        const posicaoSelecionada = document.querySelector('input[name="posicao"]:checked');
        const resumoFinal = document.getElementById("resumo-final");

        if (!posicaoSelecionada) {
            alert("Selecione uma posição antes de simular a carreira completa.");
            return;
        }

        const nomeInput = document.getElementById("nome");
        const nacionalidadeInput = document.getElementById("nacionalidade");
        const nacionalidade = nacionalidadeInput ? nacionalidadeInput.value : "";
        const nome = normalizarNome(nomeInput ? nomeInput.value : "") || obterNomeAtual();
        const posicaoDetalhe = posicaoSelecionada.id.toUpperCase();
        const dadosPosicao = posicoes[categoriaPosicao(posicaoDetalhe)];
        const idadeLimite = obterIdadeLimite();
        const idadeInicial = Number(document.getElementById("idade").value) || 0;
        const dadosValidos = validarDadosJogador({ nome, idade: idadeInicial, idadeLimite, posicao: posicaoSelecionada.id, nacionalidade });

        if (!dadosValidos.valido) {
            alert(dadosValidos.mensagem);
            return;
        }

        if (resumoFinal) resumoFinal.hidden = true;

        const carreiraAtual = obterCarreiraAtual();
        carreiraAtual.nome = nome;
        carreiraAtual.posicao = POSICOES_CAMPO[posicaoDetalhe]?.nome || dadosPosicao.nome;
        carreiraAtual.posicaoDetalhe = posicaoDetalhe;
        carreiraAtual.idadeLimite = idadeLimite;
        carreiraAtual.nacionalidade = nacionalidade;

        // Uma carreira que já está no ranking foi finalizada. Nunca reutilizamos
        // seu ID ao iniciar outra, mesmo que o nome do jogador seja igual.
        const carreiraFinalizada = lerRanking().some(
            (carreira) => String(carreira.id) === String(carreiraAtual.id)
        );
        if (carreiraFinalizada) {
            carreiraAtual.id = gerarIdRanking();
            carreiraAtual.clube = "";
            carreiraAtual.anosContratoRestantes = 0;
            carreiraAtual.rompimentosContratoUsados = 0;
            carreiraAtual.aposentadoriaSelecao = false;
            carreiraAtual.aposentadoriaVoluntaria = false;
            delete carreiraAtual.potencial;
        }

        // Se "gerar" já criou temporadas para esta carreira, continuamos dela.
        // Caso contrário, iniciamos uma carreira nova e isolada.
        const historicoCompleto = lerHistorico();
        let historico = historicoCompleto.filter(
            (temporada) => temporada.carreiraId === carreiraAtual.id
        );
        const continuandoCarreira = historico.length > 0;

        if (!continuandoCarreira) {
            historico = [];
        }
        salvarCarreiraAtual(carreiraAtual);

        let idade;
        let ano;
        let clubeAtual;
        let anosContratoRestantes = carreiraAtual.anosContratoRestantes;

        if (continuandoCarreira) {
            const ultimaTemporada = historico[historico.length - 1];
            idade = (Number(ultimaTemporada.idade) || 0) + 1;
            ano = proximoAno(historico);
            clubeAtual = ultimaTemporada.clube || carreiraAtual.clube;
            anosContratoRestantes = Math.min(
                anosContratoRestantes,
                obterLimiteDuracaoContrato(idade, idadeLimite)
            );
        } else {
            idade = dadosValidos.idade;
            ano = ANO_INICIAL;
            clubeAtual = "";
            anosContratoRestantes = 0;
        }

        while (idade <= idadeLimite) {
            if (!obterClube(clubeAtual)) {
                // Sem clube válido: sorteia um clube inicial (com viés do clube-alvo).
                clubeAtual = sortearClubeParaTemporada("", true, carreiraAtual.clubeAlvo, historico);
                anosContratoRestantes = obterDuracaoContrato(idade, idadeLimite);
            } else if (anosContratoRestantes <= 0) {
                // Ao vencer o contrato, o clube pode recusar a renovação se o desempenho/objetivos foram ruins.
                const ultimaTemporada = historico[historico.length - 1];
                const naoRenovou = ultimaTemporada && clubeNaoRenovaContrato(clubeAtual, ultimaTemporada);
                if (naoRenovou) {
                    const ofertas = sortearClubesParaCarreira(3, clubeAtual, carreiraAtual.clubeAlvo, historico);
                    const candidatos = ofertas.length ? ofertas : CLUBES.filter((clube) => clube.id !== clubeAtual);
                    const alvo = obterClube(carreiraAtual.clubeAlvo);
                    const alvoElegivel = alvo && alvo.id !== clubeAtual && candidatos.some((clube) => clube.id === alvo.id);
                    clubeAtual = alvoElegivel && jogadorTeveBomDesempenho(ultimaTemporada) && Math.random() < 0.6
                        ? alvo.id
                        : candidatos[Math.floor(Math.random() * candidatos.length)].id;
                } else {
                    // Renovar continua sendo uma opção, mas não é garantido que o jogador fique.
                    clubeAtual = sortearClubeParaTemporada(clubeAtual, false, carreiraAtual.clubeAlvo, historico);
                }
                anosContratoRestantes = obterDuracaoContrato(idade, idadeLimite);
            }
            const temporada = criarTemporada(nome, idade, ano, posicaoSelecionada.id, historico, nacionalidade, clubeAtual);
            const temporadasParaReputacao = [...historico, temporada];
            temporada.reputacao = calcularReputacao({ clube: clubeAtual }, temporadasParaReputacao);
            temporada.anosContrato = anosContratoRestantes;
            temporada.valorMercado = calcularValorMercado(temporada.overall, idade, temporada.reputacao, anosContratoRestantes);
            temporada.salario = calcularSalario(temporada.valorMercado, temporada.reputacao, clubeAtual);
            carreiraAtual.salarioAtual = temporada.salario;
            historico.push(temporada);
            
            // Lesão gravíssima encerra a carreira imediatamente.
            if (temporada.lesaoCarreira) {
                break;
            }
            
            anosContratoRestantes = Math.max(0, anosContratoRestantes - 1);
            idade = Number(historico[historico.length - 1].idade) + 1;
            ano = proximoAno(historico);

            // Aposentadoria automática da seleção aos X anos na simulação completa
            if (idade >= (getConfig().geral.idadeAposentadoriaSelecao || 32)
                && !carreiraAtual.aposentadoriaSelecao) {
                carreiraAtual.aposentadoriaSelecao = true;
                salvarCarreiraAtual(carreiraAtual);
            }
        }

        if (historico.length > 0) {
            const ultimaTemporada = historico[historico.length - 1];
            const idadeUltima = Number(ultimaTemporada.idade) || 0;
            carreiraAtual.clube = ultimaTemporada.clube;
            carreiraAtual.anosContratoRestantes = anosContratoRestantes;
            if (!salvarCarreiraAtual(carreiraAtual)) {
                throw new Error("Não foi possível salvar o estado final do contrato.");
            }
            document.getElementById("idade").value = idadeUltima;
            atualizarResumoJogador(nome, idadeUltima, ano, nacionalidade, ultimaTemporada.clube);
        }

        // Substitui apenas as temporadas da carreira atual e preserva as outras.
        const historicoDeOutrasCarreiras = lerHistorico().filter(
            (temporada) => temporada.carreiraId !== carreiraAtual.id
        );
        salvarHistorico([...historicoDeOutrasCarreiras, ...historico]);
        renderHistorico();
        const ultimaTemporadaSimulada = historico[historico.length - 1] || null;
        renderAtributos(ultimaTemporadaSimulada);
        atualizarTitulosResultados(ultimaTemporadaSimulada);
        atualizarMercadoResultados(ultimaTemporadaSimulada);
        mostrarResumoFinal(nome, idadeLimite, ano, historico, POSICOES_CAMPO[posicaoDetalhe]?.nome || dadosPosicao.nome);
    } catch (erro) {
        console.error("[FootMain] Erro em simularTudo():", erro);
        alert("Ocorreu um erro ao simular a carreira. Veja o console (F12) para detalhes.");
    } finally {
        processamentoEmAndamento = false;
    }
}

async function limparHistorico() {
    const historico = lerHistorico();

    if (historico.length === 0) {
        await confirmarAcao("Não há histórico para limpar.", "Nada para apagar");
        return;
    }

    const confirmado = await confirmarAcao(
        "Tem certeza que deseja limpar TODO o histórico de temporadas?\n\nEsta ação não pode ser desfeita.",
        "Limpar histórico"
    );

    if (!confirmado) {
        return;
    }

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_CARREIRA_ATUAL);
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = String(getConfig().geral.idadeInicialPadrao ?? 18);
    document.getElementById("idade-limite").value = IDADE_LIMITE_PADRAO;
    const nacionalidadeInput = document.getElementById("nacionalidade");
    if (nacionalidadeInput) nacionalidadeInput.value = "";
    const resumoFinal = document.getElementById("resumo-final");
    if (resumoFinal) resumoFinal.hidden = true;
    const resultados = document.getElementById("resultados");
    if (resultados) resultados.hidden = false;
    atualizarResumoJogador("Jogador", 0, ANO_INICIAL);
    renderHistorico();
}

async function limparRanking() {
    const ranking = lerRanking();

    if (ranking.length === 0) {
        await confirmarAcao("Não há carreiras no ranking para limpar.", "Nada para apagar");
        return;
    }

    const confirmado = await confirmarAcao(
        "Tem certeza que deseja limpar TODO o ranking de carreiras?\n\nEsta ação não pode ser desfeita.",
        "Limpar ranking"
    );

    if (!confirmado) {
        return;
    }

    localStorage.removeItem(STORAGE_KEY_RANKING);
    renderRanking();
}


function gerarGraficoComparacao(ta,tb){
 const anos=[...new Set([...ta,...tb].map(t=>Number(t.ano)).filter(Number.isFinite))].sort((a,b)=>a-b); if(!anos.length)return '<p>Sem dados de temporadas para desenhar o gráfico.</p>';
 const W=600,H=220,P=32,minA=anos[0],maxA=anos[anos.length-1],x=a=>P+(maxA===minA?.5:(a-minA)/(maxA-minA))*(W-2*P),y=o=>H-P-((Math.max(30,Math.min(99,Number(o)||30))-30)/69)*(H-2*P);
 const path=ts=>ts.map(t=>`${x(Number(t.ano))},${y(t.overall)}`).join(' ');
 return `<svg class="grafico-comparacao" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução do overall das duas carreiras"><line x1="${P}" y1="${H-P}" x2="${W-P}" y2="${H-P}" stroke="currentColor" opacity=".35"/><line x1="${P}" y1="${P}" x2="${P}" y2="${H-P}" stroke="currentColor" opacity=".35"/><polyline points="${path(ta)}" fill="none" stroke="#22c55e" stroke-width="3"/><polyline points="${path(tb)}" fill="none" stroke="#60a5fa" stroke-width="3"/><text x="${P}" y="${H-8}" fill="currentColor" font-size="11">${minA}</text><text x="${W-P}" y="${H-8}" text-anchor="end" fill="currentColor" font-size="11">${maxA}</text></svg><p><span style="color:#22c55e">●</span> Carreira A &nbsp; <span style="color:#60a5fa">●</span> Carreira B</p>`;
}
function renderComparacao(carreiraA,carreiraB){
 const out=document.getElementById('resultado-comparacao');if(!out||!carreiraA||!carreiraB){if(out)out.innerHTML='<p>Salve pelo menos duas carreiras para comparar.</p>';return;}
 const a=obterMetricasCarreira(carreiraA),b=obterMetricasCarreira(carreiraB),ta=obterTemporadasDaCarreira(carreiraA),tb=obterTemporadasDaCarreira(carreiraB);
 const linhas=[['Posição',carreiraA.posicao,carreiraB.posicao,true],['Seleção',SELECOES.find(s=>s.id===carreiraA.nacionalidade)?.nome||'—',SELECOES.find(s=>s.id===carreiraB.nacionalidade)?.nome||'—',true],['Jogos',a.jogos,b.jogos],['Gols',a.gols,b.gols],['Assistências',a.assistencias,b.assistencias],['Hat-tricks',a.hatTricks,b.hatTricks],['MOTM',a.motmTotal,b.motmTotal],['Jogos pela seleção',a.caps,b.caps],['Gols pela seleção',a.golsSelecao,b.golsSelecao],['Títulos coletivos',a.titulosColetivos,b.titulosColetivos],['Títulos individuais',a.titulosIndividuais,b.titulosIndividuais],['Maior Over',a.maiorOver,b.maiorOver],['Temporadas',a.temporadas,b.temporadas],['Pontuação',a.pontuacao,b.pontuacao]];
 const tabela=`<div class="tabela-comparacao"><table><thead><tr><th>Métrica</th><th>${escaparHTML(carreiraA.nome)}</th><th>${escaparHTML(carreiraB.nome)}</th></tr></thead><tbody>${linhas.map(([l,av,bv,txt])=>`<tr><th>${l}</th><td class="${!txt&&Number(av)>Number(bv)?'comparacao-vencedor':''}">${escaparHTML(av)}</td><td class="${!txt&&Number(bv)>Number(av)?'comparacao-vencedor':''}">${escaparHTML(bv)}</td></tr>`).join('')}</tbody></table></div>`;
 const anos=[...new Set(ta.map(t=>Number(t.ano)).filter(ano=>tb.some(u=>Number(u.ano)===ano)))].sort((x,y)=>x-y);
 const comum=anos.length?`<h3>Temporadas em comum</h3><div class="tabela-comparacao"><table><thead><tr><th>Ano</th><th>${escaparHTML(carreiraA.nome)} (gols / OVR)</th><th>${escaparHTML(carreiraB.nome)} (gols / OVR)</th></tr></thead><tbody>${anos.map(ano=>{const x=ta.find(t=>Number(t.ano)===ano),y=tb.find(t=>Number(t.ano)===ano);return `<tr><th>${ano}</th><td>${Number(x.gols)||0} / ${Number(x.overall)||0}</td><td>${Number(y.gols)||0} / ${Number(y.overall)||0}</td></tr>`}).join('')}</tbody></table></div>`:'<p>As carreiras não têm temporadas em comum.</p>';
 out.innerHTML=`${tabela}<h3>Evolução do overall</h3>${gerarGraficoComparacao(ta,tb)}${comum}`;
}
function abrirModalComparacao(){const modal=document.getElementById('modal-comparacao'),sa=document.getElementById('comparacao-a'),sb=document.getElementById('comparacao-b');if(!modal||!sa||!sb)return;const carreiras=lerRanking();if(carreiras.length<2){alert("Você precisa ter pelo menos duas carreiras no ranking para comparar.");return;}const opts=carreiras.map(c=>`<option value="${escaparHTML(c.id)}">${escaparHTML(c.nome)} · ${escaparHTML(c.posicao||'')}</option>`).join('');sa.innerHTML=opts;sb.innerHTML=opts; if(carreiras.length>1)sb.selectedIndex=1;modal.hidden=false;renderComparacao(carreiras.find(c=>String(c.id)===sa.value),carreiras.find(c=>String(c.id)===sb.value));}
function configurarComparacao(){document.getElementById('abrir-comparacao')?.addEventListener('click',abrirModalComparacao);document.getElementById('fechar-comparacao')?.addEventListener('click',()=>{document.getElementById('modal-comparacao').hidden=true;});for(const id of ['comparacao-a','comparacao-b'])document.getElementById(id)?.addEventListener('change',()=>{const cs=lerRanking();renderComparacao(cs.find(c=>String(c.id)===document.getElementById('comparacao-a').value),cs.find(c=>String(c.id)===document.getElementById('comparacao-b').value));});document.getElementById('modal-comparacao')?.addEventListener('click',e=>{if(e.target.id==='modal-comparacao')e.currentTarget.hidden=true;});}

async function aposentarVoluntariamente(jaConfirmada = false) {
    if (processamentoEmAndamento) return;
    const carreira = obterCarreiraAtual();
    const carreiraFinalizada = lerRanking().some(
        (c) => String(c.id) === String(carreira.id)
    );
    if (carreiraFinalizada) {
        alert("Esta carreira já foi encerrada.");
        return;
    }
  
    const historico = lerHistoricoAtiva();
    if (historico.length === 0) {
        alert("Você precisa ter ao menos uma temporada simulada para se aposentar.");
        return;
    }
    const confirmado = jaConfirmada || await confirmarAcao(
        "Tem certeza que deseja encerrar sua carreira agora?\n\nVocê terá um jogo de despedida e sua carreira será registrada no ranking.",
        "Aposentadoria voluntária"
    );
    if (!confirmado) return;

    processamentoEmAndamento = true;
    try {
        const carreira = obterCarreiraAtual();
        carreira.aposentadoriaVoluntaria = true;
        salvarCarreiraAtual(carreira);
        const ultima = historico[historico.length - 1];
        ultima.eventos = Array.isArray(ultima.eventos) ? ultima.eventos : [];
        ultima.eventos.push({ tipo: "aposentadoria-voluntaria", jogo: 0 });
        const outras = lerHistorico().filter(t => t.carreiraId !== carreira.id);
        salvarHistorico([...outras, ...historico]);
        const posicaoNome = ultima.posicao || "Jogador";
        mostrarResumoFinal(ultima.nome, carreira.idadeLimite, Number(ultima.ano) || ANO_INICIAL,
            historico, posicaoNome, { voluntaria: true });
    } finally {
        processamentoEmAndamento = false;
    }
}

async function perguntarAposentadoriaSelecao(idade) {
    const limite = getConfig().geral.idadeAposentadoriaSelecao || 32;
    if (Number(idade) !== Number(limite)) return false;
    const carreira = obterCarreiraAtual();
    if (carreira.aposentadoriaSelecao) return false;
    const historico = lerHistoricoAtiva();
    const foiConvocado = historico.some((t) => t.convocado || Number(t.jogosSelecao) > 0);
    if (!foiConvocado) return false;

    const continuar = await confirmarAcao(
        `Você completou ${idade} anos e já defendeu sua seleção.\n\nDeseja continuar defendendo a seleção nacional?\n\n(Confirmar = continuar · Cancelar = aposentar)`,
        "Continuar na seleção nacional?"
    );
    if (!continuar) {
        carreira.aposentadoriaSelecao = true;
        salvarCarreiraAtual(carreira);
        const ultima = historico[historico.length - 1];
        if (ultima) {
            ultima.eventos = Array.isArray(ultima.eventos) ? ultima.eventos : [];
            if (!ultima.eventos.some(e => e.tipo === "aposentadoria-selecao")) {
                ultima.eventos.push({ tipo: "aposentadoria-selecao", jogo: 0 });
                const outras = lerHistorico().filter(t => t.carreiraId !== carreira.id);
                salvarHistorico([...outras, ...historico]);
            }
        }
        alert("🏁 Você anunciou sua aposentadoria da seleção nacional.");
    }
    return !continuar;
}

function obterClubeDespedida(historico) {
    if (!historico || !historico.length) return "";
    const ultima = historico[historico.length - 1];
    return ultima.clube || "";
}

function atualizarMercadoResultados(temporada) {
    const repEl = document.getElementById("resultado-reputacao");
    const valorEl = document.getElementById("resultado-valor");
    const salarioEl = document.getElementById("resultado-salario");
    if (!repEl || !valorEl || !salarioEl) return;

    if (!temporada) {
        repEl.textContent = "-";
        valorEl.textContent = "-";
        salarioEl.textContent = "-";
        return;
    }
    repEl.textContent = Number(temporada.reputacao) || 0;
    valorEl.textContent = formatarValorCompacto(temporada.valorMercado || 0);
    salarioEl.textContent = formatarValorCompacto(temporada.salario || 0);
}

document.addEventListener("DOMContentLoaded", () => {
    configurarComparacao();

    aplicarConfiguracoes();
  
    const botaoLimpar = document.getElementById("limparHistorico");
    const botaoLimparRanking = document.getElementById("limparRanking");
    const listaRanking = document.getElementById("lista-ranking");
    const filtroRanking = document.getElementById("filtro-ranking");
    const filtroPosicaoRanking = document.getElementById("filtro-posicao-ranking");
    const filtroSelecaoRanking = document.getElementById("filtro-selecao-ranking");
    const filtroHistorico = document.getElementById("filtro-historico");
    const filtroCarreiraConquistas = document.getElementById("filtro-carreira-conquistas");
    const filtroCategoriaConquistas = document.getElementById("filtro-categoria-conquistas");
  
    const campoIdade = document.getElementById("idade");
    const posicaoSelecionadaTexto = document.getElementById("posicao-selecionada");
    const atualizarPosicaoSelecionada = () => {
        const selecionada = document.querySelector('input[name="posicao"]:checked');
        if (posicaoSelecionadaTexto) {
            posicaoSelecionadaTexto.textContent = selecionada && POSICOES_CAMPO[selecionada.id]
                ? `${selecionada.id} · ${POSICOES_CAMPO[selecionada.id].nome}`
                : "Nenhuma posição selecionada";
        }
    };
    document.querySelectorAll('input[name="posicao"]').forEach((radio) => radio.addEventListener("change", atualizarPosicaoSelecionada));
    const carreiraParaIdade = obterCarreiraAtual();
    if (campoIdade && (!campoIdade.value || campoIdade.value === "0") && carreiraParaIdade.nome === "Jogador") {
        campoIdade.value = getConfig().geral.idadeInicialPadrao;
        atualizarResumoJogador("Jogador", getConfig().geral.idadeInicialPadrao, ANO_INICIAL);
    }
    
    atualizarPosicaoSelecionada();

    if (filtroCategoriaConquistas) {
        filtroCategoriaConquistas.addEventListener("change", renderConquistas);
    }
  
    if (filtroCarreiraConquistas) {
        filtroCarreiraConquistas.addEventListener("change", renderConquistas);
    }

    if (botaoLimpar) {
        botaoLimpar.addEventListener("click", limparHistorico);
    }

    if (botaoLimparRanking) {
        botaoLimparRanking.addEventListener("click", limparRanking);
    }

    if (filtroHistorico) {
        filtroHistorico.addEventListener("change", () => {
            paginaHistoricoAtual = 0;
            renderHistorico();
        });
    }

    if (filtroRanking) {
        filtroRanking.addEventListener("change", renderRanking);
    }

    if (filtroPosicaoRanking) {
        filtroPosicaoRanking.addEventListener("change", renderRanking);
    }

    if (filtroSelecaoRanking) {
        filtroSelecaoRanking.innerHTML = '<option value="">Todas as seleções</option>' +
            SELECOES.map((selecao) => `<option value="${escaparHTML(selecao.id)}">${escaparHTML(selecao.nome)}</option>`).join("");
        filtroSelecaoRanking.addEventListener("change", renderRanking);
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

    const nacionalidadeInput = document.getElementById("nacionalidade");
    const filtroRegiaoNacionalidade = document.getElementById("filtro-regiao-nacionalidade");
    const carreiraAtual = obterCarreiraAtual();
    const clubeAlvoButton = document.getElementById("clube-alvo");
    const atualizarBotaoClubeAlvo = () => {
        const clubeAlvo = obterClube(obterCarreiraAtual().clubeAlvo);
        if (clubeAlvoButton) {
            clubeAlvoButton.textContent = clubeAlvo ? `Clube-alvo: ${clubeAlvo.nome}` : "Escolher clube-alvo";
        }
    };
    if (clubeAlvoButton) {
        clubeAlvoButton.addEventListener("click", async () => {
            if (processamentoEmAndamento) return;
            processamentoEmAndamento = true;
            try {
                const clubeAlvoAtual = obterCarreiraAtual().clubeAlvo;
                const clubeAlvo = await escolherClubeAlvo(clubeAlvoAtual);
                if (clubeAlvo === null) return;
                const carreiraAtualizada = obterCarreiraAtual();
                carreiraAtualizada.clubeAlvo = clubeAlvo;
                if (!salvarCarreiraAtual(carreiraAtualizada)) {
                    throw new Error("Não foi possível salvar a carreira atual.");
                }
                atualizarBotaoClubeAlvo();
            } catch (erro) {
                console.error("[FootMain] Erro ao escolher o clube-alvo:", erro);
                alert("Não foi possível escolher o clube-alvo. Veja o console (F12) para detalhes.");
            } finally {
                processamentoEmAndamento = false;
            }
        });
    }
    atualizarBotaoClubeAlvo();
    if (nacionalidadeInput) {
        const regioes = [...new Set(SELECOES.map((selecao) => selecao.regiao))];
        if (filtroRegiaoNacionalidade) {
            filtroRegiaoNacionalidade.innerHTML = '<option value="">Todas as regiões</option>' +
                regioes.map((regiao) => `<option value="${regiao}">${escaparHTML(REGIOES_SELECOES[regiao] || regiao)}</option>`).join("");
        }
        const atualizarOpcoesNacionalidade = () => {
            const regiao = filtroRegiaoNacionalidade?.value || "";
            const nacionalidades = SELECOES.filter((selecao) => !regiao || selecao.regiao === regiao);
            const selecaoAtual = SELECOES.find((selecao) => selecao.id === nacionalidadeInput.value);
            if (selecaoAtual && !nacionalidades.some((selecao) => selecao.id === selecaoAtual.id)) {
                nacionalidades.unshift(selecaoAtual);
            }
            nacionalidadeInput.innerHTML = '<option value="">Selecione uma seleção</option>' +
                nacionalidades.map((selecao) => {
                    const foraDaRegiao = regiao && selecao.regiao !== regiao;
                    const nome = foraDaRegiao ? `${selecao.nome} (seleção atual)` : selecao.nome;
                    return `<option value="${selecao.id}">${escaparHTML(nome)}</option>`;
                }).join("");
            // Reaplica a seleção atual após reconstruir as opções.
            nacionalidadeInput.value = selecaoAtual?.id || "";
        };
        atualizarOpcoesNacionalidade();
        nacionalidadeInput.value = carreiraAtual.nacionalidade;
        if (filtroRegiaoNacionalidade) {
            filtroRegiaoNacionalidade.addEventListener("change", atualizarOpcoesNacionalidade);
        }
        nacionalidadeInput.addEventListener("change", () => {
            const carreiraAtualizada = obterCarreiraAtual();
            carreiraAtualizada.nacionalidade = nacionalidadeInput.value;
            salvarCarreiraAtual(carreiraAtualizada);
            atualizarResumoJogador(
                normalizarNome(carreiraAtualizada.nome) || "Jogador",
                Number(document.getElementById("idade").value) || 0,
                proximoAno(lerHistoricoAtiva()),
                nacionalidadeInput.value
            );
        });
    }

    configurarSeletoresEmModal();

    const idadeInicial = Number(document.getElementById("idade").value) || 0;
    const nomeAtual = normalizarNome(carreiraAtual.nome) || "Jogador";
    document.getElementById("nome").value = nomeAtual === "Jogador" ? "" : nomeAtual;
    atualizarResumoJogador(nomeAtual === "Jogador" ? "Jogador" : nomeAtual, idadeInicial, ANO_INICIAL, carreiraAtual.nacionalidade, carreiraAtual.clube);
    renderHistorico();
    renderRanking();
    const historicoInicialAtributos = lerHistoricoAtiva().sort((a, b) => a.ano - b.ano);
    const ultimaTemporadaInicial = historicoInicialAtributos[historicoInicialAtributos.length - 1] || null;
    renderAtributos(ultimaTemporadaInicial);
    atualizarTitulosResultados(ultimaTemporadaInicial);
    atualizarMercadoResultados(ultimaTemporadaInicial);
});
