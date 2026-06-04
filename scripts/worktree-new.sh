#!/bin/bash
# Git Worktree Helper – parallele Feature-Entwicklung
# Usage: ./scripts/worktree-new.sh <branch-name> [directory-name]

BRANCH=$1
DIRNAME=${2:-$1}

if [ -z "$BRANCH" ]; then
  echo "Usage: ./scripts/worktree-new.sh <branch-name> [directory-name]"
  echo ""
  echo "Beispiel:"
  echo "  ./scripts/worktree-new.sh feature/neues-script"
  echo "  ./scripts/worktree-new.sh feature/backup-v2 ../automation-backup"
  exit 1
fi

TARGET="../${DIRNAME}"

if [ -d "$TARGET" ]; then
  echo "Verzeichnis $TARGET existiert bereits."
  exit 1
fi

git worktree add "$TARGET" -b "$BRANCH"
echo ""
echo "Worktree erstellt:"
echo "  Branch:      $BRANCH"
echo "  Verzeichnis: $TARGET"
echo ""
echo "Jetzt wechseln mit: cd $TARGET"
echo "Claude Code dort starten mit: claude"
