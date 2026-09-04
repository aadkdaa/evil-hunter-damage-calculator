const STORAGE_KEY = "evil-hunter-calculator-state-v3";
const LEGACY_PROFILE_KEY = "evil-hunter-damage-profile";
const STATE_VERSION = 5;

const BASE_SETTING_DEFAULTS = Object.freeze({
  victoryAttack: 12,
  victoryHealth: 6,
  victoryBoss: 5,
  unionHealth: 15,
  unionAttack: 15,
  unionDefense: 15,
  dungeonAttack: 135,
  dungeonDefense: 135,
  buildingAttack: 65,
  buildingHealth: 65,
  buildingDefense: 65,
  buildingMove: 50,
  buildingCritDamage: 65,
  collectionAttack: 69.4,
  collectionDefense: 66,
  collectionHealth: 133.1,
  collectionCritDamage: 76.5,
  collectionLord: 5,
  collectionDemon: 5,
  collectionUndead: 5,
  collectionBoss: 26,
  collectionAnimal: 5,
  artifactAttack: 12.5,
  artifactDefense: 11,
  artifactHealth: 21,
  artifactCritDamage: 18.75,
  artifactLord: 15.75,
  artifactDemon: 10.5,
  artifactUndead: 10.5,
  artifactBoss: 15.75,
  artifactAnimal: 10.5,
  artifactBerserkerAmp: 2.75,
  artifactPaladinAmp: 1.75,
  artifactRangerAmp: 1.75,
  artifactSorcererAmp: 1,
  artifactDarkKnightAmp: 1.75,
  townPetAttack: 20,
  townPetHealth: 14,
  townPetDefense: 10,
});
const BASE_SETTING_KEYS = new Set(Object.keys(BASE_SETTING_DEFAULTS));

const DAMAGE2_DEFAULTS = Object.freeze({
  weaponAttack: 1742004,
  weaponSpeed: 2,
  baseAttack: 1023.75,
  sacredAttack: 90,
  personalityAttack: 7,
  personalityMove: 7,
  heroAttack: 50,
  unionArenaAttack: 5,
  skillAttackAmp: 50,
  gustRate: 10,
  displayedAttack: 133905832,
  statHealth: 10,
  statAttack: 20,
  statDefense: 20,
  gradeMove: 20,
  gradeHealth: 6,
  gradeAttack: 6,
  gradeDefense: 6,
  costumeAttack: 6,
  costumeMove: 60,
  costumeHealth: 4,
  sealAttack: 16,
  sealMove: 20,
  ridingAttack: 38.15,
  ridingDefense: 18,
  ridingCritDamage: 60,
  ridingAllSpecies: 30,
  ridingHealth: 18,
  ridingDamageReduction: 6,
  ridingMove: 75,
  fairyAttack: 2,
  fairyDefense: 2,
  companionHealth: 0,
  improvementMonsterDamage: 30,
  secretHealth: 15,
  secretAttack: 15,
  secretDefense: 15,
  secretMove: 15,
  runeAttack: 28,
  runeMove: 16,
  runeBoss: 36,
  runeCritDamage: 31,
  gearAttack: 226,
  gearMove: 43,
  gearLord: 27,
  gearBoss: 348,
  gearCritDamage: 605,
  gearMonsterDamage: 35,
});

