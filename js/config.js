/**
 * config.js — Sistema de configurações do FootMain.
 * Carregado ANTES de script.js em ambas as páginas.
 */

const STORAGE_KEY_CONFIG = "footmain_config_v1";

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