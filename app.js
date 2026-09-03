const STORAGE_KEY = "evil-hunter-calculator-state-v2";
const LEGACY_PROFILE_KEY = "evil-hunter-damage-profile";
const STATE_VERSION = 2;

const defaultProfile = {
  measuredAttack: 107543896,
  baseAttack: 933.75,
  weaponAttack: 1916205,
  weaponSpeed: 2.2,
  fury: 13,
  grade: "U+",
  job: "버서커",
  victoryRank: "1~3",
  dungeonFloor: 414,
  runeAttack: 34,
  gearAttack: 171,
  runeCritDamage: 38,
  gearCritDamage: 610,
  runeCrit: 16,
  gearCrit: 48,
  unionAttack: 15,
  unionAttackSpeed: 5,
  unionCrit: 5,
  buildingMove: 50,
  buildingCritDamage: 65,
  buildingAttack: 65,
  costumeMove: 60,
  costumeCritDamage: 6,
  costumeAttack: 6,
  collectionCrit: 17,
  collectionCritDamage: 130.5,
  collectionAttack: 110.4,
  collectionBoss: 71,
  collectionLord: 15,
  collectionDemon: 5,
  collectionUndead: 5,
  collectionAnimal: 5,
  sealMove: 20,
  sealAttack: 16,
  townPetCritDamage: 16,
  townPetAttack: 26,
  ridingMove: 75,
  ridingAttackSpeed: 12,
  ridingCrit: 12,
  ridingCritDamage: 40,
  ridingAttack: 18,
  ridingMonster: 40,
  fairyAttack: 6,
  personalityMove: 0,
  personalityAttackSpeed: 0,
  personalityCrit: 0,
  personalityAttack: 0,
  statAttack: 30,
  statAttackSpeed: 30,
  statCrit: 6,
  naturalCrit: 1,
  secretMove: 15,
  secretAttackSpeed: 10,
  secretCrit: 10,
  secretAttack: 15,
  quickening: 0,
  runeMove: 17,
  runeAttackSpeed: 16,
  runeBoss: 0,
  runeLord: 38,
  runeDemon: 0,
  runeUndead: 0,
  runeAnimal: 0,
  gearMove: 74,
  gearAttackSpeed: 16,
  gearBoss: 0,
  gearLord: 270,
  gearDemon: 0,
  gearUndead: 0,
  gearAnimal: 0,
  gearMonster: 0,
  gearHunter: 5,
  gearSpirit: 55,
  virtueMonster: 0,
  sacredAttack: 90,
  heroAttack: 50,
  heroCritDamage: 0,
  ampA: [
    { name: "강철 고삐", percent: 10, enabled: true, baseAttack: false, cap: 0 },
    { name: "용의 가호", percent: 20, enabled: false, baseAttack: false, cap: 0 },
    { name: "질풍", percent: 10, enabled: false, baseAttack: false, cap: 300 },
    { name: "진질풍", percent: 10, enabled: true, baseAttack: true, cap: 400 },
  ],
  ampB: [
    { name: "신성 고삐", percent: 0, enabled: false, baseAttack: false },
    { name: "배틀샤우트", percent: 0, enabled: false, baseAttack: false },
    { name: "직접 입력", percent: 0, enabled: false, baseAttack: false },
  ],
  ampC: [
    { name: "저주의 고삐", percent: 0, enabled: false, baseAttack: false },
    { name: "직접 입력", percent: 0, enabled: false, baseAttack: false },
    { name: "직접 입력", percent: 0, enabled: false, baseAttack: false },
  ],
  ampD: [
    { name: "직접 입력 1", percent: 0, enabled: false, baseAttack: false },
    { name: "직접 입력 2", percent: 0, enabled: false, baseAttack: false },
    { name: "직접 입력 3", percent: 0, enabled: false, baseAttack: false },
    { name: "직접 입력 4", percent: 0, enabled: false, baseAttack: false },
  ],
};

let profile = structuredClone(defaultProfile);
let latestResult = null;

const fixed = {
  unionAttack: 15, unionAttackSpeed: 5, unionCrit: 5,
  buildingMove: 50, buildingCritDamage: 65, buildingAttack: 65,
  costumeMove: 60, costumeCritDamage: 6,
  collectionCrit: 17, collectionCritDamage: 130.5, collectionAttack: 110.4,
  collectionBoss: 71, collectionLord: 15, collectionDemon: 5, collectionUndead: 5, collectionAnimal: 5,
  sealMove: 20, sealAttack: 16,
  townPetCritDamage: 16, townPetAttack: 26,
  ridingMove: 75, ridingAttackSpeed: 12, ridingCrit: 12, ridingCritDamage: 40, ridingAttack: 18, ridingAnimal: 40,
  fairyAttack: 6,
  statAttack: 30, statAttackSpeed: 30, statCrit: 6, naturalCrit: 1,
  secretMove: 15, secretAttackSpeed: 10, secretCrit: 10, secretAttack: 15,
  quickening: 0,
  runeMove: 17, runeAttackSpeed: 16, runeLord: 38,
  gearMove: 74, gearAttackSpeed: 16, gearLord: 270, gearHunter: 5, gearSpirit: 55,
  sacredAttack: 90, heroAttack: 50, heroCritDamage: 0,
};

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function gradeStats(grade) {
  const attack = { H: 3, "H+": 4, L: 5, "L+": 6, U: 7, "U+": 8 }[grade] ?? 0;
  const move = ["H", "H+"].includes(grade) ? 10 : ["L", "L+"].includes(grade) ? 20 : ["U", "U+"].includes(grade) ? 30 : 0;
  return { attack, move };
}

