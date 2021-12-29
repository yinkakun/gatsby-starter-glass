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
