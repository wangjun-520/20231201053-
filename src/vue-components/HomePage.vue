<template>
  <div class="homepage">
    <!-- 轮播图/搜索区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>发现有趣的世界</h1>
        <p>加入百度贴吧，与志同道合的人一起讨论</p>
        <div class="search-box">
          <input type="text" class="search-input" placeholder="搜索贴吧、帖子或用户" />
          <button class="search-btn">搜索</button>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 热门贴吧列表 -->
      <section class="hot-tiebas">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">🏠</span> 热门贴吧
          </h2>
          <a href="#" class="more-link">更多</a>
        </div>
        <div class="tieba-grid">
          <div class="tieba-item" v-for="tieba in hotTiebas" :key="tieba.id">
            <div class="tieba-avatar">{{ tieba.name.charAt(0) }}</div>
            <div class="tieba-name">{{ tieba.name }}</div>
            <div class="tieba-members">{{ tieba.memberCount }} 成员</div>
          </div>
        </div>
      </section>

      <!-- 热门帖子列表 -->
      <section class="hot-posts">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">🔥</span> 热门帖子
          </h2>
          <a href="#" class="more-link">更多</a>
        </div>
        <div class="post-list">
          <div class="post-item" v-for="post in hotPosts" :key="post.id">
            <div class="post-header">
              <div class="post-avatar">{{ post.author.charAt(0) }}</div>
              <div class="post-meta">
                <div class="post-author">{{ post.author }}</div>
                <div class="post-time">{{ post.time }}</div>
              </div>
            </div>
            <div class="post-title">{{ post.title }}</div>
            <div class="post-content">{{ post.content }}</div>
            <div class="post-stats">
              <span class="stat-item">👁️ {{ post.views }}</span>
              <span class="stat-item">💬 {{ post.replies }}</span>
              <span class="stat-item">👍 {{ post.likes }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据 - 热门贴吧
const hotTiebas = ref([
  { id: 1, name: '英雄联盟', memberCount: '1200万' },
  { id: 2, name: '王者荣耀', memberCount: '1500万' },
  { id: 3, name: '绝地求生', memberCount: '800万' },
  { id: 4, name: '动漫吧', memberCount: '2000万' },
  { id: 5, name: '电影吧', memberCount: '1800万' },
  { id: 6, name: '美食吧', memberCount: '900万' },
  { id: 7, name: '旅游吧', memberCount: '700万' },
  { id: 8, name: '健身吧', memberCount: '600万' }
])

// 模拟数据 - 热门帖子
const hotPosts = ref([
  {
    id: 1,
    title: '英雄联盟S13世界赛决赛前瞻：T1 vs LNG谁能夺冠？',
    content: '今年的世界赛真的太精彩了，T1和LNG都展现了超强的实力，决赛即将开始，大家觉得谁会最终夺冠呢？',
    author: '电竞小王子',
    time: '2小时前',
    views: 12580,
    replies: 3421,
    likes: 8965
  },
  {
    id: 2,
    title: '推荐一些冷门但非常好看的动漫',
    content: '最近看了几部冷门动漫，真的被惊艳到了，剧情和画面都非常出色，推荐给大家...',
    author: '动漫爱好者',
    time: '4小时前',
    views: 8923,
    replies: 1289,
    likes: 5678
  },
  {
    id: 3,
    title: '分享一道简单又好吃的家常菜做法',
    content: '今天给大家分享一道我最拿手的家常菜，简单易学，味道绝对不会让你失望...',
    author: '美食达人',
    time: '6小时前',
    views: 7654,
    replies: 876,
    likes: 4321
  },
  {
    id: 4,
    title: '求推荐适合夏天旅游的小众景点',
    content: '夏天快到了，想找一些人少景美的地方去旅游，大家有什么好的推荐吗？',
    author: '旅行博主',
    time: '8小时前',
    views: 5432,
    replies: 1098,
    likes: 3456
  }
])
</script>

<style scoped>
.homepage {
  min-height: 100vh;
}

/* 轮播图区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 40px;
}

.hero-content h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 20px;
  font-weight: 300;
}

.hero-content p {
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin-bottom: 30px;
  opacity: 0.9;
}

.search-box {
  display: flex;
  max-width: min(600px, 90vw);
  width: 100%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 25px;
  overflow: hidden;
  box-shadow: var(--shadow-heavy);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-input {
  flex: 1;
  padding: clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 1.25rem);
  border: none;
  font-size: clamp(0.875rem, 3vw, 1rem);
  outline: none;
  background: transparent;
  color: var(--text-primary);
  min-height: 44px;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-btn {
  background: linear-gradient(135deg, var(--secondary-color), #ff9800);
  color: white;
  border: none;
  padding: clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem);
  font-size: clamp(0.875rem, 3vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: linear-gradient(135deg, #ff9800, var(--secondary-color));
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

/* 主要内容区域 */
.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
  gap: clamp(1rem, 4vw, 2rem);
  margin-bottom: clamp(2rem, 6vw, 3rem);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 2rem;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* 热门贴吧列表 */
.hot-tiebas {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 18px;
}

.more-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.more-link:hover {
  color: var(--secondary-color);
}

.tieba-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(120px, 100%), 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
}

@media (max-width: 480px) {
  .tieba-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
}

.tieba-item {
  text-align: center;
  padding: 15px 10px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid #f0f0f0;
}

.tieba-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.tieba-avatar {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin: 0 auto 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.tieba-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tieba-members {
  font-size: 12px;
  color: #999;
}

/* 热门帖子列表 */
.hot-posts {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2vw, 1rem);
}

.post-item {
  padding: clamp(0.75rem, 3vw, 1rem);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.post-item:hover {
  background: rgba(255, 255, 255, 1);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.post-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.post-meta {
  flex: 1;
}

.post-author {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.post-time {
  color: #999;
  font-size: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.post-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .search-btn:hover,
  .tieba-item:hover,
  .post-item:hover {
    transform: none;
  }
  
  .search-btn:active,
  .tieba-item:active,
  .post-item:active {
    transform: scale(0.98);
  }
}

@media (max-width: 480px) {
  .search-box {
    border-radius: 20px;
  }
  
  .search-btn {
    padding: 0.75rem 1.25rem;
  }
}
</style>