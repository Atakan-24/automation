---
description: Aktiviert explizit alle 32 Claude Code Best Practices – normalerweise automatisch via CLAUDE.md aktiv
---

# You – 32 Best Practices Checkliste

Dieser Skill ist normalerweise **automatisch aktiv** (via CLAUDE.md).
Nutze ihn explizit wenn du den Workflow auffrischen willst.

## Phase 1: Fundament
- [ ] Plan-Modus: Erst Logik, dann Code
- [ ] Claude als Junior-Dev behandeln: Problem übergeben, Lösung einfordern
- [ ] Statuszeile beobachten (Kontext-Verbrauch)
- [ ] CLAUDE.md aktuell halten (150–200 Zeilen)

## Phase 2: Workflow
- [ ] Skills für wiederkehrende SOPs nutzen
- [ ] Jeden Schritt verifizieren bevor weiter
- [ ] Bei falschem Weg: sofort stoppen, nicht weitermachen
- [ ] Externe Docs verlinken, nicht in CLAUDE.md einbetten

## Phase 3: Skalierung
- [ ] Sub-Agenten für komplexe Probleme
- [ ] Haiku für einfache Recherche, Opus für Steuerung
- [ ] Git Worktrees für parallele Features: `./scripts/worktree-new.sh <branch>`
- [ ] Multi-Agenten kommunizieren lassen

## Phase 4: Autonomie
- [ ] Permissions explizit konfiguriert (kein --dangerously-skip)
- [ ] /loop für wiederkehrende Aufgaben nutzen
- [ ] Für Architektur: `ultrathink` aktivieren

## Phase 5: Kontext & Wissen
- [ ] context7 MCP für aktuelle Docs nutzen (automatisch verfügbar)
- [ ] Token-Bloat identifizieren und bereinigen
- [ ] `ultrathink` für Grundsatzentscheidungen
