/**
 * config.js — Sistema de configurações do FootMain.
 * Carregado ANTES de script.js em ambas as páginas.
 */

const STORAGE_KEY_CONFIG = "footmain_config_v1";
const VERSAO_APP = "1.3.1";

/* ---------- Definições base (as "de fábrica") ---------- */
const POSICOES_PADRAO = {
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

/* Variáveis globais mutáveis consumidas por script.js */
var posicoes = JSON.parse(JSON.stringify(POSICOES_PADRAO));
var ANO_INICIAL = 2026;
var IDADE_LIMITE_PADRAO = 40;

const SELECOES = [
    { id: "espanha", nome: "Espanha", regiao: "europa" },
    { id: "argentina", nome: "Argentina", regiao: "americaSul" },
    { id: "franca", nome: "França", regiao: "europa" },
    { id: "inglaterra", nome: "Inglaterra", regiao: "europa" },
    { id: "portugal", nome: "Portugal", regiao: "europa" },
    { id: "brasil", nome: "Brasil", regiao: "americaSul" },
    { id: "holanda", nome: "Holanda", regiao: "europa" },
    { id: "belgica", nome: "Bélgica", regiao: "europa" },
    { id: "alemanha", nome: "Alemanha", regiao: "europa" },
    { id: "croacia", nome: "Croácia", regiao: "europa" },
    { id: "marrocos", nome: "Marrocos", regiao: "africa" },
    { id: "italia", nome: "Itália", regiao: "europa" },
    { id: "colombia", nome: "Colômbia", regiao: "americaSul" },
    { id: "uruguai", nome: "Uruguai", regiao: "americaSul" },
    { id: "suica", nome: "Suíça", regiao: "europa" },
    { id: "japao", nome: "Japão", regiao: "asia" },
    { id: "senegal", nome: "Senegal", regiao: "africa" },
    { id: "ira", nome: "Irã", regiao: "asia" },
    { id: "mexico", nome: "México", regiao: "americaNorte" },
    { id: "estadosUnidos", nome: "Estados Unidos", regiao: "americaNorte" }
];

const CLUBES = [
    { id: "manchester-city", nome: "Manchester City", liga: "Premier League" },
    { id: "arsenal", nome: "Arsenal", liga: "Premier League" },
    { id: "liverpool", nome: "Liverpool", liga: "Premier League" },
    { id: "chelsea", nome: "Chelsea", liga: "Premier League" },
    { id: "manchester-united", nome: "Manchester United", liga: "Premier League" },

    { id: "real-madrid", nome: "Real Madrid", liga: "La Liga" },
    { id: "barcelona", nome: "Barcelona", liga: "La Liga" },
    { id: "atletico-madrid", nome: "Atlético de Madrid", liga: "La Liga" },
    { id: "athletic-bilbao", nome: "Athletic Club", liga: "La Liga" },
    { id: "real-sociedad", nome: "Real Sociedad", liga: "La Liga" },

    { id: "inter", nome: "Inter de Milão", liga: "Serie A" },
    { id: "milan", nome: "Milan", liga: "Serie A" },
    { id: "juventus", nome: "Juventus", liga: "Serie A" },
    { id: "napoli", nome: "Napoli", liga: "Serie A" },
    { id: "roma", nome: "Roma", liga: "Serie A" },

    { id: "bayern-munich", nome: "Bayern de Munique", liga: "Bundesliga" },
    { id: "borussia-dortmund", nome: "Borussia Dortmund", liga: "Bundesliga" },
    { id: "bayer-leverkusen", nome: "Bayer Leverkusen", liga: "Bundesliga" },
    { id: "rb-leipzig", nome: "RB Leipzig", liga: "Bundesliga" },
    { id: "stuttgart", nome: "Stuttgart", liga: "Bundesliga" },

    { id: "paris-saint-germain", nome: "Paris Saint-Germain", liga: "Ligue 1" },
    { id: "marseille", nome: "Marseille", liga: "Ligue 1" },
    { id: "monaco", nome: "Monaco", liga: "Ligue 1" },
    { id: "lille", nome: "Lille", liga: "Ligue 1" },
    { id: "lyon", nome: "Lyon", liga: "Ligue 1" },

    { id: "flamengo", nome: "Flamengo", liga: "Brasileirão" },
    { id: "corinthians", nome: "Corinthias", liga: "Brasileirão" },
    { id: "sao-paulo", nome: "São Paulo FC", liga: "Brasileirão" },
    { id: "palmeiras", nome: "Palmeiras", liga: "Brasileirão" },
    { id: "santos", nome: "Santos FC", liga: "Brasileirão" },
    { id: "vasco", nome: "Vasco da Gama", liga: "Brasileirão" },
{ id: "nautico", nome: "Náutico", liga: "Brasileirão" },
    { id: "criciuma", nome: "Criciuma", liga: "Brasileirão" },
    { id: "mirassol", nome: "Mirassol", liga: "Brasileirão" },
    { id: "botafogo", nome: "Botafogo", liga: "Brasileirão" }
];

/* ============================================================
   Fator liga / clube — versão 1.2.1
   dificuldade: quanto maior, menos gols por temporada na liga.
   prestigio:   quanto maior, mais visibilidade para prêmios.
   ============================================================ */
const PERFIL_LIGAS = {
    "Premier League": { dificuldade: 1.15, prestigio: 1.20 },
    "La Liga":        { dificuldade: 1.10, prestigio: 1.18 },
    "Serie A":        { dificuldade: 1.12, prestigio: 1.10 },
    "Bundesliga":     { dificuldade: 1.08, prestigio: 1.10 },
    "Ligue 1":        { dificuldade: 1.02, prestigio: 1.05 },
    "Brasileirão":    { dificuldade: 0.92, prestigio: 0.80 }
};

const FORCA_CLUBES = {
    // Premier League
    "manchester-city": 96, "arsenal": 91, "liverpool": 90, "chelsea": 85,
    "manchester-united": 84, "tottenham": 82, "newcastle": 81, "aston-villa": 79,
    "west-ham": 75, "brighton": 75, "everton": 71, "crystal-palace": 70,
    "fulham": 69, "brentford": 68, "wolves": 67, "nottingham-forest": 67,
    "bournemouth": 65, "leicester-city": 64, "ipswich-town": 59, "southampton": 58,

    // La Liga
    "real-madrid": 97, "barcelona": 91, "atletico-madrid": 88, "athletic-bilbao": 80,
    "real-sociedad": 78, "girona": 76, "real-betis": 75, "villarreal": 74,
    "sevilla": 73, "valencia": 71, "osasuna": 68, "celta-vigo": 68,
    "getafe": 67, "mallorca": 66, "alaves": 65, "rayo-vallecano": 64,
    "las-palmas": 63, "espanyol": 61, "leganes": 60, "real-valladolid": 58,

    // Serie A
    "inter": 90, "milan": 86, "juventus": 86, "napoli": 85, "atalanta": 82,
    "roma": 82, "lazio": 80, "fiorentina": 78, "bologna": 76, "torino": 72,
    "udinese": 71, "genoa": 70, "monza": 68, "cagliari": 67, "verona": 66,
    "lecce": 65, "parma": 64, "como": 63, "empoli": 63, "venezia": 62,

    // Bundesliga
    "bayern-munich": 94, "bayer-leverkusen": 88, "borussia-dortmund": 85,
    "rb-leipzig": 83, "stuttgart": 79, "eintracht-frankfurt": 76, "freiburg": 74,
    "wolfsburg": 73, "borussia-monchengladbach": 72, "hoffenheim": 71,
    "werder-bremen": 70, "union-berlin": 69, "augsburg": 68, "mainz": 67,
    "hamburger-sv": 66, "heidenheim": 65, "schalke-04": 64, "bochum": 63,
    "holstein-kiel": 60, "st-pauli": 59,

    // Ligue 1
    "paris-saint-germain": 94, "marseille": 80, "monaco": 79, "lille": 77,
    "lyon": 76, "nice": 74, "lens": 73, "rennes": 72, "strasbourg": 71,
    "toulouse": 69, "montpellier": 68, "reims": 68, "nantes": 67,
    "auxerre": 65, "saint-etienne": 64, "angers": 63, "le-havre": 62,
    "bordeaux": 62, "lorient": 61, "metz": 60,

    // Brasileirão
    "flamengo": 90, "palmeiras": 89, "botafogo": 84, "corinthians": 80,
    "sao-paulo": 80, "atletico-mg": 79, "internacional": 78, "gremio": 77,
    "cruzeiro": 76, "santos": 76, "fortaleza": 76, "bahia": 76,
    "fluminense": 75, "vasco": 73, "bragantino": 72, "ceara": 71,
    "sport": 68, "vitoria": 67, "juventude": 65, "mirassol": 63
};

/* ---------- Configurações padrão ---------- */
const CONFIG_PADRAO = {
    geral: {
        anoInicial: 2026,
        idadeInicialPadrao: 18,
        idadeLimitePadrao: 40,
        multiplicadorJogos: 1,
        multiplicadorGols: 1,
        multiplicadorAssistencias: 1,
        multiplicadorTitulos: 1,
        multiplicadorPremios: 1
    },
    titulos: {
        chanceLigaNacional: 0.28,
        chanceCopaNacional: 0.22,
        chanceCopaContinental: 0.18,
        chanceCopaDoMundo: 0.12,
        chanceIntercontinental: 0.35,
        chanceMundialClubes: 0.20,
        chanceBolaDeOuro: 0.25,
        chanceGoldenBoy: 0.18,
        chanceChuteiraDeOuro: 0.50,
        chanceLuvaDeOuro: 0.30,
        anoInicioMundialClubes: 2029,
        cicloCopaDoMundo: 4
    },
    selecao: {
        potencias: {
            espanha: 99,
            argentina: 98,
            franca: 97,
            inglaterra: 96,
            portugal: 94,
            brasil: 93,
            holanda: 91,
            belgica: 89,
            alemanha: 88,
            croacia: 87,
            marrocos: 86,
            italia: 85,
            colombia: 84,
            uruguai: 83,
            suica: 82,
            japao: 81,
            senegal: 80,
            ira: 79,
            mexico: 78,
            estadosUnidos: 77
        }
    }
};

/* ---------- Presets prontos ---------- */
const PRESETS_CONFIG = {
    padrao: {},
    arcade: {
        geral: { multiplicadorJogos: 1.2, multiplicadorGols: 1.6, multiplicadorAssistencias: 1.5, multiplicadorTitulos: 1.4, multiplicadorPremios: 1.5 },
        titulos: { chanceLigaNacional: 0.40, chanceCopaContinental: 0.30, chanceBolaDeOuro: 0.40 }
    },
    realista: {
        geral: { multiplicadorTitulos: 0.7, multiplicadorPremios: 0.75 },
        titulos: { chanceLigaNacional: 0.18, chanceCopaContinental: 0.10, chanceBolaDeOuro: 0.15 }
    },
    hardcore: {
        geral: { multiplicadorJogos: 0.9, multiplicadorGols: 0.7, multiplicadorAssistencias: 0.8, multiplicadorTitulos: 0.4, multiplicadorPremios: 0.5 },
        titulos: { chanceLigaNacional: 0.10, chanceCopaNacional: 0.08, chanceCopaContinental: 0.05, chanceCopaDoMundo: 0.03, chanceBolaDeOuro: 0.08 }
    },
    lendario: {
        geral: { multiplicadorJogos: 1.3, multiplicadorGols: 2.0, multiplicadorAssistencias: 1.8, multiplicadorTitulos: 1.8, multiplicadorPremios: 2.0 },
        titulos: { chanceLigaNacional: 0.55, chanceCopaContinental: 0.45, chanceCopaDoMundo: 0.30, chanceBolaDeOuro: 0.55 }
    }
};

/* ---------- Utilitários ---------- */
function clonarConfig(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function mesclarConfig(base, override) {
    const resultado = clonarConfig(base);
    if (!override || typeof override !== "object") return resultado;
    for (const chave in resultado) {
        if (override[chave] === undefined) continue;
        const valorBase = resultado[chave];
        const valorOverride = override[chave];
        if (valorBase && typeof valorBase === "object" && !Array.isArray(valorBase)) {
            resultado[chave] = mesclarConfig(valorBase, valorOverride);
        } else {
            resultado[chave] = valorOverride;
        }
    }
    return resultado;
}

function carregarConfig() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (!raw) return clonarConfig(CONFIG_PADRAO);
        return mesclarConfig(CONFIG_PADRAO, JSON.parse(raw));
    } catch (erro) {
        console.error("Erro ao carregar configurações:", erro);
        return clonarConfig(CONFIG_PADRAO);
    }
}

