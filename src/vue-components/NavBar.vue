<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- 网站Logo -->
      <router-link to="/" class="logo">百度贴吧</router-link>
      
      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-wrapper">
          <input 
            v-model="searchQuery" 
            type="text" 
            class="search-input" 
            placeholder="搜索帖子、用户或贴吧"
            @keyup.enter="performSearch"
          />
          <button class="search-btn" @click="performSearch">
            <span>🔍</span>
          </button>
        </div>
      </div>
      
      <!-- 汉堡菜单按钮 -->
      <button class="nav-toggle" @click="toggleNav" :class="{ active: isNavOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <!-- 导航链接 -->
      <ul class="nav-links" :class="{ active: isNavOpen }">
        <li><router-link to="/" @click="closeNav">首页</router-link></li>
        <li><router-link to="/discover" @click="closeNav">发现</router-link></li>
        <li><router-link to="/following" @click="closeNav">关注</router-link></li>
        <li><router-link to="/messages" @click="closeNav">消息</router-link></li>
      </ul>
      
      <!-- 用户操作区 -->
      <div class="nav-user">
        <router-link to="/login" class="btn btn-secondary">登录</router-link>
        <router-link to="/register" class="btn btn-primary">注册</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isNavOpen = ref(false)
const searchQuery = ref('')

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const closeNav = () => {
  isNavOpen.value = false
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    })
  }
}
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2rem);
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

/* 搜索框样式 */
.search-container {
  flex: 1;
  max-width: 500px;
  min-width: 200px;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.3rem;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-small);
}

.search-btn:hover {
  color: var(--primary-color);
  background: rgba(33, 150, 243, 0.1);
}

.logo {
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

/* 汉堡菜单按钮 */
.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
  background: none;
  border: none;
  z-index: 1001;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: var(--text-primary);
  margin: 3px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.nav-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle.active span:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.nav-links {
  display: flex;
  gap: clamp(1rem, 3vw, 2rem);
  list-style: none;
  align-items: center;
  margin-left: auto;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-primary);
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-medium);
  position: relative;
}

.nav-links a:hover {
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.nav-user {
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  align-items: center;
  flex-shrink: 0;
}

/* 按钮样式 */
.btn {
  padding: clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
  border: none;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  transition: all 0.3s ease;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  box-shadow: var(--shadow-medium);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-heavy);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

/* 移动端导航样式 */
@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }
  
  .search-container {
    display: none;
  }

  .nav-links {
    position: fixed;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    transition: left 0.3s ease;
    z-index: 1000;
    margin-left: 0;
  }

  .nav-links.active {
    left: 0;
  }

  .nav-links a {
    font-size: 1.25rem;
    padding: 1rem 2rem;
    width: 80%;
    text-align: center;
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .nav-user {
    gap: 0.5rem;
  }

  .nav-user .btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0.75rem 1rem;
  }

  .nav-user .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .btn:hover {
    transform: none;
  }
  
  .btn:active {
    transform: scale(0.98);
  }
  
  .nav-links a:hover {
    transform: none;
  }
  
  .nav-links a:active {
    background: rgba(102, 126, 234, 0.2);
  }
}
</style>