const DAMAGE2_SECTIONS = [
  { title: "무기", fields: [["weaponAttack", "무기 공격력", ""], ["weaponSpeed", "무기 공격속도", ""]] },
  { title: "공격력 계산값", fields: [["baseAttack", "헌터 고유공격력", ""], ["sacredAttack", "신강 공격력", "%"], ["personalityAttack", "성격 공격력", "%"], ["personalityMove", "성격 이동속도", "%"], ["heroAttack", "영웅스킬 공격력", "%"], ["unionArenaAttack", "연합 콜로세움 공격력", "%"], ["skillAttackAmp", "스킬 공격력 증폭", "%"], ["gustRate", "질풍 변환율", "%"], ["displayedAttack", "게임 표시 공격력", ""]] },
  { title: "헌터 스텟 등급 효과", fields: [["statAttack", "공격력", "%"], ["statDefense", "방어력", "%"], ["statHealth", "체력", "%"]] },
  { title: "헌터 등급 버프", fields: [["gradeAttack", "공격력", "%"], ["gradeDefense", "방어력", "%"], ["gradeHealth", "체력", "%"], ["gradeMove", "이동속도", "%"]] },
  { title: "코스튬 버프", fields: [["costumeAttack", "공격력", "%"], ["costumeHealth", "체력", "%"], ["costumeMove", "이동속도", "%"]] },
  { title: "인장 버프", fields: [["sealAttack", "공격력", "%"], ["sealMove", "이동속도", "%"]] },
  { title: "라이딩펫 버프", fields: [["ridingAttack", "공격력", "%"], ["ridingDefense", "방어력", "%"], ["ridingHealth", "체력", "%"], ["ridingCritDamage", "치명타 피해", "%"], ["ridingMove", "이동속도", "%"], ["ridingAllSpecies", "모든 종족 피해", "%"], ["ridingDamageReduction", "받는 피해 감소", "%"]] },
  { title: "요정 버프", fields: [["fairyAttack", "공격력", "%"], ["fairyDefense", "방어력", "%"]] },
  { title: "컴패 버프", fields: [["companionHealth", "체력", "%"]] },
  { title: "개량 옵션", fields: [["improvementMonsterDamage", "몬스터 피해", "%"]] },
  { title: "비법", fields: [["secretAttack", "공격력", "%"], ["secretDefense", "방어력", "%"], ["secretHealth", "체력", "%"], ["secretMove", "이동속도", "%"]] },
  { title: "룬", fields: [["runeAttack", "공격력", "%"], ["runeCritDamage", "치명타 피해", "%"], ["runeMove", "이동속도", "%"], ["runeBoss", "보스 피해", "%"]] },
  { title: "장비 옵션", fields: [["gearAttack", "전체 공격력", "%"], ["gearCritDamage", "치명타 피해", "%"], ["gearMove", "이동속도", "%"], ["gearLord", "영장 피해", "%"], ["gearBoss", "보스 피해", "%"], ["gearMonsterDamage", "몬스터 피해", "%"]] },
];

