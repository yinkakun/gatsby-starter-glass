---
title: 【コピペでOK】オジリナル仮想通貨のつくり方（ERC20）
date: 2021-06-03 00:00
permalink: /original-token
tags:
  - Solidity
  - beginner
  - jp
description: |-
  コピペでOK
  非エンジニアでもできるオリジナル仮想通貨の作り方
---

この記事はこんな人におすすめ

- オリジナル仮想通貨を作りたい人（非エンジニア向け）
- Solidity の本を買ったけど、次に何をするかわからない人
- ブロックチェーンの仕組みを知りたい人

ぼくは 2017 年頃からブロックチェーンに触れ、現在は外資系 Edtech のスタートアップでエンジニアをしながら、個人でも起業してブロックチェーンを使ったサービスを開発しています。

今日は自分だけのオリジナル仮想通貨を本物のブロックチェーンのメインネットに作ってみましょう。

Binance Smart Chain というブロックチェーンに作りますが、Metamask で繋がるブロックチェーンなら同じ方法で作れます。

Metamask が使えるチェーン

- Ethereum
- Polygon
- Fantom
- Aavalanche
  など

当記事は開発者向けではなく、非エンジニアでも作れるように説明します。
コードは 100%コピペすれば OK です。

エンジニアの方にはこちらの記事がオススメです。

[Solidity 入門: Hardhat でスマートコントラクトを作ろう！](/hardhat)

それではさっそく始めましょう！

#### 免責事項

> 当記事では、本物の仮想通貨を使用する情報を掲載していますが、当記事の情報によって起きるいかなる結果にも筆者は責任を負いません。

## はじめに

利用する Web サービス（無料）
https://remix.ethereum.org

必要なもの

- Metamask
- 0.01 BNB ぐらい（日本円で数百円ぐらい）

注意
スマートコントラクトのデプロイには、専用の Metamask 環境を用意しましょう。仮想通貨のトレードに使うウォレットとわけましょう。

今回の作業では Metamask を使って Binance Smart Chain（以降 BSC と表示）のメインネットに接続します。

本番のメインネットにスマートコントラクトをデプロイするには、Transaction Fee が必要です。BSC なら 0.01 BNB ぐらいあれば足りると思います。

作業前の前提として以下の準備が必要です。

- Metamask から Binance Smart Chain に繋いでいること
- Metamask の BSC のアカウントに 0.01 BNB 以上持っていること

Binance Smart Chain 上の BNB を入手したり送金する方法は当記事では解説しません。

## Remix でスマートコントラクトを作る

![remix](/media/original-token/remix-1.png)

Remix はスマートコントラクトの Web 型の開発環境です。
https://remix.ethereum.org/

コードを書いたり、コンパイルしたり、ブロックチェーンにデプロイしたりできます。

今回使うコードは用意してあるので 100%コピペで大丈夫です。

Remix で使うのは以下の 3 箇所です。

![remix](/media/original-token/remix-2.png)

### FILE EXPLORERS

最初に、FILE EXPLORERS という画面ででコードをコピペします。
左側にはファイルツリーが表示されて、右側にファイルの編集画面が表示されています。

![remix](/media/original-token/remix-3.png)

contracts というフォルダの下に、MyToken.sol というファイルを作って右側に下のコードをコピペします。

MyToken というのがトークンの名前です。TKN が通貨の単位です。
自分の好きな名前に置換すれば、オリジナルの名前で作れます。

```solidity
// contracts/SimpleToken.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor (uint256 initialSupply
  ) public ERC20("MyToken", "TKN") {
      _mint(msg.sender, initialSupply * 10 ** uint(decimals()));
  }
}
```

これでコーディングは完了！
今日からあなたも Solidity エンジニアです。

次はコンパイルです。

### SOLIDITY COMPILER

SOLIDITY COMPILER という画面を開きましょう。

![remix](/media/original-token/remix-4.png)

開いたら Complie MyToken.sol をクリックします。

バージョンの違いで、下のような Warning が表示されますが、無視して OK です。

<!-- ![remix](/media/original-token/remix-5.png) -->

> Warning: Visibility for constructor is ignored. If you want the contract to be non-deployable, making it "abstract" is sufficient. --> contracts/MyToken.sol:11:3: | 11 | constructor (uint256 initialSupply | ^ (Relevant source part starts here and spans across multiple lines).

ほかに何もエラーが出なければコンパイル完了です。

あとはこのコンパイルしたスマートコントラクトをブロックチェーンにデプロイしたら完成です。

Metamask が Binance Smart Chain に繋がっていることを確認しましょう。

### DEPLOY & RUN TRANSACTIONS

DEPLOY & RUN TRANSACTIONS を開きましょう。Deploy する前にいくつか確認するポイントがあります。

- ENVIRONEMNT を「Injected Web3」に変える
- ACCOUNT が Metamask のアドレスになっていること
- CONTRACT が先ほどコンパイルした MyToken になっていること

![remix](/media/original-token/remix-6.png)

トークンの供給量を決めます。
今回は 10,000 にするとして、Deploy ボタンの隣に半角で「10000」と入力します。

![remix](/media/original-token/remix-7.png)

全部確認できればいよいよデプロイです。Deploy をクリックしましょう。
Metamask のトランザクション承認画面が表示されます。

![remix](/media/original-token/remix-8.gif)

トランザクションの承認画面では Gas 代を確認しましょう。

Gas 代はタイミングによって変わります。今回は 0.006244 BNB でした。

問題なければ確認をクリックしましょう。
何もエラーが出なければオリジナルトークンの完成です。

### オリジナルトークンをウォレットに追加しよう

作ったオリジナルトークンをウォレットに追加してみましょう。

スマートコントラクトは、ウォレットと同じようにブロックチェーン上のアドレスを持っています。そのアドレスは DEPLOY & RUN TRANSACTION 画面の左下からコピーできます。

![remix](/media/original-token/remix-9.png)

コントラクトアドレスをコピーしたら、Metamask の「トークンを追加」に入力しましょう。

無事に Metamask に MyToken を 10,000TKN 登録できました！

![remix](/media/original-token/metamask-1.png)

もちろん、作ったトークンは BSC のほかのアドレスに送ることができます。

もしよかったら、あなたのトークンをぼくにも送ってくださいね！

アドレスはこちら
0x9d11d3df96EaE1D9041875dCD9ceaFc8a0F872C9

##

最新の Web3 開発情報を Twitter で発信しています。
よかったらフォローお願いします！

https://twitter.com/motosakanosita