function amplificationEffect(entry, movement) {
  if (!entry?.enabled) return 0;
  if (entry.cap) return Math.min(movement, entry.cap) * num(entry.percent) / 10000;
  return num(entry.percent) / 100;
}

function sumAmpGroup(entries, movement) {
  return (entries || []).reduce((total, entry) => {
    const effect = amplificationEffect(entry, movement);
    total.damage += effect;
    if (entry.baseAttack) total.attack += effect;
    return total;
  }, { damage: 1, attack: 1 });
}

function productAmpGroup(entries, movement) {
  return (entries || []).reduce((total, entry) => {
    const effect = amplificationEffect(entry, movement);
    total.damage *= 1 + effect;
    if (entry.baseAttack) total.attack *= 1 + effect;
    return total;
  }, { damage: 1, attack: 1 });
}

function calculate(p) {
  const s = { ...fixed, ...p };
  const grade = gradeStats(p.grade);
  const victoryAttack = { "1~3": 16, "4~10": 12, "11~20": 8 }[p.victoryRank] ?? 0;
  const victoryBoss = { "1~3": 10, "4~10": 5 }[p.victoryRank] ?? 0;
  const dungeonAttack = Math.max(0, (num(p.dungeonFloor) - 125) * 0.5);
  const classCrit = ["버서커", "팔라딘", "다크나이트"].includes(p.job) ? 3 : 6;

  const fairyCoefficient = 1 + num(s.fairyAttack) / 100;
  const accountCoefficient = 1 + (num(s.costumeAttack) + num(s.collectionAttack) + num(s.sealAttack) + num(s.ridingAttack)) / 100;
  const hunterCoefficient = 1 + (
    (num(s.unionAttack) - 10) + grade.attack + num(s.personalityAttack) + num(s.statAttack) + num(s.secretAttack) +
    num(s.runeAttack) + num(s.gearAttack) + num(s.sacredAttack) + num(s.heroAttack)
  ) / 100;
  const townCoefficient = ((num(s.unionAttack) - 5) + num(s.buildingAttack) + num(s.townPetAttack)) / 100;
  const progressCoefficient = 1 + (victoryAttack + dungeonAttack) / 100;
  const pvpAttackCoefficient = fairyCoefficient * accountCoefficient * hunterCoefficient;
  const pveAttackCoefficient = fairyCoefficient * accountCoefficient * (hunterCoefficient + townCoefficient) * progressCoefficient;

  const movementPvp = num(s.costumeMove) + num(s.sealMove) + num(s.ridingMove) + grade.move + num(s.personalityMove) + num(s.secretMove) + num(s.runeMove) + num(s.gearMove);
  const movementPve = movementPvp + num(s.buildingMove);
  const aPvp = sumAmpGroup(p.ampA, movementPvp);
  const aPve = sumAmpGroup(p.ampA, movementPve);
  const bPvp = sumAmpGroup(p.ampB, movementPvp);
  const bPve = sumAmpGroup(p.ampB, movementPve);
  const cPvp = sumAmpGroup(p.ampC, movementPvp);
  const cPve = sumAmpGroup(p.ampC, movementPve);
  const dPvp = productAmpGroup(p.ampD, movementPvp);
  const dPve = productAmpGroup(p.ampD, movementPve);
  const ampDamagePvp = aPvp.damage * bPvp.damage * cPvp.damage * dPvp.damage;
  const ampDamagePve = aPve.damage * bPve.damage * cPve.damage * dPve.damage;
  const ampAttackPvp = aPvp.attack * bPvp.attack * cPvp.attack * dPvp.attack;
  const ampAttackPve = aPve.attack * bPve.attack * cPve.attack * dPve.attack;

  const furyCoefficient = num(p.fury) > 0 ? 1.2 + 0.18 * num(p.fury) : 0;
  const statSpeed = num(s.unionAttackSpeed) + num(s.ridingAttackSpeed) + num(s.personalityAttackSpeed) + num(s.statAttackSpeed) + num(s.secretAttackSpeed);
  const gearSpeed = num(s.runeAttackSpeed) + num(s.gearAttackSpeed);
  const rawInterval = num(p.weaponSpeed) * (1 - statSpeed / 100 - gearSpeed / 100) / (1 + num(s.quickening) / 100 + furyCoefficient);
  const attackInterval = Math.max(0.25, rawInterval);
  const actionGap = num(p.fury) > 0 ? attackInterval : Math.max(0.5, attackInterval);

  const commonWeaponTerm = num(p.weaponAttack) + 2 * num(p.baseAttack) * num(p.weaponSpeed);
  const pveAttack = commonWeaponTerm * pveAttackCoefficient * ampAttackPve;
  const pvpAttack = commonWeaponTerm * pvpAttackCoefficient * ampAttackPvp;
  const pveDps = pveAttack / attackInterval;
  const pvpDps = pvpAttack / attackInterval;

  const baseCritDamage = 1.75 + (
    num(s.collectionCritDamage) + num(s.ridingCritDamage) + num(s.runeCritDamage) + num(s.gearCritDamage) + num(s.heroCritDamage)
  ) / 100;
  const pveCritDamage = baseCritDamage + (num(s.buildingCritDamage) + num(s.townPetCritDamage)) / 100;
  const pvpCritDamage = baseCritDamage + num(s.gearSpirit) / 100;
  const spiritCritDamage = baseCritDamage + (num(s.buildingCritDamage) + num(s.townPetCritDamage) + num(s.gearSpirit)) / 100;
  const critChance = Math.min(100,
    classCrit + num(s.naturalCrit) + num(s.unionCrit) + num(s.collectionCrit) + num(s.ridingCrit) + num(s.personalityCrit) + num(s.statCrit) + num(s.secretCrit) + Math.min(50, num(s.runeCrit) + num(s.gearCrit))
  );

  const ridingMonster = num(s.ridingMonster);
  const pvpSpecies = 1 + (num(s.collectionLord) + num(s.runeLord) + num(s.gearLord) + ridingMonster) / 100;
  const species = {
    PvP: pvpSpecies * (1 + num(s.gearHunter) / 100),
    보스: (1 + (victoryBoss + num(s.collectionBoss) + num(s.runeBoss) + num(s.gearBoss) + ridingMonster) / 100) * (1 + (num(s.virtueMonster) + num(s.gearMonster)) / 100),
    영장: pvpSpecies * (1 + (num(s.virtueMonster) + num(s.gearMonster)) / 100),
    악마: (1 + (num(s.collectionDemon) + num(s.runeDemon) + num(s.gearDemon) + ridingMonster) / 100) * (1 + num(s.gearMonster) / 100),
    언데드: (1 + (num(s.collectionUndead) + num(s.runeUndead) + num(s.gearUndead) + ridingMonster) / 100) * (1 + num(s.gearMonster) / 100),
    동물: (1 + (num(s.collectionAnimal) + num(s.runeAnimal) + num(s.gearAnimal) + ridingMonster) / 100) * (1 + num(s.gearMonster) / 100),
  };

  const rows = {};
  for (const target of Object.keys(species)) {
    const isPvp = target === "PvP";
    const attack = isPvp ? pvpAttack : pveAttack;
    const dps = isPvp ? pvpDps : pveDps;
    const critDamage = target === "영장" ? spiritCritDamage : isPvp ? pvpCritDamage : pveCritDamage;
    const damageAmp = isPvp ? ampDamagePvp : ampDamagePve;
    const attackAmp = isPvp ? ampAttackPvp : ampAttackPve;
    rows[target] = {
      crit: attack * critDamage * damageAmp / attackAmp * species[target],
      normal: attack * damageAmp / attackAmp * species[target],
      expected: dps * (1 + critChance / 100 * critDamage) * damageAmp / attackAmp * species[target],
    };
  }

  return {
    pveAttack, pvpAttack, pveDps, pvpDps, critChance, actionGap, rows,
    movementPve, movementPvp, ampDamagePve, ampDamagePvp, ampAttackPve, ampAttackPvp,
  };
}

