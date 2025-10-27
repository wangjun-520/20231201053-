<template>
  <div class="app">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import NavBar from './vue-components/NavBar.vue'
import Footer from './vue-components/Footer.vue'
import './style.css'
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-md);
  }
}
</style>