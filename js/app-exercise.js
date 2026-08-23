/* IPA Exercise / Quiz Page Logic (exercise.html) */
let quizType = 'listen_symbol'; // 'listen_symbol' (Nghe -> Đoán IPA) OR 'visual_category' (Nhìn IPA -> Đoán loại)
let quizMode = '4choices'; // '4choices' (4 đáp án) OR 'all44' (Bàn phím 44 âm)
let questionsList = [];
let currentQuestionIndex = 0;
let currentScore = 0;
let streak = 0;
let answered = false;
let currentTargetItem = null;

const CATEGORY_LIST = [
    { name: "Nguyên âm ngắn", count: 7 },
    { name: "Nguyên âm dài", count: 5 },
    { name: "Nguyên âm đôi", count: 8 },
    { name: "Phụ âm vô thanh", count: 9 },
    { name: "Phụ âm hữu thanh", count: 15 }
];

// Multi-select Category Dropdown Popover Management
function toggleCategoryDropdown(event) {
    event.stopPropagation();
    const catMenu = document.getElementById('categoryDropdownMenu');
    if (catMenu) {
        catMenu.classList.toggle('hidden');
    }
}

document.addEventListener('click', function (event) {
    const catDropdown = document.getElementById('categoryFilterContainer');
    const catMenu = document.getElementById('categoryDropdownMenu');
    if (catDropdown && catMenu && !catDropdown.contains(event.target)) {
        catMenu.classList.add('hidden');
    }
});

