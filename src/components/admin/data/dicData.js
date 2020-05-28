export default {
    colDic : [
        {
            type: 'index',
            title: '序号',
            width: 60
        },
        {
            title: '名称',
            key: 'dicCommonName'
        },
        {
            title: '代码',
            key: 'dicCommonCode'
        },
        {
            title: '类型',
            key: 'dicTypeName'
        },
        {
            title: '父节点',
            key: 'parentId'
        },
        {
            title: '层级',
            key: 'dicLevel'
        },
        {
            title: '排序',
            key: 'sortNo'
        },
        {
            title: '创建时间',
            key: 'gmtCreate'
        },
        {
            title: '修改时间',
            key: 'gmtModified'
        },
        {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
        },
    
    ],
    colType: [
        {
            type: 'index',
            title: '序号',
            width: 60
        },
        {
            title: '名称',
            key: 'dicTypeName'
        },
        {
            title: '代码',
            key: 'dicTypeCode'
        },
        {
            title: '类型',
            key: 'dicTypeClass'
        },
        {
            title: '创建时间',
            key: 'gmtCreate'
        },
        {
            title: '修改时间',
            key: 'gmtModified'
        },
        {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
        },
    ]
}
