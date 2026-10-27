(function () {
    let modal;
    let search;
    let optionsList;
    let title;
    let activeSelect;
    let activeButton;
    let focusBeforeOpen;

    function ensureModal() {
        if (modal) return;

        modal = document.createElement("div");
        modal.className = "modal-overlay modal-opcoes-overlay";
        modal.hidden = true;
        modal.innerHTML = `
            <div class="modal-caixa modal-opcoes-caixa" role="dialog" aria-modal="true" aria-labelledby="modal-opcoes-titulo" tabindex="-1">
                <span class="modal-icone" aria-hidden="true">☰</span>
                <h3 id="modal-opcoes-titulo"></h3>
                <input class="modal-opcoes-busca" type="search" placeholder="Buscar opção..." aria-label="Buscar opção">
                <div class="modal-opcoes-lista" role="listbox"></div>
                <button type="button" class="modal-btn modal-btn--cancelar" data-fechar-opcoes>Fechar</button>
            </div>`;
        document.body.append(modal);
        title = modal.querySelector("#modal-opcoes-titulo");
        search = modal.querySelector(".modal-opcoes-busca");
        optionsList = modal.querySelector(".modal-opcoes-lista");

        modal.addEventListener("click", (evento) => {
            if (evento.target === modal || evento.target.closest("[data-fechar-opcoes]")) {
                closeModal();
                return;
            }

            const option = evento.target.closest("[data-select-option]");
            if (!option || !activeSelect) return;

            activeSelect.value = option.dataset.selectOption;
            activeSelect.dispatchEvent(new Event("change", { bubbles: true }));
            updateButton(activeSelect);
            closeModal();
        });

        search.addEventListener("input", renderOptions);
        optionsList.addEventListener("keydown", (evento) => {
            const options = [...optionsList.querySelectorAll('[role="option"]')];
            if (!options.length) return;
            const atual = options.indexOf(document.activeElement);
            if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
                evento.preventDefault();
                const delta = evento.key === "ArrowDown" ? 1 : -1;
                options[(atual + delta + options.length) % options.length].focus();
            } else if (evento.key === "Enter" || evento.key === " ") {
                const option = options[atual >= 0 ? atual : 0];
                if (option) {
                    evento.preventDefault();
                    option.click();
                }
            }
        });
        document.addEventListener("keydown", (evento) => {
            if (!modal.hidden && evento.key === "Escape") closeModal();
        });
    }

    function selectedOption(select) {
        return select.options[select.selectedIndex];
    }

    function buttonLabel(select) {
        const option = selectedOption(select);
        return option?.textContent.trim() || "Escolher opção";
    }

    function updateButton(select) {
        const button = select.nextElementSibling;
        if (button?.matches("[data-select-modal-trigger]")) {
            button.querySelector(".select-modal-trigger-text").textContent = buttonLabel(select);
        }
    }

    function renderOptions() {
        if (!activeSelect) return;
        const query = search.value.trim().toLocaleLowerCase("pt-BR");
        const options = [...activeSelect.options].filter((option) =>
            option.textContent.toLocaleLowerCase("pt-BR").includes(query)
        );

        optionsList.innerHTML = options.length
            ? options.map((option) => `
                <div class="opcao-clube opcao-select-modal${option.value === activeSelect.value ? " opcao-select-modal--selecionada" : ""}"
                        role="option" tabindex="-1" aria-selected="${option.value === activeSelect.value}"
                        data-select-option="${escaparAtributo(option.value)}">
                    <span class="opcao-select-modal-marcador" aria-hidden="true">${option.value === activeSelect.value ? "✓" : ""}</span>
                    <span><strong>${escaparHTML(option.textContent.trim())}</strong></span>
                </div>
            `).join("")
            : '<p class="select-modal-vazio">Nenhuma opção encontrada.</p>';
    }

    function escaparHTML(valor) {
        const elemento = document.createElement("span");
        elemento.textContent = valor;
        return elemento.innerHTML;
    }

    function escaparAtributo(valor) {
        return escaparHTML(valor).replace(/"/g, "&quot;");
    }

    function openModal(select, button) {
        ensureModal();
        activeSelect = select;
        activeButton = button;
        focusBeforeOpen = document.activeElement;

        const label = document.querySelector(`label[for="${select.id}"]`);
        title.textContent = label?.textContent.trim() || "Escolha uma opção";
        search.hidden = select.options.length < 10;
        search.value = "";
        renderOptions();
        modal.hidden = false;
        modal.querySelector(".modal-opcoes-caixa").focus();
        if (!search.hidden) search.focus();
    }

    function closeModal() {
        if (!modal || modal.hidden) return;
        modal.hidden = true;
        activeSelect = null;
        if (focusBeforeOpen instanceof HTMLElement && focusBeforeOpen.isConnected) {
            focusBeforeOpen.focus();
        } else if (activeButton?.isConnected) {
            activeButton.focus();
        }
    }

    function setup() {
        ensureModal();
        document.querySelectorAll("select").forEach((select) => {
            if (select.classList.contains("select-modal-source")) {
                updateButton(select);
                return;
            }

            const button = document.createElement("button");
            button.type = "button";
            button.className = "select-modal-trigger";
            button.dataset.selectModalTrigger = "";
            button.setAttribute("aria-haspopup", "dialog");
            button.innerHTML = '<span class="select-modal-trigger-text"></span><span aria-hidden="true">▾</span>';
            select.classList.add("select-modal-source");
            select.insertAdjacentElement("afterend", button);
            // Só ocultar o select nativo depois que o gatilho do modal existir.
            select.classList.add("select-modal-ready");
            updateButton(select);
            select.addEventListener("change", () => updateButton(select));
            button.addEventListener("click", () => openModal(select, button));
        });
    }

    window.configurarSeletoresEmModal = setup;
    document.addEventListener("DOMContentLoaded", setup);
})();


