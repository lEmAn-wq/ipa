/* IPA Lookup Page Logic (ipa.html) */
let currentFilter = 'all';
let currentView = 'table';
let searchQuery = '';

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400 dark:text-slate-500 font-medium">Không tìm thấy âm phiên âm phù hợp</td></tr>`;
        return;
    }

    data.forEach((item) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition';

        let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
        if (item.type2.includes('ngắn')) badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
        else if (item.type2.includes('dài')) badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
        else if (item.type2.includes('đôi')) badgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
        else if (item.type2.includes('vô thanh')) badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
        else if (item.type2.includes('hữu thanh')) badgeClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800';

        tr.innerHTML = `
            <td class="p-4 align-top font-bold text-slate-400 dark:text-slate-500 text-xs">${item.id}</td>
            <td class="p-4 align-top font-mono font-bold text-2xl text-indigo-700 dark:text-indigo-400 whitespace-nowrap">${item.ipa}</td>
            <td class="p-4 align-top">
                <div class="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">${item.type1}</div>
                <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">${item.type2}</span>
            </td>
            <td class="p-4 align-top text-slate-700 dark:text-slate-300 leading-relaxed">${item.guide}</td>
            <td class="p-4 align-top font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                <div>${item.examples}</div>
                <button onclick="speakExample('${item.audioQuery}')" title="Nghe đọc ví dụ giọng tự động" class="mt-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 text-indigo-600 dark:text-indigo-300 text-xs font-semibold transition flex items-center gap-1 border border-slate-200 dark:border-slate-600">
                    <i class="fa-solid fa-volume-low"></i> Nghe từ ví dụ
                </button>
            </td>
            <td class="p-4 align-top text-center">
                <div class="flex flex-col items-center justify-center">
                    <button onclick="playIpaAudio('${item.audioUrl}', '${item.remoteAudioUrl}')" title="Nghe âm IPA mẫu (File MP3)" class="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-sm shadow-md transition transform active:scale-95">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderGrid(data) {
    const grid = document.getElementById('gridView');
    if (!grid) return;
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 dark:text-slate-500 font-medium">Không tìm thấy âm phiên âm phù hợp</div>`;
        return;
    }

    data.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between';

        let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
        if (item.type2.includes('ngắn')) badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
        else if (item.type2.includes('dài')) badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
        else if (item.type2.includes('đôi')) badgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
        else if (item.type2.includes('vô thanh')) badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
        else if (item.type2.includes('hữu thanh')) badgeClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800';

        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-3xl font-bold font-mono text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-900 px-3 py-1 rounded-xl border border-indigo-100 dark:border-slate-700">${item.ipa}</span>
                    <span class="px-2.5 py-1 rounded-lg text-xs font-semibold ${badgeClass}">${item.type2}</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">${item.guide}</p>
                <div class="text-xs font-medium text-slate-800 dark:text-slate-200 mb-4 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <i class="fa-solid fa-bookmark text-indigo-500 mr-1"></i> ${item.examples}
                    </div>
                    <button onclick="speakExample('${item.audioQuery}')" title="Nghe đọc ví dụ giọng tự động" class="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 text-indigo-600 dark:text-indigo-300 text-[11px] font-semibold transition border border-slate-200 dark:border-slate-700">
                        <i class="fa-solid fa-volume-low"></i> 
                    </button>
                </div>
            </div>
            <div class="pt-3 border-t border-slate-100 dark:border-slate-700">
                <button onclick="playIpaAudio('${item.audioUrl}', '${item.remoteAudioUrl}')" class="w-full justify-center px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition transform active:scale-95">
                    <i class="fa-solid fa-volume-high"></i> Nghe âm IPA
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterData() {
    let filtered = ipaData;

    if (currentFilter !== 'all') {
        filtered = filtered.filter(item => item.type2 === currentFilter);
    }

    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(item => 
            item.ipa.toLowerCase().includes(query) ||
            item.guide.toLowerCase().includes(query) ||
            item.examples.toLowerCase().includes(query) ||
            item.type2.toLowerCase().includes(query)
        );
    }

    if (currentView === 'table') {
        renderTable(filtered);
    } else {
        renderGrid(filtered);
    }
}

function setFilter(type) {
    currentFilter = type;
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === type) {
            btn.className = 'filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-indigo-600 text-white shadow-md active:scale-95';
        } else {
            btn.className = 'filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95';
        }
    });
    filterData();
}

function setView(view) {
    currentView = view;
    const btnTable = document.getElementById('btnTableView');
    const btnGrid = document.getElementById('btnGridView');
    const tableView = document.getElementById('tableView');
    const gridView = document.getElementById('gridView');

    if (!btnTable || !btnGrid || !tableView || !gridView) return;

    if (view === 'table') {
        btnTable.className = 'px-3.5 py-2 rounded-lg text-sm font-semibold transition bg-white text-indigo-700 shadow';
        btnGrid.className = 'px-3.5 py-2 rounded-lg text-sm font-semibold transition text-indigo-200 dark:text-slate-400 hover:text-white';
        tableView.classList.remove('hidden');
        gridView.classList.add('hidden');
    } else {
        btnGrid.className = 'px-3.5 py-2 rounded-lg text-sm font-semibold transition bg-white text-indigo-700 shadow';
        btnTable.className = 'px-3.5 py-2 rounded-lg text-sm font-semibold transition text-indigo-200 dark:text-slate-400 hover:text-white';
        gridView.classList.remove('hidden');
        tableView.classList.add('hidden');
    }
    filterData();
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            filterData();
        });
    }

    initSpeechSettings();
    filterData();
});
