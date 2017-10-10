Node-RED用Platioノード
======================

このノードを使用すると、Node-REDから、[Platio](https://plat.io/)のプレート・ミニアプリにレコードを取得・作成・更新・削除することができます。

このノードは、Platio APIを使用してPlatioと通信するため、Platio APIの基本的な動作について知っておく必要があります。Platio APIについては、[Platio APIドキュメント](https://doc.plat.io/ja/)を参照してください。

##### OpenBlocks

OpenBlocksなどの、古いnode.jsを採用しているプラットフォーム上でNode-RED用Platioノードを使用するには、[node-red-contrib-platio-openblocks](https://github.com/infoteria/node-red-contrib-platio-openblocks)パッケージをご利用ください。


プレートとPlatio APIの準備
--------------------------

1. Platio Studioでプレートを作成します。
2. プレートのユーザーを作成します。この時、「レコードや添付ファイルへのAPIでのアクセスを許可」にチェックを入れます。
3. プレートのPlatio Data Consoleを開き、作成したユーザーでログインします。
4. 開発者ページにアクセスし、必要な情報を確認します。


ノードの共通設定
----------------

### ノードの設定

各ノードには、アクセスするアプリケーションやコレクションなどの情報を、Node-REDのUIから設定することができます。

<dl>
  <dt>名前 (<code>name</code>)</dt>
  <dd>ノードの名前。</dd>
  <dt>アプリケーションID (<code>applicationId</code>)</dt>
  <dd>アプリケーション（プレート）のID。</dd>
  <dt>コレクションID (<code>collectionId</code>)</dt>
  <dd>コレクションのID。</dd>
  <dt>Authorizationヘッダー (<code>authorization</code>)</dt>
  <dd>Platio APIの認証用トークンを設定します。上記の開発者ページのAPIトークンの欄でトークンを生成し、表示された「Authorizationヘッダー」の内容をコピーして貼り付けます。</dd>
</dl>

### 処理ごとの設定

上記で設定した項目は、`msg.plate`に値を設定することで、処理ごとに値を上書きすることができます。

```
msg.platio = {
  applicationId: 'pxxxxxxxxxxxxxxxxxxxxxxxxxx',
  collectionId: 'txxxxxxx',
  authorization: 'Bearer XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
};
```


エラー処理
------------

エラーが発生すると、Node-REDにエラーとして通知します。catchノードを使うことで、エラー発生時の処理を行うことができます。


各ノードについて
----------------

### platio in

platio inノードを使用すると、指定したレコードを取得したり、検索条件にマッチするレコードのリストを取得することができます。

共通の設定に加えて、以下の項目を設定することができます。

<dl>
  <dt>レコードID (<code>recordId</code>)</dt>
  <dd>取得するレコードのID。</dd>
  <dt>取得件数 (<code>limit</code>)</dt>
  <dd>最大レコード取得数。</dd>
  <dt>ソートキー (<code>sortKey</code>)</dt>
  <dd>ソートキー。<code>column</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>createdBy</code>, <code>updatedBy</code>のいずれか。</dd>
  <dt>ソート順 (<code>sortOrder</code>)</dt>
  <dd>ソート順。<code>ascending</code>または<code>descending</code>。</dd>
  <dt>ソートカラムID (<code>sortColumnId</code>)</dt>
  <dd>ソートするカラムのID。ソートキーが<code>column</code>の場合のみ指定できます。</dd>
  <dt>検索式 (<code>search</code>)</dt>
  <dd>レコードの検索条件。詳細は、<a href="http://doc.plat.io/api/ja/search.html">レコード検索書式</a>を参照してください。</dd>
  <dt>タイムゾーン (<code>timezone</code>)</dt>
  <dd>検索時に使用されるタイムゾーン。<code>Asia/Tokyo</code>など。</dd>
</dl>

ノードの設定または処理ごとに設定で、レコードIDを指定した場合、指定されたレコードを取得し、`msg.payload`に設定します。レコードの形式については、[Platio APIドキュメント](https://doc.plat.io/ja/)を参照してください。

レコードIDを指定しなかった場合、指定したコレクション内のレコードの配列を取得し、`msg.payload`に設定します。

取得件数を指定すると、指定された件数のレコードを取得します。APIの制限(100)以上の値を指定した場合、APIを繰り返し呼び出します。

### platio out

platio outノードを使用すると、レコードを作成したり、既存のレコードを更新・削除することができます。

共通の設定に加えて、以下の項目を設定することができます。

<dl>
  <dt>レコードID (<code>recordId</code>)</dt>
  <dd>更新・削除するレコードのID。</dd>
  <dt>削除 (<code>delete</code>)</dt>
  <dd>指定したレコードを削除する場合には<code>true</code>。それ以外の場合には<code>false</code>。</dd>
</dl>

ノードの設定または処理ごとに設定で、レコードIDを指定しなかった場合、`msg.payload`に指定された値でレコードを作成します。

レコードIDを指定した場合には、そのレコードを更新します。レコードを更新するときには、`msg.payload`に含まれないカラムの値は削除されます。

レコードIDを指定し、かつ削除が`true`の場合には、レコードを削除します。レコードを削除する場合には、`msg.payload`は使用されません。

レコード作成・更新時の`msg.payload`は、以下のような形式で指定します。詳細については、[Platio APIドキュメント](https://doc.plat.io/ja/)を参照してください。

```
msg.payload = {
  values: {
    cxxxxxxx: {
      type: 'Number',
      value: 20
    },
    cyyyyyyy: {
      type: 'String',
      value: 'Text'
    }
  }
};
```
