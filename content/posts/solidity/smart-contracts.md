---
title: "イーサリアム入門: はじめてのスマートコントラクト開発【Solidity】"
date: 2022-01-09 21:00
permalink: /smart-contracts
tags:
  - Solidity
  - Ethereum
  - beginner
  - jp
description: |-
  スマートコントラクト開発の基本: Solidity初心者に向けた解説
  ブロックチェーンのDapps開発とは？
---

このページはこんな人におすすめ

- スマートコントラクト開発を始める
- ブロックチェーン開発に興味がある
- Dapps や Web3 に興味がある

ブロックチェーンを使った開発をまったくやったことがない方に向けて書いています。

## 本記事で学べること

Solidity という言語を使って Hello World のスマートコントラクトを作ります。
ローカル実行環境に作るところから始めましょう。
ローカル実行環境には Hardhat という開発ツールを使います。

スマートコントラクトの開発は、ブロックチェーンと開発言語を選ぶことになります。
2022 年現在、もっとも開発が活発に進んでいるのは Ethereum です。

Ethereum のスマートコントラクトは EVM（Ethereum Virtual Machine）で実行されます。

### EVM と WASM

スマートコントラクトの実行形式は大まかに EVM と WASM(WebAssembly)の２つに分類できます。

EVM のスマートコントラクトの開発言語は Solidity です。

EVM 対応のブロックチェーンは互換性があり、別のチェーンでも同じソースコードを使えます。
例えば、Ethereum 用のスマートコントラクトのソースコードを Polygon でそのまま使うことができます。

WASM 対応のブロックチェーンは、チェーンごとにそれぞれの特徴があるので、スマートコントラクトのソースコードを使い回すことはできません。

現在は WASM にコンパイルする開発言語は Rust が主流ですが、技術的には WASM にコンパイルできればどんな言語も使えます。

### 必要なもの

- npm & npx コマンド
- 好みのテキストエディタ
- 好みのターミナルソフト

## 新しい Hardhat プロジェクトを作る

hello というディレクトリを作り
npm パッケージの hardhat をインストールします。

```
mkdir hello
cd hello
npm init -y
npm i --save-dev hardhat
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

## コーディング

contracts/Greeter.sol を以下のように編集します。

#### contracts/Greeter.sol

```solidity
// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.10 and less than 0.9.0
pragma solidity ^0.8.9;

contract Greeter {
    string public greet = "Hello World!";

    function hello() external view returns (string memory) {
        return greet;
    }
}
```

## コンパイル

Solidity のソースコードを Hardhat のコンパイラでコンパイルします。
以下のコマンドを実行します。

```
npx hardhat compile
```

```
出力
Compiling 1 file with 0.8.9
Compilation finished successfully
```

## デプロイ

script/sample-script.js を以下のように編集します。

#### script/sample-script.js

```js
const hre = require("hardhat");

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy();

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);
  const ret = await greeter.hello();
  console.log(ret);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

このスクリプトでは、ローカル実行環境にデプロイしたあとにスマートコントラクトの hello()という関数を実行します。

### 実行

以下のコマンドで実行します。

```
 % npx hardhat run scripts/sample-script.js
```

```
出力
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Hello World!
```

hello()関数を実行して、受け取った文字列`Hello World!`をログに表示できました。

これでスマートコントラクトエンジニアです！

次はスマートコントラクトをブロックチェーンにデプロイして実行してみよう。

スマートコントラクトをテストネットやメインネットにデプロイする方法を 2 つ紹介します。
自分にあったやり方を見つけてください。

- [Hardhat でスマートコントラクトを作ろう！](/hardhat)
- [Remix の使い方](/remix-tutorial)
