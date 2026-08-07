#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DESIGN_SYSTEM="$PROJECT_ROOT/DESIGN_SYSTEM.md"
DESIGN_CONTEXT="$PROJECT_ROOT/DESIGN_CONTEXT.md"

if [[ ! -f "$DESIGN_SYSTEM" || ! -f "$DESIGN_CONTEXT" ]]; then
  echo "SignalDesk design documentation is incomplete." >&2
  exit 1
fi

topic_sections() {
  case "$1" in
    core) echo "2 3 4 5 6 7" ;;
    landing) echo "5 8 9 10.1 10.2 10.3 10.4 11.1 11.3 12 13 14 15.1 15.2 16 22.1 24 25 27.2 29 31" ;;
    dashboard) echo "5 9 10.1 10.2 10.5 11.1 11.2 12 13 14 16.1 16.2 16.4 17 19.1 19.2 19.6 19.7 19.8 19.9 19.10 19.11 19.12 19.13 19.15 19.16 20 21 22.4 23 24 29" ;;
    feed) echo "5 9 10.1 10.5 11.1 11.2 12 13 14 17 19.1 19.2 19.3 19.6 19.7 19.8 19.9 19.10 19.15 19.16 20 22.5 23 24 29" ;;
    detail) echo "5 9 10.1 10.5 11.1 11.2 12 13 14 16.1 16.2 16.4 17 19.1 19.2 19.3 19.4 19.5 19.6 19.7 19.8 19.9 19.14 19.15 19.16 20 22.6 23 24 29" ;;
    forms) echo "5 9 10.1 10.5 11.1 11.2 12 13 14 16.1 16.2 16.4 17 19.1 19.2 19.3 19.4 19.5 19.6 19.7 19.8 19.14 19.16 20 23 24 25 29" ;;
    auth) echo "5 7 8 9 10.1 10.2 10.5 11.1 11.3 12 13 14 15.1 15.3 16.1 16.2 16.4 17 19.1 19.2 19.3 19.4 19.5 19.14 19.15 19.16 20 22.2 22.3 23 24 25 29" ;;
    public-form) echo "5 7 8 9 10.1 10.2 10.5 11.1 11.3 12 13 14 15.1 15.3 16.1 16.2 16.4 17 19.1 19.2 19.3 19.4 19.5 19.14 19.15 19.16 20 22.9 23 24 25 29" ;;
    settings) echo "5 7 9 10.1 10.5 11.1 11.2 12 13 14 17 19.1 19.2 19.3 19.4 19.5 19.14 19.15 19.16 20 22.8 22.10 23 24 25 29" ;;
    components) echo "9 10 12 13 14 16 17 18 19 20 24 28 30 31 32" ;;
    motion) echo "3.2 5 15 16 17.2 20.1 20.4 24.4 27 31" ;;
    charts) echo "5 9 10.1 10.5 11.1 11.2 12 16.1 16.2 16.4 17 19.7 19.8 19.9 20 21 23 24 29" ;;
    responsive) echo "10.1 10.4 10.5 11 12 13 17.2 19.1 19.2 19.9 19.10 19.11 19.14 23 24 29 30" ;;
    copy) echo "4 6 7 20.2 20.3 20.4 25 31" ;;
    assets) echo "4 6 8 9 10.1 10.2 14 15 16.1 16.3 16.4 22.1 24 27 31" ;;
    review) echo "3 5 17 20 23 24 27 29 30 31 32 33" ;;
    *) return 1 ;;
  esac
}

usage() {
  echo "Usage: ./scripts/design-context.sh <topic> [topic ...]"
  echo "Topics: core landing dashboard feed detail forms auth public-form settings components motion charts responsive copy assets review"
}

extract_section() {
  local section="$1"

  if [[ "$section" == *.* ]]; then
    awk -v section="$section" '
      BEGIN { printing = 0 }
      $0 ~ "^### " section " " { printing = 1 }
      printing && ($0 ~ "^## " || ($0 ~ "^### [0-9]+\\.[0-9]+ " && $0 !~ "^### " section " ")) { exit }
      printing { print }
    ' "$DESIGN_SYSTEM"
  else
    awk -v section="$section" '
      BEGIN { printing = 0 }
      $0 ~ "^## " section "\\. " { printing = 1 }
      printing && $0 ~ "^## [0-9]+\\. " && $0 !~ "^## " section "\\. " { exit }
      printing { print }
    ' "$DESIGN_SYSTEM"
  fi
}

if [[ $# -eq 0 ]]; then
  usage >&2
  exit 1
fi

sections=""

for topic in "$@"; do
  if ! topic_values="$(topic_sections "$topic")"; then
    echo "Unknown design topic: $topic" >&2
    usage >&2
    exit 1
  fi

  sections="$sections $topic_values"
done

echo "# Mandatory SignalDesk design context"
echo
cat "$DESIGN_CONTEXT"
echo
echo "# Detailed sections for: $*"

seen=" "
all_sections=" $sections "

for section in $sections; do
  if [[ "$section" == *.* ]]; then
    parent="${section%%.*}"
    if [[ "$all_sections" == *" $parent "* ]]; then
      continue
    fi
  fi

  if [[ "$seen" == *" $section "* ]]; then
    continue
  fi

  seen="$seen$section "
  echo
  extract_section "$section"
done
