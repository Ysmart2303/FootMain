/* ============================================================
   FootMain — Dev Tools
   Ativação:
     - URL: ?dev=1   (persiste)
     - URL: ?dev=0   (desativa)
     - Ctrl+Shift+D  (alterna o painel, só quando ativo)
   ============================================================ */
(() => {
    "use strict";

    const STORAGE_KEY = "footmain_dev_mode";
    const STORAGE_KEYS_GAME = [
        "footmain_temporadas",
        "footmain_ranking",
        "footmain_carreira_atual",
        "footmain_jogo_a_jogo_carreira_v2",
    ];

    // ---- Ativação via URL ----
    const params = new URLSearchParams(location.search);
    if (params.has("dev")) {
        const v = params.get("dev");
        if (v === "0") localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, "1");
        params.delete("dev");
        const novaURL = location.pathname
            + (params.toString() ? "?" + params.toString() : "")
            + location.hash;
        history.replaceState(null, "", novaURL);
    }

    if (localStorage.getItem(STORAGE_KEY) !== "1") return;

    // Sinaliza para jogo-a-jogo.js que deve expor window.FMD
    window.__FOOTMAIN_DEV__ = true;

    // ---- Elementos ----
    let painel, toggle, statusEl;

    function status(msg, erro = false) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.classList.toggle("dev-erro", erro);
    }

    function habilitarBotoes(habilitado) {
        if (!painel) return;
        painel.querySelectorAll("button[data-dev-action]").forEach(b => {
            b.disabled = !habilitado;
        });
    }

    async function executar(acao) {
        habilitarBotoes(false);
        try {
            switch (acao) {
                case "criar-carreira": {
                    if (!window.FMD) { status("FMD não disponível. Recarregue a página.", true); break; }
                    const r = window.FMD.criarCarreiraTesteRapida({
                        nome: "Dev Tester", idade: 18, posicao: "CA",
                        nacionalidade: "brasil", clubeId: "flamengo",
                        idadeLimite: 40, anosContrato: 3
                    });
                    status(`✅ Carreira criada: ${r.clube} (${r.liga}), ${r.partidas} partidas.`);
                    break;
                }
                case "forcar-penaltis": {
                    if (!window.FMD) { status("FMD não disponível.", true); break; }
                    window.FMD.forcarEmpateProximoMataMata();
                    status("✅ Próximo mata-mata vai empatar em 1×1 e cair nos pênaltis.");
                    break;
                }
                case "ir-mata-mata": {
                    if (!window.FMD) { status("FMD não disponível.", true); break; }
                    const r = await window.FMD.irParaProximoMataMata();
                    status((r.ok ? "✅ " : "⚠️ ") + r.msg, !r.ok);
                    break;
                }
                case "testar-animacao": {
                    if (!window.FMD) { status("FMD não disponível.", true); break; }
                    status("▶️ Rodando animação de pênaltis (dados mock).");
                    await window.FMD.animarPenaltisMock();
                    status("✅ Animação concluída.");
                    break;
                }
                case "simular-restante": {
                    if (!window.FMD) { status("FMD não disponível.", true); break; }
                    const st = window.FMD.getEstado();
                    if (!st) { status("Nenhuma carreira ativa.", true); break; }
                    status("⏳ Simulando o restante da temporada...");
                    await window.FMD.simularRestantesAuto();
                    status("✅ Temporada concluída.");
                    break;
                }
                case "simular-carreira": {
                    if (!window.FMD) { status("FMD não disponível.", true); break; }
                    status("⏳ Simulando carreira completa (pode levar alguns segundos)...");
                    await window.FMD.simularFimCarreiraAuto();
                    status("✅ Carreira simulada até o fim.");
                    break;
                }
                case "simular-5": {
                    if (!window.FMD) { status("FMD não disponível.", true); break; }
                    status("⏳ Simulando 5 temporadas...");
                    for (let i = 0; i < 5; i++) {
                        const st = window.FMD.getEstado();
                        if (!st || st.salvaOficialmente) {
                            await window.FMD.iniciarAuto();
                        }
                        await window.FMD.simularRestantesAuto();
                    }
                    status("✅ 5 temporadas simuladas.");
                    break;
                }
                case "exportar": {
                    const dados = {};
                    STORAGE_KEYS_GAME.forEach(k => { dados[k] = localStorage.getItem(k); });
                    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `footmain-dev-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    status("✅ Estado exportado.");
                    break;
                }
                case "resetar": {
                    if (!confirm("Limpar TODO o estado do jogo (histórico, ranking, carreira, jogo-a-jogo)?")) {
                        status("Cancelado.");
                        break;
                    }
                    STORAGE_KEYS_GAME.forEach(k => localStorage.removeItem(k));
                    status("✅ Estado limpo. Recarregando...");
                    setTimeout(() => location.reload(), 400);
                    break;
                }
            }
        } catch (erro) {
            console.error("[FootMain Dev]", erro);
            status("❌ " + (erro?.message || erro), true);
        } finally {
            habilitarBotoes(true);
        }
    }

    function montarPainel() {
        if (painel) return;

        toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "dev-toggle";
        toggle.setAttribute("aria-label", "Abrir ferramentas de desenvolvedor");
        toggle.title = "Dev Tools (Ctrl+Shift+D)";
        toggle.innerHTML = "🛠️";

        painel = document.createElement("div");
        painel.className = "dev-panel";
        painel.hidden = true;
        painel.setAttribute("role", "dialog");
        painel.setAttribute("aria-label", "Ferramentas de desenvolvedor");
        painel.innerHTML = `
            <div class="dev-panel__header">
                <strong>🛠️ Dev Tools</strong>
                <button type="button" data-dev-close aria-label="Fechar">×</button>
            </div>

            <div class="dev-panel__section">Carreira</div>
            <div class="dev-panel__body">
                <button type="button" data-dev-action="criar-carreira">Criar carreira de teste</button>
                <button type="button" data-dev-action="simular-restante">Simular restante da temporada</button>
                <button type="button" data-dev-action="simular-5">Simular 5 temporadas</button>
                <button type="button" data-dev-action="simular-carreira">Simular carreira completa</button>
            </div>

            <div class="dev-panel__section">Pênaltis</div>
            <div class="dev-panel__body">
                <button type="button" data-dev-action="forcar-penaltis">Forçar empate no próximo mata-mata</button>
                <button type="button" data-dev-action="ir-mata-mata">Ir para o próximo mata-mata</button>
                <button type="button" data-dev-action="testar-animacao">Testar animação de pênaltis</button>
            </div>

            <div class="dev-panel__section">Sistema</div>
            <div class="dev-panel__body">
                <button type="button" data-dev-action="exportar">Exportar estado (JSON)</button>
                <button type="button" data-dev-action="resetar" class="dev-danger">Limpar todo o estado</button>
            </div>

            <div class="dev-panel__status" aria-live="polite"></div>
        `;

        document.body.append(toggle);
        document.body.append(painel);
        statusEl = painel.querySelector(".dev-panel__status");

        toggle.addEventListener("click", () => {
            painel.hidden = !painel.hidden;
            toggle.style.display = painel.hidden ? "" : "none";
        });
        painel.querySelector("[data-dev-close]").addEventListener("click", () => {
            painel.hidden = true;
            toggle.style.display = "";
        });
        painel.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-dev-action]");
            if (btn) executar(btn.dataset.devAction);
        });
    }

    function alternar() {
        if (!painel) montarPainel();
        painel.hidden = !painel.hidden;
        toggle.style.display = painel.hidden ? "" : "none";
    }

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
            e.preventDefault();
            alternar();
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", montarPainel);
    } else {
        montarPainel();
    }
})();