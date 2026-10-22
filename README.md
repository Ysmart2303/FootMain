# FootMain

<div align="center">

**Simulador de carreira de futebol no navegador**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.17.0-16a34a?style=for-the-badge)

*Crie seu jogador, escolha uma posição no 4-3-3, suba de overall e construa uma lenda.*

</div>

---

📖 Sobre o projeto

FootMain é um simulador de carreira de futebol feito 100% em HTML, CSS e JavaScript puro, sem frameworks nem dependências externas. Você cria um jogador, escolhe sua posição em um campo interativo 4-3-3, define nacionalidade e clube-alvo, e então acompanha a evolução da carreira temporada após temporada — ou simula tudo de uma vez.

Todos os dados ficam salvos no localStorage do navegador, então suas carreiras, histórico, ranking e configurações persistem entre sessões.

---

✨ Funcionalidades

🎮 Simulação de carreira

· Posições interativas — 11 posições clicáveis no campo (GOL, ZCE, ZCD, LE, LD, ME, MC, MD, PE, CA, PD).
· Sistema de atributos — Finalização, Passe, Drible, Velocidade, Defesa, Físico e Reflexos evoluem com a idade.
· Potencial único por jogador — Cada carreira tem seu próprio teto de evolução (de comum a gênio).
· Engine por overall — Simulação jogo a jogo com distribuição de Poisson para gols e assistências.
· Curva de carreira realista — Evolução na juventude, pico aos 25-29, declínio físico após os 33.
· Eventos sazonais — Lesões e suspensões reduzem jogos; hat-tricks e passes decisivos adicionam gols e assistências, com registro no histórico.
· Simulação completa — Gere temporada por temporada ou simule a carreira inteira de uma vez.

💼 Contratos e transferências

· Ofertas de contrato com duração limitada pela idade limite.
· Clube-alvo com maiores chances de aparecer nos sorteios.
· Sistema de rompimento de contrato (limite configurável, padrão: 3).
· Janela de transferências entre temporadas.

🏆 Títulos e conquistas

· Títulos coletivos: Liga Nacional, Copa Nacional, Copa Continental, Copa do Mundo, Intercontinental, Mundial de Clubes, entre outros.
· Títulos individuais: Bola de Ouro, Golden Boy, Chuteira de Ouro, Luva de Ouro.
· 40 conquistas desbloqueáveis divididas em 8 categorias, incluindo hat-tricks e Over.
· Recordes históricos de gols, assistências, títulos, hat-tricks e Over.

📊 Progressão e rankings

· Histórico completo de temporadas com filtros (gols, assistências, prêmios).
· Ranking das 5 melhores carreiras com filtros por posição e seleção.
· Listas de opções dos filtros exibidas em janelas visuais com busca para listas extensas.
· Exibição do total de hat-tricks feitos por cada jogador no ranking.
· Detalhes completos da trajetória (temporada a temporada) de cada carreira.
· Pontuação calculada com pesos para gols, assistências, prêmios e títulos.

⚙️ Configurações avançadas

· Página dedicada de configurações com presets prontos: Padrão, Realista, Arcade, Lendário e Hardcore.
· Ajuste de multiplicadores (jogos, gols, assistências, títulos).
· Chance de cada título conquistado.
· Força de cada seleção e de cada clube (filtrável por liga).
· Modo avançado com JSON para importar/exportar configurações.

🎨 Interface

· Tema claro e escuro com persistência.
· Design responsivo para celular, tablet e desktop.
· Menu lateral acessível com navegação por teclado.
· Modais acessíveis (ARIA) para confirmações e escolhas.

---

