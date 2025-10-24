document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const openBtn = document.getElementById('ks-open-modal');
  const modalBackdrop = document.getElementById('ks-modal');
  const closeBtn = document.getElementById('ks-close-modal');
  const form = document.getElementById('ks-plan-form');
  const previewEl = document.getElementById('ks-plan-preview');
  const previousList = document.getElementById('ks-previous-list');

  // Utility: escape HTML for injection safety
  function esc(s) {
    if (!s && s !== 0) return '';
    return String(s).replace(/[&<>"']/g, function (m) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }

  // Modal helpers
  function openModal() {
    modalBackdrop.style.display = 'grid';
    modalBackdrop.setAttribute('aria-hidden', 'false');
    const first = document.getElementById('ks-sport');
    if (first) first.focus();
  }
  
  function closeModal() {
    modalBackdrop.style.display = 'none';
    modalBackdrop.setAttribute('aria-hidden', 'true');
    previewEl.innerHTML = '';
  }

  // Generate a simple plan object (same logic but lightweight)
  function makePlan({sport, level, duration, focus, notes}) {
    const levelIntensity = { Beginner:0.7, Intermediate:1, Advanced:1.3 }[level] || 1;
    const sessionsPerWeek = Math.min(6, Math.max(2, Math.round(3 * levelIntensity)));
    const estimatedMinutes = Math.round(45 * levelIntensity);
    const weeklyStructure = [];

    for (let w = 1; w <= duration; w++) {
      const longSession = { type: focus === 'Endurance' ? 'Long Endurance' : 'Skill/Practice', duration: Math.round(estimatedMinutes * (1 + Math.min(0.5, w/duration))) };
      const speed = { type: 'Speed/Intensity', duration: Math.round(estimatedMinutes * 0.6) };
      const recovery = { type: 'Recovery & Mobility', duration: 20 };
      const week = { week: w, sessions: [] };
      week.sessions.push(longSession, speed);
      for (let s = 3; s <= sessionsPerWeek; s++) {
        week.sessions.push(s % 2 === 0 ? recovery : { type: 'Technical Work', duration: Math.round(estimatedMinutes * 0.8) });
      }
      weeklyStructure.push(week);
    }

    return {
      id: 'ks_plan_' + Date.now(),
      name: `${sport} • ${focus} (${duration}w)`,
      sport, level, duration, focus, notes, sessionsPerWeek, weeklyStructure, createdAt: new Date().toISOString()
    };
  }

  // Storage
  function loadPlans() {
    try {
      const raw = localStorage.getItem('ks_plans_v1');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('ks: loadPlans error', e);
      return [];
    }
  }
  
  function savePlan(plan) {
    const all = loadPlans();
    all.unshift(plan);
    localStorage.setItem('ks_plans_v1', JSON.stringify(all));
    renderPrevious();
  }
  
  function deletePlan(id) {
    if (!confirm('Delete this saved plan?')) return;
    const all = loadPlans().filter(p => p.id !== id);
    localStorage.setItem('ks_plans_v1', JSON.stringify(all));
    renderPrevious();
  }

  // Render previous list
  function renderPrevious() {
    const plans = loadPlans();
    if (!plans || plans.length === 0) {
      previousList.innerHTML = `<div class="ks-empty">No saved plans yet — create your first discipline plan above. Your plans are stored in your browser.</div>`;
      return;
    }
    previousList.innerHTML = plans.map(p => {
      const created = new Date(p.createdAt);
      return `
        <div class="ks-plan-card" role="article" aria-label="${esc(p.name)}">
          <div class="ks-meta"><div><strong>${esc(p.name)}</strong></div><div class="ks-small">${esc(p.sessionsPerWeek)} sessions/week • ${esc(p.duration)} weeks</div></div>
          <div class="ks-small ks-muted">Level: ${esc(p.level)} • Created: ${created.toLocaleDateString()}</div>
          <p style="margin-top:8px" class="ks-muted">${esc(p.notes || 'No notes')}</p>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="ks-btn ks-btn-primary" data-continue="${esc(p.id)}">Continue</button>
            <button class="ks-btn ks-btn-ghost" data-view="${esc(p.id)}">View</button>
            <button class="ks-btn ks-btn-ghost" data-delete="${esc(p.id)}">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // small preview helper
  function previewPlan(plan) {
    const firstWeek = plan.weeklyStructure[0].sessions.map(s => `${esc(s.type)} — ${esc(s.duration)} min`).join('<br>');
    previewEl.innerHTML = `
      <div style="margin-top:10px;padding:12px;border-radius:10px;background:var(--bg-secondary);border:1px solid var(--border-color)">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${esc(plan.name)}</strong>
          <span class="ks-small">${esc(plan.sessionsPerWeek)} sessions/week</span>
        </div>
        <div class="ks-muted" style="margin-top:8px">First week snapshot:</div>
        <div style="margin-top:8px" class="ks-muted">${firstWeek}</div>
        <div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end">
          <button class="ks-btn ks-btn-ghost" id="ks-discard-preview">Discard</button>
          <button class="ks-btn ks-btn-primary" id="ks-save-preview">Save plan</button>
        </div>
      </div>
    `;

    // wire preview buttons
    document.getElementById('ks-save-preview').addEventListener('click', () => {
      savePlan(plan);
      closeModal();
    });
    document.getElementById('ks-discard-preview').addEventListener('click', () => {
      previewEl.innerHTML = '';
    });
  }

  // template actions (Use template / Preview)
  document.addEventListener('click', function (e) {
    // Use template: buttons in .ks-plan-card or .ks-plans
    const tUse = e.target.closest('[data-template-name]');
    if (tUse) {
      const name = tUse.getAttribute('data-template-name');
      const weeks = parseInt(tUse.getAttribute('data-template-weeks') || '8', 10);
      openModal();
      // prefill after short tick to let modal show
      setTimeout(() => {
        const s = document.getElementById('ks-sport');
        const d = document.getElementById('ks-duration');
        if (s) s.value = name.split('—')[0].trim() || 'Custom';
        if (d) d.value = weeks;
        const focus = document.getElementById('ks-focus');
        if (focus) focus.value = name.includes('Endurance') ? 'Endurance' : 'Skill';
      }, 120);
      return;
    }

    // Preview templates
    const tPreview = e.target.closest('[data-preview]');
    if (tPreview) {
      alert('Preview: ' + tPreview.getAttribute('data-preview') + '\nUse Create My Plan to customize and save.');
      return;
    }

    // Previous plan actions: continue / view / delete
    const continueBtn = e.target.closest('[data-continue]');
    if (continueBtn) {
      const id = continueBtn.getAttribute('data-continue');
      const plan = loadPlans().find(p => p.id === id);
      if (!plan) return alert('Plan not found');
      openModal();
      setTimeout(() => {
        document.getElementById('ks-sport').value = plan.sport || 'Custom';
        document.getElementById('ks-level').value = plan.level || 'Beginner';
        document.getElementById('ks-duration').value = plan.duration || 8;
        document.getElementById('ks-focus').value = plan.focus || 'Skill';
        document.getElementById('ks-notes').value = plan.notes || '';
      }, 120);
      return;
    }
    
    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) {
      const id = viewBtn.getAttribute('data-view');
      const plan = loadPlans().find(p => p.id === id);
      if (!plan) return alert('Plan not found');
      // show a compact view
      const s = plan.weeklyStructure.slice(0,3).map(w => `Week ${w.week}: ${w.sessions.map(x => x.type + ' (' + x.duration + 'm)').join(', ')}`).join('\n\n');
      alert(`${plan.name}\n\n${plan.duration} weeks • ${plan.sessionsPerWeek} sessions/week\n\n${s}\n\nNotes: ${plan.notes || '–'}`);
      return;
    }
    
    const delBtn = e.target.closest('[data-delete]');
    if (delBtn) {
      const id = delBtn.getAttribute('data-delete');
      deletePlan(id);
      return;
    }
  });

  // wire open/close modal and overlay click
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (ev) => {
      if (ev.target === modalBackdrop) closeModal();
    });
  }

  // form submit: generate & preview
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const sport = document.getElementById('ks-sport').value;
      const level = document.getElementById('ks-level').value;
      const duration = parseInt(document.getElementById('ks-duration').value, 10) || 6;
      const focus = document.getElementById('ks-focus').value;
      const notes = document.getElementById('ks-notes').value;
      const plan = makePlan({ sport, level, duration, focus, notes });
      previewPlan(plan);
    });
  }

  // initialize demo plans if none exist (so the section isn't empty)
  (function initDemo() {
    const existing = loadPlans();
    if (!existing || existing.length === 0) {
      const demo1 = makePlan({ sport: 'Soccer', level: 'Intermediate', duration: 8, focus: 'Endurance', notes: 'Used by local league players — interval progressions.' });
      const demo2 = makePlan({ sport: 'Running', level: 'Beginner', duration: 9, focus: 'Endurance', notes: 'Gradual increase — great for first 10K.' });
      demo1.createdAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString();
      demo2.createdAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString();
      localStorage.setItem('ks_plans_v1', JSON.stringify([demo1, demo2]));
    }
    renderPrevious();
  })();

  // Reveal on scroll for elements that have .ks-reveal class (progressive enhancement).
  const revealNodes = document.querySelectorAll('.ks-reveal, .ks-hero-left, .ks-illu, .ks-inspo, .ks-plan-card');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('ks-show');
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach(n => obs.observe(n));
  }
});
