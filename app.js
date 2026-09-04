const STORAGE_KEY = "evil-hunter-calculator-state-v3";
const LEGACY_PROFILE_KEY = "evil-hunter-damage-profile";
const STATE_VERSION = 6;

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
const DAMAGE2_FIXED_VALUES = Object.freeze({
  sacredAttack: 90,
});
const DAMAGE2_PERSONALITIES = Object.freeze({
  strong: Object.freeze({ label: "힘이 쎈", attack: 10, movement: 0 }),
  heroic: Object.freeze({ label: "영웅심리", attack: 7, movement: 7 }),
});
const DAMAGE2_GRADES = Object.freeze({
  H: Object.freeze({ label: "H", attack: 3, defense: 3, health: 3, movement: 10 }),
  "H+": Object.freeze({ label: "H+", attack: 4, defense: 4, health: 4, movement: 10 }),
  L: Object.freeze({ label: "L", attack: 5, defense: 5, health: 5, movement: 20 }),
  "L+": Object.freeze({ label: "L+", attack: 6, defense: 6, health: 6, movement: 20 }),
  U: Object.freeze({ label: "U", attack: 7, defense: 7, health: 7, movement: 30 }),
  "U+": Object.freeze({ label: "U+", attack: 8, defense: 8, health: 8, movement: 30 }),
});
const DAMAGE2_SELECT_OPTIONS = Object.freeze({
  personality: DAMAGE2_PERSONALITIES,
  grade: DAMAGE2_GRADES,
});
const DAMAGE2_EQUIPMENT_SLOTS = Object.freeze([
  // 체력 옵션은 체력 계산 확장 시 chaosOptions에 "health"를 다시 추가합니다.
  Object.freeze({ key: "weapon", label: "무기", chaosOptions: ["critDamage"] }),
  Object.freeze({ key: "armor", label: "갑옷", chaosOptions: ["attack"] }),
  Object.freeze({ key: "gloves", label: "장갑", chaosOptions: ["attack"] }),
  Object.freeze({ key: "shoes", label: "신발", chaosOptions: ["attack"] }),
  Object.freeze({ key: "helmet", label: "투구", chaosOptions: ["boss"] }),
  Object.freeze({ key: "necklace", label: "목걸이", chaosOptions: ["critDamage"] }),
  Object.freeze({ key: "ring", label: "반지", chaosOptions: ["critDamage"] }),
  Object.freeze({ key: "belt", label: "벨트", chaosOptions: ["boss"] }),
]);
const DAMAGE2_CHAOS_OPTIONS = Object.freeze({
  attack: "공격력",
  critDamage: "치명타 피해",
  // health: "체력", // 체력 계산 확장 시 복원
  boss: "보스 피해",
});
const DAMAGE2_GEAR_OPTIONS = Object.freeze({
  attack: "공격력",
  // defense: "방어력", // 방어력 계산 확장 시 복원
  // health: "체력", // 체력 계산 확장 시 복원
  critDamage: "치명타 피해",
  demon: "악마 피해",
  lord: "영장 피해",
  boss: "보스 피해",
  undead: "언데드 피해",
  animal: "동물 피해",
});
const DAMAGE2_EQUIPMENT_TOTAL_FIELDS = Object.freeze([
  Object.freeze(["gearAttack", "공격력"]),
  Object.freeze(["gearCritDamage", "치명타 피해"]),
  Object.freeze(["gearDemon", "악마 피해"]),
  Object.freeze(["gearLord", "영장 피해"]),
  Object.freeze(["gearBoss", "보스 피해"]),
  Object.freeze(["gearUndead", "언데드 피해"]),
  Object.freeze(["gearAnimal", "동물 피해"]),
]);
const DAMAGE2_UNIQUE_STAGES = Object.freeze({
  "1": "1단계",
  "2": "2단계",
  "3": "3단계",
});
const DAMAGE2_UNIQUE_CONFIG = Object.freeze({
  gloves: Object.freeze({
    control: "stage",
    options: Object.freeze({ none: "없음", blood: "블피", trueBlood: "진블피" }),
  }),
  shoes: Object.freeze({
    control: "value",
    options: Object.freeze({ none: "없음", gale: "질풍", trueGale: "진질풍" }),
  }),
  necklace: Object.freeze({
    control: "stage",
    options: Object.freeze({ none: "없음", dragon: "용목" }),
  }),
});
const DAMAGE2_GLOVE_CRIT_DAMAGE = Object.freeze({
  blood: Object.freeze({ "1": 120, "2": 150, "3": 200 }),
  trueBlood: Object.freeze({ "1": 170, "2": 200, "3": 250 }),
});
const DAMAGE2_NECKLACE_ATTACK_AMP = Object.freeze({ "1": 5, "2": 10, "3": 20 });

