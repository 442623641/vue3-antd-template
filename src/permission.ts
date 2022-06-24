import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/modules/user.store'
import { usePermissionStore } from '@/store/modules/permission.store'
import { message } from 'ant-design-vue'
import { RouteLocationNormalized } from 'vue-router'
import { APP_NAME } from './class/constants'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to: RouteLocationNormalized, _: RouteLocationNormalized, next: any) => {
  // Start progress bar
  NProgress.start()
  const user = useUserStore()
  // Determine whether the user has logged in
  if (user.token) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // Check whether the user has obtained his permission roles
      if (!user.roles.length) {
        try {
          // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
          user.getUserInfo()
          const roles = user.getRoles;
          const permission = usePermissionStore()
          // Generate accessible routes map based on role
          permission.generateRoutes(roles)
          // Hack: ensure addRoutes is complete
          // Set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })

        } catch (err) {
          // Remove token and redirect to login page
          console.error(err)
          message.error('登录信息异常')
          user.resetToken()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: RouteLocationNormalized) => {
  // Finish progress bar
  NProgress.done();
  // set page title
  (<any>document.title) = to.meta.title || APP_NAME
})