🚀 Como usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/Ysmart2303/FootMain.git
   ```
2. Abra o arquivo index.html no seu navegador.

Não é necessário instalar nada, usar npm ou rodar um servidor. Basta abrir o arquivo. 😉

🕹️ Primeiros passos

1. Digite seu nome e idade inicial.
2. Defina a idade limite (até quando sua carreira vai).
3. Escolha sua nacionalidade e, opcionalmente, um clube-alvo.
4. Clique em uma das 11 posições no campo.
5. Clique em "Gerar temporada" ou "Simular carreira completa".
6. Acompanhe sua evolução e veja sua carreira entrar no Ranking! 🏅

---

🗂️ Estrutura do projeto

```
FootMain/
├── index.html              # Página principal do jogo
├── configuracoes.html      # Página de configurações
├── README.md
├── css/
│   └── style.css           # Estilos globais, temas e responsividade
└── js/
    ├── config.js           # Configurações, seleções, clubes e presets
    ├── configuracoes.js    # Renderização da página de configurações
    ├── script.js           # Lógica principal do jogo
    └── theme-menu.js       # Tema e menu lateral
```

---

🧠 Como funciona a simulação

O motor do jogo calcula cada temporada em três etapas principais:

1️⃣ Evolução dos atributos

Cada atributo evolui conforme a idade, com curva mais acentuada na juventude e queda a partir dos 34 anos. O potencial do jogador (derivado do seu ID de carreira) define o teto de cada atributo — nenhum jogador ultrapassa seu próprio limite.

2️⃣ Overall

O overall é uma média ponderada dos atributos, com pesos diferentes por posição:

Posição Peso principal
Atacante Finalização (35%), Drible (22%), Velocidade (18%)
Meio-campo Passe (35%), Drible (25%), Finalização (15%)
Zagueiro Defesa (45%), Físico (30%), Passe (15%)
Goleiro Reflexos (50%), Físico (20%), Defesa (20%)

3️⃣ Simulação jogo a jogo

Para cada jogo da temporada:

· Uma probabilidade de participação é calculada (baseada no overall + fator idade).
· Se o jogador entra em campo, os gols e assistências são sorteados por distribuição de Poisson, cujo λ (média esperada) depende dos atributos ofensivos e da posição.
· Eventos também podem ocorrer: lesões e cartões vermelhos afastam o jogador de jogos seguintes; hat-tricks adicionam 3 gols e passes decisivos adicionam 2 assistências. Os eventos são salvos e exibidos no histórico da temporada.

4️⃣ Títulos

As chances de títulos coletivos e individuais seguem probabilidades configuráveis, com bônus baseado na força do clube e na força da seleção do jogador.

---

🛠️ Tecnologias

· HTML5 — Estrutura semântica e acessível.
· CSS3 — Grid, Flexbox, variáveis, :has(), temas claro/escuro.
· JavaScript (ES6+) — Async/await, promises, localStorage, modularização por arquivo.
· Web APIs — localStorage, crypto.randomUUID, navigator.clipboard, Intl.NumberFormat (via toLocaleString).

Zero dependências externas. Nenhum framework, nenhuma biblioteca, nenhum build step.

---

🎯 Filosofia do projeto

· Simples de rodar: apenas abra o HTML.
· Simples de manter: código em arquivos separados com responsabilidades claras.
· Extensível: configurações externas permitem experimentar diferentes "realidades" sem tocar no código.
· Acessível: navegação por teclado, ARIA, contraste adequado.

---

🤝 Contribuindo

Contribuições são sempre bem-vindas! Se você encontrou um bug, tem uma ideia ou quer melhorar algo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```
3. Faça suas mudanças e commit:
   ```bash
   git commit -m "Adiciona minha feature"
   ```
4. Faça push para sua branch:
   ```bash
   git push origin feature/minha-feature
   ```
5. Abra um Pull Request. 🚀

---

👥 Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Ysmart2303">
        <b>@Ysmart2303</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ismaelfreitas210909-dotcom">
        <b>@Haydex11</b>
      </a>
    </td>
  </tr>
</table>

---

📄 Licença

Este projeto é de código aberto para fins educacionais e de portfólio. Sinta-se livre para estudar, usar e modificar.

---

<div align="center">

⚽ Feito com paixão por futebol e código ⚽

"O futebol é o esporte mais popular do mundo — e agora você pode simular uma carreira inteira no navegador."

</div>
