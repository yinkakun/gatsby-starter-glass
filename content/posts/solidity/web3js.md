---
title: web3.JSを使ってスマートコントラクトを実行する3つの方法【Solidity入門】
date: 2021-06-06 19:38
permalink: /web3js
tags:
  - Solidity
  - beginner
  - JavaScript
  - jp
social_image: /media/labs.png
description: |-
  JavaScriptからスマートコントラクトを実行する方法
  初心者向け
---

このページはこんな人におすすめ

- 自分で作ったスマートコントラクトを実行したい
- JavaScript からスマコンを実行する方法がわからない
- Node.js のモジュールを使ってシンプルにスマコンを実行したい
- web3.js の使い方がわからない

ぼくは 2017 年ごろからブロックチェーンを触り、2021 年現在は Web 系のグローバルスタートアップで働く本業の傍らで、起業してブロックチェーンを使ったサービスを開発しています。

このページでは、ブロックチェーン上にデプロイしたスマートコントラクトを web3.js を使って実行する方法を３つ紹介します。

- HTML と JavaScript だけのシンプルな web3.js
- Next.js を使った web3.js（Chrome のコンソールに表示）
- Next.js を使った web3.js（HTML に表示）

今回実行するスマートコントラクトは、以下の記事で作った Hello World プログラムです。

## 必要なもの

- live-server
- Next.js アプリケーション
- npm の web3.js
- スマートコントラクトのアドレス
- スマートコントラクトの ABI

### live-server

３つの確認方法のうち、

HTML と JavaScript ファイルだけの web3.js の実行方法
1 番目では live-server を使います。live-server は npm を使ってインストールできます。
live-server はローカル PC 上で利用できる軽量な HTTP サーバです。
PC 上の HTML ファイルをブラウザを通してアクセスできます。

### Next.js アプリケーション

JavaScript を使ったアプリケーションを書く場合、React や Vue.js などいろんなフレームワークを使いますが、それらは基本的にサーバサイドの JavaScript 言語である Node.js を使っています。

Node.js を使ってスマートコントラクトを実行する方法は、いろいろあります。
なるべくシンプルで汎用的に応用できることを考えて Next.js を使った 2 つ web3.js の実行方法を紹介します。

Next.js の新しいプロジェクトを用意してください。

https://nextjs.org/docs/getting-started

### npm の web3.js

Next.js のプロジェクトに npm を使って web3.js をインストールします。

プロジェクトのトップディレクトリ（package.json ファイルのある場所）で以下のコマンドを実行しましょう。

```
npm install web3 --save
```

### スマートコントラクトのアドレス

スマートコントラクトを実行する場合にコントラクトアドレスを指定します。
今回使うスマートコントラクトのアドレスを調べましょう。

Truffle を使って Ganache にコントラクトをデプロイした場合は、build ディレクトリの下に helloWorld.json というファイルが作られて、中にコントラクトアドレスがかかれています。

```js
  "networks": {
    "5777": {
      "events": {},
      "links": {},
      "address": "0x0cb51E4BF025C8F5Df16B3f523249C58e1361B73",
      "transactionHash": "0xbd6c7a8de462e0c35b5c696aab5b02a64775aa7a6c3a4545ce0820d1457bd920"
    }
  },
```

### スマートコントラクトの ABI

スマートコントラクトを実行する場合、そのコントラクトがどんなファンクションを持っているのかやどんな型の情報を返すのかといったインターフェースの情報が必要になります。
それが ABI（Application Binary Interface）です。

Truffle でデプロイした場合は、コントラクトアドレスと同じく build ディレクトリ配下の helloWorld.json に書かれています。

```js
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    }
  ],
```

## HTML と JavaScript だけのシンプルな web3.js

### コード

３つのファイルを作って同じディレクトリに置きましょう。

- index.html
- app.js
- helloWorld.js

#### index.html

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <title>Ðapps - Hello World</title>
    <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
    <script type="module" src="app.js"></script>
  </head>
  <body>
    <div id="contract-result">loading...</div>
  </body>
</html>
```

#### app.js

```js
import helloWorld from "./helloWorld.js";