function formatNumber(value, unit = 1) {
  const scaled = num(value) / unit;
  const maximumFractionDigits = unit === 1 ? 0 : scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits }).format(scaled);
}

function render() {
  latestResult = calculate(profile);
  const unit = num(document.querySelector("#display-unit").value) || 1;
  document.querySelector("#pve-attack").textContent = formatNumber(latestResult.pveAttack);
  document.querySelector("#pvp-attack").textContent = formatNumber(latestResult.pvpAttack);
  document.querySelector("#crit-chance").textContent = `${formatNumber(latestResult.critChance)}%`;
  document.querySelector("#action-gap").textContent = `${latestResult.actionGap.toFixed(2)}초`;
  document.querySelector("#hero-damage").textContent = formatNumber(latestResult.rows.보스.expected, unit);

  const targets = ["PvP", "보스", "영장", "악마", "언데드", "동물"];
  document.querySelector("#damage-table").innerHTML = `
    <div class="damage-row is-head"><span>대상</span><span>치명타</span><span>일반</span><span>기대 화력</span></div>
    ${targets.map((target) => {
      const row = latestResult.rows[target];
      return `<div class="damage-row"><b>${target}</b><span>${formatNumber(row.crit, unit)}</span><span>${formatNumber(row.normal, unit)}</span><span class="accent">${formatNumber(row.expected, unit)}</span></div>`;
    }).join("")}
  `;
}

