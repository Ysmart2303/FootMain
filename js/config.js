/**
 * config.js — Sistema de configurações do FootMain.
 * Carregado ANTES de script.js em ambas as páginas.
 */

const STORAGE_KEY_CONFIG = "footmain_config_v1";
const VERSAO_APP = "1.19.6";

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

/* Posições específicas do 4-3-3 ligadas às quatro categorias da simulação. */
const POSICOES_CAMPO = {
    GOL: { nome: "Goleiro", categoria: "go" },
    ZCE: { nome: "Zagueiro esquerdo", categoria: "zag" },
    ZCD: { nome: "Zagueiro direito", categoria: "zag" },
    LE: { nome: "Lateral esquerdo", categoria: "zag" },
    LD: { nome: "Lateral direito", categoria: "zag" },
    ME: { nome: "Meio-campista esquerdo", categoria: "me" },
    MC: { nome: "Meio-campista central", categoria: "me" },
    MD: { nome: "Meio-campista direito", categoria: "me" },
    PE: { nome: "Ponta esquerda", categoria: "ata" },
    CA: { nome: "Centroavante", categoria: "ata" },
    PD: { nome: "Ponta direita", categoria: "ata" }
};

function categoriaPosicao(valor) {
    if (typeof valor !== "string") return null;
    const texto = valor.trim();
    const chave = texto.toUpperCase();
    if (POSICOES_CAMPO[chave]) return POSICOES_CAMPO[chave].categoria;
    const porNomeCampo = Object.entries(POSICOES_CAMPO).find(([, dados]) => dados.nome.toLowerCase() === texto.toLowerCase());
    if (porNomeCampo) return porNomeCampo[1].categoria;
    const legado = texto.toLowerCase();
    const mapaPosicoesLegado = typeof posicoes !== "undefined" ? posicoes : {};
    if (mapaPosicoesLegado[legado]) return legado;
    const encontrada = Object.entries(mapaPosicoesLegado).find(([, dados]) => dados.nome.toLowerCase() === legado);
    return encontrada ? encontrada[0] : null;
}

function chavePosicaoCampo(valor) {
    if (typeof valor !== "string") return "CA";
    const texto = valor.trim();
    const chave = texto.toUpperCase();
    if (POSICOES_CAMPO[chave]) return chave;
    const porNomeCampo = Object.entries(POSICOES_CAMPO).find(([, dados]) => dados.nome.toLowerCase() === texto.toLowerCase());
    if (porNomeCampo) return porNomeCampo[0];
    const categoria = categoriaPosicao(valor);
    return ({ ata: "CA", me: "MC", zag: "ZCE", go: "GOL" })[categoria] || "CA";
}

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
    { id: "estadosUnidos", nome: "Estados Unidos", regiao: "americaNorte" },
    // Seleções adicionais: cobertura das seis confederações/continentes do jogo
    { id: "noruega", nome: "Noruega", regiao: "europa" },
    { id: "dinamarca", nome: "Dinamarca", regiao: "europa" },
    { id: "austria", nome: "Áustria", regiao: "europa" },
    { id: "equador", nome: "Equador", regiao: "americaSul" },
    { id: "chile", nome: "Chile", regiao: "americaSul" },
    { id: "canada", nome: "Canadá", regiao: "americaNorte" },
    { id: "coreiaDoSul", nome: "Coreia do Sul", regiao: "asia" },
    { id: "arabiaSaudita", nome: "Arábia Saudita", regiao: "asia" },
    { id: "egito", nome: "Egito", regiao: "africa" },
    { id: "africaDoSul", nome: "África do Sul", regiao: "africa" },
    { id: "australia", nome: "Austrália", regiao: "oceania" },
    { id: "novaZelandia", nome: "Nova Zelândia", regiao: "oceania" },
        // ─── ÁFRICA (cobertura ampliada) ───
    { id: "nigeria", nome: "Nigéria", regiao: "africa" },
    { id: "argelia", nome: "Argélia", regiao: "africa" },
    { id: "costaDoMarfim", nome: "Costa do Marfim", regiao: "africa" },
    { id: "tunisia", nome: "Tunísia", regiao: "africa" },
    { id: "camaroes", nome: "Camarões", regiao: "africa" },
    { id: "gana", nome: "Gana", regiao: "africa" },
    { id: "mali", nome: "Mali", regiao: "africa" },
    { id: "burkinaFaso", nome: "Burkina Faso", regiao: "africa" },
    { id: "rdCongo", nome: "RD Congo", regiao: "africa" },
    { id: "caboVerde", nome: "Cabo Verde", regiao: "africa" },
    { id: "guine", nome: "Guiné", regiao: "africa" },
    { id: "zambia", nome: "Zâmbia", regiao: "africa" },
    
    // ─── ÁSIA (cobertura ampliada) ───
    { id: "catar", nome: "Catar", regiao: "asia" },
    { id: "uzbequistao", nome: "Uzbequistão", regiao: "asia" },
    { id: "emiradosArabes", nome: "Emirados Árabes Unidos", regiao: "asia" },
    { id: "iraque", nome: "Iraque", regiao: "asia" },
    { id: "jordania", nome: "Jordânia", regiao: "asia" },
    { id: "china", nome: "China", regiao: "asia" },
    { id: "coreiaDoNorte", nome: "Coreia do Norte", regiao: "asia" },
    { id: "oma", nome: "Omã", regiao: "asia" },
    { id: "tailandia", nome: "Tailândia", regiao: "asia" },
    { id: "siria", nome: "Síria", regiao: "asia" },
    
    // ─── OCEANIA (cobertura ampliada) ───
    { id: "fiji", nome: "Fiji", regiao: "oceania" },
    { id: "novaCaledonia", nome: "Nova Caledônia", regiao: "oceania" },
    { id: "ilhasSalomao", nome: "Ilhas Salomão", regiao: "oceania" },
    { id: "tait", nome: "Taiti", regiao: "oceania" },
    { id: "papuaNovaGuine", nome: "Papua-Nova Guiné", regiao: "oceania" },
    
    // ─── AMÉRICA DO NORTE / CENTRAL (cobertura ampliada) ───
    { id: "costaRica", nome: "Costa Rica", regiao: "americaNorte" },
    { id: "panama", nome: "Panamá", regiao: "americaNorte" },
    { id: "jamaica", nome: "Jamaica", regiao: "americaNorte" },
    { id: "honduras", nome: "Honduras", regiao: "americaNorte" },
    { id: "elSalvador", nome: "El Salvador", regiao: "americaNorte" },
    { id: "haiti", nome: "Haiti", regiao: "americaNorte" },
    { id: "guatemala", nome: "Guatemala", regiao: "americaNorte" },
    { id: "trinidadTobago", nome: "Trinidad e Tobago", regiao: "americaNorte" },
    
    // ─── AMÉRICA DO SUL (CONMEBOL completa) ───
    { id: "paraguai", nome: "Paraguai", regiao: "americaSul" },
    { id: "venezuela", nome: "Venezuela", regiao: "americaSul" },
    { id: "peru", nome: "Peru", regiao: "americaSul" },
    { id: "bolivia", nome: "Bolívia", regiao: "americaSul" },
];


