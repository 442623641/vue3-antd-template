import { defineStore } from 'pinia';
import { store } from '@/store';
import { Storage } from '@/utils/Storage';
import { resetRouter } from '@/router';
import { UsersService } from '@/services/users';

interface UserState {
  token: string;
  name: string;
  avatar: string;
  menus: any[];
  userInfo: any;
  roles: string[];
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: 'ACCESS_TOKEN_KEY' || Storage.get('ACCESS_TOKEN_KEY', null),
    name: 'amdin',
    avatar: '',
    menus: [],
    userInfo: {},
    roles: []
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getName(): string {
      return this.name;
    },
    getRoles(): string[] {
      return this.roles
    }
  },
  actions: {
    /** 清空token及用户信息 */
    resetToken() {
      this.avatar = this.token = this.name = '';
      this.menus = [];
      this.userInfo = {};
      Storage.clear();
    },
    /** 登录成功保存token */
    setToken(token: string) {
      this.token = token ?? '';
      Storage.set('ACCESS_TOKEN_KEY', this.token);
    },
    /** 登录 */
    async login(userInfo: { phone: string, password: string }) {
      const { phone, password } = userInfo
      return UsersService.login({ phone: phone.trim(), password })
        .then(res => {
          this.setToken(res)
          // this.GetUserInfo()
        }).catch(ex => ex)
    },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async getUserInfo() {
      try {
        // const [userInfo, { perms, menus }] = await Promise.all([getInfo(), permmenu()]);
        const userInfo = { "name": "路飞", "nickName": "", "email": "1743369777@qq.com", "phone": "13553550634", "remark": null, "headImg": "https://buqiyuan.gitee.io/img/logo.jpg" }//await UsersService.info();
        this.name = userInfo.name;
        this.avatar = userInfo.headImg;
        this.userInfo = userInfo;
        this.roles.push('admin')
        return userInfo;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 登出 */
    async logout() {
      this.resetToken();
      resetRouter();
    },
  },
});

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
