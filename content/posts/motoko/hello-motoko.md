---
title: 5ステップではじめるMotoko/ICPプログラミング入門【初心者向け】
date: 2021-08-15 19:38
permalink: /hello-motoko
redirect_from:
  - /blog/hello-motoko
  - /blog/hello-motoko/
  - /hello-icp
  - /hello-icp/
pinned: 1
tags:
  - DFINITY
  - Motoko
  - beginner
  - ICP
social_image: /media/labs.png
description: |-
  ICP(Internet Computer Protocol)でMotokoを使ってDapps開発をはじめよう！
---

この記事はこんな人におすすめです

- Motoko でプログラミングを学びたい初心者
- DFINITY/ICP(Internet Computer Procotol)に興味がある
- ブロックチェーンや Dapps 開発に興味がある
- 将来 Web エンジニアになりたい

ぼくは 2017 年ごろからブロックチェーンを触り、2021 年現在は Web 系のグローバルスタートアップで働く本業の傍らで、ブロックチェーンを使ったサービスを開発しています。

DFINITY/ICP(Internet Computer Protocol)は 2021 年 5 月に開始したサービスで、これまでの一般的な Web 開発をもっとシンプルに変えてくれる、革新的な技術を使っています。インターネットそのものを TCP/IP のレイヤーから見直して再設計しており、裏側ではブロックチェーンの技術を使っています。

誰でもパソコンさえあれば、無料で簡単に始めることができるので、まずは実際にやってみましょう。

## はじめに

当記事で紹介する５つのステップは、DFINITY/ICP の公式ページに簡潔にまとまっています。

https://smartcontracts.org/

### 必要なスキル、前提知識

当記事を進めるためには、以下のスキルが必要です。

- ターミナル等を使ってコマンドを入力できる（必須）
- npm コマンドを実行できる（任意）

コマンドは、cd と ls が使えれば大丈夫です。

ステップ 5 でライブラリを使うために npm が登場しますが、必須ではありません。
ブラウザ経由でスマートコントラクトを実行するために npm を使っています。
npm がわからなくてもステップ 4 までは進めらるので、実際にスマートコントを実行するところまでできます。

### 実行環境

本記事では以下の Mac 環境を使った開発を紹介しています。

- Mac OS 11.4 Big Sur
- テキストエディタ：Visual Studio Code 1.59
- ターミナルソフト：iTerm2 3.4.8
- dfx：0.8.0
- npm：7.19.1

## ステップ 1: dfx(SDK)をインストールする

ターミナルソフトで以下のコマンドを実行します。

```sh
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

これで SDK のインストールは完了です。
dfx コマンドを実行できるようになります。

```sh
$ dfx --version
dfx 0.8.0
```

## ステップ 2: Hello World プロジェクトを作る

自分の好きな作業用ディレクトリを作って移動します。ぼくは dfinity というディレクトリを作っています。

```sh
mkdir dfinity
cd dfinity
```

dfinity ディレクトリの中に hello という名前の Hello World プロジェクトを作ります。

```sh
dfx new hello
cd hello
```

ls コマンドでどんなファイルがあるか見てみましょう。

```sh
$ ls
README.md dfx.json dist node_modules package-lock.json package.json src webpack.config.js
```

## ステップ 3: ローカル実行環境を起動する

hello ディレクトリにいる状態で、ローカル PC 上で実行環境を起動します。

```sh
dfx start --background
```

以下のようなログが表示されると思います。

```
 Aug 15 07:21:45.751 INFO Starting server. Listening on http://127.0.0.1:8000/
