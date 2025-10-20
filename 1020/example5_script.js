// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

// 讓使用者輸入乘法表的範圍
var startInput = prompt('請輸入乘法表的起始數字 (1-9，例如 2)：');
var endInput = prompt('請輸入乘法表的結束數字 (1-9，例如 5)：');

// 將輸入轉為整數
var startNum = parseInt(startInput, 10);
var endNum = parseInt(endInput, 10);

var output = '';
var isValid = true; // 用於標記輸入是否有效

// 檢查輸入是否在 1-9 之間且起始值不超過結束值
if (
    isNaN(startNum) || startNum < 1 || startNum > 9 ||
    isNaN(endNum) || endNum < 1 || endNum > 9 ||
    startNum > endNum
) {
    isValid = false;
}

if (!isValid) {
    // 輸入無效時顯示錯誤訊息
    output = '輸入無效！請確認輸入為 1 到 9 之間的整數，且起始值不超過結束值。';
} else {
    output += '--- ' + startNum + ' 到 ' + endNum + ' 的乘法表 ---\n';

    // 使用輸入的範圍進行 for 迴圈
    for (var i = startNum; i <= endNum; i++) {
      for (var j = 1; j <= 9; j++) {
        var result = i * j;
        var padding = result < 10 ? '  ' : ' ';
        output += i + 'x' + j + '=' + result + padding;
      }
      output += '\n';
    }
}

document.getElementById('result').textContent = output;