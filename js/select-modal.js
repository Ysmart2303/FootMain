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
                <button type="button" class="opcao-clube opcao-select-modal${option.value === activeSelect.value ? " opcao-select-modal--selecionada" : ""}"
                        role="option" aria-selected="${option.value === activeSelect.value}"
                        data-select-option="${escaparAtributo(option.value)}">
                    <span class="opcao-select-modal-marcador" aria-hidden="true">${option.value === activeSelect.value ? "✓" : ""}</span>
                    <span><strong>${escaparHTML(option.textContent.trim())}</strong></span>
                </button>
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
            updateButton(select);
            select.addEventListener("change", () => updateButton(select));
            button.addEventListener("click", () => openModal(select, button));
        });
    }

    window.configurarSeletoresEmModal = setup;
    document.addEventListener("DOMContentLoaded", setup);
})();
