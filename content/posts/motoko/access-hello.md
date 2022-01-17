---
title: "DFINITY/Motoko入門: Add access control with identities"
date: 2022-01-02 20:38
permalink: /access-hello
tags:
  - Motoko
  - tutorial
  - jp
description: |-
  【DFINITY/ICPプログラミング】Motokoでユーザーによって処理を変える方法を解説
---

このページでは DFINITY/ICP の Motoko のチュートリアルを日本語で解説しています。

[Add access control with identities](https://smartcontracts.org/docs/developers-guide/tutorials/access-control.html)

実際に使ったソースコードは[GitHub](https://github.com/smacon-dev/motoko-tutorial/tree/main/access_hello)からダウンロードできます。

はじめての方はこちらをご覧ください。

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

ユーザーごとに権限を割り当てて、処理を変える方法を実現します。
いろんなユースケースで使える実用的なチュートリアルです。

dfx コマンドラインツールには identity という概念があり、
複数の identity を作ったり切り替えてアクセスすることができます。

identity は、秘密鍵と Principal ID のペアです。

秘密鍵は dfx コマンドを実行するローカル側に持ちます。
キャニスター側では、Principal ID で識別します。

## 手順

### プロジェクトの作成

新しいプロジェクトを作ります。

```
dfx new access_hello
cd access_hello
```

### コーディング

エディタを使って、`src/access_hello/main.mo` を編集します。

```ts
// Import base modules
import AssocList "mo:base/AssocList";
import Error "mo:base/Error";
import List "mo:base/List";

shared({ caller = initializer }) actor class() {

    // Establish role-based greetings to display
    public shared({ caller }) func greet(name : Text) : async Text {
        if (has_permission(caller, #assign_role)) {
            return "Hello, " # name # ". You have a role with administrative privileges."
        } else if (has_permission(caller, #lowest)) {
            return "Welcome, " # name # ". You have an authorized account. Would you like to play a game?";
        } else {
            return "Greetings, " # name # ". Nice to meet you!";
        }
    };

    // Define custom types
    public type Role = {
        #owner;
        #admin;
        #authorized;
    };

    public type Permission = {
        #assign_role;
        #lowest;
    };

    private stable var roles: AssocList.AssocList<Principal, Role> = List.nil();
    private stable var role_requests: AssocList.AssocList<Principal, Role> = List.nil();

    func principal_eq(a: Principal, b: Principal): Bool {
        return a == b;
    };

    func get_role(pal: Principal) : ?Role {
        if (pal == initializer) {
            ?#owner;
        } else {
            AssocList.find<Principal, Role>(roles, pal, principal_eq);
        }
    };

    // Determine if a principal has a role with permissions
    func has_permission(pal: Principal, perm : Permission) : Bool {
        let role = get_role(pal);
        switch (role, perm) {
            case (?#owner or ?#admin, _) true;
            case (?#authorized, #lowest) true;
            case (_, _) false;
        }
    };

    // Reject unauthorized user identities
    func require_permission(pal: Principal, perm: Permission) : async () {
        if ( has_permission(pal, perm) == false ) {
            throw Error.reject( "unauthorized" );
        }
    };

    // Assign a new role to a principal
    public shared({ caller }) func assign_role( assignee: Principal, new_role: ?Role ) : async () {
        await require_permission( caller, #assign_role );

        switch new_role {
            case (?#owner) {
                throw Error.reject( "Cannot assign anyone to be the owner" );
            };
            case (_) {};
        };
        if (assignee == initializer) {
            throw Error.reject( "Cannot assign a role to the canister owner" );
        };
        roles := AssocList.replace<Principal, Role>(roles, assignee, principal_eq, new_role).0;
        role_requests := AssocList.replace<Principal, Role>(role_requests, assignee, principal_eq, null).0;
    };

    public shared({ caller }) func request_role( role: Role ) : async Principal {
        role_requests := AssocList.replace<Principal, Role>(role_requests, caller, principal_eq, ?role).0;
        return caller;
    };

    // Return the principal of the message caller/user identity
    public shared({ caller }) func callerPrincipal() : async Principal {
        return caller;
    };

    // Return the role of the message caller/user identity
    public shared({ caller }) func my_role() : async ?Role {
        return get_role(caller);
    };

    public shared({ caller }) func my_role_request() : async ?Role {
        AssocList.find<Principal, Role>(role_requests, caller, principal_eq);
    };

    public shared({ caller }) func get_role_requests() : async List.List<(Principal,Role)> {
        await require_permission( caller, #assign_role );
        return role_requests;
    };

    public shared({ caller }) func get_roles() : async List.List<(Principal,Role)> {
        await require_permission( caller, #assign_role );
        return roles;
    };
};
```

### デプロイ

ローカルの実行環境を起動します。

```
dfx start --background
```

`--background`オプションをつけることで、後続のコマンドを同じウィンドウで実行できます。

```
dfx deploy access_hello
```

```
出力
Deploying: access_hello
Creating canisters...
Creating canister "access_hello"...
"access_hello" canister created with canister id: "rwlgt-iiaaa-aaaaa-aaaaa-cai"
Building canisters...
Installing canisters...
Installing code for canister access_hello, with canister_id rwlgt-iiaaa-aaaaa-aaaaa-cai
Deployed canisters.
```

## 実行

これから 4 つの identity を使ってキャニスターの動作を検証します。
各 identity はそれぞれ別の role を割り当てます。

| identity     | role       |
| ------------ | ---------- |
| default      | owner      |
| ic_admin     | admin      |
| alice_auth   | authorized |
| bob_standard | none       |

### キャニスターをデプロイした identity は owner

dfx が使っている現在の identity を確認

```
access_hello % dfx identity whoami
default
```

Principal ID を確認

```
access_hello % dfx identity get-principal
zr2yi-7hrww-jgne7-j4gbs-2xu5a-ms3wg-ixp3t-4azyp-ifmeb-yxym6-sqe
```

my_role 関数で実行者の Principal ID に紐づく role を表示させてみます。

```
dfx canister --wallet=$(dfx identity get-wallet) call access_hello my_role
```

```
出力
(opt variant { owner })
```

このキャニスターをデプロイした`default`の identity は`owner`ロールになっています。

### ic_admin

`ic_admin`という新しい identity を作ります。
新しい秘密鍵と Principal ID のペアが作られます。

```
dfx identity new ic_admin
```

```
出力
Creating identity: "ic_admin".
Created identity: "ic_admin".
```

`ic_admin`を使って my_role 関数を実行してみましょう。

```
dfx --identity ic_admin canister call access_hello my_role
```

```
出力
(null)
```

さっきまでは--identity オプションで指定していましたが、
dfx の identity を`ic_admin`に切り替えます。

```
access_hello % dfx identity use ic_admin && dfx identity get-principal
Using identity: "ic_admin".
ptgej-o2oox-uin5n-64lps-ouln7-e677b-jwi75-ije6c-x3awj-o6yw7-mae
```

切り替えた identity で`access_hello`キャニスターを call して、Principal を確認します

```
access_hello % dfx canister call access_hello callerPrincipal
(principal "ptgej-o2oox-uin5n-64lps-ouln7-e677b-jwi75-ije6c-x3awj-o6yw7-mae")
```

`ic_admin`の Principal ID でキャニスターを実行していることが確認できました。

### ロールのアサイン

`ic_admin`に`admin`ロールをアサインするために、いったん`owner`である`default`に戻しましょう

```
dfx identity use default
```

`default`の権限を使って`ic_admin`に`admin`ロールをアサインします。
アサインするときは、先ほど表示させた`admin`の Principal ID を渡します。

```
dfx canister --wallet=$(dfx identity get-wallet) call access_hello assign_role '((principal "ptgej-o2oox-uin5n-64lps-ouln7-e677b-jwi75-ije6c-x3awj-o6yw7-mae"),opt variant{admin})'
```

再び`ic_admin`の identity で my_role を実行してみます。

```
dfx --identity ic_admin canister call access_hello my_role
```

```
出力
(opt variant { admin })
```

`ic_admin`で実行した my_role 関数の結果、`admin`になりました。

`ic_admin`を使って greet 関数を実行してみましょう。

```
dfx --identity ic_admin canister call access_hello greet "Internet Computer Admin"
(
  "Hello, Internet Computer Admin. You have a role with administrative privileges.",
)
```

greet 関数はロールによってメッセージが変わります。興味があれば main.mo を見てみましょう！

### alice_auth に authorized ロールをアサイン

新しく`alice_auth`という identity を作ります。

```
dfx identity new alice_auth
```

```
出力
Creating identity: "alice_auth".
Created identity: "alice_auth".
```

`alice_auth`に切り替えます。

```
dfx identity use alice_auth
```

`alice_auth`の Principal ID を`ALICE_ID`という環境変数に入れます。

```
ALICE_ID=$(dfx identity get-principal)
```

`ALICE_ID`の中身を確認してみましょう。

```
echo $ALICE_ID
lwhzc-k3xsu-i222u-6guck-cszug-i6fnj-uhigp-4hjgo-2uhyv-qma73-mae
```

`ic_admin`の権限で`alice_auth`の Principal ID に`authorized`というロールをアサインします。

```
dfx --identity ic_admin canister call access_hello assign_role "(principal \"$ALICE_ID\", opt variant{authorized})"
```

`alice_auth`のロールを確認します。

```
dfx --identity alice_auth canister call access_hello my_role
```

```
出力
(opt variant { authorized })
```

`authorized`ロールがアサインされた`alice_auth`で greet 関数を call してみましょう。

```
dfx canister call access_hello greet "Alice"
(
  "Welcome, Alice. You have an authorized account. Would you like to play a game?",
)
```

### bob_standard

今使っている identity がわからなくなってしまったら、whoami で表示させたり use で切り替えたりしてください。
また切り替えなくても--identity オプションで実行する identity を指定することもできるので好きに使い分けてください。

```
dfx identity whoami
dfx identity use <切り替え先>
dfx --identity <実行者> canister call ...
```

`bob_standard`を作ります。

```
dfx identity new bob_standard
Creating identity: "bob_standard".
Created identity: "bob_standard".
```

```
BOB_ID=$(dfx --identity bob_standard identity get-principal)
```

作ったばかりでなにも権限を持っていない`bob_standard`の実行によって、bob_standard に`authorized`をアサインさせようと試みます。
これは失敗することを期待しています。

```
dfx --identity bob_standard canister call access_hello assign_role "(principal \"$BOB_ID\", opt variant{authorized})"
```

```
出力
The Replica returned an error: code 4, message: "unauthorized"
```

owner 権限を持つ default の identity を使って、bob_standard に owner 権限をアサインしてみましょう。

```
dfx --identity default canister --wallet=$(dfx --identity default identity get-wallet) call access_hello assign_role "(principal \"$BOB_ID\", opt variant{owner})"
```

このコマンドは以下のようにエラーを出力します。
ユーザーを owner にすることはできません。

```
出力
An error happened during the call: 4: Cannot assign anyone to be the owner
```

ロールを与えられていない`bob_standard`で greet 関数を実行してみましょう。

```
dfx --identity bob_standard canister --no-wallet call access_hello greet "Bob"
("Greetings, Bob. Nice to meet you!")
```

このように与えられたロールによって実行できる関数と実行できない関数をできました。

### 停止

dfx.json があるディレクトリで以下のコマンドを実行して、実行環境を停止します。

```
dfx stop
```
