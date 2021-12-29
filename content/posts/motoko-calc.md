---
title: "Motoko Tutorials: Use integers in calculator functions"
date: 2021-12-29 22:38
tags:
  - DFINITY
  - motoko
  - JP
description: |-
  DFINITYチュートリアル「Use integers in calculator functions」の日本語解説
  実際に使ったコードをGitHubで公開
---

## はじめに
当記事は、DFINITYのMotokoのチュートリアルを日本語で解説しています。
当記事で実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/calc)で公開しています。

[Use integers in calculator functions](https://smartcontracts.org/docs/developers-guide/tutorials/calculator.html)

はじめての方は先にこちらをご覧ください。

[5ステップではじめるMotokoプログラミング](/blog/hello-motoko)

### 実行環境
* dfx: 0.8.4
* macOS: 11.5.2
* npm version: 8.1.3
* 任意のターミナル
* 任意のテキストエディタ

ターミナルとテキストエディタは好きなソフトウェアを使えば大丈夫です。

はじめはMac標準のターミナルでよいと思います。テキストエディタは筆者はVisual Studio Codeを使っています。

## 本プロジェクトで学ぶこと
calcというプロジェクトでcalcキャニスターを作ります。
calcキャニスターは以下の関数を持ち、四則演算を実行します。

* `add`
* `sub`
* `mul`
* `div`
* `clearall`

`clearall`では結果のリセットを行います。

## 手順
### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new calc
cd calc
```

### プロジェクトの構成変更
dfx.jsonにあるソースコードのファイル名を`src/calc/calc_main.mo`に変更します。
```
"main": "src/calc/calc_main.mo",
```
デフォルトの`src/calc/main.mo`を`src/calc/calc_main.mo`にコピーします。
```
cp src/calc/main.mo src/calc/calc_main.mo
```

`src/calc/calc_main.mo`を以下のように編集して保存します。
```
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
