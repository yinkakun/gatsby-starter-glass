---
title: "Solidity入門: Variables"
date: 2022-01-06 21:00
permalink: /variables
tags:
  - Solidity
  - Hardhat
  - beginner
  - jp
description: |-
  Solidity by ExmaplesのVariablesをHardhatで作ります
---

# この記事は執筆の途中です、

完成までしばらくお待ち下さい

このページはこんな人におすすめ

- Solidity を学びたい
- 簡単なスマートコントラクトの作り方を知りたい
- Hardhat の使った開発方法を知りたい

Solidity by Example のサンプルコードを使ってスマートコントラクトを作る方法を解説します。

https://solidity-by-example.org/variables/

Hardhat を使ったことがない方はこちらからどうぞ

[Hardhat でスマートコントラクトを作ろう！](/hardhat)

このページで実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/solidity-example/tree/main/variables)からダウンロードできます。

## 新しい Hardhat プロジェクトを作る

first-app というディレクトリを作り
npm パッケージの hardhat をインストールします。

```
mkdir variables
cd variables
npm init -y
npm install --save-dev hardhat
```

Hardhat のサンプルプロジェクトを作ります。

```
npx hardhat
```

`Create a sample project`を選択して、すべて Yes で回答します。

```
? What do you want to do? …
❯ Create a sample project
  Create an empty hardhat.config.js
  Quit
```

これで hardhat.config.js の初期設定や ether.js などプラグインを追加した状態になります。
