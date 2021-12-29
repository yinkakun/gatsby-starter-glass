---
title: 5ステップではじめるMotokoプログラミング【Dfinity開発】
date: 2021-08-15 19:38
tags:
  - Dfinity
  - ICP
  - motoko
  - beginner
  - jp
social_image: /media/dfinity.jpeg
description: |-
  The Quick start provided a simplified introduction to the basic work flow for creating and deploying a new project without exploring the contents of the project directory or sample code.
---
この記事はこんな人におすすめです

* Motokoを使って開発を始めたい
* Dfinity(Internet Computer)に興味がある
* はじめてDAppsやブロックチェーンで開発したい
* 新しい技術好きのエンジニア
* 将来Webエンジニアになりたい

ぼくは2017年ごろからブロックチェーンを触り、2021年現在はWeb系のグローバルスタートアップで働く本業の傍らで、ブロックチェーンを使ったサービスを開発しています。

Dfinity(Internet Computer)は2021年5月に開始したサービスで、これまでの一般的なWeb開発をもっとシンプルに変えてくれる、革新的な技術を使っています。インターネットそのものをTCP/IPのレイヤーから見直して再設計しており、裏側ではブロックチェーンの技術を使っています。

誰でもパソコンさえあれば、無料で簡単に始めることができるので、まずは実際にやってみましょう。


## はじめに
当記事で紹介する５つのステップは、Dfinityの公式ページに簡潔にまとまっています。

https://smartcontracts.org/

### 必要なスキル、前提知識
当記事を進めるためには、以下のスキルが必要です。

* ターミナル等を使ってコマンドを入力できる（必須）
* npmコマンドを実行できる（任意）

コマンドは、cdとlsが使えれば大丈夫です。

ステップ5でライブラリを使うためにnpmが登場しますが、必須ではありません。
ブラウザ経由でスマートコントラクトを実行するためにnpmを使っています。
npmがわからなくてもステップ4までは進めらるので、実際にスマートコントを実行するところまでできます。

### 実行環境
本記事では以下のMac環境を使った開発を紹介しています。

* Mac OS 11.4 Big Sur
* テキストエディタ：Visual Studio Code 1.59
* ターミナルソフト：iTerm2 3.4.8
* dfx：0.8.0
* npm：7.19.1

## ステップ1: dfx(SDK)をインストールする

ターミナルソフトで以下のコマンドを実行します。

```
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

これでSDKのインストールは完了です。
dfxコマンドを実行できるようになります。

```
$ dfx --version
dfx 0.8.0
```

## ステップ2: Hello Worldプロジェクトを作る

自分の好きな作業用ディレクトリを作って移動します。ぼくはdfinityというディレクトリを作っています。

```
mkdir dfinity
cd dfinity
```

dfinityディレクトリの中にhelloという名前のHello Worldプロジェクトを作ります。

```
dfx new hello
cd hello
```

lsコマンドでどんなファイルがあるか見てみましょう。

```
$ ls
README.md dfx.json dist node_modules package-lock.json package.json src webpack.config.js
```

## ステップ3: PC版のテスト用Internet Computerを起動する

helloディレクトリにいる状態で、ローカルPC上でテスト用のIC(Internet Computer)を起動します。

```
dfx start --background
```

以下のようなログが表示されると思います。

```
 Aug 15 07:21:45.751 INFO Starting server. Listening on http://127.0.0.1:8000/
```

これであなたのPC上にテスト用のInternet Computerが起動できました。以下のようにdfx pingコマンドを打つと、つながるかどうか疎通確認できます。

```
$ dfx ping
{
  "ic_api_version": "0.18.0"  "impl_hash": "1d09d8fdb066fbcffb985723d80d1f5f9a9de13d96e5917bfe457f4137c0dff8"  "impl_version": "0.8.0"  "root_key": [48, 129, 130, 48, 29, 6, 13, 43, 6, 1, 4, 1, 130, 220, 124, 5, 3, 1, 2, 1, 6, 12, 43, 6, 1, 4, 1, 130, 220, 124, 5, 3, 2, 1, 3, 97, 0, 164, 194, 27, 103, 26, 186, 6, 75, 190, 145, 12, 226, 253, 93, 187, 228, 81, 124, 224, 79, 94, 196, 17, 45, 223, 7, 30, 230, 145, 43, 245, 255, 2, 2, 226, 148, 7, 241, 59, 108, 130, 103, 65, 134, 33, 88, 43, 10, 12, 123, 233, 74, 119, 101, 238, 144, 133, 101, 128, 190, 155, 19, 56, 154, 43, 253, 112, 146, 58, 236, 130, 163, 147, 61, 25, 163, 243, 23, 253, 84, 170, 3, 60, 72, 199, 18, 205, 111, 243, 90, 241, 137, 121, 21, 58, 168]
}
```

上記のようにエラーではなくJSONフォーマットの謎の数字が返ってきたら成功です。

## ステップ4: ビルドしてデプロイする

helloディレクトリにいる状態で、以下のコマンドを実行してフロントエンド用のライブラリをインストールします。

```
npm install
```

npmを使ってJavaScriptのライブラリをインストールしています。

フロントエンドのプログラムはChromeなどのブラウザで実行することになるので、Dfinityの場合でも、そうじゃなくても同じJavaScriptを使います。

続いて、Hello WorldプログラムをビルドしてローカルPC上のICにデプロイします。

```
dfx deploy
```

このコマンドでは、以下の3つのことをまとめてやってくれます。

* テスト用Internet Computerにキャニスターを作る（IDを取得する）
* Motokoで書いたソースコードをコンパイルして、WASM実行プログラムを作る
* WAS実行プログラムをキャニスターにインストールする

キャニスターやWASMについて今はわからなくても大丈夫です。この３つはそれぞれ以下のコマンドで個別に実行することができます。

* dfx canister create
* dfx build
* dfx canister install

dfx deployはこの３つをまとめて、しかも終わっていないところだけを実行してくれる便利なコマンドです。

## ステップ5: Hello Worldプログラムを実行する

以下のコマンドを実行すると、ローカルPC上のInternet Computerで動くキャニスターを実行することができます。

```
dfx canister call hello greet everyone
```

helloというキャニスターのgreetという命令を、everyoneというパラメータで実行しています。下のように結果が返ってきたら成功です！

```
$ dfx canister call hello greet everyone
("Hello, everyone!")
```

作ったプログラムをブラウザで呼び出してみましょう。

フロントエンドのプログラムを起動します

```
npm start
```

以下のURLにブラウザでアクセスして、起動したフロントエンド用のページにアクセスします。

<http://localhost:8080>

![icp](/media/hello-icp-1.png)

名前をいれてクリックしてみましょう、先程ローカルのICにデプロイしたキャニスターを実行して結果をブラウザで表示します。

![icp](/media/hello-icp-2.png)

今は、ローカルPC上のテスト用のInternet Computerにデプロイしたプログラム（キャニスター）を呼び出しています。

これからICPトークンやCycleトークンを使って、インターネット上のInternet Computerにキャニスターをデプロイすることで、世界中のどこからでも自分の作るキャニスターを呼び出せるようになります。

ようこそ、Internet Computerの世界へ！

Dfinity(Internet Computer)を使った最新の開発情報をTwitterで発信しています。

[@motosakanosita](https://twitter.com/motosakanosita)