window.onload = function () {
  helloWorld();
};
```

#### helloWorld.js

```js
export default function () {
  var abi = [
    {
      constant: true,
      inputs: [],
      name: "get",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "pure",
      type: "function",
    },
  ];

  var address = "0x5B0A7974Aeab510BB344e7f27e607841b4EC4C9f"; // コントラクトアドレス

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

  var contract = new web3.eth.Contract(abi, address);
  contract.methods.get().call(function (err, res) {
    document.getElementById("contract-result").textContent = res;
    console.log(res);
  });
}
```

### 確認手順

配置したディレクトリで live-server を実行します。

```
live-server .
```

live-server を実行すると、自動でブラウザが開いて index.html を表示します。

### 解説

HTML と JavaScript を使った一番シンプルなやり方です。

ここではインターネット上の web3.js を CDN からダウンロードして使っています。あとから紹介する Next.js を使う 2 つのやり方では、Node.js ライブラリの web3.js を使います。

```html
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
```

どのブロックチェーンに繋ぐかどうかは、helloWorld.js の以下の行で指定しています。

```js
const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
```

ブラウザに Metamask などがある場合は、Web3.givenProvider を指定すると Metamask が接続しているブロックチェーンのエンドポイントをもとに web3 オブジェクトが作られます。

Web3.givenProvider で取得できない場合は、”ws://localhost:7545″に接続するように書いています。
これは Ganache に接続するときの WebSocket のエンドポイントです。

## Next.js を使った web3.js（Chrome のコンソールに表示）

### コード

Next.js アプリケーションの pages ディレクトリの下に hello1.js というファイルを作って、以下のコードを貼り付けます。

コントラクトアドレスや ABI は自分の使うコントラクトに置き換えましょう。

#### pages/hello1.js

```js
import Web3 from "web3";

var abi = [
  {
    constant: true,
    inputs: [],
    name: "get",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
];

var address = "0x5B0A7974Aeab510BB344e7f27e607841b4EC4C9f"; // コントラクトアドレス

function Hello1() {
  var ret = "";
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

  var contract = new web3.eth.Contract(abi, address);
  contract.methods.get().call(function (err, res) {
    console.log(res);
    ret = res;
  });

  return "ret: " + ret;
}

export default Hello1;
```

### 確認手順

Next.js のドキュメントに従って Next.js を起動します。インストール方法によって起動コマンドは変わります。

```
yarn dev
```

Chrome ブラウザから以下の URL にアクセスします。

http://localhost:3000/hello1

Chrome の Developer Tools のコンソールタブを開きます。Mac なら「command」＋「option」+「I（アイ）｝で開きます。

Console に”Hello World!”という文字が表示されています。これはスマートコントラクトから取得した文字列です。

ブラウザで表示する HTML は下のようになると思います。HTML では”Hello World”を表示できていない状態です。

HTML に表示させるやり方は 3 番目で紹介します。

### 解説

先ほどの 1 つ目の HTML を使った実行方法では、web3.js は CDN からダウンロードしてブラウザ上で JavaScript を実行しました。

今回は、web3.js は Node.js のモジュールを使っています。

一般的なアプリケーション開発では、Node.js を使ったやり方が主流になると思います。React や Vue を使う場合も Node.js の web3.js を使います。

ブロックチェーンとの接続部分や web3 オブジェクトの使い方は 1 つ目の HTML の方法と基本的に同じです。

取得した Hello World という文字列を返して、HTML に表示させようとしていますが、じつはこれはうまく動きません。

```js
return "ret: " + ret;
```

つぎの 3 番目の方法では、Next.js で API やスマートコントラクトなど外部から取得したデータを HTML に表示するやり方で紹介します。

## Next.js を使った web3.js（HTML に表示）

### コード

Next.js アプリケーションの pages ディレクトリの下に hello2.js というファイルを作って、以下のコードを貼り付けます。

コントラクトアドレスや ABI は自分の使うコントラクトに置き換えましょう。

#### pages/hello2.js

```js
import Web3 from "web3";

function Hello2({ message }) {
  console.log("message: " + message);
  return <ul>{message}</ul>;
}

export async function getStaticProps() {
  let message = "hoge22";
  let abi = [
    {
      constant: true,
      inputs: [],
      name: "get",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "pure",
      type: "function",
    },
  ];

  let address = "0x5B0A7974Aeab510BB344e7f27e607841b4EC4C9f";

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
  const contract = new web3.eth.Contract(abi, address);

  await contract.methods.get().call(function (err, res) {
    message = res;
  });

  return {
    props: {
      message,
    },
  };
}

export default Hello2;
```

### 確認手順

Next.js のドキュメントに従って Next.js を起動します。インストール方法によって起動コマンドは変わります。

```
yarn dev
```

Chrome ブラウザから以下の URL にアクセスします。

http://localhost:3000/hello2

今度は HTML に”Hello World!”を表示できるはずです。

### 解説

2 番目と 3 番目の違いは、スマートコントラクトのように外部から取得するデータを Console に表示しているか、HTML に表示しているかの違いです。

実際のアプリケーション開発に近いのはこの 3 番目のやり方ではないでしょうか。

しかし、このやり方はうまく動かないときに、何が原因でうごかないのか見分けにくいというデメリットがあります。

- JavaScritpt の非同期による問題
- Next.js の記述方法の問題
- スマートコントラクトの実行方法の問題

そういう時に、1 番目や 2 番目のやり方を合わせて使うことで、どこがうまく動いて、どこが動いていないのかを見分けることができます。

##

最新の Web3 開発情報を Twitter で発信しています。
よかったらフォローお願いします！

https://twitter.com/motosakanosita
