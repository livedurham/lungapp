// Lung cancer app behavior and NGS matching logic.
const adenoPlaceholders = [
  {id:'screen-adeno-wt-iv-x', back:'screen-adeno-iv', label:'placeholder', title:'x', zh:'x'},
];
adenoPlaceholders.forEach(p=>{
  const div=document.createElement('div');
  div.id=p.id; div.className='screen';
  div.innerHTML=`<div class="page-wrap">
    <div class="nav-row anim"><div style="display:flex;flex-direction:column;gap:4px;"><button class="back-btn" onclick="goTo('${p.back}')">返回上頁</button><button class="back-btn" onclick="goTo('screen-home')" style="margin-top:6px;">返回首頁</button></div><span class="nav-label">${p.label}</span></div>
    <div class="page-heading anim d1">
      <div class="ph-type">${p.title}</div>
      <div class="ph-title nsclc-color">${p.zh}</div>
    </div>
    <main style="width:100%;max-width:820px;flex:1;display:flex;align-items:center;justify-content:center;">
      <div style="text-align:center;padding:48px 24px;">
        <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:var(--rule);margin-bottom:14px;">Coming Soon</div>
      </div>
    </main>
  </div>`;
  document.body.appendChild(div);
});

window.ngsBack = 'screen-nsclc';

function openNgs(backId){
  window.ngsBack = backId || 'screen-nsclc';
  setupNgsDropdowns();
  goTo('screen-ngs-recommend');
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, ch => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[ch]));
}

function normalizeReportText(value){
  return String(value || '')
    .replace(/[：]/g, ':')
    .replace(/[−–—]/g, '-')
    .toUpperCase();
}

const ngsDropdownGroups = [
  { gene:'EGFR', options:[
    { label:'EGFR del19 / L858R', query:'EGFR exon19 deletion L858R' },
    { label:'EGFR exon20 insertion', query:'EGFR exon20 insertion' },
    { label:'EGFR exon20 alteration（subtype 未明）', query:'EGFR exon20' },
    { label:'EGFR T790M', query:'EGFR T790M' },
    { label:'EGFR uncommon：G719X / S768I / L861Q', query:'EGFR G719X S768I L861Q' },
    { label:'EGFR positive（subtype 未明）', query:'EGFR positive' },
  ]},
  { gene:'ALK', options:[
    { label:'ALK fusion / rearrangement', query:'ALK fusion detected' },
    { label:'ALK alteration（type 未明）', query:'ALK positive' },
  ]},
  { gene:'ROS1', options:[
    { label:'ROS1 fusion / rearrangement', query:'ROS1 fusion detected' },
    { label:'ROS1 alteration（type 未明）', query:'ROS1 positive' },
  ]},
  { gene:'MET', options:[
    { label:'MET exon14 skipping', query:'MET exon14 skipping' },
    { label:'MET mutation / amplification（非 exon14 或未明）', query:'MET mutation detected' },
  ]},
  { gene:'RET', options:[
    { label:'RET fusion / rearrangement', query:'KIF5B-RET fusion' },
    { label:'RET alteration（type 未明）', query:'RET positive' },
  ]},
  { gene:'KRAS', options:[
    { label:'KRAS G12C', query:'KRAS G12C' },
    { label:'KRAS alteration（非 G12C 或未明）', query:'KRAS positive' },
  ]},
  { gene:'BRAF', options:[
    { label:'BRAF V600E', query:'BRAF V600E' },
    { label:'BRAF alteration（非 V600E 或未明）', query:'BRAF positive' },
  ]},
  { gene:'NTRK', options:[
    { label:'NTRK fusion / rearrangement', query:'NTRK fusion detected' },
    { label:'NTRK alteration（非 fusion 或未明）', query:'NTRK positive' },
  ]},
  { gene:'HER2 / ERBB2', options:[
    { label:'ERBB2 activating mutation / exon20 insertion', query:'ERBB2 exon20 insertion mutation' },
    { label:'HER2 positive / amplification（type 未明）', query:'HER2 positive' },
  ]},
];

function setupNgsDropdowns(){
  const geneSelect = document.getElementById('ngs-gene-select');
  const alterationSelect = document.getElementById('ngs-alteration-select');
  if (!geneSelect) return;
  if (!geneSelect.options.length) {
    geneSelect.innerHTML = '<option value="">請選擇基因</option>' + ngsDropdownGroups.map((group, index) => `<option value="${index}">${group.gene}</option>`).join('');
  }
  if (alterationSelect && !alterationSelect.options.length) {
    updateNgsAlterationOptions();
  }
}

function updateNgsAlterationOptions(){
  const geneSelect = document.getElementById('ngs-gene-select');
  const alterationSelect = document.getElementById('ngs-alteration-select');
  if (!geneSelect || !alterationSelect) return;
  if (geneSelect.value === '') {
    alterationSelect.innerHTML = '<option value="">請先選擇基因</option>';
    return;
  }
  const group = ngsDropdownGroups[Number(geneSelect.value)];
  if (!group) {
    alterationSelect.innerHTML = '<option value="">請先選擇基因</option>';
    return;
  }
  alterationSelect.innerHTML = '<option value="">請選擇 alteration</option>' + group.options.map((option, index) => `<option value="${index}">${option.label}</option>`).join('');
}