const CLUBES = [
    // PREMIER LEAGUE
    { id: "manchester-city", nome: "Manchester City", liga: "Premier League" },
    { id: "arsenal", nome: "Arsenal", liga: "Premier League" },
    { id: "liverpool", nome: "Liverpool", liga: "Premier League" },
    { id: "chelsea", nome: "Chelsea", liga: "Premier League" },
    { id: "manchester-united", nome: "Manchester United", liga: "Premier League" },
    { id: "tottenham", nome: "Tottenham", liga: "Premier League" },
    { id: "newcastle", nome: "Newcastle United", liga: "Premier League" },
    { id: "aston-villa", nome: "Aston Villa", liga: "Premier League" },
    { id: "west-ham", nome: "West Ham", liga: "Premier League" },
    { id: "brighton", nome: "Brighton", liga: "Premier League" },
    { id: "everton", nome: "Everton", liga: "Premier League" },
    { id: "crystal-palace", nome: "Crystal Palace", liga: "Premier League" },
    { id: "fulham", nome: "Fulham", liga: "Premier League" },
    { id: "brentford", nome: "Brentford", liga: "Premier League" },
    { id: "wolves", nome: "Wolverhampton", liga: "Premier League" },
    { id: "nottingham-forest", nome: "Nottingham Forest", liga: "Premier League" },
    { id: "bournemouth", nome: "Bournemouth", liga: "Premier League" },
    { id: "leicester-city", nome: "Leicester City", liga: "Premier League" },
    { id: "ipswich-town", nome: "Ipswich Town", liga: "Premier League" },
    { id: "southampton", nome: "Southampton", liga: "Premier League" },

    // LA LIGA
    { id: "real-madrid", nome: "Real Madrid", liga: "La Liga" },
    { id: "barcelona", nome: "Barcelona", liga: "La Liga" },
    { id: "atletico-madrid", nome: "Atlético de Madrid", liga: "La Liga" },
    { id: "athletic-bilbao", nome: "Athletic Club", liga: "La Liga" },
    { id: "real-sociedad", nome: "Real Sociedad", liga: "La Liga" },
    { id: "girona", nome: "Girona", liga: "La Liga" },
    { id: "real-betis", nome: "Real Betis", liga: "La Liga" },
    { id: "villarreal", nome: "Villarreal", liga: "La Liga" },
    { id: "sevilla", nome: "Sevilla", liga: "La Liga" },
    { id: "valencia", nome: "Valencia", liga: "La Liga" },
    { id: "osasuna", nome: "Osasuna", liga: "La Liga" },
    { id: "celta-vigo", nome: "Celta de Vigo", liga: "La Liga" },
    { id: "getafe", nome: "Getafe", liga: "La Liga" },
    { id: "mallorca", nome: "Mallorca", liga: "La Liga" },
    { id: "alaves", nome: "Alavés", liga: "La Liga" },
    { id: "las-palmas", nome: "Las Palmas", liga: "La Liga" },
    { id: "rayo-vallecano", nome: "Rayo Vallecano", liga: "La Liga" },
    { id: "leganes", nome: "Leganés", liga: "La Liga" },
    { id: "espanyol", nome: "Espanyol", liga: "La Liga" },
    { id: "real-valladolid", nome: "Real Valladolid", liga: "La Liga" },

    // SERIE A
    { id: "inter", nome: "Inter de Milão", liga: "Serie A" },
    { id: "milan", nome: "Milan", liga: "Serie A" },
    { id: "juventus", nome: "Juventus", liga: "Serie A" },
    { id: "napoli", nome: "Napoli", liga: "Serie A" },
    { id: "roma", nome: "Roma", liga: "Serie A" },
    { id: "lazio", nome: "Lazio", liga: "Serie A" },
    { id: "atalanta", nome: "Atalanta", liga: "Serie A" },
    { id: "fiorentina", nome: "Fiorentina", liga: "Serie A" },
    { id: "bologna", nome: "Bologna", liga: "Serie A" },
    { id: "torino", nome: "Torino", liga: "Serie A" },
    { id: "udinese", nome: "Udinese", liga: "Serie A" },
    { id: "genoa", nome: "Genoa", liga: "Serie A" },
    { id: "monza", nome: "Monza", liga: "Serie A" },
    { id: "cagliari", nome: "Cagliari", liga: "Serie A" },
    { id: "lecce", nome: "Lecce", liga: "Serie A" },
    { id: "verona", nome: "Hellas Verona", liga: "Serie A" },
    { id: "parma", nome: "Parma", liga: "Serie A" },
    { id: "como", nome: "Como", liga: "Serie A" },
    { id: "venezia", nome: "Venezia", liga: "Serie A" },
    { id: "empoli", nome: "Empoli", liga: "Serie A" },

    // BUNDESLIGA
    { id: "bayern-munich", nome: "Bayern de Munique", liga: "Bundesliga" },
    { id: "borussia-dortmund", nome: "Borussia Dortmund", liga: "Bundesliga" },
    { id: "bayer-leverkusen", nome: "Bayer Leverkusen", liga: "Bundesliga" },
    { id: "rb-leipzig", nome: "RB Leipzig", liga: "Bundesliga" },
    { id: "stuttgart", nome: "Stuttgart", liga: "Bundesliga" },
    { id: "eintracht-frankfurt", nome: "Eintracht Frankfurt", liga: "Bundesliga" },
    { id: "wolfsburg", nome: "Wolfsburg", liga: "Bundesliga" },
    { id: "freiburg", nome: "Freiburg", liga: "Bundesliga" },
    { id: "hoffenheim", nome: "Hoffenheim", liga: "Bundesliga" },
    { id: "werder-bremen", nome: "Werder Bremen", liga: "Bundesliga" },
    { id: "augsburg", nome: "Augsburg", liga: "Bundesliga" },
    { id: "mainz", nome: "Mainz 05", liga: "Bundesliga" },
    { id: "borussia-monchengladbach", nome: "Borussia Mönchengladbach", liga: "Bundesliga" },
    { id: "union-berlin", nome: "Union Berlin", liga: "Bundesliga" },
    { id: "heidenheim", nome: "Heidenheim", liga: "Bundesliga" },
    { id: "bochum", nome: "Bochum", liga: "Bundesliga" },
    { id: "holstein-kiel", nome: "Holstein Kiel", liga: "Bundesliga" },
    { id: "st-pauli", nome: "St. Pauli", liga: "Bundesliga" },
    { id: "hamburger-sv", nome: "Hamburgo", liga: "Bundesliga" },
    { id: "schalke-04", nome: "Schalke 04", liga: "Bundesliga" },

    // LIGUE 1
    { id: "paris-saint-germain", nome: "Paris Saint-Germain", liga: "Ligue 1" },
    { id: "marseille", nome: "Marseille", liga: "Ligue 1" },
    { id: "monaco", nome: "Monaco", liga: "Ligue 1" },
    { id: "lille", nome: "Lille", liga: "Ligue 1" },
    { id: "lyon", nome: "Lyon", liga: "Ligue 1" },
    { id: "nice", nome: "Nice", liga: "Ligue 1" },
    { id: "lens", nome: "Lens", liga: "Ligue 1" },
    { id: "rennes", nome: "Rennes", liga: "Ligue 1" },
    { id: "strasbourg", nome: "Strasbourg", liga: "Ligue 1" },
    { id: "toulouse", nome: "Toulouse", liga: "Ligue 1" },
    { id: "nantes", nome: "Nantes", liga: "Ligue 1" },
    { id: "montpellier", nome: "Montpellier", liga: "Ligue 1" },
    { id: "reims", nome: "Reims", liga: "Ligue 1" },
    { id: "auxerre", nome: "Auxerre", liga: "Ligue 1" },
    { id: "angers", nome: "Angers", liga: "Ligue 1" },
    { id: "le-havre", nome: "Le Havre", liga: "Ligue 1" },
    { id: "saint-etienne", nome: "Saint-Étienne", liga: "Ligue 1" },
    { id: "bordeaux", nome: "Bordeaux", liga: "Ligue 1" },
    { id: "lorient", nome: "Lorient", liga: "Ligue 1" },
    { id: "metz", nome: "Metz", liga: "Ligue 1" },

    // BRASILEIRÃO SÉRIE A
    { id: "flamengo", nome: "Flamengo", liga: "Brasileirão" },
    { id: "palmeiras", nome: "Palmeiras", liga: "Brasileirão" },
    { id: "corinthians", nome: "Corinthians", liga: "Brasileirão" },
    { id: "sao-paulo", nome: "São Paulo", liga: "Brasileirão" },
    { id: "santos", nome: "Santos", liga: "Brasileirão" },
    { id: "gremio", nome: "Grêmio", liga: "Brasileirão" },
    { id: "internacional", nome: "Internacional", liga: "Brasileirão" },
    { id: "atletico-mg", nome: "Atlético Mineiro", liga: "Brasileirão" },
    { id: "cruzeiro", nome: "Cruzeiro", liga: "Brasileirão" },
    { id: "botafogo", nome: "Botafogo", liga: "Brasileirão" },
    { id: "vasco", nome: "Vasco da Gama", liga: "Brasileirão" },
    { id: "fluminense", nome: "Fluminense", liga: "Brasileirão" },
    { id: "bahia", nome: "Bahia", liga: "Brasileirão" },
    { id: "fortaleza", nome: "Fortaleza", liga: "Brasileirão" },
    { id: "ceara", nome: "Ceará", liga: "Brasileirão" },
    { id: "sport", nome: "Sport Recife", liga: "Brasileirão" },
    { id: "vitoria", nome: "Vitória", liga: "Brasileirão" },
    { id: "bragantino", nome: "Red Bull Bragantino", liga: "Brasileirão" },
    { id: "juventude", nome: "Juventude", liga: "Brasileirão" },
    { id: "mirassol", nome: "Mirassol", liga: "Brasileirão" },

    // ============================================================
// EUROPA — LIGAS ADICIONAIS
// ============================================================

// PRIMEIRA LIGA (PORTUGAL)
{ id: "benfica", nome: "Benfica", liga: "Primeira Liga" },
{ id: "porto", nome: "FC Porto", liga: "Primeira Liga" },
{ id: "sporting-cp", nome: "Sporting CP", liga: "Primeira Liga" },
{ id: "braga", nome: "Braga", liga: "Primeira Liga" },
{ id: "vitoria-guimaraes", nome: "Vitória de Guimarães", liga: "Primeira Liga" },
{ id: "famalicao", nome: "Famalicão", liga: "Primeira Liga" },
{ id: "moreirense", nome: "Moreirense", liga: "Primeira Liga" },
{ id: "arouca", nome: "Arouca", liga: "Primeira Liga" },
{ id: "gil-vicente", nome: "Gil Vicente", liga: "Primeira Liga" },
{ id: "estoril", nome: "Estoril", liga: "Primeira Liga" },
{ id: "rio-ave", nome: "Rio Ave", liga: "Primeira Liga" },
{ id: "casa-pia", nome: "Casa Pia", liga: "Primeira Liga" },
{ id: "boavista", nome: "Boavista", liga: "Primeira Liga" },
{ id: "estrela-amadora", nome: "Estrela da Amadora", liga: "Primeira Liga" },
{ id: "santa-clara", nome: "Santa Clara", liga: "Primeira Liga" },
{ id: "nacional-madeira", nome: "Nacional da Madeira", liga: "Primeira Liga" },
{ id: "avs", nome: "AVS", liga: "Primeira Liga" },
{ id: "farense", nome: "Farense", liga: "Primeira Liga" },

// EREDIVISIE (HOLANDA)
{ id: "ajax", nome: "Ajax", liga: "Eredivisie" },
{ id: "psv", nome: "PSV", liga: "Eredivisie" },
{ id: "feyenoord", nome: "Feyenoord", liga: "Eredivisie" },
{ id: "az-alkmaar", nome: "AZ Alkmaar", liga: "Eredivisie" },
{ id: "twente", nome: "Twente", liga: "Eredivisie" },
{ id: "utrecht", nome: "Utrecht", liga: "Eredivisie" },
{ id: "go-ahead-eagles", nome: "Go Ahead Eagles", liga: "Eredivisie" },
{ id: "sparta-rotterdam", nome: "Sparta Rotterdam", liga: "Eredivisie" },
{ id: "nec-nijmegen", nome: "NEC Nijmegen", liga: "Eredivisie" },
{ id: "heerenveen", nome: "Heerenveen", liga: "Eredivisie" },
{ id: "fortuna-sittard", nome: "Fortuna Sittard", liga: "Eredivisie" },
{ id: "groningen", nome: "Groningen", liga: "Eredivisie" },
{ id: "zwolle", nome: "Zwolle", liga: "Eredivisie" },
{ id: "heracles", nome: "Heracles", liga: "Eredivisie" },
{ id: "almere-city", nome: "Almere City", liga: "Eredivisie" },
{ id: "willem-ii", nome: "Willem II", liga: "Eredivisie" },
{ id: "rkc-waalwijk", nome: "RKC Waalwijk", liga: "Eredivisie" },
{ id: "nac-breda", nome: "NAC Breda", liga: "Eredivisie" },

// SÜPER LIG (TURQUIA)
{ id: "galatasaray", nome: "Galatasaray", liga: "Süper Lig" },
{ id: "fenerbahce", nome: "Fenerbahçe", liga: "Süper Lig" },
{ id: "besiktas", nome: "Beşiktaş", liga: "Süper Lig" },
{ id: "trabzonspor", nome: "Trabzonspor", liga: "Süper Lig" },
{ id: "basaksehir", nome: "Başakşehir", liga: "Süper Lig" },
{ id: "adana-demirspor", nome: "Adana Demirspor", liga: "Süper Lig" },
{ id: "antalyaspor", nome: "Antalyaspor", liga: "Süper Lig" },
{ id: "konyaspor", nome: "Konyaspor", liga: "Süper Lig" },
{ id: "alanyaspor", nome: "Alanyaspor", liga: "Süper Lig" },
{ id: "sivasspor", nome: "Sivasspor", liga: "Süper Lig" },
{ id: "kayserispor", nome: "Kayserispor", liga: "Süper Lig" },
{ id: "rizespor", nome: "Rizespor", liga: "Süper Lig" },
{ id: "gaziantep", nome: "Gaziantep", liga: "Süper Lig" },
{ id: "kasimpasa", nome: "Kasımpaşa", liga: "Süper Lig" },
{ id: "samsunspor", nome: "Samsunspor", liga: "Süper Lig" },
{ id: "hatayspor", nome: "Hatayspor", liga: "Süper Lig" },
{ id: "goztepe", nome: "Göztepe", liga: "Süper Lig" },
{ id: "bodrum", nome: "Bodrum", liga: "Süper Lig" },

// BELGIAN PRO LEAGUE (BÉLGICA)
{ id: "club-brugge", nome: "Club Brugge", liga: "Belgian Pro League" },
{ id: "anderlecht", nome: "Anderlecht", liga: "Belgian Pro League" },
{ id: "genk", nome: "Genk", liga: "Belgian Pro League" },
{ id: "gent", nome: "Gent", liga: "Belgian Pro League" },
{ id: "antwerp", nome: "Antwerp", liga: "Belgian Pro League" },
{ id: "union-saint-gilloise", nome: "Union Saint-Gilloise", liga: "Belgian Pro League" },
{ id: "standard-liege", nome: "Standard Liège", liga: "Belgian Pro League" },
{ id: "cercle-brugge", nome: "Cercle Brugge", liga: "Belgian Pro League" },
{ id: "mechelen", nome: "Mechelen", liga: "Belgian Pro League" },
{ id: "charleroi", nome: "Charleroi", liga: "Belgian Pro League" },
{ id: "leuven", nome: "OH Leuven", liga: "Belgian Pro League" },
{ id: "westerlo", nome: "Westerlo", liga: "Belgian Pro League" },
{ id: "sint-truiden", nome: "Sint-Truiden", liga: "Belgian Pro League" },
{ id: "kortrijk", nome: "Kortrijk", liga: "Belgian Pro League" },
{ id: "beerschot", nome: "Beerschot", liga: "Belgian Pro League" },
{ id: "dender", nome: "Dender", liga: "Belgian Pro League" },

// SCOTTISH PREMIERSHIP (ESCÓCIA)
{ id: "celtic", nome: "Celtic", liga: "Scottish Premiership" },
{ id: "rangers", nome: "Rangers", liga: "Scottish Premiership" },
{ id: "hearts", nome: "Hearts", liga: "Scottish Premiership" },
{ id: "hibernian", nome: "Hibernian", liga: "Scottish Premiership" },
{ id: "aberdeen", nome: "Aberdeen", liga: "Scottish Premiership" },
{ id: "dundee-united", nome: "Dundee United", liga: "Scottish Premiership" },
{ id: "motherwell", nome: "Motherwell", liga: "Scottish Premiership" },
{ id: "st-mirren", nome: "St Mirren", liga: "Scottish Premiership" },
{ id: "kilmarnock", nome: "Kilmarnock", liga: "Scottish Premiership" },
{ id: "dundee-fc", nome: "Dundee FC", liga: "Scottish Premiership" },
{ id: "ross-county", nome: "Ross County", liga: "Scottish Premiership" },
{ id: "st-johnstone", nome: "St Johnstone", liga: "Scottish Premiership" },

// SWISS SUPER LEAGUE (SUÍÇA)
{ id: "young-boys", nome: "Young Boys", liga: "Swiss Super League" },
{ id: "basel", nome: "Basel", liga: "Swiss Super League" },
{ id: "zurich", nome: "Zürich", liga: "Swiss Super League" },
{ id: "servette", nome: "Servette", liga: "Swiss Super League" },
{ id: "lugano", nome: "Lugano", liga: "Swiss Super League" },
{ id: "luzern", nome: "Luzern", liga: "Swiss Super League" },
{ id: "st-gallen", nome: "St. Gallen", liga: "Swiss Super League" },
{ id: "sion", nome: "Sion", liga: "Swiss Super League" },
{ id: "grasshopper", nome: "Grasshopper", liga: "Swiss Super League" },
{ id: "lausanne", nome: "Lausanne", liga: "Swiss Super League" },
{ id: "winterthur", nome: "Winterthur", liga: "Swiss Super League" },
{ id: "yverdon", nome: "Yverdon", liga: "Swiss Super League" },

// AUSTRIAN BUNDESLIGA (ÁUSTRIA)
{ id: "rb-salzburg", nome: "Red Bull Salzburg", liga: "Austrian Bundesliga" },
{ id: "sturm-graz", nome: "Sturm Graz", liga: "Austrian Bundesliga" },
{ id: "lask", nome: "LASK", liga: "Austrian Bundesliga" },
{ id: "rapid-wien", nome: "Rapid Wien", liga: "Austrian Bundesliga" },
{ id: "austria-wien", nome: "Austria Wien", liga: "Austrian Bundesliga" },
{ id: "wolfsberg", nome: "Wolfsberg", liga: "Austrian Bundesliga" },
{ id: "hartberg", nome: "Hartberg", liga: "Austrian Bundesliga" },
{ id: "blau-weiss-linz", nome: "Blau-Weiß Linz", liga: "Austrian Bundesliga" },
{ id: "altach", nome: "Altach", liga: "Austrian Bundesliga" },
{ id: "austria-klagenfurt", nome: "Austria Klagenfurt", liga: "Austrian Bundesliga" },
{ id: "wsg-tirol", nome: "WSG Tirol", liga: "Austrian Bundesliga" },
{ id: "grazer-ak", nome: "Grazer AK", liga: "Austrian Bundesliga" },

// RUSSIAN PREMIER LEAGUE (RÚSSIA)
{ id: "zenit", nome: "Zenit", liga: "Russian Premier League" },
{ id: "krasnodar", nome: "Krasnodar", liga: "Russian Premier League" },
{ id: "spartak-moscow", nome: "Spartak Moscow", liga: "Russian Premier League" },
{ id: "cska-moscow", nome: "CSKA Moscow", liga: "Russian Premier League" },
{ id: "dynamo-moscow", nome: "Dynamo Moscow", liga: "Russian Premier League" },
{ id: "lokomotiv-moscow", nome: "Lokomotiv Moscow", liga: "Russian Premier League" },
{ id: "rostov", nome: "Rostov", liga: "Russian Premier League" },
{ id: "rubin-kazan", nome: "Rubin Kazan", liga: "Russian Premier League" },
{ id: "krylia-sovetov", nome: "Krylia Sovetov", liga: "Russian Premier League" },
{ id: "akhmat", nome: "Akhmat", liga: "Russian Premier League" },
{ id: "fakel", nome: "Fakel", liga: "Russian Premier League" },
{ id: "orenburg", nome: "Orenburg", liga: "Russian Premier League" },
{ id: "pari-nn", nome: "Pari NN", liga: "Russian Premier League" },
{ id: "dynamo-makhachkala", nome: "Dynamo Makhachkala", liga: "Russian Premier League" },
{ id: "khimki", nome: "Khimki", liga: "Russian Premier League" },
{ id: "akron", nome: "Akron", liga: "Russian Premier League" },

// UKRAINIAN PREMIER LEAGUE (UCRÂNIA)
{ id: "shakhtar-donetsk", nome: "Shakhtar Donetsk", liga: "Ukrainian Premier League" },
{ id: "dynamo-kyiv", nome: "Dynamo Kyiv", liga: "Ukrainian Premier League" },
{ id: "zorya", nome: "Zorya", liga: "Ukrainian Premier League" },
{ id: "dnipro-1", nome: "Dnipro-1", liga: "Ukrainian Premier League" },
{ id: "polissya", nome: "Polissya", liga: "Ukrainian Premier League" },
{ id: "vorskla", nome: "Vorskla", liga: "Ukrainian Premier League" },
{ id: "kolos", nome: "Kolos", liga: "Ukrainian Premier League" },
{ id: "chornomorets", nome: "Chornomorets", liga: "Ukrainian Premier League" },
{ id: "oleksandriya", nome: "Oleksandriya", liga: "Ukrainian Premier League" },
{ id: "lnz", nome: "LNZ", liga: "Ukrainian Premier League" },
{ id: "veres", nome: "Veres", liga: "Ukrainian Premier League" },
{ id: "karpaty", nome: "Karpaty", liga: "Ukrainian Premier League" },
{ id: "livyi-bereh", nome: "Livyi Bereh", liga: "Ukrainian Premier League" },
{ id: "inhulets", nome: "Inhulets", liga: "Ukrainian Premier League" },
{ id: "obolon", nome: "Obolon", liga: "Ukrainian Premier League" },
{ id: "rukh", nome: "Rukh", liga: "Ukrainian Premier League" },

// GREEK SUPER LEAGUE (GRÉCIA)
{ id: "olympiacos", nome: "Olympiacos", liga: "Greek Super League" },
{ id: "paok", nome: "PAOK", liga: "Greek Super League" },
{ id: "aek-athens", nome: "AEK Athens", liga: "Greek Super League" },
{ id: "panathinaikos", nome: "Panathinaikos", liga: "Greek Super League" },
{ id: "aris", nome: "Aris", liga: "Greek Super League" },
{ id: "panserraikos", nome: "Panserraikos", liga: "Greek Super League" },
{ id: "lamia", nome: "Lamia", liga: "Greek Super League" },
{ id: "ofi", nome: "OFI", liga: "Greek Super League" },
{ id: "asteras-tripolis", nome: "Asteras Tripolis", liga: "Greek Super League" },
{ id: "atromitos", nome: "Atromitos", liga: "Greek Super League" },
{ id: "volos", nome: "Volos", liga: "Greek Super League" },
{ id: "panetolikos", nome: "Panetolikos", liga: "Greek Super League" },
{ id: "levadiakos", nome: "Levadiakos", liga: "Greek Super League" },
{ id: "kallithea", nome: "Kallithea", liga: "Greek Super League" },

// ============================================================
// AMÉRICA DO SUL
// ============================================================

// ARGENTINE PRIMERA DIVISIÓN (LIGA PROFESIONAL)
{ id: "river-plate", nome: "River Plate", liga: "Argentine Primera División" },
{ id: "boca-juniors", nome: "Boca Juniors", liga: "Argentine Primera División" },
{ id: "racing-club", nome: "Racing Club", liga: "Argentine Primera División" },
{ id: "independiente", nome: "Independiente", liga: "Argentine Primera División" },
{ id: "san-lorenzo", nome: "San Lorenzo", liga: "Argentine Primera División" },
{ id: "velez-sarsfield", nome: "Vélez Sarsfield", liga: "Argentine Primera División" },
{ id: "estudiantes", nome: "Estudiantes", liga: "Argentine Primera División" },
{ id: "talleres", nome: "Talleres", liga: "Argentine Primera División" },
{ id: "argentinos-juniors", nome: "Argentinos Juniors", liga: "Argentine Primera División" },
{ id: "lanus", nome: "Lanús", liga: "Argentine Primera División" },
{ id: "huracan", nome: "Huracán", liga: "Argentine Primera División" },
{ id: "defensa-y-justicia", nome: "Defensa y Justicia", liga: "Argentine Primera División" },
{ id: "rosario-central", nome: "Rosario Central", liga: "Argentine Primera División" },
{ id: "newells-old-boys", nome: "Newell's Old Boys", liga: "Argentine Primera División" },
{ id: "godoy-cruz", nome: "Godoy Cruz", liga: "Argentine Primera División" },
{ id: "banfield", nome: "Banfield", liga: "Argentine Primera División" },
{ id: "instituto", nome: "Instituto", liga: "Argentine Primera División" },
{ id: "barracas-central", nome: "Barracas Central", liga: "Argentine Primera División" },
{ id: "tigre", nome: "Tigre", liga: "Argentine Primera División" },
{ id: "platense", nome: "Platense", liga: "Argentine Primera División" },

// COLOMBIAN PRIMERA A (LIGA BETPLAY)
{ id: "atletico-nacional", nome: "Atlético Nacional", liga: "Colombian Primera A" },
{ id: "millonarios", nome: "Millonarios", liga: "Colombian Primera A" },
{ id: "america-cali", nome: "América de Cali", liga: "Colombian Primera A" },
{ id: "deportivo-cali", nome: "Deportivo Cali", liga: "Colombian Primera A" },
{ id: "junior", nome: "Junior", liga: "Colombian Primera A" },
{ id: "santa-fe", nome: "Santa Fe", liga: "Colombian Primera A" },
{ id: "independiente-medellin", nome: "Independiente Medellín", liga: "Colombian Primera A" },
{ id: "deportes-tolima", nome: "Deportes Tolima", liga: "Colombian Primera A" },
{ id: "once-caldas", nome: "Once Caldas", liga: "Colombian Primera A" },
{ id: "la-equidad", nome: "La Equidad", liga: "Colombian Primera A" },
{ id: "aguilas-doradas", nome: "Águilas Doradas", liga: "Colombian Primera A" },
{ id: "alianza", nome: "Alianza", liga: "Colombian Primera A" },
{ id: "bucaramanga", nome: "Bucaramanga", liga: "Colombian Primera A" },
{ id: "pereira", nome: "Pereira", liga: "Colombian Primera A" },
{ id: "envigado", nome: "Envigado", liga: "Colombian Primera A" },
{ id: "fortaleza-ceif", nome: "Fortaleza CEIF", liga: "Colombian Primera A" },
{ id: "jaguares", nome: "Jaguares", liga: "Colombian Primera A" },
{ id: "patriotas", nome: "Patriotas", liga: "Colombian Primera A" },
{ id: "boyaca-chico", nome: "Boyacá Chicó", liga: "Colombian Primera A" },
{ id: "pasto", nome: "Pasto", liga: "Colombian Primera A" },

// CHILEAN PRIMERA DIVISIÓN
{ id: "colo-colo", nome: "Colo-Colo", liga: "Chilean Primera División" },
{ id: "universidad-chile", nome: "Universidad de Chile", liga: "Chilean Primera División" },
{ id: "universidad-catolica", nome: "Universidad Católica", liga: "Chilean Primera División" },
{ id: "palestino", nome: "Palestino", liga: "Chilean Primera División" },
{ id: "huachipato", nome: "Huachipato", liga: "Chilean Primera División" },
{ id: "coquimbo-unido", nome: "Coquimbo Unido", liga: "Chilean Primera División" },
{ id: "everton-vina", nome: "Everton de Viña", liga: "Chilean Primera División" },
{ id: "nublense", nome: "Ñublense", liga: "Chilean Primera División" },
{ id: "ohiggins", nome: "O'Higgins", liga: "Chilean Primera División" },
{ id: "audax-italiano", nome: "Audax Italiano", liga: "Chilean Primera División" },
{ id: "union-la-calera", nome: "Unión La Calera", liga: "Chilean Primera División" },
{ id: "cobresal", nome: "Cobresal", liga: "Chilean Primera División" },
{ id: "deportes-iquique", nome: "Deportes Iquique", liga: "Chilean Primera División" },
{ id: "union-espanola", nome: "Unión Española", liga: "Chilean Primera División" },
{ id: "cobreloa", nome: "Cobreloa", liga: "Chilean Primera División" },
{ id: "deportes-copiapo", nome: "Deportes Copiapó", liga: "Chilean Primera División" },

// URUGUAYAN PRIMERA DIVISIÓN
{ id: "penarol", nome: "Peñarol", liga: "Uruguayan Primera División" },
{ id: "nacional-uruguai", nome: "Nacional", liga: "Uruguayan Primera División" },
{ id: "defensor-sporting", nome: "Defensor Sporting", liga: "Uruguayan Primera División" },
{ id: "liverpool-montevideo", nome: "Liverpool FC", liga: "Uruguayan Primera División" },
{ id: "montevideo-city", nome: "Montevideo City Torque", liga: "Uruguayan Primera División" },
{ id: "danubio", nome: "Danubio", liga: "Uruguayan Primera División" },
{ id: "boston-river", nome: "Boston River", liga: "Uruguayan Primera División" },
{ id: "progreso", nome: "Progreso", liga: "Uruguayan Primera División" },
{ id: "cerro-largo", nome: "Cerro Largo", liga: "Uruguayan Primera División" },
{ id: "plaza-colonia", nome: "Plaza Colonia", liga: "Uruguayan Primera División" },
{ id: "racing-montevideo", nome: "Racing Montevideo", liga: "Uruguayan Primera División" },
{ id: "river-plate-montevideo", nome: "River Plate Montevideo", liga: "Uruguayan Primera División" },
{ id: "deportivo-maldonado", nome: "Deportivo Maldonado", liga: "Uruguayan Primera División" },
{ id: "wanderers", nome: "Montevideo Wanderers", liga: "Uruguayan Primera División" },
{ id: "fenix", nome: "Fénix", liga: "Uruguayan Primera División" },
{ id: "rampla-juniors", nome: "Rampla Juniors", liga: "Uruguayan Primera División" },

// ECUADORIAN SERIE A (LIGAPRO)
{ id: "ldu-quito", nome: "LDU Quito", liga: "Ecuadorian Serie A" },
{ id: "barcelona-sc", nome: "Barcelona SC", liga: "Ecuadorian Serie A" },
{ id: "independiente-del-valle", nome: "Independiente del Valle", liga: "Ecuadorian Serie A" },
{ id: "emelec", nome: "Emelec", liga: "Ecuadorian Serie A" },
{ id: "el-nacional", nome: "El Nacional", liga: "Ecuadorian Serie A" },
{ id: "aucas", nome: "Aucas", liga: "Ecuadorian Serie A" },
{ id: "delfin", nome: "Delfín", liga: "Ecuadorian Serie A" },
{ id: "universidad-catolica-ecu", nome: "Universidad Católica del Ecuador", liga: "Ecuadorian Serie A" },
{ id: "orense", nome: "Orense", liga: "Ecuadorian Serie A" },
{ id: "macara", nome: "Macará", liga: "Ecuadorian Serie A" },
{ id: "deportivo-cuenca", nome: "Deportivo Cuenca", liga: "Ecuadorian Serie A" },
{ id: "libertad-ecu", nome: "Libertad", liga: "Ecuadorian Serie A" },
{ id: "cumbaya", nome: "Cumbayá", liga: "Ecuadorian Serie A" },
{ id: "imbabura", nome: "Imbabura", liga: "Ecuadorian Serie A" },
{ id: "mushuc-runa", nome: "Mushuc Runa", liga: "Ecuadorian Serie A" },
{ id: "tecnico-universitario", nome: "Técnico Universitario", liga: "Ecuadorian Serie A" },

// PARAGUAYAN PRIMERA DIVISIÓN
{ id: "cerro-porteno", nome: "Cerro Porteño", liga: "Paraguayan Primera División" },
{ id: "olimpia", nome: "Olimpia", liga: "Paraguayan Primera División" },
{ id: "libertad", nome: "Libertad", liga: "Paraguayan Primera División" },
{ id: "guarani", nome: "Guaraní", liga: "Paraguayan Primera División" },
{ id: "nacional-paraguai", nome: "Nacional", liga: "Paraguayan Primera División" },
{ id: "sportivo-luqueno", nome: "Sportivo Luqueño", liga: "Paraguayan Primera División" },
{ id: "trinidense", nome: "Trinidense", liga: "Paraguayan Primera División" },
{ id: "tacuary", nome: "Tacuary", liga: "Paraguayan Primera División" },
{ id: "general-caballero", nome: "General Caballero", liga: "Paraguayan Primera División" },
{ id: "ameliano", nome: "Ameliano", liga: "Paraguayan Primera División" },
{ id: "recoleta", nome: "Recoleta", liga: "Paraguayan Primera División" },
{ id: "2-de-mayo", nome: "2 de Mayo", liga: "Paraguayan Primera División" },

// ============================================================
// AMÉRICA DO NORTE E CENTRAL
// ============================================================

// MLS (ESTADOS UNIDOS / CANADÁ)
{ id: "inter-miami", nome: "Inter Miami", liga: "MLS" },
{ id: "lafc", nome: "LAFC", liga: "MLS" },
{ id: "la-galaxy", nome: "LA Galaxy", liga: "MLS" },
{ id: "seattle-sounders", nome: "Seattle Sounders", liga: "MLS" },
{ id: "atlanta-united", nome: "Atlanta United", liga: "MLS" },
{ id: "nycfc", nome: "New York City FC", liga: "MLS" },
{ id: "new-york-red-bulls", nome: "New York Red Bulls", liga: "MLS" },
{ id: "philadelphia-union", nome: "Philadelphia Union", liga: "MLS" },
{ id: "columbus-crew", nome: "Columbus Crew", liga: "MLS" },
{ id: "fc-cincinnati", nome: "FC Cincinnati", liga: "MLS" },
{ id: "orlando-city", nome: "Orlando City", liga: "MLS" },
{ id: "nashville-sc", nome: "Nashville SC", liga: "MLS" },
{ id: "austin-fc", nome: "Austin FC", liga: "MLS" },
{ id: "portland-timbers", nome: "Portland Timbers", liga: "MLS" },
{ id: "sporting-kc", nome: "Sporting KC", liga: "MLS" },
{ id: "minnesota-united", nome: "Minnesota United", liga: "MLS" },
    { id: "real-salt-lake", nome: "Real Salt Lake", liga: "MLS" },
    { id: "colorado-rapids", nome: "Colorado Rapids", liga: "MLS" },
    { id: "fc-dallas", nome: "FC Dallas", liga: "MLS" },
    { id: "toronto-fc", nome: "Toronto FC", liga: "MLS" },

    // LIGA MX (MÉXICO)
    { id: "club-america", nome: "América", liga: "Liga MX" },
    { id: "chivas", nome: "Guadalajara (Chivas)", liga: "Liga MX" },
    { id: "cruz-azul", nome: "Cruz Azul", liga: "Liga MX" },
    { id: "tigres", nome: "Tigres UANL", liga: "Liga MX" },
    { id: "monterrey", nome: "Monterrey", liga: "Liga MX" },
    { id: "pumas", nome: "Pumas UNAM", liga: "Liga MX" },
    { id: "toluca", nome: "Toluca", liga: "Liga MX" },
    { id: "leon", nome: "León", liga: "Liga MX" },
    { id: "pachuca", nome: "Pachuca", liga: "Liga MX" },
    { id: "santos-laguna", nome: "Santos Laguna", liga: "Liga MX" },
    { id: "atlas", nome: "Atlas", liga: "Liga MX" },
    { id: "necaxa", nome: "Necaxa", liga: "Liga MX" },
    { id: "queretaro", nome: "Querétaro", liga: "Liga MX" },
    { id: "puebla", nome: "Puebla", liga: "Liga MX" },
    { id: "mazatlan", nome: "Mazatlán", liga: "Liga MX" },
    { id: "tijuana", nome: "Tijuana", liga: "Liga MX" },
    { id: "juarez", nome: "Juárez", liga: "Liga MX" },
    { id: "atletico-san-luis", nome: "Atlético San Luis", liga: "Liga MX" },

    // ============================================================
    // ÁSIA
    // ============================================================

    // SAUDI PRO LEAGUE (ARÁBIA SAUDITA)
    { id: "al-hilal", nome: "Al-Hilal", liga: "Saudi Pro League" },
    { id: "al-nassr", nome: "Al-Nassr", liga: "Saudi Pro League" },
    { id: "al-ittihad", nome: "Al-Ittihad", liga: "Saudi Pro League" },
    { id: "al-ahli", nome: "Al-Ahli", liga: "Saudi Pro League" },
    { id: "al-shabab", nome: "Al-Shabab", liga: "Saudi Pro League" },
    { id: "al-ettifaq", nome: "Al-Ettifaq", liga: "Saudi Pro League" },
    { id: "al-taawoun", nome: "Al-Taawoun", liga: "Saudi Pro League" },
    { id: "al-fateh", nome: "Al-Fateh", liga: "Saudi Pro League" },
    { id: "al-fayha", nome: "Al-Fayha", liga: "Saudi Pro League" },
    { id: "al-riyadh", nome: "Al-Riyadh", liga: "Saudi Pro League" },
    { id: "al-khaleej", nome: "Al-Khaleej", liga: "Saudi Pro League" },
    { id: "al-wehda", nome: "Al-Wehda", liga: "Saudi Pro League" },
    { id: "damac", nome: "Damac", liga: "Saudi Pro League" },
    { id: "al-raed", nome: "Al-Raed", liga: "Saudi Pro League" },
    { id: "al-okhdood", nome: "Al-Okhdood", liga: "Saudi Pro League" },
    { id: "al-qadsiah", nome: "Al-Qadsiah", liga: "Saudi Pro League" },
    { id: "al-orobah", nome: "Al-Orobah", liga: "Saudi Pro League" },
    { id: "al-kholood", nome: "Al-Kholood", liga: "Saudi Pro League" },

    // J1 LEAGUE (JAPÃO)
    { id: "kashima-antlers", nome: "Kashima Antlers", liga: "J1 League" },
    { id: "yokohama-marinos", nome: "Yokohama F. Marinos", liga: "J1 League" },
    { id: "kawasaki-frontale", nome: "Kawasaki Frontale", liga: "J1 League" },
    { id: "vissel-kobe", nome: "Vissel Kobe", liga: "J1 League" },
    { id: "urawa-reds", nome: "Urawa Red Diamonds", liga: "J1 League" },
    { id: "sanfrecce-hiroshima", nome: "Sanfrecce Hiroshima", liga: "J1 League" },
    { id: "cerezo-osaka", nome: "Cerezo Osaka", liga: "J1 League" },
    { id: "nagoya-grampus", nome: "Nagoya Grampus", liga: "J1 League" },
    { id: "fc-tokyo", nome: "FC Tokyo", liga: "J1 League" },
    { id: "gamba-osaka", nome: "Gamba Osaka", liga: "J1 League" },
    { id: "avispa-fukuoka", nome: "Avispa Fukuoka", liga: "J1 League" },
    { id: "tokyo-verdy", nome: "Tokyo Verdy", liga: "J1 League" },
    { id: "machida-zelvia", nome: "Machida Zelvia", liga: "J1 League" },
    { id: "kyoto-sanga", nome: "Kyoto Sanga", liga: "J1 League" },
    { id: "shonan-bellmare", nome: "Shonan Bellmare", liga: "J1 League" },
    { id: "albirex-niigata", nome: "Albirex Niigata", liga: "J1 League" },
    { id: "jubilo-iwata", nome: "Júbilo Iwata", liga: "J1 League" },
    { id: "consadole-sapporo", nome: "Consadole Sapporo", liga: "J1 League" },

    // K LEAGUE 1 (COREIA DO SUL)
    { id: "ulsan-hd", nome: "Ulsan HD", liga: "K League 1" },
    { id: "jeonbuk-hyundai", nome: "Jeonbuk Hyundai", liga: "K League 1" },
    { id: "pohang-steelers", nome: "Pohang Steelers", liga: "K League 1" },
    { id: "fc-seoul", nome: "FC Seoul", liga: "K League 1" },
    { id: "gangwon", nome: "Gangwon", liga: "K League 1" },
    { id: "incheon-united", nome: "Incheon United", liga: "K League 1" },
    { id: "daegu", nome: "Daegu", liga: "K League 1" },
    { id: "jeju-united", nome: "Jeju United", liga: "K League 1" },
    { id: "suwon-fc", nome: "Suwon FC", liga: "K League 1" },
    { id: "gwangju", nome: "Gwangju", liga: "K League 1" },
    { id: "daejeon-hana", nome: "Daejeon Hana", liga: "K League 1" },
    { id: "gimcheon-sangmu", nome: "Gimcheon Sangmu", liga: "K League 1" },

    // CHINESE SUPER LEAGUE (CHINA)
    { id: "shanghai-port", nome: "Shanghai Port", liga: "Chinese Super League" },
    { id: "shanghai-shenhua", nome: "Shanghai Shenhua", liga: "Chinese Super League" },
    { id: "shandong-taishan", nome: "Shandong Taishan", liga: "Chinese Super League" },
    { id: "beijing-guoan", nome: "Beijing Guoan", liga: "Chinese Super League" },
    { id: "chengdu-rongcheng", nome: "Chengdu Rongcheng", liga: "Chinese Super League" },
    { id: "zhejiang-fc", nome: "Zhejiang FC", liga: "Chinese Super League" },
    { id: "tianjin-jinmen", nome: "Tianjin Jinmen Tiger", liga: "Chinese Super League" },
    { id: "henan", nome: "Henan", liga: "Chinese Super League" },
    { id: "wuhan-three-towns", nome: "Wuhan Three Towns", liga: "Chinese Super League" },
    { id: "changchun-yatai", nome: "Changchun Yatai", liga: "Chinese Super League" },
    { id: "qingdao-west-coast", nome: "Qingdao West Coast", liga: "Chinese Super League" },
    { id: "meizhou-hakka", nome: "Meizhou Hakka", liga: "Chinese Super League" },
    { id: "shenzhen-peng-city", nome: "Shenzhen Peng City", liga: "Chinese Super League" },
    { id: "cangzhou-mighty-lions", nome: "Cangzhou Mighty Lions", liga: "Chinese Super League" },
    { id: "nantong-zhiyun", nome: "Nantong Zhiyun", liga: "Chinese Super League" },
    { id: "qingdao-hainiu", nome: "Qingdao Hainiu", liga: "Chinese Super League" },

    // ============================================================
    // ÁFRICA
    // ============================================================

    // EGYPTIAN PREMIER LEAGUE (EGITO)
    { id: "al-ahly", nome: "Al Ahly", liga: "Egyptian Premier League" },
    { id: "zamalek", nome: "Zamalek", liga: "Egyptian Premier League" },
    { id: "pyramids-fc", nome: "Pyramids FC", liga: "Egyptian Premier League" },
    { id: "ismaily", nome: "Ismaily", liga: "Egyptian Premier League" },
    { id: "al-masry", nome: "Al Masry", liga: "Egyptian Premier League" },
    { id: "enppi", nome: "ENPPI", liga: "Egyptian Premier League" },
    { id: "ceramica-cleopatra", nome: "Ceramica Cleopatra", liga: "Egyptian Premier League" },
    { id: "modern-future", nome: "Modern Future", liga: "Egyptian Premier League" },
    { id: "smouha", nome: "Smouha", liga: "Egyptian Premier League" },
    { id: "el-gouna", nome: "El Gouna", liga: "Egyptian Premier League" },
    { id: "national-bank-egypt", nome: "National Bank of Egypt", liga: "Egyptian Premier League" },
    { id: "pharco", nome: "Pharco", liga: "Egyptian Premier League" },
    { id: "ittihad-alexandria", nome: "Al Ittihad Alexandria", liga: "Egyptian Premier League" },
    { id: "baladiyat-mahalla", nome: "Baladiyat El Mahalla", liga: "Egyptian Premier League" },
    { id: "zed-fc", nome: "ZED FC", liga: "Egyptian Premier League" },
    { id: "petrojet", nome: "Petrojet", liga: "Egyptian Premier League" },
    { id: "ghazl-mahalla", nome: "Ghazl El Mahalla", liga: "Egyptian Premier League" },
    { id: "modern-sport", nome: "Modern Sport", liga: "Egyptian Premier League" },

    // SOUTH AFRICAN PREMIER DIVISION (ÁFRICA DO SUL)
    { id: "mamelodi-sundowns", nome: "Mamelodi Sundowns", liga: "South African Premier Division" },
    { id: "orlando-pirates", nome: "Orlando Pirates", liga: "South African Premier Division" },
    { id: "kaizer-chiefs", nome: "Kaizer Chiefs", liga: "South African Premier Division" },
    { id: "stellenbosch", nome: "Stellenbosch", liga: "South African Premier Division" },
    { id: "supersport-united", nome: "SuperSport United", liga: "South African Premier Division" },
    { id: "sekhukhune-united", nome: "Sekhukhune United", liga: "South African Premier Division" },
    { id: "amazulu", nome: "AmaZulu", liga: "South African Premier Division" },
    { id: "golden-arrows", nome: "Golden Arrows", liga: "South African Premier Division" },
    { id: "cape-town-city", nome: "Cape Town City", liga: "South African Premier Division" },
    { id: "chippa-united", nome: "Chippa United", liga: "South African Premier Division" },
    { id: "polokwane-city", nome: "Polokwane City", liga: "South African Premier Division" },
    { id: "richards-bay", nome: "Richards Bay", liga: "South African Premier Division" },
    { id: "moroka-swallows", nome: "Moroka Swallows", liga: "South African Premier Division" },
    { id: "royal-am", nome: "Royal AM", liga: "South African Premier Division" },
    { id: "ts-galaxy", nome: "TS Galaxy", liga: "South African Premier Division" },
    { id: "magesi", nome: "Magesi", liga: "South African Premier Division" },

    // MOROCCAN BOTOLA PRO (MARROCOS)
    { id: "wydad-casablanca", nome: "Wydad Casablanca", liga: "Moroccan Botola" },
    { id: "raja-casablanca", nome: "Raja Casablanca", liga: "Moroccan Botola" },
    { id: "as-far", nome: "AS FAR", liga: "Moroccan Botola" },
    { id: "renaissance-berkane", nome: "Renaissance Berkane", liga: "Moroccan Botola" },
    { id: "fus-rabat", nome: "FUS Rabat", liga: "Moroccan Botola" },
    { id: "maghreb-fes", nome: "Maghreb de Fès", liga: "Moroccan Botola" },
    { id: "hassania-agadir", nome: "Hassania Agadir", liga: "Moroccan Botola" },
    { id: "moghreb-tetouan", nome: "Moghreb Tétouan", liga: "Moroccan Botola" },
    { id: "olympic-safi", nome: "Olympic Safi", liga: "Moroccan Botola" },
    { id: "chabab-mohammedia", nome: "Chabab Mohammédia", liga: "Moroccan Botola" },
    { id: "ittihad-tanger", nome: "Ittihad Tanger", liga: "Moroccan Botola" },
    { id: "difaa-el-jadidi", nome: "Difaâ El Jadidi", liga: "Moroccan Botola" },
    { id: "js-soualem", nome: "JS Soualem", liga: "Moroccan Botola" },
    { id: "union-touarga", nome: "Union Touarga", liga: "Moroccan Botola" },
    { id: "cr-khemis-zemamra", nome: "CR Khemis Zemamra", liga: "Moroccan Botola" },
    { id: "cod-meknes", nome: "COD Meknès", liga: "Moroccan Botola" },

    // ============================================================
    // OCEANIA
    // ============================================================

    // AUSTRALIAN A-LEAGUE (AUSTRÁLIA / NOVA ZELÂNDIA)
    { id: "melbourne-city", nome: "Melbourne City", liga: "Australian A-League" },
    { id: "melbourne-victory", nome: "Melbourne Victory", liga: "Australian A-League" },
    { id: "sydney-fc", nome: "Sydney FC", liga: "Australian A-League" },
    { id: "western-sydney", nome: "Western Sydney Wanderers", liga: "Australian A-League" },
    { id: "central-coast-mariners", nome: "Central Coast Mariners", liga: "Australian A-League" },
    { id: "adelaide-united", nome: "Adelaide United", liga: "Australian A-League" },
    { id: "brisbane-roar", nome: "Brisbane Roar", liga: "Australian A-League" },
    { id: "wellington-phoenix", nome: "Wellington Phoenix", liga: "Australian A-League" },
    { id: "perth-glory", nome: "Perth Glory", liga: "Australian A-League" },
    { id: "macarthur-fc", nome: "Macarthur FC", liga: "Australian A-League" },
    { id: "western-united", nome: "Western United", liga: "Australian A-League" },
    { id: "newcastle-jets", nome: "Newcastle Jets", liga: "Australian A-League" },
    { id: "auckland-fc", nome: "Auckland FC", liga: "Australian A-League" }

];

