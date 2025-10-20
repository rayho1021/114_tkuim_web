// example1_script.js
// 傳統語法：僅使用 var、function、字串串接

// 顯示提示窗 
alert('歡迎來到 JavaScript！');

// 在 Console 顯示訊息 
console.log('Hello JavaScript from console');

// 在頁面指定區域輸出文字
var el = document.getElementById('result');
el.textContent = '410631427 何睿純';

// 按鈕點擊時執行
function handleButtonClick() {
    alert('這是從外部 JS 檔案執行的 alert 訊息。');
}

// 獲取按鈕元素並綁定點擊事件
var buttonEl = document.getElementById('showAlertButton');
buttonEl.onclick = handleButtonClick;