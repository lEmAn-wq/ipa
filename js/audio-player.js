/* Shared Audio & Text-to-Speech (TTS) Engine */
let currentAudio = null;
let availableVoices = [];

// 1. Play IPA Sample Audio (Local MP3 -> Remote Online MP3 fallback)
function playIpaAudio(localUrl, remoteUrl) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    if (localUrl) {
        currentAudio = new Audio(localUrl);
        currentAudio.play().catch(err => {
            if (err.name === 'NotAllowedError') {
                console.warn('Autoplay bị chặn bởi chính sách trình duyệt (chờ người dùng tương tác):', err);
                return;
            }
            console.warn('Không thể phát file MP3 local, thử nạp URL online:', err);
            tryRemote();
        });
    } else {
        tryRemote();
    }

    function tryRemote() {
        if (remoteUrl) {
            currentAudio = new Audio(remoteUrl);
            currentAudio.play().catch(err => {
                if (err.name === 'NotAllowedError') {
                    console.warn('Autoplay bị chặn bởi chính sách trình duyệt (chờ người dùng tương tác):', err);
                    return;
                }
                console.warn('Không thể phát URL online:', err);
                alert('Không thể phát file âm thanh mẫu IPA này. Vui lòng kiểm tra kết nối internet hoặc thư mục audio local.');
            });
        } else {
            alert('Không tìm thấy file âm thanh mẫu IPA.');
        }
    }
}

// 2. Speech Synthesis Settings Management (localStorage)
function populateVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    availableVoices = voices.filter(v => v.lang.startsWith('en'));
    
    const voiceSelect = document.getElementById('voiceSelect');
    if (!voiceSelect) return;
    
    const currentValue = voiceSelect.value;
    voiceSelect.innerHTML = '<option value="default">Mặc định hệ thống</option>';
    
    availableVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    const savedVoice = localStorage.getItem('ipa_speech_voice');
    if (savedVoice && availableVoices.some(v => v.name === savedVoice)) {
        voiceSelect.value = savedVoice;
    } else if (currentValue) {
        voiceSelect.value = currentValue;
    }
}

function updateSpeedFromSlider(val) {
    const num = parseFloat(val);
    const speedVal = document.getElementById('speedVal') || document.getElementById('speedValueLabel');
    if (speedVal) {
        speedVal.textContent = num.toFixed(2) + 'x';
    }
    saveSpeechSettings();
}

function adjustSpeed(delta) {
    const slider = document.getElementById('speedSlider');
    if (!slider) return;
    let current = parseFloat(slider.value) || 0.7;
    let nextVal = Math.min(1.5, Math.max(0.5, current + delta));
    slider.value = nextVal.toFixed(2);
    updateSpeedFromSlider(slider.value);
}

function saveSpeechSettings() {
    const voiceSelect = document.getElementById('voiceSelect');
    const speedSlider = document.getElementById('speedSlider');
    const speedVal = document.getElementById('speedVal') || document.getElementById('speedValueLabel');

    if (speedSlider && speedVal) {
        speedVal.textContent = `${parseFloat(speedSlider.value).toFixed(2)}x`;
    }
    if (voiceSelect) {
        localStorage.setItem('ipa_speech_voice', voiceSelect.value);
    }
    if (speedSlider) {
        localStorage.setItem('ipa_speech_speed', speedSlider.value);
    }
}

function initSpeechSettings() {
    const voiceSelect = document.getElementById('voiceSelect');
    const speedSlider = document.getElementById('speedSlider');
    const speedVal = document.getElementById('speedVal') || document.getElementById('speedValueLabel');

    const savedSpeed = localStorage.getItem('ipa_speech_speed');
    if (savedSpeed && speedSlider && speedVal) {
        speedSlider.value = savedSpeed;
        speedVal.textContent = `${parseFloat(savedSpeed).toFixed(2)}x`;
    }

    if ('speechSynthesis' in window) {
        populateVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = populateVoices;
        }
    }
}

// 3. Speak Example Words using Web Speech API (Text-to-Speech Engine)
function speakExample(words) {
    if (!('speechSynthesis' in window)) {
        alert('Trình duyệt của bạn không hỗ trợ giọng đọc tự động Text-to-Speech.');
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    window.speechSynthesis.cancel();

    const formattedWords = words.split(' ').join(', ');
    const utterance = new SpeechSynthesisUtterance(formattedWords);
    
    const voiceSelect = document.getElementById('voiceSelect');
    const speedSlider = document.getElementById('speedSlider');

    if (voiceSelect && voiceSelect.value !== 'default') {
        const selectedVoice = availableVoices.find(v => v.name === voiceSelect.value);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
    }
    utterance.lang = 'en-US';

    if (speedSlider) {
        utterance.rate = parseFloat(speedSlider.value);
    } else {
        const savedSpeed = localStorage.getItem('ipa_speech_speed');
        if (savedSpeed) utterance.rate = parseFloat(savedSpeed);
    }

    window.speechSynthesis.speak(utterance);
}
