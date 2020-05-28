<template>
  <div>
    <div style="margin-bottom: 5px">
      <!-- 查询 增加区 -->
      <Row>
        <Col span="20">
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
        >查询</Button>
        </Col>
        <!-- <Col span="8">
                    
                </Col> -->
        <Col
          span="4"
          align="right"
        >
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="typeModal = true;typeTitle = '添加字典分类';"
        >
          添加分类
        </Button>
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="dicModal = true;dicTitle = '添加字典'"
        >
          添加字典
        </Button>
        </Col>
      </Row>

    </div>
    <div style="height: 500px">
      <!-- 字典显示表格 -->
      <Table
        :columns="colDic"
        :data="dics"
        stripe
        :loading="false"
        height="400"
      >
        <template slot-scope="{row}" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="openDicEditModal(row)"
          >修改</Button>
          <Button
            type="error"
            size="small"
          >删除</Button>
        </template>
      </Table>
    </div>
    <div>
      <!-- 字典类型区 -->
      <Table
        :columns="colType"
        :data="dicTypes"
        stripe
        :loading="false"
        height="500"
      >
        <template slot-scope="{row}" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="openTypeEditModal(row)"
          >修改</Button>
          <Button
            type="error"
            size="small"
          >删除</Button>
        </template>
      </Table>
    </div>

    <Modal
      v-model="typeModal"
      :title="typeTitle"
      @on-visible-change="resetForm('formDicType',$event)"
    >
      <!-- resetForm('formDicType') -->
      <Form
        ref="formDicType"
        :model="dicType"
        :label-width="80"
        :rules="ruleDicType"
      >
        <FormItem
          label="分类代码"
          prop="dicTypeCode"
        >
          <Input
            v-model="dicType.dicTypeCode"
            placeholder="请输入分类代码"
          ></Input>
        </FormItem>
        <FormItem
          label="分类名称"
          prop="dicTypeName"
        >
          <Input
            v-model="dicType.dicTypeName"
            placeholder="请输入分类名称"
          ></Input>
        </FormItem>
        <FormItem
          label="分类类型"
          prop="dicTypeClass"
        >
          <Select v-model="dicType.dicTypeClass">
            <Option value="common">公共</Option>
            <Option value="hotel">hotel</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          size="large"
          @click="typeModal = false"
        >取消</Button>
        <Button
          type="primary"
          size="large"
          :loading="loadDicType"
          @click="submitDicType"
        >确定</Button>
      </div>

    </Modal>

    <Modal
      v-model="dicModal"
      :title="dicTitle"
      @on-visible-change="resetForm('formDicCommon',$event)"
    >
      <Form
        ref="formDicCommon"
        :model="dic"
        :label-width="80"
        :rules="ruleDicCommon"
      >
        <FormItem
          label="选择类型"
          prop="dicTypeId"
        >
          <Select v-model="dic.dicTypeId">
            <Option
              v-for="item in selectDicTypes"
              :key="item.dicTypeId"
              :value="item.dicTypeId"
            >{{ item.dicTypeName }}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="代码"
          prop="dicCommonCode"
        >
          <Input
            v-model="dic.dicCommonCode"
            placeholder="请输入代码"
          ></Input>
        </FormItem>
        <FormItem
          label="名称"
          prop="dicCommonName"
        >
          <Input
            v-model="dic.dicCommonName"
            placeholder="请输入名称"
          ></Input>
        </FormItem>
        <FormItem label="父节点">
          <Input
            v-model="dic.parentId"
            placeholder="请输入父节点"
          ></Input>
        </FormItem>
        <FormItem label="层级">
          <Input
            v-model="dic.dicLevel"
            placeholder="请输入层级"
          ></Input>
        </FormItem>
        <FormItem label="排序">
          <Input
            v-model="dic.sortNo"
            placeholder="请输入排序序号"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          size="large"
          @click="dicModal = false;"
        >取消</Button>
        <Button
          type="primary"
          size="large"
          :loading="loadDicCommon"
          @click="submitDicCommon"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import dic from "./data/dicData.js";
import { addDicType, 
        getDicType, 
        getDicCommon, 
        addDicCommon, 
        addOrUpdateDicType, 
        addOrUpdateDicCommon
 } from "@/api/dic";
