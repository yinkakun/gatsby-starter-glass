---
title: "Motoko Tutorial: Make inter-canister calls"
date: 2021-12-30 21:00
slug: /motoko-linkedup
tags:
  - DFINITY
  - motoko
  - Tutorial
  - jp
description: |-
  DFINITYチュートリアル「Make inter-canister calls」日本語解説
---

## はじめに
当記事は、DFINITYのMotokoのチュートリアルを日本語で解説しています。

[Make inter-canister calls](https://smartcontracts.org/docs/developers-guide/tutorials/intercanister-calls.html)


はじめての方は先にこちらをご覧ください。

[5ステップではじめるMotokoプログラミング](/hello-motoko)

### 実行環境
* dfx: 0.6.22
* macOS: 11.5.2
* npm version: 8.1.3

### dfx 0.6.22のインストール
執筆時のdfxの最新バージョンは0.8.4ですが、このプログラムは0.8.xでは動作しません。
0.6.22を指定してインストールします。チュートリアルが終わったら最新バージョンに戻しましょう。

```
DFX_VERSION=0.6.22 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

## 手順
### プロジェクトの作成

GitHubからプロジェクトを取得します。
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
### キャニスターID
当プロジェクトには3つのキャニスターを作っています。

* connectd
* linkedup
* linkedup_assets

キャニスターをブラウザ経由で実行します。
ブラウザ経由で実行する時に、各キャニスターのIDをURLで指定します。

キャニスターIDは、ビルドやデプロイ時に表示されます。
もし記録していなくてものファイルを見ればわかります。

`linkedup/.dfx/local/canister_ids.json`
```
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
127.0.0.1は自分のPCにアクセスするためのIPアドレスです。
```
http://127.0.0.1:8000/?canisterId=<ic-identifier-for-linkedup-assets>
```

linkedup_assetsのキャニスターIDに置き換えたURLをブラウザで開きます。
```
http://127.0.0.1:8000/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai
```

Linkedinそっくりのサイトが表示されました笑
![Linkedup](/media/linkedup/1.png)

自分の名前や組織名を入力して保存します。
![Linkedup](/media/linkedup/2.png)


シークレットウィンドウでもう1つブラウザを開きます。
URLは先ほどと同じです。

シークレットウィンドウではまた新しいユーザーを作成します。
ウィンドウごとにそれぞれの2つのユーザープロファイルを作成できました。

![Linkedup](/media/linkedup/6.png)

それぞれのWindowで相手を検索したり、CONNECTをクリックしたり、自由に試してみましょう。
どんな操作もだいたい2~3秒遅れて反応すると思います。


## 実行環境の停止

終わったらローカルPC上の実行環境を停止します。
```
dfx stop
```