# Instruções para agentes de IA

Leia o arquivo [CLAUDE.md](CLAUDE.md) antes de qualquer alteração. Ele tem as regras do projeto.

Resumo das regras que mais importam:
- O jogo é **deitado** (palco 800×450) e a tela dele é **esticada para preencher a tela inteira**, sem espaços nas laterais (`fit()` em `jogo/js/sistemas/utils.js` com `scale(sx, sy)`; não use escala uniforme).
- O botão **JOGAR** abre o jogo em um iframe de tela cheia; o botão **VOLTAR** remove o iframe. A barra do VOLTAR deve ser pequena.
- Teste em computador, celular em pé e celular deitado antes de enviar.
