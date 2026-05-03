<template>
  <div class="skeleton-card">
    <div class="skeleton-img"></div>
    <div class="skeleton-info">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.skeleton-img {
  width: 100%;
  height: clamp(300px, 52vh, 520px);
  background: #2a2620;
  border-radius: 10px;
  animation: pulse 1.2s infinite;
}
.skeleton-info {
  display: flex;
  justify-content: space-between;
}
.skeleton-line {
  height: 16px;
  background: #2a2620;
  border-radius: 4px;
  width: 60%;
  animation: pulse 1.2s infinite;
}
.skeleton-line.short {
  width: 30%;
}
@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}
</style>