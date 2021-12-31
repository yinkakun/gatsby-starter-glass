---
title: "Motoko Tutorial: Pass text arguments"
date: 2021-12-29 21:00
slug: /motoko-location-hello
tags:
  - motoko
  - Tutorial
  - jp
description: |-
  DFINITYチュートリアル「Pass text arguments」の日本語解説
  実際に使ったコードをGitHubで公開
---

## はじめに
当記事は、DFINITYのMotokoのチュートリアルを日本語で解説しています。
当記事で実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/location_hello)で公開しています。

[Pass text arguments](https://smartcontracts.org/docs/developers-guide/tutorials/hello-location.html)

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

## 本プロジェクトで学ぶこと


## 手順
### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new location_hello
cd location_hello
```
### コーディング
`src/location_hello/main.mo`
```
actor {
  public func location(city : Text) : async Text {
    return "Hello, " # city # "!";
  };
};
```
location()という関数を定義します。
location()はcityというTextの引数を取り、Textを返します。

### 実行環境の起動
```
dfx start
```

### ビルド＆デプロイ
```
dfx deploy
```

### 実行

```
dfx canister call location_hello location "San Francisco"
```

```
出力
("Hello, San Francisco!")
```

```
dfx canister call location_hello location Paris
```
```
出力
("Hello, Paris!")
```

```
dfx canister call location_hello location '("San Francisco and Paris")'
```
```
出力
("Hello, San Francisco and Paris!")
```

location_helloのlocation関数に、複数の都市名を渡してみましょう。
```
dfx canister call location_hello location '("San Francisco","Paris","Rome")'
```
複数の都市名を渡しても、このlocation()関数は、city1つしか受け取らないので、最初の引数だけが使われます。
```
出力
("Hello, San Francisco!")
```

### 実行環境の停止
終わったらローカルPC上の実行環境を停止します。
```
dfx stop
```