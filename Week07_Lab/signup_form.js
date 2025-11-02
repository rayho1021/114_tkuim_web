const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

// 需要即時驗證的欄位 (除了 Checkbox 和 Tags)
const inputFields = [
    { input: document.getElementById('name'), error: document.getElementById('name-error') },
    { input: document.getElementById('email'), error: document.getElementById('email-error') },
    { input: document.getElementById('phone'), error: document.getElementById('phone-error') },
    { input: document.getElementById('password'), error: document.getElementById('password-error') },
    { input: document.getElementById('confirmPassword'), error: document.getElementById('confirmPassword-error') },
    { input: document.getElementById('terms'), error: document.getElementById('terms-error') } // 服務條款
];

const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const strengthBar = document.getElementById('password-strength');

/* 檢查密碼強度 1:弱, 2:中(>= 8 且英數混合), 3:強(>= 12) */
function checkPasswordStrength(password) {
    if (password.length === 0) {
        return 0;
    }
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasDigits = /\d/.test(password);

    if (password.length >= 8 && hasLetters && hasDigits) {
        if (password.length >= 12) {
            return 3;
        }
        return 2;
    } 
    if (password.length >= 8) {
        return 1;
    }

    return 0; // 其他情況（長度 < 8）
}

/* 更新密碼強度條的視覺效果 */
function updateStrengthBar() {
    const password = passwordInput.value;
    const strength = checkPasswordStrength(password);
    strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong'); 

    if (strength > 0) {
        if (strength === 1) {
            strengthBar.classList.add('strength-weak');
        } else if (strength === 2) {
            strengthBar.classList.add('strength-medium');
        } else if (strength === 3) {
            strengthBar.classList.add('strength-strong');
        }

        strengthBar.style.width = ''; 
    } else {
        strengthBar.style.width = '0%';
    }
}

/* 執行單一欄位的驗證並顯示客製化錯誤訊息 */
function validateField(field) {
    const { input, error } = field;
    let message = '';

    // 1. Constraint Validation API 內建驗證
    if (input.validity.valueMissing) {
        message = '此欄位為必填。';
    } else if (input.id === 'email' && input.validity.typeMismatch) {
        message = '請輸入有效的電子郵件格式。';
    } else if (input.id === 'phone' && input.validity.patternMismatch) { // 手機號碼：限制 10 碼數字
        message = '請輸入 10 碼數字的手機號碼。';
    } else if (input.id === 'password') { // 密碼：至少 8 碼，英數混合
        const password = input.value;
        if (input.validity.tooShort) {
            message = '密碼長度至少需要 8 碼。';
        } else if (!(/[a-zA-Z]/.test(password) && /\d/.test(password))) {  // 檢查是否為英數混合
            message = '密碼必須包含英文字母和數字。';
        }
    }

    // 自訂額外驗證邏輯 (不受 Constraint Validation API 直接控制)，確認密碼：需與密碼一致
    if (input.id === 'confirmPassword' && passwordInput.value !== confirmPasswordInput.value) {
        message = '確認密碼與密碼不一致。'; 
    }
    
    // 興趣標籤驗證
    const selectedTags = document.querySelectorAll('#interest-tags-container .tag.selected').length;
    const tagsErrorElement = document.getElementById('tags-error');
    if (selectedTags === 0) {
        tagsErrorElement.textContent = '請至少選擇 1 個興趣標籤。';
    } else {
        tagsErrorElement.textContent = '';
    }

    // 更新 DOM，設定自訂錯誤訊息
    input.setCustomValidity(message); 
    error.textContent = message; 
    if (input.type === 'checkbox' && input.validity.valueMissing) {
        input.classList.add('is-invalid');
    } else {
        input.classList.remove('is-invalid'); 
    }
    
    return !message; // 根據是否有錯誤訊息來判斷是否通過
}

/* 事件處理 */
// 即時驗證 (欄位 blur 後啟用錯誤提示, input 時即時更新錯誤提示)
inputFields.forEach((field) => {
    field.input.addEventListener('blur', () => {
        validateField(field);
    });
    field.input.addEventListener('input', () => {
        if (field.error.textContent) {
            validateField(field);
        }
        // 輸入密碼時，即時更新並重新驗證
        if (field.input.id === 'password') {
            updateStrengthBar();
            validateField(inputFields.find(f => f.input.id === 'confirmPassword'));
        }
        if (field.input.id === 'confirmPassword') {
            validateField(inputFields.find(f => f.input.id === 'confirmPassword'));
        }
    });
});

// 事件委派：興趣標籤，狀態改變後，重新驗證標籤區塊
const tagsContainer = document.getElementById('interest-tags-container');
tagsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('tag')) {
        target.classList.toggle('selected');
        validateField({ input: { id: 'tags' }, error: document.getElementById('tags-error') });
    }
});


// 送出攔截與防重送，執行所有欄位驗證
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let firstInvalid = null;
    let isFormValid = true;

    // 驗證輸入欄位和 Checkbox
    inputFields.forEach((field) => {
        const isValid = validateField(field);
        if (!isValid) {
            isFormValid = false;
            // 找到第一個錯誤的欄位
            if (!firstInvalid) {
                firstInvalid = field.input;
            }
        }
    });

    // 驗證興趣標籤 (單獨處理，因為它不是標準 input)
    const selectedTags = document.querySelectorAll('#interest-tags-container .tag.selected').length;
    if (selectedTags === 0) {
        isFormValid = false;
        if (!firstInvalid) {
            firstInvalid = tagsContainer; // 如果輸入欄位都沒錯，第一個錯誤就是標籤區塊，聚焦第一個錯誤
        }
    }

    if (firstInvalid) {
        firstInvalid.focus(); 
        return;
    }

    // 成功送出流程：防重送 (Disabled/Loading) + 模擬延遲，顯示成功訊息並重置表單
    submitBtn.disabled = true;
    submitBtn.textContent = '註冊中...';
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert('會員註冊成功！歡迎加入。');
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = '註冊';
    resetFormStyles();
});

// 重設按鈕功能、所有錯誤訊息、樣式和密碼強度條、興趣標籤(.tag.selected)
resetBtn.addEventListener('click', () => {
    form.reset();
    resetFormStyles();
});

function resetFormStyles() {
    inputFields.forEach((field) => {
        field.error.textContent = '';
        field.input.classList.remove('is-invalid');
    });

    strengthBar.className = 'mt-1 small';

    const selectedTags = document.querySelectorAll('#interest-tags-container .tag.selected');
    selectedTags.forEach(tag => {
        tag.classList.remove('selected');
    });
    
    document.getElementById('tags-error').textContent = '';
}