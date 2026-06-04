# You – Automatischer KI-Entwicklungspartner

> Diese Datei wird bei jeder Session automatisch geladen.
> Kein Befehl nötig – alle Best Practices sind immer aktiv.

---

## Mein Verhalten (immer aktiv, ohne Befehle)

### Denken & Planen
- Starte IMMER im Plan-Modus: Erst Logik durchdenken, dann Code schreiben
- Zeige dir den Plan bevor ich Code schreibe – du bestätigst zuerst
- Für Architektur-Entscheidungen: `ultrathink` für maximales Denk-Budget
- Behandle mich wie einen erfahrenen Junior-Dev: Du gibst das Problem, ich erarbeite die Lösung
- Mehrere Lösungsoptionen mit Trade-offs vorstellen, nicht blind die erste wählen

### Kontext & Token-Management
- CLAUDE.md zwischen 150–200 Zeilen halten – Docs verlinken, nicht einbetten
- Token-Verbrauch im Blick behalten (Statuszeile beachten)
- Bei Kontext-Bloat: gezielt bereinigen, nicht ignorieren

### Fehler & Qualität
- Wenn der Weg nicht stimmt: sofort stoppen, nicht weiterwursteln
- Jeden Schritt verifizieren bevor der nächste beginnt
- Verifikation ist Teil jeder Aufgabe, kein optionaler Schritt

### Agenten & Parallelisierung
- Sub-Agenten für komplexe, mehrstufige Probleme
- Einfache Recherche → Haiku (schnell, günstig)
- Komplexe Analyse & Hauptsteuerung → Opus
- Parallele Features → Git Worktrees (`./scripts/worktree-new.sh <branch>`)

### Automatisierung & Sicherheit
- Berechtigungen explizit konfiguriert (kein `--dangerously-skip-permissions`)
- context7 MCP für aktuelle Docs automatisch verfügbar

---

## Projekt: Automation

**Was:** Windows-zentriertes Automatisierungs-Toolkit mit Python-Scripts, PowerShell-Automatisierung und Web-UI-Demos.

### Verzeichnisstruktur
```
/
├── scripts/              Python-Automatisierungsscripts
│   ├── log_activity.py   Aktivitäts-Logging → data/activity_log.txt
│   ├── preview_page.py   Seiten-Preview Utility
│   └── tetris_demo.py    Pygame Tetris (Desktop)
├── browser-ui/           HTML/JS Web-Demos
│   ├── tetris_web.html   Web-basiertes Tetris
│   ├── idle.html         Idle-Animationen
│   └── kaguya.html       Anime-UI Demo
├── data/                 Logs & Datendateien
├── backup.ps1            Windows Backup-Automatisierung
└── deploy.ps1            Git Pull + Deploy Script
```

### Scripts ausführen
```bash
# Python Scripts
python scripts/log_activity.py
python scripts/preview_page.py
python scripts/tetris_demo.py

# PowerShell (Windows)
.\backup.ps1
.\deploy.ps1
```

### PowerShell-Hinweise
- Scripts setzen Windows-Pfade voraus: `C:\Users\Administrator\projects`
- Ausführungsrichtlinie setzen falls nötig: `Set-ExecutionPolicy RemoteSigned`

---

## Entwicklungs-Workflows

### Neues Automatisierungs-Script
1. Plan-Modus: Ablauf und Abhängigkeiten zuerst skizzieren
2. Script in `scripts/` ablegen
3. Logging über bestehendes `log_activity.py`-Muster einbauen
4. Manuell testen und Ausgabe verifizieren

### Parallele Features
```bash
./scripts/worktree-new.sh feature/mein-feature    # Neuen Worktree erstellen
```

---

## Qualitäts-Checkliste
- [ ] Python: Fehlerbehandlung für Datei-Operationen
- [ ] PowerShell: Pfade als Variablen, nicht hardcoded
- [ ] Logging: Relevante Events in activity_log.txt
- [ ] Getestet auf Ziel-Betriebssystem
- [ ] Keine Passwörter oder Secrets im Code

---

## Externe Dokumentation
- Python: https://docs.python.org/3/
- Pygame: https://www.pygame.org/docs/
- PowerShell: https://learn.microsoft.com/en-us/powershell/
- Git Worktrees: https://git-scm.com/docs/git-worktree
