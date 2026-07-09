import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '');
  const id = ref(Number(localStorage.getItem('uid')) || 0);
  const username = ref(localStorage.getItem('username') || '');
  const avatar = ref(localStorage.getItem('avatar') || '');

  const isLoggedIn = computed(() => !!token.value);

  function login(t: string, user: UserInfo) {
    token.value = t;
    id.value = user.id;
    username.value = user.username;
    avatar.value = user.avatar;
    localStorage.setItem('token', t);
    localStorage.setItem('uid', String(user.id));
    localStorage.setItem('username', user.username);
    localStorage.setItem('avatar', user.avatar || '');
  }

  function logout() {
    token.value = '';
    id.value = 0;
    username.value = '';
    avatar.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
  }

  return { token, id, username, avatar, isLoggedIn, login, logout };
});
