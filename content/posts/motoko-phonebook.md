---
title: "Motoko Tutorials: Import library modules"
date: 2021-12-30 06:38
tags:
  - DFINITY
  - motoko
  - JP
description: |-
  DFINITYチュートリアル「Import library modules」の日本語解説
  実際に使ったコードをGitHubで公開
---

## はじめに
当記事は、DFINITYのMotokoのチュートリアルを日本語で解説しています。
当記事で実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/phonebook)で公開しています。

[Import library modules](https://smartcontracts.org/docs/developers-guide/tutorials/phonebook.html)

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
phonebookというプロジェクトでphonebookというキャニスターを作ります。
phonebookでは以下の機能を実装します。
* `insert`関数では、`name`と`phone`をKey-Valueとして`book`変数に格納します。
* `lookup`関数は、指定された`name`キーを入力として、関連する`phone`を検索します。

## 手順
### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new phonebook
cd phonebook
```

### コーディング
```
// Import standard library functions for lists

import L "mo:base/List";
import A "mo:base/AssocList";

// The PhoneBook actor.
actor {

    // Type aliases make the rest of the code easier to read.
    public type Name = Text;
    public type Phone = Text;

    // The actor maps names to phone numbers.
    flexible var book: A.AssocList<Name, Phone> = L.nil<(Name, Phone)>();

    // An auxiliary function checks whether two names are equal.
    func nameEq(l: Name, r: Name): Bool {
        return l == r;
    };

    // A shared invokable function that inserts a new entry
    // into the phone book or replaces the previous one.
    public func insert(name: Name, phone: Phone): async () {
        let (newBook, _) = A.replace<Name, Phone>(book, name, nameEq, ?phone);
        book := newBook;
    };

    // A shared read-only query function that returns the (optional)
    // phone number corresponding to the person with the given name.
    public query func lookup(name: Name): async ?Phone {
        return A.find<Name, Phone>(book, name, nameEq);
    };
};
```

### コード解説

本チュートリアルのタイトルにもあるようにこのプロジェクトではライブラリを使っています。
```
import L "mo:base/List";
import A "mo:base/AssocList";
```
`Name`や`Phone`というオリジナルの型を定義しています。
`Text`型の別名として考えることもできます。
```
    public type Name = Text;
    public type Phone = Text;
```

Motokoのチュートリアルで最初にここで躓く人は多いかもしれません。
```
    flexible var book: A.AssocList<Name, Phone> = L.nil<(Name, Phone)>();
```
この1行には、これまで登場しなかった要素がいくつも登場します。
* `flexible var`
* `A.AssocList`
* `<Name, Phone>`
* `L.nil<(Name, Phone)>()`

1つずつ見ていきましょう！
### `flexible var`
`var`宣言では`flexible`がデフォルトなので単に`var`と書いたのと同じ意味になります。

### `AssocList`
`AssocList`はAssociation Listの略で連想配列です。

電話帳をイメージしてください。名前と電話番号がペアで、たくさんの件数が電話帳に入ります。
Key-Valueが複数入るようなデータ構造が連想配列です。

### `<Name, Phone>`
この記法はジェネリクスと呼ばれます。TypeScriptやC++でも使われています。
詳しく知りたい場合はTypeScriptやC++のジェネリクスに関する解説などを参考にしてください。

NameやPhoneというオリジナルの型でAssocListを利用するため、このように書きます。

### `L.nil<(Name, Phone)>()`
ここでもジェネリクスが使われています。`nil`が予約語のように思えるかもしれませんが、これはList型の関数名です。
`nil()`という関数は空のリストを返します。この例では要素の型が`<Name, Phone>`という連想配列です。

### デプロイ
ローカル実行環境を起動します。
```
dfx start --clean
```
通常はstopしても過去に作ったキャニスターは残っています。
起動時に`--clean`オプションを付けることで過去に作成したキャニスターは削除した状態で起動します。

ビルドしてキャニスターをデプロイします。
```
dfx deploy phonebook
```

### 実行
2件の名前と電話番号情報を`insert`します。
```
dfx canister call phonebook insert '("Chris Lynn", "01 415 792 1333")'
dfx canister call phonebook insert '("Maya Garcia", "01 408 395 7276")'
```
`Chris Lynn`のデータを連想配列`book`の中から検索します。
```
phonebook % dfx canister call phonebook lookup '("Chris Lynn")'
```
```
出力
(opt "01 415 792 1333")
```
電話番号で逆引きするとどうなるでしょうか？
```
dfx canister call phonebook lookup '("01 408 395 7276")'
```
nullを返します。
```
出力
(null)
```
2人の名前を渡すとどうなるでしょうか？
```
phonebook % dfx canister call phonebook lookup '("Maya Garcia","Chris Lynn")'
```
最初に渡した名前の電話番号だけを返す実装になっています。
```
出力
(opt "01 408 395 7276")
```

### Candid UI
Candid UIの使い方は、当ブログのほかの記事で解説しているので割愛します。

### ローカル実行環境の停止
終わったらローカルPC上の実行環境を停止します。
```
dfx stop
```