/*
 * Forças padrão em faixas equivalentes entre ligas: os clubes na mesma posição
 * relativa da lista de cada liga começam com a mesma força aproximada.
 */
const FORCAS_CLUBES_PADRAO = (() => {
    const faixas = [96, 94, 92, 89, 87, 85, 83, 81, 79, 77, 75, 73, 71, 69, 67, 65, 63, 61, 59, 57];
    const contagemPorLiga = {};
    return CLUBES.reduce((resultado, clube) => {
        const indice = contagemPorLiga[clube.liga] || 0;
        contagemPorLiga[clube.liga] = indice + 1;
        resultado[clube.id] = faixas[Math.min(indice, faixas.length - 1)];
        return resultado;
    }, {});
})();

/* Lesoes */



/* ---------- Configurações padrão ---------- */
const CONFIG_PADRAO = {
    geral: {
        anoInicial: 2026,
        idadeInicialPadrao: 18,
        idadeLimitePadrao: 40,
        limiteRompimentosContrato: 3,
        chanceNaoRenovacaoInicial: 0.08,
        multiplicadorJogos: 1,
        multiplicadorGols: 1,
        multiplicadorAssistencias: 1,
        multiplicadorTitulos: 1,
        multiplicadorPremios: 1,
        idadeAposentadoriaSelecao: 32
    },
    titulos: {
        chanceLigaNacional: 0.28,
        chanceCopaNacional: 0.22,
        chanceCopaContinental: 0.18,
        chanceCopaDoMundo: 0.12,
        chanceIntercontinental: 0.35,
        chanceMundialClubes: 0.20,
        chanceBolaDeOuro: 0.25,
        chanceBolaDeOuroZagueiro: 0.20,
        chanceBolaDeOuroGoleiro: 0.20,
        chanceGoldenBoy: 0.18,
        chanceChuteiraDeOuro: 0.50,
        chanceLuvaDeOuro: 0.30,
        anoInicioMundialClubes: 2029,
        cicloCopaDoMundo: 4,

      // ===== Competições secundárias =====
        chanceEuropaLeague: 0.20,
        chanceConferenceLeague: 0.18,
        chanceSulAmericana: 0.16,
        chanceSupercopaNacional: 0.28,
        chanceSupercopaContinental: 0.30,
        chanceMundialSub20: 0.14,
        chanceMundialSub17: 0.10,
        chanceEstadual: 0.40,
        
        // ===== Novos prêmios =====
        chancePuskas: 0.04,
        chanceEquipeDoAno: 0.22,
        chanceMelhorJogadorCompeticao: 0.15,
        chanceArtilheiroCompeticao: 0.24,
        chanceMelhorJovemCompeticao: 0.20,
        chanceMVPClube: 0.24,
        chanceReiDaAmerica: 0.15
    },

    lesoes: {
        multiplicador: 1.0,      // escala global (0 = sem lesões)
        chanceLeve: 0.012,       // 1,2% por jogo
        chanceModerada: 0.0015,  // 0,15% por jogo
        chanceGrave: 0.0003,     // 0,03% por jogo
        chanceCarreira: 0.00003, // 0,003% por jogo
        fatorJovem: 0.8,         // ≤24 anos
        fatorVeterano: 1.3,      // 29–32 anos
        fatorIdoso: 1.8          // 33+ anos
    },

    cartoes: {
        chanceAmareloBase: 0.08,             // base por jogo
        chanceVermelhoBase: 0.004,           // base por jogo (vermelho direto)
        chanceDoisAmarelosMesmoJogo: 0.02,   // se já levou amarelo, chance do 2º amarelo no mesmo jogo
        limiteAmarelosSuspensao: 5,          // amarelos acumulados até 1 jogo de suspensão
        fatorAtacante: 0.35,
        fatorMeia: 0.9,
        fatorZagueiro: 1.2,
        fatorGoleiro: 0.15
    },
  
    selecao: {
        potencias: {
            // Escala de força baseada na classificação FIFA masculina de 7/10/2026.
            // A posição no ranking é convertida em uma escala de jogo de 1 a 100.
            espanha: 100,
            argentina: 99,
            franca: 98,
            inglaterra: 97,
            portugal: 96,
            brasil: 95,
            marrocos: 94,
            belgica: 93,
            holanda: 92,
            mexico: 91,
            colombia: 90,
            suica: 89,
            alemanha: 88,
            croacia: 87,
            italia: 86,
            estadosUnidos: 85,
            japao: 84,
            senegal: 83,
            noruega: 82,
            uruguai: 81,
            dinamarca: 80,
            austria: 79,
            equador: 76,
            ira: 75,
            australia: 74,
            coreiaDoSul: 72,
            canada: 66,
            egito: 61,
            chile: 58,
            africaDoSul: 53,
            arabiaSaudita: 48,
            novaZelandia: 18,
            // ─── AFRICA ───
            nigeria: 64,
            argelia: 60,
            costaDoMarfim: 60,
            tunisia: 57,
            camaroes: 56,
            gana: 53,
            mali: 51,
            burkinaFaso: 49,
            rdCongo: 46,
            caboVerde: 44,
            guine: 43,
            zambia: 38,
            
            // ─── ASIA ───
            catar: 53,
            uzbequistao: 50,
            emiradosArabes: 48,
            iraque: 46,
            jordania: 45,
            china: 41,
            coreiaDoNorte: 40,
            oma: 38,
            tailandia: 37,
            siria: 35,
            
            // ─── OCEANIA ───
            fiji: 21,
            novaCaledonia: 20,
            ilhasSalomao: 19,
            tait: 19,
            papuaNovaGuine: 18,
            
            // ─── AMÉRICA DO NORTE / CENTRAL ───
            costaRica: 59,
            panama: 56,
            jamaica: 48,
            honduras: 43,
            elSalvador: 41,
            haiti: 40,
            guatemala: 39,
            trinidadTobago: 37,
            
            // ─── AMÉRICA DO SUL ───
            paraguai: 56,
            venezuela: 49,
            peru: 47,
            bolivia: 41
        }
    },
    clubes: {
        potencias: { ...FORCAS_CLUBES_PADRAO }
    }
  
};

