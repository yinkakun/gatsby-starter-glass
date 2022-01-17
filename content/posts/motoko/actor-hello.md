---
title: "DFINITY/Motoko入門: Query using an actor"
date: 2021-12-29 20:38
permalink: /motoko-actor-hello
tags:
  - Motoko
  - tutorial
  - jp
description: |-
  DFINITYチュートリアル「Query using an actor」の日本語解説
  実際に使ったコードをGitHubで公開
---

このページは、DFINITY/ICP の Motoko チュートリアルを日本語で解説しています。

[Query using an actor](https://smartcontracts.org/docs/developers-guide/tutorials/define-an-actor.html)

実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/actor_hello)からダウンロードできます。

はじめての方は先にこちらをご覧ください。

[5 ステップではじめる Motoko プログラミング入門](/hello-motoko)

### 実行環境

- dfx: 0.8.4
- macOS: 11.5.2
- npm version: 8.1.3
- 任意のターミナル
- 任意のテキストエディタ

ターミナルとテキストエディタは好きなソフトウェアを使えば大丈夫です。

はじめは Mac 標準のターミナルでよいと思います。テキストエディタは筆者は Visual Studio Code を使っています。

### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new actor_hello
cd actor_hello
```

### 不要なコードの削除

`src/actor_hello_assets`を丸ごと削除します。

```
actor_hello % rm -r src/actor_hello_assets
```

`dfx.json`から以下の部分を削除します

```ts
    "actor_hello_assets": {
      "dependencies": [
        "actor_hello"
      ],
      "frontend": {
        "entrypoint": "src/actor_hello_assets/src/index.html"
      },
      "source": [
        "src/actor_hello_assets/assets",
        "dist/actor_hello_assets/"
      ],
      "type": "assets"
    }
```

### コーディング

エディタを使って、`src/actor_hello/main.mo` を編集します。

```ts
import Debug "mo:base/Debug";
actor HelloActor {
   public query func hello() : async () {
      Debug.print ("Hello, World from DFINITY \n");
   }
};
```

### ビルド前のチェック

ビルド前にチェックしてみます。

```
actor_hello % dfx build --check
Building canisters to check they build ok. Canister IDs might be hard coded.
Building canisters...
```

もしエラーが出た場合は、以下のような原因が考えられます。

- dfx.json から`actor_hello_assets`の部分を削除していない

`--check` オプションを付けると、一時的な Canister ID を使ってローカル環境でコンパイルを実行します。

コンパイルされた WASM ファイルは`.dfx/local/canisters`配下に作られています。

```
actor_hello % tree .dfx/local/canisters
.dfx/local/canisters
├── actor_hello
│   ├── actor_hello.did
│   ├── actor_hello.did.d.ts
│   ├── actor_hello.did.js
│   ├── actor_hello.wasm
│   └── index.js
└── idl

```

### デプロイ

ローカルの実行環境を起動します。

```
dfx start --background
```

`--background`オプションをつけることで、後続のコマンドを同じウィンドウで実行できます。

キャニスターを登録します。

```
dfx canister create actor_hello
```

```
出力結果
Creating a wallet canister on the local network.
The wallet canister on the "local" network for user "default" is "rwlgt-iiaaa-aaaaa-aaaaa-cai"
Creating canister "actor_hello"...
"actor_hello" canister created with canister id: "rrkah-fqaaa-aaaaa-aaaaq-cai"
```

ビルドします。

```
dfx build
```

デプロイします。

```
dfx canister install actor_hello
```

### 実行

デプロイしたキャニスターを実行しましょう。

```
dfx canister call actor_hello hello
```

`actor_hello`というキャニスターの`hello()`という関数を call しています。

dfx start を実行したウィンドウでは、以下のように出力されます。

```
[Canister rrkah-fqaaa-aaaaa-aaaaq-cai] Hello, World from DFINITY
```

### 停止

dfx.json があるディレクトリで以下のコマンドを実行して、実行環境を停止します。

```
dfx stop
```