function getSelectedCategories() {
    const checkboxes = document.querySelectorAll('.cat-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function onCategoryCheckboxChange() {
    const selected = getSelectedCategories();
    if (quizType === 'visual_category' && selected.length === 1) {
        alert('Ở chế độ Nhìn Âm -> Đoán Loại, bạn cần chọn ít nhất 2 phân loại âm để có thể trắc nghiệm lựa chọn!');
        event.target.checked = true;
    }
    updateCategoryButtonLabel();
}

function selectAllCategories(isSelectAll) {
    const checkboxes = document.querySelectorAll('.cat-checkbox');
    if (!isSelectAll && quizType === 'visual_category') {
        checkboxes.forEach((cb, idx) => cb.checked = idx < 2);
    } else {
        checkboxes.forEach(cb => cb.checked = isSelectAll);
    }
    updateCategoryButtonLabel();
}

function updateCategoryButtonLabel() {
    const selected = getSelectedCategories();
    const label = document.getElementById('selectedCategoriesLabel');
    if (!label) return;

    if (selected.length === 5 || selected.length === 0) {
        label.textContent = "Bộ Âm: Tất cả (44)";
    } else {
        const pool = getFilteredPool();
        label.textContent = `Bộ Âm: (${selected.length} loại - ${pool.length} âm)`;
    }
}

function applyCategorySelection() {
    const catMenu = document.getElementById('categoryDropdownMenu');
    if (catMenu) {
        catMenu.classList.add('hidden');
    }
    restartQuiz();
}

function getFilteredPool() {
    const selected = getSelectedCategories();
    if (selected.length === 0 || selected.length === 5) {
        return ipaData;
    }
    return ipaData.filter(item => selected.includes(item.type2));
}

// Switch Task Type
function setQuizType(type) {
    quizType = type;
    const btnTaskListen = document.getElementById('btnTaskListen');
    const btnTaskCategory = document.getElementById('btnTaskCategory');
    const interfaceContainer = document.getElementById('interfaceModeContainer');

    if (type === 'listen_symbol') {
        btnTaskListen.className = 'px-3 py-1.5 rounded-lg bg-indigo-600 text-white shadow-sm transition';
        btnTaskCategory.className = 'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition';
        if (interfaceContainer) interfaceContainer.classList.remove('hidden');
    } else {
        btnTaskCategory.className = 'px-3 py-1.5 rounded-lg bg-indigo-600 text-white shadow-sm transition';
        btnTaskListen.className = 'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition';
        if (interfaceContainer) interfaceContainer.classList.add('hidden');

        const selected = getSelectedCategories();
        if (selected.length === 1) {
            selectAllCategories(true);
        }
    }
    restartQuiz();
}

// Switch Quiz Mode
function setQuizMode(mode) {
    quizMode = mode;
    const btn4 = document.getElementById('btnMode4Choices');
    const btnAll = document.getElementById('btnModeAll44');

    if (mode === '4choices') {
        btn4.className = 'px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white shadow-sm transition';
        btnAll.className = 'px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition';
    } else {
        btnAll.className = 'px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white shadow-sm transition';
        btn4.className = 'px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition';
    }
    restartQuiz();
}

// Utility: Array Shuffle
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Start / Restart Quiz Session
function restartQuiz() {
    const summaryModal = document.getElementById('summaryModal');
    if (summaryModal) summaryModal.classList.add('hidden');

    const filteredData = getFilteredPool();
    if (filteredData.length === 0) {
        alert('Không có âm phiên âm nào phù hợp với bộ lọc hiện tại.');
        return;
    }

    questionsList = shuffle(filteredData);
    currentQuestionIndex = 0;
    currentScore = 0;
    streak = 0;

    updateStatsUI();
    loadQuestion(currentQuestionIndex);
}

// Load Question at index
function loadQuestion(index) {
    answered = false;
    document.getElementById('explanationBox').classList.add('hidden');
    document.getElementById('actionArea').classList.add('hidden');

    currentTargetItem = questionsList[index];

    // Update Progress UI
    document.getElementById('questionProgressText').textContent = `Câu ${index + 1} / ${questionsList.length}`;
    document.getElementById('progressBar').style.width = `${((index + 1) / questionsList.length) * 100}%`;

    const targetContainer = document.getElementById('targetCardContainer');
    const hintTitle = document.getElementById('hintTitleText');
    const noticeBadge = document.getElementById('modeNoticeBadge');
    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';

    if (quizType === 'listen_symbol') {
        // Dạng 1: Nghe âm -> Đoán IPA
        targetContainer.innerHTML = `
            <p class="text-xs text-indigo-700 dark:text-indigo-300 font-medium mb-3">Bấm nút bên dưới để nghe câu hỏi âm IPA</p>
            <button id="btnPlayAudio" onclick="playTargetAudio()" class="pulse-audio px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base sm:text-lg shadow-md transition transform active:scale-95 inline-flex items-center gap-3">
                <i class="fa-solid fa-volume-high text-xl"></i>
                <span>NGHE ÂM IPA</span>
            </button>
            <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-3">(Có thể bấm nút hoặc dùng phím Spacebar để nghe lại)</p>
        `;
        hintTitle.textContent = "Chọn 1 ký hiệu âm IPA đúng bên dưới:";
        noticeBadge.textContent = quizMode === '4choices' ? "🎯 Trắc nghiệm 4 đáp án" : "🧩 Bàn Phím IPA (Toàn Cảnh)";

        let currentPool = getFilteredPool();

        if (quizMode === '4choices') {
            optionsGrid.className = 'grid grid-cols-2 gap-3 sm:gap-4 mb-5';
            let distractors = currentPool.filter(item => item.id !== currentTargetItem.id);
            distractors = shuffle(distractors).slice(0, 3);
            const choices = shuffle([currentTargetItem, ...distractors]);

            choices.forEach((choice, idx) => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn relative bg-white dark:bg-slate-800 hover:bg-indigo-50/70 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono font-bold text-2xl sm:text-3xl py-4.5 rounded-2xl shadow-sm transition transform active:scale-95 flex flex-col items-center justify-center gap-1';
                btn.setAttribute('data-id', choice.id);
                btn.onclick = () => checkAnswerSymbol(choice, btn);
                btn.innerHTML = `
                    <span class="absolute top-2 left-2.5 text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600 flex items-center gap-1">
                        <i class="fa-solid fa-keyboard text-[9px] text-indigo-500 dark:text-indigo-400"></i> Phím ${idx + 1}
                    </span>
                    <span>${choice.ipa}</span>
                    <span class="text-[11px] font-sans font-normal text-slate-400 dark:text-slate-400">${choice.type2}</span>
                `;
                optionsGrid.appendChild(btn);
            });
        } else {
            optionsGrid.className = 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-5';
            currentPool.forEach((choice) => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn bg-white dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white border-2 border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xl sm:text-2xl py-3 rounded-xl shadow-sm transition transform active:scale-95 flex items-center justify-center';
                btn.setAttribute('data-id', choice.id);
                btn.setAttribute('title', `${choice.ipa} (${choice.type2})`);
                btn.onclick = () => checkAnswerSymbol(choice, btn);
                btn.innerHTML = `<span>${choice.ipa}</span>`;
                optionsGrid.appendChild(btn);
            });
        }

        // Auto play target audio
        setTimeout(() => playTargetAudio(), 300);

    } else {
        // Dạng 2: Nhìn IPA -> Đoán Phân Loại (Category)
        targetContainer.innerHTML = `
            <p class="text-xs text-indigo-700 dark:text-indigo-300 font-medium mb-2">Cho ký hiệu âm vị IPA bên dưới:</p>
            <div class="inline-block bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700 font-mono font-bold text-4xl sm:text-5xl px-7 py-3 rounded-2xl shadow-sm mb-3">
                ${currentTargetItem.ipa}
            </div>
            <div>
                <button onclick="playTargetAudio()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center gap-1.5 mx-auto shadow-sm active:scale-95">
                    <i class="fa-solid fa-volume-high"></i> Nghe thử âm thanh mẫu
                </button>
            </div>
        `;
        hintTitle.textContent = "Ký hiệu âm trên thuộc loại phân loại nào bên dưới?";
        noticeBadge.textContent = "👁️ Nhìn IPA ➔ Đoán loại âm";

        const activeCatNames = getSelectedCategories();
        let activeCategoryList = CATEGORY_LIST;
        if (activeCatNames.length > 0 && activeCatNames.length < 5) {
            activeCategoryList = CATEGORY_LIST.filter(cat => activeCatNames.includes(cat.name));
        }

        optionsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5';

        activeCategoryList.forEach((cat, idx) => {
            const btn = document.createElement('button');
            btn.className = `category-choice-btn bg-white dark:bg-slate-800 hover:bg-indigo-50/80 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-sm transition transform active:scale-95 flex items-center justify-between gap-2`;
            btn.setAttribute('data-cat', cat.name);
            btn.onclick = () => checkAnswerCategory(cat.name, btn);
            btn.innerHTML = `
                <div class="flex items-center gap-2.5 min-w-0">
                    <span class="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600 flex items-center gap-1 shrink-0 whitespace-nowrap">
                        <i class="fa-solid fa-keyboard text-[9px] text-indigo-500 dark:text-indigo-400"></i> Phím ${idx + 1}
                    </span>
                    <span class="truncate">${cat.name}</span>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-400 text-xs shrink-0"></i>
            `;
            optionsGrid.appendChild(btn);
        });
    }
}

