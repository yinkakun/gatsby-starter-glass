---
title: "Solidity入門: First Application"
date: 2022-01-04 23:00
permalink: /first-app
tags:
  - solidity
  - hardhat
  - beginner
  - jp
description: |-
  Solidity by ExmaplesのFirst ApplicationをHardhatで作ります
---

# 当記事は執筆の途中です

プレビューに便利なので公開状態にしています
完成までもうしばらくお待ち下さい笑

## はじめに

当記事は、Solidity by Exampleのサンプルコードを使ってスマートコントラクトを作る方法を解説します。

https://solidity-by-example.org/first-app/

Hardhatを使ったことがない場合は、こちらをどうぞ

[Hardhatでスマートコントラクトを作ろう！](/hardhat)

## 手順
### 新しいHatdhatプロジェクトを作る
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

### コーディング
contracts/Greeter.solとhardhat.config.jsを編集します。
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

### デプロイ
#### ローカル実行環境を起動
ターミナルウィンドウを2つ開いて、片方でnodeを起動します
```
npx hardhat node
```

デプロイスクリプトは以下のように編集します
#### scripts/sample-script.js
```js
const hre = require("hardhat");

async function main() {
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();

  await counter.deployed();

  console.log("Counter deployed to:", counter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```
