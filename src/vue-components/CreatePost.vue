<template>
  <div class="create-post-page">
    <div class="create-post-container">
      <div class="page-header">
        <h1>发布新帖</h1>
        <p>与社区成员分享你的想法和内容</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="create-post-form">
        <div class="form-section">
          <h2 class="section-title">选择贴吧</h2>
          <div class="tieba-selector">
            <div 
              v-for="tieba in availableTiebas" 
              :key="tieba.id"
              class="tieba-option"
              :class="{ active: selectedTieba === tieba.id }"
              @click="selectedTieba = tieba.id"
            >
              <div class="tieba-icon">{{ tieba.name.charAt(0) }}</div>
              <span class="tieba-name">{{ tieba.name }}</span>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h2 class="section-title">帖子标题</h2>
          <input 
            v-model="post.title"
            type="text"
            class="post-title-input"
            placeholder="请输入帖子标题（2-50个字符）"
            maxlength="50"
            required
          />
          <div class="char-count">{{ post.title.length }}/50</div>
        </div>
        
        <div class="form-section">
          <h2 class="section-title">帖子内容</h2>
          <!-- 使用Veaury集成React的RichEditor组件 -->
          <Veaury
            :reactComponent="RichEditor"
            :reactProps="{
              value: post.content,
              onChange: handleContentChange,
              config: {
                placeholder: '开始编写你的内容...',
                rows: 10
              }
            }"
          />
        </div>
        
        <div class="form-section">
          <h2 class="section-title">添加图片（可选）</h2>
          <div class="image-upload-area">
            <input 
              type="file" 
              id="image-upload" 
              accept="image/*"
              multiple
              @change="handleImageUpload"
              style="display: none"
            />
            <label for="image-upload" class="upload-button">
              <span class="upload-icon">📁</span>
              <span>点击上传图片</span>
            </label>
            <div class="upload-tip">支持JPG、PNG、GIF格式，单张不超过5MB</div>
          </div>
          
          <div class="selected-images" v-if="selectedImages.length > 0">
            <div class="image-preview" v-for="(image, index) in selectedImages" :key="index">
              <img :src="image.preview" alt="图片预览" />
              <button type="button" class="remove-image" @click="removeImage(index)">×</button>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h2 class="section-title">发布选项</h2>
          <div class="publish-options">
            <label class="option-label">
              <input type="checkbox" v-model="post.isAnonymous" />
              <span>匿名发布</span>
            </label>
            <label class="option-label">
              <input type="checkbox" v-model="post.allowComments" />
              <span>允许评论</span>
            </label>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="handleCancel">
            取消
          </button>
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isSubmitting || !isFormValid"
          >
            {{ isSubmitting ? '发布中...' : '发布帖子' }}
          </button>
        </div>
        
        <div class="form-message" v-if="message">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { createVeaury } from 'veaury'

const router = useRouter()
// 异步导入React组件
const RichEditor = () => import('@/react-components/RichEditor.jsx')

// 创建Veaury组件
const Veaury = defineAsyncComponent(() => import('veaury/vue3'))

// 表单数据
const post = reactive({
  title: '',
  content: '',
  isAnonymous: false,
  allowComments: true
})

const selectedTieba = ref(1) // 默认选择第一个贴吧
const selectedImages = ref([])
const isSubmitting = ref(false)
const message = ref('')

// 可用的贴吧列表
const availableTiebas = ref([
  { id: 1, name: '英雄联盟' },
  { id: 2, name: '王者荣耀' },
  { id: 3, name: '动漫吧' },
  { id: 4, name: '电影吧' },
  { id: 5, name: '美食吧' },
  { id: 6, name: '旅游吧' }
])

// 表单验证
const isFormValid = computed(() => {
  return post.title.length >= 2 && post.title.length <= 50 && 
         post.content.trim().length > 0 && 
         selectedTieba.value > 0
})

// 处理内容变化
const handleContentChange = (newContent) => {
  post.content = newContent
}

// 处理图片上传
const handleImageUpload = (e) => {
  const files = e.target.files
  if (!files.length) return
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    // 检查文件大小
    if (file.size > 5 * 1024 * 1024) {
      message.value = '图片大小不能超过5MB'
      setTimeout(() => { message.value = '' }, 3000)
      continue
    }
    
    // 生成预览
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImages.value.push({
        file,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  }
  
  // 清空文件输入，允许重复选择同一文件
  e.target.value = ''
}

// 移除图片
const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  message.value = ''
  
  try {
    // 构建帖子数据
    const postData = {
      title: post.title,
      content: post.content,
      tiebaId: selectedTieba.value,
      isAnonymous: post.isAnonymous,
      allowComments: post.allowComments,
      images: selectedImages.value.map(img => img.file.name) // 实际应用中应该上传文件
    }
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('发布帖子:', postData)
    message.value = '帖子发布成功！'
    
    // 跳转到帖子详情页
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (error) {
    message.value = error.message || '发布失败，请稍后重试'
  } finally {
    isSubmitting.value = false
  }
}

// 取消发布
const handleCancel = () => {
  if (confirm('确定要取消发布吗？内容将不会保存。')) {
    router.push('/')
  }
}
</script>

<style scoped>
.create-post-page {
  padding: 2rem 1rem;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: var(--background-secondary);
}

.create-post-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.create-post-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

/* 贴吧选择器 */
.tieba-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tieba-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--background-primary);
}

.tieba-option:hover {
  border-color: var(--primary-color);
  background: rgba(33, 150, 243, 0.05);
}

.tieba-option.active {
  border-color: var(--primary-color);
  background: rgba(33, 150, 243, 0.1);
}

.tieba-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.tieba-name {
  font-size: 0.95rem;
  color: var(--text-primary);
}

/* 标题输入 */
.post-title-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  font-size: 1.1rem;
  font-weight: 500;
  transition: border-color 0.3s ease;
}

.post-title-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.char-count {
  align-self: flex-end;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* 图片上传 */
.image-upload-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--background-primary);
  color: var(--text-secondary);
}

.upload-button:hover {
  border-color: var(--primary-color);
  background: rgba(33, 150, 243, 0.05);
  color: var(--primary-color);
}

.upload-icon {
  font-size: 2rem;
}

.upload-tip {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-align: center;
}

.selected-images {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.image-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.remove-image:hover {
  background: rgba(255, 0, 0, 0.7);
}

/* 发布选项 */
.publish-options {
  display: flex;
  gap: 2rem;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.option-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.875rem 1.75rem;
  border-radius: var(--border-radius-medium);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cancel-btn {
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.cancel-btn:hover {
  background: #f0f0f0;
}

.submit-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.form-message {
  text-align: center;
  padding: 0.75rem;
  border-radius: var(--border-radius-medium);
  margin-top: 1rem;
  color: var(--success-color);
  background: rgba(76, 175, 80, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .create-post-container {
    padding: 1.5rem;
  }
  
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .tieba-option {
    flex: 1;
    min-width: calc(50% - 0.5rem);
  }
  
  .publish-options {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .create-post-page {
    padding: 1rem;
  }
  
  .create-post-container {
    padding: 1.25rem;
    border-radius: 8px;
  }
  
  .tieba-option {
    min-width: 100%;
  }
  
  .image-preview {
    width: 100px;
    height: 100px;
  }
}
</style>