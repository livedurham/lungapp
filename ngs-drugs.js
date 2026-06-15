// NGS drug matching data. Update this file when Taiwan NHI coverage changes.
window.ngsTargets = [
  {
    priority: 10,
    title: 'EGFR exon 20 insertion',
    badge: 'EGFR',
    match: ctx => reportHas(ctx, /EGFR/i, /(EX(?:ON)?\s*20|EX20|E20).*(INS|INSERTION|插入)|E20INS|EX20INS|A763_Y764INS|D770_N771INS|H773/i),
    drugs: [
      {name:'Amivantamab + Carboplatin + Pemetrexed', coverage:'健保-限條件', note:'第一線；局部晚期或轉移性 NSCLC，需明確 EGFR exon20 insertion 檢測報告，事前審查；以健保最新正式條文/暫時性支付公告為準。'}
    ],
    note: '若無法使用 amivantamab 併化療，通常回到非驅動基因路徑評估化療 ± IO。'
  },
  {
    priority: 15,
    title: 'EGFR exon 20 alteration（需確認 subtype）',
    badge: 'EGFR',
    match: ctx => reportHas(ctx, /EGFR/i, /EX(?:ON)?\s*20|EX20|E20/i)
      && !reportHas(ctx, /EGFR/i, /(EX(?:ON)?\s*20|EX20|E20).*(INS|INSERTION|插入)|E20INS|EX20INS|A763_Y764INS|D770_N771INS|H773/i)
      && !reportHas(ctx, /EGFR/i, /(T790M|S768I)/i),
    drugs: [
      {name:'若為 EGFR exon20 insertion：Amivantamab + Carboplatin + Pemetrexed', coverage:'需確認', note:'健保需明確 EGFR exon20 insertion 檢測報告；若報告只寫 EGFR exon20，請回報告確認完整變異名稱。'},
      {name:'若為 S768I 或 T790M：依對應 EGFR subtype 路徑', coverage:'需確認', note:'exon 20 可包含不同變異，治療與給付條件不同，不建議只用 exon20 這個字樣決定用藥。'}
    ],
    note: '請補上完整 HGVS/variant，例如 A763_Y764insFQEA、D770_N771ins、S768I 或 T790M；工具會依 subtype 重新分流。'
  },
  {
    priority: 20,
    title: 'EGFR T790M',
    badge: 'EGFR',
    match: ctx => reportHas(ctx, /EGFR/i, /T790M/i),
    drugs: [
      {name:'Osimertinib', coverage:'健保-限條件', note:'限先前 EGFR TKI（gefitinib / erlotinib / afatinib / dacomitinib）治療失敗後，且 T790M 陽性之局部侵犯性或轉移性 NSCLC 第二線。'}
    ],
    note: '若同時有 exon20 insertion 或其他 resistance alteration，需依完整報告與前線用藥重新判讀。'
  },
  {
    priority: 30,
    title: 'EGFR del19 / L858R',
    badge: 'EGFR',
    match: ctx => reportHas(ctx, /EGFR/i, /(L858R|EX(?:ON)?\s*19|EX19|E19|DEL(?:ETION)?\s*19|19DEL|DEL19|E746|L747)/i),
    drugs: [
      {name:'Osimertinib', coverage:'健保-限條件', note:'第一線；EGFR exon19 deletion 或 exon21 L858R 之局部侵犯性或轉移性肺腺癌，需事前審查。'},
      {name:'Gefitinib / Erlotinib / Afatinib / Dacomitinib', coverage:'健保-限條件', note:'第一線可選；與 osimertinib 僅得擇一，除耐受不良外不得互換。'},
      {name:'Amivantamab + Lazertinib 或 Amivantamab + Chemo', coverage:'自費', note:'若依國際指引考慮，台灣健保目前非此適應症常規給付。'}
    ],
    note: 'EGFR 陽性病人通常不建議單用免疫治療；需優先確認腦轉移與前線治療。'
  },
  {
    priority: 40,
    title: 'EGFR uncommon mutation',
    badge: 'EGFR',
    match: ctx => reportHas(ctx, /EGFR/i, /(G719[A-Z]?|S768I|L861Q)/i),
    drugs: [
      {name:'Afatinib', coverage:'健保-限條件', note:'常用於 G719X / S768I / L861Q 等 uncommon EGFR mutation；需 EGFR 檢測報告與事前審查。'},
      {name:'Osimertinib', coverage:'自費', note:'可依個案與國際指引討論，但健保給付條文主要限 del19 / L858R 與 T790M 情境。'}
    ],
    note: '請確認是否合併 T790M、exon20 insertion 或複合突變。'
  },
  {
    priority: 50,
    title: 'ALK fusion / rearrangement',
    badge: 'ALK',
    match: ctx => reportHas(ctx, /\bALK\b/i, /(FUSION|REARRANGEMENT|TRANSLOCATION|EML4[-\s:]?ALK|融合|重排|陽性|POSITIVE|DETECTED)/i),
    drugs: [
      {name:'Lorlatinib', coverage:'健保-限條件', note:'ALK 陽性晚期 NSCLC 第一線；也可用於特定 ALK TKI 失敗後，需事前審查。'},
      {name:'Alectinib / Brigatinib / Ceritinib / Crizotinib', coverage:'健保-限條件', note:'ALK 陽性晚期 NSCLC 第一線可選；五種 ALK TKI 僅得擇一，除嚴重不良反應或耐受不良外不得互換。'}
    ],
    note: '腦轉移者通常優先考慮 CNS 穿透力較佳的 ALK TKI；ALK 陽性不建議以 IO 單藥作為主要策略。'
  },
  {
    priority: 60,
    title: 'ROS1 fusion / rearrangement',
    badge: 'ROS1',
    match: ctx => reportHas(ctx, /ROS\s*1|ROS1/i, /(FUSION|REARRANGEMENT|TRANSLOCATION|融合|重排|陽性|POSITIVE|DETECTED)/i),
    drugs: [
      {name:'Crizotinib', coverage:'健保-限條件', note:'ROS1 陽性局部晚期或轉移性 NSCLC 第一線，需事前審查。'},
      {name:'Entrectinib', coverage:'健保-限條件', note:'ROS1 陽性局部晚期或轉移性 NSCLC 可用；需事前審查與 ROS1 檢測報告。'},
      {name:'Repotrectinib', coverage:'健保-限條件', note:'限 crizotinib 或 entrectinib 治療中惡化後之 ROS1 陽性局部晚期或轉移性 NSCLC，115/2/1 起。'}
    ],
    note: 'ROS1 陽性對 IO 單藥反應通常不佳；前線與後線需依已用過的 ROS1 TKI 決定。'
  },
  {
    priority: 70,
    title: 'MET exon 14 skipping',
    badge: 'MET',
    match: ctx => reportHas(ctx, /\bMET\b/i, /(EX(?:ON)?\s*14|EX14|SKIPPING|SPLICE|跳讀|跳躍|剪接)/i),
    drugs: [
      {name:'Tepotinib', coverage:'健保-限條件', note:'MET exon14 skipping mutation 之轉移性 NSCLC；需事前審查與 MET exon14 skipping 檢測報告。'},
      {name:'Capmatinib', coverage:'自費', note:'台灣已上市；若未符合健保 tepotinib 條件或需替代 MET TKI，需個案自費評估。'}
    ],
    note: '單純 MET amplification 不等同 MET exon14 skipping；若報告只寫 amplification，請確認 copy number 與臨床意義。'
  },
  {
    priority: 80,
    title: 'RET fusion',
    badge: 'RET',
    match: ctx => reportHas(ctx, /\bRET\b/i, /(FUSION|REARRANGEMENT|TRANSLOCATION|KIF5B[-:\s]?RET|CCDC6[-:\s]?RET|融合|重排)/i),
    drugs: [
      {name:'Pralsetinib', coverage:'需確認', note:'RET fusion 陽性 NSCLC 給付狀態需以健保署最新正式條文、暫時性支付與院內事前審查結果確認；避免直接視為常規健保。'},
      {name:'Selpercatinib', coverage:'自費', note:'若可取得，可依個案討論；請確認台灣藥證、院內採購與給付狀態。'}
    ],
    note: 'RET mutation（如 M918T）不等同 NSCLC RET fusion，請以 NGS fusion 結果為主。'
  },
  {
    priority: 90,
    title: 'KRAS G12C',
    badge: 'KRAS',
    match: ctx => reportHas(ctx, /\bKRAS\b/i, /G12C/i),
    drugs: [
      {name:'Sotorasib', coverage:'自費', note:'Lumakras 已有台灣藥證；適用曾接受至少一次全身性療法後之 KRAS G12C 局部晚期或轉移性 NSCLC。'},
      {name:'Adagrasib', coverage:'自費', note:'若院內可取得或臨床試驗可近，需個案評估。'}
    ],
    note: '第一線通常依 PD-L1 與病理走 wild type 路徑；KRAS G12C 標靶多用於後線。'
  },
  {
    priority: 100,
    title: 'BRAF V600E',
    badge: 'BRAF',
    match: ctx => reportHas(ctx, /\bBRAF\b/i, /V600E|V600/i),
    drugs: [
      {name:'Dabrafenib + Trametinib', coverage:'健保-限條件', note:'限 BRAF V600E 突變之轉移性（第 IV 期）NSCLC，先前已接受第一線含鉑化療但仍惡化後作為第二線；需事前審查。'}
    ],
    note: '若無法自費標靶，依非驅動基因路徑評估化療 ± IO。'
  },
  {
    priority: 110,
    title: 'NTRK fusion',
    badge: 'NTRK',
    match: ctx => reportHas(ctx, /NTRK\s*[123]?|TRK/i, /(FUSION|REARRANGEMENT|ETV6[-\s:]?NTRK|TPM3[-\s:]?NTRK|融合|重排)/i),
    drugs: [
      {name:'Larotrectinib', coverage:'健保-限條件', note:'NTRK gene fusion solid tumor；需 NTRK fusion 檢測報告、符合健保條文與事前審查。'},
      {name:'Entrectinib / Repotrectinib', coverage:'自費', note:'台灣已上市或可近性需依藥證/院內採購確認；健保以正式條文為準。'}
    ],
    note: '請確認報告為 NTRK fusion，而非 NTRK point mutation。'
  },
  {
    priority: 120,
    title: 'HER2 / ERBB2 alteration',
    badge: 'HER2',
    match: ctx => reportHas(ctx, /HER\s*2|ERBB2/i, /(MUTATION|EX(?:ON)?\s*20|INS|INSERTION|AMPLIFICATION|V777|Y772|S310|突變|插入|擴增)/i),
    drugs: [
      {name:'Trastuzumab deruxtecan', coverage:'自費', note:'Enhertu 台灣藥證包含非小細胞肺癌相關適應症；肺癌 NGS HER2 alteration 需確認 mutation / IHC / ISH 條件。'}
    ],
    note: 'NGS ERBB2 amplification 與 HER2 mutation 的適應症條件不同，建議補 IHC/ISH 或依仿單條件確認。'
  }
];

