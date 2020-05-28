
export default [
  {
    path: '/admin',
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/components/admin/Admin.vue')
  },
  {
    path: '/login/:url',
    component: () =>
      import(
        /* webpackChunkName: "loginPage" */ '@/components/hotel/login/LoginPage.vue'
      ),
    props: true
  },
  {
    path: '/',
    component: () =>
        import(/* webpackChunkName: "hotelPage" */ '@/components/hotel/Hotel.vue'),
    meta: {
      title: '来客酒店云管家'
    },
    children: [
      {
        path: 'roomState',
        component: () =>
        import(/* webpackChunkName: "roomState" */ '@/components/hotel/roomState/RoomState.vue'),
        meta: {
          title: '来客酒店云管家--房态'
        }
      },
      {
        // OrderPage
        path: 'order',
        component: () =>
          import(
            /* webpackChunkName: "orderPage" */ '@/components/hotel/order/Order.vue'
          )
      },
      {
        path: 'guest',
        component: () =>
          import(
            /* webpackChunkName: "guestPage" */ '@/components/hotel/guest/GuestPage.vue'
          ),
        children: [
          {
            path: 'guestList',
            component: () =>
              import(
                /* webpackChunkName: "guestList" */ '@/components/hotel/guest/GuestList.vue'
              )
          },
          {
            path: 'vip',
            component: () =>
              import(
                /* webpackChunkName: "vip" */ '@/components/hotel/guest/VipPage.vue'
              )
          },
        ]
      },
      {
        path: 'report',
        component: () =>
          import(
            /* webpackChunkName: "reportPage" */ '@/components/hotel/report/ReportPage.vue'
          )
      },
      // {
      //     path: 'login',
      //     component: LoginPage
      // },
      {
        path: 'setting',
        component: () =>
          import(
            /* webpackChunkName: "settingPage" */ '@/components/hotel/setting/Setting.vue'
          ),
        children: [
          {
            path: 'hotel',
            component: () =>
              import(
                /* webpackChunkName: "hotelSetting" */ '@/components/hotel/setting/HotelSetting.vue'
              )
          },
          {
            path: 'system',
            component: () =>
              import(
                /* webpackChunkName: "systemSetting" */ '@/components/hotel/setting/SystemSetting.vue'
              )
          },
          {
            path: 'Staff',
            component: () =>
              import(
                /* webpackChunkName: "staffPage" */ '@/components/hotel/setting/StaffPage.vue'
              )
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: () =>
      import(
        /* webpackChunkName: "notFound" */ '@/components/error/NotFound.vue'
      )
  }
]
