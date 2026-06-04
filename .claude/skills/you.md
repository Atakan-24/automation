---
description: Aktiviert explizit alle Claude Code Best Practices – normalerweise automatisch via CLAUDE.md aktiv
---

# You – Best Practices Checkliste

Dieser Skill ist normalerweise **automatisch aktiv** (via CLAUDE.md).
Nutze ihn explizit wenn du den Workflow auffrischen willst.

## Phase 1: Fundament
- [ ] Plan-Modus: Erst Logik, dann Code
- [ ] Claude als Junior-Dev behandeln: Problem übergeben, Lösung einfordern
- [ ] Statuszeile beobachten (Kontext-Verbrauch)
- [ ] CLAUDE.md aktuell halten (150–200 Zeilen)

## Phase 2: Token-Sparsamkeit (oberste Priorität)
- [ ] KEINE Sub-Agenten – direkt und in einem Schritt arbeiten
- [ ] Effort Level: Extra High statt Max verwenden
- [ ] Ein Chat-Fenster pro Aufgabe – nach Abschluss schließen (Cmd+C), neues Fenster für nächste Aufgabe
- [ ] Externe Docs verlinken, nicht in CLAUDE.md einbetten
- [ ] `ultrathink` NUR bei wiederholtem Scheitern, nicht präventiv

## Phase 3: Workflow & Qualität
- [ ] Jeden Schritt verifizieren bevor weiter
- [ ] Bei falschem Weg: sofort stoppen, nicht weitermachen
- [ ] Skills für wiederkehrende SOPs nutzen
- [ ] Git Worktrees für parallele Features: `./scripts/worktree-new.sh <branch>`

## Phase 4: Autonomie
- [ ] Permissions explizit konfiguriert (kein --dangerously-skip)
- [ ] /loop für wiederkehrende Aufgaben nutzen

## Phase 5: Kontext & Wissen
- [ ] context7 MCP für aktuelle Docs nutzen (automatisch verfügbar)
- [ ] Token-Bloat identifizieren und bereinigen
