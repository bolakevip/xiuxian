function resetGame() {
  if (!confirm("确定要清空存档重新开始吗？此操作不可恢复。")) return;

  localStorage.removeItem("xiuxian_arpg_save");
  localStorage.removeItem("xiuxian_arpg_time");

  // 关键：不删，直接写一个全新空档覆盖云端
  const newState = {
    realmIndex: 0, exp: 0, hp: 100, maxHp: 100,
    stamina: 100, maxStamina: 100,
    basePower: 10, totalEquipBonus: 0, power: 10,
    critRate: 0.05, lifesteal: 0,
    gold: 0, stone: 0, kills: 0,
    sectPoint: 0, sectQuestProgress: 0, sectQuestTarget: 5,
    autoBreak: true,
    inventory: [],
    equipment: { weapon: null, armor: null, accessory: null },
    currentZone: 0,
    reincarnCount: 0, reincarnBonus: 0,
    setBonus: { active: false, count: 0, name: "" },
    gems: {},
    sign: { lastDate: "", streak: 0, days: [] },
    skills: {},
    skillPoints: 0,
    sect: null,
    skillCooldown: 0, buffAtk: 0, buffAtkValue: 0, buffDef: 0, stunTimer: 0,
    knownBooks: {},
    pets: [],
    activePet: null,
    talentPoints: 0,
    talents: {},
  };

  cloudReady = true;
  fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: newState }),
  })
  .catch(() => {})
  .finally(() => {
    setTimeout(() => location.reload(), 800);
  });
}