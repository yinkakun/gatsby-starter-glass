---
title: "Motoko Tutorial: Increment a natural number"
date: 2021-12-29 21:38
slug: /motoko-my-counter
tags:
  - DFINITY
  - motoko
  - Tutorial
  - jp
description: |-
  DFINITYチュートリアル「Increment a natural number」の日本語解説
  実際に使ったコードをGitHubで公開
---

## はじめに
当記事は、DFINITYのMotokoのチュートリアルを日本語で解説しています。
当記事で実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/my_counter)で公開しています。

[Increment a natural number](https://smartcontracts.org/docs/developers-guide/tutorials/counter-tutorial.html)

はじめての方は先にこちらをご覧ください。

[5ステップではじめるMotokoプログラミング](/hello-motoko)

### 実行環境
* dfx: 0.8.4
* macOS: 11.5.2
* npm version: 8.1.3
* 任意のターミナル
* 任意のテキストエディタ

ターミナルとテキストエディタは好きなソフトウェアを使えば大丈夫です。

はじめはMac標準のターミナルでよいと思います。テキストエディタは筆者はVisual Studio Codeを使っています。

## 手順
### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new my_counter
cd my_counter
```

### ソースファイル名の変更

今回は`main.mo`というソースファイルの名前を変えます。
`dfx.json`の以下の行を変更します。
```
変更前
"main": "src/my_counter/main.mo",
変更後
"main": "src/my_counter/increment_counter.mo",
```

そして以下のコマンドでファイル名を変更します。
```
mv src/my_counter/main.mo src/my_counter/increment_counter.mo
```

### コーディング
`src/my_counter/increment_counter.mo`を以下のように編集して保存します。
```
// Create a simple Counter actor.
actor Counter {
  stable var currentValue : Nat = 0;

  // Increment the counter with the increment function.
  public func increment() : async () {
    currentValue += 1;
  };

  // Read the counter value with a get function.
  public query func get() : async Nat {
    currentValue
  };

  // Write an arbitrary value with a set function.
  public func set(n: Nat) : async () {
    currentValue := n;
  };
}
```
`Counter`というactorに3つの関数を定義しています。

* `increment`
* `get`
* `set`

`increment`は`currentValue`を+1します。

### 起動
以下のどちらかのコマンドでローカルPCで実行環境を起動します。
```
dfx start
```
オプションをつけない場合、Ctrl+CでICを停止するまで他のコマンドを実行できません。
そのため別のターミナルウィンドウで他のコマンドを実行する必要があります。

```
dfx start --background
```
`--background`をつけると起動後も同じウィンドウで他のコマンドを実行できます。

### ビルド＆デプロイ
以下のコマンドでビルド&デプロイを実行します。
```
dfx deploy
```

`dfx deploy`では以下の3つの処理を一気に実行できます。
* `dfx canister create`
* `dfx build`
* `dfx canister install`

コンパイルされていなければコンパイルしてからデプロイをしてくれます。

```
my_counter % dfx deploy
Creating a wallet canister on the local network.
The wallet canister on the "local" network for user "default" is "rwlgt-iiaaa-aaaaa-aaaaa-cai"
Deploying all canisters.

<中略>

Committing batch.
Deployed canisters.
```

### 実行

`get` `increment` `set` の3つの関数を使って実行します。
```
dfx canister call my_counter get
```
```
出力
(0 : nat)
```
初期値は0です。
`increment`を実行してキャニスターが持つ`currentValue`を+1します。
```
dfx canister call my_counter increment
```
```
dfx canister call my_counter get
```
```
出力
(1 : nat)
```
結果が1になっています。

`set`を使って(987)を設定します。
```
dfx canister call my_counter set '(987)'
dfx canister call my_counter get
```
`increment`で+1します。
```
dfx canister call my_counter increment
dfx canister call my_counter get
```
`currentValue`は988になっています。

### ブラウザから実行 (Candid UI)
このプロジェクトには、Candid UIというテスト用のキャニスターがデプロイされています。
Candid UIのキャニスターIDを確認してみましょう。
```
dfx canister id __Candid_UI
```
```
r7inp-6aaaa-aaaaa-aaabq-cai
```

ローカルICにデプロイされたキャニスターの一覧は以下のファイルに保存されています。
上のコマンドで表示された__Candid_UIというキャニスターもあります。

```
my_counter % cat .dfx/local/canister_ids.json
{
  "__Candid_UI": {
    "local": "r7inp-6aaaa-aaaaa-aaabq-cai"
  },
  "my_counter": {
    "local": "rrkah-fqaaa-aaaaa-aaaaq-cai"
  },
  "my_counter_assets": {
    "local": "ryjl3-tyaaa-aaaaa-aaaba-cai"
  }
}
```

もし、dfx stopでICを停止していたら起動しましょう。
```
dfx start --background
```

ブラウザを使って以下のURLにアクセスします。
```
http://127.0.0.1:8000/?canisterId=<CANDID-UI-CANISTER-IDENTIFIER>
```
自分の環境の__Candid_UIのキャニスターIDに置き換えます。
```
http://127.0.0.1:8000/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai
```
```
my_counter % dfx canister id my_counter
rrkah-fqaaa-aaaaa-aaaaq-cai
```

以下のようにCanister IDを入力する画面が表示されるはずです。

![Candid UI](/media/motoko-my-counter/1.png)

ここにmy_counterのキャニスターIDを入力します。
キャニスターIDはさっき確認した`.dfx/local/canister_ids.json`にも書かれていますが、以下のコマンドでも表示できます。
```
my_counter % dfx canister id my_counter
```

```
rrkah-fqaaa-aaaaa-aaaaq-cai
```
このIDをブラウザのフォームの`Provide a canister ID:`に入力します。

![Candid UI](/media/motoko-my-counter/2.png)

GOをクリックすると以下のような画面表示に変わります。
![Candid UI](/media/motoko-my-counter/4.png)

`QUERY`, `CALL`, `RANDOM` をクリックして自由に試してみましょう！

### ローカル実行環境の停止
終わったらローカルPC上の実行環境を停止します。
```
dfx stop
```