function renderAmplificationEditor() {
  const labels = {
    ampA: ["그룹 A", "개인 버프 · 합산"],
    ampB: ["그룹 B", "파티 버프 · 합산"],
    ampC: ["그룹 C", "필요 시 사용 · 합산"],
    ampD: ["개별 증폭", "각 항목을 개별 곱산"],
  };
  const editor = document.querySelector("#amplification-editor");
  editor.innerHTML = Object.entries(labels).map(([group, copy]) => `
    <section class="amp-group">
      <div class="amp-group-title"><b>${copy[0]}</b><small>${copy[1]}</small></div>
      ${profile[group].map((entry, index) => `
        <div class="amp-row">
          <input type="text" aria-label="${copy[0]} ${index + 1} 이름" data-amp-group="${group}" data-amp-index="${index}" data-amp-field="name" value="${escapeHtml(entry.name)}">
          <input type="number" aria-label="${escapeHtml(entry.name)} 퍼센트" data-amp-group="${group}" data-amp-index="${index}" data-amp-field="percent" value="${entry.percent}" step="0.1">
          <label class="toggle-field"><input type="checkbox" data-amp-group="${group}" data-amp-index="${index}" data-amp-field="enabled" ${entry.enabled ? "checked" : ""}>장착</label>
          <label class="toggle-field"><input type="checkbox" data-amp-group="${group}" data-amp-index="${index}" data-amp-field="baseAttack" ${entry.baseAttack ? "checked" : ""}>초공 반영</label>
        </div>
      `).join("")}
    </section>
  `).join("");

  editor.querySelectorAll("[data-amp-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const entry = profile[input.dataset.ampGroup][Number(input.dataset.ampIndex)];
      entry[input.dataset.ampField] = input.type === "checkbox" ? input.checked : input.type === "number" ? num(input.value) : input.value;
      render();
      queueAutoSave();
    });
  });
}

const compareFields = [
  ["weaponAttack", "무기 공격력"], ["weaponSpeed", "무기 공격속도"],
  ["baseAttack", "고유 공격력"], ["fury", "퓨리"],
  ["runeAttack", "룬 공격력 %"], ["gearAttack", "장비 공격력 %"],
  ["runeCritDamage", "룬 치명타 피해 %"], ["gearCritDamage", "장비 치명타 피해 %"],
  ["runeCrit", "룬 치명타 확률 %"], ["gearCrit", "장비 치명타 확률 %"],
  ["gearLord", "장비 영장 피해 %"], ["gearSpirit", "영피 %"],
];

const compareProfiles = {
  a: structuredClone(defaultProfile),
  b: { ...structuredClone(defaultProfile), gearAttack: 190, gearCritDamage: 650 },
};

function renderComparison() {
  ["a", "b"].forEach((side) => {
    const card = document.querySelector(`[data-compare="${side}"]`);
    const fields = card.querySelector(".compare-fields");
    if (!fields.dataset.ready) {
      fields.innerHTML = compareFields.map(([key, label]) => `
        <label class="field"><span>${label}</span><input type="number" step="0.1" data-compare-side="${side}" data-compare-key="${key}"></label>
      `).join("");
      fields.dataset.ready = "true";
      fields.querySelectorAll("[data-compare-key]").forEach((input) => {
        input.addEventListener("input", () => {
          compareProfiles[side][input.dataset.compareKey] = num(input.value);
          renderComparison();
          queueAutoSave();
        });
      });
    }
    fields.querySelectorAll("[data-compare-key]").forEach((input) => { input.value = compareProfiles[side][input.dataset.compareKey]; });
    const result = calculate(compareProfiles[side]);
    document.querySelector(`#compare-result-${side}`).innerHTML = `
      <article><span>PvE 공격력</span><strong>${formatNumber(result.pveAttack)}</strong></article>
      <article><span>보스 기대 화력</span><strong>${formatNumber(result.rows.보스.expected)}</strong></article>
      <article><span>PvP 기대 화력</span><strong>${formatNumber(result.rows.PvP.expected)}</strong></article>
      <article><span>치명타 확률</span><strong>${result.critChance.toFixed(0)}%</strong></article>
    `;
  });

  const a = calculate(compareProfiles.a);
  const b = calculate(compareProfiles.b);
  const differences = [
    ["PvE 공격력 변화", a.pveAttack, b.pveAttack],
    ["보스 기대 화력 변화", a.rows.보스.expected, b.rows.보스.expected],
    ["PvP 기대 화력 변화", a.rows.PvP.expected, b.rows.PvP.expected],
  ];
  document.querySelector("#comparison-summary").innerHTML = differences.map(([label, left, right]) => {
    const delta = left ? (right / left - 1) * 100 : 0;
    const className = delta > 0 ? "positive" : delta < 0 ? "negative" : "";
    return `<article><span>${label}</span><strong class="${className}">${delta > 0 ? "+" : ""}${delta.toFixed(2)}%</strong></article>`;
  }).join("");
}

const defaultDefense = {
  baseDefense: 2000,
  slots: [
    { name: "투구", options: [{ label: "고리", value: 0, enabled: false }, { label: "심뚝", value: 0, enabled: false }, { label: "테스트1", value: 1248864, enabled: true }] },
    { name: "갑옷", options: [{ label: "흡갑", value: 0, enabled: false }, { label: "심갑", value: 0, enabled: false }, { label: "테스트1", value: 1078178, enabled: true }] },
    { name: "장갑", options: [{ label: "직접 입력", value: 0, enabled: false }, { label: "심장", value: 0, enabled: false }, { label: "테스트1", value: 920206, enabled: true }] },
    { name: "신발", options: [{ label: "불굴", value: 0, enabled: false }, { label: "심신", value: 0, enabled: false }, { label: "테스트1", value: 707851, enabled: true }] },
  ],
  stats: { fairy: 6, union: 15, stat: 20, grade: 8, building: 65, collection: 76, townPet: 10, riding: 24, secret: 15, rune: 0, gear: 0, dungeonFloor: 355 },
};
let defenseState = structuredClone(defaultDefense);

