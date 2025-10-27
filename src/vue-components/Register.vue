<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h2>创建账号</h2>
        <p>加入百度贴吧，开启你的社区之旅</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            id="username"
            v-model="form.username"
            type="text"
            placeholder="请输入用户名（4-20个字符）"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">邮箱</label>
          <input 
            id="email"
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱地址"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            id="password"
            v-model="form.password"
            type="password"
            :placeholder="showPassword ? '请设置密码（至少6位）' : '••••••••'"
            required
          />
          <div class="password-toggle" @click="togglePasswordVisibility">
            {{ showPassword ? '🙈' : '👁️' }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            :placeholder="showPassword ? '请再次输入密码' : '••••••••'"
            required
          />
        </div>
        
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.agreeTerms" required />
            <span>我已阅读并同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a></span>
          </label>
        </div>
        
        <button type="submit" class="register-btn" :disabled="isLoading || !isFormValid">
          {{ isLoading ? '注册中...' : '立即注册' }}
        </button>
        
        <div class="form-error" v-if="errorMessage">
          {{ errorMessage }}
        </div>
      </form>
      
      <div class="register-footer">
        <p>已有账号？<router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// 表单验证
const isFormValid = computed(() => {
  return (
    form.username.length >= 4 && form.username.length <= 20 &&
    form.email.includes('@') && form.email.includes('.') &&
    form.password.length >= 6 &&
    form.password === form.confirmPassword &&
    form.agreeTerms
  )
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 这里应该是实际的注册API调用
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟注册成功
    console.log('注册成功:', form)
    // 重定向到登录页
    router.push('/login')
  } catch (error) {
    errorMessage.value = error.message || '注册失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 2rem 1rem;
}

.register-container {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.register-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--background-primary);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 70%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
  user-select: none;
}

.form-options {
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0.15rem 0;
  flex-shrink: 0;
}

.checkbox-label a {
  color: var(--primary-color);
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.register-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.register-btn:active:not(:disabled) {
  transform: translateY(0);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-error {
  color: var(--error-color);
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 99, 71, 0.1);
  border-radius: var(--border-radius-small);
  margin-top: -0.5rem;
}

.register-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.register-footer p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.register-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.register-footer a:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    padding: 2rem 1.5rem;
    border-radius: 12px;
  }
  
  .register-header h2 {
    font-size: 1.5rem;
  }
  
  .form-group input {
    padding: 0.75rem;
    font-size: 0.95rem;
  }
  
  .register-btn {
    padding: 0.875rem;
  }
}

@media (max-width: 480px) {
  .register-page {
    padding: 1rem;
  }
  
  .register-container {
    padding: 1.5rem 1.25rem;
    border-radius: 10px;
  }
  
  .password-toggle {
    font-size: 1rem;
  }
  
  .checkbox-label {
    font-size: 0.85rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .register-btn:hover:not(:disabled) {
    transform: none;
  }
  
  .register-btn:active:not(:disabled) {
    transform: scale(0.98);
  }
}
</style>