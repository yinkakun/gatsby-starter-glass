---
title: "DFINITY/Motoko入門: Import library modules"
date: 2021-12-30 06:38
permalink: /motoko-phonebook
tags:
  - Motoko
  - tutorial
  - jp
description: |-
  DFINITY/ICPプログラミング「Import library modules」の日本語解説
  実際に使ったコードをGitHubで公開
---

このページでは DFINITY の Motoko のチュートリアルを日本語で解説しています。

[Import library modules](https://smartcontracts.org/docs/developers-guide/tutorials/phonebook.html)

実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/phonebook)からダウンロードできます。

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

phonebook というプロジェクトで phonebook というキャニスターを作ります。
phonebook では以下の機能を実装します。

- `insert`関数では、`name`と`phone`を Key-Value として`book`変数に格納します。
- `lookup`関数は、指定された`name`キーを入力として、関連する`phone`を検索します。

## 手順

### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new phonebook
cd phonebook
```

### コーディング

```ts
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

```ts
import L "mo:base/List";
import A "mo:base/AssocList";
```

`Name`や`Phone`というオリジナルの型を定義しています。
`Text`型の別名として考えることもできます。

```ts
type Name = Text;
type Phone = Text;
```

Motoko のチュートリアルで最初にここで躓く人は多いかもしれません。

```ts
    flexible var book: A.AssocList<Name, Phone> = L.nil<(Name, Phone)>();
```

この 1 行には、これまで登場しなかった要素がいくつも登場します。

- flexible var
- A.AssocList
- <Name, Phone>
- L.nil<(Name, Phone)>()

1 つずつ見ていきましょう！

### flexible var

`var`宣言では`flexible`がデフォルトなので単に`var`と書いたのと同じ意味になります。

### AssocList

AssocList は Association List の略で連想配列です。

電話帳をイメージしてください。名前と電話番号がペアで、たくさんの件数が電話帳に入ります。

Key-Value が複数入るようなデータ構造が連想配列です。

### <Name, Phone>

この記法はジェネリクスと呼ばれます。TypeScript や C++でも使われています。

詳しく知りたい場合は TypeScript や C++のジェネリクスに関する解説などを参考にしてください。

Name や Phone というオリジナルの型で AssocList を利用するため、このように書きます。

### L.nil<(Name, Phone)>()

ここでもジェネリクスが使われています。

nil が予約語のように思えるかもしれませんが、これは List 型の関数名です。

nil()は空のリストを返します。この例では要素の型が<Name, Phone>という連想配列です。

### デプロイ

ローカル実行環境を起動します。

```
dfx start --clean
```

通常は stop しても過去に作ったキャニスターは残っています。
起動時に`--clean`オプションを付けることで過去に作成したキャニスターは削除した状態で起動します。

ビルドしてキャニスターをデプロイします。

```
dfx deploy phonebook
```

### 実行

2 件の名前と電話番号情報を`insert`します。

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

null を返します。

```
出力
(null)
```

2 人の名前を渡すとどうなるでしょうか？

```
phonebook % dfx canister call phonebook lookup '("Maya Garcia","Chris Lynn")'
```

最初に渡した名前の電話番号だけを返す実装になっています。

```
出力
(opt "01 408 395 7276")
```

### Candid UI

Candid UI の使い方は、当ブログのほかの記事で解説しているので割愛します。

### ローカル実行環境の停止

終わったらローカル PC 上の実行環境を停止します。

```
dfx stop
```

### 拡張

このプロジェクトでは、連想配列を DB のように扱うのでいろいろ改造してみると勉強になると思います。

下記の例では Email というフィールドを追加してみました。
`src/phonebook/main2.mo`

```ts
// Import standard library functions for lists

import L "mo:base/List";
import A "mo:base/AssocList";

// The PhoneBook actor.
actor {

    // Type aliases make the rest of the code easier to read.
    public type Name = Text;
    public type Phone = Text;
    public type Email = Text;

    // The actor maps names to phone numbers.
    flexible var book: A.AssocList<Name, Phone> = L.nil<(Name, Phone)>();
    flexible var addressBook: A.AssocList<Name, Email> = L.nil<(Name, Email)>();

    // An auxiliary function checks whether two names are equal.
    func nameEq(l: Name, r: Name): Bool {
        return l == r;
    };

    // A shared invokable function that inserts a new entry
    // into the phone book or replaces the previous one.
    public func insert(name: Name, phone: Phone, email: Email): async () {
        let (newBook, _) = A.replace<Name, Phone>(book, name, nameEq, ?phone);
        book := newBook;
        let (newAddressBook, _) = A.replace<Name, Email>(addressBook, name, nameEq, ?email);
        addressBook := newAddressBook;
    };

    // A shared read-only query function that returns the (optional)
    // phone number corresponding to the person with the given name.
    public query func lookupPhone(name: Name): async ?Phone {
        return A.find<Name, Phone>(book, name, nameEq);
    };
    public query func lookupEmail(name: Name): async ?Email {
        return A.find<Name, Email>(addressBook, name, nameEq);
    };
};
```