// Play Target Audio using shared audio player
function playTargetAudio() {
    if (!currentTargetItem) return;
    playIpaAudio(currentTargetItem.audioUrl, currentTargetItem.remoteAudioUrl);
}

// Check Answer for Dạng 1 (Nghe -> Đoán Ký Hiệu IPA)
function checkAnswerSymbol(selectedChoice, btnEl) {
    if (answered) return;
    answered = true;

    const allButtons = document.querySelectorAll('.choice-btn');

    if (selectedChoice.id === currentTargetItem.id) {
        currentScore++;
        streak++;
        btnEl.className = quizMode === '4choices'
            ? 'choice-btn bg-emerald-500 border-2 border-emerald-600 text-white font-mono font-bold text-2xl sm:text-3xl py-4 rounded-2xl shadow-md flex flex-col items-center justify-center gap-1'
            : 'choice-btn bg-emerald-500 border-2 border-emerald-600 text-white font-mono font-bold text-xl sm:text-2xl py-3 rounded-xl shadow-md flex items-center justify-center';

        if (quizMode === '4choices') {
            btnEl.innerHTML = `
                <div class="flex items-center gap-2">
                    <span>${selectedChoice.ipa}</span>
                    <i class="fa-solid fa-circle-check text-xl text-emerald-100"></i>
                </div>
                <span class="text-[11px] font-sans font-normal text-emerald-100">${selectedChoice.type2}</span>
            `;
        } else {
            btnEl.innerHTML = `<span>${selectedChoice.ipa} ✓</span>`;
        }
    } else {
        streak = 0;
        btnEl.className = quizMode === '4choices'
            ? 'choice-btn bg-rose-500 border-2 border-rose-600 text-white font-mono font-bold text-2xl sm:text-3xl py-4 rounded-2xl shadow-md animate-shake flex flex-col items-center justify-center gap-1'
            : 'choice-btn bg-rose-500 border-2 border-rose-600 text-white font-mono font-bold text-xl sm:text-2xl py-3 rounded-xl shadow-md animate-shake flex items-center justify-center';

        if (quizMode === '4choices') {
            btnEl.innerHTML = `
                <div class="flex items-center gap-2">
                    <span>${selectedChoice.ipa}</span>
                    <i class="fa-solid fa-circle-xmark text-xl text-rose-100"></i>
                </div>
                <span class="text-[11px] font-sans font-normal text-rose-100">${selectedChoice.type2}</span>
            `;
        } else {
            btnEl.innerHTML = `<span>${selectedChoice.ipa} ✕</span>`;
        }

        allButtons.forEach(b => {
            if (parseInt(b.getAttribute('data-id')) === currentTargetItem.id) {
                b.className = quizMode === '4choices'
                    ? 'choice-btn bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-2xl sm:text-3xl py-4 rounded-2xl flex flex-col items-center justify-center gap-1'
                    : 'choice-btn bg-emerald-500 border-2 border-emerald-600 text-white font-mono font-bold text-xl sm:text-2xl py-3 rounded-xl flex items-center justify-center';
                if (quizMode === '4choices') {
                    b.innerHTML = `
                        <span>${currentTargetItem.ipa}</span>
                        <span class="text-[11px] font-sans font-normal text-emerald-700 dark:text-emerald-300">${currentTargetItem.type2}</span>
                    `;
                } else {
                    b.innerHTML = `<span>${currentTargetItem.ipa} ✓</span>`;
                }
            }
        });
    }

    allButtons.forEach(b => b.onclick = null);
    playTargetAudio();
    finishQuestionTurn();
}

