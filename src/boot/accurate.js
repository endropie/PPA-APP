
export default ({ app, router, store, Vue}) => {
  router.beforeEach((to, from, next) => {
    if (to.path == '/accurate' && (to.query['accurate[auth][access_token]'] && to.query['accurate[db][session]']))
    {
      console.warn('ACCURATE SET', to);
      store.dispatch('admin/assignAccurate', to.query)
      next('/admin')
    }
    else next()
  })
}