function renderDefense() {
  const equipment = document.querySelector("#defense-equipment");
  if (!equipment.dataset.ready) {
    equipment.innerHTML = defenseState.slots.map((slot, slotIndex) => `
      <div class="equipment-slot"><b>${slot.name}</b><div class="equipment-options">
        ${slot.options.map((option, optionIndex) => `
          <label class="equipment-option">
            <input type="checkbox" data-defense-slot="${slotIndex}" data-defense-option="${optionIndex}" data-defense-field="enabled">
            <input type="text" aria-label="${slot.name} 장비 이름" data-defense-slot="${slotIndex}" data-defense-option="${optionIndex}" data-defense-field="label">
            <input type="number" aria-label="${slot.name} 방어력" data-defense-slot="${slotIndex}" data-defense-option="${optionIndex}" data-defense-field="value">
          </label>
        `).join("")}
      </div></div>
    `).join("");
    equipment.dataset.ready = "true";
    equipment.querySelectorAll("[data-defense-field]").forEach((input) => {
      input.addEventListener("input", () => {
        const option = defenseState.slots[Number(input.dataset.defenseSlot)].options[Number(input.dataset.defenseOption)];
        option[input.dataset.defenseField] = input.type === "checkbox" ? input.checked : input.type === "number" ? num(input.value) : input.value;
        renderDefense();
        queueAutoSave();
      });
    });
  }
  equipment.querySelectorAll("[data-defense-field]").forEach((input) => {
    const option = defenseState.slots[Number(input.dataset.defenseSlot)].options[Number(input.dataset.defenseOption)];
    if (input.type === "checkbox") input.checked = option.enabled;
    else input.value = option[input.dataset.defenseField];
  });

  const statLabels = {
    baseDefense: "헌터 기본 방어력", fairy: "요정 %", union: "연합 %", stat: "스탯 %", grade: "등급 %", building: "건물 %",
    collection: "도감 %", townPet: "마을펫 %", riding: "라이딩 %", secret: "비법 %", rune: "룬 %", gear: "장비 %", dungeonFloor: "지하던전 층수",
  };
  const stats = document.querySelector("#defense-stats");
  if (!stats.dataset.ready) {
    stats.innerHTML = Object.entries(statLabels).map(([key, label]) => `<label class="field"><span>${label}</span><input type="number" step="0.1" data-defense-stat="${key}"></label>`).join("");
    stats.dataset.ready = "true";
    stats.querySelectorAll("[data-defense-stat]").forEach((input) => {
      input.addEventListener("input", () => {
        const key = input.dataset.defenseStat;
        if (key === "baseDefense") defenseState.baseDefense = num(input.value);
        else defenseState.stats[key] = num(input.value);
        renderDefense();
        queueAutoSave();
      });
    });
  }
  stats.querySelectorAll("[data-defense-stat]").forEach((input) => {
    input.value = input.dataset.defenseStat === "baseDefense" ? defenseState.baseDefense : defenseState.stats[input.dataset.defenseStat];
  });

  const equipmentTotal = defenseState.slots.flatMap((slot) => slot.options).filter((option) => option.enabled).reduce((sum, option) => sum + num(option.value), 0);
  const rawDefense = defenseState.baseDefense + equipmentTotal;
  const optionPercent = ["union", "stat", "grade", "building", "collection", "townPet", "riding", "secret", "rune", "gear"].reduce((sum, key) => sum + num(defenseState.stats[key]), 0);
  const dungeonPercent = Math.max(0, (num(defenseState.stats.dungeonFloor) - 125) * 0.5);
  const fairyMultiplier = 1 + num(defenseState.stats.fairy) / 100;
  const optionMultiplier = 1 + optionPercent / 100;
  const dungeonMultiplier = 1 + dungeonPercent / 100;
  const total = rawDefense * fairyMultiplier * optionMultiplier * dungeonMultiplier;
  document.querySelector("#defense-total").textContent = formatNumber(total);
  document.querySelector("#defense-breakdown").innerHTML = `
    <dt>깡방 합계</dt><dd>${formatNumber(rawDefense)}</dd>
    <dt>요정 계수</dt><dd>${fairyMultiplier.toFixed(2)}</dd>
    <dt>옵션 계수</dt><dd>${optionMultiplier.toFixed(2)}</dd>
    <dt>지하던전 계수</dt><dd>${dungeonMultiplier.toFixed(2)}</dd>
  `;
}

const verifierCoefficients = [113, 110, 106, 105, 103, 100, 99, 98, 95, 92, 91, 90];
let verifierDamages = [39004768, 39438156, ...Array(18).fill("")];
let uiState = { activeView: "calculator", displayUnit: "1", verifierError: "10" };
let persistenceTimer = null;

