const STORAGE_KEY = "footmain_temporadas";
const STORAGE_KEY_RANKING = "footmain_ranking";
const STORAGE_KEY_CARREIRA_ATUAL = "footmain_carreira_atual";

const OVERALL_PADRAO = 50;

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

function sortearClubes(quantidade, clubeExcluir = "", clubeAlvo = "") {
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
        && Math.random() < 0.5
    ) {
        sorteados[Math.floor(Math.random() * sorteados.length)] = alvo;
    }

    return sorteados;
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
    const trofeusColetivos = Array.isArray(temporada.trofeusColetivos) ? temporada.trofeusColetivos.filter((t) => typeof t === "string") : [];
    const trofeusIndividuais = Array.isArray(temporada.trofeusIndividuais) ? temporada.trofeusIndividuais.filter((t) => typeof t === "string") : [];
    const eventos = normalizarEventosTemporada(temporada.eventos);

    const atributos = normalizarAtributos(temporada.atributos, posicaoNormalizada, idade);

    // Overall: tenta o salvo, senão recalcula, senão cai no padrão.
    const overallSalvo = Number(temporada.overall);
    const overall = Number.isFinite(overallSalvo)
        ? Math.max(1, Math.min(99, Math.round(overallSalvo)))
        : calcularOverall(posicaoNormalizada, atributos);

    return {
        nome,
        idade,
        posicao: nomePosicao,
        posicaoKey: posicaoNormalizada,
        posicaoDetalhe,
        nacionalidade: SELECOES.some((s) => s.id === temporada.nacionalidade) ? temporada.nacionalidade : "",
        clube: obterClube(temporada.clube)?.id || "",
        ano,
        jogos,
        gols,
        assistencias,
        atributos,
        overall,
        trofeusColetivos,
        trofeusIndividuais,
        eventos,
        lesaoGrave: !!temporada.lesaoGrave,
        lesaoCarreira: !!temporada.lesaoCarreira,
        jogosForaProximaTemporada: Math.max(0, Math.min(62, Math.floor(Number(temporada.jogosForaProximaTemporada) || 0))),
        data: typeof temporada.data === "string" && temporada.data ? temporada.data : new Date().toLocaleString("pt-BR"),
        carreiraId: typeof temporada.carreiraId === "string" && temporada.carreiraId ? temporada.carreiraId : "legacy"
    };
}

