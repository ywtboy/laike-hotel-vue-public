export default {
    roomTypeCol: [
        {
            type: 'index',
            title: '序号',
            width: 60
        },
        {
            title: '房型名称',
            key: 'roomTypeName',
            width: 150
        },
        {
            title: '默认房价',
            key: 'roomTypePrice',
            width: 150
        },
        {
            title: '数量',
            slot: 'count',
            width: 100
        },
        {
            title: '房号',
            slot: 'roomNo',
            
        },
        {
            title: '操作',
            slot: 'action',
            // width: 150,
            align: 'center'
        },
        
    ]
}