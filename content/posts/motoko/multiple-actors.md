---
title: "DFINITY/Motoko入門: Use multiple actors"
date: 2021-12-30 15:38
permalink: /motoko-multiple-actors
tags:
  - Motoko
  - tutorial
  - jp
description: |-
  DFINITY/ICPプログラミング「Use multiple actors」の日本語解説
  実際に使ったコードをGitHubで公開
---

このページは、DFINITY の Motoko のチュートリアルを日本語で解説しています。

[Use multiple actors](https://smartcontracts.org/docs/developers-guide/tutorials/multiple-actors.html)

実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/multiple_actors)からダウンロードできます。

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

本プロジェクトでは、`assistant`, `rock_paper_scissors`, `daemon`の 3 つのキャニスターを作ります。
それぞれのキャニスターの処理に関連性はありません。

## 手順

### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new multiple_actors
cd multiple_actors
```

### dfx.json の編集

当プロジェクトでは、3 つのキャニスターを作ります。
dfx.json を以下のように書き換えます。

```ts
{
  "canisters": {
    "assistant": {
      "main": "src/assistant/main.mo",
      "type": "motoko"
    },
    "rock_paper_scissors": {
      "main": "src/rock_paper_scissors/main.mo",
      "type": "motoko"
    },
    "daemon": {
      "main": "src/daemon/main.mo",
      "type": "motoko"
    }
  },
  "defaults": {
    "build": {
      "args": "",
      "packtool": ""
    }
  },
  "dfx": "0.8.4",
  "networks": {
    "local": {
      "bind": "127.0.0.1:8000",
      "type": "ephemeral"
    }
  },
  "version": 1
}
```

dfx.json に書いたパスに Motoko のソースファイルをコピーします。

```
cp -r src/multiple_actors/ src/assistant/
cp -r src/assistant/ src/rock_paper_scissors/
cp -r src/assistant/ src/daemon/
```

### コーディング

`src/assistant/motoko.mo`

```ts
import Array "mo:base/Array";
import Nat "mo:base/Nat";

// Define the actor
actor Assistant {

  stable var todos : [ToDo] = [];
  stable var nextId : Nat = 1;

  // Define to-do item properties
  type ToDo = {
    id : Nat;
    description : Text;
    completed : Bool;
  };

  // Add to-do item utility
  func add(todos : [ToDo], description : Text, id : Nat) : [ToDo] {
    let todo : ToDo = {
      id = id;
      description = description;
      completed = false;
    };
    Array.append(todos, [todo])
};

  // Show to-do item utility
  func show(todos : [ToDo]) : Text {
    var output : Text = "\n___TO-DOs___";
    for (todo : ToDo in todos.vals()) {
      output #= "\n(" # Nat.toText(todo.id) # ") " # todo.description;
      if (todo.completed) { output #= " ✔"; };
    };
    output
  };

  public func addTodo (description : Text) : async () {
    todos := add(todos, description, nextId);
    nextId += 1;
  };

  public query func showTodos () : async Text {
    show(todos)
  };

};
```

`src/rock_paper_scissors/motoko.mo`

```ts
import I "mo:base/Iter";

actor RockPaperScissors {

  stable var alice_score : Nat = 0;
  stable var bob_score : Nat = 0;
  stable var alice_last : Choice = #scissors;
  stable var bob_last : Choice = #rock;

  type Choice = {
    #rock;
    #paper;
    #scissors;
  };

  public func contest() : async Text {
    for (i in I.range(0, 99)) {
      battle_round();
    };
    var winner = "The contest was a draw";
    if (alice_score > bob_score) winner := "Alice won"
    else if (alice_score < bob_score) winner := "Bob won";
    return (winner);
  };

  func battle_round() : () {
    let a = alice(bob_last);
    let b = bob(alice_last);

    switch (a, b) {
      case (#rock, #scissors) alice_score += 1;
      case (#rock, #paper) bob_score += 1;
      case (#paper, #scissors) alice_score += 1;
      case (#paper, #rock) bob_score += 1;
      case (#scissors, #paper) alice_score += 1;
      case (#scissors, #rock) bob_score += 1;
      case (#rock, #rock) alice_score += 0;
      case (#paper, #paper) bob_score += 0;
      case (#scissors, #scissors) alice_score += 0;
    };

    alice_last := a;
    bob_last := b;

    return ();
  };

  // Hard-coded players and choices
  func bob(last : Choice) : Choice {
    return #paper;
  };

  func alice(last : Choice) : Choice {
    return #rock;
  };
};
```

`src/daemon/main.mo`

```ts
actor Daemon {
  stable var running = false;

  public func launch() : async Text {
    running := true;
    debug_show "The daemon process is running";
  };

  public func stop(): async Text {
    running := false;
    debug_show "The daemon is stopped";
  };
};
```

### 実行

`assistant`, `rock_paper_scissors`, `daemon`の 3 つのキャニスターを実行します。

```
dfx canister call assistant addTodo '("Schedule monthly demos")'
dfx canister call assistant showTodos
("
___TO-DOs___
(1) Schedule monthly demos")
```

```
dfx canister call rock_paper_scissors contest
("Bob won")
```

```
dfx canister call daemon launch
(""The daemon process is running"")
```

### ローカル実行環境の停止

終わったらローカル PC 上の実行環境を停止します。

```
dfx stop
```