const defaultProfile = {
  ...BASE_SETTING_DEFAULTS,
  measuredAttack: 107543896,
  baseAttack: 933.75,
  weaponAttack: 1916205,
  weaponSpeed: 2.2,
  fury: 13,
  grade: "U+",
  job: "버서커",
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
  collectionCritDamage: 76.5,
  collectionAttack: 69.4,
  collectionBoss: 26,
  collectionLord: 5,
  collectionDemon: 5,
  collectionUndead: 5,
  collectionAnimal: 5,
  sealMove: 20,
  sealAttack: 16,
  townPetCritDamage: 16,
  townPetAttack: 20,
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
let damage2State = structuredClone(DAMAGE2_DEFAULTS);

const fixed = {
  unionAttack: 15, unionAttackSpeed: 5, unionCrit: 5,
  buildingMove: 50, buildingCritDamage: 65, buildingAttack: 65,
  costumeMove: 60, costumeCritDamage: 6,
  collectionCrit: 17, collectionCritDamage: 76.5, collectionAttack: 69.4,
  collectionBoss: 26, collectionLord: 5, collectionDemon: 5, collectionUndead: 5, collectionAnimal: 5,
  artifactAttack: 12.5, artifactCritDamage: 18.75,
  artifactBoss: 15.75, artifactLord: 15.75, artifactDemon: 10.5, artifactUndead: 10.5, artifactAnimal: 10.5,
  sealMove: 20, sealAttack: 16,
  townPetCritDamage: 16, townPetAttack: 20,
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
  const victoryAttack = num(s.victoryAttack);
  const victoryBoss = num(s.victoryBoss);
  const dungeonAttack = num(s.dungeonAttack);
  const classCrit = ["버서커", "팔라딘", "다크나이트"].includes(p.job) ? 3 : 6;

  const fairyCoefficient = 1 + num(s.fairyAttack) / 100;
  const accountCoefficient = 1 + (num(s.costumeAttack) + num(s.collectionAttack) + num(s.artifactAttack) + num(s.sealAttack) + num(s.ridingAttack)) / 100;
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
    num(s.collectionCritDamage) + num(s.artifactCritDamage) + num(s.ridingCritDamage) + num(s.runeCritDamage) + num(s.gearCritDamage) + num(s.heroCritDamage)
  ) / 100;
  const pveCritDamage = baseCritDamage + (num(s.buildingCritDamage) + num(s.townPetCritDamage)) / 100;
  const pvpCritDamage = baseCritDamage + num(s.gearSpirit) / 100;
  const spiritCritDamage = baseCritDamage + (num(s.buildingCritDamage) + num(s.townPetCritDamage) + num(s.gearSpirit)) / 100;
  const critChance = Math.min(100,
    classCrit + num(s.naturalCrit) + num(s.unionCrit) + num(s.collectionCrit) + num(s.ridingCrit) + num(s.personalityCrit) + num(s.statCrit) + num(s.secretCrit) + Math.min(50, num(s.runeCrit) + num(s.gearCrit))
  );

  const ridingMonster = num(s.ridingMonster);
  const pvpSpecies = 1 + (num(s.collectionLord) + num(s.artifactLord) + num(s.runeLord) + num(s.gearLord) + ridingMonster) / 100;
  const species = {
    PvP: pvpSpecies * (1 + num(s.gearHunter) / 100),
    보스: (1 + (victoryBoss + num(s.collectionBoss) + num(s.artifactBoss) + num(s.runeBoss) + num(s.gearBoss) + ridingMonster) / 100) * (1 + (num(s.virtueMonster) + num(s.gearMonster)) / 100),
    영장: pvpSpecies * (1 + (num(s.virtueMonster) + num(s.gearMonster)) / 100),
    악마: (1 + (num(s.collectionDemon) + num(s.artifactDemon) + num(s.runeDemon) + num(s.gearDemon) + ridingMonster) / 100) * (1 + num(s.gearMonster) / 100),
    언데드: (1 + (num(s.collectionUndead) + num(s.artifactUndead) + num(s.runeUndead) + num(s.gearUndead) + ridingMonster) / 100) * (1 + num(s.gearMonster) / 100),
    동물: (1 + (num(s.collectionAnimal) + num(s.artifactAnimal) + num(s.runeAnimal) + num(s.gearAnimal) + ridingMonster) / 100) * (1 + num(s.gearMonster) / 100),
  };
  const artifactJobAmpKey = {
    버서커: "artifactBerserkerAmp",
    팔라딘: "artifactPaladinAmp",
    레인저: "artifactRangerAmp",
    소서러: "artifactSorcererAmp",
    다크나이트: "artifactDarkKnightAmp",
  }[p.job];
  const artifactJobMultiplier = 1 + num(s[artifactJobAmpKey]) / 100;

  const rows = {};
  for (const target of Object.keys(species)) {
    const isPvp = target === "PvP";
    const attack = isPvp ? pvpAttack : pveAttack;
    const dps = isPvp ? pvpDps : pveDps;
    const critDamage = target === "영장" ? spiritCritDamage : isPvp ? pvpCritDamage : pveCritDamage;
    const damageAmp = isPvp ? ampDamagePvp : ampDamagePve;
    const attackAmp = isPvp ? ampAttackPvp : ampAttackPve;
    rows[target] = {
      crit: attack * critDamage * damageAmp / attackAmp * species[target] * artifactJobMultiplier,
      normal: attack * damageAmp / attackAmp * species[target] * artifactJobMultiplier,
      expected: dps * (1 + critChance / 100 * critDamage) * damageAmp / attackAmp * species[target] * artifactJobMultiplier,
    };
  }

  return {
    pveAttack, pvpAttack, pveDps, pvpDps, critChance, actionGap, rows,
    movementPve, movementPvp, ampDamagePve, ampDamagePvp, ampAttackPve, ampAttackPvp,
  };
}

