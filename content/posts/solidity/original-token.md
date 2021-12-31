---
title: 【コピペOK】オジリナル仮想通貨のつくり方（ERC20）
date: 2021-06-03 00:00
slug: /original-token
tags:
  - Solidity
  - beginner
  - jp
description: |-
  コピペでOK
  非エンジニアでもできるオリジナル仮想通貨の作り方

---

こんな人にピッタリ!

* オリジナル仮想通貨を作りたい人（非エンジニア向け）
* Solidityの本を買ったけど、次に何をするかわからない人
* ブロックチェーンの仕組みを知りたい人

「スマコンかいはつ室」へようこそ！

ぼくは2017年からスマコン開発に触れ、現在は外資系Edtechのスタートアップでエンジニアをしながら、個人でも起業してブロックチェーンを使ったサービスを開発しています。

今日は自分だけのオリジナル仮想通貨を本物のブロックチェーンのメインネットに作ってみましょう。

Binance Smart Chainというブロックチェーンに作りますが、Metamaskで繋がるブロックチェーンなら同じ方法で作れます。


Metamaskが使えるチェーン
* Ethereum
* Polygon
* Fantom
* Aavalanche
など

当記事は開発者向けではなく、非エンジニアでも作れるように説明します。
コードは100%コピペすればOKです。

それではさっそく始めましょう！

#### 免責事項
> 当記事では、本物の仮想通貨を使用する情報を掲載していますが、当記事の情報によって起きるいかなる結果にも筆者は責任を負いません。

## はじめに
利用するWebサービス（無料）
https://remix.ethereum.org

必要なもの
* Metamask
* 0.01 BNBぐらい（日本円で数百円ぐらい）

注意
スマートコントラクトのデプロイには、専用のMetamask環境を用意しましょう。仮想通貨のトレードに使うウォレットとわけましょう。

今回の作業ではMetamaskを使ってBinance Smart Chain（以降BSCと表示）のメインネットに接続します。

本番のメインネットにスマートコントラクトをデプロイするには、Transaction Feeが必要です。BSCなら0.01 BNBぐらいあれば足りると思います。

作業前の前提として以下の準備が必要です。

* MetamaskからBinance Smart Chainに繋いでいること
* MetamaskのBSCのアカウントに0.01 BNB以上持っていること

Binance Smart Chain上のBNBを入手したり送金する方法は当記事では解説しません。

## Remixでスマートコントラクトを作る

![remix](/media/original-token/remix-1.png)

Remix はスマートコントラクトのWeb型の開発環境です。
https://remix.ethereum.org/

コードを書いたり、コンパイルしたり、ブロックチェーンにデプロイしたりできます。

今回使うコードは用意してあるので100%コピペで大丈夫です。

Remixで使うのは以下の3箇所です。

![remix](/media/original-token/remix-2.png)

### FILE EXPLORERS

最初に、FILE EXPLORERSという画面ででコードをコピペします。
左側にはファイルツリーが表示されて、右側にファイルの編集画面が表示されています。

![remix](/media/original-token/remix-3.png)

contractsというフォルダの下に、MyToken.solというファイルを作って右側に下のコードをコピペします。

MyTokenというのがトークンの名前です。TKNが通貨の単位です。
自分の好きな名前に置換すれば、オリジナルの名前で作れます。

```
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
今日からあなたもSolidityエンジニアです。

次はコンパイルです。

### SOLIDITY COMPILER
SOLIDITY COMPILERという画面を開きましょう。

![remix](/media/original-token/remix-4.png)

開いたらComplie MyToken.solをクリックします。

バージョンの違いで、下のようなWarningが表示されますが、無視してOKです。

<!-- ![remix](/media/original-token/remix-5.png) -->

> Warning: Visibility for constructor is ignored. If you want the contract to be non-deployable, making it "abstract" is sufficient. --> contracts/MyToken.sol:11:3: | 11 | constructor (uint256 initialSupply | ^ (Relevant source part starts here and spans across multiple lines).

ほかに何もエラーが出なければコンパイル完了です。

あとはこのコンパイルしたスマートコントラクトをブロックチェーンにデプロイしたら完成です。

MetamaskがBinance Smart Chainに繋がっていることを確認しましょう。

### DEPLOY & RUN TRANSACTIONS
DEPLOY & RUN TRANSACTIONS を開きましょう。Deployする前にいくつか確認するポイントがあります。

* ENVIRONEMNTを「Injected Web3」に変える
* ACCOUNTがMetamaskのアドレスになっていること
* CONTRACTが先ほどコンパイルしたMyTokenになっていること

![remix](/media/original-token/remix-6.png)

トークンの供給量を決めます。
今回は10,000にするとして、Deploy ボタンの隣に半角で「10000」と入力します。

![remix](/media/original-token/remix-7.png)

全部確認できればいよいよデプロイです。Deployをクリックしましょう。
Metamaskのトランザクション承認画面が表示されます。

![remix](/media/original-token/remix-8.gif)

トランザクションの承認画面ではGas代を確認しましょう。

Gas代はタイミングによって変わります。今回は0.006244 BNBでした。

問題なければ確認をクリックしましょう。
何もエラーが出なければオリジナルトークンの完成です。

### オリジナルトークンをウォレットに追加しよう
作ったオリジナルトークンをウォレットに追加してみましょう。

スマートコントラクトは、ウォレットと同じようにブロックチェーン上のアドレスを持っています。そのアドレスはDEPLOY & RUN TRANSACTION画面の左下からコピーできます。

![remix](/media/original-token/remix-9.png)

コントラクトアドレスをコピーしたら、Metamaskの「トークンを追加」に入力しましょう。

無事にMetamaskにMyTokenを10,000TKN登録できました！

![remix](/media/original-token/metamask-1.png)

もちろん、作ったトークンはBSCのほかのアドレスに送ることができます。

もしよかったら、あなたのトークンをぼくにも送ってくださいね！

アドレスはこちら
0x9d11d3df96EaE1D9041875dCD9ceaFc8a0F872C9

感想などのコメントもお待ちしています。


NFTなどの最新のスマコン開発ネタをTwitterで発信しています。
https://twitter.com/motosakanosita
