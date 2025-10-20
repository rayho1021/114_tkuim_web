// example2_script.js
// 變數宣告與基本型態操作

var text = '123';              // 字串
var num = 45;                  // 數字
var isPass = true;             // 布林
var emptyValue = null;         // 空值
var notAssigned;               // undefined（尚未指定）

// 型態檢查
var lines = '';
lines += 'text = ' + text + '，typeof: ' + (typeof text) + '\n';
lines += 'num = ' + num + '，typeof: ' + (typeof num) + '\n';
lines += 'isPass = ' + isPass + '，typeof: ' + (typeof isPass) + '\n';
lines += 'emptyValue = ' + emptyValue + '，typeof: ' + (typeof emptyValue) + '\n';
lines += 'notAssigned = ' + notAssigned + '，typeof: ' + (typeof notAssigned) + '\n\n';

// 轉型
var textToNumber = parseInt(text, 10); // 將 '123' → 123
lines += 'parseInt(\'123\') = ' + textToNumber + '\n';
lines += 'String(45) = ' + String(num) + '\n\n';

// 使用 prompt() 讀入並運算兩個數字，會返回字串
// 使用 parseInt() 或 parseFloat() 轉型
var numStr1 = prompt('請輸入第一個數字：');
var numStr2 = prompt('請輸入第二個數字：');

// 將讀入的字串轉為數字
var number1 = parseInt(numStr1, 10);
var number2 = parseInt(numStr2, 10);

// 計算總和
var sum = number1 + number2;

// 輸出結果到 lines 變數
lines += '--- Prompt 讀入與運算結果 ---\n';
lines += '字串 1: ' + numStr1 + ' (typeof: ' + (typeof numStr1) + ')\n';
lines += '字串 2: ' + numStr2 + ' (typeof: ' + (typeof numStr2) + ')\n';
lines += '轉型數字 1: ' + number1 + ' (typeof: ' + (typeof number1) + ')\n';
lines += '轉型數字 2: ' + number2 + ' (typeof: ' + (typeof number2) + ')\n';
lines += '相加結果: ' + sum + '\n';
lines += '若輸入的非數字，結果可能會是 NaN。\n\n';


document.getElementById('result').textContent = lines;