function createDamage2EquipmentDefaults() {
  const defaultOptionTypes = ["attack", "critDamage", "demon"];
  return Object.fromEntries(DAMAGE2_EQUIPMENT_SLOTS.map(({ key, chaosOptions }) => {
    const uniqueConfig = DAMAGE2_UNIQUE_CONFIG[key];
    const unique = uniqueConfig
      ? { unique: uniqueConfig.control === "stage" ? { type: "none", stage: "1" } : { type: "none", value: 10 } }
      : {};
    return [key, {
      chaos: { type: chaosOptions[0], value: 0 },
      options: defaultOptionTypes.map((type) => ({ type, value: 0 })),
      ...unique,
    }];
  }));
}

const DAMAGE2_DEFAULTS = Object.freeze({
  weaponAttack: 1742004,
  weaponSpeed: 2,
  baseAttack: 1023.75,
  personality: "heroic",
  grade: "L+",
  heroAttack: 50,
  unionArenaAttack: 5,
  skillAttackAmp: 50,
  gustRate: 10,
  displayedAttack: 133905832,
  statHealth: 10,
  statAttack: 20,
  statDefense: 20,
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
  fairyHealth: 2,
  companionHealth: 0,
  improvementMonsterDamage: 30,
  secretHealth: 15,
  secretAttack: 15,
  secretDefense: 15,
  secretMove: 15,
  runeAttack: 28,
  runeMove: 16,
  runeDemon: 0,
  runeLord: 0,
  runeBoss: 36,
  runeUndead: 0,
  runeAnimal: 0,
  runeCritDamage: 31,
  gearAttack: 226,
  gearMove: 43,
  gearDemon: 0,
  gearLord: 27,
  gearBoss: 348,
  gearUndead: 0,
  gearAnimal: 0,
  gearCritDamage: 605,
  gearMonsterDamage: 35,
  equipmentInputMode: "total",
  equipment: createDamage2EquipmentDefaults(),
});

