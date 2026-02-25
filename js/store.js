/* ═══════════════════════════════════════════════════
   SQUAX — State Store with localStorage Persistence
   No hardcoded fake data — all stats derived from
   real user actions stored locally.
═══════════════════════════════════════════════════ */

const STORAGE_KEY = 'squax_state_v1';

// ─── Persistence Helpers ──────────────────────────
function loadPersistedState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        return JSON.parse(raw);
    } catch { return {}; }
}

function persistState(state) {
    try {
        const toSave = {
            reports: state.reports,
            activityLog: state.activityLog,
            juneCfg: state.juneCfg,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch { /* quota exceeded or private mode */ }
}

// ─── Store ────────────────────────────────────────
const Store = (() => {
    const persisted = loadPersistedState();

    let state = {
        activeBounty: null,
        apiKey: '',
        apiBase: '',
        selectedModel: 'gpt-4o',
        connected: false,
        chatHistory: [],
        evidence: [],

        // Persisted across page reloads
        reports: persisted.reports || [],
        activityLog: persisted.activityLog || [],

        reportDraft: null,

        juneCfg: persisted.juneCfg || {
            apiKey: '',
            apiBase: 'http://localhost:11434/v1',
            model: 'llama3',
            online: false,
        },

        juneResults: [],
        juneCampaignRunning: false,
    };

    const listeners = [];

    function getState() { return state; }

    function setState(partial) {
        state = { ...state, ...partial };
        persistState(state);
        listeners.forEach(fn => fn(state));
    }

    function subscribe(fn) {
        listeners.push(fn);
        return () => {
            const i = listeners.indexOf(fn);
            if (i > -1) listeners.splice(i, 1);
        };
    }

    return { getState, setState, subscribe };
})();

// ─── Computed Stats (derived from real data) ──────
function computeStats() {
    const { reports, activityLog } = Store.getState();

    const totalReports = reports.length;

    // "Bugs confirmed" = reports with severity of critical or high
    const bugsConfirmed = reports.filter(r =>
        r.severity && ['critical', 'high'].includes(r.severity.toLowerCase())
    ).length;

    // Active bounties = always from BOUNTIES array (real, never fake)
    const bountiesActive = (window.BOUNTIES || []).length;

    // Real-time category breakdown from actual reports
    const categoryMap = {};
    reports.forEach(r => {
        if (r.category) {
            categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
        }
    });

    return { totalReports, bugsConfirmed, bountiesActive, categoryMap };
}

// ─── Activity Log ─────────────────────────────────
function logActivity(icon, text, color = 'var(--accent-light)') {
    const { activityLog } = Store.getState();
    const entry = {
        id: generateId(),
        icon,
        text,
        color,
        timestamp: new Date().toISOString(),
    };
    // Keep last 50 entries max
    const updated = [entry, ...activityLog].slice(0, 50);
    Store.setState({ activityLog: updated });
    return entry;
}

// ─── Helpers ──────────────────────────────────────
function generateId() {
    return Math.random().toString(36).slice(2, 10);
}

function formatTime(date = new Date()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function timeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function addChatMessage(role, content) {
    const msg = { id: generateId(), role, content, timestamp: new Date() };
    const { chatHistory } = Store.getState();
    Store.setState({ chatHistory: [...chatHistory, msg] });
    return msg;
}

function addEvidence(prompt, response) {
    const { activeBounty } = Store.getState();
    const item = { id: generateId(), prompt, response, timestamp: new Date() };
    const { evidence } = Store.getState();
    Store.setState({ evidence: [...evidence, item] });

    // Real activity log entry
    logActivity(
        '📌',
        `Evidence flagged${activeBounty ? ` — ${activeBounty.company}` : ''}`,
        'var(--warning)'
    );
    return item;
}

function removeEvidence(id) {
    const { evidence } = Store.getState();
    Store.setState({ evidence: evidence.filter(e => e.id !== id) });
}

function saveReport(report) {
    const { reports, activeBounty } = Store.getState();
    const r = { ...report, id: generateId(), savedAt: new Date().toISOString() };
    Store.setState({ reports: [...reports, r] });

    // Real activity log entry
    const sevLabel = report.severity ? ` [${report.severity.toUpperCase()}]` : '';
    logActivity(
        '📋',
        `Report submitted${sevLabel}${activeBounty ? ` — ${activeBounty.company}` : ''}`,
        'var(--accent-light)'
    );
    return r;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: '💡' };
    el.innerHTML = `<span>${icons[type] || '💡'}</span><span>${message}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

function clearAllData() {
    if (!confirm('This will permanently delete all saved reports, evidence, and activity log. Are you sure?')) return;
    localStorage.removeItem(STORAGE_KEY);
    Store.setState({ reports: [], activityLog: [], evidence: [] });
    showToast('All data cleared.', 'info');
}

window.Store = Store;
window.computeStats = computeStats;
window.logActivity = logActivity;
window.addChatMessage = addChatMessage;
window.addEvidence = addEvidence;
window.removeEvidence = removeEvidence;
window.saveReport = saveReport;
window.showToast = showToast;
window.generateId = generateId;
window.formatTime = formatTime;
window.timeAgo = timeAgo;
window.clearAllData = clearAllData;
