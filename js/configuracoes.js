/* Renderiza a página de configurações com base num schema. */

const SCHEMA_CONFIG = [
    {
        id: "geral",
        titulo: "Carreira",
        icone: "👤",
        descricao: "Defina quantas vezes o jogador pode romper um contrato antes do vencimento (limite máximo: 10).",
        campos: [
            { caminho: "geral.anoInicial",          label: "Ano inicial",             tipo: "number", min: 1950, max: 2200, passo: 1 },
            { caminho: "geral.idadeInicialPadrao",  label: "Idade inicial padrão",    tipo: "number", min: 10,   max: 40,   passo: 1 },
            { caminho: "geral.idadeLimitePadrao",   label: "Idade limite padrão",     tipo: "number", min: 20,   max: 80,   passo: 1 },
            { caminho: "geral.limiteRompimentosContrato", label: "Limite de rompimentos de contrato", tipo: "number", min: 0, max: 10, passo: 1 }
        ]
    },
    {
        id: "multiplicadores",
        titulo: "Multiplicadores",
        icone: "🎚️",
        descricao: "Valores acima de 1.0 aumentam o resultado; abaixo, reduzem.",
        campos: [
            { caminho: "geral.multiplicadorJogos",         label: "Jogos por temporada",   tipo: "range", min: 0.1, max: 3, passo: 0.1 },
            { caminho: "geral.multiplicadorGols",          label: "Gols",                  tipo: "range", min: 0.1, max: 3, passo: 0.1 },
            { caminho: "geral.multiplicadorAssistencias",  label: "Assistências",          tipo: "range", min: 0.1, max: 3, passo: 0.1 },
            { caminho: "geral.multiplicadorTitulos",       label: "Títulos coletivos",     tipo: "range", min: 0.1, max: 3, passo: 0.1 },
            { caminho: "geral.multiplicadorPremios",       label: "Títulos individuais",   tipo: "range", min: 0.1, max: 3, passo: 0.1 }
        ]
    },
    {
        id: "titulos",
        titulo: "Chances de títulos",
        icone: "🏆",
        descricao: "Probabilidade (0 a 1) de conquistar cada título quando o critério mínimo for atingido.",
        campos: [
            { caminho: "titulos.chanceLigaNacional",     label: "Liga Nacional",          tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.chanceCopaNacional",     label: "Copa Nacional",          tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.chanceCopaContinental",  label: "Copa Continental",       tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.chanceCopaDoMundo",      label: "Copa do Mundo",          tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.chanceIntercontinental", label: "Intercontinental",       tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.chanceMundialClubes",    label: "Mundial de Clubes",      tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.chanceBolaDeOuro",       label: "Bola de Ouro",           tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.chanceGoldenBoy",        label: "Golden Boy",             tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.chanceChuteiraDeOuro",   label: "Chuteira de Ouro",       tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.chanceLuvaDeOuro",       label: "Luva de Ouro",           tipo: "range", min: 0, max: 1, passo: 0.01 },
            { caminho: "titulos.anoInicioMundialClubes", label: "Ano do 1º Mundial de Clubes", tipo: "number", min: 2020, max: 2100, passo: 1 },
            { caminho: "titulos.cicloCopaDoMundo",       label: "Ciclo da Copa (anos)",   tipo: "number", min: 1, max: 8, passo: 1 }
        ]
    },
    {
        id: "lesoes",
        titulo: "Lesões",
        icone: "🩹",
        descricao: "Chances são por jogo disputado. Use o multiplicador geral para escalar tudo de uma vez; os fatores por idade ajustam a frequência conforme o jogador envelhece.",
        campos: [
            { caminho: "lesoes.multiplicador",  label: "Multiplicador geral",                     tipo: "range", min: 0, max: 5,      passo: 0.1 },
            { caminho: "lesoes.chanceLeve",     label: "Lesão leve (1–6 jogos)",                   tipo: "range", min: 0, max: 0.05,   passo: 0.001,   formato: "percentual" },
            { caminho: "lesoes.chanceModerada", label: "Lesão moderada (8–20 jogos)",              tipo: "range", min: 0, max: 0.02,   passo: 0.0001,  formato: "percentual" },
            { caminho: "lesoes.chanceGrave",    label: "Lesão grave (perde a temporada)",          tipo: "range", min: 0, max: 0.01,   passo: 0.0001,  formato: "percentual" },
            { caminho: "lesoes.chanceCarreira", label: "Lesão gravíssima (encerra a carreira)",    tipo: "range", min: 0, max: 0.001,  passo: 0.00001, formato: "percentual" },
            { caminho: "lesoes.fatorJovem",     label: "Fator por idade — jovem (≤24 anos)",       tipo: "range", min: 0, max: 3,      passo: 0.1 },
            { caminho: "lesoes.fatorVeterano",  label: "Fator por idade — veterano (29–32 anos)",  tipo: "range", min: 0, max: 3,      passo: 0.1 },
            { caminho: "lesoes.fatorIdoso",     label: "Fator por idade — veterano (33+ anos)",    tipo: "range", min: 0, max: 3,      passo: 0.1 }
        ]
    },
    {
        id: "selecao",
        titulo: "Força das seleções",
        icone: "🌎",
        descricao: "A força (1 a 100) define a chance proporcional de cada seleção ganhar os torneios em que participa. As competições internacionais continuam seguindo seus ciclos configurados.",
        campos: SELECOES.map((selecao) => ({
            caminho: `selecao.potencias.${selecao.id}`,
            label: selecao.nome,
            tipo: "range",
            min: 1,
            max: 100,
            passo: 1
        }))
    }
];

const LIGAS_CLUBES = [...new Set(CLUBES.map((clube) => clube.liga))];

const PRESETS_UI = [
    { id: "padrao",   nome: "Padrão",   icone: "⚙️" },
    { id: "realista", nome: "Realista", icone: "🎯" },
    { id: "arcade",   nome: "Arcade",   icone: "🎮" },
    { id: "lendario", nome: "Lendário", icone: "👑" },
    { id: "hardcore", nome: "Hardcore", icone: "💀" }
];

/* --- Helpers --- */
function formatarValorCampo(valor, passo, formato = "") {
    const num = Number(valor);
    const passoNum = Number(passo) || 1;

    if (!Number.isFinite(num)) return "0";

    if (formato === "percentual") {
        if (num === 0) return "0%";
        const pct = num * 100;
        const passoPct = passoNum * 100;
        let decimais = 0;
        if (passoPct < 0.01) decimais = 4;
        else if (passoPct < 0.1) decimais = 3;
        else if (passoPct < 1) decimais = 2;
        else if (passoPct < 10) decimais = 1;
        let texto = pct.toFixed(decimais);
        if (decimais > 0) {
            texto = texto.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
        }
        return texto + "%";
    }

    if (passoNum < 1) {
        const decimais = (String(passoNum).split(".")[1] || "").length;
        return num.toFixed(decimais);
    }
    return String(Math.round(num));
}

function obterPorCaminho(obj, caminho) {
    return caminho.split(".").reduce((atual, parte) => atual?.[parte], obj);
}

function definirPorCaminho(obj, caminho, valor) {
    const partes = caminho.split(".");
    const ultima = partes.pop();
    const alvo = partes.reduce((atual, parte) => atual[parte], obj);
    alvo[ultima] = valor;
}

function mostrarNotificacao(mensagem, tipo = "info") {
    const el = document.getElementById("notificacao-config");
    if (!el) return;
    el.textContent = mensagem;
    el.dataset.tipo = tipo;
    el.hidden = false;
    clearTimeout(mostrarNotificacao._t);
    mostrarNotificacao._t = setTimeout(() => { el.hidden = true; }, 2600);
}

/* --- Render --- */
function renderPresets() {
    const container = document.getElementById("presets-config");
    if (!container) return;
    container.innerHTML = `<p class="config-intro">Comece por um preset:</p>
        <div class="presets-lista">
            ${PRESETS_UI.map(p => `<button type="button" class="preset-btn" data-preset="${p.id}">
                <span>${p.icone}</span>${p.nome}
            </button>`).join("")}
        </div>`;

    container.addEventListener("click", (evento) => {
        const btn = evento.target.closest(".preset-btn");
        if (!btn) return;
        const presetId = btn.dataset.preset;
        if (aplicarPreset(presetId)) {
            renderCampos();
            atualizarJSON();
            mostrarNotificacao(`Preset "${btn.textContent.trim()}" aplicado.`, "ok");
        }
    });
}

function renderCampo(campo, valor) {
    const idSeguro = campo.caminho.replace(/\./g, "-");
    if (campo.tipo === "range") {
        const valorFormatado = formatarValorCampo(valor, campo.passo, campo.formato);
        return `
            <div class="config-campo config-campo--range">
                <div class="config-campo-topo">
                    <label for="${idSeguro}">${campo.label}</label>
                    <output id="out-${idSeguro}">${valorFormatado}</output>
                </div>
                <input type="range" id="${idSeguro}" data-caminho="${campo.caminho}"
                       data-formato="${campo.formato || ""}"
                       min="${campo.min}" max="${campo.max}" step="${campo.passo}" value="${valor}">
            </div>`;
    }
    return `
        <div class="config-campo">
            <label for="${idSeguro}">${campo.label}</label>
            <input type="number" id="${idSeguro}" data-caminho="${campo.caminho}"
                   min="${campo.min ?? ""}" max="${campo.max ?? ""}" step="${campo.passo ?? 1}" value="${valor}">
        </div>`;
}

function renderGrupoClubes(config) {
    const opcoes = LIGAS_CLUBES.map((liga) => `<option value="${liga}">${liga}</option>`).join("");
    return `
        <details class="config-grupo config-grupo-clubes" data-grupo="clubes">
            <summary class="config-grupo-resumo">
                <span class="config-grupo-icone">🏟️</span>
                <span class="config-grupo-titulo">Força dos clubes</span>
                <span class="config-grupo-seta" aria-hidden="true">⌄</span>
            </summary>
            <p class="config-grupo-desc">A força (1 a 100) influencia apenas as chances de títulos coletivos do clube. Os níveis padrão usam faixas equivalentes entre as ligas.</p>
            <div class="filtro-liga-clubes">
                <label for="filtro-liga-clubes">Filtrar por liga</label>
                <select id="filtro-liga-clubes">${opcoes}</select>
            </div>
            <div id="campos-forca-clubes" class="config-campos"></div>
        </details>`;
}

function renderCamposClubes(config = carregarConfig()) {
    const filtro = document.getElementById("filtro-liga-clubes");
    const container = document.getElementById("campos-forca-clubes");
    if (!filtro || !container) return;
    const liga = filtro.value || LIGAS_CLUBES[0];
    container.innerHTML = CLUBES.filter((clube) => clube.liga === liga).map((clube) => {
        const campo = {
            caminho: `clubes.potencias.${clube.id}`,
            label: clube.nome,
            tipo: "range",
            min: 1,
            max: 100,
            passo: 1
        };
        return renderCampo(campo, obterPorCaminho(config, campo.caminho) ?? 70);
    }).join("");
}

// ✅ ESTA É A FUNÇÃO QUE ESTAVA FALTANDO
function renderCampos() {
    const config = carregarConfig();
    const container = document.getElementById("grupos-config");
    if (!container) return;

    container.innerHTML = SCHEMA_CONFIG.map((grupo) => `
        <details class="config-grupo" data-grupo="${grupo.id}">
            <summary class="config-grupo-resumo">
                <span class="config-grupo-icone">${grupo.icone}</span>
                <span class="config-grupo-titulo">${grupo.titulo}</span>
                <span class="config-grupo-seta" aria-hidden="true">⌄</span>
            </summary>
            ${grupo.descricao ? `<p class="config-grupo-desc">${grupo.descricao}</p>` : ""}
            <div class="config-campos">
                ${grupo.campos.map(campo => renderCampo(campo, obterPorCaminho(config, campo.caminho))).join("")}
            </div>
        </details>
    `).join("") + renderGrupoClubes(config);

    renderCamposClubes(config);

    container.oninput = aoAlterarCampo;
    container.onchange = (evento) => {
        if (evento.target?.id === "filtro-liga-clubes") {
            renderCamposClubes(carregarConfig());
            return;
        }
        aoAlterarCampo(evento);
    };
}

function aoAlterarCampo(evento) {
    const input = evento.target.closest("input[data-caminho]");
    if (!input) return;

    const caminho = input.dataset.caminho;
    let valor = input.type === "range" ? parseFloat(input.value) : Number(input.value);
    if (!Number.isFinite(valor)) return;
    if (caminho === "geral.limiteRompimentosContrato") {
        valor = Math.max(0, Math.min(10, Math.floor(valor)));
        input.value = String(valor);
    }

    const config = carregarConfig();
    definirPorCaminho(config, caminho, valor);
    salvarConfig(config);
    aplicarConfiguracoes();

    if (input.type === "range") {
        const out = document.getElementById(`out-${input.id}`);
        if (out) {
            const formato = input.dataset.formato || "";
            out.textContent = formatarValorCampo(valor, input.step, formato);
        }
    }
    atualizarJSON();
}

/* --- JSON avançado --- */
function atualizarJSON() {
    const el = document.getElementById("config-json");
    if (el && !el.matches(":focus")) el.value = exportarConfigJSON();
}

function ligarAcoesAvancadas() {
    document.getElementById("aplicar-json").addEventListener("click", () => {
        const texto = document.getElementById("config-json").value;
        const resultado = importarConfigJSON(texto);
        if (resultado.ok) {
            renderCampos();
            atualizarJSON();
            mostrarNotificacao("Configuração importada.", "ok");
        } else {
            mostrarNotificacao("JSON inválido: " + resultado.erro, "erro");
        }
    });

    document.getElementById("copiar-json").addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(exportarConfigJSON());
            mostrarNotificacao("JSON copiado.", "ok");
        } catch {
            mostrarNotificacao("Não foi possível copiar.", "erro");
        }
    });
}

function ligarReset() {
    document.getElementById("resetar-config").addEventListener("click", () => {
        if (!confirm("Restaurar as configurações padrão de fábrica?")) return;
        resetarConfig();
        renderCampos();
        atualizarJSON();
        mostrarNotificacao("Configurações restauradas.", "ok");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderPresets();
    renderCampos();
    atualizarJSON();
    ligarAcoesAvancadas();
    ligarReset();
});