function normalizarEventosTemporada(eventos) {
    if (!Array.isArray(eventos)) {
        return [];
    }

    const tiposValidos = new Set([
        "hat-trick", "assistencia", "lesao", "lesao-moderada",
        "lesao-grave", "lesao-carreira", "cartao-vermelho"
    ]);

    return eventos
        .filter((evento) => evento && tiposValidos.has(evento.tipo))
        .map((evento) => ({
            tipo: evento.tipo,
            jogo: Math.max(1, Math.min(1000, Math.floor(Number(evento.jogo) || 1))),
            jogosPerdidos: Math.max(1, Math.min(1000, Math.floor(Number(evento.jogosPerdidos) || 1))),
            jogosForaProximaTemporada: Math.max(0, Math.min(62, Math.floor(Number(evento.jogosForaProximaTemporada) || 0))),
            idade: Math.max(0, Math.min(99, Math.floor(Number(evento.idade) || 0)))
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
        rompimentosContratoUsados: 0
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
            potencial: calcularPotencialDaCarreira(carreira)
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
        potencial: calcularPotencialDaCarreira(carreiraAtual)
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
        trofeusColetivos * 12 +
        trofeusIndividuais * 15
    );
}

function sortearPremio(chance) {
    return Math.random() < chance;
}

function gerarTrofeusSelecao(nacionalidade, ano, multiplicadorTitulos) {
    const selecao = SELECOES.find((item) => item.id === nacionalidade);
    if (!selecao || ano < 2028 || (ano - 2028) % 4 !== 0) {
        return [];
    }

    const competicoes = [
        { nome: "Olimpíadas", participantes: SELECOES },
        {
            nome: {
                americaSul: "Copa América",
                europa: "Eurocopa",
                americaNorte: "Copa Ouro",
                africa: "Copa das Nações Africanas",
                asia: "Copa da Ásia"
            }[selecao.regiao],
            participantes: SELECOES.filter((item) => item.regiao === selecao.regiao)
        }
    ];
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

function gerarTrofeusTemporada(posicao, jogos, gols, assistencias, ano, idade, temporadasAnteriores = [], nacionalidade = "", clubeId = "") {
    const cfg = getConfig();
    const t = cfg.titulos;
    const multColetivos = cfg.geral.multiplicadorTitulos;
    const multIndividuais = cfg.geral.multiplicadorPremios;
    const forcaClube = Math.max(1, Math.min(100, Number(cfg.clubes?.potencias?.[clubeId]) || 70));

    // Força 75 mantém aproximadamente a chance-base; clubes mais fortes aumentam e mais fracos reduzem.
    const fatorClube = 0.4 + forcaClube / 125;
    const nomesTrofeus = obterNomesTrofeusClube(clubeId);

    const trofeusColetivos = [];
    const trofeusIndividuais = [];
    const temporadaAtual = Number(ano) || ANO_INICIAL;
    const ciclo = Math.max(1, Number(t.cicloCopaDoMundo) || 4);

    // Ciclo da Copa do Mundo (a cada N anos, começando em ANO_INICIAL).
    const cicloCopaDoMundo = (temporadaAtual - ANO_INICIAL) % ciclo === 0;

    // Ciclo do Mundial de Clubes (a cada N anos, começando em anoInicioMundialClubes).
    const anoInicioMundial = Number(t.anoInicioMundialClubes) || 2029;
    const anoCopaDoMundoDeClubes =
        temporadaAtual >= anoInicioMundial &&
        (temporadaAtual - anoInicioMundial) % ciclo === 0;

    // -------- Títulos coletivos --------
    if (jogos >= 35 && sortearPremio(t.chanceCopaContinental * multColetivos * fatorClube)) {
        trofeusColetivos.push(nomesTrofeus.continental);
    }

    if (jogos >= 30 && sortearPremio(t.chanceLigaNacional * multColetivos * fatorClube)) {
        trofeusColetivos.push(nomesTrofeus.liga);
    }

    if (jogos >= 25 && sortearPremio(t.chanceCopaNacional * multColetivos * fatorClube)) {
        trofeusColetivos.push(nomesTrofeus.copa);
    }

    if (jogos >= 35 && cicloCopaDoMundo && sortearPremio(t.chanceCopaDoMundo * multColetivos)) {
        trofeusColetivos.push("Copa do Mundo");
    }

    if (jogos >= 25) {
        trofeusColetivos.push(...gerarTrofeusSelecao(nacionalidade, temporadaAtual, multColetivos));
    }

    const ganhouContinentalNestaTemporada = trofeusColetivos.includes(nomesTrofeus.continental);

    // Início do ciclo mundial atual (para checar se ganhou continental no mesmo ciclo).
    const inicioCicloMundial =
        ANO_INICIAL + Math.floor((temporadaAtual - ANO_INICIAL) / ciclo) * ciclo;

    const ganhouContinentalNoCiclo =
        ganhouContinentalNestaTemporada ||
        temporadasAnteriores.some(
            (temporada) =>
                Number(temporada.ano) >= inicioCicloMundial &&
                Number(temporada.ano) <= temporadaAtual &&
                Array.isArray(temporada.trofeusColetivos) &&
                temporada.trofeusColetivos.some(ehTituloContinental)
        );

    if (jogos >= 35 && ganhouContinentalNestaTemporada &&
        sortearPremio(t.chanceIntercontinental * multColetivos * fatorClube)) {
        trofeusColetivos.push("Intercontinental");
    }

    if (jogos >= 35 && anoCopaDoMundoDeClubes && ganhouContinentalNoCiclo &&
        sortearPremio(t.chanceMundialClubes * multColetivos * fatorClube)) {
        trofeusColetivos.push("Copa do Mundo de Clubes");
    }

    // -------- Títulos individuais --------
    if (
        posicao !== "Goleiro" &&
        trofeusColetivos.length >= 2 &&
        (gols >= 20 || assistencias >= 15 || gols + assistencias >= 25) &&
        sortearPremio(t.chanceBolaDeOuro * multIndividuais)
    ) {
        trofeusIndividuais.push("Bola de Ouro");
    }

    const jaGanhouGoldenBoy = temporadasAnteriores.some(
        (temporada) =>
            Array.isArray(temporada.trofeusIndividuais) &&
            temporada.trofeusIndividuais.includes("Golden Boy")
    );

    if (
        !jaGanhouGoldenBoy &&
        Number(idade) <= 20 &&
        Number(idade) >= 0 &&
        (gols >= 10 || assistencias >= 8 || gols + assistencias >= 15) &&
        sortearPremio(t.chanceGoldenBoy * multIndividuais)
    ) {
        trofeusIndividuais.push("Golden Boy");
    }

    if (gols > jogos && sortearPremio(t.chanceChuteiraDeOuro * multIndividuais)) {
        trofeusIndividuais.push("Chuteira de Ouro");
    }

    if (posicao === "Goleiro" && jogos >= 30 &&
        sortearPremio(t.chanceLuvaDeOuro * multIndividuais)) {
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

function renderDetalhesCarreira(carreira) {
    const temporadas = obterTemporadasDaCarreira(carreira);
    const totalTemporadas = temporadas.length;
    const totalTitulos = (carreira.trofeusColetivos || []).length;
    const mediaGols = carreira.jogos > 0 ? (carreira.gols / carreira.jogos).toFixed(2).replace(".", ",") : "0,00";
    const melhorTemporada = temporadas.reduce((melhor, temporada) => !melhor || (Number(temporada.gols) || 0) > (Number(melhor.gols) || 0) ? temporada : melhor, null);
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
            return `<div class="temporada-carreira-detalhe">
                <strong>${escaparHTML(temporada.ano)} · ${escaparHTML(temporada.idade)} anos</strong>
                <span>${escaparHTML(obterClube(temporada.clube)?.nome || "Clube não definido")}</span>
                <span>${temporada.jogos} jogos</span>
                <span>${temporada.gols} gols</span>
                <span>${temporada.assistencias} assistências</span>
                <small>${trofeus.length ? escaparHTML(trofeus.join(", ")) : "Sem títulos nesta temporada"}</small>
                <div class="temporada-eventos">${formatarEventosTemporada(temporada.eventos)}</div>
            </div>`;
        }).join("")
        : '<p class="detalhes-sem-historico">Os dados por temporada não estão disponíveis para esta carreira antiga.</p>';

    return `<details class="detalhes-carreira">
        <summary>Ver trajetória completa</summary>
        <div class="resumo-estatisticas-carreira">
            <div><span>Temporadas</span><strong>${totalTemporadas || "—"}</strong></div>
            <div><span>Média de gols por jogo</span><strong>${mediaGols}</strong></div>
            <div><span>Títulos coletivos</span><strong>${totalTitulos}</strong></div>
            <div class="melhor-temporada-detalhe">
                <span>Melhor temporada</span>
                <strong>${melhorTemporada ? `${escaparHTML(melhorTemporada.ano)} · ${Number(melhorTemporada.gols) || 0} gols` : "—"}</strong>
                ${melhorTemporada ? `<span>${Number(melhorTemporada.assistencias) || 0} assistências</span><small>${titulosMelhorTemporada.length ? `Títulos conquistados: ${escaparHTML(titulosMelhorTemporada.join(", "))}` : "Nenhum título conquistado nesta temporada"}</small>` : ""}
            </div>
        </div>
        <h4>Temporada por temporada</h4>
        <div class="lista-detalhes-temporadas">${listaTemporadas}</div>
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

];

function obterMetricasCarreira(carreira) {
    const temporadas = obterTemporadasDaCarreira(carreira);
    const titulosColetivos = Array.isArray(carreira.trofeusColetivos) ? carreira.trofeusColetivos.length : 0;
    const titulosIndividuais = Array.isArray(carreira.trofeusIndividuais) ? carreira.trofeusIndividuais.length : 0;
    return {
        gols: Number(carreira.gols) || 0,
        assistencias: Number(carreira.assistencias) || 0,
        jogos: Number(carreira.jogos) || 0,
        titulosColetivos,
        titulosIndividuais,
        temporadas: temporadas.length,
        premios: Number(carreira.premios) || titulos,
        pontuacao: Number(carreira.pontuacao) || calcularPontuacao(carreira)
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
                const valorExibido = conquista.metrica === "pontuacao"
                    ? Math.floor(valor).toLocaleString("pt-BR")
                    : valor.toLocaleString("pt-BR");

                return `<article class="conquista-card ${desbloqueada ? "desbloqueada" : "bloqueada"}">
                    <div class="conquista-icone">${desbloqueada ? conquista.icone : "🔒"}</div>
                    <div class="conquista-conteudo">
                        <span class="conquista-categoria">${escaparHTML(conquista.categoria)}</span>
                        <strong>${escaparHTML(conquista.nome)}</strong>
                        <p>${escaparHTML(conquista.descricao)}</p>
                        <div class="conquista-progresso"><span style="width:${progresso}%"></span></div>
                        <small>${valorExibido} / ${conquista.meta.toLocaleString("pt-BR")}${desbloqueada ? " · Desbloqueada" : ""}</small>
                    </div>
                </article>`;
            }).join("");
        }
    }

    // ----- Recordes -----
    const temporadasDeTodas = ordenadas.flatMap((item) => obterTemporadasDaCarreira(item).map((temporada) => ({
        ...temporada,
        carreiraNome: item.nome,
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

    const recordes = [
        { nome: "Mais gols em uma temporada", campo: "gols", sufixo: "gols", melhor: temporadasDeTodas.reduce((a, b) => !a || b.gols > a.gols ? b : a, null) },
        { nome: "Mais assistências em uma temporada", campo: "assistencias", sufixo: "assistências", melhor: temporadasDeTodas.reduce((a, b) => !a || b.assistencias > a.assistencias ? b : a, null) },
        { nome: "Mais títulos em uma temporada", campo: "titulosTemporada", sufixo: "títulos", melhor: temporadasDeTodas.reduce((a, b) => !a || b.titulosTemporada > a.titulosTemporada ? b : a, null) },
        { nome: "Maior pontuação em uma temporada", campo: "pontosTemporada", sufixo: "pontos", melhor: temporadasDeTodas.reduce((a, b) => !a || b.pontosTemporada > a.pontosTemporada ? b : a, null) },
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
            const detalhe = normalizarPosicaoDetalhada(carreira.posicaoDetalhe || carreira.posicao);
            const categoria = categoriaPosicao(detalhe);
            return POSICOES_CAMPO[posicaoSelecionada]
                ? detalhe === posicaoSelecionada
                : categoria === posicaoSelecionada;
        })
        .sort((a, b) => (Number(b[criterio]) || 0) - (Number(a[criterio]) || 0))
        .slice(0, 5);

    if (ranking.length === 0) {
        const mensagem = carreiras.length === 0
            ? "Nenhuma carreira finalizada ainda."
            : "Nenhuma carreira corresponde aos filtros selecionados.";
        listaRanking.innerHTML = `<li>${mensagem}</li>`;
        renderConquistas();
        return;
    }

    listaRanking.innerHTML = ranking
        .map((carreira, index) => {
            const trofeusColetivos = obterTrofeusColetivosDaCarreira(carreira);
            const trofeusIndividuais = Array.isArray(carreira.trofeusIndividuais) ? carreira.trofeusIndividuais : [];
            const premios = contarPremios(carreira);
            const trofeusHtml = [
                ...(trofeusColetivos.length ? [`<span class="ranking-trofeu coletivo">${escaparHTML(formatarTrofeus(trofeusColetivos))}</span>`] : []),
                ...(trofeusIndividuais.length ? [`<span class="ranking-trofeu individual">${escaparHTML(formatarTrofeus(trofeusIndividuais))}</span>`] : [])
            ];
            const conteudoTrofeus = trofeusHtml.length ? trofeusHtml.join("") : '<span class="ranking-trofeu coletivo">Nenhum</span>';
            const medalha = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "#";
            const classeTop = index === 0 ? "top-1" : index === 1 ? "top-2" : index === 2 ? "top-3" : "";

            return `
                <li class="${classeTop}">
                    <span class="rank-medal">${medalha}</span>
                    <strong>#${index + 1} - ${escaparHTML(carreira.nome)}</strong>
                    <p>Posição: ${escaparHTML(carreira.posicao)} | Seleção: ${escaparHTML(SELECOES.find((selecao) => selecao.id === carreira.nacionalidade)?.nome || "Não definida")} | Último clube: ${escaparHTML(obterClube(carreira.clube)?.nome || "Não definido")} | Pontuação: ${carreira.pontuacao}</p>
                    <p>Jogos: ${carreira.jogos} | Gols: ${carreira.gols} | Assistências: ${carreira.assistencias} | Prêmios: ${premios}</p>
                    <p>Títulos coletivos: ${trofeusColetivos.length} | Títulos individuais: ${trofeusIndividuais.length}</p>
                    <div class="ranking-trofeus">${conteudoTrofeus}</div>
                    <small>Idade limite: ${carreira.idadeLimite} anos</small>
                    ${renderDetalhesCarreira(carreira)}
                    <button type="button" class="remover-ranking" data-id="${escaparHTML(carreira.id || "")}" aria-label="Apagar ${escaparHTML(carreira.nome)} do ranking">Apagar</button>
                </li>
            `;
        })
        .join("");

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
    const perfilClube = document.getElementById("perfil-clube");
    const clube = obterClube(clubeId);
    const perfilContrato = document.getElementById("perfil-contrato");
    const carreiraAtual = obterCarreiraAtual();
    const limiteRompimentos = getConfig().geral.limiteRompimentosContrato;

    if (perfilNome) perfilNome.textContent = nome || "Jogador";
    if (perfilIdade) perfilIdade.textContent = idade ?? 0;
    if (perfilAno) perfilAno.textContent = ano ?? ANO_INICIAL;
    if (perfilSelecao) perfilSelecao.textContent = selecao ? selecao.nome : "Não definida";
    if (perfilClube) perfilClube.textContent = clube ? clube.nome : "Ainda não escolhido";
    if (perfilContrato) {
        const contrato = carreiraAtual.anosContratoRestantes > 0
            ? `${carreiraAtual.anosContratoRestantes} ${carreiraAtual.anosContratoRestantes === 1 ? "temporada" : "temporadas"} restantes`
            : clube ? "Vencido" : "Sem contrato";
        perfilContrato.textContent = `${contrato} · Rompimentos: ${carreiraAtual.rompimentosContratoUsados}/${limiteRompimentos}`;
    }
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

function renderHistorico() {
    const lista = document.getElementById("lista-temporadas");
    const filtroHistorico = document.getElementById("filtro-historico");
    const criterio = filtroHistorico?.value || "ordem";
    const historico = lerHistoricoAtiva();

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
            const trofeusColetivos = mapearTrofeusTemporada(temporada, "trofeusColetivos");
            const trofeusIndividuais = mapearTrofeusTemporada(temporada, "trofeusIndividuais");
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
                    <span> - ${escaparHTML(obterClube(temporada.clube)?.nome || "Clube não definido")}</span>
                    <p>Jogador: ${temporada.nome} | Idade: ${temporada.idade} anos</p>
                    <p>Jogos: ${temporada.jogos} | Gols: ${temporada.gols} | Assistências: ${temporada.assistencias} | Prêmios: ${premios}</p>
                    <p class="titulo-categoria">Títulos coletivos:</p>
                    <div class="titulo-tags">${renderTrofeus(trofeusColetivos)}</div>
                    <p class="titulo-categoria">Títulos individuais:</p>
                    <div class="titulo-tags">${renderTrofeus(trofeusIndividuais)}</div>
                    <p class="titulo-categoria">Eventos da temporada:</p>
                    ${formatarEventosTemporada(temporada.eventos)}
                    <small>${temporada.data}</small>
                </li>
            `;
        })
        .join("");
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
        "cartao-vermelho": (evento) => `🟥 Cartão vermelho no jogo ${evento.jogo}: suspensão de ${evento.jogosPerdidos} ${evento.jogosPerdidos === 1 ? "jogo" : "jogos"}`
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
        jogos: totais.jogos,
        gols: totais.gols,
        assistencias: totais.assistencias,
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
    document.getElementById("resumo-premios").textContent = totais.premios;
    document.getElementById("resumo-coletivos").textContent = formatarTrofeus(trofeus.coletivos);
    document.getElementById("resumo-individuais").textContent = formatarTrofeus(trofeus.individuais);

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

    if (resumoFinal) {
        resumoFinal.hidden = false;
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
        me:  { finalizacao: 0.90, drible: 1.00, velocidade: 1.00, passe: 1.10, fisico: 0.90, defesa: 0.85, reflexos: 0.10 },
        zag: { finalizacao: 0.60, drible: 0.85, velocidade: 0.85, passe: 0.90, fisico: 1.05, defesa: 1.05, reflexos: 0.10 },
        go:  { finalizacao: 0.30, drible: 0.50, velocidade: 0.85, passe: 0.90, fisico: 1.00, defesa: 0.90, reflexos: 1.10 }
    };
    return modificadores[posicao]?.[chave] ?? 1.0;
}

// Simula a temporada jogo a jogo com base no overall e nos atributos.
function simularTemporadaPorJogo(posicao, atributos, idade, jogosForaInicioTemporada = 0) {
    const cfg = getConfig();
    const overall = calcularOverall(posicao, atributos);

    // Fator idade: jovem ainda não é titular absoluto, veterano perde ritmo.
    let fatorIdade;
    if (idade <= 19) fatorIdade = 0.82;
    else if (idade <= 22) fatorIdade = 0.92;
    else if (idade <= 25) fatorIdade = 1.00;
    else if (idade <= 29) fatorIdade = 1.05;
    else if (idade <= 32) fatorIdade = 1.00;
    else if (idade <= 35) fatorIdade = 0.88;
    else fatorIdade = 0.72;

    // Probabilidade de entrar em campo em cada jogo.
    // Overall 30 → ~0.22 | 50 → ~0.50 | 70 → ~0.78 | 85 → ~0.95 | 95 → ~0.99
    const probParticipar = Math.max(0.05, Math.min(0.99, ((overall - 10) / 90) * fatorIdade));

    // Nº máximo de jogos possíveis (clube + seleção).
    const maxJogos = Math.round((posicao === "go" ? 55 : 62) * cfg.geral.multiplicadorJogos);

    // Médias esperadas por jogo (lambda da Poisson).
    const fin = Number(atributos?.finalizacao) || OVERALL_PADRAO;
    const pas = Number(atributos?.passe)       || OVERALL_PADRAO;
    const dri = Number(atributos?.drible)      || OVERALL_PADRAO;

    let lambdaGol = 0;
    let lambdaAssist = 0;

    if (posicao === "ata") {
        lambdaGol    = Math.pow(fin / 100, 3) * 1.00 + Math.pow(dri / 100, 3) * 0.15;
        lambdaAssist = Math.pow(pas / 100, 2.5) * 0.45 + Math.pow(dri / 100, 3) * 0.15;
    } else if (posicao === "me") {
        lambdaGol    = Math.pow(fin / 100, 3) * 0.55 + Math.pow(dri / 100, 3) * 0.10;
        lambdaAssist = Math.pow(pas / 100, 2.5) * 0.85 + Math.pow(dri / 100, 3) * 0.20;
    } else if (posicao === "zag") {
        lambdaGol    = Math.pow(fin / 100, 3) * 0.15;
        lambdaAssist = Math.pow(pas / 100, 3) * 0.15;
    } else if (posicao === "go") {
        lambdaGol    = 0.003;
        lambdaAssist = Math.pow(pas / 100, 4) * 0.06;
    }

    // Idade + multiplicadores das configurações.
    lambdaGol    *= fatorIdade * (cfg.geral.multiplicadorGols || 1);
    lambdaAssist *= fatorIdade * (cfg.geral.multiplicadorAssistencias || 1);

    // ===== Configuração de lesões (lida da página de configurações) =====
    const cfgLesoes = cfg.lesoes || {};
    const multLesoes = Number.isFinite(Number(cfgLesoes.multiplicador))
        ? Math.max(0, Number(cfgLesoes.multiplicador))
        : 1.0;

    let fatorLesao = 1.0;
    if (idade >= 33) {
        fatorLesao = Number.isFinite(Number(cfgLesoes.fatorIdoso))
            ? Number(cfgLesoes.fatorIdoso) : 1.8;
    } else if (idade >= 29) {
        fatorLesao = Number.isFinite(Number(cfgLesoes.fatorVeterano))
            ? Number(cfgLesoes.fatorVeterano) : 1.3;
    } else if (idade <= 24) {
        fatorLesao = Number.isFinite(Number(cfgLesoes.fatorJovem))
            ? Number(cfgLesoes.fatorJovem) : 0.8;
    }
    fatorLesao = Math.max(0, fatorLesao);

    const escala = fatorLesao * multLesoes;

    const chanceLeve     = Math.max(0, (Number.isFinite(Number(cfgLesoes.chanceLeve))     ? Number(cfgLesoes.chanceLeve)     : 0.012)   * escala);
    const chanceModerada = Math.max(0, (Number.isFinite(Number(cfgLesoes.chanceModerada)) ? Number(cfgLesoes.chanceModerada) : 0.0015)  * escala);
    const chanceGrave    = Math.max(0, (Number.isFinite(Number(cfgLesoes.chanceGrave))    ? Number(cfgLesoes.chanceGrave)    : 0.0003)  * escala);
    const chanceCarreira = Math.max(0, (Number.isFinite(Number(cfgLesoes.chanceCarreira)) ? Number(cfgLesoes.chanceCarreira) : 0.00003) * escala);

    // Limites cumulativos (cada jogo)
    const limCarreira = chanceCarreira;
    const limGrave    = limCarreira + chanceGrave;
    const limModerada = limGrave    + chanceModerada;
    const limLeve     = limModerada + chanceLeve;

    let jogos = 0;
    let gols = 0;
    let assistencias = 0;
    let jogosAfastado = Math.max(0, Math.floor(jogosForaInicioTemporada) || 0);
    const eventos = [];
    const chanceHatTrick = { ata: 0.009, me: 0.006, zag: 0.002, go: 0 }[posicao] || 0;
    const chancePasseDecisivo = { ata: 0.008, me: 0.012, zag: 0.003, go: 0.001 }[posicao] || 0;

    let lesaoGrave = false;
    let lesaoCarreira = false;
    let jogosForaProximaTemporada = 0;

    for (let i = 0; i < maxJogos; i++) {
        if (jogosAfastado > 0) {
            jogosAfastado--;
            continue;
        }
        if (Math.random() > probParticipar) continue;
        jogos++;
        gols        += amostrarPoisson(lambdaGol);
        assistencias += amostrarPoisson(lambdaAssist);

        const numeroJogo = jogos;
        if (Math.random() < chanceHatTrick) {
            gols += 3;
            eventos.push({ tipo: "hat-trick", jogo: numeroJogo });
        }
        if (Math.random() < chancePasseDecisivo) {
            assistencias += 2;
            eventos.push({ tipo: "assistencia", jogo: numeroJogo });
        }

        // ===== Sistema de lesões (configurável) =====
        const sorteioLesao = Math.random();

        if (sorteioLesao < limCarreira) {
            // Lesão gravíssima — encerra a carreira
            eventos.push({ tipo: "lesao-carreira", jogo: numeroJogo, idade: idade });
            lesaoCarreira = true;
            break;
        } else if (sorteioLesao < limGrave) {
            // Lesão grave — perde o resto da temporada + parte da próxima
            const jogosRestantes = maxJogos - i;
            const jogosProxima = Math.floor(Math.random() * 25); // 0–24
            eventos.push({
                tipo: "lesao-grave",
                jogo: numeroJogo,
                jogosPerdidos: jogosRestantes,
                jogosForaProximaTemporada: jogosProxima
            });
            lesaoGrave = true;
            jogosForaProximaTemporada = jogosProxima;
            break;
        } else if (sorteioLesao < limModerada) {
            // Lesão moderada — 8 a 20 jogos
            const jogosPerdidos = 8 + Math.floor(Math.random() * 13);
            eventos.push({ tipo: "lesao-moderada", jogo: numeroJogo, jogosPerdidos });
            jogosAfastado = jogosPerdidos;
        } else if (sorteioLesao < limLeve) {
            // Lesão leve — 1 a 6 jogos
            const jogosPerdidos = 1 + Math.floor(Math.random() * 6);
            eventos.push({ tipo: "lesao", jogo: numeroJogo, jogosPerdidos });
            jogosAfastado = jogosPerdidos;
        } else if (Math.random() < 0.004) {
            // Cartão vermelho
            const jogosPerdidos = 1 + Math.floor(Math.random() * 2);
            eventos.push({ tipo: "cartao-vermelho", jogo: numeroJogo, jogosPerdidos });
            jogosAfastado = jogosPerdidos;
        }
    }

    return {
        jogos,
        gols,
        assistencias,
        overall,
        eventos,
        lesaoGrave,
        lesaoCarreira,
        jogosForaProximaTemporada
    };
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
    const sim = simularTemporadaPorJogo(categoria, atributos, idade, jogosForaInicio);

    const trofeus = gerarTrofeusTemporada(
        dados.nome, sim.jogos, sim.gols, sim.assistencias,
        ano, idade, temporadasAnteriores, nacionalidade, clubeId
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
        jogos: sim.jogos,
        gols: sim.gols,
        assistencias: sim.assistencias,
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
            opcoesEl.innerHTML = clubesFiltrados.map((clube) => `
                <label class="opcao-clube${clube.desabilitado ? " opcao-clube--desabilitada" : ""}">
                    <input type="radio" name="escolha-clube" value="${escaparHTML(clube.id)}" ${clube.id === clubeSelecionadoAtual ? "checked" : ""} ${clube.desabilitado ? "disabled" : ""}>
                    <span><strong>${escaparHTML(clube.nome)}</strong>${clube.liga || clube.detalheContrato ? `<small>${[clube.liga, clube.detalheContrato].filter(Boolean).map(escaparHTML).join(" · ")}</small>` : ""}</span>
                </label>
            `).join("");
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

function criarOfertaContrato(clube, idade, idadeLimite) {
    const anosContrato = obterDuracaoContrato(idade, idadeLimite);
    return {
        ...clube,
        anosContrato,
        detalheContrato: `Contrato por ${anosContrato} ${anosContrato === 1 ? "ano" : "anos"}`
    };
}

async function escolherContratoParaTemporada(clubeAtual, temporadaInicial, idade, idadeLimite, carreiraAtual) {
    const limiteRompimentos = getConfig().geral.limiteRompimentosContrato;
    const rompimentosRestantes = Math.max(0, limiteRompimentos - carreiraAtual.rompimentosContratoUsados);
    const contratoAtivo = !temporadaInicial && carreiraAtual.anosContratoRestantes > 0;
    const ofertas = sortearClubes(3, clubeAtual, carreiraAtual.clubeAlvo)
        .map((clube) => criarOfertaContrato(clube, idade, idadeLimite));
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
            ...(clube || { id: clubeAtual, nome: "Clube atual", liga: "" }),
            detalheContrato: ""
        }, idade, idadeLimite);
        renovacao.detalheContrato = `Renovar por ${renovacao.anosContrato} ${renovacao.anosContrato === 1 ? "ano" : "anos"}`;
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
        rompeContrato: contratoAtivo && ofertaEscolhida.id !== clubeAtual
    };
}