function mergeProfile(saved) {
  const merged = structuredClone(defaultProfile);
  if (!saved || typeof saved !== "object") return merged;
  Object.keys(merged).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(saved, key)) return;
    if (["ampA", "ampB", "ampC", "ampD"].includes(key) && Array.isArray(saved[key])) {
      merged[key] = merged[key].map((entry, index) => {
        const candidate = saved[key][index];
        if (!candidate || typeof candidate !== "object") return entry;
        return {
          ...entry,
          name: typeof candidate.name === "string" ? candidate.name : entry.name,
          percent: num(candidate.percent),
          enabled: Boolean(candidate.enabled),
          baseAttack: Boolean(candidate.baseAttack),
          ...(Object.prototype.hasOwnProperty.call(entry, "cap") ? { cap: num(candidate.cap ?? entry.cap) } : {}),
        };
      });
      return;
    }
    if (typeof merged[key] === "number") merged[key] = num(saved[key]);
    else if (typeof merged[key] === "string" && typeof saved[key] === "string") merged[key] = saved[key];
  });
  return merged;
}

function mergeDefense(saved) {
  const merged = structuredClone(defaultDefense);
  if (!saved || typeof saved !== "object") return merged;
  merged.baseDefense = num(saved.baseDefense ?? merged.baseDefense);
  if (saved.stats && typeof saved.stats === "object") {
    Object.keys(merged.stats).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(saved.stats, key)) merged.stats[key] = num(saved.stats[key]);
    });
  }
  if (Array.isArray(saved.slots)) {
    merged.slots = merged.slots.map((slot, slotIndex) => {
      const candidateSlot = saved.slots[slotIndex];
      if (!candidateSlot || typeof candidateSlot !== "object") return slot;
      return {
        ...slot,
        options: slot.options.map((option, optionIndex) => {
          const candidate = candidateSlot.options?.[optionIndex];
          if (!candidate || typeof candidate !== "object") return option;
          return {
            label: typeof candidate.label === "string" ? candidate.label : option.label,
            value: num(candidate.value),
            enabled: Boolean(candidate.enabled),
          };
        }),
      };
    });
  }
  return merged;
}

function applyStoredState(saved) {
  if (!saved || typeof saved !== "object") throw new Error("올바른 백업 데이터가 아닙니다.");
  profile = mergeProfile(saved.profile);
  compareProfiles.a = mergeProfile(saved.comparison?.a ?? profile);
  compareProfiles.b = mergeProfile(saved.comparison?.b ?? profile);
  defenseState = mergeDefense(saved.defense);
  if (Array.isArray(saved.verifier?.damages)) {
    verifierDamages = Array.from({ length: 20 }, (_, index) => {
      const value = saved.verifier.damages[index];
      return value === "" || value == null ? "" : num(value);
    });
  }
  const requestedView = typeof saved.ui?.activeView === "string" ? saved.ui.activeView : "calculator";
  const validViews = ["calculator", "base-settings", "comparison", "defense", "verifier", "storage"];
  uiState = {
    activeView: validViews.includes(requestedView) ? requestedView : "calculator",
    displayUnit: ["1", "1000", "1000000", "1000000000"].includes(String(saved.ui?.displayUnit)) ? String(saved.ui.displayUnit) : "1",
    verifierError: ["10", "100", "1000"].includes(String(saved.verifier?.error ?? saved.ui?.verifierError)) ? String(saved.verifier?.error ?? saved.ui?.verifierError) : "10",
  };
}

function currentAppState() {
  if (typeof document !== "undefined") {
    uiState.displayUnit = document.querySelector("#display-unit")?.value ?? uiState.displayUnit;
    uiState.verifierError = document.querySelector("#verifier-error")?.value ?? uiState.verifierError;
    uiState.activeView = document.querySelector("[data-view-target].is-active")?.dataset.viewTarget ?? uiState.activeView;
  }
  return {
    version: STATE_VERSION,
    app: "이블헌터타이쿤 데미지 계산기",
    savedAt: new Date().toISOString(),
    profile,
    comparison: compareProfiles,
    defense: defenseState,
    verifier: { damages: verifierDamages, error: uiState.verifierError },
    ui: uiState,
  };
}

function updateStorageStatus(copy, isError = false) {
  const status = document.querySelector("#storage-status");
  const time = document.querySelector("#storage-time");
  if (!status || !time) return;
  status.textContent = isError ? "자동 저장 실패" : "자동 저장 완료";
  time.textContent = copy;
}

function saveAllState() {
  if (typeof localStorage === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentAppState()));
    const savedTime = new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
    updateStorageStatus(`마지막 저장: ${savedTime}`);
    return true;
  } catch {
    updateStorageStatus("브라우저 저장 공간을 사용할 수 없습니다. 백업 파일을 이용해 주세요.", true);
    return false;
  }
}

function queueAutoSave() {
  if (typeof window === "undefined") return;
  window.clearTimeout(persistenceTimer);
  const status = document.querySelector("#storage-status");
  if (status) status.textContent = "변경사항 저장 중…";
  persistenceTimer = window.setTimeout(saveAllState, 180);
}

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      applyStoredState(JSON.parse(saved));
      return true;
    }
    const legacyProfile = localStorage.getItem(LEGACY_PROFILE_KEY);
    if (legacyProfile) {
      applyStoredState({ profile: JSON.parse(legacyProfile), comparison: {}, defense: defaultDefense, verifier: {} });
      return true;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return false;
}

