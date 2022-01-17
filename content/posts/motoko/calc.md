---
title: "DFINITY/Motoko入門: Use integers in calculator functions"
date: 2021-12-29 22:38
permalink: /motoko-calc
tags:
  - Motoko
  - tutorial
  - jp
description: |-
  DFINITY/ICPプログラミング「Use integers in calculator functions」の日本語解説
  実際に使ったコードをGitHubで公開
---

このページは、DFINITY の Motoko のチュートリアルを日本語で解説しています。

[Use integers in calculator functions](https://smartcontracts.org/docs/developers-guide/tutorials/calculator.html)

実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/calc)からダウンロードできます。

はじめての方は先にこちらをご覧ください。

[5 ステップではじめる Motoko プログラミング入門](/hello-motoko)

### 実行環境

- dfx: 0.8.4
- macOS: 11.5.2
- npm version: 8.1.3
- 任意のターミナル
- 任意のテキストエディタ

ターミナルとテキストエディタは好きなソフトウェアを使えば大丈夫です。

はじめは Mac 標準のターミナルでよいと思います。テキストエディタは筆者は Visual Studio Code を使っています。

## 本プロジェクトで学ぶこと

calc というプロジェクトで calc キャニスターを作ります。
calc キャニスターは以下の関数を持ち、四則演算を実行します。

- `add`
- `sub`
- `mul`
- `div`
- `clearall`

`clearall`では結果のリセットを行います。

## 手順

### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new calc
cd calc
```

### プロジェクトの構成変更

dfx.json にあるソースコードのファイル名を`src/calc/calc_main.mo`に変更します。

```
"main": "src/calc/calc_main.mo",
```

デフォルトの`src/calc/main.mo`を`src/calc/calc_main.mo`にコピーします。

```
cp src/calc/main.mo src/calc/calc_main.mo
```

`src/calc/calc_main.mo`を以下のように編集して保存します。

```ts
// This single-cell calculator defines one calculator instruction per
// public entry point (add, sub, mul, div).

// Create a simple Calc actor.
actor Calc {
  var cell : Int = 0;

  // Define functions to add, subtract, multiply, and divide
  public func add(n:Int) : async Int { cell += n; cell };
  public func sub(n:Int) : async Int { cell -= n; cell };
  public func mul(n:Int) : async Int { cell *= n; cell };
  public func div(n:Int) : async ?Int {
    if ( n == 0 ) {
      return null // null indicates div-by-zero error
    } else {
      cell /= n; ?cell
    }
  };

  // Clear the calculator and reset to zero
  public func clearall() : async Int {
    if (cell : Int != 0)
      cell -= cell;
    return cell
  };
 };
```

## デプロイ

ローカルの実行環境を起動します。

```
dfx start
```

デプロイします。

```
dfx deploy
```

```
出力
Creating a wallet canister on the local network.
The wallet canister on the "local" network for user "default" is "rwlgt-iiaaa-aaaaa-aaaaa-cai"

<中略>

Committing batch.
Deployed canisters.
```

## 実行

`add`関数に 10 を渡して実行します。

```
calc % dfx canister call calc add '(10)'
```

```
出力
(10 : int)
```

`mul`関数に 3 を渡して実行します。(10 x 3)

```
dfx canister call calc mul '(3)'
```

```
出力
(30 : int)
```

`sub`関数に 5 を渡して実行します。(30 - 5)

```
dfx canister call calc sub '(5)'
```

```
出力
(25 : int)
```

`div`関数に 5 を渡して実行します。(25 / 5)

```
dfx canister call calc div '(5)'
```

```
出力
(opt (5 : int))
```

`mul`関数に-4 を渡して実行します。(5 x -4)

```
calc % dfx canister call calc mul '(-4)'
```

```
出力
(-20 : int)
```

`clearall`関数を実行してリセットします。

```
dfx canister call calc clearall
```

```
出力
(0 : int)
```

## Candid UI を使った実行

ローカル実行環境の Candid キャニスター ID を確認します。

```
dfx canister id __Candid_UI
```

```
出力
r7inp-6aaaa-aaaaa-aaabq-cai
```

もし、実行環境が停止中なら起動します。

```
dfx start --background
```

先程のキャニスター ID に置き換えて、以下の URL にブラウザでアクセスします。

```
http://127.0.0.1:8000/?canisterId=<CANDID-UI-CANISTER-IDENTIFIER>
```

```
http://127.0.0.1:8000/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai
```

`calc`キャニスターの ID を取得して、ブラウザの`Provide a canister ID`に入力します。

```
calc % dfx canister id calc
```

以下のような画面が表示されます。

![Candid UI](/media/motoko-calc/2.png)

それぞれの関数をいろいろ試してみましょう！

## 実行環境の停止

終わったらローカル PC 上の実行環境を停止します。

```
dfx stop
```
