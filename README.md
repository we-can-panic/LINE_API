# LINE API utils

LINE botとGASを連携させる際のユーティリティを作ったので公開します。

## 概要
LINE botで検索したら引っかかるこういうやつ→https://qiita.com/hakshu/items/55c2584cf82718f47464 のGAS部分をつくりました。  
今は各々金額を保存・計算する機能メインで作ってます。  
各々GASを開いて`main.gs`と`sheetutils.gs`をコピペして値を書き換えて運用してください。

書き換える項目は  
- `main.gs`の
  - LINE APIのキー(4行目)
  - スプレッドシートのリンク(82行目)
- `sheetutils.gs`の
  - スプレッドシートのID(2行目)

あとスプレッドシートを用意してください。  
フォーマットは↓で、タブ名は「LINE用」です。  
![sample](https://github.com/we-can-panic/LINE_API/blob/main/example1.png)

### デフォルトの機能
- 登録
  - ユーザーの登録・名前変更
    - 受け取れるJSONだけじゃ名前が登録できないので作りました
    - 「登録」で登録モードに入り、次にその人が送ったメッセージを名前に登録します
- 確認
  - これまでの合計金額を表示します
- リンク
  - もとになるスプレッドシートのリンクを送ります
- ヘルプ
  - 使い方とか
- あとは金額（っぽいフォーマットのメッセージ）を入力すればスプレッドシートに保存します。(`1,999`、`999円`、`100` など)
- その他カスタマイズは`calc`内の`else if`を追加する形でやれば便利だと思います！


### 変数
- `getSheetData()`で連想配列が取れるのでなんやかんやしていい感じに文字列に成型して返します
- 連想配列の構造↓
    ```
    {
      var: {
        <変数1>: <値1>,
        <変数1>: <値1>
      },
      user: {
        <userid1>: {
          名前: <ユーザー名>,             <- 「登録」で登録
          金額: [<金額1>, <金額2>, ...]
        }
      }
    }
    ```

- 値の保存は`setSheetData(data)`でします
- 処理の流れ(`calc`内)はざっと下記。
  ```
  data = getSheetData()
  if (text==キーワード) { 処理 }
  else if (text==キーワード) { 処理 }
  setSheetData(data)
  return message
  ```

### メッセージの情報
- `calc(e)`内の変数`text`にメッセージ, `id`にユーザーのIDが入っています。
- 名前は入ってないので`登録`で登録してもらって`data["user"][id]`とかで取ってください。

### util
sheetutils.gsの解説
- `getSheetData()`
  - `getAvailableSheet()`のシートの情報を整形して返します。（sheetIdに自分のやつを入れてください）
  - 返す形式は連想配列で
  ```
    {
      var: {
        <変数1>: <値1>,
        <変数1>: <値1>
      },
      user: {
        <userid1>: {
          名前: <ユーザー名>,             <- 「登録」で登録
          金額: [<金額1>, <金額2>, ...]
        }
      }
    }
    ```

- `setSheetData(data)`
  - ↑の形式のデータをGASに保存（上書き）


- `getSumValue(data)`
  - ユーザーごとの金額を合計して文字列に埋め込んで返します


- `exchangeMoney(text)`
  - 入力を金額に変換しようとします。
  - int(int?なんかデフォルトの数字の型)か、変換できなければfalseを返します
  - 使用例はmain.gsを見てください