export default {
  name: "DicCommon",
  data() {
    return {
      typeModal: false,
      dicModal: false,
      dics: [],
      dicTypes: [],
      colDic: dic.colDic,
      colType: dic.colType,
      dic: {
        dicCommonId: null,
        dicCommonCode: "",
        dicCommonName: "",
        dicTypeId: "",
        parentId: "",
        dicLevel: "",
        sortNo: ""
      },
      dicType: {
        dicTypeId: null,  
        dicTypeName: "",
        dicTypeCode: "",
        dicTypeClass: ""
      },
      ruleDicType: {
        dicTypeName: [
          { required: true, message: "请输入字典类型名称", trigger: "blur" }
        ],
        dicTypeCode: [
          { required: true, message: "请输入字典类型代码", trigger: "blur" }
        ],
        dicTypeClass: [
          { required: true, message: "请输入字典类型分类", trigger: "blur" }
        ]
      },
      ruleDicCommon: {
        dicCommonName: [
          { required: true, message: "请输入字典名称", trigger: "blur" }
        ],
        dicCommonCode: [
          { required: true, message: "请输入字典代码", trigger: "blur" }
        ],
        dicTypeId: [
          { required: true, type:'number', message: "请输入字典类型", trigger: "blur" }
        ]
      },
      loadDicType: false,
      loadDicCommon: false,
      typeTitle: '添加字典分类',
      dicTitle: '添加字典'
    };
  },
  computed: {
    selectDicTypes() {
      return this.dicTypes.filter(dicType => {
        return dicType.dicTypeClass == "common";
      });
    }
  },
  methods: {
    submitDicType() {
      console.log(this.dicType);
      this.$refs["formDicType"].validate(valid => {
        if (valid) {
          this.loadDicType = true;
          console.log("通过");
          let method = "post";
          if(this.dicType.dicTypeId !== null) {
              method = "patch";
          }
          addOrUpdateDicType(this.dicType,method).then(res => {
            if (res.data.code == 0) {
              this.$Message.success(res.data.msg);
              this.typeModal = false;
              this.getDicTypeList();
            }
          });
        } else {
          this.$Message.error("请输入");
          this.loadDicType = false;
        }
      });
    },
    submitDicCommon() {
        console.log(this.dic);
      this.$refs["formDicCommon"].validate(valid => {
        if (valid) {
          this.loadDicCommon = true;
          console.log("通过");
          let method = "post";
          if(this.dic.dicCommonId !== null) {
              method = "patch";
          }
          addOrUpdateDicCommon(this.dic, method).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(res.data.msg);
              this.dicModal = false;
              this.getDicCommonList();
            }
          });
        } else {
            console.log(this.dic);
          this.$Message.error("请输入");
          this.loadDicCommon = false;
        }
      });
    },
    getDicTypeList() {
      getDicType(null).then(res => {
        this.dicTypes = res.data.data;
      });
    },
    getDicCommonList() {
      let data = {
        dicTypeId: null,
        parentId: null,
        dicLevel: null,
        deleted: false
      };
      getDicCommon(data).then(res => {
        this.dics = res.data.data;
      });
    },
    openTypeEditModal(row){
        this.typeTitle = "修改字典分类";
        this.typeModal = true; 
        this.dicType.dicTypeId = row.dicTypeId;
        this.dicType.dicTypeName = row.dicTypeName;
        this.dicType.dicTypeCode = row.dicTypeCode;
        this.dicType.dicTypeClass = row.dicTypeClass;
    },
    openDicEditModal(row){
        this.dicTitle = "修改字典";
        this.dicModal = true; 
        this.dic.dicCommonId = row.dicCommonId;
        this.dic.dicCommonCode = row.dicCommonCode;
        this.dic.dicCommonName = row.dicCommonName;
        this.dic.dicTypeId = row.dicTypeId;
         this.dic.parentId = row.parentId;
        this.dic.dicLevel = row.dicLevel;
        this.dic.sortNo = row.sortNo;
    },
    resetForm(formDicType, event) {
      if (!event) {
        console.log("重置");
        // this.$refs[formDicType].resetFields();
        // 恢复默认数据
        Object.assign(this.$data.dicType, this.$options.data().dicType);
        Object.assign(this.$data.dic, this.$options.data().dic);
        this.loadDicType = false;
        this.loadDicCommon = false;
      }
    }
  },
  mounted() {
    this.getDicTypeList();
    this.getDicCommonList();
  }
};
</script>

<style scoped>
</style>
