const assert = require("node:assert/strict");
const { calculateDamage2, DAMAGE2_DEFAULTS } = require("../app.js");

const hila = {
  ...structuredClone(DAMAGE2_DEFAULTS),
  weaponAttack: 2003305,
  weaponSpeed: 2.3,
  baseAttack: 992.2000281824022,
  displayedAttack: 71066808,
  grade: "L",
  personality: "nimble",
  heroAttack: 50,
  skillAttackAmp: 0,
  statAttack: 20,
  costumeAttack: 6,
  sealAttack: 14,
  ridingAttack: 42,
  fairyAttack: 2,
  secretAttack: 15,
  runeAttack: 0,
  gearAttack: 196,
  equipmentInputMode: "total",
};

const result = calculateDamage2(hila);
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`);

closeTo(result.groups.A, 2.47);
closeTo(result.groups.BTown, 4.91);
closeTo(result.groups.C, 0.85);
closeTo(result.groups.D, 2.439);
closeTo(result.groups.E, 1.02);
closeTo(result.groups.FTown, 1);
assert.equal(Math.trunc(result.townAttack), 71066808);

console.log("Hila page attack regression OK: 71,066,808");
