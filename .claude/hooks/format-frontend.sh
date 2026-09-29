#!/usr/bin/env bash
# PostToolUse hook: formatea con Prettier los archivos editados dentro de frontend/.
file=$(jq -r '.tool_input.file_path // empty')
root="$CLAUDE_PROJECT_DIR/frontend"

[[ -n "$file" && "$file" == "$root/"* && -f "$file" ]] || exit 0

cd "$root" && npx --no-install prettier --write --ignore-unknown --log-level warn "$file" >&2 || true
