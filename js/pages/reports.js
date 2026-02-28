/* ═══════════════════════════════════════════════════
   SQUAX — Report Builder Page
═══════════════════════════════════════════════════ */

const VULN_CATEGORIES = [
    'Prompt Injection', 'Jailbreak / Alignment Bypass', 'System Prompt Disclosure',
    'Data Exfiltration', 'Model Inversion', 'Token Smuggling', 'Role Confusion',
    'Training Data Memorization', 'Function-Call Abuse', 'RAG Manipulation',
    'Adversarial Suffix Attack', 'Context Window Overflow', 'Other',
];

Router.registerPage('reports', function (container) {
    const s = Store.getState();

    // Seed draft from state
    let draft = s.reportDraft || {
        title: '',
        bountyId: s.activeBounty?.id || '',
        severity: '',
        category: '',
        stepsToReproduce: '',
        expected: '',
        actual: '',
        impact: '',
        mitigation: '',
    };

    function renderPage() {
        const { evidence, activeBounty, reports } = Store.getState();

        container.innerHTML = `
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>Report Builder</h1>
            <p>Generate a professional vulnerability report from your sandbox findings</p>
          </div>
          <div class="flex gap-2">
            <button type="button" class="btn btn-secondary btn-sm" onclick="reportSaveDraft()">💾 Save Draft</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.print()">🖨 Print / PDF</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="reportSubmit()">📤 Submit to Program</button>
          </div>
        </div>
      </div>

      <div class="report-layout">
        <!-- ─── FORM ─────────────────────────────── -->
        <div style="display:flex; flex-direction:column; gap:0;">

          <!-- Target Bounty -->
          <div class="card" style="margin-bottom:16px;">
            <div class="section-title">🎯 Target Program</div>
            <select class="form-select" id="rp-bounty" onchange="rpUpdateDraft()">
              <option value="">— Select Program —</option>
              ${BOUNTIES.map(b => `<option value="${b.id}" ${draft.bountyId === b.id ? 'selected' : ''}>${b.company} — ${b.program}</option>`).join('')}
            </select>
          </div>

          <!-- Severity -->
          <div class="card" style="margin-bottom:16px;">
            <div class="section-title">⚡ Severity Rating</div>
            <div class="severity-grid">
              ${['critical', 'high', 'medium', 'low'].map(s => `
                <div class="severity-btn ${draft.severity === s ? 'selected' : ''}" data-sev="${s}" onclick="rpSetSeverity('${s}')">
                  ${{ critical: '🔴 Critical', high: '🟠 High', medium: '🔵 Medium', low: '🟢 Low' }[s]}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Main Form -->
          <div class="card" style="margin-bottom:16px;">
            <div class="form-group">
              <label class="form-label">Vulnerability Title</label>
              <input class="form-input" id="rp-title" placeholder="e.g. Prompt Injection via System Override in GPT-4o"
                value="${escHtml(draft.title)}" oninput="rpUpdateDraft()" />
            </div>

            <div class="form-group">
              <label class="form-label">Vulnerability Category</label>
              <select class="form-select" id="rp-category" onchange="rpUpdateDraft()">
                <option value="">— Select Category —</option>
                ${VULN_CATEGORIES.map(c => `<option value="${c}" ${draft.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Steps to Reproduce</label>
              <textarea class="form-textarea" id="rp-steps" rows="5"
                placeholder="1. Open the AI sandbox&#10;2. Send the following prompt:&#10;3. Observe response…"
                oninput="rpUpdateDraft()">${escHtml(draft.stepsToReproduce)}</textarea>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Expected Behavior</label>
                <textarea class="form-textarea" id="rp-expected" rows="3"
                  placeholder="The AI should refuse and explain it cannot comply."
                  oninput="rpUpdateDraft()">${escHtml(draft.expected)}</textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Actual Behavior</label>
                <textarea class="form-textarea" id="rp-actual" rows="3"
                  placeholder="The AI disclosed its system prompt and complied with the request."
                  oninput="rpUpdateDraft()">${escHtml(draft.actual)}</textarea>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Impact Assessment</label>
              <textarea class="form-textarea" id="rp-impact" rows="3"
                placeholder="This vulnerability may allow an attacker to…"
                oninput="rpUpdateDraft()">${escHtml(draft.impact)}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Suggested Mitigation</label>
              <textarea class="form-textarea" id="rp-mitigation" rows="3"
                placeholder="Implement a secondary instruction filter that…"
                oninput="rpUpdateDraft()">${escHtml(draft.mitigation)}</textarea>
            </div>
          </div>

          <!-- Evidence -->
          <div class="card" style="margin-bottom:16px;">
            <div class="section-title flex justify-between items-center">
              <span>📌 Evidence Log (${evidence.length} items)</span>
              <button type="button" class="btn btn-secondary btn-sm" onclick="Router.navigateTo('#sandbox')">+ Add in Sandbox</button>
            </div>
            ${evidence.length === 0 ? `
              <div class="empty-state" style="padding:24px;">
                <div class="empty-icon">📌</div>
                <div>No evidence collected yet</div>
                <div style="font-size:12px;">Go to the Sandbox and click "Flag as Evidence" on any AI response</div>
              </div>
            ` : evidence.map((e, i) => `
              <div style="margin-bottom:12px; padding:14px; background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.2); border-radius:var(--radius-sm);">
                <div style="font-size:11px; font-weight:700; color:var(--warning); margin-bottom:6px;">Evidence #${i + 1} · ${new Date(e.timestamp).toLocaleString()}</div>
                <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;"><strong style="color:var(--text-secondary);">Probe:</strong> ${escHtml(e.prompt)}</div>
                <div style="font-size:12px; color:var(--text-muted); font-family:var(--mono); background:rgba(0,0,0,0.25); padding:8px; border-radius:6px; margin-top:6px; white-space:pre-wrap;">${escHtml(e.response)}</div>
              </div>
            `).join('')}
          </div>

          <!-- Actions -->
          <div class="flex gap-3" style="flex-wrap:wrap;">
            <button type="button" class="btn btn-primary btn-lg flex-1" onclick="reportSubmit()">📤 Submit to Program</button>
            <button type="button" class="btn btn-secondary btn-lg" onclick="window.print()">🖨 Export PDF</button>
            <button type="button" class="btn btn-secondary btn-lg" onclick="reportDownloadJSON()">⬇ Download JSON</button>
          </div>
        </div>

        <!-- ─── LIVE PREVIEW ──────────────────────── -->
        <div class="report-preview" id="rp-preview">
          ${renderPreview(draft, evidence)}
        </div>
      </div>

      <!-- Saved Reports -->
      ${reports.length > 0 ? `
        <hr class="divider" />
        <div class="section-title">📂 Saved Reports (${reports.length})</div>
        <div class="grid-auto" style="margin-top:14px;">
          ${reports.map(r => `
            <div class="card">
              <div class="flex items-center justify-between" style="margin-bottom:10px;">
                <span class="badge badge-${(r.severity || 'low').toLowerCase()}">${r.severity || 'Low'}</span>
                <span style="font-size:11px; color:var(--text-muted);">${new Date(r.savedAt).toLocaleString()}</span>
              </div>
              <div style="font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">${escHtml(r.title || 'Untitled')}</div>
              <div style="font-size:12px; color:var(--text-muted);">${escHtml(r.category || '')} · ${escHtml(r.bountyId || '')}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
    }

    // ─── Handlers ─────────────────────────────────────
    window.rpSetSeverity = function (sev) {
        draft.severity = sev;
        document.querySelectorAll('.severity-btn').forEach(b => {
            b.classList.toggle('selected', b.dataset.sev === sev);
        });
        rpUpdatePreview();
    };

    window.rpUpdateDraft = function () {
        draft = {
            ...draft,
            bountyId: document.getElementById('rp-bounty')?.value || '',
            title: document.getElementById('rp-title')?.value || '',
            category: document.getElementById('rp-category')?.value || '',
            stepsToReproduce: document.getElementById('rp-steps')?.value || '',
            expected: document.getElementById('rp-expected')?.value || '',
            actual: document.getElementById('rp-actual')?.value || '',
            impact: document.getElementById('rp-impact')?.value || '',
            mitigation: document.getElementById('rp-mitigation')?.value || '',
        };
        Store.setState({ reportDraft: draft });
        rpUpdatePreview();
    };

    function rpUpdatePreview() {
        const prev = document.getElementById('rp-preview');
        if (prev) prev.innerHTML = renderPreview(draft, Store.getState().evidence);
    }

    window.reportSaveDraft = function () {
        rpUpdateDraft();
        const r = saveReport({ ...draft, evidence: Store.getState().evidence });
        showToast(`Report saved (ID: ${r.id})`, 'success');
        renderPage();
    };

    window.reportSubmit = function () {
        rpUpdateDraft();
        if (!draft.title) { showToast('Please add a report title', 'error'); return; }
        if (!draft.severity) { showToast('Please select a severity rating', 'error'); return; }
        const r = saveReport({ ...draft, evidence: Store.getState().evidence });
        // Simulate submission
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
        overlay.innerHTML = `
      <div class="card" style="max-width:440px;text-align:center;padding:40px;border-color:rgba(16,185,129,0.5);box-shadow:0 0 60px rgba(16,185,129,0.2);">
        <div style="font-size:56px;margin-bottom:16px;">✅</div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:10px;">Report Submitted!</h2>
        <p style="color:var(--text-secondary);font-size:13px;margin-bottom:6px;">Your vulnerability report has been sent to the program team.</p>
        <p style="color:var(--text-muted);font-size:12px;margin-bottom:24px;">Report ID: <span class="mono" style="color:var(--accent-light);">${r.id.toUpperCase()}</span></p>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:24px;">Expected response time: <strong style="color:var(--text-primary);">3–7 business days</strong></p>
        <button type="button" class="btn btn-primary w-full" onclick="this.closest('[style*=fixed]').remove()">Close</button>
      </div>`;
        document.body.appendChild(overlay);
    };

    window.reportDownloadJSON = function () {
        rpUpdateDraft();
        const data = { ...draft, evidence: Store.getState().evidence, generatedAt: new Date().toISOString(), platform: 'Squax' };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = `squax-report-${Date.now()}.json`; a.click();
    };

    renderPage();
});

function renderPreview(d, evidence = []) {
    const bounty = BOUNTIES.find(b => b.id === d.bountyId);
    const sevColors = { critical: '#f87171', high: '#fbbf24', medium: '#60a5fa', low: '#34d399', '': 'var(--text-muted)' };
    const sev = d.severity || '';
    return `
    <h3>📄 Report Preview</h3>
    <hr class="preview-sep" />
    <div class="preview-title">${escHtml(d.title || 'Untitled Vulnerability Report')}</div>
    <hr class="preview-sep" />
    <div class="preview-field"><span class="preview-key">Program:</span> ${bounty ? escHtml(`${bounty.company} — ${bounty.program}`) : '—'}</div>
    <div class="preview-field"><span class="preview-key">Severity:</span> <span style="color:${sevColors[sev]};font-weight:700;">${sev ? sev.toUpperCase() : '—'}</span></div>
    <div class="preview-field"><span class="preview-key">Category:</span> ${escHtml(d.category || '—')}</div>
    <div class="preview-field"><span class="preview-key">Date:</span> ${new Date().toLocaleDateString()}</div>
    <div class="preview-field"><span class="preview-key">Platform:</span> Squax Bug Bounty Platform</div>
    <hr class="preview-sep" />
    <div class="preview-field"><span class="preview-key">Steps to Reproduce:</span><br/><pre style="white-space:pre-wrap;font-family:var(--mono);font-size:11px;margin-top:4px;">${escHtml(d.stepsToReproduce || '—')}</pre></div>
    <div class="preview-field"><span class="preview-key">Expected:</span><br/>${escHtml(d.expected || '—')}</div>
    <div class="preview-field"><span class="preview-key">Actual:</span><br/>${escHtml(d.actual || '—')}</div>
    <hr class="preview-sep" />
    <div class="preview-field"><span class="preview-key">Impact:</span><br/>${escHtml(d.impact || '—')}</div>
    <div class="preview-field"><span class="preview-key">Mitigation:</span><br/>${escHtml(d.mitigation || '—')}</div>
    ${evidence.length > 0 ? `
      <hr class="preview-sep" />
      <div class="preview-key" style="margin-bottom:8px;">Evidence (${evidence.length} items):</div>
      ${evidence.map((e, i) => `
        <div class="preview-evidence">
          <strong>#${i + 1} Probe:</strong> ${escHtml(e.prompt.slice(0, 80))}…<br/>
          <strong>Response:</strong> ${escHtml(e.response.slice(0, 120))}…
        </div>
      `).join('')}
    ` : ''}
  `;
}
