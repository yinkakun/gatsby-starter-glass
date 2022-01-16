---
title: "イーサリアム入門: オラクルのしくみ（Chainlink）"
date: 2022-01-15 21:00
permalink: /chainlink
tags:
  - ethereum
  - oracle
  - chainlink
  - jp
description: |-
  オラクルではどのようにしてオフチェーンのデータをオンチェーンで利用できるようにしているのか？
---

オラクルは、オンチェーンのスマートコントラクトがオフチェーンの情報を利用するときに使う。

通常の Web サービスの場合、API を呼び出しますが、EVM のスマートコントラクトは、そのまま オフチェーンの API を実行することができない。

そこで Chainlink では以下のようなしくみでオラクルを実現する。

![chainlink](/media/chainlink/2.png)

### 構成要素の説明

#### Consumer

- 一般の開発者が作るスマートコントラクト
- Consumer がオフチェーンのデータを使いたいときに、同じチェーン上のスマートコントラクトである Proxy の関数を実行

#### Proxy

- Chainlink によって各チェーン上にデプロイされたスマートコントラクト
- Proxy は Aggregator のコントラクトアドレスを保持しており、Aggregator を更新する場合でも Proxy のコントラクトアドレスが変わらないため、Consumer は継続してオラクルを利用できる
- Proxy の秘密鍵の保持者に悪意があれば、参照する Aggregator を変更できてしまうので Proxy の Owner を信頼する必要がある

#### Aggregator

- Chainlink によって各チェーン上にデプロイされたスマートコントラクト
- Consumer が利用したいオフチェーンの情報を保持し、一定間隔で更新する

#### Off Chain Node

- Chainlink の P2P ネットワークを構成するクライアント
- オフチェーンにあり、インターネット上の任意の API を実行できる
- 一定間隔で Aggregator の Write 関数を実行して、ブロックチェーンにデータを送る

### OCR (Off Chain Reporting)

https://docs.chain.link/docs/off-chain-reporting/

従来は、各 Off Chain Node が個別に Aggregator にデータを送っていたが、トランザクションが輻輳したり全体の Gas 代が高くなるというデメリットがあった。

OCR という新しいしくみでは以下のようになっている

- P2P ノード間でリーダーを選出して、全体でレポートを作成、署名
- 全体で署名したレポートを代表するノードが Aggregator に提出
- Aggregator は署名を確認し、全体の中央値を選ぶ
- リーダーやレポートを提出するノードはラウンドごとに入れ替わる
