function resetGame() {
  if (!confirm("确定要清空存档重新开始吗？此操作不可恢复。")) return;

  // 1. 先清本地
  localStorage.removeItem("xiuxian_arpg_save");
  localStorage.removeItem("xiuxian_arpg_time");
  sessionStorage.setItem("skipCloudLoad", "1");

  // 2. 清云端，不管成功失败都刷新
  cloudReady = true;
  fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: null }),
  })
  .catch(() => {})
  .finally(() => {
    // 等 500ms 让 KV 写入生效，再刷新
    setTimeout(() => location.reload(), 500);
  });
}