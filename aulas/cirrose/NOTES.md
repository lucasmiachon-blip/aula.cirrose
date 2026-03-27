# NOTES — Cirrose

> Decisoes de design e observacoes inter-agente que NAO cabem em CHANGELOG (o que mudou),
> ERROR-LOG (erros + regras), ou HANDOFF (estado atual).
> Sessoes pre-20/mar removidas (rationalization audit 26/mar). Historico: `git log`.

---

## Decisoes de design travadas pelo usuario

### s-a1-classify (R3-R10, 21/mar)
- **Blur state 2:** opacity 0.5 + blur 2px. Gemini propôs remover — REJEITADO.
- **Sidebar verde PREDESCI:** `writing-mode: vertical-lr`, bg `oklch(30% 0.10 170)`. Gemini propôs remover — REJEITADO.
- **Cards inset box-shadow:** `inset 4px 0 0 0 var(--safe/warning/danger)`. Gemini propôs pseudo-element — revertido (perdia efeito).
- **MorphSVG ✕→L-arrow:** Aprovado. Gemini chamou de "gimmick" — mantido.

### s-a1-fib4 (23/mar)
- Quiz interativo removido. Refatorado para hero FIB-4 5,91 + cutoff + burnt-out. Archetype poll→hero-stat.

---

## Observacoes operacionais

- **Playwright MCP nao navega deck.js (E56).** ArrowRight, hash, scrollIntoView, CustomEvent — nenhum funciona. Workaround: script Node standalone.
- **Agent drift:** Agente tende a ler MDs em vez de inspecionar CSS/JS real. `validate-css.sh` mitiga.
- **Env:** PERPLEXITY_API_KEY ausente. SCITE = OAuth (sem API key).
