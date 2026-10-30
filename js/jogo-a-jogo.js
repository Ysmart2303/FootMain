/* FootMain — carreira principal jogo a jogo. */
(() => {
    "use strict";
    const KEY = "footmain_jogo_a_jogo_carreira_v2";
    const ANO_BASE_COPA_DO_MUNDO_SELECOES = 2026;
    const CICLO_COPA_DO_MUNDO_SELECOES = 4;
    const $ = (id) => document.getElementById(id);
    let estado = null;
    let simulandoCarreira = false;
    let bloqueioAcoesPartida = false;
    let decisaoEmAndamento = false;
    let fluxoDecisao = null;
    let loadingEl = null;

    function mostrarCarregamento(texto = "Simulando...") {
        if (!loadingEl) {
            loadingEl = document.createElement("div");
            loadingEl.className = "footmain-loading-overlay";
            loadingEl.hidden = true;
            loadingEl.setAttribute("role", "status");
            loadingEl.setAttribute("aria-live", "polite");
            loadingEl.setAttribute("aria-busy", "true");
            loadingEl.innerHTML = `
                <div class="footmain-loading-spinner" aria-hidden="true"></div>
                <p class="footmain-loading-texto"></p>`;
            document.body.append(loadingEl);
        }
        loadingEl.querySelector(".footmain-loading-texto").textContent = texto;
        loadingEl.hidden = false;
        // Libera o frame para o navegador pintar o overlay antes da simulação bloquear a thread.
        return new Promise((resolve) => setTimeout(resolve, 30));
    }
    
    function ocultarCarregamento() {
        if (loadingEl) loadingEl.hidden = true;
    }

    function bloquearAcoesPartida() {
        bloqueioAcoesPartida = true;
        window.setTimeout(() => {
            bloqueioAcoesPartida = false;
            renderizar();
        }, 400);
    }

    function escapar(texto) {
        return String(texto ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    }
    function sortearPoisson(lambda) {
        const limite = Math.exp(-Math.max(0, lambda)); let p = 1, k = 0;
        do { k++; p *= Math.random(); } while (p > limite && k < 12);
        return k - 1;
    }
    function clubesDisponiveis() {
        return (typeof CLUBES !== "undefined" ? CLUBES : []).filter(c => c && c.id && c.nome && c.liga);
    }
    function forcaClube(clube) {
        const cfg = typeof getConfig === "function" ? getConfig() : {};
        return Math.max(35, Math.min(99, Number(cfg.clubes?.potencias?.[clube.id]) || 65));
    }
    function disponibilidadeInicial(jogosLesao = 0) {
        return {
            jogosLesao: Math.max(0, Math.floor(Number(jogosLesao) || 0)),
            suspensoes: { clube: 0, selecao: 0 },
            amarelos: { clube: 0, selecao: 0 },
            lesaoCarreira: false
        };
    }
    function desempenhoPosicionalInicial() {
        return { jogos: 0, vitorias: 0, jogosSemSofrer: 0, gols: 0, assistencias: 0, acoes: {} };
    }
    function registrarAcaoPosicional(opcao, sucesso) {
        const desempenho = estado.desempenhoPosicional ||= desempenhoPosicionalInicial();
        const acao = desempenho.acoes[opcao.tipo] ||= { tentativas: 0, sucessos: 0 };
        acao.tentativas++;
        if (sucesso) acao.sucessos++;
    }
    function calcularDesempenhoPosicional(posicao, desempenho, estatisticas = {}) {
        const jogos = Math.max(1, Number(desempenho.jogos) || 0);
        const porJogo = tipo => (Number(desempenho.acoes?.[tipo]?.sucessos) || 0) / jogos;
        const gols = (Number(desempenho.gols) || 0) / jogos;
        const assistencias = (Number(desempenho.assistencias) || 0) / jogos;
        const desarmes = (Number(estatisticas.desarmes) || 0) / jogos;
        const defesas = (Number(estatisticas.defesas) || 0) / jogos;
        const vitorias = (Number(desempenho.vitorias) || 0) / jogos;
        const jogosSemSofrer = (Number(desempenho.jogosSemSofrer) || 0) / jogos;
        const categoria = ["PE", "CA", "PD"].includes(posicao) ? "ata"
            : ["ME", "MC", "MD"].includes(posicao) ? "me"
                : posicao === "GOL" ? "go" : "zag";
        const pontuacao = categoria === "go"
            ? defesas * .45 + jogosSemSofrer * .55 + porJogo("reposicao") * .25 + assistencias * .35 + vitorias * .18
            : categoria === "zag"
                ? desarmes * .35 + jogosSemSofrer * .45 + porJogo("passe") * .3 + (gols + assistencias) * .3 + vitorias * .18
                : categoria === "me"
                    ? porJogo("passe") * .75 + porJogo("drible") * .45 + desarmes * .3 + assistencias * .55 + gols * .25 + vitorias * .18
                    : gols * .7 + assistencias * .55 + desarmes * .2 + porJogo("drible") * .65 + porJogo("passe") * .25 + vitorias * .18;
        return { categoria, pontuacao };
    }
    function aplicarDesempenhoPosicional(temporada) {
        const desempenho = estado.desempenhoPosicional || desempenhoPosicionalInicial();
        const { categoria, pontuacao } = calcularDesempenhoPosicional(estado.posicao, desempenho, estado.estatisticas);
        const aumento = pontuacao >= 1.2 ? 2 : pontuacao >= .45 ? 1 : 0;
        const atributosPrincipais = {
            go: ["reflexos", "fisico", "defesa", "passe"],
            zag: ["defesa", "fisico", "velocidade", "passe"],
            me: ["passe", "drible", "finalizacao", "velocidade", "defesa", "fisico"],
            ata: ["finalizacao", "drible", "velocidade", "passe", "fisico"]
        }[categoria];
        const atributos = { ...(estado.atributos || temporada.atributos || {}) };
        const carreira = typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
        atributosPrincipais.forEach(chave => {
            let teto = 99;
            if (typeof obterModificadorPotencial === "function" && Number(carreira.potencial) > 0) {
                teto = Math.min(99, Math.round(carreira.potencial * obterModificadorPotencial(chave, categoria)));
            }
            atributos[chave] = Math.min(teto, (Number(atributos[chave]) || 1) + aumento);
        });
        const overallBase = typeof calcularOverall === "function" && estado.atributos
            ? calcularOverall(categoria, estado.atributos)
            : Number(estado.overall) || Number(temporada.overall) || 0;
        const overall = typeof calcularOverall === "function"
            ? calcularOverall(categoria, atributos)
            : overallBase;
        estado.atributos = atributos;
        estado.overall = overall;
        estado.desempenhoPosicional = desempenho;
        temporada.atributos = atributos;
        temporada.overall = overall;
        return { pontuacao, overallBase, overall };
    }
    function obterHistoricoCarreira(carreira) {
        const historico = typeof lerHistorico === "function" ? lerHistorico() : [];
        return historico.filter(t => String(t.carreiraId) === String(carreira.id));
    }
    function carreiraEncerrada(carreira, historico) {
        if (!historico.length) return false;
        const ultimaTemporada = historico[historico.length - 1];
        const idadeLimite = Number(carreira.idadeLimite) || Number(ultimaTemporada.idadeLimite) || 40;
        const constaNoRanking = typeof lerRanking === "function"
            && lerRanking().some(registro => String(registro.id) === String(carreira.id));
        return !!carreira.aposentadoriaVoluntaria
            || !!ultimaTemporada.lesaoCarreira
            || Number(ultimaTemporada.idade) >= idadeLimite
            || constaNoRanking;
    }
    function temporadaEmAndamento(carreira) {
        return !!estado && String(estado.carreiraId) === String(carreira.id)
            && !estado.salvaOficialmente
            && estado.partidas.some(partida => partida.status === "agendada");
    }
    function sortearEstatisticasJogador(partida, meuClube, golsCasa, golsFora, participacaoForcada = null) {
        const pos = String(estado.posicao || "CA").toUpperCase();
        const forcaTime = forcaClube(meuClube);
        // O titular depende do nível do jogador em relação ao clube, não só do overall isolado.
        const chanceJogar = Math.max(.72, Math.min(.99, .90 + (estado.overall - forcaTime) * .006));
        const participou = participacaoForcada === null ? Math.random() < chanceJogar : participacaoForcada;
        if (!participou) return { participou: false, gols: 0, assistencias: 0, amarelo: 0, vermelho: 0 };
        const golsEquipe = partida.casa ? golsCasa : golsFora;
        const rel = Math.max(.65, Math.min(1.55, .82 + (estado.overall - forcaTime) * .018));
        const atacante = ["PE", "CA", "PD"].includes(pos);
        const meia = ["ME", "MC", "MD"].includes(pos);
        // A taxa por partida mantém a produção compatível com o calendário de cada competição.
        const baseGol = pos === "CA" ? 1.08 : ["PE", "PD"].includes(pos) ? .78 : ["ME", "MC", "MD"].includes(pos) ? .32 : pos === "GOL" ? .001 : .09;
        const gols = sortearPoisson(baseGol * rel);
        const baseAssist = ["ME", "MC", "MD"].includes(pos) ? .58 : ["PE", "PD"].includes(pos) ? .48 : pos === "CA" ? .32 : pos === "GOL" ? .001 : .20;
        const assistencias = sortearPoisson(baseAssist * rel);
        const cfg = typeof getConfig === "function" ? getConfig() : {};
        const cartoes = cfg.cartoes || {};
        const categoria = ["PE", "CA", "PD"].includes(pos) ? "Atacante" : ["ME", "MC", "MD"].includes(pos) ? "Meia" : ["GOL"].includes(pos) ? "Goleiro" : "Zagueiro";
        const fatorPosicao = Math.max(0, Number(cartoes[`fator${categoria}`] ?? 1));
        const amareloBase = Math.max(0, Number(cartoes.chanceAmareloBase ?? .08));
        const vermelhoBase = Math.max(0, Number(cartoes.chanceVermelhoBase ?? .004));
        const segundoAmarelo = Math.max(0, Math.min(1, Number(cartoes.chanceDoisAmarelosMesmoJogo ?? .02)));
        const recebeuAmarelo = Math.random() < amareloBase * fatorPosicao;
        const segundo = recebeuAmarelo && Math.random() < segundoAmarelo;
        const amarelo = (recebeuAmarelo ? 1 : 0) + (segundo ? 1 : 0);
        const vermelhoDireto = !segundo && Math.random() < vermelhoBase;
        const vermelho = segundo || vermelhoDireto ? 1 : 0;
        const motmChance = Math.min(.78, .025 + gols * .22 + assistencias * .14 + (pos === "GOL" && golsEquipe === 0 ? .14 : 0));
        const motm = Math.random() < motmChance;
        return { participou: true, gols, assistencias, amarelo, vermelho, vermelhoDireto, motm };
    }
    function salvar() {
        try { localStorage.setItem(KEY, JSON.stringify(estado)); }
        catch (e) { console.error("Não foi possível salvar a carreira beta", e); }
    }
    function carregar() {
        try {
            const valor = JSON.parse(localStorage.getItem(KEY) || "null");
            if (valor && [1, 2, 3, 4].includes(valor.versao) && Array.isArray(valor.partidas) && Array.isArray(valor.tabela) && Array.isArray(valor.rodadas)) {
                estado = valor;
                estado.versao = 4;
                estado.desempenhoPosicional = {
                    ...desempenhoPosicionalInicial(),
                    ...(estado.desempenhoPosicional || {}),
                    acoes: { ...(estado.desempenhoPosicional?.acoes || {}) }
                };
                estado.estatisticas = { jogos: 0, gols: 0, assistencias: 0, jogosClube: 0, golsClube: 0, assistenciasClube: 0, jogosSelecao: 0, golsSelecao: 0, assistenciasSelecao: 0, jogosSelecaoPorCompeticao: {}, golsSelecaoPorCompeticao: {}, amarelos: 0, vermelhos: 0, motm: 0, vitorias: 0, empates: 0, derrotas: 0, driblesCompletos: 0, desarmes: 0, defesas: 0, jogadasCriadas: 0, ...estado.estatisticas };
                ["driblesCompletos", "desarmes", "defesas", "jogadasCriadas"].forEach(chave => {
                    estado.estatisticas[chave] = Math.max(0, Number(estado.estatisticas[chave]) || 0);
                });
                if (!Number.isFinite(Number(valor.estatisticas?.jogosClube))) estado.estatisticas.jogosClube = Number(estado.estatisticas.jogos) || 0;
                if (!Number.isFinite(Number(valor.estatisticas?.golsClube))) estado.estatisticas.golsClube = Number(estado.estatisticas.gols) || 0;
                if (!Number.isFinite(Number(valor.estatisticas?.assistenciasClube))) estado.estatisticas.assistenciasClube = Number(estado.estatisticas.assistencias) || 0;
                estado.trofeusColetivos = estado.trofeusColetivos || [];
                estado.trofeusIndividuais = estado.trofeusIndividuais || [];
                estado.trofeusClube = estado.trofeusClube || [];
                estado.trofeusSelecao = estado.trofeusSelecao || [];
                const disponibilidade = disponibilidadeInicial();
                estado.disponibilidade = {
                    ...disponibilidade,
                    ...(estado.disponibilidade || {}),
                    suspensoes: { ...disponibilidade.suspensoes, ...(estado.disponibilidade?.suspensoes || {}) },
                    amarelos: { ...disponibilidade.amarelos, ...(estado.disponibilidade?.amarelos || {}) }
                };
                estado.partidas.forEach((p, index) => {
                    if (!p.tipo) p.tipo = "liga";
                    if (!p.numero) p.numero = index + 1;
                    if (!Number.isFinite(p.rodadaLiga) && p.tipo === "liga") p.rodadaLiga = index;
                    if (!Number.isFinite(p.data)) p.data = Date.UTC(Number(estado.ano) || 2026, 1 + Math.floor(index / Math.max(1, estado.partidas.length) * 10), 4, 12);
                });
            }
        } catch (e) { console.warn("Save beta inválido; aguardando nova carreira.", e); }
    }
    function gerarRodadasLiga(times) {
        // Algoritmo de todos-contra-todos (circle method), com returno.
        const lista = [...times];
        if (lista.length % 2) lista.push(null);
        const fixos = lista[0], rotativos = lista.slice(1), ida = [];
        const totalRodadas = lista.length - 1;
        for (let r = 0; r < totalRodadas; r++) {
            const ordem = [fixos, ...rotativos];
            const confrontos = [];
            for (let i = 0; i < ordem.length / 2; i++) {
                let casa = ordem[i], fora = ordem[ordem.length - 1 - i];
                if (!casa || !fora) continue;
                if ((r + i) % 2) [casa, fora] = [fora, casa];
                confrontos.push({ casaId: casa.id, foraId: fora.id, status: "agendado" });
            }
            ida.push(confrontos);
            rotativos.unshift(rotativos.pop());
        }
        const volta = ida.map((jogos) => jogos.map(j => ({ casaId: j.foraId, foraId: j.casaId, status: "agendado" })));
        return [...ida, ...volta];
    }
    function gerarCalendario(times, clubeUsuario, rodadas, ano) {
        const jogos = [];
        rodadas.forEach((confrontos, r) => {
            const jogo = confrontos.find(j => j.casaId === clubeUsuario.id || j.foraId === clubeUsuario.id);
            if (!jogo) return;
            const diaDaTemporada = Math.round(r * 330 / Math.max(1, rodadas.length - 1));
            jogos.push({ rodadaLiga: r, data: Date.UTC(ano, 1, 1 + diaDaTemporada, 12), adversarioId: jogo.casaId === clubeUsuario.id ? jogo.foraId : jogo.casaId, casa: jogo.casaId === clubeUsuario.id, competicao: clubeUsuario.liga, tipo: "liga", status: "agendada" });
        });
        return jogos;
    }
    function obterSelecoesAdversarias(competicao, selecaoId) {
        const selecao = (typeof SELECOES !== "undefined" ? SELECOES : []).find(item => item.id === selecaoId);
        const todas = (typeof SELECOES !== "undefined" ? SELECOES : []).filter(item => item.id !== selecaoId);
        const regioesPorCompeticao = {
            "Copa América": ["americaSul", "americaNorte"],
            "Copa Ouro": ["americaSul", "americaNorte"],
            "Eurocopa": ["europa"],
            "Copa das Nações Africanas": ["africa"],
            "Copa da Ásia": ["asia"],
            "Copa das Nações da OFC": ["oceania"],
            "Eliminatórias": selecao ? [selecao.regiao] : []
        };
        const regioes = regioesPorCompeticao[competicao];
        if (regioes === undefined || ["Copa do Mundo", "Olimpíadas", "Amistoso"].includes(competicao)) return todas;
        const elegiveis = todas.filter(item => regioes.includes(item.regiao));
        return elegiveis.length ? elegiveis : todas;
    }
    function adicionarEliminatoria(partidas, times, clubeId, competicao, ano, mesInicial, quantidadeRodadas, prefixo, selecao = null, statusInicial = "agendada") {
        const adversarios = selecao && !times.length ? obterSelecoesAdversarias(competicao, clubeId) : times;
        const oponentes = adversarios.filter(t => t.id !== clubeId);
        const fases = [];
        for (let fase = 0; fase < quantidadeRodadas; fase++) {
            const adversario = oponentes[Math.floor(Math.random() * oponentes.length)];
            const fixture = {
                data: Date.UTC(ano, Math.min(11, mesInicial + fase * 2), 8, 12),
                adversarioId: adversario?.id || "",
                adversarioNome: adversario?.nome || "Adversário",
                casa: Math.random() < 0.5,
                competicao,
                tipo: selecao ? "selecao" : "mata-mata",
                torneioId: `${prefixo}:${competicao}`,
                fase: fase + 1,
                totalFases: quantidadeRodadas,
                selecao: selecao || null,
                status: statusInicial
            };
            fases.push(fixture);
        }
        partidas.push(...fases);
    }
    function obterConvocacao(estadoTemporada, carreira, historico) {
        const selecao = (typeof SELECOES !== "undefined" ? SELECOES : []).find(s => s.id === estadoTemporada.nacionalidade);
        if (!selecao || carreira.aposentadoriaSelecao === true) return null;

        const cfg = typeof getConfig === "function" ? getConfig() : {};
        const potencia = Number(cfg.selecao?.potencias?.[selecao.id]) || 50;
        const temporadas = Array.isArray(historico) ? historico : [];
        const convocacoesAnteriores = temporadas.filter(t => t.convocado || Number(t.jogosSelecao) > 0).length;
        const ultimaTemporada = temporadas[temporadas.length - 1];
        const convocadoNaTemporadaAnterior = !!(ultimaTemporada && (ultimaTemporada.convocado || Number(ultimaTemporada.jogosSelecao) > 0));

        // Overall alto aumenta bastante a chance; seleções mais fortes têm maior concorrência.
        const overall = Math.max(1, Math.min(99, Number(estadoTemporada.overall) || 50));
        const notaOverall = Math.max(0, Math.min(1, (overall - 55) / 35));
        let chance = .12 + notaOverall * .76;
        chance -= Math.max(-20, Math.min(40, potencia - 50)) / 300;

        const clube = typeof obterClube === "function" ? obterClube(carreira.clube) : null;
        const jogaEuropa = !!clube?.pais && ["Inglaterra", "Espanha", "Alemanha", "Itália", "França", "Portugal", "Holanda"].some(pais => String(clube.pais).includes(pais));
        chance += (jogaEuropa ? .04 : 0);
        chance += Math.min(.20, convocacoesAnteriores * .025);
        if (convocadoNaTemporadaAnterior) chance += .12;

        const idade = Number(estadoTemporada.idade) || 18;
        if (idade < 18) chance *= .35;
        else if (idade > 35) chance *= .70;
        if (idade > 38) chance *= .60;

        chance = Math.max(0, Math.min(.97, chance));
        return Math.random() < chance ? selecao : null;
    }
    function montarCalendarioTemporada(times, clube, rodadas, ano, carreira, historico, perfil) {
        const partidas = gerarCalendario(times, clube, rodadas, ano);
        const nomes = typeof obterNomesTrofeusClube === "function" ? obterNomesTrofeusClube(clube.id) : { liga: clube.liga, copa: "Copa Nacional" };
        const estadual = typeof ESTADUAIS_BRASIL !== "undefined" ? ESTADUAIS_BRASIL[clube.id] : null;
        adicionarEliminatoria(partidas, times, clube.id, nomes.copa || "Copa Nacional", ano, 2, 4, "clube");
        if (estadual) adicionarEliminatoria(partidas, times, clube.id, estadual, ano, 0, 3, "estadual");

        const qualificadas = carreira.clubeQualificado === clube.id && Array.isArray(carreira.competicoesQualificadas)
            ? carreira.competicoesQualificadas
            : [];
        qualificadas.forEach((competicao, indice) => adicionarEliminatoria(partidas, times, clube.id, competicao, ano, 1 + indice, 5, "continental"));
        const ultimaTemporada = historico[historico.length - 1];
        const trofeusAnteriores = ultimaTemporada?.clube === clube.id ? ultimaTemporada.trofeusColetivos || [] : [];
        const ganhouLigaECopa = trofeusAnteriores.includes(nomes.liga) && trofeusAnteriores.includes(nomes.copa);
        const ganhouContinental = trofeusAnteriores.includes(nomes.continental);
        if (ganhouLigaECopa) adicionarEliminatoria(partidas, times, clube.id, "Supercopa Nacional", ano, 1, 1, "supercopa");
        if (ganhouContinental) adicionarEliminatoria(partidas, times, clube.id, "Supercopa Continental", ano, 1, 1, "supercopa");
        const classificadoContinental = qualificadas.includes(nomes.continental);
        if (classificadoContinental) adicionarEliminatoria(partidas, times, clube.id, "Intercontinental", ano, 11, 1, "intercontinental", null, "bloqueada");
        const cfgTitulos = typeof getConfig === "function" ? getConfig().titulos : {};
        const ciclo = Math.max(1, Number(cfgTitulos?.cicloCopaDoMundo) || 4);
        const inicioMundial = Number(cfgTitulos?.anoInicioMundialClubes) || 2029;
        if (ano >= inicioMundial && (ano - inicioMundial) % ciclo === 0) {
            const inicioCiclo = (typeof ANO_INICIAL !== "undefined" ? ANO_INICIAL : 2026) + Math.floor((ano - (typeof ANO_INICIAL !== "undefined" ? ANO_INICIAL : 2026)) / ciclo) * ciclo;
            const ganhouNoCiclo = historico.some(t => t.clube === clube.id && Number(t.ano) >= inicioCiclo && Number(t.ano) < ano && (t.trofeusColetivos || []).includes(nomes.continental));
            if (ganhouNoCiclo || classificadoContinental) {
                const status = classificadoContinental && !ganhouNoCiclo ? "bloqueada" : "agendada";
                adicionarEliminatoria(partidas, times, clube.id, "Copa do Mundo de Clubes", ano, 11, 3, "mundial-clubes", null, status);
            }
        }

        const convocada = obterConvocacao({ ...perfil, ano }, carreira, historico);
        const jogosSelecao = [];
        if (convocada) {
            const adversariosPorCompeticao = {};
            for (let i = 0; i < 6; i++) {
                const competicao = i % 2 === 0 ? "Eliminatórias" : "Amistoso";
                const adversarios = adversariosPorCompeticao[competicao] ||= obterSelecoesAdversarias(competicao, convocada.id);
                const indiceAdversario = Math.floor(Math.random() * adversarios.length);
                const [adversario] = adversarios.splice(indiceAdversario, 1);
                jogosSelecao.push({
                    data: Date.UTC(ano, [2, 3, 5, 8, 9, 10][i], 12),
                    adversarioId: adversario.id,
                    adversarioNome: adversario.nome,
                    casa: i % 2 === 0,
                    competicao,
                    tipo: "selecao",
                    selecao: "amistoso",
                    status: "agendada"
                });
            }
            const anoCopaDoMundo = ano >= ANO_BASE_COPA_DO_MUNDO_SELECOES
                && (ano - ANO_BASE_COPA_DO_MUNDO_SELECOES) % CICLO_COPA_DO_MUNDO_SELECOES === 0;
            const anoInicioContinental = ANO_BASE_COPA_DO_MUNDO_SELECOES + 2;
            const anoTorneioRegional = ano >= anoInicioContinental
                && (ano - anoInicioContinental) % CICLO_COPA_DO_MUNDO_SELECOES === 0;
            if (anoCopaDoMundo || anoTorneioRegional) {
                const competicaoRegional = {
                    americaSul: "Copa América", europa: "Eurocopa", americaNorte: "Copa Ouro",
                    africa: "Copa das Nações Africanas", asia: "Copa da Ásia", oceania: "Copa das Nações da OFC"
                }[convocada.regiao];
                const competicoesSelecao = anoCopaDoMundo
                    ? ["Copa do Mundo"]
                    : [competicaoRegional, "Olimpíadas"];
                competicoesSelecao.forEach((competicao, indice) => {
                    if (competicao === "Olimpíadas" && Number(perfil.idade) > 23) return;
                    adicionarEliminatoria(partidas, [], convocada.id, competicao, ano, 5 + indice, 4, `selecao:${convocada.id}`, competicao);
                });
            }
            const anoBaseSelecoes = ANO_BASE_COPA_DO_MUNDO_SELECOES;
            const anoMundialDeBase = ano > anoBaseSelecoes
                && (ano - (anoBaseSelecoes + 1)) % 2 === 0
                && !anoCopaDoMundo;
            if (anoMundialDeBase) {
                if (perfil.idade <= 20) adicionarEliminatoria(partidas, [], convocada.id, "Mundial Sub-20", ano, 5, 4, `selecao:${convocada.id}`, "Mundial Sub-20");
                if (perfil.idade <= 17) adicionarEliminatoria(partidas, [], convocada.id, "Mundial Sub-17", ano, 5, 4, `selecao:${convocada.id}`, "Mundial Sub-17");
            }
            partidas.push(...jogosSelecao);
        }
        return partidas.sort((a, b) => a.data - b.data);
    }
    async function iniciar() {
        const carreira = typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
        if (!simulandoCarreira && temporadaEmAndamento(carreira)) {
            informar("Conclua a temporada atual antes de avançar para a próxima.", true);
            return;
        }
        const posRadio = document.querySelector('input[name="posicao"]:checked');
        if (!posRadio) { informar("Selecione a posição do jogador no perfil principal.", true); return; }
        const nome = (typeof normalizarNome === "function" ? normalizarNome($("nome").value) : $("nome").value.trim()) || carreira.nome || "Jogador";
        const posicao = posRadio.id.toUpperCase();
        const nacionalidade = $("nacionalidade")?.value || carreira.nacionalidade || "";
        const historicoCompleto = typeof lerHistorico === "function" ? lerHistorico() : [];
        let historicoCarreira = historicoCompleto.filter(t => String(t.carreiraId) === String(carreira.id));
        // Compatibilidade com temporadas antigas que não tinham carreiraId uniforme.
        if (!historicoCarreira.length && typeof obterHistoricoDaCarreira === "function") {
            const nomeNormalizado = String(nome).trim().toLocaleLowerCase("pt-BR");
            historicoCarreira = obterHistoricoDaCarreira(nome, { nome: (typeof POSICOES_CAMPO !== "undefined" && POSICOES_CAMPO[posicao]?.nome) || posicao })
                .filter(t => !t.carreiraId && String(t.nome || "").trim().toLocaleLowerCase("pt-BR") === nomeNormalizado);
        }
        let ultimaTemporada = historicoCarreira[historicoCarreira.length - 1];
        if (ultimaTemporada?.lesaoCarreira) {
            informar("A carreira foi encerrada por uma lesão gravíssima registrada na temporada anterior.", true);
            return;
        }
        const idadeInformada = Math.max(16, Number($("idade").value) || 18);
        const idade = ultimaTemporada ? Number(ultimaTemporada.idade) + 1 : idadeInformada;
        const ano = ultimaTemporada ? (typeof proximoAno === "function" ? proximoAno(historicoCarreira) : Number(ultimaTemporada.ano) + 1) : (Number(typeof ANO_INICIAL !== "undefined" ? ANO_INICIAL : 2026) || 2026);
        let overall = Math.max(1, Math.min(99, Number(ultimaTemporada?.overall) || Number(typeof OVERALL_PADRAO !== "undefined" ? OVERALL_PADRAO : 50)));
        const idadeLimite = ultimaTemporada
            ? Number(carreira.idadeLimite) || (typeof obterIdadeLimite === "function" ? obterIdadeLimite() : 40)
            : Math.max(idade, Number($("idade-limite").value) || Number(carreira.idadeLimite) || 40);
        if (idade > idadeLimite) { informar(`A carreira chegou à idade limite (${idadeLimite}). Use a opção de aposentadoria ou inicie outra carreira.`, true); return; }

        let clubeId = ultimaTemporada?.clube || carreira.clube || "";
        const temporadaInicial = !ultimaTemporada || !clubesDisponiveis().some(c => c.id === clubeId);
        const contratoAtivo = !temporadaInicial && Number(carreira.anosContratoRestantes) > 0;
        let contratoEscolhido = null;
        try {
            carreira.nome = nome; carreira.posicaoDetalhe = posicao;
            carreira.posicao = (typeof POSICOES_CAMPO !== "undefined" && POSICOES_CAMPO[posicao]?.nome) || posicao;
            carreira.nacionalidade = nacionalidade; carreira.idadeLimite = idadeLimite;
            if (!Number.isFinite(Number(carreira.rompimentosContratoUsados))) carreira.rompimentosContratoUsados = 0;

            if (temporadaInicial) {
                contratoEscolhido = await escolherContratoParaTemporada("", true, idade, idadeLimite, carreira);
                if (!contratoEscolhido) return;
                clubeId = contratoEscolhido.clube;
                carreira.clube = clubeId;
                carreira.anosContratoRestantes = Math.max(0, Number(contratoEscolhido.anosContrato) || 0);
                carreira.salarioAtual = Number(contratoEscolhido.salarioProposto) || 0;
            } else if (contratoAtivo && simulandoCarreira) {
                carreira.anosContratoRestantes = Number(carreira.anosContratoRestantes) || 0;
            } else if (contratoAtivo) {
                const acao = await escolherAcaoContrato(clubeId, carreira.anosContratoRestantes);
                if (!acao) return;
                if (acao === "transferencias") {
                    contratoEscolhido = await escolherContratoParaTemporada(clubeId, false, idade, idadeLimite, carreira);
                    if (!contratoEscolhido) return;
                    if (contratoEscolhido.clube !== clubeId) carreira.rompimentosContratoUsados++;
                    clubeId = contratoEscolhido.clube;
                    carreira.clube = clubeId;
                    carreira.anosContratoRestantes = Math.max(0, Number(contratoEscolhido.anosContrato) || 0);
                    carreira.salarioAtual = Number(contratoEscolhido.salarioProposto) || carreira.salarioAtual || 0;
                }
            } else if (!contratoAtivo && simulandoCarreira) {
                const clubeAtual = clubesDisponiveis().find(c => c.id === clubeId);
                contratoEscolhido = criarOfertaContrato(clubeAtual, idade, idadeLimite, ultimaTemporada, historicoCarreira);
                carreira.anosContratoRestantes = Math.max(0, Number(contratoEscolhido.anosContrato) || 0);
                carreira.salarioAtual = Number(contratoEscolhido.salarioProposto) || carreira.salarioAtual || 0;
            } else {
                contratoEscolhido = await escolherContratoParaTemporada(clubeId, false, idade, idadeLimite, carreira);
                if (!contratoEscolhido) return;
                clubeId = contratoEscolhido.clube;
                carreira.clube = clubeId;
                carreira.anosContratoRestantes = Math.max(0, Number(contratoEscolhido.anosContrato) || 0);
                carreira.salarioAtual = Number(contratoEscolhido.salarioProposto) || carreira.salarioAtual || 0;
            }
            const clube = clubesDisponiveis().find(c => c.id === clubeId);
            if (!clube) { informar("Não foi possível confirmar o clube escolhido no contrato.", true); return; }
            const times = clubesDisponiveis().filter(c => c.liga === clube.liga);
            if (times.length < 2) { informar("Esta liga não tem clubes suficientes para montar o calendário.", true); return; }
            if (typeof salvarCarreiraAtual === "function") salvarCarreiraAtual(carreira);
            const posicaoDetalhe = posicao;
            const modeloTemporada = typeof criarTemporada === "function"
                ? criarTemporada(nome, idade, ano, posicaoDetalhe, historicoCarreira, nacionalidade, clubeId)
                : null;
            if (modeloTemporada) overall = Math.max(1, Math.min(99, Number(modeloTemporada.overall) || overall));
            const perfilClube = $("perfil-clube"); if (perfilClube) perfilClube.textContent = clube.nome;
            const perfilContrato = $("perfil-contrato"); if (perfilContrato) perfilContrato.textContent = carreira.anosContratoRestantes > 0 ? `Contrato ativo · ${carreira.anosContratoRestantes} temporada(s)` : "Contrato até o fim da temporada";
            const perfilRompimentos = $("perfil-rompimentos"); if (perfilRompimentos) perfilRompimentos.textContent = `Rompimentos: ${Number(carreira.rompimentosContratoUsados)||0}/${Number(getConfig()?.geral?.limiteRompimentosContrato)||3}`;
            const perfilAno = $("perfil-ano"); if (perfilAno) perfilAno.textContent = String(ano);
            $("nome").value = nome; $("idade").value = idade;
            const tabela = times.map(t => ({ id: t.id, nome: t.nome, forca: forcaClube(t), j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: 0 }));
            const rodadas = gerarRodadasLiga(times);
            const perfil = { overall, idade, nacionalidade, posicao };
            const partidas = montarCalendarioTemporada(times, clube, rodadas, ano, carreira, historicoCarreira, perfil);
            partidas.forEach((partida, indice) => { partida.numero = indice + 1; });
            const jogosLesaoAnterior = Number(ultimaTemporada?.jogosForaProximaTemporada) || 0;
            estado = { versao: 4, integrado: true, carreiraId: carreira.id, nome, posicao, nacionalidade, overall, atributos: modeloTemporada?.atributos || null, idade, idadeLimite, ano, clubeId, liga: clube.liga, rodada: 0, rodadas, partidas, tabela, disponibilidade: disponibilidadeInicial(jogosLesaoAnterior), desempenhoPosicional: desempenhoPosicionalInicial(), estatisticas: { jogos: 0, gols: 0, assistencias: 0, jogosClube: 0, golsClube: 0, assistenciasClube: 0, jogosSelecao: 0, golsSelecao: 0, assistenciasSelecao: 0, jogosSelecaoPorCompeticao: {}, golsSelecaoPorCompeticao: {}, convocado: partidas.some(p => p.tipo === "selecao"), amarelos: 0, vermelhos: 0, motm: 0, vitorias: 0, empates: 0, derrotas: 0, driblesCompletos: 0, desarmes: 0, defesas: 0, jogadasCriadas: 0 }, eventos: [], competicoes: {}, trofeusClube: [], trofeusSelecao: [], trofeusColetivos: [], trofeusIndividuais: [], ultima: null, feed: [], salvaOficialmente: false };
            salvar(); renderizar();
            const convocado = estado.estatisticas.convocado ? ` Convocado para ${SELECOES.find(s => s.id === nacionalidade)?.nome || "a seleção"}; partidas internacionais adicionadas ao calendário.` : "";
            informar(`Temporada ${ano} iniciada por contrato com ${clube.nome}.${convocado}`);
        } catch (erro) {
            console.error("Falha ao preparar temporada jogo a jogo:", erro);
            informar(`Não foi possível iniciar a temporada: ${erro.message || erro}`, true);
        }
    }
    async function iniciarOuAvancar() {
        if (decisaoEmAndamento) return;
        const carreira = typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
        const historico = obterHistoricoCarreira(carreira);
        if (carreiraEncerrada(carreira, historico)) {
            carreira.id = typeof gerarIdRanking === "function" ? gerarIdRanking() : `carreira-${Date.now()}`;
            carreira.clube = "";
            carreira.clubeAlvo = "";
            carreira.anosContratoRestantes = 0;
            carreira.rompimentosContratoUsados = 0;
            carreira.salarioAtual = 0;
            carreira.saldo = 0;
            carreira.clubeQualificado = "";
            carreira.competicoesQualificadas = [];
            carreira.aposentadoriaSelecao = false;
            carreira.aposentadoriaVoluntaria = false;
            estado = null;
            try {
                localStorage.removeItem(KEY);
            } catch (erro) {
                console.error("Não foi possível limpar o progresso da carreira encerrada:", erro);
                informar("Não foi possível iniciar uma nova carreira porque o progresso anterior não pôde ser limpo.", true);
                return;
            }
            if (typeof salvarCarreiraAtual !== "function" || !salvarCarreiraAtual(carreira)) {
                informar("Não foi possível salvar a nova carreira. Verifique o armazenamento do navegador e tente novamente.", true);
                return;
            }
            const resumoFinal = $("resumo-final");
            if (resumoFinal) resumoFinal.hidden = true;
            const resultados = $("resultados");
            if (resultados) resultados.hidden = false;
            renderizar();
        }
        await iniciar();
    }
    async function aposentarJogador() {
        if (decisaoEmAndamento) return;
        if (typeof aposentarVoluntariamente !== "function") {
            informar("A opção de aposentadoria não está disponível nesta página.", true);
            return;
        }
        if (typeof confirmarAcao !== "function") {
            informar("O modal de confirmação não está disponível nesta página.", true);
            return;
        }
    
        const carreira = typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
        const emAndamento = temporadaEmAndamento(carreira);
    
        const mensagem = emAndamento
            ? "A temporada atual será concluída automaticamente antes da aposentadoria.\n\nTem certeza que deseja aposentar o jogador agora?"
            : "Tem certeza que deseja aposentar o jogador agora?\n\nA carreira será registrada no ranking e não poderá ser retomada.";
    
        const confirmado = await confirmarAcao(mensagem, "Confirmar aposentadoria");
        if (!confirmado) return;
    
        if (emAndamento) {
            await mostrarCarregamento("Concluindo a temporada atual antes da aposentadoria...");
            try {
                simularRestantes();
            } finally {
                ocultarCarregamento();
            }
            if (!estado?.salvaOficialmente) return;
        }
    
        // Já confirmamos acima; evita a segunda confirmação dentro de aposentarVoluntariamente().
        await aposentarVoluntariamente(true);
        renderizar();
    }
  
    function registrarResultado(timeCasa, timeFora, golsCasa, golsFora) {
        const casa = estado.tabela.find(t => t.id === timeCasa.id), fora = estado.tabela.find(t => t.id === timeFora.id);
        if (!casa || !fora) return;
        casa.j++; fora.j++; casa.gp += golsCasa; casa.gc += golsFora; fora.gp += golsFora; fora.gc += golsCasa;
        if (golsCasa > golsFora) { casa.v++; casa.pts += 3; fora.d++; }
        else if (golsFora > golsCasa) { fora.v++; fora.pts += 3; casa.d++; }
        else { casa.e++; fora.e++; casa.pts++; fora.pts++; }
    }
    function obterCompeticoesQualificadas(tabela, liga) {
        const ordenada = [...tabela].sort((a, b) => b.pts - a.pts || (b.gp - b.gc) - (a.gp - a.gc) || b.gp - a.gp);
        const posicao = ordenada.findIndex(t => t.id === estado.clubeId);
        if (posicao < 0) return [];
        let qualificadas = [];
        if (["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"].includes(liga)) {
            if (posicao < 4) qualificadas = ["Champions League"];
            else if (posicao < 8) qualificadas = ["Europa League"];
            else if (posicao < 12) qualificadas = ["Conference League"];
        } else if (["Primeira Liga", "Eredivisie", "Süper Lig", "Belgian Pro League", "Scottish Premiership", "Swiss Super League", "Austrian Bundesliga", "Russian Premier League", "Ukrainian Premier League", "Greek Super League"].includes(liga)) {
            if (posicao < 2) qualificadas = ["Champions League"];
            else if (posicao < 4) qualificadas = ["Europa League"];
            else if (posicao < 6) qualificadas = ["Conference League"];

        } else if (["Brasileirão"].includes(liga)) {
            // 1-4 Libertadores · 5 Pré-Libertadores (ainda vai pra Libertadores) · 6-11 Sul-Americana
            if (posicao < 4) qualificadas = ["Libertadores"];
            else if (posicao === 4) qualificadas = ["Libertadores"]; // vaga de Pré-Libertadores
            else if (posicao < 11) qualificadas = ["Copa Sul-Americana"];
          
        } else if (["Argentine Primera División", "Colombian Primera A", "Chilean Primera División",
            "Uruguayan Primera División", "Ecuadorian Serie A", "Paraguayan Primera División"].includes(liga)) {
            if (posicao < 4) qualificadas = ["Libertadores"];
            else if (posicao < 8) qualificadas = ["Copa Sul-Americana"];
        } else if (["MLS", "Liga MX"].includes(liga)) {
            if (posicao < 4) qualificadas = ["CONCACAF Champions Cup"];
        } else if (["Saudi Pro League", "J1 League", "K League 1", "Chinese Super League", "Australian A-League"].includes(liga)) {
            if (posicao < (liga === "Australian A-League" ? 2 : 3)) qualificadas = ["AFC Champions League"];
            else if (posicao < 6) qualificadas = ["AFC Champions League 2"];
        } else if (["Egyptian Premier League", "South African Premier Division", "Moroccan Botola"].includes(liga)) {
            if (posicao < 2) qualificadas = ["CAF Champions League"];
            else if (posicao < 5) qualificadas = ["CAF Confederation Cup"];
        }
  
        const trofeus = estado.trofeusClube || [];
        const nomes = typeof obterNomesTrofeusClube === "function" ? obterNomesTrofeusClube(estado.clubeId) : {};
        if (trofeus.includes(nomes.copa)) {
            const acessoCopa = liga === "Brasileirão" || liga === "Argentine Primera División" ? "Libertadores"
                : liga === "MLS" || liga === "Liga MX" ? "CONCACAF Champions Cup"
                : liga === "Premier League" ? "Conference League"
                : ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Primeira Liga", "Eredivisie", "Süper Lig", "Belgian Pro League", "Scottish Premiership", "Swiss Super League", "Austrian Bundesliga", "Russian Premier League", "Ukrainian Premier League", "Greek Super League"].includes(liga) ? "Europa League"
                : liga === "Australian A-League" ? "AFC Champions League 2"
                : liga === "Egyptian Premier League" || liga === "South African Premier Division" || liga === "Moroccan Botola" ? "CAF Confederation Cup"
                : ["Saudi Pro League", "J1 League", "K League 1", "Chinese Super League"].includes(liga) ? "AFC Champions League"
                : "Copa Sul-Americana";
            const prioridade = nome => ["Champions League", "Libertadores", "CONCACAF Champions Cup", "AFC Champions League", "CAF Champions League"].includes(nome) ? 3
                : ["Europa League", "Copa Sul-Americana", "AFC Champions League 2", "CAF Confederation Cup"].includes(nome) ? 2
                : nome === "Conference League" ? 1 : 0;
            if (!qualificadas.includes(acessoCopa) && !qualificadas.some(nome => prioridade(nome) > prioridade(acessoCopa))) {
                qualificadas = qualificadas.filter(nome => prioridade(nome) >= prioridade(acessoCopa));
                qualificadas.push(acessoCopa);
            }
        }
        return qualificadas;
    }
    function processarEliminatoria(partida, golsCasa, golsFora) {
        if (partida.tipo !== "mata-mata" && !(partida.tipo === "selecao" && partida.fase)) return "";
        let vencedorCasa = golsCasa > golsFora;
        if (golsCasa === golsFora) {
            vencedorCasa = Math.random() < 0.5;
            partida.decidePenaltis = true;
        }
        partida.vencedorCasa = vencedorCasa;
        const venceu = partida.casa === vencedorCasa;
        if (!venceu) {
            estado.partidas.filter(p => p.torneioId === partida.torneioId && p.fase > partida.fase && p.status === "agendada")
                .forEach(p => { p.status = "cancelada"; });
            return `${estado.nome} foi eliminado(a) de ${partida.competicao}.`;
        }
        if (partida.fase === partida.totalFases) {
            const lista = partida.tipo === "selecao" ? (estado.trofeusSelecao ||= []) : (estado.trofeusClube ||= []);
            if (!lista.includes(partida.competicao)) lista.push(partida.competicao);
            const nomesTrofeus = typeof obterNomesTrofeusClube === "function" ? obterNomesTrofeusClube(estado.clubeId) : {};
            if (partida.tipo === "mata-mata" && partida.competicao === nomesTrofeus.continental) {
                estado.partidas.filter(p => p.status === "bloqueada" && ["Intercontinental", "Copa do Mundo de Clubes"].includes(p.competicao))
                    .forEach(p => { p.status = "agendada"; });
            }
            return `Campeão: ${partida.competicao}.`;
        }
        return `Classificado para a próxima fase de ${partida.competicao}.`;
    }
    function simularPartida(indice, mostrarResultado = true, interacao = null) {
        const partida = estado.partidas[indice];
        if (!partida || partida.status !== "agendada") return;
        const times = clubesDisponiveis();
        const pelaSelecao = partida.tipo === "selecao";
        const meuClube = pelaSelecao
            ? (typeof SELECOES !== "undefined" ? SELECOES.find(s => s.id === estado.nacionalidade) : null)
            : times.find(c => c.id === estado.clubeId);
        const adversario = partida.adversarioId
            ? pelaSelecao
                ? (typeof SELECOES !== "undefined" ? SELECOES.find(s => s.id === partida.adversarioId) : null)
                : times.find(c => c.id === partida.adversarioId)
            : null;
        if (!meuClube || (!pelaSelecao && !adversario)) { informar("Não foi possível localizar uma equipe do calendário.", true); return; }
        const visitante = adversario || { id: `${meuClube.id}-adversario`, nome: partida.adversarioNome || "Seleção adversária" };
        const casa = partida.casa ? meuClube : visitante, fora = partida.casa ? visitante : meuClube;
        const vantagemCasa = partida.casa ? 0.22 : -0.22;
        const forcaBaseMinhaEquipe = pelaSelecao ? Number(getConfig()?.selecao?.potencias?.[meuClube.id]) || 60 : forcaClube(meuClube);
        const posicaoDefensiva = ["GOL", "ZCE", "ZCD", "LE", "LD"].includes(String(estado.posicao).toUpperCase());
        const impactoBaseJogador = ((Number(estado.overall) || 65) - 70) * 0.3;
        const impactoJogador = Math.max(-5, Math.min(8, impactoBaseJogador * (posicaoDefensiva ? 1.35 : 1)));
        const forcaMinhaEquipe = Math.max(35, Math.min(99, forcaBaseMinhaEquipe + impactoJogador));
        const forcaAdversaria = adversario
            ? pelaSelecao
                ? Number(getConfig()?.selecao?.potencias?.[adversario.id]) || 60
                : forcaClube(adversario)
            : 60 + Math.random() * 20;
        const delta = (partida.casa ? forcaMinhaEquipe - forcaAdversaria : forcaAdversaria - forcaMinhaEquipe) / 25 + vantagemCasa;
        let golsCasa = sortearPoisson(Math.max(0.25, 1.35 + delta * 0.55));
        let golsFora = sortearPoisson(Math.max(0.25, 1.15 - delta * 0.45));
        const disponibilidade = estado.disponibilidade ||= disponibilidadeInicial();
        estado.eventos ||= [];
        const chaveEquipe = pelaSelecao ? "selecao" : "clube";
        let motivoAusencia = "";
        let jogosSuspensaoCartao = 0;
        let suspensaoPorAmarelos = false;
        if (disponibilidade.lesaoCarreira || disponibilidade.jogosLesao > 0) {
            motivoAusencia = disponibilidade.lesaoCarreira ? "fora por lesão gravíssima" : "fora por lesão";
            if (!disponibilidade.lesaoCarreira) disponibilidade.jogosLesao--;
        } else if (Number(disponibilidade.suspensoes[chaveEquipe]) > 0) {
            disponibilidade.suspensoes[chaveEquipe]--;
            motivoAusencia = "suspenso por cartão";
        }
        const statsJogador = motivoAusencia
            ? { participou: false, gols: 0, assistencias: 0, amarelo: 0, vermelho: 0, motm: false }
            : sortearEstatisticasJogador(partida, meuClube, golsCasa, golsFora, interacao?.participou ?? null);
        const participou = statsJogador.participou;
        const posicao = typeof chavePosicaoCampo === "function"
            ? chavePosicaoCampo(estado.posicao)
            : String(estado.posicao || "").toUpperCase();
        const ehGoleiro = posicao === "GOL";
        const ehDefensor = ["ZCE", "ZCD", "LE", "LD"].includes(posicao);
        const ehMeiaOuAtacante = ["ME", "MC", "MD", "PE", "CA", "PD"].includes(posicao);
        const estatisticasComplementares = {
            driblesCompletos: participou && ehMeiaOuAtacante ? sortearPoisson(.8) : 0,
            desarmes: participou && ehDefensor ? sortearPoisson(1.7) : 0,
            defesas: participou && ehGoleiro ? sortearPoisson(.9) : 0,
            jogadasCriadas: participou ? sortearPoisson(ehGoleiro ? .15 : ehDefensor ? .25 : .45) : 0
        };
        if (participou && interacao) {
            estatisticasComplementares.driblesCompletos += Math.max(0, Number(interacao.driblesCompletos) || 0);
            estatisticasComplementares.desarmes += Math.max(0, Number(interacao.desarmes) || 0);
            estatisticasComplementares.defesas += Math.max(0, Number(interacao.defesas) || 0);
            estatisticasComplementares.jogadasCriadas += Math.max(0, Number(interacao.jogadasCriadas) || 0);
        }
        let golsJogador = statsJogador.gols;
        let assistJogador = statsJogador.assistencias;
        const golsEquipeCriados = Math.max(0, interacao?.golsEquipeCriados || 0);
        const { amarelo, vermelho, vermelhoDireto = false, motm = false } = statsJogador;
        if (participou && interacao) {
            golsJogador += interacao.gols || 0;
            assistJogador += interacao.assistencias || 0;
            const golsEvitados = Math.max(0, interacao.golsEvitados || 0);
            if (partida.casa) golsFora = Math.max(0, golsFora - golsEvitados);
            else golsCasa = Math.max(0, golsCasa - golsEvitados);
        }
        // O jogador faz parte do placar: se sua participação gerar mais gols que
        // o resultado inicialmente sorteado, o placar é ajustado para comportá-los.
        if (participou) {
            const golsNecessarios = golsJogador + assistJogador + golsEquipeCriados;
            if (partida.casa) golsCasa = Math.max(golsCasa, golsNecessarios);
            else golsFora = Math.max(golsFora, golsNecessarios);
        }
        if (!pelaSelecao && partida.tipo === "liga") registrarResultado(casa, fora, golsCasa, golsFora);
        if (participou) {
            const prefixo = pelaSelecao ? "Selecao" : "Clube";
            estado.estatisticas[`jogos${prefixo}`] = (estado.estatisticas[`jogos${prefixo}`] || 0) + 1;
            estado.estatisticas[`gols${prefixo}`] = (estado.estatisticas[`gols${prefixo}`] || 0) + golsJogador;
            estado.estatisticas[`assistencias${prefixo}`] = (estado.estatisticas[`assistencias${prefixo}`] || 0) + assistJogador;
            if (pelaSelecao) {
                const competicao = partida.competicao;
                const jogosPorCompeticao = estado.estatisticas.jogosSelecaoPorCompeticao;
                const golsPorCompeticao = estado.estatisticas.golsSelecaoPorCompeticao;
                jogosPorCompeticao[competicao] = (jogosPorCompeticao[competicao] || 0) + 1;
                golsPorCompeticao[competicao] = (golsPorCompeticao[competicao] || 0) + golsJogador;
            }
            estado.estatisticas.jogos++; estado.estatisticas.gols += golsJogador; estado.estatisticas.assistencias += assistJogador;
            estado.estatisticas.driblesCompletos += estatisticasComplementares.driblesCompletos;
            estado.estatisticas.desarmes += estatisticasComplementares.desarmes;
            estado.estatisticas.defesas += estatisticasComplementares.defesas;
            estado.estatisticas.jogadasCriadas += estatisticasComplementares.jogadasCriadas;
            estado.estatisticas.amarelos += amarelo; estado.estatisticas.vermelhos += vermelho;
            if (motm) estado.estatisticas.motm = (estado.estatisticas.motm || 0) + 1;
            if (vermelho) {
                const jogosSuspensao = vermelhoDireto ? 1 + Math.floor(Math.random() * 2) : 1;
                disponibilidade.suspensoes[chaveEquipe] = Math.max(Number(disponibilidade.suspensoes[chaveEquipe]) || 0, jogosSuspensao);
                disponibilidade.amarelos[chaveEquipe] = 0;
                estado.eventos.push({ tipo: "cartao-vermelho", jogo: partida.numero, jogosPerdidos: jogosSuspensao });
                jogosSuspensaoCartao = jogosSuspensao;
            }
            if (amarelo && !vermelho) {
                const cfgCartoes = getConfig()?.cartoes || {};
                const limiteAmarelos = Math.max(1, Math.floor(Number(cfgCartoes.limiteAmarelosSuspensao) || 5));
                disponibilidade.amarelos[chaveEquipe] = (Number(disponibilidade.amarelos[chaveEquipe]) || 0) + amarelo;
                if (disponibilidade.amarelos[chaveEquipe] >= limiteAmarelos) {
                    disponibilidade.suspensoes[chaveEquipe] = Math.max(Number(disponibilidade.suspensoes[chaveEquipe]) || 0, 1);
                    disponibilidade.amarelos[chaveEquipe] = 0;
                    estado.eventos.push({ tipo: "suspensao-amarelos", jogo: partida.numero, jogosPerdidos: 1 });
                    jogosSuspensaoCartao = 1;
                    suspensaoPorAmarelos = true;
                }
            }
        }
        if (participou) {
            const desempenho = estado.desempenhoPosicional ||= desempenhoPosicionalInicial();
            const golsMeuTime = partida.casa ? golsCasa : golsFora;
            const golsAdversario = partida.casa ? golsFora : golsCasa;
            desempenho.jogos++;
            desempenho.gols += golsJogador;
            desempenho.assistencias += assistJogador;
            if (golsMeuTime > golsAdversario) desempenho.vitorias++;
            if (golsAdversario === 0) desempenho.jogosSemSofrer++;
        }
        if (partida.tipo === "liga") {
            if ((partida.casa && golsCasa > golsFora) || (!partida.casa && golsFora > golsCasa)) estado.estatisticas.vitorias++;
            else if (golsCasa === golsFora) estado.estatisticas.empates++; else estado.estatisticas.derrotas++;
        }
        partida.status = "concluida"; partida.golsCasa = golsCasa; partida.golsFora = golsFora; partida.participou = participou;
        partida.motivoAusencia = motivoAusencia;
        partida.golsJogador = golsJogador; partida.assistenciasJogador = assistJogador; partida.amarelo = amarelo; partida.vermelho = vermelho; partida.motmJogador = !!motm;
        partida.driblesCompletos = participou ? estatisticasComplementares.driblesCompletos : 0;
        partida.desarmes = participou ? estatisticasComplementares.desarmes : 0;
        partida.defesas = participou ? estatisticasComplementares.defesas : 0;
        partida.jogadasCriadas = participou ? estatisticasComplementares.jogadasCriadas : 0;
        partida.casaNome = casa.nome; partida.foraNome = fora.nome;
        estado.rodada++;
        const resumoTorneio = processarEliminatoria(partida, golsCasa, golsFora);
        const resumo = `${casa.nome} ${golsCasa} × ${golsFora} ${fora.nome}`;
        const hatTrick = golsJogador >= 3;
        let detalheLesao = "";
        if (participou) {
            const cfgLesoes = getConfig()?.lesoes || {};
            const fatorIdade = estado.idade >= 33 ? Number(cfgLesoes.fatorIdoso ?? 1.8)
                : estado.idade >= 29 ? Number(cfgLesoes.fatorVeterano ?? 1.3)
                    : estado.idade <= 24 ? Number(cfgLesoes.fatorJovem ?? .8) : 1;
            const escalaLesao = Math.max(0, Number(cfgLesoes.multiplicador ?? 1)) * Math.max(0, fatorIdade);
            const chanceCarreira = Math.max(0, Number(cfgLesoes.chanceCarreira ?? .00003)) * escalaLesao;
            const chanceGrave = Math.max(0, Number(cfgLesoes.chanceGrave ?? .0003)) * escalaLesao;
            const chanceModerada = Math.max(0, Number(cfgLesoes.chanceModerada ?? .0015)) * escalaLesao;
            const chanceLeve = Math.max(0, Number(cfgLesoes.chanceLeve ?? .012)) * escalaLesao;
            const sorteioLesao = Math.random();
            let tipoLesao = "";
            let jogosLesao = 0;
            if (sorteioLesao < chanceCarreira) {
                tipoLesao = "lesao-carreira";
                disponibilidade.lesaoCarreira = true;
                jogosLesao = estado.partidas.filter(p => p.status === "agendada").length;
            } else if (sorteioLesao < chanceCarreira + chanceGrave) {
                tipoLesao = "lesao-grave";
                jogosLesao = estado.partidas.filter(p => p.status === "agendada").length + Math.floor(Math.random() * 25);
            } else if (sorteioLesao < chanceCarreira + chanceGrave + chanceModerada) {
                tipoLesao = "lesao-moderada";
                jogosLesao = 8 + Math.floor(Math.random() * 13);
            } else if (sorteioLesao < chanceCarreira + chanceGrave + chanceModerada + chanceLeve) {
                tipoLesao = "lesao";
                jogosLesao = 1 + Math.floor(Math.random() * 6);
            }
            if (tipoLesao) {
                disponibilidade.jogosLesao = Math.max(disponibilidade.jogosLesao, jogosLesao);
                estado.eventos.push({ tipo: tipoLesao, jogo: partida.numero, jogosPerdidos: jogosLesao });
                detalheLesao = disponibilidade.lesaoCarreira
                    ? " Lesão gravíssima: encerra a carreira."
                    : ` Lesão: ficará fora das próximas ${jogosLesao} partidas do calendário.`;
            }
        }
        const detalhes = participou
            ? `${estado.nome}: ${golsJogador} gol(s)${hatTrick ? " — HAT-TRICK!" : ""}, ${assistJogador} assistência(s)${motm ? ", MOTM (melhor em campo)" : ""}${amarelo ? ", cartão amarelo" : ""}${vermelho ? ", cartão vermelho" : ""}.${jogosSuspensaoCartao ? ` Suspenso por ${jogosSuspensaoCartao} próxima(s) partida(s)${suspensaoPorAmarelos ? " por acúmulo de amarelos" : ""}.` : ""}${detalheLesao}${resumoTorneio ? ` ${resumoTorneio}` : ""}`
            : `${estado.nome} não entrou em campo${motivoAusencia ? ` (${motivoAusencia})` : ""}.${resumoTorneio ? ` ${resumoTorneio}` : ""}`;
        estado.ultima = { resumo, detalhes, competicao: partida.competicao, rodada: partida.numero, participou, golsJogador, assistJogador, driblesCompletos: partida.driblesCompletos, desarmes: partida.desarmes, defesas: partida.defesas, jogadasCriadas: partida.jogadasCriadas, motm: !!motm, hatTrick, amarelo, vermelho };
        estado.eventos = estado.eventos || [];
        if (hatTrick) estado.eventos.push({ tipo: "hat-trick", jogo: partida.numero });
        if (amarelo) estado.eventos.push({ tipo: "cartao-amarelo", jogo: partida.numero });
        estado.feed.unshift({ titulo: `${partida.competicao} · ${resumo}`, texto: detalhes });
        estado.feed = estado.feed.slice(0, 12);
        if (partida.tipo === "liga") simularOutrosJogosDaRodada(partida.rodadaLiga);
        salvar(); renderizar();
        if (!estado.partidas.some(p => p.status === "agendada") && !estado.salvaOficialmente) finalizarTemporadaOficial();
        else if (mostrarResultado) informar(`Partida ${estado.rodada}/${estado.partidas.length} concluída. ${detalhes}`);
    }
    function simularOutrosJogosDaRodada(indiceRodada) {
        const confrontos = estado.rodadas?.[indiceRodada] || [];
        const times = clubesDisponiveis();
        confrontos.forEach(j => {
            if (j.status === "concluido" || j.casaId === estado.clubeId || j.foraId === estado.clubeId) return;
            const casa = times.find(t => t.id === j.casaId), fora = times.find(t => t.id === j.foraId);
            if (!casa || !fora) return;
            const delta = (forcaClube(casa) - forcaClube(fora)) / 25;
            const gc = sortearPoisson(Math.max(.25, 1.3 + delta * .48));
            const gf = sortearPoisson(Math.max(.25, 1.2 - delta * .42));
            registrarResultado(casa, fora, gc, gf);
            j.status = "concluido"; j.golsCasa = gc; j.golsFora = gf;
        });
        confrontos.forEach(j => { if (j.casaId === estado.clubeId || j.foraId === estado.clubeId) j.status = "concluido"; });
    }
    function criarLancesDaPartida() {
        const posicao = typeof chavePosicaoCampo === "function"
            ? chavePosicaoCampo(estado.posicao)
            : String(estado.posicao || "CA").toUpperCase();
        const normalizarOpcao = (opcao, tipo, atributo) => {
            if (opcao && typeof opcao === "object" && !Array.isArray(opcao)) {
                return { ...opcao, tipo, atributo };
            }
            const [texto, chance, direcao] = Array.isArray(opcao) ? opcao : [opcao, 0, undefined];
            return { texto, chance, tipo, atributo, ...(direcao !== undefined ? { direcao } : {}) };
        };
        const criarLance = (titulo, contexto, tipo, atributo, opcoes) => ({
            titulo,
            contexto,
            opcoes: opcoes.map((opcao) => normalizarOpcao(opcao, tipo, atributo))
        });
        const finalizacao = criarLance("Chance de gol", "Você recebe a bola perto da área. Como finaliza?", "finalizacao", "finalizacao", [
            ["Chutar colocado no canto", .58], ["Bater forte no meio do gol", .49], ["Tentar uma cavadinha", .4]
        ]);
        const passe = criarLance("Passe decisivo", "Um companheiro dispara em direção à área. Qual passe você tenta?", "passe", "passe", [
            ["Enfiada entre os zagueiros", .57], ["Cruzamento na área", .51], ["Tabelar e avançar", .65]
        ]);
        const drible = criarLance("Um contra um", "Um marcador fecha seu caminho. Como você tenta superá-lo?", "drible", "drible", [
            ["Cortar para dentro", .57], ["Tentar uma pedalada", .45], ["Proteger a bola e tocar", .72]
        ]);
        const opcoesAtaque = (titulo, contexto, atributo = "finalizacao") => criarLance(titulo, contexto, "finalizacao", atributo, [
            ["Finalizar rápido", .59], ["Dominar e bater colocado", .55], ["Tentar o chute de primeira", .43]
        ]);
        const opcoesPasse = (titulo, contexto, opcoes) => criarLance(titulo, contexto, "passe", "passe", opcoes);
        const opcoesDefesa = (titulo, contexto, atributo, opcoes) => criarLance(titulo, contexto, "defesa", atributo, opcoes);
        const opcoesDesarme = (titulo, contexto, atributo, opcoes) => {
            const lance = opcoesDefesa(titulo, contexto, atributo, opcoes);
            return { ...lance, opcoes: lance.opcoes.map(opcao => ({ ...opcao, contaComoDesarme: true })) };
        };
        const opcoesDrible = (titulo, contexto, opcoes) => criarLance(titulo, contexto, "drible", "drible", opcoes);
        const penaltiComum = (titulo, contexto, lado = "meio") => {
            // Se o lado sorteado for "meio", usa esquerda/direita para manter 3 opções distintas
            const ladoChute = lado === "meio"
                ? (Math.random() < 0.5 ? "esquerda" : "direita")
                : lado;
            const ladoOposto = ladoChute === "esquerda" ? "direita" : "esquerda";
            return criarLance(
                titulo,
                contexto,
                "penalti",
                "finalizacao",
                [
                    [`Chutar para a ${ladoChute}`, .72, ladoChute],
                    ["Mandar no centro do gol", .68, "meio"],
                    [`Tentar um chute rasteiro para a ${ladoOposto}`, .62, ladoOposto]
                ]
            );
        };
        const penaltiGoleiro = (titulo, contexto) => criarLance(
            titulo,
            contexto,
            "penalti-defesa",
            "reflexos",
            [
                ["Defender para a esquerda", .66, "esquerda"],
                ["Defender para a direita", .66, "direita"],
                ["Esperar o chute e fechar o ângulo", .62, "centro"]
            ]
        );
        const posicoes = {
            GOL: [
                opcoesDefesa("Cara a cara", "O atacante invade a área. Como você tenta defender?", "reflexos", [["Fechar o ângulo", .76], ["Esperar o chute e reagir", .72], ["Sair nos pés do atacante", .62]]),
                opcoesDefesa("Bola cruzada", "Um cruzamento fechado atravessa a pequena área. Qual decisão toma?", "reflexos", [["Sair para encaixar", .7], ["Espalmar para longe", .77], ["Proteger o primeiro poste", .73]]),
                opcoesDesarme("Saída da área", "Um atacante dispara nas costas da defesa e a bola fica fora da área. Como você intervém?", "velocidade", [["Chegar primeiro e afastar para longe", .68], ["Antecipar o domínio e tocar para um lado", .64], ["Deslizar para cortar a bola com segurança", .56]]),
                opcoesDesarme("Cobertura como último homem", "Um passe longo supera a defesa e você precisa agir longe do gol.", "defesa", [["Afastar de primeira para a lateral", .72], ["Dominar e iniciar a saída", .62], ["Antecipar a disputa antes do atacante", .58]]),
                penaltiGoleiro("Pênalti defendido", "O árbitro marca pênalti. Você precisa escolher o lado e a forma de defender."),
                criarLance("Reposição do goleiro", "Após a defesa, você inicia a jogada. Como repõe a bola?", "reposicao", "passe", [["Passe curto para o zagueiro", .77], ["Lançamento no contra-ataque", .51], ["Reposição rápida no espaço", .61]])
            ],
            ZCE: [
                opcoesDefesa("Cobertura central", "Um atacante tenta passar entre você e o outro zagueiro. Como fecha o espaço?", "defesa", [["Antecipar a enfiada", .65], ["Acompanhar e bloquear o chute", .7], ["Dar o bote para desarmar", .55]]),
                opcoesDefesa("Bola aérea", "A bola vem alta na área. Como disputa a jogada?", "fisico", [["Subir para afastar de cabeça", .71], ["Ganhar posição e proteger", .74], ["Tentar dominar para sair jogando", .55]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "esquerda"),
                opcoesPasse("Construção por dentro", "Seu time recupera a bola no campo defensivo. Qual saída escolhe?", [["Passe vertical entre as linhas", .56], ["Inversão para o lado oposto", .64], ["Passe curto para manter a posse", .76]])
            ],
            ZCD: [
                opcoesDefesa("Proteção do lado direito", "O ponta adversário avança pela sua faixa. Como marca?", "defesa", [["Conduzir o atacante para a lateral", .74], ["Desarmar no momento certo", .56], ["Bloquear o cruzamento", .69]]),
                opcoesDefesa("Disputa pelo alto", "Um cruzamento busca o centroavante. Qual ação escolhe?", "fisico", [["Atacar a bola de cabeça", .7], ["Fazer a cobertura do companheiro", .75], ["Afastar de primeira", .66]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "direita"),
                opcoesPasse("Saída pelo lado direito", "Você recupera a bola e encontra espaço à frente.", [["Passe para o lateral avançar", .72], ["Lançamento para o ponta", .54], ["Passe vertical no meio", .59]])
            ],
            LE: [
                opcoesDefesa("Duelo na lateral esquerda", "O ponta tenta avançar pela sua faixa. Como reage?", "defesa", [["Fechar o corredor e esperar apoio", .75], ["Tentar o desarme", .58], ["Bloquear o cruzamento", .68]]),
                opcoesPasse("Apoio pela esquerda", "Você encontra espaço para apoiar o ataque. O que faz?", [["Cruzar na área", .55], ["Tocar por baixo para trás", .69], ["Conduzir até a linha de fundo", .59]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "esquerda"),
                opcoesDefesa("Cobertura do zagueiro", "Um atacante aparece nas suas costas.", "velocidade", [["Voltar em velocidade", .67], ["Fechar a linha de passe", .73], ["Fazer o corte antes do domínio", .61]])
            ],
            LD: [
                opcoesDefesa("Duelo na lateral direita", "O ponta adversário tenta ganhar a linha de fundo. Como defende?", "defesa", [["Fechar o corredor", .75], ["Dar o bote por dentro", .56], ["Bloquear o cruzamento", .68]]),
                opcoesPasse("Apoio pela direita", "Você passa pelo marcador e chega perto da área.", [["Cruzar no segundo poste", .56], ["Tocar rasteiro para trás", .7], ["Buscar a tabela e invadir a área", .61]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "direita"),
                opcoesDefesa("Recuperação defensiva", "Um contra-ataque ameaça o seu lado.", "velocidade", [["Acompanhar o atacante", .68], ["Cortar a linha de passe", .72], ["Pressionar junto ao companheiro", .64]])
            ],
            ME: [
                opcoesPasse("Criação pelo lado esquerdo", "Você recebe entre o meio e a ponta. Como cria perigo?", [["Enfiada para o atacante", .6], ["Cruzamento antecipado", .55], ["Inverter para o lado oposto", .68]]),
                opcoesDrible("Progressão pela esquerda", "Há espaço para avançar com a bola.", [["Cortar para o meio e finalizar", .55], ["Driblar pela linha lateral", .61], ["Proteger e esperar a ultrapassagem", .75]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "esquerda"),
                opcoesDefesa("Pressão no meio-campo", "O adversário tenta sair jogando pela sua faixa.", "defesa", [["Pressionar para forçar o erro", .61], ["Fechar o passe por dentro", .72], ["Tentar interceptar a bola", .64]]),
                opcoesDefesa("Volta para recompor", "O adversário dispara em velocidade e seu time está em inferioridade numérica.", "velocidade", [["Acompanhar o corredor e bloquear o passe", .7], ["Voltar até a área e fechar o chute", .66], ["Pressionar junto do lateral para recuperar", .61]])
            ],
            MC: [
                opcoesPasse("Passe entre linhas", "Você recebe de frente para a defesa adversária.", [["Enfiada para deixar o atacante na cara do gol", .59], ["Virar o jogo para o lado livre", .69], ["Tabela curta para avançar", .66]]),
                opcoesDefesa("Disputa no círculo central", "O adversário tenta iniciar um contra-ataque.", "defesa", [["Antecipar o passe", .66], ["Pressionar o portador", .62], ["Recuar e proteger a defesa", .77]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "meio"),
                opcoesDrible("Condução pelo centro", "Você encontra espaço para carregar a bola.", [["Avançar entre os marcadores", .57], ["Proteger a posse e girar o jogo", .76], ["Tentar uma tabela rápida", .65]]),
                opcoesDefesa("Cobertura dos zagueiros", "Um atacante recebe entre as linhas e ameaça avançar.", "defesa", [["Recuar e fechar o espaço à frente da área", .74], ["Desarmar sem fazer falta", .58], ["Interceptar o passe para o centroavante", .65]])
            ],
            MD: [
                opcoesPasse("Criação pelo lado direito", "Você recebe aberto com espaço para avançar.", [["Lançar o ponta em profundidade", .59], ["Cruzar na área", .56], ["Inverter a jogada", .68]]),
                opcoesDrible("Progressão pela direita", "O marcador fecha a linha lateral.", [["Cortar para dentro", .58], ["Passar em velocidade pela lateral", .62], ["Segurar a bola e buscar apoio", .75]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "direita"),
                opcoesDefesa("Cobertura do meio", "O adversário tenta avançar pelo seu setor.", "defesa", [["Pressionar para recuperar", .62], ["Fechar o passe central", .73], ["Acompanhar a ultrapassagem", .68]]),
                opcoesDefesa("Recomposição pelo lado", "Seu lateral foi superado e o adversário acelera na sua direção.", "velocidade", [["Voltar e dobrar a marcação", .7], ["Cortar o passe para a área", .66], ["Pressionar para recuperar a bola", .6]])
            ],
            PE: [
                opcoesDrible("Um contra um pela esquerda", "Você encara o lateral perto da área.", [["Cortar para dentro e chutar", .57], ["Ganhar na velocidade pela linha", .62], ["Fingir o chute e buscar o passe", .56]]),
                opcoesPasse("Ataque pela ponta esquerda", "Um companheiro entra na área enquanto você avança.", [["Cruzar no primeiro poste", .55], ["Tocar rasteiro para trás", .7], ["Enfiar a bola entre lateral e zagueiro", .6]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "esquerda"),
                opcoesAtaque("Finalização de ponta", "A defesa abre espaço para você finalizar.", "finalizacao"),
                opcoesDefesa("Volta para ajudar o lateral", "O adversário inicia um contra-ataque pelo seu lado.", "velocidade", [["Acompanhar o ponta até a defesa", .7], ["Fechar a linha de passe e recuperar", .64], ["Pressionar para forçar o erro", .58]])
            ],
            CA: [
                opcoesAtaque("Bola na área", "O cruzamento chega e você precisa finalizar sob pressão.", "finalizacao"),
                opcoesDrible("Disputa com o zagueiro", "Você recebe de costas para o gol, marcado de perto.", [["Girar rápido e chutar", .55], ["Proteger a bola até chegar apoio", .76], ["Tocar de primeira para a infiltração", .68]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "meio"),
                opcoesDrible("Ataque à profundidade", "A defesa sobe e aparece espaço nas costas.", [["Disparar para receber em velocidade", .64], ["Fazer o pivô para o meia", .74], ["Atacar o primeiro poste", .61]]),
                opcoesDefesa("Pressão na saída de bola", "Os zagueiros adversários trocam passes e seu time precisa recuperar a bola.", "fisico", [["Pressionar o portador e fechar o passe", .63], ["Perseguir a devolução para o goleiro", .57], ["Fechar a saída curta e forçar o lançamento", .7]])
            ],
            PD: [
                opcoesDrible("Um contra um pela direita", "Você encara o lateral perto da área.", [["Cortar para dentro e chutar", .57], ["Ganhar na velocidade pela linha", .62], ["Fingir o chute e buscar o passe", .56]]),
                opcoesPasse("Ataque pela ponta direita", "Um companheiro invade a área enquanto você avança.", [["Cruzar no segundo poste", .56], ["Tocar rasteiro para trás", .7], ["Enfiar a bola entre lateral e zagueiro", .6]]),
                penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", "direita"),
                opcoesAtaque("Finalização de ponta", "A defesa abre espaço para você finalizar.", "finalizacao"),
                opcoesDefesa("Recomposição pelo lado direito", "O time perde a bola e o adversário avança pela sua faixa.", "velocidade", [["Voltar em velocidade e fechar o corredor", .7], ["Acompanhar a ultrapassagem", .66], ["Tentar o desarme por trás com cuidado", .55]])
            ]
        };
        const pool = posicoes[posicao] || [finalizacao, passe, drible];
        const penaltiExtra = (() => {
            if (Math.random() > 0.18) return null;
            if (posicao === "GOL") {
                return penaltiGoleiro("Pênalti defendido", "O árbitro marca pênalti. Você precisa escolher o lado e a forma de defender.");
            }
            return penaltiComum("Pênalti para decidir", "Você é chamado para cobrar um pênalti. Qual escolha faz?", ["esquerda", "meio", "direita"][Math.floor(Math.random() * 3)]);
        })();
        const poolComPenalti = penaltiExtra && !pool.some(lance => lance?.opcoes?.some(opcao => ["penalti", "penalti-defesa"].includes(opcao.tipo)))
            ? [penaltiExtra, ...pool]
            : pool;
        const quantidade = 2 + Math.floor(Math.random() * 2);
        const embaralhados = [...poolComPenalti];
        for (let indice = embaralhados.length - 1; indice > 0; indice--) {
            const troca = Math.floor(Math.random() * (indice + 1));
            [embaralhados[indice], embaralhados[troca]] = [embaralhados[troca], embaralhados[indice]];
        }
        return embaralhados.slice(0, Math.min(quantidade, embaralhados.length));
    }
    function exibirLanceDecisao() {
        const lance = fluxoDecisao.lances[fluxoDecisao.indiceLance];
        const modal = $("jja-modal-decisao");
        const opcoes = $("jja-decisao-opcoes");
        $("jja-decisao-progresso").textContent = `Lance ${fluxoDecisao.indiceLance + 1} de ${fluxoDecisao.lances.length}`;
        $("jja-decisao-titulo").textContent = lance.titulo;
        $("jja-decisao-contexto").textContent = lance.contexto;
        $("jja-decisao-feedback").textContent = "";
        opcoes.innerHTML = lance.opcoes.map((opcao, indice) =>
            `<button type="button" class="jja-decisao-opcao" data-opcao="${indice}">${escapar(opcao.texto)}</button>`
        ).join("");
        opcoes.hidden = false;
        $("jja-decisao-voltar").hidden = fluxoDecisao.escolhaConfirmada;
        $("jja-decisao-continuar").hidden = true;
        $("jja-decisao-continuar").textContent = fluxoDecisao.indiceLance + 1 < fluxoDecisao.lances.length
            ? "Próximo lance"
            : "Concluir e jogar partida";
        modal.hidden = false;
        opcoes.querySelector("button")?.focus();
    }
    function resolverDecisao(opcao) {
        const atributo = Number(estado.atributos?.[opcao.atributo]) || Number(estado.overall) || 50;
        const chance = Math.max(.2, Math.min(.92, opcao.chance + (Number(estado.overall) - 70) * .003 + (atributo - 60) * .004));
        const sucesso = Math.random() < chance;
        const posicao = typeof chavePosicaoCampo === "function"
            ? chavePosicaoCampo(estado.posicao)
            : String(estado.posicao || "").toUpperCase();
        const ehGoleiro = posicao === "GOL";
        registrarAcaoPosicional(opcao, sucesso);

        if (opcao.tipo === "penalti") {
            const lado = String(opcao.direcao || "meio").toLowerCase();
            const variacaoDirecao = { esquerda: 0.08, meio: 0.0, direita: -0.08 }[lado] || 0;
            const chancePenalti = Math.max(.42, Math.min(.9, chance + variacaoDirecao));
            const converteu = Math.random() < chancePenalti;
            if (converteu) {
                fluxoDecisao.resultado.gols++;
                return lado === "meio"
                    ? "Pênalti convertido no meio do gol! Você marcou com categoria."
                    : `Pênalti convertido para o ${lado}! O goleiro não conseguiu chegar.`;
            }
            return lado === "meio"
                ? "O goleiro adivinhou e defendeu o pênalti no centro."
                : `O goleiro chegou no lado ${lado} e falhou a sua escolha.`;
        }

        if (opcao.tipo === "penalti-defesa") {
            const lado = ["esquerdo", "direito", "centro"][Math.floor(Math.random() * 3)];
            const defesa = Math.random() < Math.max(.46, Math.min(.88, chance + 0.12));
            if (defesa) {
                fluxoDecisao.resultado.golsEvitados++;
                fluxoDecisao.resultado.defesas++;
                return `Defesa! Você antecipou a direção ${lado} e segurou o pênalti.`;
            }
            return `O atacante marcou para o ${lado}. Você não conseguiu impedir a cobrança.`;
        }

        if (!sucesso) {
            return ["defesa", "reflexos", "fisico", "velocidade"].includes(opcao.atributo)
                ? "O adversário conseguiu passar. A jogada continua perigosa."
                : "A defesa adversária leu a jogada e recuperou a bola.";
        }
        if (opcao.tipo === "finalizacao") {
            fluxoDecisao.resultado.gols++;
            return "GOL! Sua finalização encontrou o caminho da rede.";
        }
        if (opcao.tipo === "passe") {
            fluxoDecisao.resultado.jogadasCriadas++;
            if (Math.random() < .68) {
                fluxoDecisao.resultado.assistencias++;
                return "Passe perfeito! A jogada terminou em gol e você deu a assistência.";
            }
            return "Seu passe encontrou o companheiro e criou uma boa chance.";
        }
        if (opcao.tipo === "reposicao") {
            fluxoDecisao.resultado.jogadasCriadas++;
            if (Math.random() < .3) {
                fluxoDecisao.resultado.assistencias++;
                return "Reposição precisa! O contra-ataque terminou em gol e você deu a assistência.";
            }
            return "Sua reposição encontrou um companheiro e iniciou o contra-ataque.";
        }
        if (opcao.tipo === "drible") {
            fluxoDecisao.resultado.driblesCompletos++;
            const recompensa = Math.random();
            if (recompensa < .3) {
                fluxoDecisao.resultado.gols++;
                return "Você superou a marcação e marcou!";
            }
            if (recompensa < .68) {
                fluxoDecisao.resultado.assistencias++;
                return "Você venceu o marcador e serviu o companheiro para o gol.";
            }
            return "Você venceu o marcador e manteve a posse no ataque.";
        }
        if (ehGoleiro && !opcao.contaComoDesarme) fluxoDecisao.resultado.defesas++;
        else fluxoDecisao.resultado.desarmes++;
        fluxoDecisao.resultado.golsEvitados++;
        const acoesDefensivasBemSucedidas = fluxoDecisao.resultado.defesas + fluxoDecisao.resultado.desarmes;
        const chanceContraAtaqueBase = ehGoleiro ? .25 : .15;
        const chanceContraAtaque = Math.min(.65, chanceContraAtaqueBase + acoesDefensivasBemSucedidas * .1);
        if (Math.random() < chanceContraAtaque) {
            fluxoDecisao.resultado.golsEquipeCriados++;
            fluxoDecisao.resultado.jogadasCriadas++;
            if (opcao.contaComoDesarme) return "Você saiu da área, afastou a bola e ainda iniciou um contra-ataque perigoso.";
            if (opcao.atributo === "reflexos") return "Defesaça! Você evitou o gol e iniciou um contra-ataque que terminou em gol.";
            return "Ação defensiva perfeita! Você interrompeu o ataque e iniciou um contra-ataque que terminou em gol.";
        }
        if (opcao.contaComoDesarme) return "Boa saída! Você chegou antes do atacante e afastou o perigo para contar como desarme.";
        if (opcao.atributo === "reflexos") return "Defesaça! Você evitou o gol e manteve sua equipe na partida.";
        if (opcao.atributo === "fisico") return "Você ganhou a disputa e afastou o perigo da área.";
        if (opcao.atributo === "velocidade") return "Recuperação decisiva! Você chegou a tempo e cortou a jogada.";
        return "Ação defensiva perfeita! Você interrompeu o ataque adversário.";
    }
    function encerrarDecisoesPartida(jogarPartida) {
        const fluxo = fluxoDecisao;
        if (!fluxo || (!jogarPartida && fluxo.escolhaConfirmada)) return;
        $("jja-modal-decisao").hidden = true;
        fluxoDecisao = null;
        decisaoEmAndamento = false;
        renderizar();
        if (jogarPartida) {
            bloquearAcoesPartida();
            simularPartida(fluxo.indice, true, { participou: fluxo.participou, ...fluxo.resultado });
        }
    }
    function configurarDecisoesPartida() {
        $("jja-decisao-opcoes")?.addEventListener("click", evento => {
            const botao = evento.target.closest("[data-opcao]");
            if (!botao || !fluxoDecisao) return;
            const lance = fluxoDecisao.lances[fluxoDecisao.indiceLance];
            const opcao = lance.opcoes[Number(botao.dataset.opcao)];
            if (!opcao || fluxoDecisao.decisaoRespondida) return;
            fluxoDecisao.decisaoRespondida = true;
            fluxoDecisao.escolhaConfirmada = true;
            $("jja-decisao-feedback").textContent = resolverDecisao(opcao);
            $("jja-decisao-opcoes").hidden = true;
            $("jja-decisao-voltar").hidden = true;
            $("jja-decisao-continuar").hidden = false;
            $("jja-decisao-continuar").focus();
        });
        $("jja-decisao-continuar")?.addEventListener("click", () => {
            if (!fluxoDecisao) return;
            fluxoDecisao.indiceLance++;
            if (fluxoDecisao.indiceLance >= fluxoDecisao.lances.length) encerrarDecisoesPartida(true);
            else {
                fluxoDecisao.decisaoRespondida = false;
                exibirLanceDecisao();
            }
        });
        $("jja-decisao-voltar")?.addEventListener("click", () => encerrarDecisoesPartida(false));
        $("jja-modal-decisao")?.addEventListener("click", evento => {
            if (evento.target === evento.currentTarget && !fluxoDecisao?.escolhaConfirmada) encerrarDecisoesPartida(false);
        });
        document.addEventListener("keydown", evento => {
            if (evento.key === "Escape" && fluxoDecisao && !fluxoDecisao.escolhaConfirmada) encerrarDecisoesPartida(false);
        });
    }
    function simularProxima() {
        if (bloqueioAcoesPartida || decisaoEmAndamento) return;
        if (!estado) { informar("Inicie sua carreira primeiro.", true); return; }
        const indice = estado.partidas.findIndex(p => p.status === "agendada");
        if (indice < 0) { informar("A temporada já foi concluída."); return; }
        const partida = estado.partidas[indice];
        const pelaSelecao = partida.tipo === "selecao";
        const disponibilidade = estado.disponibilidade || disponibilidadeInicial();
        const chaveEquipe = pelaSelecao ? "selecao" : "clube";
        const indisponivel = disponibilidade.lesaoCarreira || disponibilidade.jogosLesao > 0
            || Number(disponibilidade.suspensoes?.[chaveEquipe]) > 0;
        if (indisponivel) {
            bloquearAcoesPartida();
            simularPartida(indice);
            return;
        }
        const times = clubesDisponiveis();
        const meuClube = pelaSelecao
            ? (typeof SELECOES !== "undefined" ? SELECOES.find(selecao => selecao.id === estado.nacionalidade) : null)
            : times.find(clube => clube.id === estado.clubeId);
        const adversario = times.find(clube => clube.id === partida.adversarioId);
        if (!meuClube || (!pelaSelecao && !adversario)) {
            bloquearAcoesPartida();
            simularPartida(indice);
            return;
        }
        const forcaTime = pelaSelecao ? Number(getConfig()?.selecao?.potencias?.[meuClube.id]) || 60 : forcaClube(meuClube);
        const chanceJogar = Math.max(.72, Math.min(.99, .90 + (estado.overall - forcaTime) * .006));
        const participou = Math.random() < chanceJogar;
        if (!participou) {
            bloquearAcoesPartida();
            simularPartida(indice, true, { participou: false });
            return;
        }
        fluxoDecisao = {
            indice,
            participou: true,
            lances: criarLancesDaPartida(),
            indiceLance: 0,
            escolhaConfirmada: false,
            decisaoRespondida: false,
            resultado: { gols: 0, assistencias: 0, golsEvitados: 0, golsEquipeCriados: 0, driblesCompletos: 0, desarmes: 0, defesas: 0, jogadasCriadas: 0 }
        };
        decisaoEmAndamento = true;
        renderizar();
        exibirLanceDecisao();
    }
  
    async function simularRestantes(simulacaoAutomatica = false, comLoading = false) {
        if (decisaoEmAndamento || (bloqueioAcoesPartida && !simulacaoAutomatica)) return;
        if (!estado) { informar("Inicie sua carreira primeiro.", true); return; }
        if (!estado.partidas.some(p => p.status === "agendada")) { informar("A temporada já foi concluída."); return; }

        if (!simulacaoAutomatica && typeof confirmarAcao === "function") {
            const confirmado = await confirmarAcao(
                "A temporada será concluída automaticamente e todos os jogos restantes serão simulados.\n\nDeseja continuar?",
                "Confirmar simulação da temporada"
            );
            if (!confirmado) return;
        }

        if (!simulacaoAutomatica) bloquearAcoesPartida();
        let indice;
        while ((indice = estado.partidas.findIndex(p => p.status === "agendada")) >= 0) {
            const partida = estado.partidas[indice];
            simularPartida(indice, false);
            if (partida.status === "agendada") {
                informar("A simulação foi interrompida porque um jogo do calendário não pôde ser resolvido.", true);
                return;
            }
        }
        salvar(); renderizar();
        if (!estado.partidas.some(p => p.status === "agendada") && !estado.salvaOficialmente) finalizarTemporadaOficial();
    }
  
    function finalizarTemporadaOficial() {
        if (!estado || estado.salvaOficialmente || !estado.integrado) {
            return;
        }
        try {
            const carreira = typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
            if (String(carreira.id) !== String(estado.carreiraId)) throw new Error("A carreira ativa mudou durante a temporada. Os resultados não foram anexados para evitar misturar carreiras.");
            const historicoCompleto = typeof lerHistorico === "function" ? lerHistorico() : [];
            const historicoCarreira = historicoCompleto.filter(t => String(t.carreiraId) === String(estado.carreiraId));
            if (historicoCarreira.some(t => Number(t.ano) === Number(estado.ano))) {
                estado.salvaOficialmente = true; salvar();
                return;
            }
            const posRadio = document.querySelector(`input[name="posicao"]#${estado.posicao}`);
            const posicaoArg = posRadio ? posRadio.id : estado.posicao;
            const temporada = typeof criarTemporada === "function"
                ? criarTemporada(estado.nome, estado.idade, estado.ano, posicaoArg, historicoCarreira, estado.nacionalidade, estado.clubeId)
                : null;
            if (!temporada) throw new Error("Não foi possível construir a temporada oficial.");
            const e = estado.estatisticas;
            aplicarDesempenhoPosicional(temporada);
            temporada.jogos = e.jogos; temporada.gols = e.gols; temporada.assistencias = e.assistencias;
            temporada.jogosClube = e.jogosClube || 0; temporada.golsClube = e.golsClube || 0; temporada.assistenciasClube = e.assistenciasClube || 0;
            temporada.jogosSelecao = e.jogosSelecao || 0; temporada.golsSelecao = e.golsSelecao || 0; temporada.assistenciasSelecao = e.assistenciasSelecao || 0; temporada.convocado = !!e.convocado;
            temporada.jogosSelecaoPorCompeticao = e.jogosSelecaoPorCompeticao || {};
            temporada.golsSelecaoPorCompeticao = e.golsSelecaoPorCompeticao || {};
            temporada.cartaoAmarelo = e.amarelos; temporada.cartaoVermelho = e.vermelhos; temporada.motm = Number(e.motm) || 0;
            temporada.driblesCompletos = Number(e.driblesCompletos) || 0;
            temporada.desarmes = Number(e.desarmes) || 0;
            temporada.defesas = Number(e.defesas) || 0;
            temporada.jogadasCriadas = Number(e.jogadasCriadas) || 0;
           
            // Garante que o estado tem um array e que a temporada compartilha a mesma referência.
            estado.eventos = Array.isArray(estado.eventos) ? estado.eventos : [];
            temporada.eventos = estado.eventos;
            
            temporada.lesaoGrave = temporada.eventos.some(evento => evento.tipo === "lesao-grave");
            temporada.lesaoCarreira = !!estado.disponibilidade?.lesaoCarreira;
            temporada.jogosForaProximaTemporada = Number(estado.disponibilidade?.jogosLesao) || 0;
            temporada.cleanSheets = estado.posicao === "GOL"
                ? Number(estado.desempenhoPosicional?.jogosSemSofrer) || 0
                : 0;
            temporada.penaltisDefendidos = 0;
            temporada.penaltisCometidos = 0;
            temporada.minutosJogados = e.jogos * 90;
            temporada.clube = estado.clubeId;
            temporada.ano = estado.ano;
            temporada.idade = estado.idade;
            temporada.nome = estado.nome;
            temporada.nacionalidade = estado.nacionalidade;
            temporada.posicaoDetalhe = estado.posicao;
            temporada.posicao = (typeof POSICOES_CAMPO !== "undefined" && POSICOES_CAMPO[estado.posicao]?.nome) || estado.posicao;
            
            // --- Eventos sintéticos de defesa/goleiro -----------------------------
            // Entram em estado.eventos (jogo: 0 = "sem partida específica") e por isso
            // aparecem no resumo da temporada E são considerados nos prêmios.
            const eventosSinteticos = [];
            if (Number(e.defesas) >= 10 && Math.random() < 0.65) eventosSinteticos.push("defesa-ultimo-lance");
            if (Number(e.defesas) >= 20 && Math.random() < 0.55) eventosSinteticos.push("penalti-defendido");
            if (Number(e.desarmes) >= 30 && Math.random() < 0.60) eventosSinteticos.push("interceptacao-decisiva");
            if (Number(e.desarmes) >= 50 && Math.random() < 0.50) eventosSinteticos.push("contra-ataque-desarmado");
            
            eventosSinteticos.forEach(tipo => {
                estado.eventos.push({ tipo, jogo: 0 });
            });
            
            // Passa a referência real (a função só faz .filter(), não muta).
            const trofeusCalculados = gerarTrofeusTemporada(
                temporada.posicaoKey, e.jogos, e.gols, e.assistencias,
                estado.ano, estado.idade, historicoCarreira, estado.nacionalidade,
                estado.clubeId,
                estado.eventos,
                temporada.overall, estado.posicao, !!e.convocado, temporada.atributos
            );
          
            const tabela = estado.tabela.filter(t => !String(t.id).startsWith("__rodada__")).sort((a,b) => b.pts-a.pts || (b.gp-b.gc)-(a.gp-a.gc) || b.gp-a.gp);
            const campeao = tabela[0]?.id === estado.clubeId;
            const nomesTrofeus = typeof obterNomesTrofeusClube === "function" ? obterNomesTrofeusClube(estado.clubeId) : { liga: estado.liga };
            const trofeusClube = [...(estado.trofeusClube || [])];
            if (campeao && !trofeusClube.includes(nomesTrofeus.liga || estado.liga)) trofeusClube.push(nomesTrofeus.liga || estado.liga);
            const trofeusSelecao = [...(estado.trofeusSelecao || [])];
            temporada.trofeusClube = trofeusClube;
            temporada.trofeusSelecao = trofeusSelecao;
            temporada.trofeusColetivos = [...new Set([...trofeusClube, ...trofeusSelecao])];
            temporada.trofeusIndividuais = (trofeusCalculados.trofeusIndividuais || []).filter(t => t !== "Bola de Ouro" || (e.gols >= 20 || e.assistencias >= 15 || e.gols + e.assistencias >= 25));
            estado.trofeusColetivos = temporada.trofeusColetivos;
            estado.trofeusIndividuais = temporada.trofeusIndividuais;
            const reputacao = typeof calcularReputacao === "function" ? calcularReputacao({ clube: estado.clubeId }, [...historicoCarreira, temporada]) : 0;
            temporada.reputacao = reputacao;
            temporada.valorMercado = typeof calcularValorMercado === "function" ? calcularValorMercado(temporada.overall, estado.idade, reputacao, carreira.anosContratoRestantes || 1) : 0;
            temporada.salario = typeof calcularSalario === "function" ? calcularSalario(temporada.valorMercado, reputacao, estado.clubeId) : 0;
            
            temporada.anosContrato = Math.max(0, Number(carreira.anosContratoRestantes) || 0);
            
            const competicoesClubeProxima = obterCompeticoesQualificadas(tabela, estado.liga);            
            temporada.competicoesQualificadas = estado.estatisticas.convocado
                ? obterCompeticoesSelecao(estado.nacionalidade, estado.ano)
                : [];
            
            const premiacaoTitulos = temporada.trofeusColetivos.length * Math.round(50000 + forcaClube(clubesDisponiveis().find(c => c.id === estado.clubeId)) * 10000); 
          
            const premiacaoIndividual = temporada.trofeusIndividuais.length * 50000;
            temporada.premioFinanceiro = premiacaoTitulos + premiacaoIndividual;
            temporada.rendaTemporada = (Number(temporada.salario) || 0) + temporada.premioFinanceiro;
            carreira.saldo = Math.max(0, Number(carreira.saldo) || 0) + temporada.rendaTemporada;
            estado.resumoFinanceiro = { reputacao, valorMercado: temporada.valorMercado, salario: temporada.salario, premioFinanceiro: temporada.premioFinanceiro, renda: temporada.rendaTemporada, saldo: carreira.saldo };
                      
            carreira.competicoesQualificadas = competicoesClubeProxima;
            carreira.clubeQualificado = estado.clubeId;
         
            const novoHistorico = [...historicoCompleto, temporada];
            if (typeof salvarHistorico !== "function" || !salvarHistorico(novoHistorico)) throw new Error("Falha ao salvar o Histórico oficial.");
            carreira.nome = estado.nome; carreira.clube = estado.clubeId; carreira.posicaoDetalhe = estado.posicao;
            carreira.posicao = temporada.posicao; carreira.nacionalidade = estado.nacionalidade;
            carreira.anosContratoRestantes = Math.max(0, (Number(carreira.anosContratoRestantes) || 0) - 1);
            carreira.salarioAtual = Number(temporada.salario) || Number(carreira.salarioAtual) || 0;
            const perfilContrato = $("perfil-contrato"); if (perfilContrato) perfilContrato.textContent = carreira.anosContratoRestantes > 0 ? `Contrato ativo · ${carreira.anosContratoRestantes} temporada(s)` : "Contrato encerrado; negociar na próxima temporada";
            if (typeof salvarCarreiraAtual === "function") salvarCarreiraAtual(carreira);
            estado.salvaOficialmente = true; salvar();
            if (typeof renderHistorico === "function") renderHistorico();
            if (typeof renderAtributos === "function") renderAtributos(temporada);
            const put = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = String(value); };
            put("jogos", temporada.jogos); put("gols", temporada.gols); put("assi", temporada.assistencias);
            if (typeof atualizarTitulosResultados === "function") atualizarTitulosResultados(temporada);
            if (typeof atualizarMercadoResultados === "function") atualizarMercadoResultados(temporada);
            renderizar();
            const valor = typeof formatarValorEuro === "function" ? formatarValorEuro : String;
            put("perfil-nome", estado.nome); put("perfil-idade", estado.idade); put("perfil-ano", estado.ano + 1);
            const clubeFinal = clubesDisponiveis().find(c => c.id === estado.clubeId);
            put("perfil-clube", clubeFinal?.nome || estado.clubeId);
            put("perfil-reputacao", temporada.reputacao); put("perfil-valor", valor(temporada.valorMercado));
            put("perfil-salario", valor(temporada.salario)); put("perfil-saldo", valor(carreira.saldo));
            const selecaoNome = typeof SELECOES !== "undefined" ? SELECOES.find(s => s.id === estado.nacionalidade)?.nome : "";
            put("perfil-selecao", selecaoNome || "Não definida");
            put("perfil-caps", `${temporada.jogosSelecao} jogos · ${temporada.golsSelecao} gols`);
            const carreiraEncerradaAgora = estado.idade >= estado.idadeLimite || temporada.lesaoCarreira;
            if (carreiraEncerradaAgora && typeof mostrarResumoFinal === "function") {
                mostrarResumoFinal(estado.nome, estado.idadeLimite, estado.ano, [...historicoCarreira, temporada], temporada.posicao);
            }
            limparInformacao();
        } catch (erro) {
            console.error("Falha ao registrar temporada jogo a jogo:", erro);
            informar(`Temporada concluída, mas não foi possível registrar no Histórico: ${erro.message || erro}`, true);
        }
    }
    function informar(texto, erro=false) { const el=$("jja-status"); if (el) { el.textContent=texto; el.hidden=false; el.classList.toggle("erro", erro); } }
    function limparInformacao() { const el=$("jja-status"); if (el) { el.textContent=""; el.hidden=true; el.classList.remove("erro"); } }
    function nomeFaseCompeticao(fase, totalFases) {
        const fasesPorQuantidade = {
            1: ["Final"],
            2: ["Semifinal", "Final"],
            3: ["Quartas de final", "Semifinal", "Final"],
            4: ["Oitavas de final", "Quartas de final", "Semifinal", "Final"],
            5: ["Fase preliminar", "Oitavas de final", "Quartas de final", "Semifinal", "Final"]
        };
        return fasesPorQuantidade[totalFases]?.[fase - 1] || `Fase ${fase}`;
    }
    function venceuFaseCompeticao(partida, fases) {
        if (typeof partida.vencedorCasa === "boolean") return partida.casa === partida.vencedorCasa;
        if (partida.golsCasa !== partida.golsFora) {
            return partida.casa ? partida.golsCasa > partida.golsFora : partida.golsFora > partida.golsCasa;
        }
        const proximaFase = fases.find(fase => fase.fase > partida.fase);
        if (proximaFase) return proximaFase.status !== "cancelada";
        const trofeus = partida.tipo === "selecao" ? estado.trofeusSelecao : estado.trofeusClube;
        return (trofeus || []).includes(partida.competicao);
    }

    /* ============================================================
     Zonas de classificação por liga.
     ============================================================ */
    function obterZonasClassificacao(liga) {
        if (liga === "Brasileirão") return [
            { ate: 4, tipo: "libertadores", nome: "Libertadores", cor: "#22c55e" },
            { ate: 5, tipo: "pre-libertadores", nome: "Pré-Libertadores", cor: "#60a5fa" },
            { ate: 11, tipo: "sul-americana", nome: "Copa Sul-Americana", cor: "#facc15" },
            { ultimos: 4, tipo: "rebaixamento", nome: "Rebaixamento", cor: "#ef4444" }
        ];
        if (["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"].includes(liga)) return [
            { ate: 4, tipo: "champions", nome: "Champions League", cor: "#22c55e" },
            { ate: 6, tipo: "europa-league", nome: "Europa League", cor: "#60a5fa" },
            { ate: 7, tipo: "conference-league", nome: "Conference League", cor: "#a78bfa" },
            { ultimos: 3, tipo: "rebaixamento", nome: "Rebaixamento", cor: "#ef4444" }
        ];
        if (["Primeira Liga", "Eredivisie", "Süper Lig", "Belgian Pro League",
             "Scottish Premiership", "Swiss Super League", "Austrian Bundesliga",
             "Russian Premier League", "Ukrainian Premier League", "Greek Super League"].includes(liga)) return [
            { ate: 2, tipo: "champions", nome: "Champions League", cor: "#22c55e" },
            { ate: 4, tipo: "europa-league", nome: "Europa League", cor: "#60a5fa" },
            { ate: 6, tipo: "conference-league", nome: "Conference League", cor: "#a78bfa" },
            { ultimos: 3, tipo: "rebaixamento", nome: "Rebaixamento", cor: "#ef4444" }
        ];
        if (["Argentine Primera División", "Colombian Primera A", "Chilean Primera División",
             "Uruguayan Primera División", "Ecuadorian Serie A", "Paraguayan Primera División"].includes(liga)) return [
            { ate: 4, tipo: "libertadores", nome: "Libertadores", cor: "#22c55e" },
            { ate: 8, tipo: "sul-americana", nome: "Copa Sul-Americana", cor: "#facc15" },
            { ultimos: 2, tipo: "rebaixamento", nome: "Rebaixamento", cor: "#ef4444" }
        ];
        if (["MLS", "Liga MX"].includes(liga)) return [
            { ate: 4, tipo: "concacaf", nome: "CONCACAF Champions Cup", cor: "#22c55e" },
            { ate: 8, tipo: "playoffs", nome: "Playoffs", cor: "#60a5fa" }
        ];
        if (["Saudi Pro League", "J1 League", "K League 1", "Chinese Super League"].includes(liga)) return [
            { ate: 3, tipo: "afc", nome: "AFC Champions League", cor: "#22c55e" },
            { ate: 6, tipo: "afc-2", nome: "AFC Champions League 2", cor: "#60a5fa" },
            { ultimos: 3, tipo: "rebaixamento", nome: "Rebaixamento", cor: "#ef4444" }
        ];
        if (["Egyptian Premier League", "South African Premier Division", "Moroccan Botola"].includes(liga)) return [
            { ate: 2, tipo: "caf", nome: "CAF Champions League", cor: "#22c55e" },
            { ate: 5, tipo: "caf-conf", nome: "CAF Confederation Cup", cor: "#60a5fa" },
            { ultimos: 3, tipo: "rebaixamento", nome: "Rebaixamento", cor: "#ef4444" }
        ];
        if (liga === "Australian A-League") return [
            { ate: 2, tipo: "afc", nome: "AFC Champions League", cor: "#22c55e" },
            { ate: 6, tipo: "playoffs", nome: "Playoffs", cor: "#60a5fa" }
        ];
        return [];
    }
    
    function obterZonaPosicao(zonas, posicao, totalTimes) {
        for (const zona of zonas) {
            if (zona.ate !== undefined && posicao <= zona.ate) return zona;
            if (zona.ultimos !== undefined && posicao > totalTimes - zona.ultimos) return zona;
        }
        return null;
    }
    
    function renderizarLegendaZonas(zonas) {
        if (!zonas || !zonas.length) return "";
        return `<ul class="jja-legenda-zonas" aria-label="Legenda das zonas da classificação">
            ${zonas.map(zona => `<li class="jja-legenda-item">
                <span class="jja-legenda-cor" style="background:${zona.cor}" aria-hidden="true"></span>
                <span class="jja-legenda-texto">${escapar(zona.nome)}</span>
            </li>`).join("")}
        </ul>`;
    }
  
    function renderizarProgressoCompeticoes() {
        const partidas = estado.partidas.filter(partida => partida.torneioId && Number(partida.fase) > 0);
        const competicoes = new Map();
        partidas.forEach(partida => {
            if (!competicoes.has(partida.torneioId)) competicoes.set(partida.torneioId, []);
            competicoes.get(partida.torneioId).push(partida);
        });
        if (!competicoes.size) return "<section class=\"jja-competicoes\"><h3>Outras competições da temporada</h3><p>Nenhuma outra competição nesta temporada.</p></section>";

        const conteudo = [...competicoes.values()].map(fases => {
            fases.sort((a, b) => a.fase - b.fase);
            const totalFases = Number(fases[0].totalFases) || fases.length;
            const faseEliminacao = fases.find(partida => {
                return partida.status === "concluida" && !venceuFaseCompeticao(partida, fases);
            });
            const campeao = fases.some(partida => partida.status === "concluida"
                && partida.fase === totalFases
                && venceuFaseCompeticao(partida, fases));
            const proximaFase = fases.find(partida => partida.status === "agendada");
            const bloqueada = fases.some(partida => partida.status === "bloqueada");
            const concluidas = fases.filter(partida => partida.status === "concluida").length;
            const resumo = campeao ? "Campeão"
                : faseEliminacao ? `Eliminado na ${nomeFaseCompeticao(faseEliminacao.fase, totalFases)}`
                    : proximaFase ? `${nomeFaseCompeticao(proximaFase.fase, totalFases)} em andamento`
                        : bloqueada ? "Aguardando classificação"
                            : "Competição concluída";
            const etapas = fases.map(partida => {
                const venceu = partida.status === "concluida" && venceuFaseCompeticao(partida, fases);
                const status = partida.status === "concluida"
                    ? (venceu ? (partida.fase === totalFases ? "Campeão" : "Classificado") : "Eliminado")
                    : partida.status === "cancelada"
                        ? (faseEliminacao ? `Eliminado na ${nomeFaseCompeticao(faseEliminacao.fase, totalFases)}` : "Não disputada")
                        : partida.status === "bloqueada"
                            ? "Aguardando classificação"
                            : partida === proximaFase ? "Próxima fase" : "Aguardando avanço";
                const classe = partida.status === "concluida"
                    ? (venceu ? "concluida" : "eliminada")
                    : partida.status === "cancelada" ? "eliminada"
                        : partida.status === "bloqueada" ? "bloqueada"
                            : partida === proximaFase ? "atual" : "pendente";
                const resultado = partida.status === "concluida"
                    ? `<strong>${escapar(`${partida.golsCasa}–${partida.golsFora}${partida.decidePenaltis ? " · pênaltis" : ""}`)}</strong>`
                    : "";
                return `<li class="jja-fase jja-fase--${classe}"><span>${escapar(nomeFaseCompeticao(partida.fase, totalFases))}</span><small>${escapar(status)}</small>${resultado}</li>`;
            }).join("");
            const progresso = Math.round(concluidas / Math.max(1, totalFases) * 100);
            return `<article class="jja-competicao"><div class="jja-competicao__topo"><h4>${escapar(fases[0].competicao)}</h4><strong>${escapar(resumo)}</strong></div><div class="jja-competicao__progresso" role="progressbar" aria-label="Avanço em ${escapar(fases[0].competicao)}" aria-valuemin="0" aria-valuemax="${totalFases}" aria-valuenow="${concluidas}"><span style="width:${progresso}%"></span></div><ol class="jja-fases">${etapas}</ol><p>${concluidas} de ${totalFases} fases concluídas</p></article>`;
        }).join("");
        return `<section class="jja-competicoes"><h3>Outras competições da temporada</h3>${conteudo}</section>`;
    }
    function renderizar() {
        const ativo = !!estado;
        const proxima = ativo ? estado.partidas.find(p => p.status === "agendada") : null;
        const carreira = typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
        const historicoCarreira = obterHistoricoCarreira(carreira);
        const encerrada = carreiraEncerrada(carreira, historicoCarreira);
        const emAndamento = temporadaEmAndamento(carreira);
        const botaoIniciar = $("jja-iniciar");
        botaoIniciar.textContent = encerrada ? "Iniciar nova carreira" : historicoCarreira.length ? "Próxima temporada" : "Iniciar carreira";
        botaoIniciar.disabled = bloqueioAcoesPartida || emAndamento || (!!estado && !estado.salvaOficialmente && !proxima);
        const botaoAposentar = $("jja-aposentar");
        botaoAposentar.hidden = !historicoCarreira.length || encerrada;
        botaoAposentar.disabled = !historicoCarreira.length || encerrada;
        $("jja-iniciar").disabled = decisaoEmAndamento;
        $("jja-jogar").disabled = decisaoEmAndamento || bloqueioAcoesPartida || !ativo || !proxima;
        $("jja-simular-restantes").disabled = decisaoEmAndamento || bloqueioAcoesPartida || !ativo || !proxima;
        $("jja-simular-carreira").disabled = decisaoEmAndamento || bloqueioAcoesPartida || encerrada;
        botaoAposentar.disabled = decisaoEmAndamento || bloqueioAcoesPartida || !historicoCarreira.length || encerrada;
        if (!ativo) return;
        const clube = clubesDisponiveis().find(c=>c.id===estado.clubeId);
        const equipeSelecao = typeof SELECOES !== "undefined" ? SELECOES.find(s => s.id === estado.nacionalidade) : null;
        const nomeMeuTime = proxima?.tipo === "selecao" ? equipeSelecao?.nome || "Seleção" : clube?.nome || "Clube";
        const nomeAdversario = proxima ? (clubesDisponiveis().find(c=>c.id===proxima.adversarioId)?.nome || proxima.adversarioNome || "Adversário") : "";
        const estatisticasTemporada = estado.estatisticas || {};
        const posicao = typeof chavePosicaoCampo === "function"
            ? chavePosicaoCampo(estado.posicao)
            : String(estado.posicao || "").toUpperCase();
        const estatisticaTemporadaHtml = `<p>Defesas: ${Number(estatisticasTemporada.defesas) || 0} · Desarmes: ${Number(estatisticasTemporada.desarmes) || 0} · Dribles completos: ${Number(estatisticasTemporada.driblesCompletos) || 0} · Jogadas criadas: ${Number(estatisticasTemporada.jogadasCriadas) || 0}</p>`;
        $("jja-proximo").innerHTML = proxima
            ? `<div class="jja-proximo-topo"><span>PRÓXIMA PARTIDA · ${escapar(proxima.competicao)}</span><span>${proxima.data ? new Date(proxima.data).toLocaleDateString("pt-BR") : `Temporada ${estado.ano}`}</span></div><div class="jja-confronto"><strong>${escapar(proxima.casa?nomeMeuTime:nomeAdversario)}</strong><span>VS</span><strong>${escapar(proxima.casa?nomeAdversario:nomeMeuTime)}</strong></div><p>${proxima.casa?"Jogo em casa":"Jogo fora de casa"} · Temporada ${estado.ano}</p>`
            : `<div class="jja-concluida"><h3>Temporada encerrada</h3><p>Todos os jogos deste calendário foram concluídos.</p>${estatisticaTemporadaHtml}</div>`;
        const e=estado.estatisticas;
        const ultimaPartida = estado.ultima;
        const partidaSalva = ultimaPartida
            ? estado.partidas.find(partida => Number(partida.numero) === Number(ultimaPartida.rodada))
            : null;
        const ultimaDribles = Number(ultimaPartida?.driblesCompletos ?? partidaSalva?.driblesCompletos) || 0;
        const ultimaDesarmes = Number(ultimaPartida?.desarmes ?? partidaSalva?.desarmes) || 0;
        const ultimaDefesas = Number(ultimaPartida?.defesas ?? partidaSalva?.defesas) || 0;
        const ultimaJogadas = Number(ultimaPartida?.jogadasCriadas ?? partidaSalva?.jogadasCriadas) || 0;
        const estatisticaUltimaPartida = `<p><strong>Defesas:</strong> ${ultimaDefesas} · <strong>Desarmes:</strong> ${ultimaDesarmes} · <strong>Dribles completos:</strong> ${ultimaDribles} · <strong>Jogadas criadas:</strong> ${ultimaJogadas}</p>`;
        $("jja-ultima").innerHTML=ultimaPartida
            ? `<div class="jja-placar">${escapar(ultimaPartida.resumo)}</div><p>${escapar(ultimaPartida.detalhes)}</p>${ultimaPartida.participou ? estatisticaUltimaPartida : ""}`
            : "Nenhuma partida disputada.";
        $("jogos").textContent = String(Number(e.jogos) || 0);
        $("gols").textContent = String(Number(e.gols) || 0);
        $("assi").textContent = String(Number(e.assistencias) || 0);
        const trofeusColetivos = new Set([
            ...(estado.trofeusColetivos || []),
            ...(estado.trofeusClube || []),
            ...(estado.trofeusSelecao || [])
        ]);
        $("prem").textContent = String(trofeusColetivos.size + (estado.trofeusIndividuais || []).length);
        $("jja-motm").textContent = String(Number(e.motm) || 0);
        $("jja-amarelos").textContent = String(Number(e.amarelos) || 0);
        $("jja-vermelhos").textContent = String(Number(e.vermelhos) || 0);
        $("jja-hattricks").textContent = String(estado.partidas.filter(p => Number(p.golsJogador) >= 3).length);
        $("jja-dribles").textContent = String(Number(e.driblesCompletos) || 0);
        $("jja-desarmes").textContent = String(Number(e.desarmes) || 0);
        $("jja-defesas").textContent = String(Number(e.defesas) || 0);
        $("jja-jogadas-criadas").textContent = String(Number(e.jogadasCriadas) || 0);
        const tabela=estado.tabela.filter(t=>!t.id.startsWith("__rodada__")).sort((a,b)=>b.pts-a.pts||(b.gp-b.gc)-(a.gp-a.gc)||b.gp-a.gp);
      
        const ligaParaZonas = estado.liga || clubesDisponiveis().find(c => c.id === estado.clubeId)?.liga || "";
        const zonasClassificacao = obterZonasClassificacao(ligaParaZonas);
        const totalTimesTabela = tabela.length;
        const linhasTabela = tabela.map((t, i) => {
            const posicao = i + 1;
            const zona = obterZonaPosicao(zonasClassificacao, posicao, totalTimesTabela);
            const attrs = zona
                ? ` data-zona="${escapar(zona.tipo)}" style="--zona-cor:${zona.cor}"`
                : "";
            const classe = t.id === estado.clubeId ? "meu-clube" : "";
            return `<tr class="${classe}"${attrs}>
                <td>${posicao}</td>
                <td>${escapar(t.nome)}</td>
                <td>${t.j}</td>
                <td>${t.gp - t.gc}</td>
                <td><strong>${t.pts}</strong></td>
            </tr>`;
        }).join("");
        
        $("jja-tabela").innerHTML = `
            <div class="jja-tabela-wrap">
                <table class="jja-tabela">
                    <thead><tr><th>#</th><th>Clube</th><th>J</th><th>SG</th><th>Pts</th></tr></thead>
                    <tbody>${linhasTabela}</tbody>
                </table>
            </div>
            ${renderizarLegendaZonas(zonasClassificacao)}
            ${renderizarProgressoCompeticoes()}`;
      
        $("jja-calendario").innerHTML=`<div class="jja-lista-jogos">${estado.partidas.map(p=>{const adv=clubesDisponiveis().find(c=>c.id===p.adversarioId);const nomeCasa=p.casa?(p.tipo==="selecao"?equipeSelecao?.nome:clube?.nome):(adv?.nome||p.adversarioNome);const nomeFora=p.casa?(adv?.nome||p.adversarioNome):(p.tipo==="selecao"?equipeSelecao?.nome:clube?.nome);const status=p.status==="concluida"?`${p.golsCasa}–${p.golsFora}${p.motmJogador?" · MOTM":""}${p.motivoAusencia?` · Ausente: ${p.motivoAusencia}`:""}`:p.status==="cancelada"?"Eliminado":p.status==="bloqueada"?"Aguardando classificação":"Agendado";return `<div class="jja-jogo ${p.status==="concluida"?"jja-jogo--feito":""}"><span class="jja-jogo-num">${p.data?new Date(p.data).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}):String(p.numero).padStart(2,"0")}</span><span class="jja-jogo-adversario">${escapar(p.competicao)} · ${escapar(nomeCasa || "Equipe")} × ${escapar(nomeFora || "Adversário")}</span><span class="jja-jogo-resultado">${escapar(status)}</span></div>`}).join("")}</div>`;
    }
    function mostrarDesempenhoTemporada(temporada) {
        const resultados = $("resultados");
        if (resultados) resultados.hidden = false;
        if (!temporada) return;
        const coletivos = new Set([
            ...(temporada.trofeusColetivos || []),
            ...(temporada.trofeusClube || []),
            ...(temporada.trofeusSelecao || [])
        ]);
        const hatTricks = (temporada.eventos || []).filter(evento => evento.tipo === "hat-trick").length;
        const put = (id, value) => {
            const elemento = $(id);
            if (elemento) elemento.textContent = String(value);
        };
        put("jogos", temporada.jogos);
        put("gols", temporada.gols);
        put("assi", temporada.assistencias);
        put("prem", coletivos.size + (temporada.trofeusIndividuais || []).length);
        put("jja-motm", temporada.motm);
        put("jja-amarelos", temporada.cartaoAmarelo);
        put("jja-vermelhos", temporada.cartaoVermelho);
        put("jja-hattricks", hatTricks);
        put("jja-dribles", temporada.driblesCompletos);
        put("jja-desarmes", temporada.desarmes);
        put("jja-defesas", temporada.defesas);
        put("jja-jogadas-criadas", temporada.jogadasCriadas);
        if (typeof atualizarTitulosResultados === "function") atualizarTitulosResultados(temporada);
        if (typeof atualizarMercadoResultados === "function") atualizarMercadoResultados(temporada);
    }
  
    async function simularFimCarreira() {
        if (decisaoEmAndamento) return;
        if (typeof confirmarAcao !== "function") {
            informar("O modal de confirmação não está disponível nesta página.", true);
            return;
        }
    
        const confirmado = await confirmarAcao(
            "Deseja simular automaticamente todas as temporadas restantes até a aposentadoria?\n\nA simulação continuará a partir da temporada atual e pode levar alguns segundos.",
            "Simular fim de carreira"
        );
        if (!confirmado) return;
    
        try {
            if (!estado) {
                await iniciar();
                if (!estado) return;
            }
            simulandoCarreira = true;
    
            while (estado && estado.idade <= estado.idadeLimite) {
                if (!estado.salvaOficialmente) {
                    await mostrarCarregamento(`Simulando a temporada ${estado.ano}...`);
                    try {
                        simularRestantes(true);
                    } finally {
                        ocultarCarregamento();
                    }
                }
                if (!estado.salvaOficialmente
                    || estado.idade >= estado.idadeLimite
                    || estado.disponibilidade?.lesaoCarreira) break;
    
                const temporadaAnterior = estado;
                await iniciar();
                if (estado === temporadaAnterior) break;
            }
    
            ocultarCarregamento();
            const carreira = typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
            const historico = obterHistoricoCarreira(carreira);
            const temporadaFinal = historico[historico.length - 1];
            if (temporadaFinal && typeof mostrarResumoFinal === "function") {
                mostrarResumoFinal(
                    carreira.nome || temporadaFinal.nome,
                    carreira.idadeLimite || temporadaFinal.idade,
                    temporadaFinal.ano,
                    historico,
                    temporadaFinal.posicao
                );
                mostrarDesempenhoTemporada(temporadaFinal);
            }
            informar(`Fim da carreira simulada até ${temporadaFinal?.idade || estado?.idade || "a última temporada"} anos. O Histórico contém o resumo de cada temporada.`);
        } catch (erro) {
            console.error("Falha ao simular o fim da carreira:", erro);
            informar(`Não foi possível concluir a simulação da carreira: ${erro.message || erro}`, true);
        } finally {
            ocultarCarregamento();
            simulandoCarreira = false;
        }
    }
  
    function inicializar() {
        carregar();
        const carreira = typeof obterCarreiraAtual === "function" ? obterCarreiraAtual() : {};
        const historicoCarreira = obterHistoricoCarreira(carreira);
        const temCarreiraSalva = historicoCarreira.length > 0;
        if (temCarreiraSalva || estado) {
            $("nome").value = estado?.nome || carreira.nome || "";
            const idadeProximaTemporada = Number(historicoCarreira[historicoCarreira.length - 1]?.idade) + 1;
            $("idade").value = estado && !estado.salvaOficialmente
                ? estado.idade
                : carreiraEncerrada(carreira, historicoCarreira) ? 18 : idadeProximaTemporada || estado?.idade || 18;
            $("idade-limite").value = carreira.idadeLimite || 40;
            const posicao = estado?.posicao || carreira.posicaoDetalhe;
            const radio = document.querySelector(`input[name="posicao"]#${posicao}`);
            if (radio) radio.checked = true;
            $("nacionalidade").value = estado?.nacionalidade || carreira.nacionalidade || "";
        }
        configurarDecisoesPartida();
        $("jja-iniciar")?.addEventListener("click", iniciarOuAvancar);
        $("jja-jogar")?.addEventListener("click", simularProxima);
        $("jja-simular-restantes")?.addEventListener("click", () => simularRestantes(false));
        $("jja-simular-carreira")?.addEventListener("click", () => simularFimCarreira());
        $("jja-aposentar")?.addEventListener("click", aposentarJogador);
        if (estado) {
            estado.trofeusClube = estado.trofeusClube || [];
            estado.trofeusSelecao = estado.trofeusSelecao || [];
            renderizar();
            informar(estado.salvaOficialmente ? `Temporada ${estado.ano} registrada no Histórico oficial.` : "Progresso jogo a jogo recuperado do armazenamento local.");
        } else renderizar();
        if (carreiraEncerrada(carreira, historicoCarreira) && typeof mostrarResumoFinal === "function") {
            const temporadaFinal = historicoCarreira[historicoCarreira.length - 1];
            mostrarResumoFinal(carreira.nome || temporadaFinal.nome, carreira.idadeLimite || temporadaFinal.idade, temporadaFinal.ano, historicoCarreira, temporadaFinal.posicao);
        }
    }
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", inicializar); else inicializar();
})();