function doPost(e) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const replyToken= JSON.parse(e.postData.contents).events[0].replyToken;
  const channelKey = 'YOUR_API_KEY';


  const msg = calc(e);
  if (!msg) return;

  var messages = [{
    'type': 'text',
    'text': msg
  }];

  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelKey,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messages,
    }),
  });

  return ContentService.createTextOutput(
          JSON.stringify({'content': 'post ok'}))
          .setMimeType(ContentService.MimeType.JSON);
}

/**
 * data:
 *   var:
 *     変数: 値
 *   user:
 *     id:
 *       名前: <name>
 *       金額: [0, 0, ...]
 */


/* 機能
 * ・登録
 * ・確認
 * ・リンク
 * ・ヘルプ
 * ・金額計算
 *   ・数字のみ
 *   ・",", "円"
 */

function calc(e) {
  var data = getSheetData();
  const s = JSON.parse(e["postData"]["contents"])
  const text = s["events"][0]["message"]["text"];
  const userId = s["events"][0]["source"]["userId"];
  // 登録
  if (data["var"]["聞く人"] == userId) {
    data["user"][userId]["名前"] = text;
    data["var"]["聞く人"] = "none";
    setSheetData(data);
    return `${text}さん、よろしくね！`

  } else if (text=="登録") {
    if (!Object.keys(data["user"]).includes(userId))
      data["user"][userId] = {"名前": "", "金額": []}
    data["var"]["聞く人"] = userId;
    setSheetData(data);
    return "お名前を教えてね！"

  // 確認
  } else if (text=="確認") {
    res = "今は、、\n"
    res += getSumValue(data)
    res += "みたいな感じです！"
    return res;

  // リンク
  } else if (text=="リンク") {
    res = "はい！\n"
    res += "SPREADSHEET_URL";
    return res;

  // ヘルプ
} else if (text=="？") {
    res = `ウチは旅行の金額計算botです！
↓のキーワードで反応します。

・登録
名前を登録・変更します！
初めて使うときも「登録」って言ってね。

・確認
今の金額を計算します！

・リンク
スプレッドシートのリンクを送ります！

・金額は数字を言ってください！「~円」とか「,」がついてても反応します！`
    return res;

  } else {
    // 金額計算
    mon = exchangeMoney(text)
    if (mon) {
      if (mon>=10000000) return "大きすぎるので弾きました！"
      if (mon<=-10000000) return "小さすぎるので弾きました！"
      data["user"][userId]["金額"].push(mon)
      setSheetData(data);
      return "(｀･ω･´)ゞ"
    // default
    } else {
      return false;
    }
  }
}


function apitest(){
  /* msgsの順にメッセージを言ったってことにします */
  var msgs = [
    "登録", "沙織", "こんにちは", "999円", "確認"
  ]
  for (var msg of msgs) {
    e = {
      events: [{
          message: {text: msg},
          source: {userId: "bbbbb"}
        }]
    }
    console.log(`> ${msg}`)
    console.log(calc(e));
  }
}
