---
title: "Motoko Tutorial: Add access control with identities"
date: 2022-01-02 20:38
permalink: /access-hello
tags:
  - motoko
  - Tutorial
  - jp
description: |-
  DFINITYチュートリアル「Add access control with identities」の日本語解説
  実際に使ったコードをGitHubで公開
---

## はじめに
当記事は、DFINITYのMotokoのチュートリアルを日本語で解説しています。
当記事で実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/access_hello)で公開しています。

[Add access control with identities](https://smartcontracts.org/docs/developers-guide/tutorials/access-control.html)

はじめての方は先にこちらをご覧ください。

[5ステップではじめるMotokoプログラミング入門](/hello-motoko)

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
dfx new actor_hello
cd actor_hello
```
