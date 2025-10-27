// example2_script.js
// 驗證 Email 與手機欄位，拋出自訂訊息後再提示使用者

const form = document.getElementById('contact-form');
const email = document.getElementById('email');
const phone = document.getElementById('phone');

function showValidity(input) {
  if (input.validity.valueMissing) {
    input.setCustomValidity('這個欄位必填');
  } else if (input.validity.typeMismatch) {
    // 檢查 @ 符號等基本 Email 格式
    input.setCustomValidity('Email 格式不正確，請確認輸入內容');
  } else if (input.validity.patternMismatch) {
    // 新增：若沒有符合 pattern = @o365\.tku\.edu\.tw 這個正則，提供更具體提示
    if (input.id === 'email') {
        input.setCustomValidity('Email 必須為 @o365.tku.edu.tw 格式'); 
    } else {
        input.setCustomValidity(input.title || '格式不正確');
    }
  } else {
    input.setCustomValidity('');
  }
  return input.reportValidity();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailOk = showValidity(email);
  const phoneOk = showValidity(phone);
  if (emailOk && phoneOk) {
    alert('表單驗證成功，準備送出資料');
    form.reset();
  }
});

email.addEventListener('blur', () => {
  showValidity(email);
});

phone.addEventListener('blur', () => {
  showValidity(phone);
});