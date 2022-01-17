---
title: "Solidity入門: Remixの使い方 ~ ブラウザだけでスマートコントラクトをデプロイ"
date: 2021-07-06 00:00
permalink: /remix-tutorial
redirect_from:
  - /build-smart-contracts
  - /build-smart-contracts/
tags:
  - Solidity
  - beginner
  - Remix
  - jp
description: |-
  ブラウザを使ってスマートコントラクトをブロックチェーンに作る方法
  初心者向け
---

この記事はこんな人におすすめ

- メインネットにスマコンをデプロイしたい人
- 自分のオリジナルトークンを作りたい人
- Remix の使い方を知りたい人
- Solidity の本を買ったけど、次に何をするかわからない人

ぼくは 2017 年からブロックチェーンに触れ、現在は Web 系のグローバルスタートアップで働く本業の傍らで、起業してブロックチェーンを使ったサービスを開発しています。

今日はブロックチェーンのメインネットにスマコンを作ります。
じつはメインネットにスマコンを作るのは、PC 上の開発環境に作るより簡単です！

作業はすべて Remix という Web サービスを使うので、ブラウザさえあれば誰でも進められます。

Remix にコードをコピペしてボタンを 2, 3 回クリックすればなんとスマコンは完成します！

基本的に Remix は無料で利用できます。

Remix の作業に必要な３ステップさえ覚えれば、本物のブロックチェーンにオリジナルトークンも作れるようになるのでやってみよう！

## はじめに

#### 必要となるツール

- Metamask

#### 利用するネットワーク

- Ropsten (Ethereum のテストネット)
- Binance Smart Chain (メインネット)

ブロックチェーンにスマートコントラクトをデプロイするために、Remix と Metamask を使います。

Remix は無料で利用できますが、ブロックチェーンのメインネットにデプロイするにはそのチェーンの利用料(Transaction Fee)がかかります。

BSC(Binance Smart Chain)ならだいたい数十円ぐらいです。(2021 年 5 月現在)
もし BNB という仮想通貨を持っていない場合は、Ethereum のテストネット Ropsten にデプロイしましょう。Ropsten のようなテストネットなら Fee はもらえます。

注意：Metamask の開発に使うアカウントは仮想通貨トレードに使うアカウントとわけてください。
誤って高額な Transaction Fee がかかったり、大事な秘密鍵を間違ったトランザクションに使ったりすることを防ぐためです。

## Remix

![remix](/media/build-smart-contracts/remix.png)

https://remix.ethereum.org/

なんだか難しそうな画面がでてきます。でも、まだ閉じないで！

Remix の使い方を全部理解する必要はありません。スマコンのデプロイに必要な場所は３箇所だけです。

一番左のところを見てください。使うのは上から３つのアイコンです。

- FILE EXPLORERS
- SOLIDITY COMPILER
- DEPLOY & RUN TRANSACTIONS

### FILE EXPLORERS

１番上は FILE EXPLORERS、
コードを書く場合に使います。コードは 100%コピペで大丈夫です。

### SOLIDITY COMPILER

上から２番目がコンパイラです。プログラムをコンパイルしてスマートコントラクトコードを作ります。人間が読み書きできるテキストコードから機械が処理するコードに変換します。

### DEPLOY & RUN TRANSACTIONS

３番目はデプロイする画面です。コンパイルしたスマコンをブロックチェーン上にデプロイします。デプロイするときには Metamask を使います。

それでは実際に Remix を使ってスマコンを作っていきましょう！

## スマートコントラクトの作成

### コーディング（コピペ OK）