function damage2Profile(state = damage2State) {
  const accountValues = {};
  BASE_SETTING_KEYS.forEach((key) => { accountValues[key] = profile[key]; });
  return {
    ...defaultProfile,
    ...accountValues,
    baseAttack: profile.baseAttack,
    job: profile.job,
    grade: "",
    fury: 0,
    weaponAttack: num(state.weaponAttack),
    weaponSpeed: num(state.weaponSpeed),
    unionAttackSpeed: 0,
    unionCrit: 0,
    costumeMove: num(state.costumeMove),
    costumeCritDamage: 0,
    costumeAttack: num(state.costumeAttack),
    collectionCrit: 0,
    sealMove: num(state.sealMove),
    sealAttack: num(state.sealAttack),
    townPetCritDamage: 0,
    ridingMove: num(state.ridingMove),
    ridingAttackSpeed: 0,
    ridingCrit: 0,
    ridingCritDamage: num(state.ridingCritDamage),
    ridingAttack: num(state.ridingAttack),
    ridingMonster: num(state.ridingAllSpecies),
    fairyAttack: num(state.fairyAttack),
    personalityMove: num(state.gradeMove),
    personalityAttackSpeed: 0,
    personalityCrit: 0,
    personalityAttack: num(state.gradeAttack),
    statAttack: num(state.statAttack),
    statAttackSpeed: 0,
    statCrit: 0,
    naturalCrit: 0,
    secretMove: num(state.secretMove),
    secretAttackSpeed: 0,
    secretCrit: 0,
    secretAttack: num(state.secretAttack),
    quickening: 0,
    runeMove: num(state.runeMove),
    runeAttackSpeed: 0,
    runeAttack: num(state.runeAttack),
    runeCritDamage: num(state.runeCritDamage),
    runeCrit: 0,
    runeBoss: num(state.runeBoss),
    runeLord: 0,
    runeDemon: 0,
    runeUndead: 0,
    runeAnimal: 0,
    gearMove: num(state.gearMove),
    gearAttackSpeed: 0,
    gearAttack: num(state.gearAttack),
    gearCritDamage: num(state.gearCritDamage),
    gearCrit: 0,
    gearBoss: num(state.gearBoss),
    gearLord: num(state.gearLord),
    gearDemon: 0,
    gearUndead: 0,
    gearAnimal: 0,
    gearMonster: num(state.improvementMonsterDamage) + num(state.gearMonsterDamage),
    gearHunter: 0,
    gearSpirit: 0,
    virtueMonster: 0,
    sacredAttack: 0,
    heroAttack: 0,
    heroCritDamage: 0,
    ampA: [],
    ampB: [],
    ampC: [],
    ampD: [],
  };
}

function damage2Totals(state = damage2State) {
  return {
    attack: ["statAttack", "gradeAttack", "costumeAttack", "sealAttack", "ridingAttack", "fairyAttack", "secretAttack", "runeAttack", "gearAttack"].reduce((sum, key) => sum + num(state[key]), 0),
    defense: ["statDefense", "gradeDefense", "ridingDefense", "fairyDefense", "secretDefense"].reduce((sum, key) => sum + num(state[key]), 0),
    health: ["statHealth", "gradeHealth", "costumeHealth", "ridingHealth", "companionHealth", "secretHealth"].reduce((sum, key) => sum + num(state[key]), 0),
    movement: ["gradeMove", "costumeMove", "sealMove", "ridingMove", "secretMove", "runeMove", "gearMove"].reduce((sum, key) => sum + num(state[key]), 0),
    critDamage: ["ridingCritDamage", "runeCritDamage", "gearCritDamage"].reduce((sum, key) => sum + num(state[key]), 0),
    boss: num(state.runeBoss) + num(state.gearBoss),
    lord: num(state.gearLord),
    monster: num(state.improvementMonsterDamage) + num(state.gearMonsterDamage),
    allSpecies: num(state.ridingAllSpecies),
    damageReduction: num(state.ridingDamageReduction),
  };
}

