export default {
    orderReserveCol: [
      {
        title: "房型",
        key: "roomTypeName",
        width: 90
      },
      {
        title: "房价",
        key: "roomTypePrice",
        width: 70
      },
      {
        title: "数量",
        key: "reserveNum",
        width: 80
      },
      {
        title: "已分配",
        key: "allottedNum",
        width: 80
      },
      {
        title: "时间",
        slot: "inOutTime",
        width: 200
      },
      {
        title: '操作',
        slot: 'action',
        // width: 150,
        align: 'center'
    },
    ],
    orderRoomCol: [
        {
          title: "客人",
          key: "guestName",
          width: 80
        },
        {
          title: "房间",
          slot: "roomName",
          width: 140
        },
        {
          title: "类型",
          slot: "orderTypeCode",
          width: 80
        },
        {
          title: "房价",
          key: "roomPrice",
          width: 70
        },
        {
          title: "时间",
          slot: "inOutTime",
          width: 200
        },
        {
          title: "状态",
          slot: "state",
          width: 80
        },
        {
          title: '操作',
          slot: 'action',
          // width: 150,
          align: 'center'
      },
      ],
      consumeCol: [
        {
          type: "index",
          title: "序号",
          width: 55
        },
        {
          title: "房号",
          key: "roomName",
          width: 60
        },
        {
          title: "项目",
          slot: "consumeItemCode",
          width: 85
        },
        {
          title: "详情",
          key: "consumeItemDetail",
          width: 120
        },
        {
          title: "金额",
          slot: "consumeMoney",
          width: 80
        },
        {
          title: "时间",
          key: "gmtCreate",
          width: 165
        },
        
        {
          title: "操作人",
          key: "operatorName",
          width: 80
        },
        {
          title: "操作",
          slot: "action",
          width: 70
        },
        {
          title: "备注",
          key: "consumeComment"
        },
        
      ],
      incomeCol: [
        {
          type: "index",
          title: "序号",
          width: 55
        },
        {
          title: "类型",
          slot: "incomeTypeCode",
          width: 60
        },
        {
          title: "项目",
          slot: "incomeClassCode",
          width: 70
        },
        
        {
          title: "金额",
          slot: "incomeMoney",
          width: 70
        },
        {
          title: "支付详情",
          slot: "payDetails",
          width: 165
        },
        {
          title: "时间",
          key: "gmtCreate",
          width: 165
        },
        {
          title: "操作人",
          key: "operatorName",
          width: 75
        },
        {
          title: "操作",
          slot: "action",
          width: 70
        },
        {
          title: "备注",
          key: "incomeComment"
        },
        
      ],
}