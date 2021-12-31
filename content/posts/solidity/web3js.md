---
title: web3.JSを使ってスマートコントラクトを実行する3つの方法
date: 2021-06-06 19:38
slug: /web3js
tags:
  - Solidity
  - beginner
  - JavaScript
  - jp
social_image: /media/dfinity.jpeg
description: |-
  JavaScriptからスマートコントラクトを実行する方法

---

こんな人にピッタリ！

* 自分で作ったスマートコントラクトを実行したい
* JavaScriptからスマコンを実行する方法がわからない
* Node.jsのモジュールを使ってシンプルにスマコンを実行したい
* web3.jsの使い方がわからない
* 将来エンジニアになりたい

スマコンかいはつ室へようこそ！

ぼくは2017年ごろからブロックチェーンを触り、2021年現在はWeb系のグローバルスタートアップで働く本業の傍らで、起業してブロックチェーンを使ったサービスを開発しています。

当記事では、ブロックチェーン上にデプロイしたスマートコントラクトをweb3.jsを使って実行する方法を３つ紹介します。

* HTMLとJavaScriptだけのシンプルなweb3.js
* Next.jsを使ったweb3.js（Chromeのコンソールに表示）
* Next.jsを使ったweb3.js（HTMLに表示）

今回実行するスマートコントラクトは、以下の記事で作ったHello Worldプログラムです。

## 必要なもの

* live-server
* Next.jsアプリケーション
* npmのweb3.js
* スマートコントラクトのアドレス
* スマートコントラクトのABI

### live-server
３つの確認方法のうち、

HTMLとJavaScriptファイルだけのweb3.jsの実行方法
1番目ではlive-serverを使います。live-serverはnpmを使ってインストールできます。
live-serverはローカルPC上で利用できる軽量なHTTPサーバです。
PC上のHTMLファイルをブラウザを通してアクセスできます。

### Next.jsアプリケーション
JavaScriptを使ったアプリケーションを書く場合、ReactやVue.jsなどいろんなフレームワークを使いますが、それらは基本的にサーバサイドのJavaScript言語であるNode.jsを使っています。

Node.jsを使ってスマートコントラクトを実行する方法は、いろいろあります。
なるべくシンプルで汎用的に応用できることを考えてNext.jsを使った2つweb3.jsの実行方法を紹介します。

Next.jsの新しいプロジェクトを用意してください。

https://nextjs.org/docs/getting-started

### npmのweb3.js
Next.jsのプロジェクトにnpmを使ってweb3.jsをインストールします。

プロジェクトのトップディレクトリ（package.jsonファイルのある場所）で以下のコマンドを実行しましょう。

```
npm install web3 --save
```

### スマートコントラクトのアドレス
スマートコントラクトを実行する場合にコントラクトアドレスを指定します。
今回使うスマートコントラクトのアドレスを調べましょう。

Truffleを使ってGanacheにコントラクトをデプロイした場合は、buildディレクトリの下にhelloWorld.jsonというファイルが作られて、中にコントラクトアドレスがかかれています。

```
  "networks": {
    "5777": {
      "events": {},
      "links": {},
      "address": "0x0cb51E4BF025C8F5Df16B3f523249C58e1361B73",
      "transactionHash": "0xbd6c7a8de462e0c35b5c696aab5b02a64775aa7a6c3a4545ce0820d1457bd920"
    }
  },
```

### スマートコントラクトのABI
スマートコントラクトを実行する場合、そのコントラクトがどんなファンクションを持っているのかやどんな型の情報を返すのかといったインターフェースの情報が必要になります。
それがABI（Application Binary Interface）です。

Truffleでデプロイした場合は、コントラクトアドレスと同じくbuildディレクトリ配下のhelloWorld.jsonに書かれています。

```
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

## HTMLとJavaScriptだけのシンプルなweb3.js
### コード
３つのファイルを作って同じディレクトリに置きましょう。

* index.html
* app.js
* helloWorld.js

#### index.html
```
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
```
import helloWorld from './helloWorld.js';

window.onload = function() {
  helloWorld();
}
```
#### helloWorld.js
```
export default function () {
  var abi = [{
      "constant": true,
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    }];

  var address = "0x5B0A7974Aeab510BB344e7f27e607841b4EC4C9f"; // コントラクトアドレス

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

  var contract = new web3.eth.Contract(abi, address);
  contract.methods.get().call(function(err,res){
    document.getElementById("contract-result").textContent = res;
    console.log(res);
  })
}
```

### 確認手順
配置したディレクトリでlive-serverを実行します。

```
live-server .
```

live-serverを実行すると、自動でブラウザが開いてindex.htmlを表示します。

### 解説
HTMLとJavaScriptを使った一番シンプルなやり方です。

