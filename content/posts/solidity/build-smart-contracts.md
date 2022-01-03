---
title: "Remixの使い方: ブラウザだけでスマートコントラクトをデプロイ"
date: 2021-07-06 00:00
permalink: /build-smart-contracts
tags:
  - solidity
  - beginner
  - remix
  - jp
description: |-
  ブラウザを使ってスマートコントラクトをブロックチェーンに作る方法
  初心者向け
---

この記事はこんな人におすすめ

* メインネットにスマコンをデプロイしたい人
* 自分のオリジナルトークンを作りたい人
* Remixの使い方を知りたい人
* Solidityの本を買ったけど、次に何をするかわからない人

ぼくは2017年からブロックチェーンに触れ、現在はWeb系のグローバルスタートアップで働く本業の傍らで、起業してブロックチェーンを使ったサービスを開発しています。

今日はブロックチェーンのメインネットにスマコンを作ります。
じつはメインネットにスマコンを作るのは、PC上の開発環境に作るより簡単です！

作業はすべてRemixというWebサービスを使うので、ブラウザさえあれば誰でも進められます。

Remixにコードをコピペしてボタンを2, 3回クリックすればなんとスマコンは完成します！

基本的にRemixは無料で利用できます。

Remixの作業に必要な３ステップさえ覚えれば、本物のブロックチェーンにオリジナルトークンも作れるようになるのでやってみよう！

## はじめに
#### 必要となるツール
* Metamask

#### 利用するネットワーク
* Ropsten (Ethereumのテストネット)
* Binance Smart Chain (メインネット)

ブロックチェーンにスマートコントラクトをデプロイするために、RemixとMetamaskを使います。

Remixは無料で利用できますが、ブロックチェーンのメインネットにデプロイするにはそのチェーンの利用料(Transaction Fee)がかかります。

BSC(Binance Smart Chain)ならだいたい数十円ぐらいです。(2021年5月現在)
もしBNBという仮想通貨を持っていない場合は、EthereumのテストネットRopstenにデプロイしましょう。RopstenのようなテストネットならFeeはもらえます。

注意：Metamaskの開発に使うアカウントは仮想通貨トレードに使うアカウントとわけてください。
誤って高額なTransaction Feeがかかったり、大事な秘密鍵を間違ったトランザクションに使ったりすることを防ぐためです。

## Remix

![remix](/media/build-smart-contracts/remix.png)

https://remix.ethereum.org/

なんだか難しそうな画面がでてきます。でも、まだ閉じないで！

Remixの使い方を全部理解する必要はありません。スマコンのデプロイに必要な場所は３箇所だけです。

一番左のところを見てください。使うのは上から３つのアイコンです。

* FILE EXPLORERS
* SOLIDITY COMPILER
* DEPLOY & RUN TRANSACTIONS

### FILE EXPLORERS
１番上はFILE EXPLORERS、
コードを書く場合に使います。コードは100%コピペで大丈夫です。

### SOLIDITY COMPILER
上から２番目がコンパイラです。プログラムをコンパイルしてスマートコントラクトコードを作ります。人間が読み書きできるテキストコードから機械が処理するコードに変換します。

### DEPLOY & RUN TRANSACTIONS
３番目はデプロイする画面です。コンパイルしたスマコンをブロックチェーン上にデプロイします。デプロイするときにはMetamaskを使います。

それでは実際にRemixを使ってスマコンを作っていきましょう！

