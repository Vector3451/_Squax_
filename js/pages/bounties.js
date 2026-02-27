/* ═══════════════════════════════════════════════════
   SQUAX — Bounty Listings Page
   Real program data sourced from:
   https://arcanum-sec.github.io/ai-sec-resources/
═══════════════════════════════════════════════════ */

const BOUNTIES = [

  // ── Professional Paid Bug Bounties ─────────────────

  {
    id: 'openai-bugcrowd',
    company: 'OpenAI',
    program: 'Bug Bounty via Bugcrowd',
    emoji: '🧠',
    color: '#10b981',
    type: 'professional',
    desc: 'Official OpenAI bug bounty hosted on Bugcrowd. Scope covers ChatGPT, the GPT API, and related OpenAI services and infrastructure. One of the most high-profile AI security research targets in the industry.',
    tags: ['prompt-injection', 'jailbreak', 'api-security', 'infrastructure'],
    outOfScope: ['Prompt Injection', 'Role Confusion'], // Pure safety bypasses without security impact are OOS
    rewards: { critical: 'Varies', high: 'Varies', medium: 'Varies', low: 'Varies' },
    rewardNote: 'Rewards determined per-submission on Bugcrowd',
    apiBase: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    programUrl: 'https://bugcrowd.com/engagements/openai',
    status: 'active',
    submissions: 'Open',
    deadline: 'Ongoing',
  },
  {
    id: 'anthropic-bounty',
    company: 'Anthropic',
    program: 'Claude AI Responsible Disclosure',
    emoji: '🌿',
    color: '#f59e0b',
    type: 'professional',
    desc: 'Official Anthropic responsible disclosure program for reporting security vulnerabilities in Claude AI systems and infrastructure. Direct impact on frontier AI safety and constitutional AI research.',
    tags: ['constitutional-bypass', 'jailbreak', 'safety-bypass', 'infrastructure'],
    rewards: { critical: 'Varies', high: 'Varies', medium: 'Varies', low: 'Varies' },
    rewardNote: 'Rewards via responsible disclosure — submit directly to Anthropic',
    apiBase: 'https://api.anthropic.com/v1',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
    programUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf3IuyunFH1Rbz_9Bpt2kGBfwSW5QQ1TBkeAzNZrtCP-hRvNA/viewform',
    status: 'active',
    submissions: 'Open',
    deadline: 'Ongoing',
  },
  {
    id: 'google-abuse-vrp',
    company: 'Google',
    program: 'Gemini Abuse Vulnerability Reward Program',
    emoji: '💎',
    color: '#3b82f6',
    type: 'professional',
    desc: 'Google\'s Abuse Vulnerability Reward Program for Gemini AI models and services, part of the Google Bug Hunters program. Focuses specifically on AI safety vulnerabilities and abuse vectors in production Gemini systems.',
    tags: ['abuse-vectors', 'safety-bypass', 'model-inversion', 'multimodal-injection'],
    rewards: { critical: 'Varies', high: 'Varies', medium: 'Varies', low: 'Varies' },
    rewardNote: 'Rewards via Google Bug Hunters — amounts vary by severity & impact',
    apiBase: 'https://generativelanguage.googleapis.com/v1beta',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    programUrl: 'https://bughunters.google.com/about/rules/google-friends/5238081279623168/abuse-vulnerability-reward-program-rules',
    status: 'active',
    submissions: 'Open',
    deadline: 'Ongoing',
  },
  {
    id: '0din-mozilla',
    company: 'Mozilla / 0din.ai',
    program: '0-Day Investigative Network — GenAI Bug Bounty',
    emoji: '🦊',
    color: '#ff6611',
    type: 'professional',
    desc: 'Mozilla\'s 0-Day Investigative Network bug bounty specifically targeting vulnerabilities in large language models and generative AI systems. Awards up to $15,000 for critical findings including guardrail jailbreaks and training data leakage.',
    tags: ['prompt-injection', 'guardrail-bypass', 'training-data-leak', 'jailbreak'],
    rewards: { critical: '$15,000', high: '$5,000', medium: '$1,000', low: '$500' },
    rewardNote: '$500–$15,000 reward range · Mozilla partnership · GenAI security focus',
    apiBase: '',
    models: ['Any in-scope LLM'],
    programUrl: 'https://0din.ai/',
    status: 'active',
    submissions: 'Open',
    deadline: 'Ongoing',
  },

  // ── Competitive / Prize-Pool Programs ──────────────

  {
    id: 'hackaprompt-2',
    company: 'Learn Prompting + OpenAI',
    program: 'HackAPrompt 2.0',
    emoji: '🏆',
    color: '#8b5cf6',
    type: 'competition',
    desc: 'World\'s largest AI red-teaming competition with a $100,000+ prize pool, co-organised with OpenAI. Multiple tracks: CBRNE, Agents, and Classic GenAI. Tests jailbreaking and prompt injection with educational tutorials included.',
    tags: ['jailbreak', 'prompt-injection', 'agent-attacks', 'CBRNE'],
    rewards: { critical: '$100,000+', high: 'Prize Pool', medium: 'Prize Pool', low: 'N/A' },
    rewardNote: '$100,000+ prize pool · 2-month duration · 3 competition tracks',
    apiBase: '',
    models: ['Multiple AI targets'],
    programUrl: 'https://www.hackaprompt.com/',
    status: 'active',
    submissions: 'Open',
    deadline: 'Check site',
  },
  {
    id: 'gray-swan-arena',
    company: 'Gray Swan AI',
    program: 'Gray Swan AI Arena',
    emoji: '🦢',
    color: '#6366f1',
    type: 'competition',
    desc: 'Competitive AI safety and alignment arena featuring prompt injection challenges, model evaluation, and red-teaming competitions. Test skills against various AI models with an Elo scoring system in structured competitive scenarios.',
    tags: ['prompt-injection', 'model-evaluation', 'safety-testing', 'red-teaming'],
    rewards: { critical: 'Elo + Prizes', high: 'Elo Points', medium: 'Elo Points', low: 'N/A' },
    rewardNote: 'Elo scoring system · Structured competitive format · Community-driven',
    apiBase: '',
    models: ['Multiple AI models'],
    programUrl: 'https://app.grayswan.ai/arena',
    status: 'active',
    submissions: 'Open',
    deadline: 'Ongoing',
  },
  {
    id: 'redteam-arena',
    company: 'RedTeam Arena',
    program: 'Open-Source LLM Red-Teaming Platform',
    emoji: '⚔️',
    color: '#ef4444',
    type: 'competition',
    desc: 'Open-source community-driven LLM red-teaming platform. Players have 60 seconds to convince models to say target words using jailbreaking techniques. Gamified with Elo scoring — no registration required.',
    tags: ['jailbreak', 'red-teaming', '60s-challenge', 'elo-scoring'],
    rewards: { critical: 'Elo Points', high: 'Elo Points', medium: 'Elo Points', low: 'N/A' },
    rewardNote: 'No registration · 60-second jailbreak challenges · Open-source codebase',
    apiBase: '',
    models: ['Multiple LLMs'],
    programUrl: 'https://redarena.ai/',
    status: 'active',
    submissions: 'Open',
    deadline: 'Ongoing',
  },
  {
    id: 'pangea-escape',
    company: 'Pangea',
    program: 'AI Escape Room — $10K Competition',
    emoji: '🚪',
    color: '#06b6d4',
    type: 'competition',
    desc: 'Interactive AI escape room where participants use prompt injection techniques to outsmart AI chatbot supervisors and reveal secret passcodes. Features a $10K competition with a global leaderboard and multi-level difficulty progression.',
    tags: ['prompt-injection', 'escape-room', 'chatbot-bypass', 'multi-level'],
    rewards: { critical: '$10,000', high: 'Leaderboard', medium: 'Leaderboard', low: 'N/A' },
    rewardNote: '$10K prize pool · Global leaderboard · Virtual escape room scenarios',
    apiBase: '',
    models: ['Pangea AI Chatbots'],
    programUrl: 'https://escape.pangea.cloud/',
    status: 'active',
    submissions: 'Open',
    deadline: 'Check site',
  },
  {
    id: 'llm-hacker-challenge',
    company: 'All About AI',
    program: 'LLM Hacker Challenge',
    emoji: '💻',
    color: '#ec4899',
    type: 'competition',
    desc: 'Interactive LLM hacking challenge with progressively difficult levels designed to push the limits of AI security and model manipulation. Real-time feedback system, community leaderboard, and no setup required — runs entirely in browser.',
    tags: ['jailbreak', 'prompt-engineering', 'progressive-difficulty', 'leaderboard'],
    rewards: { critical: 'Leaderboard', high: 'Leaderboard', medium: 'Leaderboard', low: 'N/A' },
    rewardNote: 'Community leaderboard · Real-time feedback · Browser-based',
    apiBase: '',
    models: ['Multiple LLMs'],
    programUrl: 'https://llmhacker.vercel.app/challenge',
    status: 'active',
    submissions: 'Open',
    deadline: 'Ongoing',
  },
];