ここではインターネット上のweb3.jsをCDNからダウンロードして使っています。あとから紹介するNext.jsを使う2つのやり方では、Node.jsライブラリのweb3.jsを使います。

```
  <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
```

どのブロックチェーンに繋ぐかどうかは、helloWorld.jsの以下の行で指定しています。

```
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
```

ブラウザにMetamaskなどがある場合は、Web3.givenProviderを指定するとMetamaskが接続しているブロックチェーンのエンドポイントをもとにweb3オブジェクトが作られます。

Web3.givenProviderで取得できない場合は、”ws://localhost:7545″に接続するように書いています。
これはGanacheに接続するときのWebSocketのエンドポイントです。

## Next.jsを使ったweb3.js（Chromeのコンソールに表示）

### コード
Next.jsアプリケーションのpagesディレクトリの下にhello1.jsというファイルを作って、以下のコードを貼り付けます。

コントラクトアドレスやABIは自分の使うコントラクトに置き換えましょう。

#### pages/hello1.js
```
import Web3 from 'web3'

var abi = [{
    "constant": true,
    "inputs": [],
    "name": "get",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  }];

var address = "0x5B0A7974Aeab510BB344e7f27e607841b4EC4C9f"; // コントラクトアドレス

function Hello1() {
  var ret = "";
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

  var contract = new web3.eth.Contract(abi, address);
  contract.methods.get().call(function(err,res){
    console.log(res)
    ret = res;
  })

  return "ret: " + ret;
}

export default Hello1
```

### 確認手順
Next.jsのドキュメントに従ってNext.jsを起動します。インストール方法によって起動コマンドは変わります。

```
yarn dev
```

Chromeブラウザから以下のURLにアクセスします。

http://localhost:3000/hello1

ChromeのDeveloper Toolsのコンソールタブを開きます。Macなら「command」＋「option」+「I（アイ）｝で開きます。

Consoleに”Hello World!”という文字が表示されています。これはスマートコントラクトから取得した文字列です。

ブラウザで表示するHTMLは下のようになると思います。HTMLでは”Hello World”を表示できていない状態です。

HTMLに表示させるやり方は3番目で紹介します。

### 解説
先ほどの1つ目のHTMLを使った実行方法では、web3.jsはCDNからダウンロードしてブラウザ上でJavaScriptを実行しました。

今回は、web3.jsはNode.jsのモジュールを使っています。

一般的なアプリケーション開発では、Node.jsを使ったやり方が主流になると思います。ReactやVueを使う場合もNode.jsのweb3.jsを使います。

ブロックチェーンとの接続部分やweb3オブジェクトの使い方は1つ目のHTMLの方法と基本的に同じです。

取得したHello Worldという文字列を返して、HTMLに表示させようとしていますが、じつはこれはうまく動きません。

```
return "ret: " + ret;
```

つぎの3番目の方法では、Next.jsでAPIやスマートコントラクトなど外部から取得したデータをHTMLに表示するやり方で紹介します。

## Next.jsを使ったweb3.js（HTMLに表示）
### コード
Next.jsアプリケーションのpagesディレクトリの下にhello2.jsというファイルを作って、以下のコードを貼り付けます。

コントラクトアドレスやABIは自分の使うコントラクトに置き換えましょう。

#### pages/hello2.js
```
import Web3 from 'web3'

function Hello2({ message }) {
  console.log("message: " + message);
  return (
    <ul>
      { message }
    </ul>
  );
}

export async function getStaticProps() {
  let message = "hoge22";
  let abi = [{
      "constant": true,
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    }];

  let address = "0x5B0A7974Aeab510BB344e7f27e607841b4EC4C9f";

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
  const contract = new web3.eth.Contract(abi, address);

  await contract.methods.get().call(function(err,res){
    message = res;
  })

  return {
    props: {
      message
    }
  };
}

export default Hello2;
```

### 確認手順
Next.jsのドキュメントに従ってNext.jsを起動します。インストール方法によって起動コマンドは変わります。

```
yarn dev
```

Chromeブラウザから以下のURLにアクセスします。

http://localhost:3000/hello2

今度はHTMLに”Hello World!”を表示できるはずです。

### 解説
2番目と3番目の違いは、スマートコントラクトのように外部から取得するデータをConsoleに表示しているか、HTMLに表示しているかの違いです。

実際のアプリケーション開発に近いのはこの3番目のやり方ではないでしょうか。

しかし、このやり方はうまく動かないときに、何が原因でうごかないのか見分けにくいというデメリットがあります。

* JavaScritptの非同期による問題
* Next.jsの記述方法の問題
* スマートコントラクトの実行方法の問題

そういう時に、1番目や2番目のやり方を合わせて使うことで、どこがうまく動いて、どこが動いていないのかを見分けることができます。


スマコン開発の最新の情報をTwitterで発信しています。

https://twitter.com/motosakanosita