const DAMAGE2_SECTIONS = [
  { title: "헌터정보", fields: [["baseAttack", "헌터 고유공격력", ""], ["displayedAttack", "게임 표시 공격력", ""], ["grade", "헌터 등급", ""], ["personality", "성격", ""]] },
  { title: "장비옵션", type: "equipment" },
  { title: "코스튬 버프", fields: [
    ["costumeAttack", "공격력", "%"],
    // ["costumeHealth", "체력", "%"], // 체력 계산 확장 시 복원
    // ["costumeMove", "이동속도", "%"], // 이동속도 입력 복원 시 사용
  ] },
  { title: "인장 버프", fields: [
    ["sealAttack", "공격력", "%"],
    // ["sealMove", "이동속도", "%"], // 이동속도 입력 복원 시 사용
  ] },
  { title: "라이딩펫 버프", fields: [
    ["ridingAttack", "공격력", "%"],
    // ["ridingDefense", "방어력", "%"], // 방어력 계산 확장 시 복원
    // ["ridingHealth", "체력", "%"], // 체력 계산 확장 시 복원
    ["ridingCritDamage", "치명타 피해", "%"],
    // ["ridingMove", "이동속도", "%"], // 이동속도 입력 복원 시 사용
    ["ridingAllSpecies", "모든 종족 피해", "%"],
    // ["ridingDamageReduction", "받는 피해 감소", "%"], // 받는 피해 감소 입력 복원 시 사용
  ] },
  { title: "요정 버프", fields: [
    ["fairyAttack", "공격력", "%"],
    // ["fairyDefense", "방어력", "%"], // 방어력 계산 확장 시 복원
    // ["fairyHealth", "체력", "%"], // 체력 계산 확장 시 복원
  ] },
  // { title: "컴패 버프", fields: [["companionHealth", "체력", "%"]] }, // 체력 계산 확장 시 복원
  { title: "개량 옵션", fields: [["improvementMonsterDamage", "몬스터 피해", "%"]] },
  { title: "비법", fields: [
    ["secretAttack", "공격력", "%"],
    // ["secretDefense", "방어력", "%"], // 방어력 계산 확장 시 복원
    // ["secretHealth", "체력", "%"], // 체력 계산 확장 시 복원
    // ["secretMove", "이동속도", "%"], // 이동속도 입력 복원 시 사용
  ] },
  { title: "룬", fields: [
    ["runeAttack", "공격력", "%"], ["runeCritDamage", "치명타 피해", "%"],
    // ["runeMove", "이동속도", "%"], // 이동속도 입력 복원 시 사용
    ["runeDemon", "악마 피해", "%"], ["runeLord", "영장 피해", "%"], ["runeBoss", "보스 피해", "%"],
    ["runeUndead", "언데드 피해", "%"], ["runeAnimal", "동물 피해", "%"],
  ] },
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
  const grade = DAMAGE2_GRADES[state.grade] ?? DAMAGE2_GRADES[DAMAGE2_DEFAULTS.grade];
  const equipmentTotals = damage2SelectedEquipmentTotals(state);
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
    fairyHealth: num(state.fairyHealth),
    personalityMove: grade.movement,
    personalityAttackSpeed: 0,
    personalityCrit: 0,
    personalityAttack: grade.attack,
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
    runeLord: num(state.runeLord),
    runeDemon: num(state.runeDemon),
    runeUndead: num(state.runeUndead),
    runeAnimal: num(state.runeAnimal),
    gearMove: num(state.gearMove),
    gearAttackSpeed: 0,
    gearAttack: equipmentTotals.attack,
    gearCritDamage: equipmentTotals.critDamage,
    gearCrit: 0,
    gearBoss: equipmentTotals.boss,
    gearLord: equipmentTotals.lord,
    gearDemon: equipmentTotals.demon,
    gearUndead: equipmentTotals.undead,
    gearAnimal: equipmentTotals.animal,
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

function damage2EquipmentUnique(state, slotKey) {
  return state.equipment?.[slotKey]?.unique ?? DAMAGE2_DEFAULTS.equipment[slotKey]?.unique;
}

function damage2DirectEquipmentTotals(state) {
  const totals = { attack: 0, critDamage: 0, demon: 0, lord: 0, boss: 0, undead: 0, animal: 0 };
  DAMAGE2_EQUIPMENT_SLOTS.forEach(({ key }) => {
    const slot = state.equipment?.[key];
    if (!slot) return;
    [slot.chaos, ...(slot.options || [])].forEach((option) => {
      if (option && Object.prototype.hasOwnProperty.call(totals, option.type)) totals[option.type] += num(option.value);
    });
  });
  totals.critDamage += damage2GloveCritDamage(state);
  return totals;
}

function damage2SelectedEquipmentTotals(state) {
  if (state.equipmentInputMode === "direct") return damage2DirectEquipmentTotals(state);
  return {
    attack: num(state.gearAttack),
    critDamage: num(state.gearCritDamage) + damage2GloveCritDamage(state),
    demon: num(state.gearDemon),
    lord: num(state.gearLord),
    boss: num(state.gearBoss),
    undead: num(state.gearUndead),
    animal: num(state.gearAnimal),
  };
}

function damage2GloveCritDamage(state) {
  const unique = damage2EquipmentUnique(state, "gloves");
  if (!unique || unique.type === "none") return 0;
  return DAMAGE2_GLOVE_CRIT_DAMAGE[unique.type]?.[unique.stage] ?? 0;
}

function damage2NecklaceAttackAmp(state) {
  const unique = damage2EquipmentUnique(state, "necklace");
  if (!unique || unique.type !== "dragon") return 0;
  return DAMAGE2_NECKLACE_ATTACK_AMP[unique.stage] ?? 0;
}

function damage2ShoesAttackAmp(state, movement) {
  const unique = damage2EquipmentUnique(state, "shoes");
  if (!unique || unique.type === "none") return 0;
  const movementCap = unique.type === "trueGale" ? 400 : 300;
  return Math.min(movement, movementCap) * num(unique.value) / 100;
}

function damage2Totals(state = damage2State) {
  const grade = DAMAGE2_GRADES[state.grade] ?? DAMAGE2_GRADES[DAMAGE2_DEFAULTS.grade];
  const equipmentTotals = damage2SelectedEquipmentTotals(state);
  return {
    attack: grade.attack + ["statAttack", "costumeAttack", "sealAttack", "ridingAttack", "fairyAttack", "secretAttack", "runeAttack"].reduce((sum, key) => sum + num(state[key]), 0) + equipmentTotals.attack,
    // defense: grade.defense + ["statDefense", "ridingDefense", "fairyDefense", "secretDefense"].reduce((sum, key) => sum + num(state[key]), 0), // 방어력 계산 확장 시 복원
    // health: grade.health + ["statHealth", "costumeHealth", "ridingHealth", "fairyHealth", "companionHealth", "secretHealth"].reduce((sum, key) => sum + num(state[key]), 0), // 체력 계산 확장 시 복원
    // movement: grade.movement + ["costumeMove", "sealMove", "ridingMove", "secretMove", "runeMove", "gearMove"].reduce((sum, key) => sum + num(state[key]), 0), // 이동속도 합계 표시 복원 시 사용
    critDamage: ["ridingCritDamage", "runeCritDamage"].reduce((sum, key) => sum + num(state[key]), 0) + equipmentTotals.critDamage,
    demon: num(state.runeDemon) + equipmentTotals.demon,
    lord: num(state.runeLord) + equipmentTotals.lord,
    boss: num(state.runeBoss) + equipmentTotals.boss,
    undead: num(state.runeUndead) + equipmentTotals.undead,
    animal: num(state.runeAnimal) + equipmentTotals.animal,
    monster: num(state.improvementMonsterDamage) + num(state.gearMonsterDamage),
    allSpecies: num(state.ridingAllSpecies),
    // damageReduction: num(state.ridingDamageReduction), // 받는 피해 감소 합계 표시 복원 시 사용
  };
}

function calculateDamage2(state = damage2State) {
  const personality = DAMAGE2_PERSONALITIES[state.personality] ?? DAMAGE2_PERSONALITIES.heroic;
  const grade = DAMAGE2_GRADES[state.grade] ?? DAMAGE2_GRADES[DAMAGE2_DEFAULTS.grade];
  const equipmentTotals = damage2SelectedEquipmentTotals(state);
  const baseAttack = num(state.weaponAttack) + 2 * num(state.baseAttack) * num(state.weaponSpeed);
  const groupA = 1 + (num(profile.victoryAttack) + num(profile.dungeonAttack)) / 100;
  const sharedHunterAttack = DAMAGE2_FIXED_VALUES.sacredAttack + personality.attack + num(state.statAttack) +
    grade.attack + num(state.secretAttack) + num(state.runeAttack) + equipmentTotals.attack + num(state.heroAttack);
  const groupBTown = 1 + (sharedHunterAttack + num(profile.unionAttack)) / 100;
  const groupBArena = 1 + (sharedHunterAttack + num(state.unionArenaAttack)) / 100;
  const groupC = (num(profile.buildingAttack) + num(profile.townPetAttack)) / 100;
  const groupD = 1 + (
    num(state.costumeAttack) + num(profile.collectionAttack) + num(state.sealAttack) +
    num(state.ridingAttack) + num(profile.artifactAttack)
  ) / 100;
  const groupE = 1 + num(state.fairyAttack) / 100;
  const movementArena = grade.movement + num(state.costumeMove) + num(state.sealMove) + num(state.ridingMove) +
    personality.movement + num(state.secretMove) + num(state.runeMove) + num(state.gearMove);
  const movementTown = movementArena + num(profile.buildingMove);
  const gustArena = damage2ShoesAttackAmp(state, movementArena);
  const gustTown = damage2ShoesAttackAmp(state, movementTown);
  const necklaceAttackAmp = damage2NecklaceAttackAmp(state);
  const groupFArena = (1 + num(state.skillAttackAmp) / 100) * (1 + (gustArena + necklaceAttackAmp) / 100);
  const groupFTown = (1 + num(state.skillAttackAmp) / 100) * (1 + (gustTown + necklaceAttackAmp) / 100);
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

function damage2EquipmentSelect(options, selectedValue, ariaLabel, dataAttributes, field = "type") {
  return `
    <select aria-label="${escapeHtml(ariaLabel)}" ${dataAttributes} data-equipment-field="${field}">
      ${Object.entries(options).map(([value, label]) => `
        <option value="${value}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>
      `).join("")}
    </select>
  `;
}

function damage2EquipmentUniqueRow(slot) {
  const config = DAMAGE2_UNIQUE_CONFIG[slot.key];
  if (!config) return "";
  const unique = damage2State.equipment[slot.key].unique;
  const dataAttributes = `data-damage2-equipment-slot="${slot.key}" data-equipment-group="unique"`;
  const dependentAttributes = `${dataAttributes} data-equipment-dependent${unique.type === "none" ? " hidden" : ""}`;
  const valueControl = config.control === "stage"
    ? damage2EquipmentSelect(DAMAGE2_UNIQUE_STAGES, unique.stage, `${slot.label} 유니크 단계`, dependentAttributes, "stage")
    : `<label class="damage2-equipment-value" data-equipment-dependent${unique.type === "none" ? " hidden" : ""}>
        <input type="number" inputmode="decimal" step="0.01" value="${unique.value}" aria-label="${escapeHtml(`${slot.label} 유니크 수치`)}" ${dataAttributes} data-equipment-field="value">
      </label>`;
  return `
    <div class="damage2-equipment-option-row damage2-equipment-unique-row">
      <span class="damage2-equipment-option-label">유니크</span>
      ${damage2EquipmentSelect(config.options, unique.type, `${slot.label} 유니크`, dataAttributes)}
      ${valueControl}
    </div>
  `;
}

function damage2EquipmentRow(slot, group, optionIndex = null) {
  const isChaos = group === "chaos";
  const item = isChaos ? damage2State.equipment[slot.key].chaos : damage2State.equipment[slot.key].options[optionIndex];
  const rowLabel = isChaos ? "혼돈 옵션" : `장비 옵션 ${optionIndex + 1}`;
  const options = isChaos
    ? Object.fromEntries(slot.chaosOptions.map((key) => [key, DAMAGE2_CHAOS_OPTIONS[key]]))
    : DAMAGE2_GEAR_OPTIONS;
  const indexAttribute = isChaos ? "" : ` data-equipment-index="${optionIndex}"`;
  const dataAttributes = `data-damage2-equipment-slot="${slot.key}" data-equipment-group="${group}"${indexAttribute}`;
  return `
    <div class="damage2-equipment-option-row">
      <span class="damage2-equipment-option-label">${rowLabel}</span>
      ${damage2EquipmentSelect(options, item.type, `${slot.label} ${rowLabel}`, dataAttributes)}
      <label class="damage2-equipment-value">
        <input type="number" inputmode="decimal" step="0.01" value="${item.value}" aria-label="${escapeHtml(`${slot.label} ${rowLabel} 수치`)}" ${dataAttributes} data-equipment-field="value">
      </label>
    </div>
  `;
}

function renderDamage2EquipmentTotalEditor() {
  return `
    <div class="field-grid compact-grid damage2-field-grid damage2-equipment-total-grid">
      ${DAMAGE2_EQUIPMENT_TOTAL_FIELDS.map(([key, label]) => `
        <label class="field damage2-field" data-suffix="%">
          <span>${escapeHtml(label)}</span>
          <input type="number" inputmode="decimal" step="0.01" data-damage2-key="${key}">
        </label>
      `).join("")}
    </div>
  `;
}

function renderDamage2EquipmentEditor() {
  return `
    <div class="damage2-equipment-mode" role="group" aria-label="장비옵션 입력 방식">
      <button type="button" data-damage2-equipment-mode="direct"><b>직접입력</b><small>장비별 설정</small></button>
      <button type="button" data-damage2-equipment-mode="total"><b>합계입력</b><small>스탯 합계</small></button>
    </div>
    <div data-damage2-equipment-panel="direct">
      <div class="damage2-equipment-list">
        ${DAMAGE2_EQUIPMENT_SLOTS.map((slot) => `
          <section class="damage2-equipment-card">
            <div class="damage2-equipment-heading">
              <b>${escapeHtml(slot.label)}</b>
            </div>
            <div class="damage2-equipment-fields">
              ${damage2EquipmentUniqueRow(slot)}
              ${damage2EquipmentRow(slot, "chaos")}
              ${Array.from({ length: 3 }, (_, optionIndex) => damage2EquipmentRow(slot, "option", optionIndex)).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    </div>
    <div data-damage2-equipment-panel="total">
      ${renderDamage2EquipmentTotalEditor()}
    </div>
  `;
}

function syncDamage2EquipmentMode(container) {
  const mode = damage2State.equipmentInputMode === "direct" ? "direct" : "total";
  container.querySelectorAll("[data-damage2-equipment-mode]").forEach((button) => {
    const isActive = button.dataset.damage2EquipmentMode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  container.querySelectorAll("[data-damage2-equipment-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.damage2EquipmentPanel !== mode;
  });
}

function renderDamage2() {
  const container = document.querySelector("#damage2-sections");
  if (!container) return;
  if (!container.dataset.ready) {
    container.innerHTML = DAMAGE2_SECTIONS.map((section, sectionIndex) => `
      <section class="input-card damage2-static-card">
        <div class="damage2-section-heading">
          <span class="step">${String(sectionIndex + 1).padStart(2, "0")}</span>
          <span><b>${escapeHtml(section.title)}</b></span>
        </div>
        ${section.type === "equipment" ? renderDamage2EquipmentEditor() : `
        <div class="field-grid compact-grid damage2-field-grid">
          ${section.fields.map(([key, label, suffix]) => {
            const options = DAMAGE2_SELECT_OPTIONS[key];
            return `
              <label class="field damage2-field" data-suffix="${escapeHtml(suffix)}">
                <span>${escapeHtml(label)}</span>
                ${options ? `
                  <select data-damage2-key="${key}">
                    ${Object.entries(options).map(([value, option]) => `<option value="${value}">${escapeHtml(option.label)}</option>`).join("")}
                  </select>
                ` : `<input type="number" inputmode="decimal" step="0.01" data-damage2-key="${key}">`}
              </label>
            `;
          }).join("")}
        </div>
        `}
      </section>
    `).join("");
    container.dataset.ready = "true";
    container.querySelectorAll("[data-damage2-key]").forEach((control) => {
      control.addEventListener("input", () => {
        const key = control.dataset.damage2Key;
        damage2State[key] = DAMAGE2_SELECT_OPTIONS[key] ? control.value : num(control.value);
        renderDamage2Results();
        queueAutoSave();
      });
    });
    container.querySelectorAll("[data-damage2-equipment-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        damage2State.equipmentInputMode = button.dataset.damage2EquipmentMode;
        syncDamage2EquipmentMode(container);
        renderDamage2Results();
        queueAutoSave();
      });
    });
    container.querySelectorAll("[data-damage2-equipment-slot]").forEach((control) => {
      control.addEventListener("input", () => {
        const slot = damage2State.equipment[control.dataset.damage2EquipmentSlot];
        const group = control.dataset.equipmentGroup === "chaos" ? slot.chaos
          : control.dataset.equipmentGroup === "unique" ? slot.unique
          : slot.options[Number(control.dataset.equipmentIndex)];
        group[control.dataset.equipmentField] = ["type", "stage"].includes(control.dataset.equipmentField) ? control.value : num(control.value);
        if (control.dataset.equipmentGroup === "unique" && control.dataset.equipmentField === "type") {
          const dependent = control.closest(".damage2-equipment-unique-row")?.querySelector("[data-equipment-dependent]");
          if (dependent) dependent.hidden = control.value === "none";
        }
        renderDamage2Results();
        queueAutoSave();
      });
    });
  }
  container.querySelectorAll("[data-damage2-key]").forEach((input) => {
    input.value = damage2State[input.dataset.damage2Key];
  });
  container.querySelectorAll("[data-damage2-equipment-slot]").forEach((control) => {
    const slot = damage2State.equipment[control.dataset.damage2EquipmentSlot];
    const group = control.dataset.equipmentGroup === "chaos" ? slot.chaos
      : control.dataset.equipmentGroup === "unique" ? slot.unique
      : slot.options[Number(control.dataset.equipmentIndex)];
    control.value = group[control.dataset.equipmentField];
  });
  syncDamage2EquipmentMode(container);
  renderDamage2Results();
}

function renderDamage2Results() {
  const hero = document.querySelector("#damage2-town-attack");
  if (!hero) return;
  const result = calculateDamage2();
  hero.textContent = formatNumber(Math.trunc(result.townAttack));
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
  const targetLabels = { PvP: "PvP", 보스: "보스 피해", 영장: "영장 피해", 악마: "악마 피해", 언데드: "언데드 피해", 동물: "동물 피해" };
  document.querySelector("#damage-table").innerHTML = `
    <div class="damage-row is-head"><span>대상</span><span>치명타</span><span>일반</span><span>기대 화력</span></div>
    ${targets.map((target) => {
      const row = latestResult.rows[target];
      return `<div class="damage-row"><b>${targetLabels[target]}</b><span>${formatNumber(row.crit, unit)}</span><span>${formatNumber(row.normal, unit)}</span><span class="accent">${formatNumber(row.expected, unit)}</span></div>`;
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

function mergeDamage2Equipment(saved) {
  const merged = createDamage2EquipmentDefaults();
  if (!saved || typeof saved !== "object") return merged;
  DAMAGE2_EQUIPMENT_SLOTS.forEach(({ key, chaosOptions }) => {
    const candidate = saved[key];
    if (!candidate || typeof candidate !== "object") return;
    if (candidate.chaos && typeof candidate.chaos === "object") {
      if (chaosOptions.includes(candidate.chaos.type)) merged[key].chaos.type = candidate.chaos.type;
      merged[key].chaos.value = num(candidate.chaos.value);
    }
    if (Array.isArray(candidate.options)) {
      const isLegacyEmptyDefault = candidate.options.slice(0, 3).length === 3 && candidate.options.slice(0, 3).every((option) => option?.type === "attack" && num(option.value) === 0);
      if (!isLegacyEmptyDefault) {
        merged[key].options = merged[key].options.map((option, optionIndex) => {
          const savedOption = candidate.options[optionIndex];
          if (!savedOption || typeof savedOption !== "object") return option;
          return {
            type: Object.prototype.hasOwnProperty.call(DAMAGE2_GEAR_OPTIONS, savedOption.type) ? savedOption.type : option.type,
            value: num(savedOption.value),
          };
        });
      }
    }
    const uniqueConfig = DAMAGE2_UNIQUE_CONFIG[key];
    if (uniqueConfig && candidate.unique && typeof candidate.unique === "object") {
      if (Object.prototype.hasOwnProperty.call(uniqueConfig.options, candidate.unique.type)) merged[key].unique.type = candidate.unique.type;
      if (uniqueConfig.control === "stage") {
        const stage = String(candidate.unique.stage ?? "");
        if (Object.prototype.hasOwnProperty.call(DAMAGE2_UNIQUE_STAGES, stage)) merged[key].unique.stage = stage;
      } else {
        merged[key].unique.value = num(candidate.unique.value);
      }
    }
  });
  return merged;
}

function mergeDamage2(saved) {
  const merged = structuredClone(DAMAGE2_DEFAULTS);
  if (!saved || typeof saved !== "object") return merged;
  Object.keys(merged).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(saved, key)) return;
    if (key === "equipment") {
      merged.equipment = mergeDamage2Equipment(saved.equipment);
      return;
    }
    if (key === "equipmentInputMode") {
      merged.equipmentInputMode = ["direct", "total"].includes(saved.equipmentInputMode) ? saved.equipmentInputMode : DAMAGE2_DEFAULTS.equipmentInputMode;
      return;
    }
    const options = DAMAGE2_SELECT_OPTIONS[key];
    if (options) {
      merged[key] = Object.prototype.hasOwnProperty.call(options, saved[key]) ? saved[key] : DAMAGE2_DEFAULTS[key];
      return;
    }
    merged[key] = num(saved[key]);
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
