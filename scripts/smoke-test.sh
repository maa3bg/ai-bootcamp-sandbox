#!/usr/bin/env bash
# smoke-test.sh - Verifies that your machine is ready for the AI Bootcamp.
#
# Usage:
#   bash scripts/smoke-test.sh
#
# Optional environment variables:
#   MIN_NODE_MAJOR        Minimum Node.js major version   (default: 20)
#   SMOKE_TEST_ENDPOINT   URL for the network/proxy check (default: https://api.github.com)
#   SMOKE_TEST_TIMEOUT    Network timeout in seconds      (default: 10)
#   NO_COLOR              Set to any value to disable colored output

set -u

MIN_NODE_MAJOR="${MIN_NODE_MAJOR:-20}"
ENDPOINT="${SMOKE_TEST_ENDPOINT:-https://api.github.com}"
TIMEOUT="${SMOKE_TEST_TIMEOUT:-10}"

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  RED=$'\033[0;31m'
  GREEN=$'\033[0;32m'
  YELLOW=$'\033[0;33m'
  BLUE=$'\033[0;34m'
  BOLD=$'\033[1m'
  RESET=$'\033[0m'
else
  RED='' GREEN='' YELLOW='' BLUE='' BOLD='' RESET=''
fi

FAILURES=0

pass() { printf '%s[PASS]%s %s\n' "$GREEN" "$RESET" "$1"; }
warn() { printf '%s[WARN]%s %s\n' "$YELLOW" "$RESET" "$1"; }
hint() { printf '       %s\n' "$1"; }
fail() {
  printf '%s[FAIL]%s %s\n' "$RED" "$RESET" "$1"
  FAILURES=$((FAILURES + 1))
}
section() { printf '\n%s%s%s\n' "$BLUE$BOLD" "$1" "$RESET"; }

printf '%s=========================================%s\n' "$BOLD" "$RESET"
printf '%s  AI Bootcamp - Environment Smoke Test%s\n' "$BOLD" "$RESET"
printf '%s=========================================%s\n' "$BOLD" "$RESET"

# 1. Node.js >= v20
section "1. Node.js (v${MIN_NODE_MAJOR}+ required)"
if command -v node >/dev/null 2>&1; then
  NODE_VERSION="$(node -v)"
  NODE_MAJOR="${NODE_VERSION#v}"
  NODE_MAJOR="${NODE_MAJOR%%.*}"
  if [[ "$NODE_MAJOR" =~ ^[0-9]+$ ]] && [ "$NODE_MAJOR" -ge "$MIN_NODE_MAJOR" ]; then
    pass "Node.js ${NODE_VERSION}"
  else
    fail "Node.js ${NODE_VERSION} found, but v${MIN_NODE_MAJOR} or newer is required."
    hint "Install the current LTS release from https://nodejs.org"
  fi
else
  fail "Node.js is not installed."
  hint "Install the current LTS release (v${MIN_NODE_MAJOR}+) from https://nodejs.org"
fi

# 2. Git
section "2. Git"
if command -v git >/dev/null 2>&1; then
  pass "$(git --version)"
else
  fail "Git is not installed."
  hint "Install it from https://git-scm.com/downloads"
fi

# 3. GitHub CLI
section "3. GitHub CLI (gh)"
if command -v gh >/dev/null 2>&1; then
  pass "$(gh --version | head -n 1)"
  if ! gh auth status >/dev/null 2>&1; then
    warn "gh is installed but not authenticated. Run 'gh auth login' before Module 2."
  fi
else
  fail "GitHub CLI ('gh') is not installed. It is needed for the ticket-to-PR pipeline in Module 2."
  hint "Install it from https://cli.github.com"
fi

# 4. Network / proxy connectivity
section "4. Network connectivity (${ENDPOINT})"
PROXY_IN_USE="${HTTPS_PROXY:-${https_proxy:-}}"
if [ -n "$PROXY_IN_USE" ]; then
  printf '       Using proxy from HTTPS_PROXY: %s\n' "$PROXY_IN_USE"
fi
if command -v curl >/dev/null 2>&1; then
  HTTP_CODE="$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout "$TIMEOUT" --max-time "$TIMEOUT" "$ENDPOINT")"
  CURL_EXIT=$?
  if [ "$CURL_EXIT" -eq 0 ] && [ "$HTTP_CODE" != "000" ]; then
    pass "Reached ${ENDPOINT} (HTTP ${HTTP_CODE})"
  else
    fail "Could not reach ${ENDPOINT} (curl exit code ${CURL_EXIT})."
    hint "If you are behind a corporate proxy, set HTTPS_PROXY (and HTTP_PROXY), or connect to the VPN."
  fi
else
  fail "curl is not installed, so connectivity cannot be checked."
  hint "Install curl, or run this script from Git Bash on Windows."
fi

# Summary
printf '\n%s=========================================%s\n' "$BOLD" "$RESET"
if [ "$FAILURES" -eq 0 ]; then
  printf '%s%s[ALL GREEN]%s System verification passed. You are ready for the bootcamp!\n' "$GREEN" "$BOLD" "$RESET"
  printf '%s=========================================%s\n' "$BOLD" "$RESET"
  exit 0
fi

printf '%s%s[NOT READY]%s %d check(s) failed. Fix the items above and run this script again.\n' \
  "$RED" "$BOLD" "$RESET" "$FAILURES"
printf '%s=========================================%s\n' "$BOLD" "$RESET"
exit 1
