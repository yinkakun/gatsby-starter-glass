---
title: "イーサリアム入門: オラクルのしくみ（Chainlink Data Feeds）"
date: 2022-01-15 19:00
permalink: /chainlink
tags:
  - Ethereum
  - oracle
  - Chainlink
  - jp
description: |-
  Dapps開発の基本: オラクルではどのようにしてオフチェーンのデータをオンチェーンで利用できるようにしているのか？
---

オラクルはスマートコントラクトがオフチェーンの情報を利用するときに使います。

通常の Web サービスでは、他のサービスに HTTP のリクエストを投げて外部の API を実行できます。しかしイーサリアムでは EVM 上のスマートコントラクトから直接 TCP/IP のリクエストを投げることはできません。

そのため、オフチェーンのデータを間接的に取得してスマートコントラクトから利用できるようにオラクルというしくみがあります。

代表的なオラクルの１つに Chainlink があります。このページでは Chainlink Data Feeds を使ってオラクルのしくみを見ていきましょう。

[Architecture Overview (Chainlink Docs)](https://docs.chain.link/docs/architecture-overview/)

もし、Solidity における実装方法を知りたい場合はこちらをどうぞ。

[Solidity 入門: オラクルを使う](/price-oracle)

## 構成要素の説明

![chainlink](/media/chainlink/2.png)

#### Consumer

- 一般の開発者が作るスマートコントラクト
- オフチェーンのデータを使うときは、同じチェーン上のスマートコントラクトである Proxy の関数を実行して、Aggregator が保持する state を参照できる

#### Proxy

- Chainlink によって各チェーン上にデプロイされたスマートコントラクト
- Proxy は Aggregator のコントラクトアドレスを保持しており、Aggregator を変更する場合でも Proxy のコントラクトアドレスが変わらないため、Consumer は継続してオラクルを利用できる
- 仮に Proxy の秘密鍵の保持者に悪意があれば、参照する Aggregator を変更できてしまうので Proxy の Owner を信頼しなければならない

#### Aggregator

- Chainlink によって各チェーン上にデプロイされたスマートコントラクト
- Consumer が利用したいオフチェーンの情報を保持し、一定間隔で更新する

#### Off Chain Node

- Chainlink の P2P ネットワークを構成するクライアント
- オフチェーンにあり、インターネット上の任意の API を実行できる
- 一定間隔で Aggregator の Write 関数を実行して、ブロックチェーンにデータを送る

### OCR (Off Chain Reporting)

https://docs.chain.link/docs/off-chain-reporting/

従来は、各 Off Chain Node が個別に Aggregator にデータを送っていましたが、トランザクションが輻輳したり全体の Gas 代が高くなるというデメリットがありました。

それを改善するため OCR という新しいしくみにアップグレードしています。

- P2P ノード間でリーダーを選出して、全体でレポートを作成、署名
- 全体で署名したレポートを代表するノードが Aggregator に提出
- Aggregator は署名を確認し、全体の中央値を選ぶ
- リーダーやレポートを提出するノードはラウンドごとに入れ替わる

## 実際の Aggregator の state を覗いてみよう

実際に Ethereum のメインネットで Proxy や Aggregator コントラクトの関数を実行してみましょう。
Read 関数なので Gas 代はかかりません。

各チェーンの Proxy のコントラクトアドレスは Chainlink の Documentation に載っています。

[Ethereum Data Feeds](https://docs.chain.link/docs/ethereum-addresses/)

上のページには ETH / USD の Proxy コントラクトアドレスが載っています。

Etherscan で見てみましょう。

### Proxy

https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419

Contract Name: EACAggregatorProxy

[Contract] -> [Read Contract] -> [aggregator]をクリックすると Aggregator のアドレスがわかります。

![chainlink](/media/chainlink/3.png)

### Aggregator

https://etherscan.io/address/0x37bc7498f4ff12c19678ee8fe19d713b87f6a9e6#code

Contract Name: AccessControlledOffchainAggregator

[Contract] -> [Read Contract] -> [latestRoundData]をクリックすると以下のような複数の値を表示します。

```
  roundId|uint80 :  17400
  answer|int256 :  331512291099
  startedAt|uint256 :  1642312505
  updatedAt|uint256 :  1642312505
  answeredInRound|uint80 :  17400
```

#### ラウンド ID

現在のラウンド、つまり Chainlink が定義する集計間隔です。

#### answer

価格情報です。この Aggregator は ETH/USD の価格を持っています。
桁数が大きいので 10 の 8 乗で割ってみましょう。

331512291099 / 10^8 = 3,315

3,315 が現在の Chainlink が提供する ETH/USD の価格情報です。

#### startedAt/updatedAt

これはプログラマにはおなじみの Unix タイムスタンプ形式の日時情報です。

1642312505 を ISO8601 フォーマットに変換すると以下のとおりです。

2022-01-16T06:31:12+00:00

## 実際のレポート提出トランザクションを見てみよう

Aggregator の Transactions を見ると、Off Chain Node から提出されたレポートの内容がわかります。

直前に送られた Transmit のトランザクション
https://etherscan.io/tx/0xf56f41524a2fe7178b1d12bb0964221047438818e6d46f1b7eb0fc1aecb33192#eventlog

以下のようなログが見れます。

```
answer :
331512291099
transmitter :
0xdbfea8d5822141c13f92caa06eb94d0f3d67c243
observations :
331121345032
331136000000
331173629766
331175000000
331186000000
331200000000
331285910333
331302646333
（省略）
```

このラウンドで集められた価格情報の中央値が answer になっています。

transmitter のアドレスは、このコントラクトの Write 関数を実行したアカウント(EOA)です。

Chainlink の Off Chain Node がこのアカウントを使ってレポートを提出したようです。

このデータフィードでは、１つのレポートにまとめて送っているので OCR を使っているようです。

ほかのネットワーク上の Proxy/Aggregator や、ETH/USD 以外の Price Feeds など、いろいろ調べてみてください！

Solidity におけるオラクルの使い方を知りたい場合はこちらをどうぞ。

[Solidity 入門: オラクルを使う](/price-oracle)
