// guess_num_script.js
// 猜數字遊戲 (1-100)

function generateTargetNumber() {
  // 產生隨機整數 (1-100)
  return Math.floor(Math.random() * 100) + 1;
}

function playGame() {
  var target = generateTargetNumber();
  var guess = 0;
  var count = 0;
  var min = 1;
  var max = 100;
  var log = '--- 玩家紀錄 ---\n';

  // do-while 確保至少執行一次，並持續直到猜中為止
  do {
    count++; // 猜測次數加一

    // 提示使用者輸入
    var promptMsg = '請猜一個數字，範圍 [' + min + ' ~ ' + max + ']：';
    var input = prompt(promptMsg);

    // 檢查使用者是否取消或輸入空值
    if (input === null || input.trim() === '') {
      log += '玩家取消遊戲。\n';
      return log + '遊戲結束。';
    }

    guess = parseInt(input, 10);

    // 判斷：檢查輸入是否有效
    if (isNaN(guess) || guess < 1 || guess > 100) {
      alert('無效輸入！請輸入 1 到 100 之間的數字。');
      log += '第 ' + count + ' 次猜測：' + input + ' (無效輸入)\n';
      count--; // 無效輸入不計入次數
      continue; // 跳過本次迴圈的剩餘部分
    }

    log += '第 ' + count + ' 次猜測：' + guess + '\n';

    // 判斷猜測結果
    if (guess < target) {
      alert('再大一點！');
      min = (guess >= min) ? guess + 1 : min; // 更新最小範圍
    } else if (guess > target) {
      alert('再小一點！');
      max = (guess <= max) ? guess - 1 : max; // 更新最大範圍
    }
    
  } while (guess !== target);

  // 猜中結果
  var finalMsg = '恭喜猜對了！目標數字是 ' + target + '。你總共猜了 ' + count + ' 次。';
  alert(finalMsg);
  
  log += '\n---------\n';
  log += '目標數字：' + target + '\n';
  log += '總猜測次數：' + count;
  
  return log;
}


var gameResult = playGame();

// 輸出結果
document.getElementById('result').textContent = gameResult;