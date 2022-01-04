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
* ブロックチェーン上でDapps開発したい
* オリジナルのNFTをコードから書きたい

## Hardhatについて
本記事では、Hardhatのチュートリアルを日本語で解説しています。
https://hardhat.org/tutorial/

Hatdhatは2022年現在、Solidityエンジニアの間でもっともよく使われている開発ツールの１つです。

Hardhat以外によく使われるツールとしてTruffleがありますが、Truffleより新しく、ビルドやテストがより使いやすくなっています。



## インストール

HardhatのDocumentにしたがいインストールを進めます。
hardhatのプロジェクトを使うには、Nodejsのパッケージマネージャnpmを使います。

https://hardhat.org/tutorial/setting-up-the-environment.html

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

## コーディング
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

## ビルド
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