```

これであなたの PC 上にテスト用の Internet Computer が起動できました。以下のように dfx ping コマンドを打つと、つながるかどうか疎通確認できます。

```ts
$ dfx ping
{
  "ic_api_version": "0.18.0"  "impl_hash": "1d09d8fdb066fbcffb985723d80d1f5f9a9de13d96e5917bfe457f4137c0dff8"  "impl_version": "0.8.0"  "root_key": [48, 129, 130, 48, 29, 6, 13, 43, 6, 1, 4, 1, 130, 220, 124, 5, 3, 1, 2, 1, 6, 12, 43, 6, 1, 4, 1, 130, 220, 124, 5, 3, 2, 1, 3, 97, 0, 164, 194, 27, 103, 26, 186, 6, 75, 190, 145, 12, 226, 253, 93, 187, 228, 81, 124, 224, 79, 94, 196, 17, 45, 223, 7, 30, 230, 145, 43, 245, 255, 2, 2, 226, 148, 7, 241, 59, 108, 130, 103, 65, 134, 33, 88, 43, 10, 12, 123, 233, 74, 119, 101, 238, 144, 133, 101, 128, 190, 155, 19, 56, 154, 43, 253, 112, 146, 58, 236, 130, 163, 147, 61, 25, 163, 243, 23, 253, 84, 170, 3, 60, 72, 199, 18, 205, 111, 243, 90, 241, 137, 121, 21, 58, 168]
}
```

上記のようにエラーではなく JSON フォーマットの謎の数字が返ってきたら成功です。

## ステップ 4: ビルドしてデプロイする

hello ディレクトリにいる状態で、以下のコマンドを実行してフロントエンド用のライブラリをインストールします。

```
npm install
```

npm を使って JavaScript のライブラリをインストールしています。

フロントエンドのプログラムは Chrome などのブラウザで実行することになるので、DFINITY/ICP の場合でも、そうじゃなくても同じ JavaScript を使います。

続いて、Hello World プログラムをビルドしてローカル実行環境にデプロイします。

```
dfx deploy
```

このコマンドでは、以下の 3 つのことをまとめてやってくれます。

- ローカル実行環境にキャニスターを作る（ID を取得する）
- Motoko で書いたソースコードをコンパイルして、WASM 実行プログラムを作る
- WAS 実行プログラムをキャニスターにインストールする

キャニスターや WASM について今はわからなくても大丈夫です。この３つはそれぞれ以下のコマンドで個別に実行することができます。

- dfx canister create
- dfx build
- dfx canister install

dfx deploy はこの３つをまとめて、しかも終わっていないところだけを実行してくれる便利なコマンドです。

## ステップ 5: Hello World プログラムを実行する

以下のコマンドを実行すると、ローカル PC 上の Internet Computer で動くキャニスターを実行することができます。

```
dfx canister call hello greet everyone
```

hello というキャニスターの greet という命令を、everyone というパラメータで実行しています。下のように結果が返ってきたら成功です！

```
$ dfx canister call hello greet everyone
("Hello, everyone!")
```

作ったプログラムをブラウザで呼び出してみましょう。

フロントエンドのプログラムを起動します

```
npm start
```

以下の URL にブラウザでアクセスして、起動したフロントエンド用のページにアクセスします。

<http://localhost:8080>

![icp](/media/hello-motoko/1.png)

名前をいれてクリックしてみましょう、先程ローカルの IC にデプロイしたキャニスターを実行して結果をブラウザで表示します。

![icp](/media/hello-motoko/2.png)

今は、ローカル PC 上の実行環境にデプロイしたプログラム（キャニスター）を呼び出しています。

これから ICP トークンや Cycle トークンを使って、インターネット上の Internet Computer にキャニスターをデプロイすることで、世界中のどこからでも自分の作るキャニスターを呼び出せるようになります。

ICP(Internet Computer Protocol)の世界へようこそ

公式のチュートリアルや Examples を日本語で解説しています。

- [Explore the default project](/motoko-explore-hello)
- [Query using an actor](/motoko-actor-hello)
- [Pass text arguments](/motoko-location-hello)
- [Increment a natural number](/motoko-my-counter)
- [Use integers in calculator functions](/motoko-calc)
- [Import library modules](/motoko-phonebook)
- [Use multiple actors](/motoko-multiple-actors)
- [Make inter-canister calls](/motoko-linkedup)
- [Add access control with identities](/access-hello)
- [Accept cycles from a wallet](/cycles-hello)

DFINITY/ICP やいろんなブロックチェーンを使った開発情報を Twitter で発信しています。
[@motosakanosita](https://twitter.com/motosakanosita)
