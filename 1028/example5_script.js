// example5_script.js
// 攔截 submit，聚焦第一個錯誤並模擬送出流程

const form = document.getElementById('full-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

// 新增 : 取得隱私權條款的 Checkbox 
const agreeCheckbox = document.getElementById('agree');

function validateAllInputs(formElement) {
  let firstInvalid = null;
  const controls = Array.from(formElement.querySelectorAll('input, select, textarea'));
  controls.forEach((control) => {
    control.classList.remove('is-invalid');
    if (!control.checkValidity()) {
      control.classList.add('is-invalid');
      if (!firstInvalid) {
        firstInvalid = control;
      }
    }
  });
  return firstInvalid;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  const firstInvalid = validateAllInputs(form);
  if (firstInvalid) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    firstInvalid.focus();
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('資料已送出，感謝您的聯絡！');
  form.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  Array.from(form.elements).forEach((element) => {
    element.classList.remove('is-invalid');
  });
});

form.addEventListener('input', (event) => {
  const target = event.target;
  if (target.classList.contains('is-invalid') && target.checkValidity()) {
    target.classList.remove('is-invalid');
  }
});

// 新增 : 隱私條款確認彈出視窗
// 1. 當點擊 "同意隱私條款" 的 checkbox 時，彈出視窗
// 2. 視窗中顯示文字 : "這是隱私條款"，以及包含一個 "確定" 按鈕 (confirm)
// 3. 條件判斷 : 點擊視窗中的 "確定鍵" 後關閉視窗，才可以成功勾選 checkbox
agreeCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
        const hasRead = confirm("這是隱私條款");
        // 如果點擊「取消」或關閉 (hasRead 為 false)，則取消勾選，否則顯示: "您尚未閱讀條款內容"
        if (!hasRead) {
            event.target.checked = false;
            alert("您尚未閱讀條款內容");
        }
    }
});