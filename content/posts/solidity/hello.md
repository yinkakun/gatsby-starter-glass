---
title: "イーサリアム入門: はじめてのスマートコントラクト【Solidity】"
date: 2022-01-09 21:00
permalink: /hello
tags:
  - solidity
  - Ethereum
  - beginner
  - jp
description: |-
  Hardhatを使い、Solidity by Exampleのスマートコントラクトを作ります。
---

このページはこんな人におすすめ

* スマートコントラクト開発を始める
* ブロックチェーン開発に興味がある
* DappsやWeb3に興味がある

ブロックチェーンを使った開発をまったくやったことがない方に向けて書いています。

## 本記事で学べること
Solidityという言語を使ってHello Worldのスマートコントラクトを作ります。
ローカル実行環境に作るところから始めましょう。
ローカル実行環境にはHardhatという開発ツールを使います。

スマートコントラクトの開発は、ブロックチェーンと開発言語を選ぶことになります。
2022年現在、もっとも開発が活発に進んでいるのはEthereumです。

EthereumのスマートコントラクトはEVM（Ethereum Virtual Machine）で実行されます。

### EVMとWASM
スマートコントラクトの実行形式は大まかにEVMとWASM(WebAssembly)の２つに分類できます。

EVMのスマートコントラクトの開発言語はSolidityです。

EVM対応のブロックチェーンは互換性があり、別のチェーンでも同じソースコードを使えます。
例えば、Ethereum用のスマートコントラクトのソースコードをPolygonでそのまま使うことができます。

WASM対応のブロックチェーンは、チェーンごとにそれぞれの特徴があるので、スマートコントラクトのソースコードを使い回すことはできません。

現在はWASMにコンパイルする開発言語はRustが主流ですが、技術的にはWASMにコンパイルできればどんな言語も使えます。

### 必要なもの

* npm & npxコマンド
* 好みのテキストエディタ
* 好みのターミナルソフト

## 新しいHatdhatプロジェクトを作る
helloというディレクトリを作り
npmパッケージのhardhatをインストールします。
```
mkdir hello
cd hello
npm init -y
npm i --save-dev hardhat
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

## コーディング
contracts/Greeter.solを以下のように編集します。

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
SolidityのソースコードをHardhatのコンパイラでコンパイルします。
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
script/sample-script.jsを以下のように編集します。

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
このスクリプトでは、ローカル実行環境にデプロイしたあとにスマートコントラクトのhello()という関数を実行します。

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