## スマートコントラクトの作成
### コーディング（コピペOK）
今回はもっともシンプルなコードを使います。おなじみのHello Worldです。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HelloWorld {
  function get() public pure returns (string memory) {
    return "Hello World";
  }
}
```

まずFILE EXPLORERSを開いて、contractsディレクトリの下にNew Fileを作ります。ファイル名はHelloWorld.solにします。

ファイルを作ったらさっきのコードをコピペしましょう。

![remix](/media/build-smart-contracts/remix-5.png)

### Solidityのコンパイル
これでコードは完成です。つぎはコンパイルです。

上から２番目のアイコンのSOLIDITY COMPILERを開きます。
開いたら「Compile HelloWorld.sol」をクリックします。

これでスマコンの出来上がり！
なんかあっけないですね

### ブロックチェーンにスマコンをデプロイ
最後にデプロイです。上から３番目のアイコンの
DEPLOY & RUN TRANSACTIONSを開きます。
CONTRACTのところにHelloWorldが表示されていることを確認しましょう。これはさっきコンパイルしたHelloWorldコントラクトです。

### ENVIRONMENTをInjected Web3に変更する
ここからが大事なポイントです。
ENVIRONMENTを変更します。デフォルトでは「JavaScript VM」になっていますが、Metamaskを使うためにここを「Injected Web3」に変更します。

![remix](/media/build-smart-contracts/remix-8.png)

これでMetamaskを使う設定になりました。

Metamaskはネットワーク設定で接続先のブロックチェーンを切り替えることができます。

Remixからデプロイを実行するとMetamaskが現在つないでいるブロックチェーンのネットワークにデプロイできます。

```
MetamaskでBSCを選択　→　RemixからBSCへデプロイ
MetamaskでRopstenを選択　→　RemixからRopstenへデプロイ
MetamaskでGanacheを選択　→　RemixからPC上のGanacheテストネットにデプロイ
```

### Ropstenへのデプロイ
まずは、EthereumのテストネットRopstenにデプロイしてみましょう。

デプロイ時にはTransaction Feeが必要になります。もしテストネットのETHを持っていない場合は先に入手しましょう。

### デプロイ前の３つの確認事項
以下の３点を確認しましょう

* RemixのENVIRONMENTがIntected Web3になっていること
* MetamaskのネットワークがRopstenになっていること
* MetamaskアカウントにETH残高があること

注意：もし、誤って本番ネットワークが選択されている場合は、Transaction Feeとして本物の仮想通貨を消費します。必ずダブルチェックしましょう。

### Remixを使ったスマートコントラクトのデプロイ
確認できたらDeployをクリックします。

### Gas代の確認
Metamaskの確認画面が表示されます。
新しいコントラクトのデプロイを選択中のネットワークに対して実行します。

Gas代を確認して「確認」をクリックします。

![remix](/media/build-smart-contracts/remix-10.gif)

### トランザクションの確認（新しいスマートコントラクトの作成）
Remixのデプロイ画面の右下の動いているログの中にRopstenのEtherscanへのリンクがあります。そのリンク先を開くと、トランザクションのステータスがわかります。

Successになっていれば成功
Pendingはまだ処理中
Failedは失敗

#### Etherscan (Ropsten)

![remix](/media/build-smart-contracts/scan-1.png)

デプロイが成功したらスマコンを実行してみましょう。

### スマコンの実行確認(Ropsten)
DEPLOY & RUN TRANSACTIONSの左下にDeployed Contractsという場所があります。デプロイが正常に完了していれば、ここにHELLOWORLDコントラクトがあるはずです。

HELLOWORLDを開くと「get」というボタンが出てきます。

このgetはあなたが作ったスマートコントラクトの命令です。

### HelloWorldコントラクトのget()ファンクション
今回使っているHelloWorldのコードをもう1回見てみましょう。
コードの中でgetというファンクションを作っています。ファンクションとはスマートコントラクトに対する命令のことです。メソッドや関数とも言います。

```ts
 function get() public pure returns (string memory) {
   return "Hello World";
 }
```

今回あなたが作ったのは、get()を実行すると”Hello World”という文字を返すファンクションを持つスマートコントラクトだったのです。

Remixでgetボタンを押してみましょう。Gas代はかかりません。

すぐ下にstring: Hello Worldという文字が表示されています。
あなたがデプロイしたスマートコントラクトから返された文字です。

このスマコンはRopstenブロックチェーン上にあるので、Remix以外のweb3.jsからでももちろん実行することができます。

ここまで到達したあなたなら、コピーするコードを変えるだけでどんなスマコンでも作ることができます！

最後にBSC(Binance Smart Chain)へのデプロイを説明します。

## BSCへのデプロイ
Ropstenのときとやることは同じです。
変わるのはMetamaskの接続先のネットワークだけ。

### Metamaskのネットワーク設定
すでにBNBを持っているあなたはMetamaskにBSCの設定が入っていると思いますが、一応設定をMetamask用のネットワーク設定を載せておきます。

```
Binance Smart Chain
https://bsc-dataseed.binance.org/
56
BNB
https://bscscan.com/
```

### デプロイ前の4つの確認事項
RemixのDEPLOY & RUN TRANSACTIONS画面では、以下の4点を確認しましょう。

* RemixのENVIRONMENTがIntected Web3になっていること
* RemixのCONTRACTでHelloWorldが選択されていること
* MetamaskのネットワークがBSCになっていること
* MetamaskアカウントにBNB残高があること

それではDeployをクリックしましょう。


### デプロイ時の注意事項
メインネットにデプロイするときは、Metamaskの確認画面で必ず高額なGas代を払っていないことを確認しましょう。

トランザクションが混雑している場合に、一時的にGas代が高騰したり、誤ってGas代の高いEthreumのメインネットを選択していたら、10倍以上の仮想通貨を消費してしまうことも起こります。

メインネットで作業するときは必ずダブルチェックしましょう。

### デプロイのステータス確認
デプロイが成功したかどうか確認します。

Ropstenにデプロイしたときは、Remixの右下にあるログのURLからRopstenのサイトに飛んで確認しました。今回はBSCのメインネットなので、BscScanというサイトで確認できます。

MetamaskのアクティビティからBscScanのサイトへ飛んでみましょう。

### BscScan（エクスプローラ）を使った確認
BscScanのサイトの中身はRopstenのときのEthersacnと同じです。

![remix](/media/build-smart-contracts/scan-2.png)

Successになっていれば、あなたのスマコンがBinance Smart Chainにデプロイされています。
これでもう、あなたはWeb3エンジニアです！

### スマートコントラクトの実行
最後にデプロイしたスマコンを実行してみます。Ropstenのときと同じようにRemixのDEPLOY & RUN TRANSACTIONSから実行します。

対象のネットワーク設定にはMetamaskの設定を使います。
Deployのときと同じように以下の2点を確認します。

ENVIRONMENT がInjected Web3になっていること
MetamaskのネットワークがBSCになっていること

左下のDeployed ContractsでHelloWorldスマコンを選んでgetをクリックします。

![remix](/media/build-smart-contracts/remix-13.png)


##
最新のWeb3開発情報をTwitterで発信しています。
よかったらフォローお願いします！

https://twitter.com/motosakanosita
