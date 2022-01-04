---
title: "Solidity入門: Hardhatでスマートコントラクトを作ろう！"
date: 2022-01-04 22:00
permalink: /hardhat
tags:
  - solidity
  - hardhat
  - beginner
  - jp
description: |-
  Hardhatのチュートリアルを日本語で解説

---

この記事はこんな人におすすめ

* Solidityを学習したい
* テストネットやメインネットにスマートコントラクトを作りたい
* オリジナルのNFTをコードから書きたい

## はじめに

Hatdhatは2022年現在、Solidityエンジニアの間でもっともよく使われている開発ツールの１つです。

Hardhat以外によく使われるツールとしてTruffleがありますが、Hardhatの方が新しくビルドやテストでより使いやすくなっています。

本記事では、Hardhatのチュートリアルを日本語で解説しています。
チュートリアルの中で、テストネットで実行するまでに必要な部分を抜粋しています。

https://hardhat.org/tutorial/

当記事で実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/solidity-example/tree/main/hardhat-tutorial)で公開しています。


## インストール

HardhatのDocumentにしたがいインストールを進めます。

https://hardhat.org/tutorial/setting-up-the-environment.html

Hardhatを使うには、Nodejsのパッケージマネージャnpmを使います。
PCのターミナルでnpmコマンドを実行できれば環境構築は完了です。

## 手順

hardhat-tutorialというnpm用のプロジェクトを作り、hardhatをインストールします。
```
mkdir hardhat-tutorial
cd hardhat-tutorial
npm init --yes
npm install --save-dev hardhat
```

hardhatコマンドを実行して、hardhatの設定ファイルを作ります。
```
npx hardhat
```

選択肢が表示されたら、`Create an empty hardhat.config.js`を選びます。

```
? What do you want to do? …
  Create a sample project
❯ Create an empty hardhat.config.js
  Quit
```

### プラグインの追加
ether.jsやwaffleといったHardhatのプラグインを追加します。
```
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
```

hatdhat.config.jsを以下のように編集します。
```js
require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};

```

### コーディング
プロジェクトにcontractsというディレクトリを作ります。
contractsディレクトリの中にToken.solというファイルを作り、下のコードを書きます。
```solidity
// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.7.0;


// This is the main building block for smart contracts.
contract Token {
    // Some string type variables to identify the token.
    // The `public` modifier makes a variable readable from outside the contract.
    string public name = "My Hardhat Token";
    string public symbol = "MHT";

    // The fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     */
    constructor() {
        // The totalSupply is assigned to transaction sender, which is the account
        // that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
```

### コンパイル
```
npx hardhat compile
```
```
出力
Downloading compiler 0.7.3
Compiling 1 file with 0.7.3
contracts/Token.sol: Warning: SPDX license identifier not provided in source file. Before publishing, consider adding a comment containing "SPDX-License-Identifier: <SPDX-License>" to each source file. Use "SPDX-License-Identifier: UNLICENSED" for non-open-source code. Please see https://spdx.org for more information.

Compilation finished successfully

```
### テスト
プロジェクトの直下にtestというディレクトリを作ります。
testディレクトリの中にToken.jsというファイルを作り、以下のコードを書きます。

```js
const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});
```

コンパイル済みのスマートコントラクトに対して上のテストコードを使ってテストを実行します。
```
npx hardhat test
```
```
  Token contract
    ✓ Deployment should assign the total supply of tokens to the owner (565ms)


  1 passing (569ms)
```

## テストネット(Ropsten)へのデプロイ
Ethereumのテストネット(Ropsten)にデプロイします。
チュートリアルでオススメされているRopstenを使って説明します。
テストネットのデプロイには以下の3つが必要です。

* Ropstenのアカウントの秘密鍵
* RopstenのETHトークン
* RPCエンドポイントのURL

#### Ropstenのアカウントの秘密鍵
Metamaskでアカウントを作ってPrivate Keyをエクスポートすれば取得できます。
念のため、本番で使っているアカウントと分けることをおすすめします。

#### RopstenのETHトークン
0.01ETHぐらいあればデプロイには足りると思います。
テストネットはFaucetという無料でトークンをもらえるサイトが存在するのでググって入手してください。

#### RPCエンドポイントのURL
HardhatではAlckemyというノードプロバイダーを使っています。
無料で使えるのでAlchemyはオススメです。
Alchemyでユーザー登録すれば、API KEYとRPCサーバのURLを取得できるのでそれを使います。

もう1つの簡単な方法はMetamaskで使われているINFURAというノードプロバイダーのRPCサーバです。
こちらはAPI Keyは不要なので、ここではこちらを使って説明します。
MetamaskのNetworkの設定を開くとRopstenのエンドポイントの設定内容がみれます。

#### GitにCommitしないように環境変数を使おう
以下の2つの環境変数をエクスポートしてhardhat実行時に使えるようにします。
* `ROPSTEN_PRIVATE_KEY`
* `ROPSTEN_RPC_URL`

```
export ROPSTEN_PRIVATE_KEY="<RopstenのアカウントのPrivate Key>"
export ROPSTEN_RPC_URL="https://ropsten.infura.io/v3/xxxxxxxx"
```

hatdhat.config.jsを以下のように編集します。
#### hardhat.config.js
```js
require("@nomiclabs/hardhat-waffle");

const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;
const ROPSTEN_RPC_URL = process.env.ROPSTEN_RPC_URL;

module.exports = {
  solidity: "0.7.3",
  networks: {
    ropsten: {
      url: `${ROPSTEN_RPC_URL}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]
    }
  }
};
```

以下のコマンドでデプロイスクリプトを実行します。
```
npx hardhat run scripts/deploy.js --network ropsten
```
```
Deploying contracts with the account: 0x470815ee5b366755284C9e85f0D636F1e046d013
Account balance: 1288845007486614009
Token address: 0xfa9D0729c104841668E0DDeb433Cbc6107AB59C1
```

Etherscan(Ropsten)でコントラクトアドレスやトランザクションを確認してみましょう。

https://ropsten.etherscan.io/address/0xfa9D0729c104841668E0DDeb433Cbc6107AB59C1

Ropstenにスマートコントラクトをデプロイできました。

メインネット用のETHとRPCを使えば同じやり方でメインネットにデプロイすることもできます。

これで今日からSolidityエンジニア
さあ、Web3へ飛び出そう！
