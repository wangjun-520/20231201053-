<template>
  <div class="search-page">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-container">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            class="search-input" 
            placeholder="搜索帖子、用户或贴吧"
            @keyup.enter="performSearch"
          />
          <button class="search-btn" @click="performSearch">
            <span class="search-icon">🔍</span>
            搜索
          </button>
        </div>
        <div class="search-tabs">
          <button 
            v-for="tab in searchTabs" 
            :key="tab.id" 
            class="tab-btn" 
            :class="{ active: activeTab === tab.id }"
            @click="setActiveTab(tab.id)"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 搜索结果 -->
    <div class="search-results">
      <!-- 搜索中状态 -->
      <div v-if="isSearching" class="loading-state">
        <div class="loading-icon spinner"></div>
        <div class="loading-text">搜索中...</div>
      </div>
      
      <!-- 搜索结果 -->
      <div v-else-if="searchQuery && hasResults" class="results-content">
        <!-- 帖子结果 -->
        <div v-if="activeTab === 'posts'" class="results-section">
          <div class="section-header">
            <h2>帖子结果</h2>
            <div class="result-count">{{ postResults.length }} 个结果</div>
          </div>
          <div class="post-results">
            <div 
              v-for="post in postResults" 
              :key="post.id" 
              class="search-post-item"
            >
              <router-link :to="`/post/${post.id}`" class="post-link">
                <div class="post-main">
                  <div class="post-tieba">
                    <router-link :to="`/tieba/${post.tiebaId}`" class="tieba-link">
                      {{ post.tiebaName }}
                    </router-link>
                  </div>
                  <div class="post-title" v-html="highlightText(post.title)"></div>
                  <div class="post-content" v-html="highlightText(post.summary)"></div>
                  <div class="post-meta">
                    <span class="post-author">{{ post.author }}</span>
                    <span class="post-time">{{ post.time }}</span>
                    <div class="post-stats">
                      <span class="stat-item">👁️ {{ post.views }}</span>
                      <span class="stat-item">💬 {{ post.replies }}</span>
                      <span class="stat-item">👍 {{ post.likes }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="post.thumbnail" class="post-thumbnail">
                  <img :src="post.thumbnail" :alt="post.title" />
                </div>
              </router-link>
            </div>
          </div>
          
          <!-- 分页 -->
          <div v-if="postResults.length > 0" class="pagination">
            <button 
              class="page-btn" 
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              上一页
            </button>
            <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
            <button 
              class="page-btn" 
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              下一页
            </button>
          </div>
        </div>
        
        <!-- 贴吧结果 -->
        <div v-else-if="activeTab === 'tiebas'" class="results-section">
          <div class="section-header">
            <h2>贴吧结果</h2>
            <div class="result-count">{{ tiebaResults.length }} 个结果</div>
          </div>
          <div class="tieba-results">
            <div 
              v-for="tieba in tiebaResults" 
              :key="tieba.id" 
              class="search-tieba-item"
            >
              <router-link :to="`/tieba/${tieba.id}`" class="tieba-link">
                <div class="tieba-info">
                  <div class="tieba-icon-large">{{ tieba.name.charAt(0) }}</div>
                  <div class="tieba-details">
                    <div class="tieba-name" v-html="highlightText(tieba.name)"></div>
                    <div class="tieba-description" v-html="highlightText(tieba.description)"></div>
                    <div class="tieba-stats">
                      <span class="stat-item">{{ tieba.members }} 成员</span>
                      <span class="stat-item">{{ tieba.postCount }} 帖子</span>
                    </div>
                  </div>
                </div>
                <button class="join-btn">加入</button>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- 用户结果 -->
        <div v-else-if="activeTab === 'users'" class="results-section">
          <div class="section-header">
            <h2>用户结果</h2>
            <div class="result-count">{{ userResults.length }} 个结果</div>
          </div>
          <div class="user-results">
            <div 
              v-for="user in userResults" 
              :key="user.id" 
              class="search-user-item"
            >
              <router-link :to="`/user/${user.id}`" class="user-link">
                <div class="user-avatar-large">{{ user.username.charAt(0) }}</div>
                <div class="user-info">
                  <div class="username" v-html="highlightText(user.username)"></div>
                  <div class="user-meta">
                    <span class="user-level">Lv.{{ user.level }}</span>
                    <span class="user-posts">{{ user.postCount }} 帖子</span>
                    <span class="user-followers">{{ user.followers }} 粉丝</span>
                  </div>
                  <div class="user-signature" v-html="highlightText(user.signature)"></div>
                </div>
              </router-link>
              <button 
                class="follow-btn" 
                :class="{ followed: user.isFollowed }"
                @click="toggleFollow(user.id)"
              >
                {{ user.isFollowed ? '已关注' : '关注' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 无结果状态 -->
      <div v-else-if="searchQuery && !hasResults" class="no-results">
        <div class="no-results-icon">🔍</div>
        <div class="no-results-text">未找到与 "{{ searchQuery }}" 相关的内容</div>
        <div class="no-results-suggestion">
          建议：
          <ul>
            <li>检查拼写是否正确</li>
            <li>尝试使用更常见的关键词</li>
            <li>缩小搜索范围</li>
          </ul>
        </div>
      </div>
      
      <!-- 初始状态 -->
      <div v-else class="initial-state">
        <div class="initial-icon">🔍</div>
        <div class="initial-text">在上方搜索栏输入关键词开始搜索</div>
        <div class="hot-searches">
          <h3>热门搜索</h3>
          <div class="hot-search-tags">
            <span 
              v-for="(tag, index) in hotSearchTags" 
              :key="index"
              class="hot-search-tag"
              @click="searchQuery = tag; performSearch()"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = ref('')
const activeTab = ref('posts')
const isSearching = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

// 搜索选项卡
const searchTabs = [
  { id: 'posts', name: '帖子' },
  { id: 'tiebas', name: '贴吧' },
  { id: 'users', name: '用户' }
]

// 热门搜索标签
const hotSearchTags = ref([
  '英雄联盟', 'S13世界赛', '原神4.4', '王者荣耀', '数码宝贝',
  '电影推荐', '学习方法', '美食分享', '旅行攻略', '职场经验'
])

// 帖子搜索结果（模拟）
const postResults = ref([])

// 贴吧搜索结果（模拟）
const tiebaResults = ref([])

// 用户搜索结果（模拟）
const userResults = ref([])

// 是否有结果
const hasResults = computed(() => {
  if (activeTab.value === 'posts') return postResults.value.length > 0
  if (activeTab.value === 'tiebas') return tiebaResults.value.length > 0
  if (activeTab.value === 'users') return userResults.value.length > 0
  return false
})

// 执行搜索
const performSearch = () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  currentPage.value = 1
  
  // 模拟搜索延迟
  setTimeout(() => {
    generateMockResults()
    isSearching.value = false
  }, 500)
}

// 设置活动选项卡
const setActiveTab = (tabId) => {
  activeTab.value = tabId
  if (searchQuery.value.trim()) {
    generateMockResults()
  }
}

// 改变页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  performSearch()
}

// 切换关注状态
const toggleFollow = (userId) => {
  const user = userResults.value.find(u => u.id === userId)
  if (user) {
    user.isFollowed = !user.isFollowed
  }
}

// 高亮搜索文本
const highlightText = (text) => {
  if (!searchQuery.value.trim()) return text
  
  const regex = new RegExp(`(${searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<span class="highlight-text">$1</span>')
}

// 生成模拟结果
const generateMockResults = () => {
  const query = searchQuery.value.toLowerCase()
  
  // 帖子结果
  if (activeTab.value === 'posts') {
    postResults.value = [
      {
        id: 1,
        title: `${query}相关话题讨论`,
        summary: `这是一个关于${query}的热门讨论帖，包含了最新的${query}资讯和用户分享的经验。`,
        tiebaId: 1,
        tiebaName: '英雄联盟',
        author: '游戏达人',
        time: '2小时前',
        views: 12580,
        replies: 3421,
        likes: 8965,
        thumbnail: 'https://via.placeholder.com/120x90/667eea/ffffff?text=' + encodeURIComponent(query)
      },
      {
        id: 2,
        title: `${query}攻略分享`,
        summary: `分享一些${query}的实用技巧和攻略，帮助新手快速上手${query}。`,
        tiebaId: 2,
        tiebaName: '游戏攻略',
        author: '攻略大神',
        time: '昨天',
        views: 8923,
        replies: 1289,
        likes: 5678
      },
      {
        id: 3,
        title: `如何提高${query}技术？`,
        summary: `想成为${query}高手？这篇帖子告诉你提升${query}技术的关键方法。`,
        tiebaId: 3,
        tiebaName: '电竞技巧',
        author: '技术顾问',
        time: '3天前',
        views: 15678,
        replies: 2345,
        likes: 6789,
        thumbnail: 'https://via.placeholder.com/120x90/764ba2/ffffff?text=' + encodeURIComponent(query)
      }
    ]
    totalPages.value = 5
  }
  
  // 贴吧结果
  else if (activeTab.value === 'tiebas') {
    tiebaResults.value = [
      {
        id: 1,
        name: `${query}爱好者`,
        description: `欢迎来到${query}爱好者贴吧，这里是${query}玩家交流的天堂。`,
        members: 123456,
        postCount: 789012
      },
      {
        id: 2,
        name: `${query}攻略`,
        description: `专注于${query}攻略分享和技术交流，助你成为${query}达人。`,
        members: 56789,
        postCount: 345678
      }
    ]
  }
  
  // 用户结果
  else if (activeTab.value === 'users') {
    userResults.value = [
      {
        id: 1,
        username: `${query}高手`,
        level: 12,
        postCount: 156,
        followers: 1289,
        signature: `热爱${query}，分享${query}心得。`,
        isFollowed: false
      },
      {
        id: 2,
        username: `${query}解说`,
        level: 15,
        postCount: 342,
        followers: 5678,
        signature: `专业${query}解说，带你了解${query}的每一个细节。`,
        isFollowed: true
      }
    ]
  }
}

// 组件挂载时检查URL参数
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q
    performSearch()
  }
})
</script>

<style scoped>
.search-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: var(--background-secondary);
}

/* 搜索头部 */
.search-header {
  background: var(--primary-color);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-medium);
  border: none;
  font-size: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  color: var(--primary-color);
  border: none;
  border-radius: var(--border-radius-medium);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.search-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-medium);
  padding: 0.25rem;
}

.tab-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--border-radius-small);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tab-btn.active {
  background: white;
  color: var(--primary-color);
}

/* 搜索结果区域 */
.search-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  gap: 1rem;
}

.loading-icon {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* 结果内容 */
.results-content {
  background: white;
  border-radius: var(--border-radius-large);
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  overflow: hidden;
}

.results-section {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.result-count {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 帖子结果 */
.post-results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-post-item {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}

.search-post-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.post-link {
  display: flex;
  text-decoration: none;
  color: inherit;
  gap: 1rem;
}

.post-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-tieba {
  font-size: 0.85rem;
}

.tieba-link {
  color: var(--primary-color);
  text-decoration: none;
}

.tieba-link:hover {
  text-decoration: underline;
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
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

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.post-author {
  font-weight: 500;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.post-thumbnail {
  width: 120px;
  height: 90px;
  flex-shrink: 0;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius-small);
}

/* 贴吧结果 */
.tieba-results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-tieba-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  transition: all 0.3s ease;
}

.search-tieba-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.search-tieba-item .tieba-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  color: inherit;
}

.tieba-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tieba-icon-large {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.tieba-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tieba-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tieba-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tieba-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.join-btn {
  padding: 0.5rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-medium);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn:hover {
  background: var(--primary-color-dark);
  transform: translateY(-2px);
}

/* 用户结果 */
.user-results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  transition: all 0.3s ease;
}

.search-user-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.search-user-item .user-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  color: inherit;
  text-decoration: none;
}

.user-avatar-large {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.username {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.user-level {
  background: var(--primary-color-light);
  color: var(--primary-color-dark);
  padding: 0.1rem 0.5rem;
  border-radius: var(--border-radius-small);
  font-weight: 500;
}

.user-signature {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.follow-btn {
  padding: 0.5rem 1.5rem;
  background: none;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  border-radius: var(--border-radius-medium);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.follow-btn:hover {
  background: var(--primary-color);
  color: white;
}

.follow-btn.followed {
  background: var(--primary-color);
  color: white;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 无结果状态 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  gap: 1rem;
  background: white;
  border-radius: var(--border-radius-large);
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.no-results-icon {
  font-size: 4rem;
}

.no-results-text {
  font-size: 1.25rem;
  color: var(--text-primary);
  font-weight: 500;
}

.no-results-suggestion {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 400px;
}

.no-results-suggestion ul {
  list-style: disc;
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}

/* 初始状态 */
.initial-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  gap: 2rem;
  background: white;
  border-radius: var(--border-radius-large);
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.initial-icon {
  font-size: 4rem;
}

.initial-text {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.hot-searches {
  max-width: 600px;
  width: 100%;
}

.hot-searches h3 {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.hot-search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.hot-search-tag {
  padding: 0.5rem 1rem;
  background: var(--background-secondary);
  color: var(--text-primary);
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hot-search-tag:hover {
  background: var(--primary-color-light);
  color: var(--primary-color-dark);
  transform: translateY(-2px);
}

/* 高亮文本 */
.highlight-text {
  background: var(--primary-color-light);
  color: var(--primary-color-dark);
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-header {
    padding: 1.5rem 0;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-btn {
    width: 100%;
    justify-content: center;
  }
  
  .post-link {
    flex-direction: column;
  }
  
  .post-thumbnail {
    width: 100%;
    height: 180px;
  }
  
  .search-tieba-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-tieba-item .tieba-link {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .tieba-info {
    flex-direction: column;
  }
  
  .join-btn {
    width: 100%;
  }
  
  .search-user-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-user-item .user-link {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .follow-btn {
    width: 100%;
  }
  
  .hot-search-tags {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .search-header {
    padding: 1rem 0;
  }
  
  .search-input {
    font-size: 0.9rem;
  }
  
  .search-tabs {
    padding: 0.1rem;
  }
  
  .tab-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .results-section {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .user-meta {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .search-btn:hover,
  .join-btn:hover,
  .follow-btn:hover,
  .hot-search-tag:hover,
  .page-btn:hover {
    transform: none;
  }
  
  .search-btn:active,
  .join-btn:active,
  .follow-btn:active,
  .hot-search-tag:active,
  .page-btn:active {
    transform: scale(0.98);
  }
}
</style>