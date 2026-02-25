/* ═══════════════════════════════════════════════════
   SQUAX — Dashboard Page
   All stats derived from real store state.
   No hardcoded / simulated numbers.
═══════════════════════════════════════════════════ */

Router.registerPage('dashboard', function (container) {

  function render() {
    const { reports, activityLog, activeBounty, evidence } = Store.getState();
    const stats = computeStats();

    // Category breakdown from real reports
    const catMap = stats.categoryMap;
    const totalCatCount = Object.values(catMap).reduce((a, b) => a + b, 0);

    // Severity counts
    const sevCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    reports.forEach(r => {
      if (r.severity) {
        const s = r.severity.toLowerCase();
        if (s in sevCounts) sevCounts[s]++;
      }
    });

    const hasAnyData = reports.length > 0 || evidence.length > 0;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>Dashboard</h1>
            <p>Your real-time activity — all data is saved locally in your browser.</p>
          </div>
          <button class="btn btn-primary btn-lg" onclick="Router.navigateTo('#bounties')">
            Browse Bounties →
          </button>
        </div>
      </div>

      <!-- Hero Banner -->
      <div class="card card-glow" style="margin-bottom:24px; background:linear-gradient(135deg,rgba(124,58,237,0.12),rgba(59,130,246,0.08)); border-color:rgba(124,58,237,0.4);">
        <div class="flex items-center gap-4" style="flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;">
            <div style="font-size:11px;font-weight:700;color:var(--accent-light);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Live Platform</div>
            <h2 style="font-size:22px;font-weight:800;line-height:1.3;margin-bottom:10px;">
              Hunt AI Vulnerabilities.<br>
              <span class="text-gradient">Get Paid for Your Findings.</span>
            </h2>
            <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;max-width:460px;">
              Select a real bug bounty program, probe the AI in a sandboxed environment with built-in attack presets, flag suspicious responses as evidence, and generate a professional CVE-style report to submit.
            </p>
            <div class="flex gap-2 mt-3" style="flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="Router.navigateTo('#sandbox')">Open Sandbox</button>
              <button class="btn btn-secondary" onclick="Router.navigateTo('#june')">June AI Panel</button>
              ${hasAnyData ? `<button class="btn btn-danger btn-sm" onclick="clearAllData()" style="margin-left:auto;">🗑 Clear My Data</button>` : ''}
            </div>
          </div>
          <div style="font-size:80px;opacity:0.15;user-select:none;flex-shrink:0;">🛡️</div>
        </div>
      </div>

      <!-- Real-Time Stats Row -->
      <div class="grid-4" style="margin-bottom:28px;">

        <div class="card stat-card">
          <div class="stat-icon violet">🎯</div>
          <div class="stat-value">${stats.bountiesActive}</div>
          <div class="stat-label">Real Bounty Programs</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">From arcanum-sec.github.io</div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon blue">📋</div>
          <div class="stat-value">${reports.length}</div>
          <div class="stat-label">Reports Saved</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">
            ${reports.length === 0 ? 'None yet — start hunting' : `Last: ${timeAgo(reports[reports.length - 1].savedAt)}`}
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon amber">🐛</div>
          <div class="stat-value">${stats.bugsConfirmed}</div>
          <div class="stat-label">Critical / High Findings</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">
            ${stats.bugsConfirmed === 0 ? 'Keep probing!' : 'From your saved reports'}
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon green">📌</div>
          <div class="stat-value">${evidence.length}</div>
          <div class="stat-label">Evidence Items</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">
            ${evidence.length === 0 ? 'Flag AI responses in sandbox' : 'In current session'}
          </div>
        </div>

      </div>

      <!-- Active Bounty + Activity Feed -->
      <div class="grid-2" style="margin-bottom:28px;">

        <!-- Active Bounty -->
        <div class="card">
          <div class="section-title">Current Bounty</div>
          ${activeBounty ? renderActiveBounty(activeBounty) : `
            <div class="empty-state" style="padding:28px;">
              <div class="empty-icon">🎯</div>
              <div>No bounty selected</div>
              <button class="btn btn-primary btn-sm" onclick="Router.navigateTo('#bounties')" style="margin-top:10px;">Browse Programs</button>
            </div>
          `}
        </div>

        <!-- Real Activity Feed -->
        <div class="card">
          <div class="section-title">Activity Log</div>
          ${activityLog.length === 0 ? `
            <div class="empty-state" style="padding:28px;">
              <div class="empty-icon">📡</div>
              <div>No activity yet</div>
              <div style="font-size:12px;margin-top:4px;">Events appear here as you use the platform</div>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;max-height:280px;overflow-y:auto;">
              ${activityLog.slice(0, 10).map(entry => `
                <div class="flex items-center gap-3" style="padding:9px 12px;background:var(--bg-card);border-radius:var(--radius-sm);border:1px solid var(--border);">
                  <span style="font-size:16px;">${entry.icon}</span>
                  <div style="flex:1;font-size:12.5px;color:var(--text-primary);">${escHtml(entry.text)}</div>
                  <div style="font-size:10px;color:var(--text-muted);white-space:nowrap;">${timeAgo(entry.timestamp)}</div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Vuln Breakdown + Saved Reports -->
      <div class="grid-2">

        <!-- Real Vulnerability Breakdown -->
        <div class="card">
          <div class="section-title">Your Findings by Category</div>
          ${totalCatCount === 0 ? `
            <div class="empty-state" style="padding:28px;">
              <div class="empty-icon">🔬</div>
              <div>No reports filed yet</div>
              <div style="font-size:12px;margin-top:4px;">Category breakdown will appear here from your actual reports</div>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">
              ${Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, count]) => {
          const pct = Math.round((count / totalCatCount) * 100);
          return renderVulnBar(cat, pct, count);
        }).join('')}
            </div>
          `}

          <!-- Severity Breakdown -->
          ${reports.length > 0 ? `
            <hr style="border:none;border-top:1px solid var(--border);margin:18px 0;" />
            <div class="section-title">By Severity</div>
            <div class="grid-4" style="gap:10px;margin-top:8px;">
              ${Object.entries(sevCounts).map(([sev, n]) => {
          const colors = { critical: '#f87171', high: '#fbbf24', medium: '#60a5fa', low: '#34d399' };
          return `
                  <div style="text-align:center;padding:10px;border-radius:var(--radius-sm);background:${colors[sev]}11;border:1px solid ${colors[sev]}33;">
                    <div style="font-size:20px;font-weight:800;color:${colors[sev]};">${n}</div>
                    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">${sev}</div>
                  </div>`;
        }).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Saved Reports List -->
        <div class="card">
          <div class="section-title">Saved Reports (${reports.length})</div>
          ${reports.length === 0 ? `
            <div class="empty-state" style="padding:28px;">
              <div class="empty-icon">📋</div>
              <div>No reports yet</div>
              <div style="font-size:12px;margin-top:4px;">Go to the Sandbox, find a bug, and build a report</div>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:8px;max-height:320px;overflow-y:auto;">
              ${[...reports].reverse().slice(0, 8).map(r => `
                <div class="flex items-center justify-between gap-3" style="padding:10px 12px;background:var(--bg-card);border-radius:var(--radius-sm);border:1px solid var(--border);">
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(r.title || 'Untitled Report')}</div>
                    <div style="font-size:11px;color:var(--text-muted);">${escHtml(r.bountyId || 'No program')} · ${timeAgo(r.savedAt)}</div>
                  </div>
                  ${r.severity ? `<span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span>` : ''}
                </div>
              `).join('')}
              ${reports.length > 8 ? `<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:8px;">+${reports.length - 8} more</div>` : ''}
            </div>
          `}
          <button class="btn btn-secondary w-full" onclick="Router.navigateTo('#reports')" style="margin-top:14px;">
            Open Report Builder →
          </button>
        </div>
      </div>
    `;
  }

  // Re-render when store changes (e.g. evidence flagged in sandbox)
  const unsub = Store.subscribe(() => render());
  // Clean up when page changes
  const origRender = window.Router.render;

  render();
});

// ─── Helpers ──────────────────────────────────────

function renderActiveBounty(b) {
  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
      <div class="bounty-logo" style="background:${b.color}22;font-size:24px;">${b.emoji}</div>
      <div>
        <div style="font-size:15px;font-weight:700;">${escHtml(b.company)}</div>
        <div style="font-size:12px;color:var(--text-muted);">${escHtml(b.program)}</div>
      </div>
    </div>
    <div class="flex gap-2" style="flex-wrap:wrap;margin-bottom:14px;">
      ${(b.tags || []).map(t => `<span class="badge badge-tag">${t}</span>`).join('')}
    </div>
    <div class="flex gap-2" style="flex-wrap:wrap;">
      <button class="btn btn-primary btn-sm" onclick="Router.navigateTo('#sandbox')">Go to Sandbox</button>
      <a class="btn btn-secondary btn-sm" href="${escHtml(b.programUrl || '#')}" target="_blank" rel="noopener noreferrer">Visit Program ↗</a>
      <button class="btn btn-secondary btn-sm" onclick="Router.navigateTo('#bounties')">Change</button>
    </div>
  `;
}

function renderVulnBar(name, pct, count) {
  const palette = [
    'var(--danger)', 'var(--warning)', 'var(--accent-light)',
    'var(--accent-2)', 'var(--success)', '#f472b6', '#34d399',
  ];
  // Pick a consistent color based on name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  const color = palette[Math.abs(hash) % palette.length];

  return `
    <div>
      <div class="flex justify-between items-center" style="margin-bottom:5px;">
        <span style="font-size:12.5px;color:var(--text-secondary);">${escHtml(name)}</span>
        <span style="font-size:11px;color:var(--text-muted);">${count} report${count !== 1 ? 's' : ''} (${pct}%)</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%;background:${color};box-shadow:0 0 8px ${color}66;"></div>
      </div>
    </div>
  `;
}

function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
window.escHtml = escHtml;
window.renderVulnBar = renderVulnBar;
