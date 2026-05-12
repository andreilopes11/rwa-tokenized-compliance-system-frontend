#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/.local-runtime"
ENV_TEMPLATE="$ROOT_DIR/.env.example"
ENV_FILE="$ROOT_DIR/.env.local"
ANVIL_PID_FILE="$RUNTIME_DIR/anvil.pid"
ANVIL_LOG_FILE="$RUNTIME_DIR/anvil.log"
DEPLOY_LOG_FILE="$RUNTIME_DIR/deploy.log"

DEFAULT_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
ZERO_ADDRESS="0x0000000000000000000000000000000000000000"

log() {
  printf '[bootstrap] %s\n' "$*"
}

fail() {
  printf '[bootstrap] ERROR: %s\n' "$*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

to_absolute_path() {
  local target="$1"

  if [[ "$target" = /* ]]; then
    printf '%s\n' "$target"
    return 0
  fi

  printf '%s\n' "$ROOT_DIR/$target"
}

load_env_file() {
  if [ -f "$ENV_FILE" ]; then
    set -a
    # shellcheck disable=SC1090
    . "$ENV_FILE"
    set +a
  fi
}

ensure_runtime_dir() {
  mkdir -p "$RUNTIME_DIR"
}

ensure_env_file() {
  if [ ! -f "$ENV_FILE" ]; then
    cp "$ENV_TEMPLATE" "$ENV_FILE"
    log "Created .env.local from .env.example"
  fi
}

require_node_version() {
  local node_major
  node_major="$(node -p 'process.versions.node.split(".")[0]')"
  if [ "$node_major" -lt 20 ]; then
    fail "Node.js 20+ is required. Current version: $(node -v)"
  fi
}

next_cli_path() {
  printf '%s\n' "$ROOT_DIR/node_modules/next/dist/bin/next"
}

ensure_frontend_dependencies() {
  if [ -x "$ROOT_DIR/node_modules/.bin/next" ] && [ -x "$ROOT_DIR/node_modules/.bin/tsc" ]; then
    log "Frontend dependencies already installed"
    return
  fi

  log "Installing frontend dependencies"
  if [ -f "$ROOT_DIR/package-lock.json" ]; then
    (cd "$ROOT_DIR" && npm ci --legacy-peer-deps)
  else
    (cd "$ROOT_DIR" && npm install --legacy-peer-deps)
  fi
}

discover_contracts_workspace() {
  local candidate
  local parent_dir
  parent_dir="$(cd "$ROOT_DIR/.." && pwd)"

  for candidate in \
    "${CONTRACTS_WORKSPACE:-}" \
    "$ROOT_DIR/blockchain/evm" \
    "$ROOT_DIR/contracts" \
    "$ROOT_DIR/foundry" \
    "$parent_dir/rwa-tokenized-compliance-system-blockchain" \
    "$parent_dir/rwa-tokenized-compliance-system/blockchain/evm" \
    "$parent_dir/blockchain/evm"; do
    [ -n "$candidate" ] || continue

    local resolved_candidate="$candidate"
    if [[ "$resolved_candidate" != /* ]]; then
      resolved_candidate="$(to_absolute_path "$resolved_candidate")"
    fi

    if [ -f "$resolved_candidate/foundry.toml" ]; then
      printf '%s\n' "$resolved_candidate"
      return 0
    fi
  done

  return 1
}

is_real_address() {
  local value="${1:-}"
  [[ "$value" =~ ^0x[a-fA-F0-9]{40}$ ]] && [ "${value,,}" != "${ZERO_ADDRESS,,}" ]
}

wait_for_rpc() {
  local rpc_url="$1"
  local attempts="${2:-30}"
  local attempt=1

  while [ "$attempt" -le "$attempts" ]; do
    if cast chain-id --rpc-url "$rpc_url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
    attempt=$((attempt + 1))
  done

  return 1
}

resolve_rpc_host() {
  node -e 'const url = new URL(process.argv[1]); process.stdout.write(url.hostname);' "$1"
}

resolve_rpc_port() {
  node -e 'const url = new URL(process.argv[1]); process.stdout.write(url.port || "80");' "$1"
}

start_or_reuse_anvil() {
  local rpc_url="$1"
  local chain_id="$2"
  local started_anvil=0

  if wait_for_rpc "$rpc_url" 2; then
    local remote_chain_id
    remote_chain_id="$(cast chain-id --rpc-url "$rpc_url")"
    [ "$remote_chain_id" = "$chain_id" ] || fail "Unexpected chain id at $rpc_url: expected $chain_id, got $remote_chain_id"
    log "Reusing existing Anvil instance at $rpc_url"
    return 0
  fi

  local rpc_host rpc_port
  rpc_host="$(resolve_rpc_host "$rpc_url")"
  rpc_port="$(resolve_rpc_port "$rpc_url")"

  log "Starting Anvil at $rpc_url"
  nohup anvil \
    --host "$rpc_host" \
    --port "$rpc_port" \
    --chain-id "$chain_id" \
    >"$ANVIL_LOG_FILE" 2>&1 &
  echo "$!" > "$ANVIL_PID_FILE"
  started_anvil=1

  if ! wait_for_rpc "$rpc_url" 30; then
    if [ "$started_anvil" -eq 1 ] && [ -f "$ANVIL_PID_FILE" ]; then
      kill "$(cat "$ANVIL_PID_FILE")" >/dev/null 2>&1 || true
      rm -f "$ANVIL_PID_FILE"
    fi
    fail "Anvil did not respond at $rpc_url"
  fi

  log "Anvil is ready"
}

parse_deployment_addresses() {
  local deployments_file="$1"

  eval "$(
    node - "$deployments_file" <<'NODE'
const fs = require("fs");
const filePath = process.argv[2];
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

function unwrap(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.address || value.value || "";
  }
  return "";
}

const registry =
  unwrap(data.identityRegistry) ||
  unwrap(data.identityRegistryAddress) ||
  unwrap(data.contracts?.identityRegistry);
const token =
  unwrap(data.permissionedToken) ||
  unwrap(data.permissionedTokenAddress) ||
  unwrap(data.tokenAddress) ||
  unwrap(data.contracts?.permissionedToken) ||
  unwrap(data.contracts?.token);
const owner = unwrap(data.owner) || unwrap(data.deployer);

if (!registry || !token) {
  process.stderr.write("Could not resolve deployment addresses from " + filePath + "\n");
  process.exit(1);
}

process.stdout.write(`IDENTITY_REGISTRY_ADDRESS=${registry}\n`);
process.stdout.write(`NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=${registry}\n`);
process.stdout.write(`TOKEN_ADDRESS=${token}\n`);
process.stdout.write(`NEXT_PUBLIC_TOKEN_ADDRESS=${token}\n`);
if (owner) {
  process.stdout.write(`LOCAL_DEPLOYER_ADDRESS=${owner}\n`);
}
NODE
  )"
}

deploy_contracts() {
  local contracts_workspace="$1"
  local rpc_url="$2"
  local chain_id="$3"
  local private_key="$4"
  local deploy_script="${FOUNDRY_DEPLOY_SCRIPT:-script/deploy/DeployCore.s.sol:DeployCore}"
  local deploy_script_file="${deploy_script%%:*}"
  local deployments_file="${FOUNDRY_DEPLOYMENTS_FILE:-$contracts_workspace/deployments/$chain_id.json}"

  [ -f "$contracts_workspace/$deploy_script_file" ] || fail "Deploy script not found: $contracts_workspace/$deploy_script_file"

  log "Building contracts in $contracts_workspace"
  (cd "$contracts_workspace" && forge build)

  log "Deploying contracts with Foundry"
  if ! (
    cd "$contracts_workspace" &&
      PRIVATE_KEY="$private_key" forge script "$deploy_script" --rpc-url "$rpc_url" --broadcast
  ) >"$DEPLOY_LOG_FILE" 2>&1; then
    cat "$DEPLOY_LOG_FILE" >&2
    fail "Contract deployment failed. Check $DEPLOY_LOG_FILE for details."
  fi

  [ -f "$deployments_file" ] || fail "Deployment file not found: $deployments_file"
  parse_deployment_addresses "$deployments_file"
  log "Deployment file loaded from $deployments_file"
}

write_managed_env_block() {
  local file="$1"
  local tmp_file
  tmp_file="$(mktemp)"

  if [ -f "$file" ]; then
    awk '
      BEGIN { skip = 0 }
      /^# BEGIN LOCAL BOOTSTRAP$/ { skip = 1; next }
      /^# END LOCAL BOOTSTRAP$/ { skip = 0; next }
      skip == 0 { print }
    ' "$file" >"$tmp_file"
  fi

  cat >>"$tmp_file" <<EOF

# BEGIN LOCAL BOOTSTRAP
LOCAL_RPC_URL=$LOCAL_RPC_URL
LOCAL_CHAIN_ID=$LOCAL_CHAIN_ID
LOCAL_PRIVATE_KEY=$LOCAL_PRIVATE_KEY
CONTRACTS_WORKSPACE=${CONTRACTS_WORKSPACE:-}
FOUNDRY_DEPLOY_SCRIPT=${FOUNDRY_DEPLOY_SCRIPT:-script/deploy/DeployCore.s.sol:DeployCore}
LOCAL_FRONTEND_PORT=$LOCAL_FRONTEND_PORT
LOCAL_BACKEND_ENV_FILE=$LOCAL_BACKEND_ENV_FILE
NEXT_PUBLIC_API_BASE_URL=/api/backend
NEXT_PUBLIC_CHAIN_ID=$LOCAL_CHAIN_ID
NEXT_PUBLIC_RPC_URL=$LOCAL_RPC_URL
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=$NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS
NEXT_PUBLIC_TOKEN_ADDRESS=$NEXT_PUBLIC_TOKEN_ADDRESS
# END LOCAL BOOTSTRAP
EOF

  mv "$tmp_file" "$file"
}

write_backend_consumer_env() {
  mkdir -p "$(dirname "$LOCAL_BACKEND_ENV_FILE")"

  cat >"$LOCAL_BACKEND_ENV_FILE" <<EOF
RPC_URL=$LOCAL_RPC_URL
CHAIN_ID=$LOCAL_CHAIN_ID
IDENTITY_REGISTRY_ADDRESS=$IDENTITY_REGISTRY_ADDRESS
TOKEN_ADDRESS=$TOKEN_ADDRESS
ADMIN_PRIVATE_KEY=$LOCAL_PRIVATE_KEY
EOF
}

main() {
  ensure_runtime_dir
  ensure_env_file
  load_env_file

  require_cmd node
  require_cmd npm
  require_cmd forge
  require_cmd cast
  require_cmd anvil
  require_node_version

  ensure_frontend_dependencies

  export LOCAL_RPC_URL="${LOCAL_RPC_URL:-http://127.0.0.1:8545}"
  export LOCAL_CHAIN_ID="${LOCAL_CHAIN_ID:-31337}"
  export LOCAL_PRIVATE_KEY="${LOCAL_PRIVATE_KEY:-$DEFAULT_PRIVATE_KEY}"
  export LOCAL_FRONTEND_PORT="${LOCAL_FRONTEND_PORT:-3000}"
  export LOCAL_BACKEND_ENV_FILE="${LOCAL_BACKEND_ENV_FILE:-$RUNTIME_DIR/backend-consumer.env}"
  export LOCAL_BACKEND_ENV_FILE="$(to_absolute_path "$LOCAL_BACKEND_ENV_FILE")"

  if [ "${SKIP_CHAIN_BOOTSTRAP:-false}" = "true" ]; then
    export IDENTITY_REGISTRY_ADDRESS="${IDENTITY_REGISTRY_ADDRESS:-${NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS:-}}"
    export TOKEN_ADDRESS="${TOKEN_ADDRESS:-${NEXT_PUBLIC_TOKEN_ADDRESS:-}}"
    export NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS="${NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS:-$IDENTITY_REGISTRY_ADDRESS}"
    export NEXT_PUBLIC_TOKEN_ADDRESS="${NEXT_PUBLIC_TOKEN_ADDRESS:-$TOKEN_ADDRESS}"

    is_real_address "$NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS" || fail "SKIP_CHAIN_BOOTSTRAP=true requires NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS to be set to a real address."
    is_real_address "$NEXT_PUBLIC_TOKEN_ADDRESS" || fail "SKIP_CHAIN_BOOTSTRAP=true requires NEXT_PUBLIC_TOKEN_ADDRESS to be set to a real address."

    export IDENTITY_REGISTRY_ADDRESS="$NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS"
    export TOKEN_ADDRESS="$NEXT_PUBLIC_TOKEN_ADDRESS"
    log "Skipping chain bootstrap and using existing contract addresses from the environment"
  else
    local contracts_workspace=""
    if contracts_workspace="$(discover_contracts_workspace)"; then
      export CONTRACTS_WORKSPACE="$contracts_workspace"
      log "Contracts workspace detected at $CONTRACTS_WORKSPACE"
    else
      log "No Foundry workspace detected. Falling back to existing contract addresses from the environment."
    fi

    start_or_reuse_anvil "$LOCAL_RPC_URL" "$LOCAL_CHAIN_ID"

    if [ -n "${CONTRACTS_WORKSPACE:-}" ]; then
      deploy_contracts "$CONTRACTS_WORKSPACE" "$LOCAL_RPC_URL" "$LOCAL_CHAIN_ID" "$LOCAL_PRIVATE_KEY"
    else
      export IDENTITY_REGISTRY_ADDRESS="${IDENTITY_REGISTRY_ADDRESS:-${NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS:-}}"
      export TOKEN_ADDRESS="${TOKEN_ADDRESS:-${NEXT_PUBLIC_TOKEN_ADDRESS:-}}"
      export NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS="${NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS:-$IDENTITY_REGISTRY_ADDRESS}"
      export NEXT_PUBLIC_TOKEN_ADDRESS="${NEXT_PUBLIC_TOKEN_ADDRESS:-$TOKEN_ADDRESS}"

      is_real_address "$NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS" || fail "No contracts workspace was found and NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS is not set to a real address."
      is_real_address "$NEXT_PUBLIC_TOKEN_ADDRESS" || fail "No contracts workspace was found and NEXT_PUBLIC_TOKEN_ADDRESS is not set to a real address."

      export IDENTITY_REGISTRY_ADDRESS="$NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS"
      export TOKEN_ADDRESS="$NEXT_PUBLIC_TOKEN_ADDRESS"
      log "Using existing contract addresses from environment"
    fi
  fi

  write_managed_env_block "$ENV_FILE"
  write_backend_consumer_env

  log "Frontend env updated at $ENV_FILE"
  log "Backend consumer env written to $LOCAL_BACKEND_ENV_FILE"
  log "Identity registry: $NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS"
  log "Permissioned token: $NEXT_PUBLIC_TOKEN_ADDRESS"
  log "Frontend will start at http://localhost:$LOCAL_FRONTEND_PORT"
  log "Anvil log: $ANVIL_LOG_FILE"
  log "Deploy log: $DEPLOY_LOG_FILE"

  cd "$ROOT_DIR"
  local next_cli
  next_cli="$(next_cli_path)"
  [ -f "$next_cli" ] || fail "Next CLI not found at $next_cli. Reinstall frontend dependencies."
  node "$next_cli" dev --hostname 0.0.0.0 --port "$LOCAL_FRONTEND_PORT"
}

main "$@"
