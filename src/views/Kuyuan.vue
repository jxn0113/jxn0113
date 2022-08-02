<template>
  <div class="stock-wrap">
    <div class="tabs-component-container">
      <div class="tabs-bar">
        <span class="tabs-tab tabs-tab-active">{{
          $t("i18n_librarySourceApplication")
        }}</span>
      </div>
      <div class="search-bar">
        <el-form
          label-width="80px"
          style="
            display: flex;
            align-items: center;
            height: 56px;
            border-bottom: 1px solid #e8e8e8;
          "
        >
          <el-form-item
            label="供应商："
            style="font-weight: 500; margin-bottom: 0"
          >
            <el-input
              style="width: 300px"
              size="small"
              v-model="companyName"
              clearable
              @input="handleIconClick"
              placeholder="请输入供应商简称/名称"
            >
              <i
                class="el-icon-search el-input__icon"
                style="cursor: pointer"
                slot="suffix"
                @click="handleIconClick"
              >
              </i>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="category-bar" style="padding-left: 24px" ref="categoryBar">
          <section style="display: flex; margin-top: 18px">
            <div class="search-label" style="flex: 0 0 130px">一级分类：</div>
            <div>
              <span
                style="margin-right: 25px; display: inline-block; height: 40px"
              >
                <el-checkbox
                  v-model="firstCategoryUnlimited"
                  @change="changeFirstCategoryUnlimited"
                >
                  <span
                    :style="{
                      'font-weight': firstCategoryUnlimited ? '700' : '500',
                    }"
                  >
                    不限
                  </span>
                </el-checkbox>
              </span>
              <span
                style="margin-right: 25px; display: inline-block; height: 40px"
                v-for="(item, index) of allNodeList"
                :key="item.dictCode"
              >
                <el-checkbox
                  v-model="item.checked"
                  @change="changeFirstCategory(item)"
                  :indeterminate="item.isIndeterminate"
                  :ref="'checkbox' + index"
                >
                </el-checkbox>
                <span
                  @click.stop="toggleVisible(item, $event, index)"
                  v-click-outside="
                    () => {
                      closeFirstPanel(item);
                    }
                  "
                  style="
                    position: relative;
                    margin-left: 8px;
                    margin-right: 8px;
                    cursor: pointer;
                  "
                >
                  <span
                    :style="{
                      color:
                        item.isIndeterminate || item.checked ? '#00aa91' : '',
                      'font-weight':
                        item.isIndeterminate || item.checked ? '700' : '500',
                    }"
                    @mouseenter.stop="getFirstPanelStyle($event, item, true)"
                    @mouseleave.stop="getFirstPanelStyle($event, item, false)"
                    >{{ item.dictDesc }} <i class="el-icon-arrow-down"></i
                  ></span>
                  <el-cascader-panel
                    v-show="item.isShow"
                    @change="
                      panelSelectChange(item, item.childList, item.selectList)
                    "
                    v-model="item.selectList"
                    :style="{
                      display: 'inline-flex',
                      position: 'absolute',
                      top: '24px',
                      left: left,
                      background: 'white',
                      'z-index': 20,
                    }"
                    :options="item.childList"
                    :ref="'cascader' + index"
                    @expand-change.once="expand(index)"
                    :props="{
                      expandTrigger: 'hover',
                      multiple: true,
                      value: 'dictCode',
                      label: 'dictDesc',
                      children: 'childList',
                    }"
                  >
                  </el-cascader-panel>
                </span>
              </span>
            </div>
          </section>
          <section style="display: flex">
            <div class="search-label" style="flex: 0 0 130px">
              供应商常用分类：
            </div>
            <span
              style="margin-right: 25px; display: inline-block; height: 40px"
            >
              <el-checkbox
                v-model="commonUseCategoryUnlimited"
                @change="changeCommonUseCategoryUnlimited"
              >
                <span
                  :style="{
                    'font-weight': commonUseCategoryUnlimited ? '700' : '500',
                  }"
                >
                  不限
                </span>
              </el-checkbox>
            </span>
            <template v-for="firstCategory of commonUseNodeList">
              <template v-for="secondCategory of firstCategory.childList">
                <template v-for="thirdCondition of secondCategory.childList">
                  <span
                    style="
                      margin-right: 25px;
                      display: inline-block;
                      height: 40px;
                    "
                    :key="thirdCondition.dictCode"
                  >
                    <el-checkbox
                      v-model="thirdCondition.checked"
                      @change="
                        changecommonUseCategory(firstCategory, thirdCondition)
                      "
                    >
                      <span
                        :style="{
                          'font-weight': thirdCondition.checked ? '700' : '500',
                        }"
                      >
                        {{ thirdCondition.dictDesc }}
                      </span>
                    </el-checkbox>
                  </span>
                </template>
              </template>
            </template>
          </section>
          <section style="display: flex">
            <div class="search-label" style="flex: 0 0 130px">
              投放渠道常用分类：
            </div>
            <span
              style="margin-right: 25px; display: inline-block; height: 40px"
            >
              <el-checkbox
                v-model="commonUseChannelUnlimited"
                @change="changeCommonUseChannelUnlimited"
              >
                <span
                  :style="{
                    'font-weight': commonUseChannelUnlimited ? '700' : '500',
                  }"
                >
                  不限
                </span>
              </el-checkbox>
            </span>
            <template v-for="cItem of commonUseChannelList">
              <span
                style="margin-right: 25px; display: inline-block; height: 40px"
                :key="cItem.dictCode"
              >
                <el-checkbox
                  v-model="cItem.checked"
                  @change="changecommonUseChannel(cItem)"
                >
                  <span
                    :style="{ 'font-weight': cItem.checked ? '700' : '500' }"
                  >
                    {{ cItem.dictDesc }}
                  </span>
                </el-checkbox>
              </span>
            </template>
          </section>
          <section style="display: flex; margin-bottom: 4px">
            <div class="search-label" style="flex: 0 0 70px">已选条件：</div>
            <div
              style="flex: 1; font-size: 0"
              v-if="
                !firstCategoryUnlimited ||
                !commonUseCategoryUnlimited ||
                !commonUseChannelUnlimited
              "
            >
              <template v-for="firstCondition of selectedConditionlist">
                <template v-for="secondCondition of firstCondition.childList">
                  <template
                    v-for="thirdCondition of secondCondition.childList.filter(
                      (item) => item.checked
                    )"
                  >
                    <el-tag
                      size="small"
                      closable
                      :key="thirdCondition.dictCode"
                      @close="
                        clearCurrentCondition(
                          firstCondition,
                          secondCondition,
                          thirdCondition
                        )
                      "
                      type="info"
                      style="margin: 0 10px 12px 0"
                    >
                      {{
                        firstCondition.isHidden
                          ? ""
                          : `${firstCondition.dictDesc}/`
                      }}{{ thirdCondition.dictDesc }}
                    </el-tag>
                  </template>
                </template>
              </template>
              <template
                v-for="cItem of commonUseChannelList.filter(
                  (item) => item.checked
                )"
              >
                <el-tag
                  size="small"
                  closable
                  :key="cItem.dictCode"
                  @close="clearChannelCondition(cItem)"
                  type="info"
                  style="margin: 0 10px 12px 0"
                >
                  {{ cItem.dictDesc }}
                </el-tag>
              </template>
              <el-button
                type="primary"
                size="mini"
                style="padding: 5px 10px"
                @click="clearAllSelectedCondition()"
              >
                清空
              </el-button>
            </div>
            <div v-else>
              <el-tag size="small" type="info" style="margin: 0 10px 10px 0">
                暂无选择分类
              </el-tag>
            </div>
          </section>
        </div>
      </div>
      <div class="main" style="background: white">
        <div
          style="
            padding: 12px 16px 12px 24px;
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          "
        >
          <span>推荐供应商</span>
          <el-button type="primary" size="mini" @click="showDetail">
            对比查看
          </el-button>
        </div>
        <div style="padding-left: 12px; padding-right: 16px">
          <el-table
            :data="tableData.list"
            border
            header-cell-class-name="p-header-cell"
            height="calc(100vh - 200px)"
            style="width: 100%"
            :fit="true"
          >
            <el-table-column
              prop="orgCode"
              width="370px"
              fixed="left"
              label="推荐供应商"
            >
              <template slot-scope="{ row }">
                <div style="display: flex; align-items: center">
                  <section style="flex: 0 0 62px">
                    <el-avatar :size="50" :src="icon"> </el-avatar>
                  </section>
                  <section>
                    <el-tooltip content="点击可查看供应商详情" placement="top">
                      <div
                        style="padding: 4px 0; color: #00aa91; cursor: pointer"
                        @click="getSuppierInfo(row)"
                      >
                        {{ row.companyName }}
                      </div>
                    </el-tooltip>
                    <div
                      style="color: rgb(179, 183, 187); padding: 4px 0"
                      v-if="row.cityName || row.companyCode"
                    >
                      <span style="padding-right: 10px">{{
                        row.cityName
                      }}</span>
                      <span
                        v-if="row.supplierCategoryName"
                        style="padding-right: 10px"
                        >{{ row.supplierCategoryName }}</span
                      >
                      <span style="padding-right: 10px"
                        >年度：<span style="color: red">{{
                          row.yearProjectRank
                        }}</span></span
                      >
                      <span style="padding-right: 10px"
                        >项目：{{ row.yearFrameContractRank }}</span
                      >
                    </div>
                    <div style="padding: 4px 0">
                      <el-tag
                        :type="tagType[index % 5]"
                        size="small"
                        style="
                          float: left;
                          border-radius: 10px;
                          padding: 0 12px;
                          margin: 0 8px 8px 0;
                        "
                        v-for="(tag, index) in (
                          row.thirdClassificationList || []
                        ).filter((item) => item.thirdClassificationName)"
                        :key="tag.thirdClassification"
                      >
                        {{ tag.thirdClassificationName }}
                      </el-tag>
                      <!-- </div>
                  <div style="padding:4px 0" v-if="row.channel"> -->
                      <!-- <el-tag :type="tagType[3]" size="small" v-if="row.channel"
                      style="float:left;border-radius: 10px;padding:0 12px;margin:0 8px 8px 0">
                      {{ formatChannel(row.channel) }}
                    </el-tag> -->
                      <el-tag
                        :type="tagType[index % 5]"
                        size="small"
                        style="
                          float: left;
                          border-radius: 10px;
                          padding: 0 12px;
                          margin: 0 8px 8px 0;
                        "
                        v-for="(tag, index) in (row.channelList || []).filter(
                          (item) => item.channelName
                        )"
                        :key="tag.channel"
                      >
                        {{ tag.channelName }}
                      </el-tag>
                    </div>
                  </section>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in tableTitle"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :show-overflow-tooltip="true"
              title="item.label"
              :formatter="item.formatter"
            >
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="handleEdit(scope.row)"
                  >添加对比
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="stock-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableData.pageNum"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="tableData.pageSize"
            layout="sizes, total, jumper, prev, pager, next"
            :total="tableData.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="true"
      @closed="closeTable()"
    >
      <el-table
        :data="addList"
        border
        header-cell-class-name="p-header-cell"
        height="calc(100vh - 100px)"
        style="margin-top: 0px; width: 100%"
      >
        <el-table-column
          prop="orgCode"
          width="350px"
          fixed="left"
          label="推荐供应商"
        >
          <template slot-scope="{ row }">
            <div style="display: flex; align-items: center">
              <section style="flex: 0 0 62px">
                <el-avatar :size="50" :src="icon"> </el-avatar>
              </section>
              <section>
                <div style="padding: 4px 0">{{ row.companyName }}</div>
                <div
                  style="color: rgb(179, 183, 187); padding: 4px 0"
                  v-if="row.cityName || row.companyCode"
                >
                  <span style="padding-right: 10px">{{ row.cityName }}</span>
                  <span
                    v-if="row.supplierCategoryName"
                    style="padding-right: 10px"
                    >{{ row.supplierCategoryName }}</span
                  >
                  <span style="padding-right: 10px"
                    >年度：<span style="color: red">{{
                      row.yearProjectRank
                    }}</span></span
                  >
                  <span style="padding-right: 10px"
                    >项目：{{ row.yearFrameContractRank }}</span
                  >
                </div>
                <div style="padding: 4px 0">
                  <el-tag
                    :type="tagType[index % 5]"
                    size="small"
                    style="
                      float: left;
                      border-radius: 10px;
                      padding: 0 12px;
                      margin: 0 8px 8px 0;
                    "
                    v-for="(tag, index) in (
                      row.thirdClassificationList || []
                    ).filter((item) => item.thirdClassificationName)"
                    :key="tag.thirdClassification"
                  >
                    {{ tag.thirdClassificationName }}
                  </el-tag>
                  <el-tag
                    :type="tagType[index % 5]"
                    size="small"
                    style="
                      float: left;
                      border-radius: 10px;
                      padding: 0 12px;
                      margin: 0 8px 8px 0;
                    "
                    v-for="(tag, index) in (row.channelList || []).filter(
                      (item) => item.channelName
                    )"
                    :key="tag.channel"
                  >
                    {{ tag.channelName }}
                  </el-tag>
                </div>
              </section>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in tableTitle"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :show-overflow-tooltip="true"
          title="item.label"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="delItem(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    getSuppierInfo(row) {
      this.$common.saveQueryParam(
        "0b4da7391e8c4c6b8e823f8ee5ecc044",
        {
          pageForm: 2,
          businessId: 0,
          id: row.id,
        },
        false
      );
      this.$common.openTagsView({
        title: "供应商详情",
        query: {
          pageId: "0b4da7391e8c4c6b8e823f8ee5ecc044",
        },
      });
    },
    expand(index) {
      let rightWidth =
        this.$refs.categoryBar.offsetWidth -
        this.$refs["checkbox" + index][0].$el.offsetLeft;
      let cascaderWidth = this.$refs["cascader" + index][0].$el.offsetWidth * 2;
      if (rightWidth < cascaderWidth) {
        this.left = rightWidth - cascaderWidth - 25 + "px";
      } else {
        this.left = "-25px";
      }
    },
    delItem(row) {
      let rowIndex = this.addList.indexOf(row);
      this.addList.splice(rowIndex, 1);
    },
    handleEdit(row) {
      let rowItem = this.addList.find((item) => item == row);
      if (rowItem) {
        this.$message({
          message: "已存在",
          type: "warning",
        });
      } else {
        this.addList.push(row);
        this.$message({
          message: "添加成功！",
          type: "success",
        });
      }
    },
    handleSizeChange(pageSize) {
      this.tableData.pageSize = pageSize;
      this.queryTableList();
    },
    handleCurrentChange(pageNum) {
      this.tableData.pageNum = pageNum;
      this.queryTableList();
    },
    async queryTableList() {
      let selectList = this.selectedConditionlist
        .map((firstCondition) => {
          return firstCondition.childList.map((secondCondition) => {
            return secondCondition.childList.reduce((acc, thirdCondition) => {
              if (thirdCondition.checked) {
                acc.push(thirdCondition.dictCode);
              }
              return acc;
            }, []);
          });
        })
        .flat(2);
      // console.log('selectList', selectList);
      let selectChannelList = this.commonUseChannelList.reduce((acc, cItem) => {
        if (cItem.checked) {
          acc.push(cItem.dictCode);
        }
        return acc;
      }, []);
      // console.log('cItem', selectChannelList);
      this.tableData = (
        await this.$axios.post(
          "/api/srm/supplier/basic_info/supplier_library",
          {
            pageSize: this.tableData.pageSize,
            pageNum: this.tableData.pageNum,
            companyName: this.companyName,
            companyShortName: this.companyShortName,
            dictConfigList: selectList,
            channelItemList: selectChannelList,
          }
        )
      ).data.data;
    },
    //点击删除单个已选条件
    clearCurrentCondition(
      firstChildrenItem,
      secondChildrenItem,
      thirdChildrenItem
    ) {
      let secondChildrenList = firstChildrenItem.childList;
      if (firstChildrenItem.isHidden) {
        secondChildrenList.forEach((secondChildrenListItem) => {
          secondChildrenListItem.childList.forEach((thirdItem) => {
            if (thirdItem.dictCode == thirdChildrenItem.dictCode) {
              thirdItem.checked = false;
            }
          });
        });
        this.setCommonCategoryUnlimited();
        this.queryTableList();
      } else {
        let secondChildrenList = firstChildrenItem.childList;
        firstChildrenItem.selectList = (
          firstChildrenItem.selectList || []
        ).filter((selectItemList) => {
          return !(
            selectItemList[0] == secondChildrenItem.dictCode &&
            selectItemList[1] == thirdChildrenItem.dictCode
          );
        });
        this.panelSelectChange(
          firstChildrenItem,
          secondChildrenList,
          firstChildrenItem.selectList
        );
      }
    },
    // 点击删除单个投放渠道
    clearChannelCondition(cItem) {
      this.commonUseChannelList.forEach((item) => {
        if (item.dictCode == cItem.dictCode) {
          item.checked = false;
        }
      });
      this.queryTableList();
    },
    closeTable() {
      this.addList = [];
    },
    showDetail() {
      this.dialogVisible = true;
    },
    //清空所有已选条件
    clearAllSelectedCondition() {
      this.handleCategoryUnlimited(this.allNodeList);
      this.handleCategoryUnlimited(this.commonUseNodeList);
      this.handleChannelUnlimited(this.commonUseChannelList);
      this.setFirstCategoryUnlimited();
      this.setCommonCategoryUnlimited();
      this.setCommonChannelUnlimited();
      this.queryTableList();
    },
    //点击一级分类不限
    changeFirstCategoryUnlimited() {
      if (this.allNodeList.every((item) => !item.checked)) {
        this.firstCategoryUnlimited = true;
        return;
      }
      this.handleCategoryUnlimited(this.allNodeList);
      this.queryTableList();
    },
    handleCategoryUnlimited(nodeList) {
      nodeList.forEach((firstItem) => {
        this.$set(firstItem, "checked", false);
        this.$set(firstItem, "isIndeterminate", false);
        this.$set(firstItem, "selectList", []);
        firstItem.childList.forEach((secondItem) => {
          this.$set(secondItem, "checked", false);
          secondItem.childList.forEach((thirdItem) => {
            this.$set(thirdItem, "checked", false);
          });
        });
      });
    },
    //点击供应商常用分类不限
    changeCommonUseCategoryUnlimited() {
      if (!this.getCommonUseNodeListChecked()) {
        this.setCommonCategoryUnlimited();
        return;
      }
      this.handleCategoryUnlimited(this.commonUseNodeList);
      this.queryTableList();
    },
    handleCommonUseCategoryUnlimited() {
      this.commonUseNodeList.forEach((item) => {
        this.$set(item, "checked", false);
      });
    },
    handleChannelUnlimited(nodeList) {
      nodeList.forEach((cItem) => {
        this.$set(cItem, "checked", false);
        this.$set(cItem, "isIndeterminate", false);
        this.$set(cItem, "selectList", []);
        // firstItem.childList.forEach(secondItem => {
        //   this.$set(secondItem, "checked", false)
        //   secondItem.childList.forEach(thirdItem => {
        //     this.$set(thirdItem, "checked", false)
        //   })
        // })
      });
    },
    //点击投资渠道常用分类不限
    changeCommonUseChannelUnlimited() {
      if (!this.getCommonUseChannelListChecked()) {
        this.setCommonChannelUnlimited();
        return;
      }
      this.handleChannelUnlimited(this.commonUseChannelList);
      this.queryTableList();
    },
    handleCommonUseCategoryUnlimited() {
      this.commonUseChannelList.forEach((item) => {
        this.$set(item, "checked", false);
      });
    },
    changeFirstCategory(firstitem) {
      //如果是半选状态,设置为不选状态
      if (firstitem.isIndeterminate) {
        this.$set(firstitem, "checked", false);
      }
      this.$set(firstitem, "isIndeterminate", false);
      if (firstitem.checked) {
        let selectList = [];
        firstitem.childList.forEach((secondItem) => {
          secondItem.checked = true;
          secondItem.childList.forEach((thirdItem) => {
            selectList.push([secondItem.dictCode, thirdItem.dictCode]);
            thirdItem.checked = true;
          });
        });
        this.$set(firstitem, "selectList", selectList);
      } else {
        firstitem.selectList = [];
        firstitem.childList.forEach((secondItem) => {
          secondItem.checked = false;
          secondItem.childList.forEach((thirdItem) => {
            thirdItem.checked = false;
          });
        });
      }
      this.setFirstCategoryUnlimited();
      this.queryTableList();
    },
    //设置一级分类不限
    setFirstCategoryUnlimited() {
      this.firstCategoryUnlimited = !this.allNodeList.some(
        (item) => item.checked
      );
    },
    //设置供应商常用分类不限
    setCommonCategoryUnlimited() {
      this.commonUseCategoryUnlimited = !this.getCommonUseNodeListChecked();
    },
    //判断供应商常用分类是否选中
    getCommonUseNodeListChecked() {
      return this.commonUseNodeList.some((firstItem) => {
        return firstItem.childList.some((secondItem) => {
          return secondItem.childList.some((thirdItem) => {
            return thirdItem.checked;
          });
        });
      });
    },
    //设置投放渠道常用分类不限
    setCommonChannelUnlimited() {
      this.commonUseChannelUnlimited = !this.getCommonUseChannelListChecked();
    },
    //判断投放渠道常用分类是否选中
    getCommonUseChannelListChecked() {
      return this.commonUseChannelList.some((cItem) => {
        return cItem.checked;
      });
    },
    //点击供应商常用分类节点
    changecommonUseCategory() {
      this.commonUseCategoryUnlimited = !this.getCommonUseNodeListChecked();
      this.queryTableList();
    },
    //点击投资渠道常用分类节点
    changecommonUseChannel() {
      this.commonUseChannelUnlimited = !this.getCommonUseChannelListChecked();
      this.queryTableList();
    },
    async getAllCategoryNode() {
      this.allNodeList = (
        await this.$axios.post("/api/srm/dict/query", [
          {
            dictKey: "supplierServiceTree",
          },
        ])
      ).data.data.list;
      this.channelList = (
        await this.$axios.post("/api/srm/dict/query", [
          {
            dictKey: "deliveryChannel",
          },
        ])
      ).data.data.list;
      this.commonUseNodeList = _.cloneDeep(this.allNodeList).filter(
        (firstItem) => {
          //常用分类,不需要显隐一级名称
          firstItem.isHidden = true;
          firstItem.childList = firstItem.childList.filter((secondItem) => {
            secondItem.childList = secondItem.childList.filter((thirdItem) => {
              return thirdItem.isCommon == "Y";
            });
            return secondItem.childList.length;
          });
          return firstItem.childList.length;
        }
      );
      this.selectedConditionlist = [
        ...this.allNodeList,
        ...this.commonUseNodeList,
      ];
      this.commonUseChannelList = _.cloneDeep(this.channelList).filter(
        (item) => {
          return item.isCommon == "Y";
        }
      );
    },
    getFirstPanelStyle($event, item, type) {
      $event.target.style.color =
        item.isIndeterminate || item.checked || type ? "#00aa91" : "";
      $event.target.style["font-weight"] =
        item.isIndeterminate || item.checked || type ? "700" : "500";
    },
    //将选中的二三级节点处理成树结构
    buildSelectedNodeToTreeList(selectList) {
      return selectList.reduce((acc, selectItemList) => {
        let selectCategory = acc.find(
          (selectCategory) => selectCategory.dictCode == selectItemList[0]
        );
        if (selectCategory) {
          selectCategory.childList.push({
            dictCode: selectItemList[1],
            childList: [],
          });
        } else {
          acc.push({
            dictCode: selectItemList[0],
            childList: [
              {
                dictCode: selectItemList[1],
              },
            ],
          });
        }
        return acc;
      }, []);
    },
    //点击二三级面板x
    panelSelectChange(firstChildrenItem, secondChildrenList, selectList) {
      let allThirdChildrenLength = secondChildrenList.reduce((acc, item) => {
        acc += item.childList.length;
        return acc;
      }, 0);
      firstChildrenItem.checked = selectList.length > 0;
      firstChildrenItem.isIndeterminate =
        selectList.length > 0 && allThirdChildrenLength != selectList.length;
      this.setFirstCategoryUnlimited();
      //将选中的数据处理成树
      let selectedTreeList = this.buildSelectedNodeToTreeList(selectList);
      secondChildrenList.forEach((secondItem) => {
        let selectItem = selectedTreeList.find(
          (selectItem) => selectItem.dictCode == secondItem.dictCode
        );
        if (!selectItem) {
          secondItem.checked = false;
          secondItem.childList.forEach((item) => {
            item.checked = false;
          });
        } else {
          secondItem.checked = true;
          secondItem.childList.forEach((thirdChildItem) => {
            thirdChildItem.checked = Boolean(
              selectItem.childList.find(
                (item) => item.dictCode == thirdChildItem.dictCode
              )
            );
          });
        }
      });
      this.queryTableList();
    },
    toggleVisible(item, event, index) {
      this.allNodeList.forEach((ele) => {
        ele.isShow && this.$set(ele, "isShow", false);
      });
      this.$set(item, "isShow", true);
      let rightWidth =
        this.$refs.categoryBar.offsetWidth -
        this.$refs["checkbox" + index][0].$el.offsetLeft;
      this.$nextTick(() => {
        let cascaderWidth = this.$refs["cascader" + index][0].$el.offsetWidth;
        if (rightWidth < cascaderWidth) {
          this.left = rightWidth - cascaderWidth - 25 + "px";
          return;
        }
        if (rightWidth >= cascaderWidth) {
          this.left = "-25px";
          return;
        }
        if (rightWidth <= cascaderWidth * 2) {
          this.left = rightWidth - cascaderWidth + "px";
        }
      });
    },
    closeFirstPanel(item) {
      if (!item.isShow) {
        return;
      }
      this.$set(item, "isShow", false);
    },
    handleIconClick() {
      this.queryTableList();
    },
    formatChannel(channelCode) {
      let item =
        this.channelList.find((item) => {
          return item.dictCode == channelCode;
        }) || {};
      return item.dictDesc;
    },
  },
  async created() {
    await this.getAllCategoryNode();
    this.queryTableList();
  },
  mounted() {},
  data() {
    return {
      icon: "data:image/jpeg;base64,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",
      left: "-25px",
      cascaderPanelPosition: {},
      dialogVisible: false,
      tableTitle: [
        {
          prop: "cooperationStatusName",
          label: "合作状态",
          // width: "100px"
        },
        {
          prop: "channel",
          label: "投放渠道",
          // width: "100px",
          formatter: (row, column, cellValue, index) => {
            let item =
              this.channelList.find((item) => {
                return item.dictCode == row.channel;
              }) || {};
            return item.dictDesc;
          },
        },
        {
          prop: "businessAdvantage",
          label: "业务优势",
          width: "120px",
        },
        {
          prop: "serviceCharge",
          label: "服务费",
          width: "80px",
        },
        {
          prop: "paymentDays",
          label: "账期天数",
          width: "80px",
        },
        {
          prop: "paymentMethodName",
          label: "付款方式",
          width: "80px",
        },
        {
          prop: "registrationDate",
          label: "注册日期",
          width: "100px",
        },
        {
          prop: "registrationFund",
          label: "注册资金（万）",
          width: "120px",
        },
        {
          prop: "contact",
          label: "联系人",
          width: "80px",
        },
        {
          prop: "contactWay",
          label: "联系方式",
          width: "100px",
        },
        {
          prop: "email",
          label: "电子邮箱",
          width: "80px",
        },
        {
          prop: "post",
          label: "职位",
          width: "80px",
        },
        {
          prop: "payPeriodName",
          label: "结算周期",
          width: "80px",
        },
        {
          prop: "collaborateDepartment",
          label: "合作部门",
          width: "80px",
        },
        {
          prop: "eventName",
          label: "合作项目",
          width: "80px",
        },
        {
          prop: "supplierStatusName",
          label: "供应商状态",
          width: "100px",
        },
        {
          prop: "bankCode",
          label: "银行开户行",
          width: "100px",
        },
        {
          prop: "bankName",
          label: "银行账户名称",
          width: "160px",
        },
        {
          prop: "accountNum",
          label: "银行账号",
          width: "120px",
        },
        {
          prop: "invoiceTypeName",
          label: "发票类型",
          width: "80px",
        },
      ],
      tagType: ["danger", "warning", "info", "success", "primary"],
      companyName: "",
      firstCategoryUnlimited: true,
      commonUseCategoryUnlimited: true,
      commonUseChannelUnlimited: true,
      tableData: {
        list: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      allNodeList: [],
      channelList: [],
      commonUseNodeList: [],
      commonUseChannelList: [],
      selectedConditionlist: [],
      addList: [],
    };
  },
};
</script>

<style scoped>
.tabs-bar {
  box-sizing: border-box;
  height: 56px;
  padding-left: 24px;
}

.tabs-tab {
  box-sizing: border-box;
  height: 56px;
  line-height: 56px;
  display: inline-block;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #bfbfbf;
  margin-right: 32px;
  cursor: pointer;
}

.stock-wrap .tabs-tab:hover {
  color: #333333;
}

.stock-wrap .tabs-tab-active {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}

.stock-wrap .search-bar {
  background-color: white;
  border-bottom: 1px solid #E8E8E8;
}

.stock-wrap .search-bar .search-label {
  font-size: 14px;
  color: #606266;
  padding: 0 12px 0 0;
}

.stock-wrap .p-header-cell {
  background-color: #f8f8f8 !important;
  padding: 8px 0 !important;
}

.stock-wrap .p-header-cell .cell {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
}

.stock-wrap .stock-pagination {
  height: 40px;
  padding-top: 12px;
  text-align: right;
}

.stock-wrap .el-pagination__sizes {
  float: left;
}

</style>