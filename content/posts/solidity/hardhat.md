---
title: "Solidity入門: Hardhatでスマートコントラクトを作ろう！"
date: 2022-01-04 22:00
permalink: /hardhat
tags:
  - Solidity
  - Hardhat
  - beginner
  - jp
description: |-
  Hardhatのチュートリアルを日本語で解説
  スマートコントラクトをテストネット(Ropsten)にデプロイする方法
---

このページはこんな人におすすめ

- Solidity を学習したい
- テストネットやメインネットにスマートコントラクトを作りたい
- オリジナルの NFT をコードから書きたい

Hardhat は 2022 年現在、Solidity エンジニアの間でもっともよく使われている開発ツールの１つです。

Hardhat 以外によく使われるツールとしては Truffle があります。
Hardhat の方が新しくビルドやテストでより使いやすくなっています。

このページでは、Hardhat のチュートリアルを日本語で解説しています。
チュートリアルの中からテストネットでの実行に必要な部分を抜粋しています。

https://hardhat.org/tutorial/

このページで実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/solidity-example/tree/main/hardhat-tutorial)からダウンロードできます。

## インストール

Hardhat の Document にしたがいインストールを進めます。

https://hardhat.org/tutorial/setting-up-the-environment.html

Hardhat を使うには、Nodejs のパッケージマネージャ npm を使います。

Hardhat はプロジェクトごとにインストールするので、この時点では PC のターミナルで npm コマンドを実行できれば環境構築は完了です。

### Hardhat プロジェクトの作成

hardhat-tutorial という npm 用のプロジェクトを作り、hardhat をインストールします。

```
mkdir hardhat-tutorial
cd hardhat-tutorial
npm init --yes
npm install --save-dev hardhat
```

新しいプロジェクトに Hardhat をインストールできました。
hardhat コマンドを実行して、hardhat の設定ファイルを作ります。

```
npx hardhat
```

npx というコマンドは npm によってインストールしたコマンドを実行するためのコマンドです。
npm でインストールしたコマンドをそのまま入力しても見つけられないので npx を使います。

選択肢が表示されたら、`Create an empty hardhat.config.js`を選びます。

```
? What do you want to do? …
  Create a sample project
❯ Create an empty hardhat.config.js
  Quit
```

プロジェクトディレクトリに Hardhat の設定ファイル`hardhat.config.js`が作られます。

`Create a sample project`を選択すれば、このあとの作業をもっと簡単にすすめることができます。

ここではプロジェクトの構成を理解するために、1 つ 1 つ自分で作っていきましょう。

### プラグインの追加

ether.js や waffle といった Hardhat のプラグインを追加します。

```
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
```

## スマートコントラクトの作成

### コーディング

hardhat.config.js を以下のように編集します。

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

執筆時点での Hardhat のドキュメントのコードをそのまま使っています。
Solidity のバージョンが少し古いので、バージョン番号は適宜更新してください。

プロジェクトに contracts というディレクトリを作りましょう。
contracts ディレクトリの中に Token.sol というファイルを作り、下のコードを書きます。

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

hardhat コマンドを実行します。

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

プロジェクトの直下に test というディレクトリを作ります。
test ディレクトリの中に Token.js というファイルを作り、以下のコードを書きます。

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

Ethereum のテストネット(Ropsten)にデプロイします。
チュートリアルでオススメされている Ropsten を使って説明します。
テストネットのデプロイには以下の 3 つが必要です。

- Ropsten のアカウントの秘密鍵
- Ropsten の ETH トークン
- RPC エンドポイントの URL

#### Ropsten のアカウントの秘密鍵

Metamask でアカウントを作って Private Key をエクスポートすれば取得できます。
念のため、本番で使っているアカウントと分けることをおすすめします。

#### Ropsten の ETH トークン

0.01ETH ぐらいあればデプロイには足りると思います。
テストネットは Faucet という無料でトークンをもらえるサイトが存在するのでググって入手してください。

#### RPC エンドポイントの URL

ブロックチェーンのネットワークにアクセスするためのエンドポイントです。
代表的なノードプロバイダーを紹介します。

- INFURA
- Alchemy
- QuickNode

Alchemy はある程度まで無料プランで利用できるのでオススメです。
Alchemy にユーザー登録すれば、RPC サーバの URL を取得できます。

もう 1 つの簡単な方法は Metamask で使われている RPC エンドポイントです。
Metamask に指定されている RPC エンドポイントは INFURA というノードプロバイダーの RPC サーバです。(2022 年 1 月現在)
Metamask の Network の設定を開くと Ropsten のエンドポイントの設定内容がみれます。

### 環境変数

秘密鍵や API Key などのクレデンシャルは Git に commit しないようにする必要があります。
そこで、以下の 2 つの環境変数をエクスポートして hardhat 実行時に使えるようにします。

- `ROPSTEN_PRIVATE_KEY`
- `ROPSTEN_RPC_URL`

hatdhat.config.js を以下のように編集します。

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
      accounts: [`${ROPSTEN_PRIVATE_KEY}`],
    },
  },
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

### Metamask で確認

Hardhat のチュートリアルには載っていませんが、せっかくトークンを作ったので Metamask に登録してみましょう。

deploy.js を実行した際に出力された`Token address`を Metamask に登録します。
![Metamask](/media/hardhat/1.png)

これで 1,000,000 MHT が見えるようになります。

これは Token.sol というサンプルコードであなたが作った'My Hardhat Token'です。

ほかのアドレスに送ることもできます。自由に試してください。

メインネット用の ETH と RPC を使えば同じやり方でメインネットにデプロイすることもできます。

今日からきみも Solidity エンジニア
さあ、Web3 へ飛び出そう！
