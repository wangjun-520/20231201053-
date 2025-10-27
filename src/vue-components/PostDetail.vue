<template>
  <div class="post-detail-page">
    <div class="post-detail-container">
      <!-- 返回链接 -->
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span class="separator">/</span>
        <router-link :to="`/tieba/${post.tiebaId}`">{{ post.tiebaName }}</router-link>
        <span class="separator">/</span>
        <span>帖子详情</span>
      </div>
      
      <!-- 帖子内容区域 -->
      <div class="post-content-wrapper">
        <article class="post-content">
          <div class="post-header">
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <div class="author-info">
                <div class="author-avatar">{{ post.author.charAt(0) }}</div>
                <div class="author-details">
                  <div class="author-name">{{ post.author }}</div>
                  <div class="post-time">{{ post.publishTime }}</div>
                </div>
              </div>
              <div class="post-stats">
                <span class="stat-item">👁️ {{ post.viewCount }}</span>
                <span class="stat-item">💬 {{ post.commentCount }}</span>
                <span class="stat-item">👍 {{ post.likeCount }}</span>
              </div>
            </div>
          </div>
          
          <div class="post-body">
            <div class="post-text" v-html="formatContent(post.content)"></div>
            
            <!-- 帖子图片 -->
            <div class="post-images" v-if="post.images && post.images.length > 0">
              <div class="image-item" v-for="(image, index) in post.images" :key="index">
                <img :src="image.url" :alt="`帖子图片${index + 1}`" />
              </div>
            </div>
          </div>
          
          <div class="post-actions">
            <button class="action-btn" @click="likePost">
              <span class="action-icon">{{ isLiked ? '❤️' : '🤍' }}</span>
              <span>点赞</span>
            </button>
            <button class="action-btn" @click="collectPost">
              <span class="action-icon">{{ isCollected ? '⭐' : '☆' }}</span>
              <span>收藏</span>
            </button>
            <button class="action-btn" @click="sharePost">
              <span class="action-icon">📤</span>
              <span>分享</span>
            </button>
          </div>
        </article>
        
        <!-- 回复统计 -->
        <div class="comments-header">
          <h2>回复 ({{ comments.length }})</h2>
        </div>
        
        <!-- 回复输入框 -->
        <div class="comment-input-wrapper">
          <div class="user-avatar-small">{{ currentUser.charAt(0) }}</div>
          <div class="comment-input-container">
            <textarea 
              v-model="newComment" 
              class="comment-input" 
              placeholder="写下你的回复..."
              rows="3"
            ></textarea>
            <div class="comment-actions">
              <div class="comment-tools">
                <button class="tool-btn" title="添加图片">
                  📷
                </button>
                <button class="tool-btn" title="添加表情">
                  😊
                </button>
              </div>
              <button 
                class="submit-comment-btn" 
                @click="submitComment"
                :disabled="!newComment.trim()"
              >
                回复
              </button>
            </div>
          </div>
        </div>
        
        <!-- 回复列表 -->
        <div class="comments-list">
          <div 
            v-for="comment in comments" 
            :key="comment.id" 
            class="comment-item"
          >
            <div class="comment-avatar">{{ comment.author.charAt(0) }}</div>
            <div class="comment-content">
              <div class="comment-header">
                <div class="comment-author">{{ comment.author }}</div>
                <div class="comment-time">{{ comment.time }}</div>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-actions">
                <button class="comment-action-btn" @click="replyToComment(comment.id)">
                  回复
                </button>
                <button class="comment-action-btn" @click="likeComment(comment.id)">
                  {{ isCommentLiked(comment.id) ? '❤️' : '🤍' }} 
                  {{ comment.likes }}
                </button>
              </div>
              
              <!-- 回复的回复 -->
              <div class="reply-list" v-if="comment.replies && comment.replies.length > 0">
                <div 
                  v-for="reply in comment.replies" 
                  :key="reply.id" 
                  class="reply-item"
                >
                  <div class="reply-author">{{ reply.author }}</div>
                  <div class="reply-text">{{ reply.content }}</div>
                  <div class="reply-time">{{ reply.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多回复 -->
        <div class="load-more" v-if="hasMoreComments">
          <button class="load-more-btn" @click="loadMoreComments">
            加载更多回复
          </button>
        </div>
      </div>
      
      <!-- 侧边栏 -->
      <div class="sidebar">
        <!-- 相关贴吧信息 -->
        <div class="tieba-info-card">
          <div class="tieba-header">
            <div class="tieba-icon-large">{{ post.tiebaName.charAt(0) }}</div>
            <div class="tieba-details">
              <h3 class="tieba-title">{{ post.tiebaName }}</h3>
              <div class="tieba-stats">{{ post.tiebaMembers }} 成员</div>
            </div>
          </div>
          <button class="join-tieba-btn">
            {{ isJoined ? '已加入' : '加入贴吧' }}
          </button>
        </div>
        
        <!-- 相关帖子 -->
        <div class="related-posts">
          <h3>相关帖子</h3>
          <div class="related-post-item" v-for="relatedPost in relatedPosts" :key="relatedPost.id">
            <router-link :to="`/post/${relatedPost.id}`" class="related-post-link">
              <div class="related-post-title">{{ relatedPost.title }}</div>
              <div class="related-post-stats">
                <span>{{ relatedPost.commentCount }} 回复</span>
              </div>
            </router-link>
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
const isLiked = ref(false)
const isCollected = ref(false)
const isJoined = ref(false)
const newComment = ref('')
const hasMoreComments = ref(true)
const currentUser = ref('当前用户')
const likedComments = ref(new Set())

// 帖子数据（模拟）
const post = reactive({
  id: parseInt(route.params.id || 1),
  title: '英雄联盟S13世界赛决赛前瞻：T1 vs LNG谁能夺冠？',
  content: '今年的世界赛真的太精彩了，T1和LNG都展现了超强的实力，决赛即将开始，大家觉得谁会最终夺冠呢？<br><br>个人认为T1的整体配合和大赛经验更胜一筹，但LNG的团战和后期能力也不容忽视。让我们拭目以待！',
  author: '电竞小王子',
  publishTime: '2023-12-10 14:30',
  viewCount: 12580,
  commentCount: 3421,
  likeCount: 8965,
  tiebaId: 1,
  tiebaName: '英雄联盟',
  tiebaMembers: '1200万',
  images: [
    { url: 'https://via.placeholder.com/800x450/667eea/ffffff?text=LOL+World+Championship' },
    { url: 'https://via.placeholder.com/800x450/764ba2/ffffff?text=T1+vs+LNG' }
  ]
})

// 回复数据（模拟）
const comments = ref([
  {
    id: 1,
    author: '游戏达人',
    content: '我觉得T1的中单太厉害了，LNG需要重点针对！',
    time: '2小时前',
    likes: 345,
    replies: [
      {
        id: 101,
        author: 'LNG粉丝',
        content: '是的，但LNG的打野状态也很好，就看双方BP了。',
        time: '1小时前'
      }
    ]
  },
  {
    id: 2,
    author: '赛事解说',
    content: '从历史数据来看，T1在BO5中的稳定性确实更强，但LNG的上升势头很猛。',
    time: '3小时前',
    likes: 567,
    replies: []
  },
  {
    id: 3,
    author: '理性分析',
    content: '两队的下路组合各有特色，团战中ADC的发挥将是关键。',
    time: '4小时前',
    likes: 234,
    replies: []
  }
])

// 相关帖子（模拟）
const relatedPosts = ref([
  {
    id: 101,
    title: 'LNG晋级之路回顾：从小组赛到决赛',
    commentCount: 890
  },
  {
    id: 102,
    title: 'T1战队历史荣誉盘点',
    commentCount: 1234
  },
  {
    id: 103,
    title: '决赛预测：BP分析与战术前瞻',
    commentCount: 765
  }
])

// 格式化内容
const formatContent = (content) => {
  // 在实际应用中，这里可以使用更复杂的富文本处理
  return content.replace(/\n/g, '<br>')
}

// 点赞帖子
const likePost = () => {
  isLiked.value = !isLiked.value
  post.likeCount += isLiked.value ? 1 : -1
}

// 收藏帖子
const collectPost = () => {
  isCollected.value = !isCollected.value
}

// 分享帖子
const sharePost = () => {
  alert('分享功能待实现')
}

// 提交回复
const submitComment = () => {
  if (!newComment.value.trim()) return
  
  const newCommentObj = {
    id: Date.now(),
    author: currentUser.value,
    content: newComment.value.trim(),
    time: '刚刚',
    likes: 0,
    replies: []
  }
  
  comments.value.unshift(newCommentObj)
  post.commentCount++
  newComment.value = ''
}

// 回复评论
const replyToComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    const replyContent = prompt('请输入回复内容:')
    if (replyContent) {
      comment.replies.push({
        id: Date.now(),
        author: currentUser.value,
        content: replyContent,
        time: '刚刚'
      })
    }
  }
}

