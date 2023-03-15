const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/change-password',
  historyPurchase: '/user/purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productDetail: ':nameId',
  card: '/cart'
} as const
export default path
