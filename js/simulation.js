document.addEventListener('DOMContentLoaded', function () {
    // 要素の取得
    const modal = document.getElementById('simulation-modal');
    const startBtn = document.getElementById('start-simulation-btn');
    const closeBtn = document.querySelector('.close-modal');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    const progressBar = document.getElementById('progress-bar');
    const questionTitle = document.getElementById('question-title');
    const optionsContainer = document.getElementById('options-container');
    const currentStepElem = document.getElementById('current-step');
    const totalStepsElem = document.getElementById('total-steps');

    // 状態管理用変数
    let currentQuestionIndex = 0;
    let totalWage = 0;
    let isZaitaku = false; // 在宅かどうか

    // 質問データ
    const questions = [
        // Q1
        {
            title: "Q1. 通所スタイルを選んでください",
            options: [
                { text: "在宅 (工賃600円)", value: 600, type: "zaitaku" },
                { text: "通所 (基本工賃800円〜)", value: 800, type: "tsusho" }
            ]
        },
        // Q2 (通所の場合のみ)
        {
            title: "Q2. 希望する作業内容は？",
            options: [
                { text: "軽作業 (+200円)", value: 200 },
                { text: "PC作業 (+200円)", value: 200 },
                { text: "重作業 (+500円)", value: 500 }
            ]
        },
        // Q3 (仮の質問: 5択)
        {
            title: "Q3. 作業の正確さに自信はありますか？",
            options: [
                { text: "A. とてもある (+50円)", value: 50 },
                { text: "B. ある (+40円)", value: 40 },
                { text: "C. 普通 (+30円)", value: 30 },
                { text: "D. あまりない (+20円)", value: 20 },
                { text: "E. ない (+10円)", value: 10 }
            ]
        },
        // Q4 (仮の質問: 5択)
        {
            title: "Q4. 週にどれくらい通所できそうですか？",
            options: [
                { text: "A. 週5日 (+50円)", value: 50 },
                { text: "B. 週4日 (+40円)", value: 40 },
                { text: "C. 週3日 (+30円)", value: 30 },
                { text: "D. 週2日 (+20円)", value: 20 },
                { text: "E. 週1日 (+10円)", value: 10 }
            ]
        },
        // Q5 (仮の質問: 5択)
        {
            title: "Q5. 将来の目標はありますか？",
            options: [
                { text: "A. 一般就労したい (+50円)", value: 50 },
                { text: "B. スキルアップしたい (+40円)", value: 40 },
                { text: "C. 体力をつけたい (+30円)", value: 30 },
                { text: "D. 生活リズムを整えたい (+20円)", value: 20 },
                { text: "E. 仲間を作りたい (+10円)", value: 10 }
            ]
        }
    ];

    // --- 関数定義 ---

    // シミュレーション開始
    function startSimulation() {
        modal.classList.add('active'); // モーダル表示
        currentQuestionIndex = 0;
        totalWage = 0;
        isZaitaku = false;
        showQuestion(currentQuestionIndex);
        resultContainer.style.display = 'none';
        questionContainer.style.display = 'block';
    }

    // 質問を表示
    function showQuestion(index) {
        // 進捗バーの更新
        const progressPercent = ((index + 1) / questions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentStepElem.textContent = index + 1;
        totalStepsElem.textContent = questions.length;

        // 質問データの取得
        const q = questions[index];
        questionTitle.textContent = q.title;
        optionsContainer.innerHTML = ''; // 選択肢をリセット

        // 選択肢ボタンの生成
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-primary w-100 mb-2 py-3 text-start simulation-option';
            btn.innerHTML = `<span class="badge bg-primary me-2">${opt.text.split('.')[0]}</span> ${opt.text}`;
            // 選択肢クリック時の処理
            btn.onclick = () => handleAnswer(opt);
            optionsContainer.appendChild(btn);
        });
    }

    // 回答処理
    function handleAnswer(option) {
        // Q1の特別処理 (在宅か通所か)
        if (currentQuestionIndex === 0) {
            if (option.type === 'zaitaku') {
                totalWage = option.value;
                isZaitaku = true;
                showResult(); // 在宅なら即終了
                return;
            } else {
                totalWage = option.value;
            }
        } else {
            // 通常の加算
            totalWage += option.value;
        }

        // 次の質問へ
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            // 次の質問を表示（フェードインアニメーション用）
            optionsContainer.classList.add('fade-out');
            setTimeout(() => {
                showQuestion(currentQuestionIndex);
                optionsContainer.classList.remove('fade-out');
                optionsContainer.classList.add('fade-in');
                setTimeout(() => optionsContainer.classList.remove('fade-in'), 300);
            }, 300);
        } else {
            // 全問終了
            showResult();
        }
    }

    // 結果表示
    function showResult() {
        questionContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        progressBar.style.width = '100%';
        
        // カウントアップアニメーション
        const resultWageElem = document.getElementById('result-wage');
        animateValue(resultWageElem, 0, totalWage, 1000);
    }

    // 数値のカウントアップアニメーション関数
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // モーダルを閉じる
    function closeModal() {
        modal.classList.remove('active');
    }

    // --- イベントリスナー ---
    if(startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startSimulation();
        });
    }

    if(closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // モーダル外側クリックで閉じる
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 「もう一度計算する」ボタン
    const retryBtn = document.getElementById('retry-btn');
    if(retryBtn) {
        retryBtn.onclick = startSimulation;
    }
    
    // 「閉じる」ボタン（結果画面）
    const closeResultBtn = document.getElementById('close-result-btn');
    if(closeResultBtn) {
        closeResultBtn.onclick = closeModal;
    }
});