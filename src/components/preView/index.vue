<template>
  <div class="filePreview">
    <template v-if="files.length">
      <el-carousel
        :initial-index="initialIndex"
        trigger="click"
        :autoplay="false"
        arrow="always"
        height="540px"
        @change="changeImage"
      >
        <el-carousel-item v-for="item in files" :key="item.src">
          <div class="pic-title">
            {{ `${item.fileName}.${item.fileSuffix}` }}
          </div>
          <el-image class="image-container" :src="item.url" fit="contain">
            <div slot="error" class="image-error">
              <div style="font-size: 40px">
                <i class="el-icon-picture-outline"></i>
              </div>
              <div>该文件类型无法预览。</div>
            </div>
          </el-image>
        </el-carousel-item>
      </el-carousel>
    </template>
    <template v-else>
      <el-image class="image-container" style="height: 540px">
        <div slot="error" class="image-error">
          <div style="font-size: 40px">
            <i class="el-icon-picture-outline"></i>
          </div>
          <div>暂无数据</div>
        </div>
      </el-image>
    </template>
    <div class="image-btn">
      <el-button
        size="small"
        :disabled="!files[initialIndex]"
        @click="handleDownLoad"
        ><i class="el-icon-download"></i>下载
      </el-button>
      <el-button
        size="small"
        :disabled="!files[initialIndex]"
        v-if="__QUERY__.disabledDelete != 1"
        @click="handleRemove"
        ><i class="el-icon-delete"></i> 删除</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initialIndex: 0,
      files: [],
    };
  },
  created() {
    this.getInitialIndex();
  },
  methods: {
    /**说明
     * 1.调用该文件预览组件需要3个参数currentPreviewFile,files,第1个是当前要预览的文件 
      * currentPreviewFile={
      *  fileName: "下载"
          fileSize: 103836
          fileSuffix: "zip"
          id: 132
          url: "http://dev-srm-supplier-relationship-management.oss-cn-shenzhen.aliyuncs.com/dev/2022-01-21_09:00:18_2.zip"
          }
          另一个是要预览的所有文件 files 数组
       2. 点击删除时,触发事件 filePreview传入两个参数deleteFiles,files
        一个是当前删除的文件
        deleteFiles=[ {
          fileName: "下载"
            fileSize: 103836
            fileSuffix: "zip"
            id: 132
            url: "http://dev-srm-supplier-relationship-management.oss-cn-shenzhen.aliyuncs.com/dev/2022-01-21_09:00:18_2.zip"
            }]
        第2个是还可以预览的文件files,也就是删除之后还剩下哪些文件,
        第三个disabledDelete 是否可以删除(这个可以不传,默认可以删除 只判断1(不可以删除))
     * 
    */
    getInitialIndex() {
      if (!this.__QUERY__) {
        this.__QUERY__ = {};
      }
      let currentPreviewFile = this.__QUERY__.currentPreviewFile || {};
      this.files = this.__QUERY__.files || [];
      let index = this.files.findIndex(
        (item) => item.id == currentPreviewFile.id
      );
      if (index != -1) {
        this.initialIndex = index;
      }
    },
    handleDownLoad() {
      let url = this.files[this.initialIndex].url;
      if (url.endsWith("pdf")) {
        window.open(url);
      } else {
        var a = document.createElement("a");
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    changeImage(index) {
      this.initialIndex = index;
    },
    handleRemove() {
      let files = [];
      let deleteFiles = [];
      this.files.forEach((item, index) => {
        if (this.initialIndex == index) {
          deleteFiles.push(item);
        } else {
          files.push(item);
        }
      });
      this.files = files;
      if (this.initialIndex > this.files.length - 1) {
        this.initialIndex = this.initialIndex - 1;
      }
      this.$bus.$emit("filePreview", {
        deleteFiles,
        files,
      });
    },
  },
};
</script>

<style scoped>
.filePreview .pic-title {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  padding: 16px 0;
}

.el-dialog__body {
  padding-top: 0px !important;
}

.filePreview .image-container {
  width: 100%;
  flex: 1;
  background: #f5f5f5;
}

.filePreview .el-carousel__item {
  display: flex !important;
  flex-direction: column;
}

.filePreview .image-error {
  background: #f5f5f5;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.filePreview .image-btn {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  text-align: right;
  padding-top: 16px;
}

</style>