---
title: "Solidity入門: First Application"
date: 2022-01-05 21:00
permalink: /first-app
tags:
  - solidity
  - hardhat
  - beginner
  - jp
description: |-
  Solidity by ExmaplesのFirst ApplicationをHardhatで作ります
---

このページはこんな人におすすめ

* Solidityを学びたい
* 簡単なスマートコントラクトの作り方を知りたい
* Hardhatを使ったSolidityのテスト方法を知りたい

Solidity by Exampleのサンプルコードを使ってスマートコントラクトを作る方法を解説します。

https://solidity-by-example.org/first-app/

Hardhatを使ったことがない方はこちらからどうぞ

[Hardhatでスマートコントラクトを作ろう！](/hardhat)

このページで実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/solidity-example/tree/main/first-app)からダウンロードできます。


## 新しいHatdhatプロジェクトを作る
first-appというディレクトリを作り
npmパッケージのhardhatをインストールします。
```
mkdir first-app
cd first-app
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
contracts/Counter.solとhardhat.config.jsを編集します。
2つのSolidityバージョンが一致するようにしましょう。

#### contracts/Counter.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Counter {
    uint public count;

    // Function to get the current count
    function get() public view returns (uint) {
        return count;
    }

    // Function to increment count by 1
    function inc() public {
        count += 1;
    }

    // Function to decrement count by 1
    function dec() public {
        count -= 1;
    }
}
```

2022年1月現在、サンプルコードのバージョンは0.8.10になっており、
Hardhat側は0.8.9まで対応中なので、0.8.9に合わせます。

#### hardhat.config.jsの一部
```js
module.exports = {
  solidity: "0.8.9",
};
```

## テスト
HardhatではJavaScriptのテストツールのchaiを使っています。
sample-test.jsを以下のように編集します。
#### test/sample-test.js
```js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  let Factory;
  let contract;

  // 各テストの前に毎回デプロイ処理が走ります
  beforeEach(async function () {
    Factory = await ethers.getContractFactory("Counter");
    contract = await Factory.deploy();
  })

  // 初期状態でget()の戻り値が0であること
  it("Should be 0", async function () {
    expect(await contract.get()).to.equal(0);
  });

  // inc()を実行すると+1されること
  it("Should be 1 after inc()", async function () {
    const Tx = await contract.inc();
    await Tx.wait();
    expect(await contract.get()).to.equal(1);
  });

  // dec()を実行すると-1されること
  it("Should be 0 after inc() and dec()", async function () {
    const Tx1 = await contract.inc();
    await Tx1.wait();
    expect(await contract.get()).to.equal(1);
    const Tx2 = await contract.dec();
    await Tx2.wait();
    expect(await contract.get()).to.equal(0);
  });

});

```

### テスト実行
以下のコマンドを実行するとtestディレクトリ配下にあるテストが実行されます。
```
npx hardhat test
```
```
出力
  Counter
    ✓ Should be 0
    ✓ Should be 1 after inc()
    ✓ Should be 0 after inc() and dec()


  3 passing (406ms)
```
3つのテストがすべてPass(成功)となりました。

## デプロイ
スマートコントラクトをテストネットやメインネットにデプロイする方法を2つ紹介します。

* [Hardhatでスマートコントラクトを作ろう！](/hardhat)
* [Remixの使い方](/remix-tutorial)