function escolherClubeAlvo(clubeAlvo) {
    return exibirEscolhaClube(
        CLUBES,
        "Escolha seu clube-alvo",
        "O clube escolhido terá mais chances de aparecer entre as opções de cada sorteio, mas a escolha não garante uma oferta.",
        clubeAlvo,
        true
    );
}

function sortearClubeParaTemporada(clubeAtual, temporadaInicial, clubeAlvo = "") {
    const candidatos = temporadaInicial
        ? sortearClubes(3, "", clubeAlvo)
        : [{ id: clubeAtual }, ...sortearClubes(3, clubeAtual, clubeAlvo)];
    return candidatos[Math.floor(Math.random() * candidatos.length)].id;
}

let processamentoEmAndamento = false;

async function gerar() {
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
        const temporada = criarTemporada(nome, idade, ano, posicaoSelecionada.id, historico, nacionalidade, contratoEscolhido.clube);
        const historicoAtualizado = [...historico, temporada];

        document.getElementById("nome").value = nome;
        document.getElementById("idade").value = idade;
        atualizarResumoJogador(nome, idade, ano, nacionalidade, contratoEscolhido.clube);
        document.getElementById("jogos").textContent = temporada.jogos;
        document.getElementById("gols").textContent = temporada.gols;
        document.getElementById("assi").textContent = temporada.assistencias;
        document.getElementById("prem").textContent = contarPremios(temporada);
        atualizarTitulosResultados(temporada);

        const historicoDeOutrasCarreiras = lerHistorico().filter(
            (temporadaSalva) => temporadaSalva.carreiraId !== carreiraIdAnterior
                && temporadaSalva.carreiraId !== carreiraAtual.id
        );
        salvarHistorico([...historicoDeOutrasCarreiras, ...historicoAtualizado]);
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
        alert("Ocorreu um erro ao gerar a temporada. Veja o console (F12) para detalhes.");
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
    if (processamentoEmAndamento) {
        return;
    }
    processamentoEmAndamento = true;

    try {
        const posicaoSelecionada = document.querySelector('input[name="posicao"]:checked');
        const resumoFinal = document.getElementById("resumo-final");

        if (resumoFinal) resumoFinal.hidden = true;

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
                clubeAtual = sortearClubeParaTemporada("", true, carreiraAtual.clubeAlvo);
                anosContratoRestantes = obterDuracaoContrato(idade, idadeLimite);
            } else if (anosContratoRestantes <= 0) {
                // Contrato venceu: sorteia entre renovar no clube atual
                // ou aceitar uma das ofertas (sortearClubeParaTemporada já monta
                // a lista [clubeAtual, ...3 ofertas] e respeita o clube-alvo).
                clubeAtual = sortearClubeParaTemporada(clubeAtual, false, carreiraAtual.clubeAlvo);
                anosContratoRestantes = obterDuracaoContrato(idade, idadeLimite);
            }
            const temporada = criarTemporada(nome, idade, ano, posicaoSelecionada.id, historico, nacionalidade, clubeAtual);
            historico.push(temporada);
            
            // Lesão gravíssima encerra a carreira imediatamente.
            if (temporada.lesaoCarreira) {
                break;
            }
            
            anosContratoRestantes = Math.max(0, anosContratoRestantes - 1);
            idade = Number(historico[historico.length - 1].idade) + 1;
            ano = proximoAno(historico);
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
    document.getElementById("idade").value = "0";
    document.getElementById("idade-limite").value = IDADE_LIMITE_PADRAO;
    const nacionalidadeInput = document.getElementById("nacionalidade");
    if (nacionalidadeInput) nacionalidadeInput.value = "";
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

document.addEventListener("DOMContentLoaded", () => {

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
        filtroHistorico.addEventListener("change", renderHistorico);
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
        nacionalidadeInput.innerHTML = '<option value="">Selecione uma seleção</option>' +
            SELECOES.map((selecao) => `<option value="${selecao.id}">${escaparHTML(selecao.nome)}</option>`).join("");
        nacionalidadeInput.value = carreiraAtual.nacionalidade;
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
});