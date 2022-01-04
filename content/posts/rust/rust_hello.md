---
title: "Rust入門: DFINITYでHello, World!"
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

## はじめに
当記事は、DFINITYのRustのチュートリアルを日本語で解説しています。
当記事で実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/rust-tutorial/tree/main/rust_hello)で公開しています。

[Hello, World! Rust CDK Quick Start](https://smartcontracts.org/docs/rust-guide/rust-quickstart.html)

はじめての方は先にこちらをご覧ください。

[5ステップではじめるMotokoプログラミング入門](/hello-motoko)

### 実行環境
* dfx: 0.8.4
* macOS: 11.5.2
* rustup: 1.24.3
* rustc: 1.57.0
* cargo: 1.57.0
* 任意のターミナル
* 任意のテキストエディタ

ターミナルとテキストエディタは好きなソフトウェアを使えば大丈夫です。

はじめはMac標準のターミナルでよいと思います。テキストエディタは筆者はVisual Studio Codeを使っています。

## 環境準備
DFINITYのツールdfx以外にRust用のコンパイラやツール群をローカル環境にインストールする必要があります。
以下のコマンドによってRust系のツールをまとめてインストールします。
```
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

* rustc: Rustコンパイラ
* cargo: Rustのパッケージマネージャ
* rustup: Rustのビルドツール全体を管理

以下のコマンドでcmakeというツールも入れる必要があるようです。
```
brew install cmake
```

## 手順
### プロジェクトの作成
DFINITYのデフォルトの開発言語はMotokoです。
`--type=rust`をつけてRust用のプロジェクトを作成します。
```
dfx new --type=rust rust_hello
cd rust_hello
```
dfx.jsonというファイルを見てみましょう。
dfxコマンドでビルドするときにはこのファイルの設定が使われます。
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
### ソースコード
cargoはRustのビルドに使うツールです。
Cargo.tomlには、cargoで使う設定が書かれています。
rust_helloプロジェクトには、2つのCargo.tomlがあります。
#### root直下のCargo.toml
```
[workspace]
members = [
    "src/rust_hello",
]
```
#### src/rust_hello/Cargo.toml
```
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
greetというシンプルな関数が書かれています。
```
#[ic_cdk_macros::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
```

#### Candid
Candidはキャニスターのインターフェースの情報が書かれており、
フロントエンドからキャニスターを実行するときにはこのインターフェースの情報を利用します。
```
service : {
    "greet": (text) -> (text) query;
}
```
この場合は、greetというqueryがあり、引数と戻りはtextです。

## ビルド＆デプロイ
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

## 実行
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

## 停止
ローカル実行環境を停止します。
```
dfx stop
```