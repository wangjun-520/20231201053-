<template>
  <div class="tieba-detail-page">
    <!-- 贴吧头部横幅 -->
    <div class="tieba-header-banner">
      <div class="tieba-banner-content">
        <div class="tieba-info">
          <div class="tieba-icon-large">{{ tiebaInfo.name.charAt(0) }}</div>
          <div class="tieba-meta">
            <h1 class="tieba-name">{{ tiebaInfo.name }}</h1>
            <div class="tieba-stats">
              <span>{{ tiebaInfo.memberCount }} 成员</span>
              <span class="separator">·</span>
              <span>{{ tiebaInfo.postCount }} 帖子</span>
            </div>
          </div>
        </div>
        <div class="tieba-actions">
          <button class="join-btn" :class="{ joined: isJoined }" @click="toggleJoin">
            {{ isJoined ? '已加入' : '加入贴吧' }}
          </button>
          <button class="post-btn" @click="goToCreatePost">
            <span class="post-icon">✍️</span>
            发布帖子
          </button>
        </div>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="tieba-content">
      <!-- 导航选项卡 -->
      <div class="tieba-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          class="tab-btn" 
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
      
      <!-- 帖子筛选 -->
      <div class="post-filter">
        <div class="filter-options">
          <button 
            v-for="filter in filters" 
            :key="filter.id" 
            class="filter-btn" 
            :class="{ active: activeFilter === filter.id }"
            @click="activeFilter = filter.id"
          >
            {{ filter.name }}
          </button>
        </div>
        <div class="search-bar">
          <input type="text" class="search-input" placeholder="在贴吧内搜索" />
          <button class="search-btn">🔍</button>
        </div>
      </div>
      
      <!-- 帖子列表 -->
      <div class="post-list-container">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="post-item"
        >
          <router-link :to="`/post/${post.id}`" class="post-link">
            <div class="post-main">
              <div class="post-header">
                <div class="post-title">{{ post.title }}</div>
                <div class="post-tags">
                  <span v-for="tag in post.tags" :key="tag" class="post-tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="post-content">
                {{ post.summary }}
              </div>
              <div class="post-footer">
                <div class="post-author-info">
                  <div class="author-avatar">{{ post.author.charAt(0) }}</div>
                  <span class="author-name">{{ post.author }}</span>
                  <span class="post-time">{{ post.time }}</span>
                </div>
                <div class="post-stats">
                  <span class="stat-item">👁️ {{ post.views }}</span>
                  <span class="stat-item">💬 {{ post.replies }}</span>
                  <span class="stat-item">👍 {{ post.likes }}</span>
                </div>
              </div>
            </div>
            <!-- 帖子缩略图 -->
            <div v-if="post.thumbnail" class="post-thumbnail">
              <img :src="post.thumbnail" :alt="post.title" />
            </div>
          </router-link>
        </div>
        
        <!-- 加载更多 -->
        <div class="load-more">
          <button class="load-more-btn" @click="loadMorePosts" :disabled="isLoading">
            {{ isLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
      
      <!-- 侧边栏 -->
      <div class="tieba-sidebar">
        <!-- 贴吧信息 -->
        <div class="sidebar-card">
          <h3>贴吧简介</h3>
          <p class="tieba-description">{{ tiebaInfo.description }}</p>
          <div class="tieba-admin">
            <div class="admin-label">吧主</div>
            <div class="admin-list">
              <div class="admin-item" v-for="admin in tiebaInfo.admins" :key="admin">
                <div class="admin-avatar">{{ admin.charAt(0) }}</div>
                <span class="admin-name">{{ admin }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 热门话题 -->
        <div class="sidebar-card">
          <h3>热门话题</h3>
          <div class="topic-list">
            <a href="#" class="topic-item" v-for="topic in hotTopics" :key="topic.id">
              <span class="topic-number">{{ topic.id }}</span>
              <span class="topic-name">{{ topic.name }}</span>
              <span class="topic-hot">{{ topic.hot }}</span>
            </a>
          </div>
        </div>
        
        <!-- 推荐贴吧 -->
        <div class="sidebar-card">
          <h3>推荐贴吧</h3>
          <div class="recommended-tiebas">
            <a 
              href="#" 
              class="recommended-tieba" 
              v-for="recTieba in recommendedTiebas" 
              :key="recTieba.id"
            >
              <div class="rec-tieba-icon">{{ recTieba.name.charAt(0) }}</div>
              <div class="rec-tieba-info">
                <span class="rec-tieba-name">{{ recTieba.name }}</span>
                <span class="rec-tieba-members">{{ recTieba.members }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isJoined = ref(false)
const activeTab = ref('hot')
const activeFilter = ref('all')
const isLoading = ref(false)

// 选项卡
const tabs = [
  { id: 'hot', name: '热门' },
  { id: 'new', name: '最新' },
  { id: 'following', name: '关注' }
]

// 筛选选项
const filters = [
  { id: 'all', name: '全部' },
  { id: 'text', name: '文字' },
  { id: 'image', name: '图片' },
  { id: 'video', name: '视频' }
]

// 贴吧信息（模拟）
const tiebaInfo = reactive({
  id: parseInt(route.params.id || 1),
  name: '英雄联盟',
  description: '英雄联盟官方贴吧，LPL、LCK、LCS、LEC等全球赛事讨论，英雄攻略，游戏技巧分享，让我们一起峡谷相见！',
  memberCount: '1200万',
  postCount: '3800万',
  admins: ['英雄联盟吧主', '电竞管理员', '赛事解说']
})

// 帖子列表（模拟）
const posts = ref([
  {
    id: 1,
    title: '英雄联盟S13世界赛决赛前瞻：T1 vs LNG谁能夺冠？',
    summary: '今年的世界赛真的太精彩了，T1和LNG都展现了超强的实力，决赛即将开始，大家觉得谁会最终夺冠呢？',
    author: '电竞小王子',
    time: '2小时前',
    views: 12580,
    replies: 3421,
    likes: 8965,
    tags: ['赛事'],
    thumbnail: 'https://via.placeholder.com/120x90/667eea/ffffff?text=LOL'
  },
  {
    id: 2,
    title: '新版本打野路线全解析：从刷野到Gank',
    summary: '新版本野区改动很大，本文将详细分析各大打野英雄的最优路线和Gank时机，助你上分！',
    author: '打野王者',
    time: '4小时前',
    views: 8923,
    replies: 1289,
    likes: 5678,
    tags: ['攻略']
  },
  {
    id: 3,
    title: '分享一波我的新皮肤收藏，终于集齐了！',
    summary: '经过不懈努力，终于集齐了所有限定皮肤，来分享一下我的收藏，大家觉得哪款最好看？',
    author: '皮肤收藏家',
    time: '昨天',
    views: 15678,
    replies: 2345,
    likes: 12345,
    tags: ['皮肤'],
    thumbnail: 'https://via.placeholder.com/120x90/764ba2/ffffff?text=Skin'
  },
  {
    id: 4,
    title: '寻找开黑队友，钻石段位，主玩中上',
    summary: '本人钻石2，擅长中单位置，偶尔也能打上路，想找固定开黑队友，最好是打野和下路组合。',
    author: '上分达人',
    time: '3天前',
    views: 5678,
    replies: 789,
    likes: 456,
    tags: ['组队']
  },
  {
    id: 5,
    title: '新英雄技能解析与出装推荐',
    summary: '新英雄终于上线了！这里是详细的技能解析和出装思路，让你快速上手新英雄。',
    author: '英雄研究所',
    time: '1周前',
    views: 23456,
    replies: 4567,
    likes: 18901,
    tags: ['攻略', '新英雄'],
    thumbnail: 'https://via.placeholder.com/120x90/f093fb/ffffff?text=New'
  }
])

// 热门话题（模拟）
const hotTopics = [
  { id: 1, name: '#S13世界赛#', hot: '2.3万' },
  { id: 2, name: '#新版本更新#', hot: '1.8万' },
  { id: 3, name: '#LPL春季赛#', hot: '1.5万' },
  { id: 4, name: '#打野攻略#', hot: '1.2万' },
  { id: 5, name: '#皮肤折扣#', hot: '9千' }
]

// 推荐贴吧（模拟）
const recommendedTiebas = [
  { id: 101, name: '王者荣耀', members: '1500万' },
  { id: 102, name: '绝地求生', members: '800万' },
  { id: 103, name: '电竞吧', members: '600万' },
  { id: 104, name: '游戏解说', members: '400万' }
]

// 切换关注状态
const toggleJoin = () => {
  isJoined.value = !isJoined.value
}

// 跳转到发布帖子页面
const goToCreatePost = () => {
  router.push({ path: '/create-post', query: { tiebaId: tiebaInfo.id } })
}

// 加载更多帖子
const loadMorePosts = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 模拟加载更多帖子
  const newPosts = [
    {
      id: posts.value.length + 1,
      title: '盘点英雄联盟史上最强中单选手',
      summary: '英雄联盟发展至今，涌现了许多优秀的中单选手，本文将盘点那些被称为"世界第一中单"的选手。',
      author: '电竞历史控',
      time: '2周前',
      views: 18901,
      replies: 3456,
      likes: 12345,
      tags: ['历史']
    }
  ]
  
  posts.value.push(...newPosts)
  isLoading.value = false
}

// 组件挂载时检查用户是否已关注该贴吧
onMounted(() => {
  // 模拟从服务器检查状态
  setTimeout(() => {
    isJoined.value = Math.random() > 0.5
  }, 500)
})
</script>

<style scoped>
.tieba-detail-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
}

/* 贴吧头部横幅 */
.tieba-header-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 1rem;
  margin-bottom: 2rem;
}

.tieba-banner-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tieba-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.tieba-icon-large {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.tieba-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tieba-name {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.tieba-stats {
  font-size: 1rem;
  opacity: 0.9;
}

.tieba-stats .separator {
  margin: 0 0.75rem;
}

.tieba-actions {
  display: flex;
  gap: 1rem;
}

.join-btn,
.post-btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.join-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.join-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.join-btn.joined {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.post-btn {
  background: white;
  color: #667eea;
}

.post-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

/* 内容区域 */
.tieba-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

/* 导航选项卡 */
.tieba-tabs {
  grid-column: 1 / -1;
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.tab-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-btn:hover {
  background: var(--background-secondary);
  color: var(--primary-color);
}

.tab-btn.active {
  color: var(--primary-color);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary-color);
}

/* 帖子筛选 */
.post-filter {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.filter-options {
  display: flex;
  gap: 0.75rem;
}

.filter-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  font-size: 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.search-bar {
  display: flex;
  background: var(--background-secondary);
  border-radius: var(--border-radius-medium);
  overflow: hidden;
}

.search-input {
  padding: 0.5rem 1rem;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.9rem;
  width: 200px;
}

.search-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-secondary);
}

/* 帖子列表 */
.post-list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.post-link {
  display: flex;
  text-decoration: none;
  color: inherit;
}

.post-main {
  flex: 1;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
}

.post-tag {
  font-size: 0.75rem;
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-small);
  align-self: flex-start;
}

.post-content {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.post-author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.author-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.post-time {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.post-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.post-thumbnail {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.load-more-btn {
  background: none;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 侧边栏 */
.tieba-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.sidebar-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

/* 贴吧简介 */
.tieba-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.tieba-admin {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.admin-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.admin-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.admin-name {
  font-size: 0.85rem;
  color: var(--text-primary);
}

/* 热门话题 */
.topic-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--border-radius-medium);
  text-decoration: none;
  transition: all 0.3s ease;
  color: inherit;
}

.topic-item:hover {
  background: var(--background-secondary);
}

.topic-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  flex-shrink: 0;
}

.topic-name {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.topic-hot {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 推荐贴吧 */
.recommended-tiebas {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recommended-tieba {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--border-radius-medium);
  text-decoration: none;
  transition: all 0.3s ease;
  color: inherit;
}

.recommended-tieba:hover {
  background: var(--background-secondary);
}

.rec-tieba-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.rec-tieba-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.rec-tieba-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
}

.rec-tieba-members {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .tieba-content {
    grid-template-columns: 1fr;
  }
  
  .tieba-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .tieba-banner-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .tieba-info {
    flex-direction: column;
  }
  
  .tieba-name {
    font-size: 1.5rem;
  }
  
  .tieba-actions {
    width: 100%;
    justify-content: center;
  }
  
  .post-filter {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-options {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .search-input {
    width: 100%;
  }
  
  .post-link {
    flex-direction: column;
  }
  
  .post-thumbnail {
    width: 100%;
    height: 200px;
  }
  
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .tieba-header-banner {
    padding: 1.5rem 1rem;
  }
  
  .tieba-icon-large {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .tieba-actions {
    flex-direction: column;
  }
  
  .join-btn,
  .post-btn {
    width: 100%;
    justify-content: center;
  }
  
  .tieba-tabs {
    border-radius: 8px;
  }
  
  .tab-btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .post-filter,
  .post-item,
  .load-more {
    border-radius: 8px;
  }
  
  .post-main {
    padding: 1rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .post-item:hover {
    transform: none;
  }
  
  .post-btn:hover,
  .load-more-btn:hover:not(:disabled) {
    transform: none;
  }
  
  .post-btn:active,
  .load-more-btn:active:not(:disabled) {
    transform: scale(0.98);
  }
}
</style>