<template>
  <div style="padding: 10px">
    <div>
      <Row>
        <Col :span="18">&nbsp;</Col>
        <!-- <Col :span=""></Col> -->
        <Col
          :span="6"
          align="right"
        >
        <Button
          type="info"
          style="margin-right: 5px"
          @click="staffModal = true;"
        >
          添加员工
        </Button>
        </Col>
      </Row>
    </div>
    <div>
      <Table
        :columns="staffCol" :data="staffs" stripe :loading="false">
        <template slot-scope="{row}" slot="role">
          <a v-for="(item, index) in row.roles" :key="index">
              {{ item | rolesFilter(rolesList) }}
          </a>
        </template>
        
        <template slot-scope="{row}"slot="action">
          <!-- <Button type="primary" size="small" style="margin-right: 5px" >修改</Button> -->
          <Button type="error" size="small" >锁定</Button>
        </template>
      </Table>
    </div>

    <Modal width="400" :mask-closable="false"
      v-model="staffModal" title="添加员工" @on-visible-change="openOrClose($event)">
      <Form ref="staffForm" :model="staff" :rules="staffRule"
      >
        <FormItem  prop="realName">
          <Input v-model="staff.realName" size="large" placeholder="真实姓名" ></Input>
        </FormItem>
        <FormItem  prop="mobileNum">
          <Input v-model="staff.mobileNum" size="large" placeholder="手机号" ></Input>
        </FormItem>
        <FormItem prop="userSex">
            <RadioGroup v-model="staff.userSex" size="large" >
                <Radio label="male">男</Radio>
                <Radio label="female">女</Radio>
              </RadioGroup>
        </FormItem>
        <FormItem   prop="roles" >
          <Select v-model="staff.roles" multiple  placeholder="选择权限角色" size="large">
                <Option v-for="item in rolesList" :value="item.id" :key="item.role">{{ item.roleName }}</Option>
            </Select>
        </FormItem>
        <FormItem  prop="userPwd">
            <Input size="large" type="password" prefix="md-lock" placeholder="请本人输入新密码" 
            v-model="staff.userPwd"></Input>
        </FormItem>
        <FormItem  prop="userPwd2">
            <Input size="large" type="password" prefix="md-lock" placeholder="请再次输入新密码" 
            v-model="staff.userPwd2"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="staffModal = false;">取消</Button>
        <Button type="primary" size="large" :loading="staffLoad" @click="staffSubmit" >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getHotelRoles } from "@/api/permission.js";
import { addUser, getUsers } from "@/api/user.js";
export default {
  name: 'StaffPage',
  filters: {
    rolesFilter(val, roles) {
      let role = roles.filter( r => parseInt(val) == r.id);
      if (role && role.length !== 0 ) {
          return role[0].roleName;
      }
      return "";
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.staff.userPwd2 !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.staffForm.validateField('userPwd2');
                }
                callback();
            }
        };
    const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== this.staff.userPwd) {
            callback(new Error('两次密码不一样'));
        } else {
            callback();
        }
    };
    return {
        staffs: [],
        staff: {
            realName: '',
            mobileNum: '',
            userSex: '',
            userPwd: '',
            userPwd2: '',
            roles: [],
        },
        staffModal: false,
        rolesList: [],
        staffLoad: false,
        staffRule: {
            realName: [
                { required: true, message: '请输入真实姓名',}
            ],
            mobileNum: [
                { required: true, message: '请输入手机号', },
            ],
            userSex: [
                { required: true, message: '请选择性别', },
            ],
            userPwd: [
                 { validator: validatePass, },
            ],
            userPwd2: [
               { validator: validatePassCheck, },
            ],
            roles: [
                { required: true, message: '请选择角色', },
            ],
        },
        staffCol:[ 
            {
            type: 'index',
            title: '序号',
            width: 60
        },
        {
            title: '姓名',
            key: 'realName',
            width: 150
        },
        {
            title: '手机号',
            key: 'mobileNum',
            width: 150
        },
        {
            title: '角色',
            slot: 'role',
            width: 250
        },
        {
            title: '操作',
            slot: 'action',
            // width: 150,
            align: 'center'
        },
        
        ]
    }
  },
  mounted() {
      this.getRoles();
      this.getUserList();
      
  },
  methods: {
    openOrClose(val) {
      if (!val) {
        // this.$emit("order-print-close");
      } else {
        // this.getRoles();
      }
    },
    staffSubmit() {
         this.$refs.staffForm.validate((valid) => {
            if (valid) {
                this.staffLoad = true;
                addUser(this.staff).then(res => {
                    if (res.data.code === 0) {
                        this.staffModal  = false;
                        this.staffLoad = false;
                        this.$Message.secuss('员工添加成功');
                        this.getUserList();
                    } else {
                        this.$Message.error(res.data.code + "：" + res.data.msg);
                        this.staffLoad = false;
                    }
                });
            } 
        })
       
    },
    getUserList() {
        getUsers().then(res => {
            if (res.data.code === 0) {
                this.staffs = res.data.data;
            } else {
                this.$Message.error(res.data.code + "：" + res.data.msg);
            }
        });
    },
    getRoles() {
        getHotelRoles().then(res => {
        if (res.data.code === 0) {
          this.rolesList = res.data.data;
        } else {
          this.$Message.error(res.data.code + "：" + res.data.msg);
        }
      });
    },
  }
}
</script>

<style>

</style>
