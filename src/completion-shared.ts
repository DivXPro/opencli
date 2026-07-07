/**
 * Shared constants and shell script generators for tab-completion.
 *
 * This module MUST remain lightweight (no registry, no discovery imports).
 * Both completion.ts (full path) and completion-fast.ts (manifest path) import from here.
 */

/**
 * Built-in (non-dynamic) top-level commands.
 */
export const BUILTIN_COMMANDS = [
  'list',
  'validate',
  'verify',
  'auth',
  'browser',
  'tab',
  'doctor',
  'plugin',
  'external',
  'completion',
];

// ── Shell script generators ────────────────────────────────────────────────

export function bashCompletionScript(): string {
  return `# Bash completion for toycli
# Add to ~/.bashrc:  eval "$(toycli completion bash)"
_toycli_completions() {
  local cur words cword
  _get_comp_words_by_ref -n : cur words cword

  local completions
  completions=$(toycli --get-completions --cursor "$cword" "\${words[@]:1}" 2>/dev/null)

  COMPREPLY=( $(compgen -W "$completions" -- "$cur") )
  __ltrim_colon_completions "$cur"
}
complete -F _toycli_completions toycli
`;
}

export function zshCompletionScript(): string {
  return `# Zsh completion for toycli
# Add to ~/.zshrc:  eval "$(toycli completion zsh)"
_toycli() {
  local -a completions
  local cword=$((CURRENT - 1))
  completions=(\${(f)"$(toycli --get-completions --cursor "$cword" "\${words[@]:1}" 2>/dev/null)"})
  compadd -a completions
}
compdef _toycli toycli
`;
}

export function fishCompletionScript(): string {
  return `# Fish completion for toycli
# Add to ~/.config/fish/config.fish:  toycli completion fish | source
complete -c toycli -f -a '(
  set -l tokens (commandline -cop)
  set -l cursor (count (commandline -cop))
  toycli --get-completions --cursor $cursor $tokens[2..] 2>/dev/null
)'
`;
}
