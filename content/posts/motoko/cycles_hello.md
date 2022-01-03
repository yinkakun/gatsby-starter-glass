---
title: "DFINITY入門: Accept cycles from a wallet"
date: 2022-01-03 20:38
permalink: /cycles-hello
tags:
  - tutorial
  - dfinity
  - motoko
  - icp
  - jp
description: |-
  DFINITY(Internet Computer)でキャニスターを動かす際に必要になるCycle Cost
  ICPをCYCLEに変える、ウォレットにCYCLEをチャージ

---

## はじめに
この記事では、DFINITYのチュートリアル
[「Accept cycles from a wallet」](https://smartcontracts.org/docs/developers-guide/tutorials/simple-cycles.html)
を日本語で解説しています。

実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/cycles_hello)で公開しています。

### 実行環境
* dfx: 0.8.4
* macOS: 11.5.2
* npm version: 8.1.3
* 任意のターミナル
* 任意のテキストエディタ

dfxについて知りたい方はこちらをどうぞ

[5ステップではじめるMotokoプログラミング入門](/hello-motoko)

ターミナルは、なんでもよいのでMac標準のターミナルで大丈夫です。
テキストエディタはVisual Studio Codeを筆者は使っています。

## 本プロジェクトで学ぶこと
WIP

## 手順
### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new cycles_hello
cd cycles_hello
```

### コーディング

#### src/cycles_hello/main.mo
```ts
import Nat64 "mo:base/Nat64";
import Cycles "mo:base/ExperimentalCycles";

shared(msg) actor class HelloCycles (
   capacity: Nat
  ) {

  var balance = 0;

  // Return the current cycle balance
  public shared(msg) func wallet_balance() : async Nat {
    return balance;
  };

  // Return the cycles received up to the capacity allowed
  public func wallet_receive() : async { accepted: Nat64 } {
    let amount = Cycles.available();
    let limit : Nat = capacity - balance;
    let accepted =
      if (amount <= limit) amount
      else limit;
    let deposit = Cycles.accept(accepted);
    assert (deposit == accepted);
    balance += accepted;
    { accepted = Nat64.fromNat(accepted) };
  };

  // Return the greeting
  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  // Return the principal of the caller/user identity
  public shared(msg) func owner() : async Principal {
    let currentOwner = msg.caller;
    return currentOwner;
  };

};
```

## 実行

ローカル実行環境を起動
```
dfx start --clean --background
```

キャニスターのビルド＆デプロイ
```
dfx deploy --argument '(360000000000)'
```
```
出力
Deploying all canisters.
（中略）
Installing code for canister cycles_hello_assets, with canister_id rrkah-fqaaa-aaaaa-aaaaq-cai
Uploading assets to asset canister...
Deployed canisters.
```

キャニスターのownerのPrincipal IDを表示させます
```
dfx canister call cycles_hello owner
```
```
出力
(principal "zr2yi-7hrww-jgne7-j4gbs-2xu5a-ms3wg-ixp3t-4azyp-ifmeb-yxym6-sqe")
```
このPrincipal IDはデプロイしたIdentityのPrincipal IDで以下のコマンドの結果と一致します。
```
dfx identity get-principal
```