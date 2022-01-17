---
title: "Rust入門: DFINITYでHello, World!【初心者向け】"
date: 2022-01-04 19:38
pinned: 2
permalink: /rust-hello
tags:
  - DFINITY
  - Rust
  - beginner
  - jp
description: |-
  DFINITY/ICP(Internet Computer Protocol)でRustを使ってDapps開発をはじめよう！
---

このページはこんな人におすすめ

- Rust を勉強したい
- DFINITY/ICP の開発に興味がある

このページは、以下の DFINITY/ICP の Rust のチュートリアルを日本語で解説しています。

[Hello, World! Rust CDK Quick Start](https://smartcontracts.org/docs/rust-guide/rust-quickstart.html)

このページで実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/rust-tutorial/tree/main/rust_hello)からダウンロードできます。

### 実行環境

- dfx: 0.8.4
- macOS: 11.5.2
- rustup: 1.24.3
- rustc: 1.57.0
- cargo: 1.57.0

## インストール

### dfx のインストール

dfx コマンドは DFINITY/ICP のキャニスターをビルドしたりデプロイしたりするためのツールです。

[dfx のインストールガイド](https://smartcontracts.org/docs/developers-guide/install-upgrade-remove.html)

以下のコマンドで dfx をインストールします。

```
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

### rustup (Rust Toolchain)

以下のコマンドによって Rust 系のツールをまとめてインストールします。

```
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

- rustc: Rust コンパイラ
- cargo: Rust のパッケージマネージャ
- rustup: Rust のビルドツール全体を管理

### CMake のインストール

以下のコマンドで cmake をインストールします。

```
brew install cmake
```

### プロジェクトの作成

DFINITY/ICP のデフォルトの開発言語は Motoko です。
`--type=rust`をつけて Rust 用のプロジェクトを作成します。

```
dfx new --type=rust rust_hello
cd rust_hello
```

dfx.json というファイルを見てみましょう。
dfx コマンドでビルドするときにはこのファイルの設定が使われます。

#### dfx.json

```js
{
  "canisters": {
    "rust_hello": {
      "candid": "src/rust_hello/rust_hello.did",
      "package": "rust_hello",
      "type": "rust"
    },
    "rust_hello_assets": {
      "dependencies": [
        "rust_hello"
      ],
      "frontend": {
        "entrypoint": "src/rust_hello_assets/src/index.html"
      },
      "source": [
        "src/rust_hello_assets/assets",
        "dist/rust_hello_assets/"
      ],
      "type": "assets"
    }
  },
  "defaults": {
    "build": {
      "args": "",
      "packtool": ""
    }
  },
  "networks": {
    "local": {
      "bind": "127.0.0.1:8000",
      "type": "ephemeral"
    }
  },
  "version": 1
}
```

## キャニスター(スマートコントラクト)の作成

### ソースコード

cargo は Rust のビルドに使うツールです。
Cargo.toml には、cargo で使う設定が書かれています。
rust_hello プロジェクトには、2 つの Cargo.toml があります。

#### Cargo.toml

```toml
[workspace]
members = [
    "src/rust_hello",
]
```

#### src/rust_hello/Cargo.toml

```toml
[package]
name = "rust_hello"
version = "0.1.0"
edition = "2018"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[lib]
path = "lib.rs"
crate-type = ["cdylib"]

[dependencies]
ic-cdk = "0.3"
ic-cdk-macros = "0.3"
```

#### src/rust_hello/lib.rs

スマートコントラクト本体のソースコードです。
今回は greet というシンプルな関数だけが書かれています。

```rust
#[ic_cdk_macros::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
```

#### Candid

Candid はキャニスターのインターフェースの情報が書かれており、
フロントエンドからキャニスターを実行するときにはこのインターフェースの情報を利用します。

```rust
service : {
    "greet": (text) -> (text) query;
}
```

この場合は、greet という query があり、引数と戻りは text です。

### ビルド&デプロイ

PC 上にローカル実行環境を起動します。

```
dfx start --background
```

WASM にはいろんなフォーマットがあるため、DFINITY 用の WASM32 を追加します。

```
rustup target add wasm32-unknown-unknown
```

Rust の WASM キャニスターをビルドしてローカル実行環境にデプロイします。

```
dfx deploy
```

```
出力
Creating a wallet canister on the local network.
The wallet canister on the "local" network for user "alice_auth" is "rwlgt-iiaaa-aaaaa-aaaaa-cai"
Deploying all canisters.
Creating canisters...
Creating canister "rust_hello"...
（中略）
Committing batch.
Deployed canisters.
```

## キャニスターの実行

rust_hello というキャニスターの greet()という関数に world という引数を渡して実行します。

```
dfx canister call rust_hello greet world
```

```
出力
("Hello, world!")
```

### フロントエンドの起動

公式手順には載っていませんが、Motoko のチュートリアルと同様に
フロントエンドを起動して、フロントエンドからキャニスターを実行することもできます。

```
npm install
npm start
```

http://localhost:8080

![Rust](/media/rust-hello/1.png)

### 停止

ローカル実行環境を停止します。

```
dfx stop
```

Rust エンジニアへの第一歩を踏み出しました！
ソースコードを変えていろんなキャニスターを作ってみましょう。
