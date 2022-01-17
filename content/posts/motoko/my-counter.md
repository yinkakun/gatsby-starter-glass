---
title: "DFINITY/Motoko入門: Increment a natural number"
date: 2021-12-29 21:38
permalink: /motoko-my-counter
tags:
  - Motoko
  - tutorial
  - jp
description: |-
  DFINITY/ICPプログラミング「Increment a natural number」の日本語解説
  実際に使ったコードをGitHubで公開
---

このページは、DFINITY/ICP の Motoko のチュートリアルを日本語で解説しています。

[Increment a natural number](https://smartcontracts.org/docs/developers-guide/tutorials/counter-tutorial.html)

実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/my_counter)からダウンロードできます。

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

```ts
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

`Counter`という actor に 3 つの関数を定義しています。

- `increment`
- `get`
- `set`

`increment`は`currentValue`を+1 します。

### 起動

以下のどちらかのコマンドでローカル PC で実行環境を起動します。

```
dfx start
```

オプションをつけない場合、Ctrl+C で IC を停止するまで他のコマンドを実行できません。
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

`dfx deploy`では以下の 3 つの処理を一気に実行できます。

- `dfx canister create`
- `dfx build`
- `dfx canister install`

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

`get` `increment` `set` の 3 つの関数を使って実行します。

```
dfx canister call my_counter get
```

```
出力
(0 : nat)
```

初期値は 0 です。
`increment`を実行してキャニスターが持つ`currentValue`を+1 します。

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

結果が 1 になっています。

`set`を使って(987)を設定します。

```
dfx canister call my_counter set '(987)'
dfx canister call my_counter get
```

`increment`で+1 します。

```
dfx canister call my_counter increment
dfx canister call my_counter get
```

`currentValue`は 988 になっています。

### ブラウザから実行 (Candid UI)

このプロジェクトには、Candid UI というテスト用のキャニスターがデプロイされています。
Candid UI のキャニスター ID を確認してみましょう。

```
dfx canister id __Candid_UI
```

```
r7inp-6aaaa-aaaaa-aaabq-cai
```

ローカル IC にデプロイされたキャニスターの一覧は以下のファイルに保存されています。
上のコマンドで表示された\_\_Candid_UI というキャニスターもあります。

```ts
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

もし、dfx stop で IC を停止していたら起動しましょう。

```
dfx start --background
```

ブラウザを使って以下の URL にアクセスします。

```
http://127.0.0.1:8000/?canisterId=<CANDID-UI-CANISTER-IDENTIFIER>
```

自分の環境の\_\_Candid_UI のキャニスター ID に置き換えます。

```
http://127.0.0.1:8000/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai
```

```
my_counter % dfx canister id my_counter
rrkah-fqaaa-aaaaa-aaaaq-cai
```

以下のように Canister ID を入力する画面が表示されるはずです。

![Candid UI](/media/motoko-my-counter/1.png)

ここに my_counter のキャニスター ID を入力します。
キャニスター ID はさっき確認した`.dfx/local/canister_ids.json`にも書かれていますが、以下のコマンドでも表示できます。

```
my_counter % dfx canister id my_counter
```

```
rrkah-fqaaa-aaaaa-aaaaq-cai
```

この ID をブラウザのフォームの`Provide a canister ID:`に入力します。

![Candid UI](/media/motoko-my-counter/2.png)

GO をクリックすると以下のような画面表示に変わります。
![Candid UI](/media/motoko-my-counter/4.png)

`QUERY`, `CALL`, `RANDOM` をクリックして自由に試してみましょう！

### ローカル実行環境の停止

終わったらローカル PC 上の実行環境を停止します。

```
dfx stop
```
