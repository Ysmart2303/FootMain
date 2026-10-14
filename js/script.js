const STORAGE_KEY = "footmain_temporadas";
const STORAGE_KEY_RANKING = "footmain_ranking";
const STORAGE_KEY_CARREIRA_ATUAL = "footmain_carreira_atual";
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
        gols: [[0, 1], [2, 3], [3, 4]],
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
    if (typeof valor !== "string") {
        return null;
    }

    const valorNormalizado = valor.trim().toLowerCase();
    const chave = Object.entries(posicoes).find(([, dados]) => dados.nome.toLowerCase() === valorNormalizado);
    if (chave) {
        return chave[0];
    }

    return posicoes[valorNormalizado] ? valorNormalizado : null;
}

function validarTemporada(temporada) {
    if (!temporada || typeof temporada !== "object") {
        return null;
    }

    const nome = normalizarNome(temporada.nome) || "Jogador";
    const posicaoNormalizada = normalizarPosicao(temporada.posicao) || normalizarPosicao(temporada.posicaoKey) || "ata";
    const dadosPosicao = posicoes[posicaoNormalizada] || posicoes.ata;
    const idade = Number.isFinite(Number(temporada.idade)) ? Math.max(0, Math.floor(Number(temporada.idade))) : 0;
    const ano = Number.isFinite(Number(temporada.ano)) ? Math.floor(Number(temporada.ano)) : ANO_INICIAL;
    const jogos = Number.isFinite(Number(temporada.jogos)) ? Math.max(0, Math.floor(Number(temporada.jogos))) : 0;
    const gols = Number.isFinite(Number(temporada.gols)) ? Math.max(0, Math.floor(Number(temporada.gols))) : 0;
    const assistencias = Number.isFinite(Number(temporada.assistencias)) ? Math.max(0, Math.floor(Number(temporada.assistencias))) : 0;
    const trofeusColetivos = Array.isArray(temporada.trofeusColetivos) ? temporada.trofeusColetivos.filter((trofeu) => typeof trofeu === "string") : [];
    const trofeusIndividuais = Array.isArray(temporada.trofeusIndividuais) ? temporada.trofeusIndividuais.filter((trofeu) => typeof trofeu === "string") : [];

    return {
        nome,
        idade,
        posicao: dadosPosicao.nome,
        posicaoKey: posicaoNormalizada,
        ano,
        jogos,
        gols,
        assistencias,
        trofeusColetivos,
        trofeusIndividuais,
        data: typeof temporada.data === "string" && temporada.data ? temporada.data : new Date().toLocaleString("pt-BR"),
        carreiraId: typeof temporada.carreiraId === "string" && temporada.carreiraId ? temporada.carreiraId : "legacy"
    };
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
    const carreiraPadrao = { id: gerarIdRanking(), nome: "Jogador", posicao: "Atacante", idadeLimite: IDADE_LIMITE_PADRAO };

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
            posicao: typeof carreira.posicao === "string" ? carreira.posicao : "Atacante",
            idadeLimite: Number.isFinite(Number(carreira.idadeLimite)) ? Math.max(1, Math.floor(Number(carreira.idadeLimite))) : IDADE_LIMITE_PADRAO
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
        posicao: typeof carreiraAtual.posicao === "string" ? carreiraAtual.posicao : "Atacante",
        idadeLimite: Number.isFinite(Number(carreiraAtual.idadeLimite)) ? Math.max(1, Math.floor(Number(carreiraAtual.idadeLimite))) : IDADE_LIMITE_PADRAO
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

function gerarTrofeusTemporada(posicao, jogos, gols, assistencias, ano, idade, temporadasAnteriores = []) {
    const trofeusColetivos = [];
    const trofeusIndividuais = [];
    const temporadaAtual = Number(ano) || ANO_INICIAL;
    const cicloCopaDoMundo = (temporadaAtual - ANO_INICIAL) % 4 === 0;
    // O Mundial de Clubes acontece a cada quatro anos, começando em 2029.
    const anoCopaDoMundoDeClubes = temporadaAtual >= 2029 && (temporadaAtual - 2029) % 4 === 0;

    if (jogos >= 35 && sortearPremio(0.18)) trofeusColetivos.push("Copa Continental");
    if (jogos >= 30 && sortearPremio(0.28)) trofeusColetivos.push("Liga Nacional");
    if (jogos >= 25 && sortearPremio(0.22)) trofeusColetivos.push("Copa Nacional");
    if (jogos >= 35 && cicloCopaDoMundo && sortearPremio(0.12)) trofeusColetivos.push("Copa do Mundo");

    const ganhouContinentalNestaTemporada = trofeusColetivos.includes("Copa Continental");
    const inicioCicloMundial = ANO_INICIAL + Math.floor((temporadaAtual - ANO_INICIAL) / 4) * 4;
    const ganhouContinentalNoCiclo = ganhouContinentalNestaTemporada || temporadasAnteriores.some((temporada) =>
        Number(temporada.ano) >= inicioCicloMundial && Number(temporada.ano) <= temporadaAtual &&
        Array.isArray(temporada.trofeusColetivos) && temporada.trofeusColetivos.includes("Copa Continental")
    );

    if (jogos >= 35 && ganhouContinentalNestaTemporada && sortearPremio(0.35)) {
        trofeusColetivos.push("Intercontinental");
    }
    if (jogos >= 35 && anoCopaDoMundoDeClubes && ganhouContinentalNoCiclo && sortearPremio(0.20)) {
        trofeusColetivos.push("Copa do Mundo de Clubes");
    }

    if (posicao !== "Goleiro" && trofeusColetivos.length >= 2 && (gols >= 20 || assistencias >= 15 || gols + assistencias >= 25) && sortearPremio(0.25)) {
        trofeusIndividuais.push("Bola de Ouro");
    }

    const jaGanhouGoldenBoy = temporadasAnteriores.some((temporada) =>
        Array.isArray(temporada.trofeusIndividuais) && temporada.trofeusIndividuais.includes("Golden Boy")
    );

    if (!jaGanhouGoldenBoy && Number(idade) <= 20 && Number(idade) >= 0 && (gols >= 10 || assistencias >= 8 || gols + assistencias >= 15) && sortearPremio(0.18)) {
        trofeusIndividuais.push("Golden Boy");
    }

    if (gols > jogos && sortearPremio(0.5)) {
        trofeusIndividuais.push("Chuteira de Ouro");
    }

    if (posicao === "Goleiro" && jogos >= 30 && sortearPremio(0.3)) {
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
            ...(Array.isArray(melhorTemporada.trofeusColetivos) ? melhorTemporada.trofeusColetivos : []),
            ...(Array.isArray(melhorTemporada.trofeusIndividuais) ? melhorTemporada.trofeusIndividuais : [])
        ]
        : [];

    const listaTemporadas = totalTemporadas
        ? temporadas.map((temporada) => {
            const trofeus = [...(temporada.trofeusColetivos || []), ...(temporada.trofeusIndividuais || [])];
            return `<div class="temporada-carreira-detalhe">
                <strong>${escaparHTML(temporada.ano)} · ${escaparHTML(temporada.idade)} anos</strong>
                <span>${temporada.jogos} jogos</span>
                <span>${temporada.gols} gols</span>
                <span>${temporada.assistencias} assistências</span>
                <small>${trofeus.length ? escaparHTML(trofeus.join(", ")) : "Sem títulos nesta temporada"}</small>
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
    const ranking = lerRanking()
        .filter((carreira) => posicaoSelecionada === "todas" || carreira.posicao === posicaoSelecionada)
        .sort((a, b) => (Number(b[criterio]) || 0) - (Number(a[criterio]) || 0))
        .slice(0, 5);

    if (ranking.length === 0) {
        listaRanking.innerHTML = "<li>Nenhuma carreira finalizada ainda.</li>";
        renderConquistas();
        return;
    }

    listaRanking.innerHTML = ranking
        .map((carreira, index) => {
            const trofeusColetivos = Array.isArray(carreira.trofeusColetivos) ? carreira.trofeusColetivos : [];
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
                    <p>Posição: ${escaparHTML(carreira.posicao)} | Pontuação: ${carreira.pontuacao}</p>
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

function atualizarResumoJogador(nome, idade, ano) {
    const perfilNome = document.getElementById("perfil-nome");
    const perfilIdade = document.getElementById("perfil-idade");
    const perfilAno = document.getElementById("perfil-ano");

    if (perfilNome) perfilNome.textContent = nome || "Jogador";
    if (perfilIdade) perfilIdade.textContent = idade ?? 0;
    if (perfilAno) perfilAno.textContent = ano ?? ANO_INICIAL;
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
            resultado.coletivos.push(...(Array.isArray(temporada.trofeusColetivos) ? temporada.trofeusColetivos : []));
            resultado.individuais.push(...(Array.isArray(temporada.trofeusIndividuais) ? temporada.trofeusIndividuais : []));
            return resultado;
        },
        { coletivos: [], individuais: [] }
    );

    const carreira = {
        id: carreiraAtual.id || gerarIdRanking(),
        nome,
        posicao: posicao || "-",
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
    const indiceExistente = rankingAtual.findIndex(
        (registro) => String(registro.id) === String(carreira.id)
    );

    if (indiceExistente >= 0) {
        rankingAtual[indiceExistente] = carreira;
    } else {
        rankingAtual.push(carreira);
    }

    salvarRanking(rankingAtual);

    renderRanking();

    const notificacaoConquista = document.getElementById("notificacao-conquista");
    if (notificacaoConquista) {
        const metricasConquista = obterMetricasCarreira(carreira);
        const conquistasObtidas = CONQUISTAS.filter((conquista) => metricasConquista[conquista.metrica] >= conquista.meta);
        notificacaoConquista.textContent = conquistasObtidas.length
            ? `Carreira registrada! ${conquistasObtidas.length} de ${CONQUISTAS.length} conquistas desbloqueadas nesta carreira.`
            : "Carreira registrada! Continue jogando para desbloquear conquistas.";
        notificacaoConquista.hidden = false;
    }

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

function validarDadosJogador({ nome, idade, idadeLimite, posicao }) {
    const nomeValidado = normalizarNome(nome);
    if (!nomeValidado) {
        return { valido: false, mensagem: "Informe um nome válido para o jogador." };
    }

    const idadeNumero = Number(idade);
    if (!Number.isFinite(idadeNumero) || idadeNumero < 0 || idadeNumero > 99) {
        return { valido: false, mensagem: "Informe uma idade inicial válida entre 0 e 99 anos." };
    }

    const idadeLimiteNumero = Number(idadeLimite);
    if (!Number.isFinite(idadeLimiteNumero) || idadeLimiteNumero <= idadeNumero) {
        return { valido: false, mensagem: "A idade limite deve ser maior que a idade inicial." };
    }

    if (!posicao || !(posicao in posicoes)) {
        return { valido: false, mensagem: "Selecione uma posição válida para a carreira." };
    }

    return { valido: true, nome: nomeValidado, idade: Math.floor(idadeNumero), idadeLimite: Math.floor(idadeLimiteNumero), posicao };
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

function criarTemporada(nome, idade, ano, posicao, temporadasAnteriores = []) {
    const dados = posicoes[posicao];
    const carreiraAtual = obterCarreiraAtual();
    const jogos = sortearValorPorSubconjunto(dados.jogos);
    const gols = sortearValorPorSubconjunto(dados.gols);
    const assistencias = sortearValorPorSubconjunto(dados.assistencias);
    const trofeus = gerarTrofeusTemporada(dados.nome, jogos, gols, assistencias, ano, idade, temporadasAnteriores);

    return {
        nome,
        idade,
        posicao: dados.nome,
        posicaoKey: posicao,
        ano,
        jogos,
        gols,
        assistencias,
        trofeusColetivos: trofeus.trofeusColetivos,
        trofeusIndividuais: trofeus.trofeusIndividuais,
        data: new Date().toLocaleString("pt-BR"),
        carreiraId: carreiraAtual.id || gerarIdRanking()
    };
}

let processamentoEmAndamento = false;

function gerar() {
    if (processamentoEmAndamento) {
        return;
    }

    processamentoEmAndamento = true;

    try {
        const posicaoSelecionada = document.querySelector('input[name="posicao"]:checked');
        const resumoFinal = document.getElementById("resumo-final");

        if (resumoFinal) {
            resumoFinal.hidden = true;
        }

        if (!posicaoSelecionada) {
            alert("Selecione uma posição antes de gerar o jogador.");
            return;
        }

        const idadeInput = document.getElementById("idade");
        const nomeInput = document.getElementById("nome");
        const nome = normalizarNome(nomeInput ? nomeInput.value : "") || obterNomeAtual();
        const dadosPosicao = posicoes[posicaoSelecionada.id];
        const idadeLimite = obterIdadeLimite();
        const idadeInformada = Number(idadeInput ? idadeInput.value : "") || 0;
        const dadosValidos = validarDadosJogador({ nome, idade: idadeInformada, idadeLimite, posicao: posicaoSelecionada.id });

        if (!dadosValidos.valido) {
            alert(dadosValidos.mensagem);
            return;
        }

        const carreiraAtual = obterCarreiraAtual();
        carreiraAtual.nome = nome;
        carreiraAtual.posicao = dadosPosicao.nome;
        carreiraAtual.idadeLimite = idadeLimite;
        salvarCarreiraAtual(carreiraAtual);

        const historico = obterHistoricoDaCarreira(nome, dadosPosicao);
        const idade = historico.length === 0 ? dadosValidos.idade : (Number(historico[historico.length - 1].idade) || 0) + 1;
        const ano = proximoAno(historico);

        if (idade > idadeLimite) {
            mostrarResumoFinal(nome, idadeLimite, ano, historico, dadosPosicao.nome);
            return;
        }

        const temporada = criarTemporada(nome, idade, ano, posicaoSelecionada.id, historico);
        const historicoAtualizado = [...historico, temporada];

        document.getElementById("nome").value = nome;
        document.getElementById("idade").value = idade;
        atualizarResumoJogador(nome, idade, ano);
        document.getElementById("jogos").textContent = temporada.jogos;
        document.getElementById("gols").textContent = temporada.gols;
        document.getElementById("assi").textContent = temporada.assistencias;
        document.getElementById("prem").textContent = contarPremios(temporada);

        salvarHistorico(historicoAtualizado);
        renderHistorico();
    } finally {
        processamentoEmAndamento = false;
    }
}

function simularTudo() {
    if (processamentoEmAndamento) {
        return;
    }

    processamentoEmAndamento = true;

    try {
        const posicaoSelecionada = document.querySelector('input[name="posicao"]:checked');
        const resumoFinal = document.getElementById("resumo-final");

        if (resumoFinal) {
            resumoFinal.hidden = true;
        }

        if (!posicaoSelecionada) {
            alert("Selecione uma posição antes de simular a carreira completa.");
            return;
        }

        const nomeInput = document.getElementById("nome");
        const nome = normalizarNome(nomeInput ? nomeInput.value : "") || obterNomeAtual();
        const dadosPosicao = posicoes[posicaoSelecionada.id];
        const idadeLimite = obterIdadeLimite();
        const idadeInicial = Number(document.getElementById("idade").value) || 0;
        const dadosValidos = validarDadosJogador({ nome, idade: idadeInicial, idadeLimite, posicao: posicaoSelecionada.id });

        if (!dadosValidos.valido) {
            alert(dadosValidos.mensagem);
            return;
        }

        const carreiraAtual = obterCarreiraAtual();
        carreiraAtual.nome = nome;
        carreiraAtual.posicao = dadosPosicao.nome;
        carreiraAtual.idadeLimite = idadeLimite;

        // Simulação completa sempre começa uma NOVA carreira:
        // gera um id novo para não colidir com o ranking anterior.
        carreiraAtual.id = gerarIdRanking();
        salvarCarreiraAtual(carreiraAtual);

        // Como o id é inédito, nenhuma temporada antiga é removida por engano;
        // apenas limpamos eventuais sobras com esse id (não deve haver).
        const historicoExistente = lerHistorico();
        const historicoDeOutrasCarreiras = historicoExistente.filter(
            (temporada) => temporada.carreiraId !== carreiraAtual.id
        );
        salvarHistorico(historicoDeOutrasCarreiras);

        let historico = [];
        let idade = dadosValidos.idade;
        let ano = ANO_INICIAL;

        while (idade <= idadeLimite) {
            const temporada = criarTemporada(nome, idade, ano, posicaoSelecionada.id, historico);
            historico.push(temporada);
            idade = Number(historico[historico.length - 1].idade) + 1;
            ano = proximoAno(historico);
        }

        if (historico.length > 0) {
            const ultimaTemporada = historico[historico.length - 1];
            const idadeUltima = Number(ultimaTemporada.idade) || 0;
            document.getElementById("idade").value = idadeUltima;
            atualizarResumoJogador(nome, idadeUltima, ano);
        }

        salvarHistorico(historico);
        renderHistorico();
        mostrarResumoFinal(nome, idadeLimite, ano, historico, dadosPosicao.nome);
    } finally {
        processamentoEmAndamento = false;
    }
}

function limparHistorico() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_CARREIRA_ATUAL);
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
    const filtroPosicaoRanking = document.getElementById("filtro-posicao-ranking");
    const filtroHistorico = document.getElementById("filtro-historico");
    const filtroCarreiraConquistas = document.getElementById("filtro-carreira-conquistas");
    const filtroCategoriaConquistas = document.getElementById("filtro-categoria-conquistas");
    
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
    const carreiraAtual = obterCarreiraAtual();
    const nomeAtual = normalizarNome(carreiraAtual.nome) || "Jogador";
    document.getElementById("nome").value = nomeAtual === "Jogador" ? "" : nomeAtual;
    atualizarResumoJogador(nomeAtual === "Jogador" ? "Jogador" : nomeAtual, idadeInicial, ANO_INICIAL);
    renderHistorico();
    renderRanking();
});