function applyUiState() {
  const unit = document.querySelector("#display-unit");
  const error = document.querySelector("#verifier-error");
  if (unit) unit.value = uiState.displayUnit;
  if (error) error.value = uiState.verifierError;
  document.querySelectorAll("[data-view-target]").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.viewTarget === uiState.activeView));
  document.querySelectorAll("[data-view]").forEach((view) => view.classList.toggle("is-active", view.dataset.view === uiState.activeView));
}

function syncProfileInputs() {
  document.querySelectorAll("[data-key]").forEach((input) => { input.value = profile[input.dataset.key]; });
}

function refreshAllViews() {
  syncProfileInputs();
  applyUiState();
  renderAmplificationEditor();
  render();
  renderComparison();
  renderDefense();
  renderVerifier();
}

function showStorageMessage(type, title, copy) {
  const message = document.querySelector("#storage-message");
  if (!message) return;
  message.classList.toggle("is-success", type === "success");
  message.classList.toggle("is-error", type === "error");
  message.innerHTML = `<b>${escapeHtml(title)}</b><span>${escapeHtml(copy)}</span>`;
}

function renderVerifier() {
  const inputs = document.querySelector("#verifier-inputs");
  if (!inputs.dataset.ready) {
    inputs.innerHTML = verifierDamages.map((_, index) => `<label class="verifier-input"><span>${index + 1}</span><input type="number" min="0" inputmode="numeric" data-verifier-index="${index}" placeholder="실제 데미지"></label>`).join("");
    inputs.dataset.ready = "true";
    inputs.querySelectorAll("[data-verifier-index]").forEach((input) => {
      input.addEventListener("input", () => {
        verifierDamages[Number(input.dataset.verifierIndex)] = input.value === "" ? "" : num(input.value);
        renderVerifier();
        queueAutoSave();
      });
    });
  }
  inputs.querySelectorAll("[data-verifier-index]").forEach((input) => { input.value = verifierDamages[Number(input.dataset.verifierIndex)]; });

  const error = num(document.querySelector("#verifier-error").value) || 10;
  const values = verifierDamages.filter((value) => num(value) > 0);
  const counts = new Map();
  values.forEach((damage) => verifierCoefficients.forEach((coefficient) => {
    const candidate = Math.trunc(num(damage) / coefficient / error);
    counts.set(candidate, (counts.get(candidate) || 0) + 1);
  }));
  const candidates = [...counts.entries()].filter(([, count]) => count >= 2).sort((a, b) => b[0] - a[0]).slice(0, 20);
  document.querySelector("#verifier-results").innerHTML = candidates.length ? candidates.map(([candidate, count], index) => `
    <article class="candidate-card"><span class="candidate-rank">${index + 1}</span><div><b>${formatNumber(candidate)}</b><small>113 기준 복원값 ${formatNumber(candidate * 113)}</small></div><strong>${count}회 반복</strong></article>
  `).join("") : `<div class="candidate-empty"><b>공통 후보가 없습니다</b><span>실제 데미지를 2개 이상 입력해 주세요.</span></div>`;
}

function hydrateForm() {
  document.querySelectorAll("[data-key]").forEach((input) => {
    const key = input.dataset.key;
    input.value = profile[key];
    input.addEventListener("input", () => {
      profile[key] = input.type === "number" ? num(input.value) : input.value;
      render();
      queueAutoSave();
    });
  });
}

if (typeof document !== "undefined") {
const ACCESS_CODE_HASH = "f6f2ea8f45d8a057c9566a33f99474da2e5c6a6604d736121650e2730c6fb0a3";

async function hashAccessCode(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function unlockCalculator() {
  document.querySelector("#access-gate").classList.add("is-hidden");
  document.querySelector("#app-shell").classList.remove("is-locked");
  document.querySelector("#app-shell").setAttribute("aria-hidden", "false");
  document.body.classList.remove("is-gated");
}

function lockCalculator() {
  try { sessionStorage.removeItem("hunter-calculator-access"); } catch {}
  const gate = document.querySelector("#access-gate");
  const shell = document.querySelector("#app-shell");
  gate.classList.remove("is-hidden");
  shell.classList.add("is-locked");
  shell.setAttribute("aria-hidden", "true");
  document.body.classList.add("is-gated");
  document.querySelector("#access-code").value = "";
  document.querySelector("#access-error").textContent = "";
  window.setTimeout(() => document.querySelector("#access-code").focus(), 50);
}

let accessGranted = false;
try { accessGranted = sessionStorage.getItem("hunter-calculator-access") === "granted"; } catch {}
if (accessGranted) unlockCalculator();
else lockCalculator();

document.querySelector("#access-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.querySelector("#access-code");
  const error = document.querySelector("#access-error");
  const enteredHash = await hashAccessCode(input.value);
  if (enteredHash === ACCESS_CODE_HASH) {
    try { sessionStorage.setItem("hunter-calculator-access", "granted"); } catch {}
    error.textContent = "";
    unlockCalculator();
    document.querySelector("[data-view-target].is-active")?.focus();
    return;
  }
  error.textContent = "코드가 맞지 않습니다. 다시 확인해 주세요.";
  input.select();
});

document.querySelector("#lock-app").addEventListener("click", lockCalculator);

document.querySelectorAll("[data-view-target]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-view-target]").forEach((tab) => tab.classList.toggle("is-active", tab === button));
    document.querySelectorAll("[data-view]").forEach((view) => view.classList.toggle("is-active", view.dataset.view === button.dataset.viewTarget));
    uiState.activeView = button.dataset.viewTarget;
    queueAutoSave();
  });
});

