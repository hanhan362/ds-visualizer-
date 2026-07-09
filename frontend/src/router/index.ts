import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserStore } from '../store/user';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/sort', name: 'sort', component: () => import('../views/SortView.vue') },
    { path: '/array', name: 'array', component: () => import('../views/ArrayView.vue') },
    { path: '/linked-list', name: 'linked-list', component: () => import('../views/LinkedListView.vue') },
    { path: '/stack-queue', name: 'stack-queue', component: () => import('../views/StackQueueView.vue') },
    { path: '/tree', name: 'tree', component: () => import('../views/TreeView.vue') },
    { path: '/graph', name: 'graph', component: () => import('../views/GraphView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { guest: true } },
    { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { auth: true } },
    { path: '/learning', name: 'learning', component: () => import('../views/LearningCenter.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
  ],
});

router.beforeEach((to, _from, next) => {
  const { isLoggedIn } = useUserStore();
  if (to.meta.auth && !isLoggedIn) return next('/login');
  if (to.meta.guest && isLoggedIn) return next('/');
  next();
});

export default router;
