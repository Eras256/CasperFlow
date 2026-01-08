# Deployment Issues Report

## Status: BLOCKED

We have identified multiple layers of incompatibility:

1.  **JS SDK v2.15.x vs CEP-78 v1.5.1**:
    -   The SDK fails to serialize `Vec<u8>` lists correctly (Stream Error).
    -   Workarounds (Type Spoofing, ByteArray) failed either at SDK level or Contract level.

2.  **JS SDK v2.15.x vs Casper 2.0 Testnet**:
    -   Attempts to deploy legacy CEP-78 v1.0.0 (simpler args) also failed with `EarlyEndOfStream` [17].
    -   This suggests the SDK v2 might be sending a deploy format incompatible with the Casper 2.0 node version.

3.  **JS SDK v5.0.x (Casper 2.0 Native)**:
    -   This version introduces breaking API changes (removed `Keys` namespace), requiring a full rewrite of the deploy scripts which is out of scope without migration documentation.

4.  **Compilation (Rust)**:
    -   We installed `rustup`.
    -   We PATCHED `main.rs` to remove the problematic arguments.
    -   **FAILED**: Compilation requires a C Linker (`cc`). The system is missing `build-essential` (gcc/clang).

## Path to Solution (User Action Required)
Since I cannot run `sudo` to install the linker, please run the following in your terminal:

```bash
sudo apt install build-essential
. "$HOME/.cargo/env"
cd cep-78-enhanced-nft
make build-contract
```

Once compiled, the new WASM will be at `target/wasm32-unknown-unknown/release/cep78.wasm`.
This WASM has the arguments removed (patched).
You can then deploy it using `node scripts/deploy_wasm.js` (update the wasm path inside the script).
