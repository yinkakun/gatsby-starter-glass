---
title: "Rust入門: DFINITY/ICPでHello, World!【初心者向け】"
date: 2022-01-04 19:38
permalink: /rust-hello
tags:
  - dfinity
  - rust
  - beginner
  - jp
description: |-
  ICP(Internet Computer Protocol)でRustを使ってDapps開発をはじめよう！
---

このページはこんな人におすすめ

* Rustを勉強したい
* DFINITYの開発に興味がある

このページは、以下のDFINITYのRustのチュートリアルを日本語で解説しています。

[Hello, World! Rust CDK Quick Start](https://smartcontracts.org/docs/rust-guide/rust-quickstart.html)

このページで実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/rust-tutorial/tree/main/rust_hello)からダウンロードできます。

### 実行環境
* dfx: 0.8.4
* macOS: 11.5.2
* rustup: 1.24.3
* rustc: 1.57.0
* cargo: 1.57.0

## インストール
### dfxのインストール
dfxコマンドはDFINITYのキャニスターをビルドしたりデプロイしたりするためのツールです。

[dfxのインストールガイド](https://smartcontracts.org/docs/developers-guide/install-upgrade-remove.html)

以下のコマンドでdfxをインストールします。
```
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```
### rustup (Rust Toolchain)
以下のコマンドによってRust系のツールをまとめてインストールします。
```
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

* rustc: Rustコンパイラ
* cargo: Rustのパッケージマネージャ
* rustup: Rustのビルドツール全体を管理

### CMakeのインストール
以下のコマンドでcmakeをインストールします。
```
brew install cmake
```

### プロジェクトの作成
DFINITYのデフォルトの開発言語はMotokoです。
`--type=rust`をつけてRust用のプロジェクトを作成します。
```
dfx new --type=rust rust_hello
cd rust_hello
```
dfx.jsonというファイルを見てみましょう。
dfxコマンドでビルドするときにはこのファイルの設定が使われます。
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
cargoはRustのビルドに使うツールです。
Cargo.tomlには、cargoで使う設定が書かれています。
rust_helloプロジェクトには、2つのCargo.tomlがあります。
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
今回はgreetというシンプルな関数だけが書かれています。
```rust
#[ic_cdk_macros::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
```

#### Candid
Candidはキャニスターのインターフェースの情報が書かれており、
フロントエンドからキャニスターを実行するときにはこのインターフェースの情報を利用します。
```rust
service : {
    "greet": (text) -> (text) query;
}
```
この場合は、greetというqueryがあり、引数と戻りはtextです。

### ビルド&デプロイ
PC上にローカル実行環境を起動します。
```
dfx start --background
```

WASMにはいろんなフォーマットがあるため、DFINITY用のWASM32を追加します。
```
rustup target add wasm32-unknown-unknown
```

RustのWASMキャニスターをビルドしてローカル実行環境にデプロイします。
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
rust_helloというキャニスターのgreet()という関数にworldという引数を渡して実行します。
```
dfx canister call rust_hello greet world
```

```
出力
("Hello, world!")
```

### フロントエンドの起動
公式手順には載っていませんが、Motokoのチュートリアルと同様に
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

Rustエンジニアへの第一歩を踏み出しました！
ソースコードを変えていろんなキャニスターを作ってみましょう。
