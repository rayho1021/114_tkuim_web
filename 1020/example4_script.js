// example4_script.js
// 判斷輸入數字是否為奇數或偶數

var input = prompt('請輸入一個整數：');
var n = parseInt(input, 10);
var msg = '';

if (isNaN(n)) {
  msg = '輸入不是有效的整數！';
} else if (n % 2 === 0) {
  msg = n + ' 是偶數';
} else {
  msg = n + ' 是奇數';
}

// 額外示範 switch（1、2、3 對應文字）
var choice = prompt('輸入 1/2/3 試試 switch：');
switch (choice) {
  case '1':
    msg += '\n你輸入了 1';
    break;
  case '2':
    msg += '\n你輸入了 2';
    break;
  case '3':
    msg += '\n你輸入了 3';
    break;
  default:
    msg += '\n非 1/2/3';
}

// 輸入分數並輸出等第判斷
var scoreInput = prompt('\n請輸入分數 (0-100) ：');
var score = parseFloat(scoreInput);
var grade = '';

// 檢查分數是否為有效數字且在 0-100 範圍內
if (isNaN(score) || score < 0 || score > 100) {
    grade = '分數輸入無效';
} else if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else if (score >= 70) {
    grade = 'C';
} else if (score >= 60) {
    grade = 'D';
} else {
    grade = 'F';
}

// 將等第結果附加到 msg 變數
msg += '\n\n--- 分數等第判斷 ---\n';
msg += '輸入分數: ' + scoreInput + '\n';
msg += '對應等第: ' + grade;


document.getElementById('result').textContent = msg;