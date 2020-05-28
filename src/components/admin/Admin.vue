<template>
    <div class="layout">
        <Layout :style="{height: '100%'}">
            <Header>Header</Header>
            <Layout style="height: 100%">
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu  theme="light" width="auto" :style="{height: '100%'}">
                        <MenuItem name="1">
                            酒店管理
                        </MenuItem>
                        <MenuItem name="2">
                            字典管理
                        </MenuItem>
                        <MenuItem name="3">
                            资源权限管理
                        </MenuItem>
                    </Menu>
                </Sider>
                <Layout > 
                    <!-- :style="{padding: '0 24px 24px'}" -->
                    <!-- <Breadcrumb :style="{margin: '24px 0'}">
                        
                    </Breadcrumb> -->
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                         
                         <Tabs type="card" closable 
                         @on-tab-remove="handleTabRemove"
                         >
                            <TabPane label="酒店管理" v-if="tab0">
                                <Button @click="test">试试</Button>
                                <Table :columns="columns1" :data="hotels">
                                

                                </Table>
                            </TabPane>
                            <TabPane label="字典管理" v-if="tab1">
                                <DicCommon></DicCommon>
                            </TabPane>
                            <TabPane label="标签三" v-if="tab2">标签三的内容</TabPane>
                        </Tabs>

                    </Content>
                </Layout>
                
                
            </Layout>
            <Footer>Footer</Footer>
        </Layout>
    </div>
</template>



<script>
import {getHotel} from '../../api/hotel.js'
import DicCommon from './DicCommon.vue'
// import axios from "axios"

export default {
    name: 'Admin',
    data() {
        return {
            tab0: true,
            tab1: true,
            tab2: true,
            hotels: [],
            columns1: [
                {
                    title: '酒店名称',
                    key: 'hotelName'
                },
                {
                    title: '酒店编号',
                    key: 'hotelNo'
                },
                {
                    title: '地址',
                    key: 'address'
                },
                {
                    title: '热线',
                    key: 'hotline'
                }
            ]
        }
    },
    methods: {
        test() {
            console.log(getHotel);
            getHotel().then(res=> {
                this.hotels = res.data.data;
                console.log(res.data);
            })
        },
        handleTabRemove (name) {
            this['tab' + name] = false;
        }
    },
    components: {
        DicCommon,
    }
}
</script>

<style scoped>
.layout{
    height: 100%;
}
.layout-logo{
    
}
.layout-nav{

}
</style>