function selectedNgsQuery(){
  setupNgsDropdowns();
  const geneSelect = document.getElementById('ngs-gene-select');
  const alterationSelect = document.getElementById('ngs-alteration-select');
  if (!geneSelect?.value || !alterationSelect?.value) return '';
  const group = ngsDropdownGroups[Number(geneSelect.value)];
  const option = group?.options[Number(alterationSelect.value)];
  return option?.query || '';
}

function reportContext(){
  const raw = selectedNgsQuery();
  const text = normalizeReportText(raw);
  const lines = text.split(/\n|;|。|，/).map(line => line.trim()).filter(Boolean);
  return { raw, text, lines };
}

const ngsNegation = /(NEGATIVE|NOT\s+DETECTED|UNDETECTED|ABSENT|WILD\s*TYPE|WILDTYPE|NO\s+[A-Z0-9\s/+-]{0,40}(MUTATION|VARIANT|FUSION|REARRANGEMENT|ALTERATION)|陰性|未檢出|未偵測|無突變|無融合|野生型)/i;

function positiveLine(lines, genePattern, alterationPattern){
  return lines.some(line => genePattern.test(line) && alterationPattern.test(line) && !ngsNegation.test(line));
}

function reportHas(ctx, genePattern, alterationPattern){
  if (positiveLine(ctx.lines, genePattern, alterationPattern)) return true;
  const geneSeen = genePattern.test(ctx.text);
  const alterationSeen = alterationPattern.test(ctx.text);
  const onlyNegated = ctx.lines.some(line => genePattern.test(line) && ngsNegation.test(line)) && !positiveLine(ctx.lines, genePattern, alterationPattern);
  return geneSeen && alterationSeen && !onlyNegated;
}

function geneMentioned(ctx, genePattern){
  return ctx.lines.some(line => genePattern.test(line) && !ngsNegation.test(line));
}

function coverageClass(coverage){
  if (coverage === '健保') return 'tag-nhi';
  if (coverage === '健保-限條件') return 'tag-limited';
  if (coverage === '自費') return 'tag-self';
  return 'tag-warn';
}

function renderNgsResults(matches){
  const box = document.getElementById('ngs-results');
  if (!box) return;

  if (!matches.length) {
    box.innerHTML = `<div class="ngs-empty">未偵測到目前工具支援的 actionable driver。請確認報告是否包含 EGFR、ALK、ROS1、MET exon14、RET、KRAS G12C、BRAF V600E、NTRK fusion 或 HER2/ERBB2 alteration；若為陰性或 VUS，請回到 PD-L1 / wild type 路徑。</div>`;
    return;
  }

  box.innerHTML = matches.map(item => `
    <div class="ngs-hit-card">
      <div class="ngs-hit-head">
        <span class="ngs-gene">${escapeHtml(item.title)}</span>
        <span class="ngs-chip">${escapeHtml(item.badge)}</span>
      </div>
      <div class="ngs-hit-body">
        ${item.drugs.map(drug => `
          <div class="ngs-drug">
            <span class="pill ${drug.coverage === '自費' ? 'pill-self' : 'pill-immuno'}" style="font-size:13px;">${escapeHtml(drug.name)}</span>
            <span class="pill-tag ${coverageClass(drug.coverage)}">${escapeHtml(drug.coverage)}</span>
            <span class="ngs-note">${escapeHtml(drug.note)}</span>
          </div>
        `).join('')}
        <div class="tx-divider"></div>
        <div class="ngs-note">${escapeHtml(item.note)}</div>
      </div>
    </div>
  `).join('');
}

function setNgsEmpty(message){
  const box = document.getElementById('ngs-results');
  if (box) box.innerHTML = `<div class="ngs-empty">${escapeHtml(message)}</div>`;
}

function analyzeNgsReport(){
  const ctx = reportContext();
  if (!ctx.raw) {
    setNgsEmpty('請先選擇 Gene 與 Alteration，再按「判讀報告」。');
    return;
  }
  const matches = window.ngsTargets
    .filter(item => item.match(ctx))
    .sort((a,b) => a.priority - b.priority);
  const coveredBadges = new Set(matches.map(item => item.badge));
  const fallbackMatches = window.ngsFallbackTargets
    .filter(item => !coveredBadges.has(item.badge) && item.match(ctx))
    .sort((a,b) => a.priority - b.priority);
  renderNgsResults([...matches, ...fallbackMatches]);
}

function clearNgsReport(){
  const geneSelect = document.getElementById('ngs-gene-select');
  const alterationSelect = document.getElementById('ngs-alteration-select');
  if (geneSelect) geneSelect.value = '';
  if (alterationSelect) alterationSelect.innerHTML = '<option value="">請先選擇基因</option>';
  setNgsEmpty('尚未判讀。請選擇 Gene 與 Alteration 後，按「判讀報告」。');
}

function goTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const t=document.getElementById(id);
  if(t){
    t.classList.add('active');
    t.querySelectorAll('.anim').forEach(el=>{el.style.animation='none';el.offsetHeight;el.style.animation='';});
    window.scrollTo(0,0);
  }
}
