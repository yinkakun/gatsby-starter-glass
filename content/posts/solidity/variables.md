---
title: "Solidity入門: Variables"
date: 2022-01-06 21:00
permalink: /variables
tags:
  - solidity
  - hardhat
  - beginner
  - jp
description: |-
  Solidity by ExmaplesのVariablesをHardhatで作ります
---

# この記事は執筆の途中です、
完成までしばらくお待ち下さい

このページはこんな人におすすめ

* Solidityを学びたい
* 簡単なスマートコントラクトの作り方を知りたい
* Hardhatの使った開発方法を知りたい

Solidity by Exampleのサンプルコードを使ってスマートコントラクトを作る方法を解説します。

https://solidity-by-example.org/variables/

Hardhatを使ったことがない方はこちらからどうぞ

[Hardhatでスマートコントラクトを作ろう！](/hardhat)

このページで実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/solidity-example/tree/main/variables)からダウンロードできます。


## 新しいHatdhatプロジェクトを作る
first-appというディレクトリを作り
npmパッケージのhardhatをインストールします。
```
mkdir variables
cd variables
npm init -y
npm install --save-dev hardhat
```

Hardhatのサンプルプロジェクトを作ります。
```
npx hardhat
```
`Create a sample project`を選択して、すべてYesで回答します。
```
? What do you want to do? …
❯ Create a sample project
  Create an empty hardhat.config.js
  Quit
```

これでhardhat.config.jsの初期設定やether.jsなどプラグインを追加した状態になります。