function calculateDamage2(state = damage2State) {
  const baseAttack = num(state.weaponAttack) + 2 * num(state.baseAttack) * num(state.weaponSpeed);
  const groupA = 1 + (num(profile.victoryAttack) + num(profile.dungeonAttack)) / 100;
  const sharedHunterAttack = num(state.sacredAttack) + num(state.personalityAttack) + num(state.statAttack) +
    num(state.gradeAttack) + num(state.secretAttack) + num(state.runeAttack) + num(state.gearAttack) + num(state.heroAttack);
  const groupBTown = 1 + (sharedHunterAttack + num(profile.unionAttack)) / 100;
  const groupBArena = 1 + (sharedHunterAttack + num(state.unionArenaAttack)) / 100;
  const groupC = (num(profile.buildingAttack) + num(profile.townPetAttack)) / 100;
  const groupD = 1 + (
    num(state.costumeAttack) + num(profile.collectionAttack) + num(state.sealAttack) +
    num(state.ridingAttack) + num(profile.artifactAttack)
  ) / 100;
  const groupE = 1 + num(state.fairyAttack) / 100;
  const movementArena = num(state.gradeMove) + num(state.costumeMove) + num(state.sealMove) + num(state.ridingMove) +
    num(state.personalityMove) + num(state.secretMove) + num(state.runeMove) + num(state.gearMove);
  const movementTown = movementArena + num(profile.buildingMove);
  const gustArena = Math.min(movementArena, 300) * num(state.gustRate) / 100;
  const gustTown = Math.min(movementTown, 300) * num(state.gustRate) / 100;
  const groupFArena = (1 + num(state.skillAttackAmp) / 100) * (1 + gustArena / 100);
  const groupFTown = (1 + num(state.skillAttackAmp) / 100) * (1 + gustTown / 100);
  const townAttack = baseAttack * groupA * (groupBTown + groupC) * groupD * groupE * groupFTown;
  const arenaAttack = baseAttack * groupBArena * groupD * groupE * groupFArena;
  const finalAttackInterval = 0.25;
  const displayedAttack = num(state.displayedAttack);

  return {
    baseAttack,
    townAttack,
    arenaAttack,
    townDps: townAttack / finalAttackInterval,
    arenaDps: arenaAttack / finalAttackInterval,
    finalAttackInterval,
    movementTown,
    movementArena,
    gustTown,
    gustArena,
    displayedAttack,
    difference: displayedAttack ? townAttack - displayedAttack : 0,
    errorRate: displayedAttack ? (townAttack - displayedAttack) / displayedAttack * 100 : 0,
    groups: { A: groupA, BTown: groupBTown, BArena: groupBArena, C: groupC, D: groupD, E: groupE, FTown: groupFTown, FArena: groupFArena },
  };
}

function renderDamage2() {
  const container = document.querySelector("#damage2-sections");
  if (!container) return;
  if (!container.dataset.ready) {
    container.innerHTML = DAMAGE2_SECTIONS.map((section, sectionIndex) => `
      <details class="input-card" ${sectionIndex === 0 ? "open" : ""}>
        <summary>
          <span class="step">${String(sectionIndex + 1).padStart(2, "0")}</span>
          <span><b>${escapeHtml(section.title)}</b></span>
          <span class="summary-chevron" aria-hidden="true">⌄</span>
        </summary>
        <div class="field-grid compact-grid damage2-field-grid">
          ${section.fields.map(([key, label, suffix]) => `
            <label class="field damage2-field" data-suffix="${escapeHtml(suffix)}">
              <span>${escapeHtml(label)}</span>
              <input type="number" inputmode="decimal" step="0.01" data-damage2-key="${key}">
            </label>
          `).join("")}
        </div>
      </details>
    `).join("");
    container.dataset.ready = "true";
    container.querySelectorAll("[data-damage2-key]").forEach((input) => {
      input.addEventListener("input", () => {
        damage2State[input.dataset.damage2Key] = num(input.value);
        renderDamage2Results();
        queueAutoSave();
      });
    });
  }
  container.querySelectorAll("[data-damage2-key]").forEach((input) => {
    input.value = damage2State[input.dataset.damage2Key];
  });
  renderDamage2Results();
}

