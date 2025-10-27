<template>
  <div class="user-profile-page">
    <!-- 用户头部信息 -->
    <div class="user-header">
      <div class="header-background"></div>
      <div class="user-info">
        <div class="user-avatar-container">
          <div class="user-avatar">{{ userInfo.username.charAt(0) }}</div>
        </div>
        <div class="user-details">
          <div class="username">{{ userInfo.username }}</div>
          <div class="user-meta">
            <span class="user-level">Lv.{{ userInfo.level }}</span>
            <span class="user-id">ID: {{ userInfo.id }}</span>
            <span class="join-date">加入于 {{ userInfo.joinDate }}</span>
          </div>
          <div class="user-signature">{{ userInfo.signature }}</div>
        </div>
        <div class="profile-actions">
          <button 
            v-if="!isCurrentUser" 
            class="follow-btn" 
            :class="{ followed: isFollowed }"
            @click="toggleFollow"
          >
            {{ isFollowed ? '已关注' : '关注' }}
          </button>
          <button class="message-btn" @click="sendMessage">
            发私信
          </button>
          <button v-if="isCurrentUser" class="edit-profile-btn" @click="editProfile">
            编辑资料
          </button>
        </div>
      </div>
    </div>
    
    <!-- 统计数据 -->
    <div class="user-stats">
      <div class="stat-item">
        <div class="stat-value">{{ userInfo.postCount }}</div>
        <div class="stat-label">帖子</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ userInfo.commentCount }}</div>
        <div class="stat-label">回复</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ userInfo.followingCount }}</div>
        <div class="stat-label">关注</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ userInfo.followerCount }}</div>
        <div class="stat-label">粉丝</div>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="profile-content">
      <!-- 导航选项卡 -->
      <div class="profile-tabs">
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
      
      <!-- 内容展示区域 -->
      <div class="tab-content">
        <!-- 帖子列表 -->
        <div v-if="activeTab === 'posts'" class="content-section">
          <div 
            v-for="post in userPosts" 
            :key="post.id" 
            class="post-item"
          >
            <router-link :to="`/post/${post.id}`" class="post-link">
              <div class="post-main">
                <div class="post-tieba">
                  <router-link :to="`/tieba/${post.tiebaId}`" class="tieba-link">
                    {{ post.tiebaName }}
                  </router-link>
                </div>
                <div class="post-title">{{ post.title }}</div>
                <div class="post-content">{{ post.summary }}</div>
                <div class="post-footer">
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
          
          <!-- 空状态 -->
          <div v-if="userPosts.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <div class="empty-text">暂无发布的帖子</div>
          </div>
        </div>
        
        <!-- 回复列表 -->
        <div v-else-if="activeTab === 'comments'" class="content-section">
          <div 
            v-for="comment in userComments" 
            :key="comment.id" 
            class="comment-item"
          >
            <div class="comment-content">
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-meta">
                <span class="comment-time">{{ comment.time }}</span>
                <span class="comment-to">
                  回复了 
                  <router-link :to="`/post/${comment.postId}`" class="post-title-link">
                    {{ comment.postTitle }}
                  </router-link>
                </span>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="userComments.length === 0" class="empty-state">
            <div class="empty-icon">💬</div>
            <div class="empty-text">暂无回复记录</div>
          </div>
        </div>
        
        <!-- 收藏列表 -->
        <div v-else-if="activeTab === 'collections'" class="content-section">
          <div 
            v-for="collection in userCollections" 
            :key="collection.id" 
            class="collection-item"
          >
            <router-link :to="`/post/${collection.postId}`" class="collection-link">
              <div class="collection-content">
                <div class="collection-tieba">
                  <router-link :to="`/tieba/${collection.tiebaId}`" class="tieba-link">
                    {{ collection.tiebaName }}
                  </router-link>
                </div>
                <div class="collection-title">{{ collection.postTitle }}</div>
                <div class="collection-meta">
                  <span class="collection-time">收藏于 {{ collection.collectTime }}</span>
                  <span class="collection-author">作者: {{ collection.author }}</span>
                </div>
              </div>
            </router-link>
          </div>
          
          <!-- 空状态 -->
          <div v-if="userCollections.length === 0" class="empty-state">
            <div class="empty-icon">⭐</div>
            <div class="empty-text">暂无收藏内容</div>
          </div>
        </div>
        
        <!-- 关注列表 -->
        <div v-else-if="activeTab === 'following'" class="content-section">
          <div class="following-list">
            <div 
              v-for="user in followingUsers" 
              :key="user.id" 
              class="following-user"
            >
              <router-link :to="`/user/${user.id}`" class="user-link">
                <div class="user-avatar-small">{{ user.username.charAt(0) }}</div>
                <div class="user-info-small">
                  <div class="username-small">{{ user.username }}</div>
                  <div class="user-posts-small">{{ user.postCount }} 帖子</div>
                </div>
              </router-link>
              <button 
                v-if="isCurrentUser" 
                class="unfollow-btn"
                @click="unfollowUser(user.id)"
              >
                已关注
              </button>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="followingUsers.length === 0" class="empty-state">
            <div class="empty-icon">👥</div>
            <div class="empty-text">暂无关注用户</div>
          </div>
        </div>
      </div>
      
      <!-- 侧边栏 -->
      <div class="profile-sidebar">
        <!-- 个人成就 -->
        <div class="sidebar-card">
          <h3>个人成就</h3>
          <div class="badges-list">
            <div v-for="badge in userInfo.badges" :key="badge.id" class="badge-item">
              <div class="badge-icon">{{ badge.icon }}</div>
              <div class="badge-info">
                <div class="badge-name">{{ badge.name }}</div>
                <div class="badge-date">{{ badge.date }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 关注的贴吧 -->
        <div class="sidebar-card">
          <h3>关注的贴吧</h3>
          <div class="joined-tiebas">
            <div 
              v-for="tieba in joinedTiebas" 
              :key="tieba.id" 
              class="joined-tieba"
            >
              <router-link :to="`/tieba/${tieba.id}`" class="tieba-link">
                <div class="tieba-icon">{{ tieba.name.charAt(0) }}</div>
                <div class="tieba-name">{{ tieba.name }}</div>
              </router-link>
            </div>
          </div>
          <button class="view-all-btn">查看全部</button>
        </div>
        
        <!-- 近期活动 -->
        <div class="sidebar-card">
          <h3>近期活动</h3>
          <div class="activities-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon">{{ activity.icon }}</div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCurrentUser = ref(true) // 假设当前访问的是自己的主页
const isFollowed = ref(false)
const activeTab = ref('posts')

// 选项卡
const tabs = [
  { id: 'posts', name: '帖子' },
  { id: 'comments', name: '回复' },
  { id: 'collections', name: '收藏' },
  { id: 'following', name: '关注' }
]

// 用户信息（模拟）
const userInfo = reactive({
  id: parseInt(route.params.id || 1),
  username: '电竞小王子',
  level: 12,
  joinDate: '2021-05-15',
  signature: '游戏不止，战斗不息！',
  postCount: 156,
  commentCount: 892,
  followingCount: 34,
  followerCount: 128,
  badges: [
    { id: 1, icon: '🏆', name: '赛事达人', date: '2023-10-25' },
    { id: 2, icon: '🔥', name: '热门作者', date: '2023-09-18' },
    { id: 3, icon: '🌟', name: '活跃用户', date: '2023-08-05' }
  ]
})

// 用户帖子（模拟）
const userPosts = ref([
  {
    id: 1,
    title: '英雄联盟S13世界赛决赛前瞻：T1 vs LNG谁能夺冠？',
    summary: '今年的世界赛真的太精彩了，T1和LNG都展现了超强的实力，决赛即将开始，大家觉得谁会最终夺冠呢？',
    tiebaId: 1,
    tiebaName: '英雄联盟',
    time: '2小时前',
    views: 12580,
    replies: 3421,
    likes: 8965,
    thumbnail: 'https://via.placeholder.com/120x90/667eea/ffffff?text=LOL'
  },
  {
    id: 2,
    title: '新版本打野路线全解析：从刷野到Gank',
    summary: '新版本野区改动很大，本文将详细分析各大打野英雄的最优路线和Gank时机，助你上分！',
    tiebaId: 1,
    tiebaName: '英雄联盟',
    time: '昨天',
    views: 8923,
    replies: 1289,
    likes: 5678
  }
])

// 用户回复（模拟）
const userComments = ref([
  {
    id: 101,
    content: '我觉得T1的中单太厉害了，LNG需要重点针对！',
    postId: 3,
    postTitle: '英雄联盟S13世界赛四强赛分析',
    time: '今天 15:30'
  },
  {
    id: 102,
    content: '这个攻略写得很详细，学到了不少东西！',
    postId: 5,
    postTitle: '中单选手必看的团战技巧',
    time: '昨天 20:45'
  }
])

// 用户收藏（模拟）
const userCollections = ref([
  {
    id: 201,
    postId: 7,
    postTitle: '英雄联盟全英雄技能解析',
    tiebaId: 1,
    tiebaName: '英雄联盟',
    author: '游戏百科',
    collectTime: '2023-12-05'
  },
  {
    id: 202,
    postId: 8,
    postTitle: '职业选手的键盘鼠标设置分享',
    tiebaId: 4,
    tiebaName: '游戏硬件',
    author: '电竞装备控',
    collectTime: '2023-11-28'
  }
])

// 关注的用户（模拟）
const followingUsers = ref([
  {
    id: 301,
    username: '游戏达人',
    postCount: 234
  },
  {
    id: 302,
    username: '赛事解说',
    postCount: 56
  },
  {
    id: 303,
    username: '打野王者',
    postCount: 189
  }
])

// 关注的贴吧（模拟）
const joinedTiebas = ref([
  { id: 1, name: '英雄联盟' },
  { id: 2, name: '电竞赛事' },
  { id: 3, name: '游戏攻略' }
])

// 近期活动（模拟）
const recentActivities = ref([
  { id: 401, icon: '👍', text: '点赞了帖子《新版本更新内容》', time: '10分钟前' },
  { id: 402, icon: '💬', text: '回复了帖子《打野技巧分享》', time: '2小时前' },
  { id: 403, icon: '⭐', text: '收藏了帖子《英雄联盟S13观赛指南》', time: '昨天' }
])

// 切换关注状态
const toggleFollow = () => {
  isFollowed.value = !isFollowed.value
}

// 发送私信
const sendMessage = () => {
  alert('私信功能待实现')
}

// 编辑个人资料
const editProfile = () => {
  alert('编辑资料功能待实现')
}

// 取消关注用户
const unfollowUser = (userId) => {
  const index = followingUsers.value.findIndex(user => user.id === userId)
  if (index > -1) {
    followingUsers.value.splice(index, 1)
    userInfo.followingCount--
  }
}

// 组件挂载时检查是否是当前用户
onMounted(() => {
  // 模拟从服务器检查状态
  // 这里简单判断，如果URL中的id不是1，则认为不是当前用户
  isCurrentUser.value = parseInt(route.params.id || 1) === 1
})
</script>

<style scoped>
.user-profile-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: var(--background-secondary);
}

