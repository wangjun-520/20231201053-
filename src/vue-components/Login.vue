<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2>欢迎登录</h2>
        <p>加入百度贴吧，发现更多有趣的内容</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            id="username"
            v-model="form.username"
            type="text"
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            id="password"
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            required
          />
          <div class="password-toggle" @click="togglePasswordVisibility">
            {{ showPassword ? '🙈' : '👁️' }}
          </div>
        </div>
        
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.rememberMe" />
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>
        
        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
        
        <div class="form-error" v-if="errorMessage">
          {{ errorMessage }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 这里应该是实际的登录API调用
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟登录成功
    if (form.username && form.password) {
      console.log('登录成功:', form)
      // 存储用户信息
      localStorage.setItem('user', JSON.stringify({ username: form.username }))
      // 重定向到首页
      router.push('/')
    } else {
      throw new Error('用户名和密码不能为空')
    }
  } catch (error) {
    errorMessage.value = error.message || '登录失败，请检查用户名和密码'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.login-container {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.forgot-password {
  font-size: 0.9rem;
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

.login-btn {
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

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
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

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.login-footer p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.login-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.login-footer a:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 2rem 1.5rem;
    border-radius: 12px;
  }
  
  .login-header h2 {
    font-size: 1.5rem;
  }
  
  .form-group input {
    padding: 0.75rem;
    font-size: 0.95rem;
  }
  
  .login-btn {
    padding: 0.875rem;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-container {
    padding: 1.5rem 1.25rem;
    border-radius: 10px;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .password-toggle {
    font-size: 1rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .login-btn:hover:not(:disabled) {
    transform: none;
  }
  
  .login-btn:active:not(:disabled) {
    transform: scale(0.98);
  }
}
</style>