function renderDamage2Results() {
  const hero = document.querySelector("#damage2-town-attack");
  if (!hero) return;
  const result = calculateDamage2();
  const totals = damage2Totals();
  hero.textContent = formatNumber(Math.trunc(result.townAttack));
  document.querySelector("#damage2-arena-attack").textContent = formatNumber(Math.trunc(result.arenaAttack));
  document.querySelector("#damage2-town-dps").textContent = formatNumber(Math.trunc(result.townDps));
  document.querySelector("#damage2-arena-dps").textContent = formatNumber(Math.trunc(result.arenaDps));
  document.querySelector("#damage2-base-attack").textContent = formatNumber(result.baseAttack);
  document.querySelector("#damage2-validation").innerHTML = result.displayedAttack ? `
    <span>게임값 대비</span>
    <strong class="${result.difference > 0 ? "is-plus" : result.difference < 0 ? "is-minus" : ""}">${result.difference > 0 ? "+" : ""}${formatNumber(Math.trunc(result.difference))} · ${result.errorRate > 0 ? "+" : ""}${result.errorRate.toFixed(2)}%</strong>
  ` : `<span>게임 표시 공격력을 입력하면 오차를 확인할 수 있습니다.</span>`;
  const groupRows = [
    ["기초", result.baseAttack, ""],
    ["A · 승전/지던", result.groups.A, "×"],
    ["B · 헌터(마을)", result.groups.BTown, "×"],
    ["B · 헌터(콜로)", result.groups.BArena, "×"],
    ["C · 마을", result.groups.C, "+"],
    ["D · 독립", result.groups.D, "×"],
    ["E · 요정", result.groups.E, "×"],
    ["F · 증폭(마을)", result.groups.FTown, "×"],
    ["F · 증폭(콜로)", result.groups.FArena, "×"],
  ];
  document.querySelector("#damage2-formula-groups").innerHTML = groupRows.map(([label, value, prefix]) => `
    <div class="damage2-group-row"><span>${label}</span><strong>${prefix}${prefix ? value.toFixed(4) : formatNumber(value)}</strong></div>
  `).join("");
  const summaryRows = [
    ["공격력", totals.attack], ["방어력", totals.defense], ["체력", totals.health],
    ["치명타 피해", totals.critDamage], ["이동속도", totals.movement], ["영장 피해", totals.lord],
    ["보스 피해", totals.boss], ["몬스터 피해", totals.monster], ["모든 종족 피해", totals.allSpecies],
    ["받는 피해 감소", totals.damageReduction],
  ];
  document.querySelector("#damage2-summary").innerHTML = summaryRows.map(([label, value]) => `
    <div class="damage2-summary-row"><span>${label}</span><strong>${formatNumber(value)}%</strong></div>
  `).join("");
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
  stats: { fairy: 6, stat: 20, grade: 8, riding: 24, secret: 15, rune: 0, gear: 0 },
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
    baseDefense: "헌터 기본 방어력", fairy: "요정 %", stat: "스탯 %", grade: "등급 %",
    riding: "라이딩 %", secret: "비법 %", rune: "룬 %", gear: "장비 %",
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
  const hunterOptionPercent = ["stat", "grade", "riding", "secret", "rune", "gear"].reduce((sum, key) => sum + num(defenseState.stats[key]), 0);
  const accountOptionPercent = num(profile.unionDefense) + num(profile.buildingDefense) + num(profile.collectionDefense) + num(profile.artifactDefense) + num(profile.townPetDefense);
  const optionPercent = hunterOptionPercent + accountOptionPercent;
  const dungeonPercent = num(profile.dungeonDefense);
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

let uiState = { activeView: "calculator", displayUnit: "1" };
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

function mergeDamage2(saved) {
  const merged = structuredClone(DAMAGE2_DEFAULTS);
  if (!saved || typeof saved !== "object") return merged;
  Object.keys(merged).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(saved, key)) merged[key] = num(saved[key]);
  });
  return merged;
}

function applyStoredState(saved) {
  if (!saved || typeof saved !== "object") throw new Error("올바른 백업 데이터가 아닙니다.");
  profile = mergeProfile(saved.profile);
  compareProfiles.a = mergeProfile(saved.comparison?.a ?? profile);
  compareProfiles.b = mergeProfile(saved.comparison?.b ?? profile);
  syncBaseSettingsToComparison();
  defenseState = mergeDefense(saved.defense);
  damage2State = mergeDamage2(saved.damage2);
  const requestedView = typeof saved.ui?.activeView === "string" ? saved.ui.activeView : "calculator";
  const validViews = ["calculator", "calculator-2", "base-settings", "comparison", "storage"];
  uiState = {
    activeView: validViews.includes(requestedView) ? requestedView : "calculator",
    displayUnit: ["1", "1000", "1000000", "1000000000"].includes(String(saved.ui?.displayUnit)) ? String(saved.ui.displayUnit) : "1",
  };
}

