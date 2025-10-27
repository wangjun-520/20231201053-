import { createRouter, createWebHistory } from 'vue-router'

// 懒加载路由组件
const HomePage = () => import('./vue-components/HomePage.vue')
const PostDetail = () => import('./vue-components/PostDetail.vue')
const CreatePost = () => import('./vue-components/CreatePost.vue')
const UserProfile = () => import('./vue-components/UserProfile.vue')
const SearchPage = () => import('./vue-components/SearchPage.vue')
const Login = () => import('./vue-components/Login.vue')
const Register = () => import('./vue-components/Register.vue')
const TiebaDetail = () => import('./vue-components/TiebaDetail.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePost
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail
  },
  {
    path: '/tieba/:id',
    name: 'TiebaDetail',
    component: TiebaDetail
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router