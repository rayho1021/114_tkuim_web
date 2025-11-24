//  新增內容: 送出流程改為呼叫 fetch，顯示報名清單

// 定義 API 端點
const API_URL = 'http://localhost:3001/api/signup';
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsContainer = document.getElementById('results-container'); // 結果容器

// 需要即時驗證的欄位 (除了 Tags)
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
const tagsContainer = document.getElementById('interest-tags-container');
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

    // Constraint Validation API 內建驗證
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
        } else if (password.length > 0 && !(/[a-zA-Z]/.test(password) && /\d/.test(password))) {  // 檢查是否為英數混合
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
    if (tagsErrorElement) {
        if (selectedTags === 0) {
            tagsErrorElement.textContent = '請至少選擇 1 個興趣標籤。';
        } else {
            tagsErrorElement.textContent = '';
        }
    }


    // 更新 DOM，設定自訂錯誤訊息
    input.setCustomValidity(message); 
    error.textContent = message; 
    if (input.type === 'checkbox' && input.validity.valueMissing) {
        input.classList.add('is-invalid');
    } else {
        input.classList.remove('is-invalid'); 
    }
    
    // 返回是否通過驗證
    return !message; 
}


/* 收集表單數據並轉換為 API 所需的 JSON 格式 */
function collectFormData() {
    const formData = new FormData(form);
    const data = {};
    
    // 遍歷所有欄位
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    // 處理特殊欄位：interests (多選標籤)
    const selectedInterests = Array.from(tagsContainer.querySelectorAll('.tag.selected')).map(tag => tag.dataset.value);
    data.interests = selectedInterests;

    // 處理特殊欄位：terms (Checkbox，確保是布林值)
    data.terms = formData.has('terms');
    
    return data;
}


// 新增函數: 顯示報名清單
async function displaySignupList() {
    resultsContainer.innerHTML = '<h4>報名清單載入中...</h4>';

    try {
        const response = await fetch(API_URL, { method: 'GET' });
        const data = await response.json();

        // 使用 <pre> 標籤和 JSON.stringify 來格式化 JSON 輸出
        resultsContainer.innerHTML = `
            <h4 class="mb-3">報名清單 (共 ${data.total} 筆)</h4>
            <pre style="background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; overflow-x: auto;">
${JSON.stringify(data, null, 2)}
            </pre>
        `;

    } catch (error) {
        resultsContainer.innerHTML = '<p class="text-danger">無法載入報名清單。請確認伺服器已啟動。</p>';
        console.error('GET List Error:', error);
    }
}


// 新增函數: 成功後顯示簡潔訊息和清單按鈕
function showSuccessAndListButton(message) {
    alert(`${message}`); // 顯示成功訊息
    
    // 在表單下方建立「查看報名清單」按鈕
    resultsContainer.innerHTML = `
        <div class="alert alert-success d-flex justify-content-between align-items-center" role="alert">
            <span>${message}！資料已送出。</span>
            <button id="viewListBtn" class="btn btn-sm btn-outline-primary">
                查看報名清單
            </button>
        </div>
    `;

    document.getElementById('viewListBtn').addEventListener('click', displaySignupList); // 綁定按鈕事件
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
        }ㄑ
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
tagsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('tag')) {
        target.classList.toggle('selected');
        // 觸發驗證
        validateField({ input: { id: 'tags' }, error: document.getElementById('tags-error') });
    }
});



// 使用 fetch 搭配 async/await 提交
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let firstInvalid = null;
    let isFormValid = true;

    // 執行前端驗證
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
            firstInvalid = tagsContainer; // 如果輸入欄位都沒錯，第一個錯誤就是標籤區塊
        }
    }

    if (!isFormValid) {
        // 如果前端驗證失敗，聚焦第一個錯誤欄位並停止提交
        if (firstInvalid) {
            firstInvalid.focus(); 
        }
        return;
    }

    // 前端驗證通過，提交 API
    submitBtn.disabled = true;
    submitBtn.textContent = '註冊中...';
    
    const payload = collectFormData();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) 
        });

        // 嘗試解析 JSON (無論狀態碼如何)
        const result = await response.json();

        // 處理 API 回應，根據狀態碼顯示不同訊息
        if (response.ok) { 
            showSuccessAndListButton(result.message);
            form.reset();
            resetFormStyles(); // 重設表單狀態和樣式
            
        } else if (response.status === 400) {
            alert(`註冊失敗：${result.error}`);
            
        } else {
            alert(`伺服器錯誤 (狀態碼 ${response.status})：${result.error || '未知伺服器錯誤'}`);
        }

    } catch (error) {
        // 處理網路錯誤或解析錯誤
        alert('網路請求失敗。請檢查您的伺服器是否已啟動並運行在 http://localhost:3001。');
        console.error('Fetch 錯誤:', error);
    } finally {
        // 流程結束，解鎖按鈕
        submitBtn.disabled = false;
        submitBtn.textContent = '註冊';
    }
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