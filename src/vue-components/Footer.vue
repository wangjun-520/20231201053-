<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-logo">
          <h2>百度贴吧</h2>
          <p>全球最大的中文社区</p>
        </div>
        
        <div class="footer-links">
          <div class="footer-column">
            <h3>关于我们</h3>
            <ul>
              <li><a href="#">公司介绍</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">加入我们</a></li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h3>用户服务</h3>
            <ul>
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">用户协议</a></li>
              <li><a href="#">隐私政策</a></li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h3>社区规范</h3>
            <ul>
              <li><a href="#">贴吧协议</a></li>
              <li><a href="#">违规处理</a></li>
              <li><a href="#">举报中心</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2023 百度贴吧 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件逻辑
</script>

<style scoped>
.footer {
  background: var(--background-primary);
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-top: 2rem;
}

.footer-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-logo {
  flex: 1;
  min-width: 200px;
}

.footer-logo h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.footer-logo p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.footer-links {
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-column {
  min-width: 150px;
  flex: 1;
}

.footer-column h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-column h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 30px;
  height: 2px;
  background: var(--primary-color);
}

.footer-column ul {
  list-style: none;
}

.footer-column li {
  margin-bottom: 0.5rem;
}

.footer-column a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .footer-column {
    min-width: 100%;
  }
}
</style>