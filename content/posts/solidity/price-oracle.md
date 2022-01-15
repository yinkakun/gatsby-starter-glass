---
title: "Solidity入門: オラクルを使う（Chainlink Price Oracle)"
date: 2022-01-13 21:00
permalink: /price-oracle
tags:
  - solidity
  - oracle
  - chainlink
  - jp
description: |-
  イーサリアムでChainlinkオラクルを使う方法を解説
---

このページはこんな人におすすめ

- イーサリアム上で価格情報を使いたい
- スマートコントラクトのオラクルについて知りたい
- Chainlink の Ethereum Data Feed を使いたい

Solidity by Example のサンプルコードを使ってスマートコントラクトを作る方法を解説します。

[Price Oracle (Solidity by Examples)](https://solidity-by-example.org/defi/chainlink-price-oracle/)

このページで実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/solidity-example/tree/main/price-oracle)からダウンロードできます。

## 新しい Hardhat プロジェクトを作る

first-app というディレクトリを作り
npm パッケージの hardhat をインストールします。

```
mkdir first-app
cd first-app
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

以下のファイルを作ります。

#### contracts/ChainlinkPriceFeed.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainlinkPriceOracle {
    AggregatorV3Interface internal priceFeed;

    constructor() {
        // ETH / USD
        priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
    }

    function getLatestPrice() public view returns (int256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return price / 1e8;
    }
}

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}
```

Solidity by Example のコードをベースに PriceFeed のコントラクトアドレスを Rinkeby のアドレスに置換しています。

#### [Ethereum Data Feed](https://docs.chain.link/docs/ethereum-addresses/)

Rinkeby Testnet (ETH / USD)

- 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e

## デプロイ (Rinkeby テストネット)

必要なもの

- Rinkeby のアカウント（秘密鍵）
- Rinkeby の RPC エンドポイント（Alchemy を利用）
- Rinkeby の ETH 少量

Hardhat でデプロイする方法の詳細は[こちら](/hardhat)
参照先は Ropsten 用に書かれているので、Rinkeby に読み替えてください。

Hardhat の設定ファイルを作ります。

#### hardhat.config.js

```js
require("@nomiclabs/hardhat-waffle");

const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    rinkeby: {
      url: `${RINKEBY_RPC_URL}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
    },
  },
};
```

#### scripts/deploy.js

デプロイスクリプトを用意します。

```js
const hre = require("hardhat");

async function main() {
  const Factory = await hre.ethers.getContractFactory("ChainlinkPriceOracle");
  const contract = await Factory.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

以下のコマンドを実行してコンパイルします。

```
npx hardhat compile
```

以下のコマンドを実行して、rinkeby テストネットにデプロイします。

```
npx hardhat run scripts/deploy.js --network rinkeby
```

```
出力
Contract deployed to: 0xc701F8eaeF74f3DE1FEe8613855884d02CfE9517
```

デプロイが成功すると上記のようにコントラクトアドレスが表示されます。

## 実行

Rinkeby の Etherscan を使って getLatestPrice 関数を実行してみましょう。

- Rinkeby の Etherscan を開く
  - https://rinkeby.etherscan.io
- 自分がデプロイしたコントラクトアドレスを検索する
- Contract タブの Read Contract をクリック
- getLatestPrice 関数をクリック

![Etherscan](/media/price-oracle/1.png)

現在の Chainlink の PriceFeed コントラクト(ETH/USD)から取得した値が表示されます。

もし、自分のコントラクトがうまくいかない場合は、筆者がデプロイしたコントラクトで試してみましょう。
https://rinkeby.etherscan.io/address/0xc701F8eaeF74f3DE1FEe8613855884d02CfE9517

### 解説

デプロイしたコントラクトの中では Chainlink の PriceFeed のコントラクトを実行しています。
そのコントラクトは同じネットワーク(Rinkeby)上にデプロイされたコントラクトです。

https://rinkeby.etherscan.io/address/0x8A753747A1Fa494EC906cE90E9f37563A8AF630e

PriceFeed コントラクトの latestRoundData()は手動でも実行できます。

この関数の戻り値の中の 2 番目の answer が ETH/USD の価格を表しています。

ただし、以下の 2 つの結果は単位が違います。

- PriceFeed コントラクトの latestRoundData(): 321770736905
- 自分が作ったコントラクトの getLatestPrice(): 3217

今回デプロイしたコードは以下のようになっています。

```
        ) = priceFeed.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return price / 1e8;
```

PriceFeed コントラクトの結果を 10 の 8 乗で除しています。
getLatestPrice()の戻り値は、int256 型なので小数点以下は切り捨てられます。

321,770,736,905 / 100,000,000 = 3,217(int256)