window.BOUNTIES = BOUNTIES;
window.getBountyById = (id) => BOUNTIES.find(b => b.id === id);

Router.registerPage('bounties', function (container) {
  let filterTag = 'all';
  let typeFilter = 'all'; // 'all' | 'professional' | 'competition'

  function render() {
    const tags = ['all', 'prompt-injection', 'jailbreak', 'safety-bypass', 'model-inversion', 'guardrail-bypass', 'red-teaming'];

    let shown = BOUNTIES;
    if (typeFilter !== 'all') shown = shown.filter(b => b.type === typeFilter);
    if (filterTag !== 'all') shown = shown.filter(b => b.tags.some(t => t.includes(filterTag.split('-')[0])));

    const pro = BOUNTIES.filter(b => b.type === 'professional').length;
    const comp = BOUNTIES.filter(b => b.type === 'competition').length;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>Bug Bounty Programs</h1>
            <p>${BOUNTIES.length} real programs · ${pro} paid bounties · ${comp} competitions</p>
          </div>
          <div class="flex gap-2" style="align-items:center;">
            <div style="font-size:11px; color:var(--text-muted);">Source:
              <a href="https://arcanum-sec.github.io/ai-sec-resources/" target="_blank"
                style="color:var(--accent-light); text-decoration:none;">arcanum-sec.github.io</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Type Tabs -->
      <div class="flex gap-2" style="margin-bottom:18px; flex-wrap:wrap;">
        <button class="btn btn-sm ${typeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="bountyTypeFilter('all')">All (${BOUNTIES.length})</button>
        <button class="btn btn-sm ${typeFilter === 'professional' ? 'btn-primary' : 'btn-secondary'}" onclick="bountyTypeFilter('professional')">💰 Paid Bounties (${pro})</button>
        <button class="btn btn-sm ${typeFilter === 'competition' ? 'btn-primary' : 'btn-secondary'}" onclick="bountyTypeFilter('competition')">🏆 Competitions (${comp})</button>
      </div>

      <!-- Tag Filter -->
      <div class="flex gap-2" style="flex-wrap:wrap; margin-bottom:22px;">
        ${tags.map(t => `
          <button class="btn btn-sm ${filterTag === t ? 'btn-primary' : 'btn-secondary'}"
            onclick="bountySetFilter('${t}')">
            ${t === 'all' ? 'All Tags' : t}
          </button>
        `).join('')}
      </div>

      <!-- Bounty Grid -->
      <div class="grid-auto">
        ${shown.length === 0
        ? `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">🔍</div><div>No programs match the selected filters</div></div>`
        : shown.map(b => renderBountyCard(b)).join('')}
      </div>
    `;
  }

  window.bountySetFilter = function (tag) { filterTag = tag; render(); };
  window.bountyTypeFilter = function (type) { typeFilter = type; render(); };

  window.selectBounty = function (id) {
    const b = getBountyById(id);
    if (!b) return;
    Store.setState({ activeBounty: b, chatHistory: [], evidence: [], connected: false, apiKey: '' });
    logActivity('🎯', `Bounty selected: ${b.company} — ${b.program}`, 'var(--accent-light)');
    showToast(`"${b.company}" selected! Opening sandbox…`, 'success');
    setTimeout(() => Router.navigateTo('#sandbox'), 600);
  };

  render();
});

function renderBountyCard(b) {
  const isPro = b.type === 'professional';
  const typeBadge = isPro
    ? `<span class="badge badge-high">💰 Paid Bounty</span>`
    : `<span class="badge badge-info">🏆 Competition</span>`;

  return `
    <div class="card bounty-card" id="bounty-${b.id}">
      <div class="bounty-card-header">
        <div class="bounty-logo" style="background:${b.color}22; color:${b.color}; font-size:26px;">${b.emoji}</div>
        <div style="flex:1;">
          <div class="bounty-company">${escHtml(b.company)}</div>
          <div class="bounty-program">${escHtml(b.program)}</div>
        </div>
        ${typeBadge}
      </div>

      <div class="bounty-desc">${escHtml(b.desc)}</div>

      <div class="bounty-tags">
        ${b.tags.map(t => `<span class="badge badge-tag">${t}</span>`).join('')}
      </div>

      ${isPro ? `
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">Reward Tiers</div>
        <div class="bounty-rewards">
          <div class="reward-item"><div class="reward-amount" style="color:#f87171;">${b.rewards.critical}</div><div class="reward-tier">Critical</div></div>
          <div class="reward-item"><div class="reward-amount" style="color:#fbbf24;">${b.rewards.high}</div><div class="reward-tier">High</div></div>
          <div class="reward-item"><div class="reward-amount" style="color:#60a5fa;">${b.rewards.medium}</div><div class="reward-tier">Medium</div></div>
          <div class="reward-item"><div class="reward-amount" style="color:#34d399;">${b.rewards.low}</div><div class="reward-tier">Low</div></div>
        </div>
      ` : `
        <div style="padding:10px 12px; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.2); border-radius:var(--radius-sm); margin-bottom:14px;">
          <div style="font-size:12px; color:#a5b4fc; font-weight:600;">${escHtml(b.rewards.critical)}</div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">${escHtml(b.rewardNote)}</div>
        </div>
      `}

      <div style="font-size:11px; color:var(--text-muted); margin-bottom:14px; padding:8px 10px; background:rgba(255,255,255,0.03); border-radius:var(--radius-sm);">
        ℹ️ ${escHtml(b.rewardNote)}
      </div>

      <div class="bounty-card-footer">
        <div class="bounty-meta">
          <span class="bounty-meta-item"><span class="bounty-status-dot" style="background:var(--success);"></span> ${b.submissions}</span>
          <span class="bounty-meta-item">📅 ${b.deadline}</span>
        </div>
        <div class="flex gap-2">
          <a class="btn btn-secondary btn-sm" href="${escHtml(b.programUrl)}" target="_blank" rel="noopener noreferrer"
            onclick="event.stopPropagation()">
            ↗ Visit
          </a>
          ${b.apiBase ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); selectBounty('${b.id}')">Sandbox →</button>` : ''}
        </div>
      </div>
    </div>
  `;
}
