---
title: "DFINITY/Motoko入門: Explore the default project"
date: 2021-12-29 19:38
permalink: /motoko-explore-hello
tags:
  - Motoko
  - tutorial
  - jp
description: |-
  DFINITY/ICPプログラミング「Explore the default project」日本語解説
  Motokoの勉強をどうやって始めたらわからない人が最初にやること
---

このページは、DFINITY/ICP の Motoko チュートリアルを日本語で解説しています。

[Explore the default project](https://smartcontracts.org/docs/developers-guide/tutorials/explore-templates.html)

実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/explore_hello)からダウンロードできます。

はじめての方は先にこちらをご覧ください。

[5 ステップではじめる Motoko プログラミング入門](/hello-motoko)

### 実行環境

- dfx: 0.8.4
- macOS: 11.5.2
- npm version: 8.1.3

## 手順

### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new explore_hello
```

以下のようなファイルが作られていれば OK です。

```
explore_hello % ls explore_hello
README.md               node_modules            package.json            webpack.config.js
dfx.json                package-lock.json       src
```

このプロジェクトで使うソースコードは`src/explore_hello/main.mo`に書かれています。

```ts
actor {
    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };
};
```

greet()という関数に文字列を渡すと `Hello, <文字列>!`を返す簡単なプログラムです。

### ローカル実行環境の起動

以下のコマンドを実行して、ローカル PC 上に実行環境を起動します。
dfx.json ファイルがあるディレクトリで dfx コマンドを実行してください。

```
cd explore_hello
dfx start
```

以下のようにログが出力されれば成功です。

```
 INFO Starting server. Listening on http://127.0.0.1:8000/
```

もし、すでに 8000 番ポートを使っている場合は起動できません。

### キャニスターの作成

キャニスターとは、スマートコントラクトの入れ物です。
直訳すると空き缶という意味で、ここでは空の入れ物をまず作るイメージです。
dfx.json があるプロジェクトディレクトリ上で dfx コマンドを実行します。

```
cd explore_hello
dfx canister create --all
```

以下のように出力されます。

```ts
The wallet canister on the "local" network for user "default" is "rwlgt-iiaaa-aaaaa-aaaaa-cai"
Creating canister "explore_hello"...
"explore_hello" canister created with canister id: "rrkah-fqaaa-aaaaa-aaaaq-cai"
Creating canister "explore_hello_assets"...
"explore_hello_assets" canister created with canister id: "ryjl3-tyaaa-aaaaa-aaaba-cai"
```

最初に`dfx start`で`local`に起動したローカル実行環境に
`default`ユーザーによって
2 つのキャニスターが作られました。

作られたキャニスターを識別するための ID が割り振られます。
今後キャニスターを指定するときにはこの ID を使います。
この ID は `.dfx/local/canister_ids.json` というファイルに保存されています。

```ts
cat.dfx / local / canister_ids.json;
```

```ts
{
  "explore_hello": {
    "local": "rrkah-fqaaa-aaaaa-aaaaq-cai"
  },
  "explore_hello_assets": {
    "local": "ryjl3-tyaaa-aaaaa-aaaba-cai"
  }
}
```

### ビルド

ソースコードをビルドします。

```
dfx build
```

Motoko で書かれたソースコードをコンパイルして WASM という実行モジュールをビルドしています。

```ts
explore_hello % dfx build
Building canisters...
Building frontend...
```

### デプロイ

先ほどビルドして作成した WASM モジュールを実行環境にデプロイします。

```
dfx canister install --all
```

Internet Computer に作った空き缶（キャニスター）の中に、WASM という実行プログラムを入れるイメージです。

```ts
explore_hello % dfx canister install --all
Creating UI canister on the local network.
The UI canister on the "local" network is "r7inp-6aaaa-aaaaa-aaabq-cai"
Installing code for canister explore_hello, with canister_id rrkah-fqaaa-aaaaa-aaaaq-cai
Installing code for canister explore_hello_assets, with canister_id ryjl3-tyaaa-aaaaa-aaaba-cai
Authorizing our identity (default) to the asset canister...
Uploading assets to asset canister...
Starting batch.
Staging contents of new and changed assets:
  /favicon.ico 1/1 (15406 bytes)
  /index.html 1/1 (671 bytes)
  /index.html (gzip) 1/1 (386 bytes)
  /index.js 1/1 (604206 bytes)
  /index.js (gzip) 1/1 (144664 bytes)
  /main.css 1/1 (537 bytes)
  /main.css (gzip) 1/1 (297 bytes)
  /sample-asset.txt 1/1 (24 bytes)
  /logo.png 1/1 (25397 bytes)
  /index.js.map 1/1 (653971 bytes)
  /index.js.map (gzip) 1/1 (148954 bytes)
Committing batch.
```

ローカルの実行環境にキャニスターをデプロイしました。

### 実行

キャニスターを実行してみましょう。

```
explore_hello % dfx canister call explore_hello greet '("everyone": text)'
```

`explore_hello`はキャニスターの名前です。裏側ではキャニスター ID で管理されています。
greet()という関数に`"everyone"`という text 型の文字列を渡しています。

```
結果
("Hello, everyone!")
```

### ローカル実行環境の停止

以下のいずれかの方法でローカル PC の実行環境を停止できます。

- dfx start を実行したターミナルで Ctrl+C を実行
- dfx.json があるディレクトリ上で以下のコマンドを実行

```
dfx stop
```