window.ngsFallbackTargets = [
  {
    priority: 1010,
    title: 'EGFR alteration（需補 subtype）',
    badge: 'EGFR',
    match: ctx => geneMentioned(ctx, /EGFR/i),
    drugs: [
      {name:'請確認 EGFR subtype', coverage:'需確認', note:'del19/L858R、exon20 insertion、T790M、G719X/S768I/L861Q 對應治療與健保條件不同。'}
    ],
    note: '請補完整 variant / HGVS，例如 exon 19 deletion、L858R、A763_Y764ins、T790M 或 S768I。'
  },
  {
    priority: 1020,
    title: 'ALK alteration（需確認 fusion / rearrangement）',
    badge: 'ALK',
    match: ctx => geneMentioned(ctx, /\bALK\b/i),
    drugs: [
      {name:'若為 ALK fusion / rearrangement：ALK TKI', coverage:'需確認', note:'ALK 陽性晚期 NSCLC 可依條件使用 lorlatinib、alectinib、brigatinib、ceritinib 或 crizotinib；需確認為 ALK rearrangement。'}
    ],
    note: '若報告只寫 ALK mutation 或 VUS，不能直接套用 ALK fusion 用藥路徑。'
  },
  {
    priority: 1030,
    title: 'ROS1 alteration（需確認 fusion / rearrangement）',
    badge: 'ROS1',
    match: ctx => geneMentioned(ctx, /ROS\s*1|ROS1/i),
    drugs: [
      {name:'若為 ROS1 fusion / rearrangement：ROS1 TKI', coverage:'需確認', note:'Crizotinib / entrectinib 第一線可用；repotrectinib 限 crizotinib 或 entrectinib 治療中惡化後。'}
    ],
    note: '若僅為 IHC positive 或不完整文字，請確認 NGS fusion partner 或 rearrangement 結果。'
  },
  {
    priority: 1040,
    title: 'MET alteration（需確認 exon14 skipping）',
    badge: 'MET',
    match: ctx => geneMentioned(ctx, /\bMET\b/i),
    drugs: [
      {name:'若為 MET exon14 skipping：Tepotinib', coverage:'需確認', note:'健保給付重點是 MET exon14 skipping mutation；MET amplification 或一般 MET mutation 不等同。'}
    ],
    note: '請確認報告是否寫 exon 14 skipping、splice site、METex14 或跳讀。'
  },
  {
    priority: 1050,
    title: 'RET alteration（需確認 fusion）',
    badge: 'RET',
    match: ctx => geneMentioned(ctx, /\bRET\b/i),
    drugs: [
      {name:'若為 RET fusion：RET TKI', coverage:'需確認', note:'NSCLC 用藥路徑需 RET fusion / rearrangement；單純 RET point mutation 不等同。'}
    ],
    note: '請確認 fusion partner，例如 KIF5B-RET、CCDC6-RET，或報告是否明確寫 RET fusion/rearrangement。'
  },
  {
    priority: 1060,
    title: 'KRAS alteration（需確認 G12C）',
    badge: 'KRAS',
    match: ctx => geneMentioned(ctx, /\bKRAS\b/i),
    drugs: [
      {name:'若為 KRAS G12C：Sotorasib', coverage:'需確認', note:'KRAS 標靶主要限 G12C；G12D、G12V、G13D 等不能直接套用 G12C 標靶。'}
    ],
    note: '請補完整 amino acid change，例如 G12C。'
  },
  {
    priority: 1070,
    title: 'BRAF alteration（需確認 V600E）',
    badge: 'BRAF',
    match: ctx => geneMentioned(ctx, /\bBRAF\b/i),
    drugs: [
      {name:'若為 BRAF V600E：Dabrafenib + Trametinib', coverage:'需確認', note:'BRAF 標靶路徑通常需 V600E/V600 activating mutation；non-V600 需個案評估。'}
    ],
    note: '請補完整 variant，例如 V600E。'
  },
  {
    priority: 1080,
    title: 'NTRK alteration（需確認 fusion）',
    badge: 'NTRK',
    match: ctx => geneMentioned(ctx, /NTRK\s*[123]?|TRK/i),
    drugs: [
      {name:'若為 NTRK fusion：Larotrectinib', coverage:'需確認', note:'健保與治療重點是 NTRK gene fusion；單純 NTRK mutation 或 VUS 不等同。'}
    ],
    note: '請確認是否有 fusion partner，例如 ETV6-NTRK3、TPM3-NTRK1，或報告明確寫 NTRK fusion/rearrangement。'
  },
  {
    priority: 1090,
    title: 'HER2 / ERBB2 alteration（需確認型態）',
    badge: 'HER2',
    match: ctx => geneMentioned(ctx, /HER\s*2|ERBB2/i),
    drugs: [
      {name:'若為 ERBB2 activating mutation 或 HER2 過度表現：Trastuzumab deruxtecan', coverage:'需確認', note:'HER2 mutation、amplification、IHC/ISH positive 的適應症條件不同，需回報告確認。'}
    ],
    note: '請補 mutation / amplification / IHC / ISH 結果，例如 ERBB2 exon20 insertion 或 HER2 IHC 3+。'
  }
];