// Check Answer for Dạng 2 (Nhìn IPA -> Đoán Phân Loại)
function checkAnswerCategory(selectedCatName, btnEl) {
    if (answered) return;
    answered = true;

    const allButtons = document.querySelectorAll('.category-choice-btn');

    if (selectedCatName === currentTargetItem.type2) {
        currentScore++;
        streak++;
        btnEl.className = 'category-choice-btn bg-emerald-500 border-2 border-emerald-600 text-white font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-between';
        btnEl.innerHTML = `
            <span>${selectedCatName}</span>
            <i class="fa-solid fa-circle-check text-lg text-emerald-100"></i>
        `;
    } else {
        streak = 0;
        btnEl.className = 'category-choice-btn bg-rose-500 border-2 border-rose-600 text-white font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-md animate-shake flex items-center justify-between';
        btnEl.innerHTML = `
            <span>${selectedCatName}</span>
            <i class="fa-solid fa-circle-xmark text-lg text-rose-100"></i>
        `;

        allButtons.forEach(b => {
            if (b.getAttribute('data-cat') === currentTargetItem.type2) {
                b.className = 'category-choice-btn bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl flex items-center justify-between';
                b.innerHTML = `
                    <span>${currentTargetItem.type2}</span>
                    <i class="fa-solid fa-check text-emerald-600 dark:text-emerald-400 font-bold"></i>
                `;
            }
        });
    }

    allButtons.forEach(b => b.onclick = null);
    playTargetAudio();
    finishQuestionTurn();
}

function finishQuestionTurn() {
    updateStatsUI();

    // Reveal Explanation Box
    document.getElementById('expIpaTitle').textContent = currentTargetItem.ipa;
    document.getElementById('expTypeBadge').textContent = `${currentTargetItem.type1} • ${currentTargetItem.type2}`;
    document.getElementById('expGuide').textContent = currentTargetItem.guide;
    document.getElementById('expExamples').textContent = currentTargetItem.examples;
    document.getElementById('explanationBox').classList.remove('hidden');

    // Show Next Question Button
    document.getElementById('actionArea').classList.remove('hidden');
}

// Next Question or Finish Quiz
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionsList.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        showSummaryModal();
    }
}

// Update Stats UI
function updateStatsUI() {
    document.getElementById('scoreText').textContent = `Điểm: ${currentScore}`;

    const streakBadge = document.getElementById('streakBadge');
    if (streak > 1) {
        streakBadge.classList.remove('hidden');
        document.getElementById('streakVal').textContent = streak;
    } else {
        streakBadge.classList.add('hidden');
    }
}

// Show Summary Modal
function showSummaryModal() {
    const finalPercent = Math.round((currentScore / questionsList.length) * 100);
    document.getElementById('finalScore').textContent = `${currentScore}/${questionsList.length}`;
    document.getElementById('finalAccuracy').textContent = `${finalPercent}%`;
    document.getElementById('summaryModalText').textContent = `Bạn vừa hoàn thành lượt luyện tập ${questionsList.length} câu hỏi âm IPA!`;
    document.getElementById('summaryModal').classList.remove('hidden');
}

// Keyboard Shortcuts Handler: Fast navigation & controls
document.addEventListener('keydown', (e) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    // 1. Enter, ArrowRight, or Spacebar -> Move to NEXT question if already answered
    if (['Enter', 'ArrowRight', 'Space'].includes(e.code)) {
        if (answered) {
            e.preventDefault();
            nextQuestion();
            return;
        }
    }

    // 2. Spacebar -> Re-play audio if not answered yet
    if (e.code === 'Space' && !answered) {
        e.preventDefault();
        playTargetAudio();
        return;
    }

    // 3. Number keys 1..5 -> Pick choices ONLY for 4-choices mode OR visual category mode (Exclude all44 keyboard mode)
    if (!answered) {
        const numKey = parseInt(e.key);
        if (numKey >= 1 && numKey <= 5) {
            if (quizType === 'listen_symbol' && quizMode === '4choices') {
                const choiceBtns = document.querySelectorAll('#optionsGrid .choice-btn');
                if (choiceBtns[numKey - 1]) {
                    e.preventDefault();
                    choiceBtns[numKey - 1].click();
                }
            } else if (quizType === 'visual_category') {
                const catBtns = document.querySelectorAll('#optionsGrid .category-choice-btn');
                if (catBtns[numKey - 1]) {
                    e.preventDefault();
                    catBtns[numKey - 1].click();
                }
            }
        }
    }
});

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    restartQuiz();
});
