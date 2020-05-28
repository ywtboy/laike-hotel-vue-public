export default {
    orderCol: [
        {
          title: "订单号",
          key: "orderNo",
          width: 180,
          align: 'center',
        },
        {
          title: "创建时间",
          key: "gmtCreate",
          width: 150,
          align: 'center',
        },
        {
          title: "客人",
          key: "guestName",
          width: 100,
          align: 'center',
        },
        {
          title: "订单状态",
          slot: "orderStateCode",
          width: 100,
          align: 'center',
        },
        {
          title: "房间信息",
          slot: "orderRooms",
          // width: 300,
          // align: 'center',
        },
        {
          title: "消费金额",
          key: "orderMoney",
          width: 90,
          align: 'center'
        },
        {
          title: "已交金额",
          key: "payMoney",
          width: 90,
          align: 'center'
        },
        
        {
          title: '操作',
          slot: 'action',
          width: 100,
          align: 'center'
      },
      ],
    orderRoomCol: [
      {
        title: "房号",
        key: "roomName",
        width: 180,
        align: 'center',
      },
      {
        title: "房价",
        key: "roomPrice",
        width: 150,
        align: 'center',
      },
      {
        title: "客人",
        key: "guestName",
        width: 100,
        align: 'center',
      },
    ]
}