// 点赞评论
const likeComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    const isCurrentlyLiked = likedComments.value.has(commentId)
    
    if (isCurrentlyLiked) {
      likedComments.value.delete(commentId)
      comment.likes--
    } else {
      likedComments.value.add(commentId)
      comment.likes++
    }
  }
}

// 检查评论是否已点赞
const isCommentLiked = (commentId) => {
  return likedComments.value.has(commentId)
}

// 加载更多回复
const loadMoreComments = () => {
  // 模拟加载更多评论
  setTimeout(() => {
    hasMoreComments.value = false
  }, 1000)
}
</script>

<style scoped>
.post-detail-page {
  padding: 2rem 1rem;
  background: var(--background-secondary);
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
}

.post-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

.breadcrumb {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: var(--text-secondary);
}

/* 帖子内容区域 */
.post-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.post-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.post-time {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.post-stats {
  display: flex;
  gap: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.post-body {
  margin-bottom: 2rem;
}

.post-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.image-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-item img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-item:hover img {
  transform: scale(1.02);
}

.post-actions {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-medium);
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: var(--background-secondary);
  color: var(--primary-color);
}

.action-icon {
  font-size: 1.2rem;
}

/* 回复区域 */
.comments-header {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.comments-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.comment-input-wrapper {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  display: flex;
  gap: 1rem;
}

.user-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.comment-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comment-input {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  padding: 0.75rem;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.comment-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-tools {
  display: flex;
  gap: 1rem;
}

.tool-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius-small);
  transition: all 0.3s ease;
}

.tool-btn:hover {
  background: var(--background-secondary);
}

.submit-comment-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-comment-btn:hover:not(:disabled) {
  background: var(--primary-color-dark);
  transform: translateY(-1px);
}

.submit-comment-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 回复列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  display: flex;
  gap: 1rem;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-author {
  font-weight: 600;
  color: var(--text-primary);
}

.comment-time {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.comment-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.comment-actions {
  display: flex;
  gap: 1.5rem;
}

.comment-action-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.3s ease;
}

.comment-action-btn:hover {
  color: var(--primary-color);
}

/* 回复的回复 */
.reply-list {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reply-item {
  padding: 0.75rem;
  background: var(--background-secondary);
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
}

.reply-author {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.reply-text {
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: 0.25rem;
}

.reply-time {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 1rem 0;
}

.load-more-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tieba-info-card,
.related-posts {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.tieba-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tieba-icon-large {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
}

.tieba-details {
  flex: 1;
}

.tieba-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.tieba-stats {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.join-tieba-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-medium);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-tieba-btn:hover {
  background: var(--primary-color-dark);
  transform: translateY(-1px);
}

/* 相关帖子 */
.related-posts h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.related-post-item {
  margin-bottom: 1rem;
}

.related-post-item:last-child {
  margin-bottom: 0;
}

.related-post-link {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  padding: 0.75rem;
  border-radius: var(--border-radius-medium);
}

.related-post-link:hover {
  background: var(--background-secondary);
}

.related-post-title {
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-post-stats {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .post-detail-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .post-content {
    padding: 1.5rem;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .post-images {
    grid-template-columns: 1fr;
  }
  
  .post-actions {
    justify-content: space-around;
    gap: 1rem;
  }
  
  .comment-input-wrapper,
  .comment-item,
  .comments-header {
    padding: 1.25rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .post-detail-page {
    padding: 1rem;
  }
  
  .post-content,
  .comment-input-wrapper,
  .comment-item,
  .comments-header {
    padding: 1rem;
    border-radius: 8px;
  }
  
  .post-title {
    font-size: 1.25rem;
  }
  
  .post-text {
    font-size: 1rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .image-item:hover img {
    transform: none;
  }
  
  .action-btn:hover,
  .tool-btn:hover,
  .submit-comment-btn:hover:not(:disabled),
  .comment-action-btn:hover,
  .load-more-btn:hover,
  .join-tieba-btn:hover,
  .related-post-link:hover {
    transform: none;
  }
  
  .submit-comment-btn:active:not(:disabled),
  .join-tieba-btn:active,
  .action-btn:active {
    transform: scale(0.98);
  }
}
</style>