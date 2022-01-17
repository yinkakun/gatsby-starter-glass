---
title: "DFINITY/Motoko入門: Make inter-canister calls"
date: 2021-12-30 21:00
permalink: /motoko-linkedup
tags:
  - Motoko
  - tutorial
  - jp
description: |-
  DFINITY/ICPプログラミング: キャニスター間てcallを実行する
---

このページは、DFINITY の Motoko のチュートリアルを日本語で解説しています。

[Make inter-canister calls](https://smartcontracts.org/docs/developers-guide/tutorials/intercanister-calls.html)

実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/linkedup)からダウンロードできます。

はじめての方はこちらをご覧ください。

[5 ステップではじめる Motoko プログラミング入門](/hello-motoko)

### 実行環境

- dfx: 0.6.22
- macOS: 11.5.2
- npm version: 8.1.3

### dfx 0.6.22 のインストール

執筆時の dfx の最新バージョンは 0.8.4 ですが、このプログラムは 0.8.x では動作しません。
0.6.22 を指定してインストールします。チュートリアルが終わったら最新バージョンに戻しましょう。

```
DFX_VERSION=0.6.22 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

## 手順

### プロジェクトの作成

GitHub からプロジェクトを取得します。

```
git clone https://github.com/dfinity/linkedup.git
cd linkedup
```

### ライブラリのインストール

```
npm install
npm audit fix
```

### 実行環境の起動

```
dfx start --background
```

```
出力
Starting webserver on port 50931 for replica at "http://localhost:50931"
binding to: V4(0.0.0.0:8000)
replica(s): http://localhost:50931/
```

### キャニスターの登録

```
dfx canister create --all
```

```
出力
Creating canister "connectd"...
"connectd" canister created with canister id: "rwlgt-iiaaa-aaaaa-aaaaa-cai"
Creating canister "linkedup"...
"linkedup" canister created with canister id: "rrkah-fqaaa-aaaaa-aaaaq-cai"
Creating canister "linkedup_assets"...
"linkedup_assets" canister created with canister id: "ryjl3-tyaaa-aaaaa-aaaba-cai"
```

### ビルド(コンパイル)

```
dfx build
```

```
出力
Building canisters...
Building frontend...
```

### デプロイ（インストール）

```
dfx canister install --all
```

```
出力
Installing code for canister connectd, with canister_id rwlgt-iiaaa-aaaaa-aaaaa-cai
Installing code for canister linkedup, with canister_id rrkah-fqaaa-aaaaa-aaaaq-cai
Installing code for canister linkedup_assets, with canister_id ryjl3-tyaaa-aaaaa-aaaba-cai
Uploading assets to asset canister...
```

## 実行

### キャニスター ID

当プロジェクトには 3 つのキャニスターを作っています。

- connectd
- linkedup
- linkedup_assets

キャニスターをブラウザ経由で実行します。
ブラウザ経由で実行する時に、各キャニスターの ID を URL で指定します。

キャニスター ID は、ビルドやデプロイ時に表示されます。
もし記録していなくてものファイルを見ればわかります。

`linkedup/.dfx/local/canister_ids.json`

```ts
linkedup % cat .dfx/local/canister_ids.json
{
  "connectd": {
    "local": "rwlgt-iiaaa-aaaaa-aaaaa-cai"
  },
  "linkedup": {
    "local": "rrkah-fqaaa-aaaaa-aaaaq-cai"
  },
  "linkedup_assets": {
    "local": "ryjl3-tyaaa-aaaaa-aaaba-cai"
  }
}%
```

### フロントエンドキャニスター

127.0.0.1 は自分の PC にアクセスするための IP アドレスです。

```
http://127.0.0.1:8000/?canisterId=<ic-identifier-for-linkedup-assets>
```

linkedup_assets のキャニスター ID に置き換えた URL をブラウザで開きます。

```
http://127.0.0.1:8000/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai
```

Linkedin そっくりのサイトが表示されました笑
![Linkedup](/media/linkedup/1.png)

自分の名前や組織名を入力して保存します。
![Linkedup](/media/linkedup/2.png)

シークレットウィンドウでもう 1 つブラウザを開きます。
URL は先ほどと同じです。

シークレットウィンドウではまた新しいユーザーを作成します。
ウィンドウごとにそれぞれの 2 つのユーザープロファイルを作成できました。

![Linkedup](/media/linkedup/6.png)

それぞれの Window で相手を検索したり、CONNECT をクリックしたり、自由に試してみましょう。
どんな操作もだいたい 2~3 秒遅れて反応すると思います。

## 実行環境の停止

終わったらローカル PC 上の実行環境を停止します。

```
dfx stop
```
