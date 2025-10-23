// C2F_script.js
// 溫度轉換器：攝氏 (C) ↔ 華氏 (F)

function toFahrenheit(celsius) {
  // F = C * 9 / 5 + 32
  return celsius * 9 / 5 + 32;
}

function toCelsius(fahrenheit) {
  // C = (F - 32) * 5 / 9
  return (fahrenheit - 32) * 5 / 9;
}

/*原始溫度數值,原始溫度單位,轉換後的溫度數值,轉換後的溫度單位*/
function formatResult(originalTemp, originalUnit, convertedTemp, convertedUnit) {
    return '--- 溫度轉換結果 ---\n'
         + '原始輸入：' + originalTemp + ' ' + originalUnit + '\n'
         + '轉換結果：' + convertedTemp.toFixed(2) + ' ' + convertedUnit;
}

var tempInput = prompt('請輸入溫度數值：');
var unitInput = prompt('請輸入原始單位 (C 為攝氏，F 為華氏)：').toUpperCase(); 

var originalTemp = parseFloat(tempInput);
var outputMessage = '';

// 確保輸入有效
if (isNaN(originalTemp)) {
    outputMessage = '錯誤：請輸入有效的溫度數值。';
} else if (unitInput !== 'C' && unitInput !== 'F') {
    outputMessage = '錯誤：請輸入有效的單位 (C 或 F)。';
} else {
    // 根據單位進行轉換
    var convertedTemp;
    var convertedUnit;

    if (unitInput === 'C') {
        // 攝氏轉華氏
        convertedTemp = toFahrenheit(originalTemp);
        convertedUnit = 'F';
        outputMessage = formatResult(originalTemp, 'C', convertedTemp, convertedUnit);
    } else if (unitInput === 'F') {
        // 華氏轉攝氏
        convertedTemp = toCelsius(originalTemp);
        convertedUnit = 'C';
        outputMessage = formatResult(originalTemp, 'F', convertedTemp, convertedUnit);
    }
}

// 輸出結果到 alert 和頁面
alert(outputMessage);
document.getElementById('result').textContent = outputMessage;