/* ============================================================
   Balão flutuante com o nome completo do troféu.
   ============================================================ */
(() => {
    let popup = null;
    let itemAtivo = null;

    function fechar() {
        if (popup) { popup.remove(); popup = null; }
        if (itemAtivo) {
            itemAtivo.classList.remove("trofeu-item--expandido");
            itemAtivo.setAttribute("aria-expanded", "false");
            itemAtivo = null;
        }
    }

    function posicionar(item) {
        if (!popup || !item) return;
        const rect = item.getBoundingClientRect();
        const pr = popup.getBoundingClientRect();
        let left = rect.left + rect.width / 2 - pr.width / 2;
        let top = rect.top - pr.height - 14;
        left = Math.max(8, Math.min(left, window.innerWidth - pr.width - 8));
        // Se não couber em cima, joga pra baixo do troféu
        if (top < 8) top = rect.bottom + 14;
        popup.style.left = left + "px";
        popup.style.top = top + "px";
    }

    function abrir(item) {
        fechar();
        const plaque = item.querySelector(".trofeu-placa");
        if (!plaque) return;
        popup = document.createElement("div");
        popup.className = "trofeu-popup";
        popup.setAttribute("role", "tooltip");
        popup.textContent = plaque.textContent.trim();
        document.body.appendChild(popup);

        item.classList.add("trofeu-item--expandido");
        item.setAttribute("aria-expanded", "true");
        itemAtivo = item;
        posicionar(item);
    }

    document.addEventListener("click", (evento) => {
        const item = evento.target.closest(".trofeu-item");
        if (!item) { fechar(); return; }
        if (item === itemAtivo) { fechar(); return; }
        abrir(item);
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") { fechar(); return; }
        if (evento.key !== "Enter" && evento.key !== " ") return;
        const item = evento.target.closest(".trofeu-item");
        if (!item) return;
        evento.preventDefault();
        if (item === itemAtivo) fechar(); else abrir(item);
    });

    let rafScroll = false;
    const reposicionar = () => {
        if (rafScroll) return;
        rafScroll = true;
        requestAnimationFrame(() => {
            rafScroll = false;
            if (!popup || !itemAtivo) return;
            // Se o troféu saiu da tela, fecha
            const r = itemAtivo.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) { fechar(); return; }
            posicionar(itemAtivo);
        });
    };
    window.addEventListener("scroll", reposicionar, true);
    window.addEventListener("resize", reposicionar);
})();