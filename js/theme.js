/* Shared Theme Management System (Light / Dark / System Auto) */
function initTheme() {
    const savedTheme = localStorage.getItem('ipa_theme') || 'system';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    localStorage.setItem('ipa_theme', theme);
    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (theme === 'system' && isDarkSystem);

    if (shouldBeDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const icon = document.getElementById('themeBtnIcon');
    const label = document.getElementById('themeBtnLabel');
    if (icon && label) {
        if (theme === 'light') {
            icon.className = 'fa-solid fa-sun text-amber-300';
            label.textContent = 'Sáng';
        } else if (theme === 'dark') {
            icon.className = 'fa-solid fa-moon text-indigo-300';
            label.textContent = 'Tối';
        } else {
            icon.className = 'fa-solid fa-desktop text-emerald-300';
            label.textContent = 'Tự động';
        }
    }
}

function setTheme(theme) {
    applyTheme(theme);
    const themeMenu = document.getElementById('themeDropdownMenu');
    if (themeMenu) {
        themeMenu.classList.add('hidden');
    }
}

function toggleThemeDropdown(event) {
    event.stopPropagation();
    const themeMenu = document.getElementById('themeDropdownMenu');
    if (themeMenu) {
        themeMenu.classList.toggle('hidden');
    }
}

// Close Theme Dropdown when clicking outside
document.addEventListener('click', function (event) {
    const themeBtn = document.getElementById('themeDropdownBtn');
    const themeMenu = document.getElementById('themeDropdownMenu');
    if (themeBtn && themeMenu && !themeBtn.parentElement.contains(event.target)) {
        themeMenu.classList.add('hidden');
    }
});

// System Theme Change Event Listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('ipa_theme') === 'system') {
        applyTheme('system');
    }
});

// Auto initialize theme when script loads
initTheme();