function currentAppState() {
  if (typeof document !== "undefined") {
    uiState.displayUnit = document.querySelector("#display-unit")?.value ?? uiState.displayUnit;
    uiState.activeView = document.querySelector("[data-view-target].is-active")?.dataset.viewTarget ?? uiState.activeView;
  }
  return {
    version: STATE_VERSION,
    app: "이블헌터타이쿤 데미지 계산기",
    savedAt: new Date().toISOString(),
    profile,
    damage2: damage2State,
    comparison: compareProfiles,
    defense: defenseState,
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
      applyStoredState({ profile: JSON.parse(legacyProfile), comparison: {}, defense: defaultDefense });
      return true;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return false;
}

function applyUiState() {
  const unit = document.querySelector("#display-unit");
  if (unit) unit.value = uiState.displayUnit;
  document.querySelectorAll("[data-view-target]").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.viewTarget === uiState.activeView));
  document.querySelectorAll("[data-view]").forEach((view) => view.classList.toggle("is-active", view.dataset.view === uiState.activeView));
}

function syncProfileInputs() {
  document.querySelectorAll("[data-key]").forEach((input) => { input.value = profile[input.dataset.key]; });
}

function syncBaseSettingsToComparison() {
  BASE_SETTING_KEYS.forEach((key) => {
    compareProfiles.a[key] = profile[key];
    compareProfiles.b[key] = profile[key];
  });
}

function refreshAllViews() {
  syncProfileInputs();
  applyUiState();
  renderAmplificationEditor();
  render();
  renderDamage2();
  renderComparison();
  renderDefense();
}

function showStorageMessage(type, title, copy) {
  const message = document.querySelector("#storage-message");
  if (!message) return;
  message.classList.toggle("is-success", type === "success");
  message.classList.toggle("is-error", type === "error");
  message.innerHTML = `<b>${escapeHtml(title)}</b><span>${escapeHtml(copy)}</span>`;
}

function hydrateForm() {
  document.querySelectorAll("[data-key]").forEach((input) => {
    const key = input.dataset.key;
    input.value = profile[key];
    input.addEventListener("input", () => {
      profile[key] = input.type === "number" ? num(input.value) : input.value;
      document.querySelectorAll("[data-key]").forEach((linkedInput) => {
        if (linkedInput !== input && linkedInput.dataset.key === key) linkedInput.value = profile[key];
      });
      if (BASE_SETTING_KEYS.has(key)) {
        syncBaseSettingsToComparison();
        renderComparison();
        renderDefense();
      }
      render();
      renderDamage2Results();
      queueAutoSave();
    });
  });
}

if (typeof document !== "undefined") {
const ACCESS_CODE_HASH = "f6f2ea8f45d8a057c9566a33f99474da2e5c6a6604d736121650e2730c6fb0a3";
const IS_LOCAL_PREVIEW = ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname);

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

let accessGranted = IS_LOCAL_PREVIEW;
if (!accessGranted) {
  try { accessGranted = sessionStorage.getItem("hunter-calculator-access") === "granted"; } catch {}
}
if (accessGranted) unlockCalculator();
else lockCalculator();

if (IS_LOCAL_PREVIEW) document.querySelector("#lock-app").hidden = true;

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
  syncProfileInputs();
  syncBaseSettingsToComparison();
  renderAmplificationEditor();
  render();
  renderDamage2();
  renderComparison();
  renderDefense();
  queueAutoSave();
});
document.querySelector("#reset-base-settings").addEventListener("click", () => {
  Object.entries(BASE_SETTING_DEFAULTS).forEach(([key, value]) => { profile[key] = value; });
  syncProfileInputs();
  syncBaseSettingsToComparison();
  render();
  renderDamage2Results();
  renderComparison();
  renderDefense();
  queueAutoSave();
});
document.querySelector("#reset-damage2").addEventListener("click", () => {
  damage2State = structuredClone(DAMAGE2_DEFAULTS);
  renderDamage2();
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
renderDamage2();
renderComparison();
renderDefense();
renderVerifier();
if (restoredOnStartup) updateStorageStatus("이 기기에 저장된 마지막 내용을 자동으로 불러왔습니다.");
else saveAllState();
registerWebMcp();
}

if (typeof module !== "undefined") {
  module.exports = { calculate, calculateDamage2, damage2Totals, defaultProfile, defaultDefense, BASE_SETTING_DEFAULTS, DAMAGE2_DEFAULTS };
}
