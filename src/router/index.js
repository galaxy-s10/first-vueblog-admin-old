import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },


  {
    path: '/article',
    component: Layout,
    redirect: '/article/article_list',
    name: 'Article',
    meta: { title: '管理文章', icon: 'example' },
    children: [
      {
        // 当 /article/article_list 匹配成功，
        // article_list 会被渲染在 Layout 的 <router-view> 中
        path: 'article_list',
        name: 'article_list',
        component: () => import('@/views/article/article_list/index'),
        meta: { title: '文章列表', icon: 'list' }
      },
      {
        // 当 /article/article_add 匹配成功，
        // article_add 会被渲染在 Layout 的 <router-view> 中
        path: 'article_add',
        name: 'article_add',
        component: () => import('@/views/article/article_add/index'),
        // component: () => import('@/views/tinymce/tinymce'),
        meta: { title: '发布文章', icon: 'edit' }
      },
      {
        // 当 /article/article_edit/:id 匹配成功，
        // article_edit 会被渲染在 Layout 的 <router-view> 中
        path: 'article_edit/:id',
        name: 'article_edit',
        component: () => import('@/views/article/article_edit/index'),
        meta: { title: '修改文章' },
        hidden: true
      }
    ]
  },

  {
    path: '/message',
    component: Layout,
    redirect: '/message/message_list',
    name: 'Message',
    alwaysShow: true,
    meta: { title: '管理留言', icon: 'example' },
    children: [
      {
        path: 'message_list',
        name: 'Message_list',
        component: () => import('@/views/message/message_list/index'),
        meta: { title: '留言板列表', icon: 'list' }
      },
      {
        path: 'comment_list',
        name: 'Comment_list',
        component: () => import('@/views/message/comment_list/index'),
        meta: { title: '文章留言列表', icon: 'list' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/user_list',
    name: 'User',
    meta: { title: '管理用户', icon: 'user' },
    children: [
      {
        path: 'user_list',
        name: 'user_list',
        component: () => import('@/views/user/user_list/index'),
        meta: { title: '用户列表', icon: 'list' }
      },
      {
        path: 'user_add',
        name: 'user_add',
        component: () => import('@/views/user/user_add/index'),
        meta: { title: '添加用户', icon: 'peoples' },
      },
      {
        path: 'user_edit/:id',
        name: 'user_edit',
        component: () => import('@/views/user/user_edit/index'),
        meta: { title: '修改用户' },
        hidden: true
      }
    ]
  },
  {
    path: '/tag',
    component: Layout,
    children: [
      {
        path: '',
        name: 'tag',
        component: () => import('@/views/tag/index'),
        meta: { title: '管理标签', icon: 'guide' }
      }
    ]
  },
  {
    path: '/link',
    component: Layout,
    children: [
      {
        path: '',
        name: 'link',
        component: () => import('@/views/link/index'),
        meta: { title: '管理友链', icon: 'star' }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