function salvarConfig(config) {
    try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
        return true;
    } catch (erro) {
        console.error("Erro ao salvar configurações:", erro);
        return false;
    }
}

/**
 * Aplica a config salva nas variáveis globais usadas por script.js.
 * Retorna o objeto aplicado.
 */
function aplicarConfiguracoes() {
    const config = carregarConfig();
    ANO_INICIAL = Math.max(1, Math.floor(Number(config.geral.anoInicial) || 2026));
    IDADE_LIMITE_PADRAO = Math.max(1, Math.floor(Number(config.geral.idadeLimitePadrao) || 40));
    posicoes = JSON.parse(JSON.stringify(POSICOES_PADRAO));
    window.CONFIG_ATUAL = config;
    return config;
}

/** Atalho para obter a config em qualquer lugar. */
function getConfig() {
    if (!window.CONFIG_ATUAL) return aplicarConfiguracoes();
    return window.CONFIG_ATUAL;
}

function resetarConfig() {
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    return aplicarConfiguracoes();
}

function aplicarPreset(nome) {
    if (!(nome in PRESETS_CONFIG)) return false;
    const nova = mesclarConfig(CONFIG_PADRAO, PRESETS_CONFIG[nome]);
    salvarConfig(nova);
    aplicarConfiguracoes();
    return true;
}

function exportarConfigJSON() {
    return JSON.stringify(carregarConfig(), null, 2);
}

function importarConfigJSON(texto) {
    try {
        const parsed = JSON.parse(texto);
        const mesclada = mesclarConfig(CONFIG_PADRAO, parsed);
        salvarConfig(mesclada);
        aplicarConfiguracoes();
        return { ok: true };
    } catch (erro) {
        return { ok: false, erro: erro.message };
    }
}

/* Aplica assim que o ficheiro é carregado. */
aplicarConfiguracoes();

/* Preenche automaticamente todo elemento [data-versao-app] com a versão. */
function exibirVersaoApp() {
    document.querySelectorAll("[data-versao-app]").forEach((el) => {
        el.textContent = `v${VERSAO_APP}`;
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", exibirVersaoApp);
} else {
    exibirVersaoApp();
}