/* ---------- Presets prontos ---------- */
const PRESETS_CONFIG = {
    padrao: {},
    arcade: {
        geral: { multiplicadorJogos: 1.2, multiplicadorGols: 1.6, multiplicadorAssistencias: 1.5, multiplicadorTitulos: 1.4, multiplicadorPremios: 1.5 },
        titulos: { chanceLigaNacional: 0.40, chanceCopaContinental: 0.30, chanceBolaDeOuro: 0.40 }, lesoes: { multiplicador: 0.4 }
    },
    realista: {
        geral: { multiplicadorTitulos: 0.7, multiplicadorPremios: 0.75 },
        titulos: { chanceLigaNacional: 0.18, chanceCopaContinental: 0.10, chanceBolaDeOuro: 0.15 }, lesoes: { multiplicador: 1.0 }
    },
    hardcore: {
        geral: { multiplicadorJogos: 0.9, multiplicadorGols: 0.7, multiplicadorAssistencias: 0.8, multiplicadorTitulos: 0.4, multiplicadorPremios: 0.5 },
        titulos: { chanceLigaNacional: 0.10, chanceCopaNacional: 0.08, chanceCopaContinental: 0.05, chanceCopaDoMundo: 0.03, chanceBolaDeOuro: 0.08 },
        lesoes: { multiplicador: 2.0, chanceCarreira: 0.00008}
    },
    lendario: {
        geral: { multiplicadorJogos: 1.3, multiplicadorGols: 2.0, multiplicadorAssistencias: 1.8, multiplicadorTitulos: 1.8, multiplicadorPremios: 2.0 },
        titulos: { chanceLigaNacional: 0.55, chanceCopaContinental: 0.45, chanceCopaDoMundo: 0.30, chanceBolaDeOuro: 0.55 }, lesoes: { multiplicador: 0.3 }
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
        const config = raw ? mesclarConfig(CONFIG_PADRAO, JSON.parse(raw)) : clonarConfig(CONFIG_PADRAO);
        const limiteRompimentos = Number(config.geral.limiteRompimentosContrato);
        config.geral.limiteRompimentosContrato = Number.isFinite(limiteRompimentos)
            ? Math.max(0, Math.min(10, Math.floor(limiteRompimentos)))
            : CONFIG_PADRAO.geral.limiteRompimentosContrato;

        // Sanitize lesões
        if (!config.lesoes || typeof config.lesoes !== "object") {
            config.lesoes = clonarConfig(CONFIG_PADRAO.lesoes);
        }
        Object.keys(CONFIG_PADRAO.lesoes).forEach((chave) => {
            const valor = Number(config.lesoes[chave]);
            config.lesoes[chave] = Number.isFinite(valor) && valor >= 0
                ? valor
                : CONFIG_PADRAO.lesoes[chave];
        });

        // Sanitize cartões
        if (!config.cartoes || typeof config.cartoes !== "object") {
            config.cartoes = clonarConfig(CONFIG_PADRAO.cartoes);
        }
        Object.keys(CONFIG_PADRAO.cartoes).forEach((chave) => {
            const valor = Number(config.cartoes[chave]);
            config.cartoes[chave] = Number.isFinite(valor) && valor >= 0
                ? valor
                : CONFIG_PADRAO.cartoes[chave];
        });
      
        // Sanitize cartões (continuação)
        config.cartoes.limiteAmarelosSuspensao = Math.max(1, Math.min(20,
            Math.floor(Number(config.cartoes.limiteAmarelosSuspensao) || 5)
        ));
        config.cartoes.chanceDoisAmarelosMesmoJogo = Math.max(0, Math.min(1,
            Number(config.cartoes.chanceDoisAmarelosMesmoJogo) || 0
        ));


        return config;
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