今回はもっともシンプルなコードを使います。おなじみの Hello World です。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HelloWorld {
  function get() public pure returns (string memory) {
    return "Hello World";
  }
}
```

まず FILE EXPLORERS を開いて、contracts ディレクトリの下に New File を作ります。ファイル名は HelloWorld.sol にします。

ファイルを作ったらさっきのコードをコピペしましょう。

![remix](/media/build-smart-contracts/remix-5.png)

### Solidity のコンパイル

これでコードは完成です。つぎはコンパイルです。

上から２番目のアイコンの SOLIDITY COMPILER を開きます。
開いたら「Compile HelloWorld.sol」をクリックします。

これでスマコンの出来上がり！
なんかあっけないですね

### ブロックチェーンにスマコンをデプロイ

最後にデプロイです。上から３番目のアイコンの
DEPLOY & RUN TRANSACTIONS を開きます。
CONTRACT のところに HelloWorld が表示されていることを確認しましょう。これはさっきコンパイルした HelloWorld コントラクトです。

### ENVIRONMENT を Injected Web3 に変更する

ここからが大事なポイントです。
ENVIRONMENT を変更します。デフォルトでは「JavaScript VM」になっていますが、Metamask を使うためにここを「Injected Web3」に変更します。

![remix](/media/build-smart-contracts/remix-8.png)

これで Metamask を使う設定になりました。

Metamask はネットワーク設定で接続先のブロックチェーンを切り替えることができます。

Remix からデプロイを実行すると Metamask が現在つないでいるブロックチェーンのネットワークにデプロイできます。

```
MetamaskでBSCを選択　→　RemixからBSCへデプロイ
MetamaskでRopstenを選択　→　RemixからRopstenへデプロイ
MetamaskでGanacheを選択　→　RemixからPC上のGanacheテストネットにデプロイ
```

### Ropsten へのデプロイ

まずは、Ethereum のテストネット Ropsten にデプロイしてみましょう。

デプロイ時には Transaction Fee が必要になります。もしテストネットの ETH を持っていない場合は先に入手しましょう。

### デプロイ前の３つの確認事項

以下の３点を確認しましょう

- Remix の ENVIRONMENT が Intected Web3 になっていること
- Metamask のネットワークが Ropsten になっていること
- Metamask アカウントに ETH 残高があること

注意：もし、誤って本番ネットワークが選択されている場合は、Transaction Fee として本物の仮想通貨を消費します。必ずダブルチェックしましょう。

### Remix を使ったスマートコントラクトのデプロイ

確認できたら Deploy をクリックします。

### Gas 代の確認

Metamask の確認画面が表示されます。
新しいコントラクトのデプロイを選択中のネットワークに対して実行します。

Gas 代を確認して「確認」をクリックします。

![remix](/media/build-smart-contracts/remix-10.gif)

### トランザクションの確認（新しいスマートコントラクトの作成）

Remix のデプロイ画面の右下の動いているログの中に Ropsten の Etherscan へのリンクがあります。そのリンク先を開くと、トランザクションのステータスがわかります。

Success になっていれば成功
Pending はまだ処理中
Failed は失敗

#### Etherscan (Ropsten)

![remix](/media/build-smart-contracts/scan-1.png)

デプロイが成功したらスマコンを実行してみましょう。

### スマコンの実行確認(Ropsten)

DEPLOY & RUN TRANSACTIONS の左下に Deployed Contracts という場所があります。デプロイが正常に完了していれば、ここに HELLOWORLD コントラクトがあるはずです。

HELLOWORLD を開くと「get」というボタンが出てきます。

この get はあなたが作ったスマートコントラクトの命令です。

### HelloWorld コントラクトの get()ファンクション

今回使っている HelloWorld のコードをもう 1 回見てみましょう。
コードの中で get というファンクションを作っています。ファンクションとはスマートコントラクトに対する命令のことです。メソッドや関数とも言います。

```ts
 function get() public pure returns (string memory) {
   return "Hello World";
 }
```

今回あなたが作ったのは、get()を実行すると”Hello World”という文字を返すファンクションを持つスマートコントラクトだったのです。

Remix で get ボタンを押してみましょう。Gas 代はかかりません。

すぐ下に string: Hello World という文字が表示されています。
あなたがデプロイしたスマートコントラクトから返された文字です。

このスマコンは Ropsten ブロックチェーン上にあるので、Remix 以外の web3.js からでももちろん実行することができます。

ここまで到達したあなたなら、コピーするコードを変えるだけでどんなスマコンでも作ることができます！

最後に BSC(Binance Smart Chain)へのデプロイを説明します。

## BSC へのデプロイ

Ropsten のときとやることは同じです。
変わるのは Metamask の接続先のネットワークだけ。

### Metamask のネットワーク設定

すでに BNB を持っているあなたは Metamask に BSC の設定が入っていると思いますが、一応設定を Metamask 用のネットワーク設定を載せておきます。

```
Binance Smart Chain
https://bsc-dataseed.binance.org/
56
BNB
https://bscscan.com/
```

### デプロイ前の 4 つの確認事項

Remix の DEPLOY & RUN TRANSACTIONS 画面では、以下の 4 点を確認しましょう。

- Remix の ENVIRONMENT が Intected Web3 になっていること
- Remix の CONTRACT で HelloWorld が選択されていること
- Metamask のネットワークが BSC になっていること
- Metamask アカウントに BNB 残高があること

それでは Deploy をクリックしましょう。

### デプロイ時の注意事項

メインネットにデプロイするときは、Metamask の確認画面で必ず高額な Gas 代を払っていないことを確認しましょう。

トランザクションが混雑している場合に、一時的に Gas 代が高騰したり、誤って Gas 代の高い Ethreum のメインネットを選択していたら、10 倍以上の仮想通貨を消費してしまうことも起こります。

メインネットで作業するときは必ずダブルチェックしましょう。

### デプロイのステータス確認

デプロイが成功したかどうか確認します。

Ropsten にデプロイしたときは、Remix の右下にあるログの URL から Ropsten のサイトに飛んで確認しました。今回は BSC のメインネットなので、BscScan というサイトで確認できます。

Metamask のアクティビティから BscScan のサイトへ飛んでみましょう。

### BscScan（エクスプローラ）を使った確認

BscScan のサイトの中身は Ropsten のときの Ethersacn と同じです。

![remix](/media/build-smart-contracts/scan-2.png)

Success になっていれば、あなたのスマコンが Binance Smart Chain にデプロイされています。
これでもう、あなたは Web3 エンジニアです！

### スマートコントラクトの実行

最後にデプロイしたスマコンを実行してみます。Ropsten のときと同じように Remix の DEPLOY & RUN TRANSACTIONS から実行します。

対象のネットワーク設定には Metamask の設定を使います。
Deploy のときと同じように以下の 2 点を確認します。

ENVIRONMENT が Injected Web3 になっていること
Metamask のネットワークが BSC になっていること

左下の Deployed Contracts で HelloWorld スマコンを選んで get をクリックします。

![remix](/media/build-smart-contracts/remix-13.png)

##

最新の Web3 開発情報を Twitter で発信しています。
よかったらフォローお願いします！

https://twitter.com/motosakanosita
