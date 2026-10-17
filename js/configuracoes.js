/* Renderiza a página de configurações com base num schema. */

const SCHEMA_CONFIG = [
    {
        id: "geral",
        titulo: "Carreira",
        icone: "👤",
        campos: [
            { caminho: "geral.anoInicial",          label: "Ano inicial",             tipo: "number", min: 1950, max: 2200, passo: 1 },
            { caminho: "geral.idadeInicialPadrao",  label: "Idade inicial padrão",    tipo: "number", min: 10,   max: 40,   passo: 1 },
            { caminho: "geral.idadeLimitePadrao",   label: "Idade limite padrão",     tipo: "number", min: 20,   max: 80,   passo: 1 }
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
        id: "selecao",
        titulo: "Força das seleções",
        icone: "🌎",
        descricao: "A força (1 a 100) define a chance proporcional de cada seleção ganhar os torneios em que participa. As cinco competições continentais e as Olimpíadas ocorrem a cada quatro anos, a partir de 2028.",
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

const PRESETS_UI = [
    { id: "padrao",   nome: "Padrão",   icone: "⚙️" },
    { id: "realista", nome: "Realista", icone: "🎯" },
    { id: "arcade",   nome: "Arcade",   icone: "🎮" },
    { id: "lendario", nome: "Lendário", icone: "👑" },
    { id: "hardcore", nome: "Hardcore", icone: "💀" }
];

/* --- Helpers --- */
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
            renderCampos(); // atualiza todos os inputs com os novos valores
            atualizarJSON();
            mostrarNotificacao(`Preset "${btn.textContent.trim()}" aplicado.`, "ok");
        }
    });
}

function renderCampos() {
    const config = carregarConfig();
    const container = document.getElementById("grupos-config");

    // Preserva o que estava aberto (importante no "aplicar preset").
    const abertos = new Set(
        Array.from(container.querySelectorAll("details[open]")).map((d) => d.dataset.grupo)
    );
    const primeiraRenderizacao = container.childElementCount === 0;

    container.innerHTML = SCHEMA_CONFIG.map((grupo, index) => {
        const deveAbrir = primeiraRenderizacao ? index === 0 : abertos.has(grupo.id);
        return `<details class="config-grupo" data-grupo="${grupo.id}"${deveAbrir ? " open" : ""}>
            <summary>
                <span class="config-grupo-icone">${grupo.icone}</span>
                <h3>${grupo.titulo}</h3>
            </summary>
            <div class="config-grupo-conteudo">
                ${grupo.descricao ? `<p class="config-grupo-desc">${grupo.descricao}</p>` : ""}
                <div class="config-campos">
                    ${grupo.campos.map((campo) => renderCampo(campo, obterPorCaminho(config, campo.caminho))).join("")}
                </div>
            </div>
        </details>`;
    }).join("");

    if (!container.dataset.ligado) {
        container.addEventListener("input", aoAlterarCampo);
        container.addEventListener("change", aoAlterarCampo);
        container.dataset.ligado = "1";
    }
}

function renderCampo(campo, valor) {
    const idSeguro = campo.caminho.replace(/\./g, "-");
    if (campo.tipo === "range") {
        const valorFormatado = campo.passo < 1 ? Number(valor).toFixed(2) : String(Math.round(Number(valor)));
        return `
            <div class="config-campo config-campo--range">
                <div class="config-campo-topo">
                    <label for="${idSeguro}">${campo.label}</label>
                    <output id="out-${idSeguro}">${valorFormatado}</output>
                </div>
                <input type="range" id="${idSeguro}" data-caminho="${campo.caminho}"
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

function aoAlterarCampo(evento) {
    const input = evento.target.closest("input[data-caminho]");
    if (!input) return;

    const caminho = input.dataset.caminho;
    let valor = input.type === "range" ? parseFloat(input.value) : Number(input.value);
    if (!Number.isFinite(valor)) return;

    const config = carregarConfig();
    definirPorCaminho(config, caminho, valor);
    salvarConfig(config);
    aplicarConfiguracoes();

    if (input.type === "range") {
        const out = document.getElementById(`out-${input.id}`);
        if (out) out.textContent = input.step && Number(input.step) < 1 ? valor.toFixed(2) : String(Math.round(valor));
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