/* 用户头部信息 */
.user-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0 3rem;
  margin-bottom: -50px;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://via.placeholder.com/1200x300/667eea/ffffff?text=Background');
  background-size: cover;
  background-position: center;
  opacity: 0.2;
}

.user-info {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.user-avatar-container {
  position: relative;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  border: 4px solid white;
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.username {
  font-size: 1.75rem;
  font-weight: 700;
}

.user-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.user-level {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-small);
}

.user-signature {
  font-size: 1rem;
  opacity: 0.8;
  max-width: 600px;
}

.profile-actions {
  display: flex;
  gap: 1rem;
}

.follow-btn,
.message-btn,
.edit-profile-btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.follow-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.follow-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.follow-btn.followed {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.message-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.message-btn:hover {
  transform: translateY(-2px);
}

.edit-profile-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.edit-profile-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

/* 统计数据 */
.user-stats {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  background: white;
  border-radius: 12px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

/* 内容区域 */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

/* 导航选项卡 */
.profile-tabs {
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

/* 内容展示区域 */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

/* 帖子列表 */
.post-item {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}

.post-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.post-link {
  display: flex;
  text-decoration: none;
  color: inherit;
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

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.post-thumbnail {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius-small);
}

/* 回复列表 */
.comment-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.comment-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.comment-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.comment-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.comment-time {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.comment-to {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.post-title-link {
  color: var(--primary-color);
  text-decoration: none;
}

.post-title-link:hover {
  text-decoration: underline;
}

/* 收藏列表 */
.collection-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.collection-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.collection-link {
  text-decoration: none;
  color: inherit;
}

.collection-tieba {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.collection-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.collection-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* 关注列表 */
.following-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.following-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
}

.user-avatar-small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info-small {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.username-small {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-posts-small {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.unfollow-btn {
  background: none;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-medium);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.unfollow-btn:hover {
  background: var(--primary-color);
  color: white;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
}

.empty-text {
  font-size: 1rem;
}

/* 侧边栏 */
.profile-sidebar {
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

/* 个人成就 */
.badges-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.badge-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.badge-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
}

.badge-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* 关注的贴吧 */
.joined-tiebas {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.joined-tieba {
  text-align: center;
}

.joined-tieba .tieba-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: var(--border-radius-medium);
  transition: all 0.3s ease;
}

.joined-tieba .tieba-link:hover {
  background: var(--background-secondary);
}

.tieba-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
}

.tieba-name {
  font-size: 0.85rem;
  color: var(--text-primary);
}

.view-all-btn {
  width: 100%;
  padding: 0.5rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* 近期活动 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  gap: 0.75rem;
}

.activity-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-text {
  font-size: 0.85rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  .profile-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .user-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-details {
    align-items: center;
  }
  
  .user-signature {
    max-width: none;
  }
  
  .profile-actions {
    width: 100%;
    justify-content: center;
  }
  
  .user-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .stat-divider {
    display: none;
  }
  
  .stat-item {
    width: 48%;
  }
  
  .post-link {
    flex-direction: column;
  }
  
  .post-thumbnail {
    width: 100%;
    height: 180px;
  }
  
  .following-user {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .unfollow-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .user-header {
    padding: 1.5rem 0 2.5rem;
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
    font-size: 2rem;
  }
  
  .username {
    font-size: 1.5rem;
  }
  
  .user-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .user-stats {
    border-radius: 8px;
    padding: 1rem;
  }
  
  .profile-tabs {
    border-radius: 8px;
  }
  
  .tab-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .content-section {
    border-radius: 8px;
    padding: 1rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .message-btn:hover,
  .edit-profile-btn:hover,
  .follow-btn:hover,
  .unfollow-btn:hover,
  .view-all-btn:hover {
    transform: none;
  }
  
  .message-btn:active,
  .edit-profile-btn:active,
  .follow-btn:active,
  .unfollow-btn:active,
  .view-all-btn:active {
    transform: scale(0.98);
  }
}
</style>