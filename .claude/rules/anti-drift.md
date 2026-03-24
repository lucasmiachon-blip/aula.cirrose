# Anti-Drift Protocol

> Previne o agente de gastar a sessao em loops internos que nao produzem artefato.
> Drift = o agente girando em circulos, nao o usuario pedindo algo.

---

## Definicao de Drift

Drift = o AGENTE fazendo trabalho circular sem producao concreta.

Exemplos de drift (agente):
- Reescrever o mesmo trecho 3+ vezes sem melhora mensuravel
- Pesquisar recursivamente sem convergir em resposta
- Criar abstracoes, protocolos ou frameworks "para o futuro"
- Otimizar ferramentas que ja funcionam sem pedido do usuario
- Gerar docs sobre docs sobre docs

**NAO e drift:**
- O usuario pedir inventario, auditoria, limpeza de repo, diagnostico
- O usuario pedir trabalho de infra, docs, ou qualquer coisa que NAO seja slide
- Sessao inteira sem tocar em slides — se o usuario decidiu, esta decidido

---

## Regra Central

**O usuario decide o que e prioritario. O agente executa.**

- NUNCA bloquear, pausar ou redirecionar o usuario para outro trabalho
- NUNCA dizer "caminho critico e X, quer voltar?"
- NUNCA classificar o pedido do usuario como "drift"
- Se o agente perceber que ELE MESMO esta em loop → parar e perguntar ao usuario

---

## Auto-diagnostico (agente apenas)

O agente DEVE monitorar a si mesmo:

1. **3+ edits no mesmo trecho sem progresso** → parar, explicar o bloqueio, perguntar
2. **Pesquisa recursiva sem convergencia** → entregar o que tem, admitir lacuna
3. **Gerando meta-trabalho** (docs sobre docs, rules sobre rules) → parar

Formato:
```
"Estou preso em [X]. Opcoes: [A] ou [B]. O que prefere?"
```

---

## Inicio de sessao

1. `git log --oneline -5 && git status`
2. Ler HANDOFF.md
3. Resumir estado em 3 linhas
4. Perguntar: "O que quer fazer?"

Sem proposta de caminho critico. Sem contraponto. O usuario sabe o que quer.

---

## Final de sessao

1. Atualizar HANDOFF.md com estado real
2. Se houve decisoes → registrar em NOTES.md
