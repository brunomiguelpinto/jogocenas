# KAEL FTUE (First Time User Experience)

Protótipo de interface narrativa para o jogo KAEL, focado no fluxo inicial (boot, awaken e ecrã principal do comboio).

## Stack

- HTML
- CSS
- JavaScript vanilla (sem framework)

## Estrutura do projeto

```text
jogo/
├── index.html
└── assets/
    ├── styles/
    │   └── main.css
    └── js/
        ├── utils.js
        ├── data.js
        ├── state.js
        ├── dialogue.js
        ├── ui.js
        ├── flow.js
        └── main.js
```

## Responsabilidade de cada módulo

- `assets/js/utils.js`: funções utilitárias (timers, animações SVG, neve).
- `assets/js/data.js`: configuração estática (upgrades, requisitos, textos).
- `assets/js/state.js`: estado do jogo e regras (energia, speed, upgrade logic).
- `assets/js/dialogue.js`: fila de diálogos e interação de mensagens.
- `assets/js/ui.js`: renderização e bindings de interface.
- `assets/js/flow.js`: fluxo FTUE (boot, awaken, intro) e lógica de primeira visita.
- `assets/js/main.js`: inicialização da aplicação.

## Como correr localmente

Opção simples:

1. Abrir `index.html` no browser.

Opção recomendada (servidor local):

```bash
cd /Users/brunomiguelpinto/Desktop/jogo
python3 -m http.server 8080
```

Depois abrir: `http://localhost:8080/index.html`

## Comportamento do loading/boot

- O ecrã de loading/boot aparece apenas na primeira execução.
- O estado é guardado no `localStorage` com a chave:
  - `kael_ftue_seen_v1`

Para testar novamente o FTUE desde o início:

```js
localStorage.removeItem('kael_ftue_seen_v1');
```

## Como expandir

Para adicionar funcionalidades novas sem quebrar o core:

1. Adicionar dados/config em `data.js`.
2. Implementar regras em `state.js`.
3. Ligar render e interação em `ui.js`.
4. Integrar no fluxo em `flow.js` (se fizer parte da narrativa/FTUE).

Este padrão mantém o projeto modular e fácil de escalar.
