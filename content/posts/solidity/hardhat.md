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
  スマートコントラクトをテストネット(Ropsten)にデプロイする方法

---

このページはこんな人におすすめ

* Solidityを学習したい
* テストネットやメインネットにスマートコントラクトを作りたい
* オリジナルのNFTをコードから書きたい

Hatdhatは2022年現在、Solidityエンジニアの間でもっともよく使われている開発ツールの１つです。

Hardhat以外によく使われるツールとしてはTruffleがあります。
Hardhatの方が新しくビルドやテストでより使いやすくなっています。

このページでは、Hardhatのチュートリアルを日本語で解説しています。
チュートリアルの中からテストネットでの実行に必要な部分を抜粋しています。

https://hardhat.org/tutorial/

このページで実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/solidity-example/tree/main/hardhat-tutorial)からダウンロードできます。


## インストール

HardhatのDocumentにしたがいインストールを進めます。

https://hardhat.org/tutorial/setting-up-the-environment.html

Hardhatを使うには、Nodejsのパッケージマネージャnpmを使います。

Hardhatはプロジェクトごとにインストールするので、この時点ではPCのターミナルでnpmコマンドを実行できれば環境構築は完了です。

### Hardhatプロジェクトの作成
hardhat-tutorialというnpm用のプロジェクトを作り、hardhatをインストールします。
```
mkdir hardhat-tutorial
cd hardhat-tutorial
npm init --yes
npm install --save-dev hardhat
```
新しいプロジェクトにHardhatをインストールできました。
hardhatコマンドを実行して、hardhatの設定ファイルを作ります。
```
npx hardhat
```
npxというコマンドはnpmによってインストールしたコマンドを実行するためのコマンドです。
npmでインストールしたコマンドをそのまま入力しても見つけられないのでnpxを使います。

選択肢が表示されたら、`Create an empty hardhat.config.js`を選びます。
```
? What do you want to do? …
  Create a sample project
❯ Create an empty hardhat.config.js
  Quit
```

プロジェクトディレクトリにHardhatの設定ファイル`hardhat.config.js`が作られます。

`Create a sample project`を選択すれば、このあとの作業をもっと簡単にすすめることができます。

ここではプロジェクトの構成を理解するために、1つ1つ自分で作っていきましょう。

### プラグインの追加
ether.jsやwaffleといったHardhatのプラグインを追加します。
```
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
```

## スマートコントラクトの作成
### コーディング
hardhat.config.jsを以下のように編集します。
#### hardhat.config.js
```js
require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};

```
執筆時点でのHardhatのドキュメントのコードをそのまま使っています。
Solidityのバージョンが少し古いので、バージョン番号は適宜更新してください。

プロジェクトにcontractsというディレクトリを作りましょう。
contractsディレクトリの中にToken.solというファイルを作り、下のコードを書きます。
#### contracts/Token.sol
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
hardhatコマンドを実行します。
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

#### test/Token.js
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

### 環境変数
秘密鍵やAPI KeyなどのクレデンシャルはGitにcommitしないようにする必要があります。
そこで、以下の2つの環境変数をエクスポートしてhardhat実行時に使えるようにします。
* `ROPSTEN_PRIVATE_KEY`
* `ROPSTEN_RPC_URL`

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


ターミナルで以下のコマンドを実行します。
```
export ROPSTEN_PRIVATE_KEY="<RopstenのアカウントのPrivate Key>"
export ROPSTEN_RPC_URL="https://ropsten.infura.io/v3/xxxxxxxx"
```
設定した値を確認してみましょう。
```
echo "ROPSTEN_PRIVATE_KEY: $ROPSTEN_PRIVATE_KEY"
echo "ROPSTEN_RPC_URL: $ROPSTEN_RPC_URL"
```
このときにエクスポートした環境変数は、このコマンドを実行したターミナルウィンドウだけ使えるようになります。


環境変数を設定したターミナルウィンドウで以下のコマンドを実行します。
```
npx hardhat run scripts/deploy.js --network ropsten
```
```
Deploying contracts with the account: 0x470815ee5b366755284C9e85f0D636F1e046d013
Account balance: 1288845007486614009
Token address: 0xfa9D0729c104841668E0DDeb433Cbc6107AB59C1
```
このようなログが表示されたらテストネットへのデプロイが正常に実行されています。

Etherscan(Ropsten)でコントラクトアドレスやトランザクションを確認してみましょう。

https://ropsten.etherscan.io/address/0xfa9D0729c104841668E0DDeb433Cbc6107AB59C1

### Metamaskで確認
Hardhatのチュートリアルには載っていませんが、せっかくトークンを作ったのでMetamaskに登録してみましょう。

deploy.jsを実行した際に出力された`Token address`をMetamaskに登録します。
![Metamask](/media/hardhat/1.png)

これで1,000,000 MHTが見えるようになります。

これはToken.solというサンプルコードであなたが作った'My Hardhat Token'です。

ほかのアドレスに送ることもできます。自由に試してください。

メインネット用のETHとRPCを使えば同じやり方でメインネットにデプロイすることもできます。

今日からきみもSolidityエンジニア
さあ、Web3へ飛び出そう！