document.querySelector("#reset-main").addEventListener("click", () => {
  profile = structuredClone(defaultProfile);
  document.querySelectorAll("[data-key]").forEach((input) => { input.value = profile[input.dataset.key]; });
  renderAmplificationEditor();
  render();
  queueAutoSave();
});
document.querySelector("#display-unit").addEventListener("change", () => {
  uiState.displayUnit = document.querySelector("#display-unit").value;
  render();
  queueAutoSave();
});
document.querySelector("#save-profile").addEventListener("click", () => {
  const button = document.querySelector("#save-profile");
  const original = button.textContent;
  button.textContent = saveAllState() ? "전체 저장됨 ✓" : "저장 실패";
  window.setTimeout(() => { button.textContent = original; }, 1200);
});
document.querySelector("#load-profile").addEventListener("click", () => {
  if (!loadSavedState()) {
    showStorageMessage("error", "불러올 내용이 없습니다", "먼저 계산기에 값을 입력하면 자동으로 저장됩니다.");
    return;
  }
  refreshAllViews();
  showStorageMessage("success", "자동 저장값을 불러왔습니다", "마지막으로 저장된 전체 계산기 상태가 복구되었습니다.");
});

document.querySelector("#copy-main-to-compare").addEventListener("click", () => {
  compareProfiles.a = structuredClone(profile);
  compareProfiles.b = structuredClone(profile);
  renderComparison();
  queueAutoSave();
});
document.querySelector("#reset-defense").addEventListener("click", () => {
  defenseState = structuredClone(defaultDefense);
  renderDefense();
  queueAutoSave();
});
document.querySelector("#verifier-error").addEventListener("change", () => {
  uiState.verifierError = document.querySelector("#verifier-error").value;
  renderVerifier();
  queueAutoSave();
});
document.querySelector("#reset-verifier").addEventListener("click", () => {
  verifierDamages = Array(20).fill("");
  renderVerifier();
  queueAutoSave();
});

document.querySelector("#export-backup").addEventListener("click", () => {
  const state = currentAppState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `evil-hunter-calculator-backup-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  saveAllState();
  showStorageMessage("success", "백업 파일을 만들었습니다", "다운로드 폴더에 JSON 파일이 저장되었습니다. 다른 기기에서 이 파일을 선택하면 복구할 수 있습니다.");
});

document.querySelector("#import-backup").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error("파일이 너무 큽니다.");
    const restored = JSON.parse(await file.text());
    if (restored.app !== "이블헌터타이쿤 데미지 계산기" && !restored.profile) throw new Error("계산기 백업 파일이 아닙니다.");
    applyStoredState(restored);
    refreshAllViews();
    saveAllState();
    showStorageMessage("success", "복구가 완료되었습니다", `${file.name}의 전체 내용을 불러왔습니다.`);
  } catch {
    showStorageMessage("error", "복구하지 못했습니다", "올바른 계산기 JSON 백업 파일인지 확인해 주세요.");
  } finally {
    input.value = "";
  }
});

function registerWebMcp() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  try {
    void Promise.resolve(context.registerTool({
      name: "calculate_hunter_damage",
      title: "헌터 데미지 계산",
      description: "현재 엑셀 기반 공식으로 핵심 공격 정보를 계산하고 PvE/PvP 결과를 반환합니다.",
      inputSchema: {
        type: "object",
        properties: {
          weaponAttack: { type: "number", minimum: 0 },
          weaponSpeed: { type: "number", exclusiveMinimum: 0 },
          baseAttack: { type: "number", minimum: 0 },
          fury: { type: "number", minimum: 0 },
          gearAttack: { type: "number" },
          gearCritDamage: { type: "number" },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        const candidate = { ...profile, ...(input || {}) };
        const result = calculate(candidate);
        return {
          pveAttack: Math.round(result.pveAttack),
          pvpAttack: Math.round(result.pvpAttack),
          bossExpectedDamage: Math.round(result.rows.보스.expected),
          pvpExpectedDamage: Math.round(result.rows.PvP.expected),
          criticalChancePercent: result.critChance,
          actionIntervalSeconds: result.actionGap,
        };
      },
    }));
  } catch {
    // 지원하지 않는 브라우저에서는 화면 계산기만 사용합니다.
  }
}

const restoredOnStartup = loadSavedState();
applyUiState();
hydrateForm();
renderAmplificationEditor();
render();
renderComparison();
renderDefense();
renderVerifier();
if (restoredOnStartup) updateStorageStatus("이 기기에 저장된 마지막 내용을 자동으로 불러왔습니다.");
else saveAllState();
registerWebMcp();
}

if (typeof module !== "undefined") {
  module.exports = { calculate, defaultProfile, defaultDefense };
}
