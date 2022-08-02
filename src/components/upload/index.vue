<template>
  <div>
    <el-upload
      class="customUpload"
      ref="uploadRef"
      multiple
      drag
      :on-change="onFileChange"
      :on-remove="handleRemove"
      :limit="limitFiles.limit - uploadedFiles.length"
      :auto-upload="false"
      :on-exceed="onExceed"
      :file-list="fileList"
      :accept="limitFiles.accecpt"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        <div style="color: #333333">
          将文件拖到此处，或点击上传
          <div>
            <div style="margin: 16px">
              <em>
                <el-button type="primary" plain size="small"
                  >上传文件</el-button
                >
              </em>
            </div>
            <div style="color: #999999; font-size: 12px">
              文件大小： 已上传{{ uploadedFiles.length }}个（共{{
                uploadedTotalSize
              }}M），还可上传{{
                limitFiles.limit - uploadedFiles.length
              }}个（共{{ (limitFiles.total - uploadedTotalSize).toFixed(2) }}M）
            </div>
            <div style="color: #999999; font-size: 12px">
              文件格式： {{ limitFiles.limitformat }}
            </div>
          </div>
        </div>
      </div>
    </el-upload>
    <el-progress
      :style="{
        visibility: percentage ? 'visible' : 'hidden',
        'margin-bottom': percentage ? '6px' : '0px',
      }"
      :percentage="percentage"
      :status="uploadStatus"
    >
    </el-progress>
    <div style="text-align: right">
      <el-button @click="handleClose" size="small">取消</el-button>
      <el-button @click="handleSubmit" size="small" type="primary"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: null,
  },
  data() {
    return {
      fileList: [],
      //上传限制10个,100M
      limitFiles: {
        limit: 10,
        total: 100,
        limitformat:
          "*.jpe *.jpeg *.jpg *.png *.gif *.mp4* .doc *.docx *.xls *.xlsx *.ppt *.pptx *.pdf *.zip *.rar",
        accecpt:
          "image/jpeg,image/gif,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.zip,.rar,video/mp4,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
      },
      businessKey: "",
      //已上传的文件
      uploadedFiles: [],
      uploadedTotalSize: 0,
      ...this.getDefaultProgressStatus(),
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {
    //调用上传组件需要的入参 2个
    //1.业务类型
    //2.已经上传的文件list
    // this.businessKey = "SUPPLIER_CHANNEL_ITEM";
    // this.uploadedFiles = [{
    //   id: 11,
    //   fileName: "33",
    //   fileSuffix: "aa",
    //   fileSize: 10 * 1024 * 1024
    // }, {
    //   id: 11,
    //   fileName: "33",
    //   fileSuffix: "aa",
    //   fileSize: 1024
    // }];
    if (!this.__QUERY__) {
      this.__QUERY__ = {};
    }
    this.businessKey = this.__QUERY__.businessKey;
    this.uploadedFiles = this.__QUERY__.uploadedFiles || [];
    this.uploadedTotalSize = this.getFileTotalSize(this.uploadedFiles);
  },
  mounted() {},
  methods: {
    getFileTotalSize(files) {
      return (
        files.reduce((acc, item) => {
          acc += Number(item.fileSize) || 0;
          return acc;
        }, 0) /
        1024 /
        1024
      ).toFixed(2);
    },
    handleSubmit() {
      if (!this.fileList.length) {
        return this.$message.error("请先选择文件");
      }
      // for (let item of this.fileList) {
      //   if (this.limitFiles.limitformat.indexOf(item.name.split(".")[1]) == -1) {
      //     this.$message.error(`只可上传${this.limitFiles.limitformat}格式文件`);
      //     return
      //   }
      // }
      if (!this.businessKey) {
        return this.$message.error("businessKey不能为空");
      }
      this.resetProgressStatus();
      if (
        this.getFileTotalSize(this.fileList) >
        this.limitFiles.total - this.uploadedTotalSize
      ) {
        return this.$message.error(
          `本次上传总文件大小不能超过${(
            this.limitFiles.total - this.uploadedTotalSize
          ).toFixed(2)}M`
        );
      }
      const xhr = new XMLHttpRequest();
      if (xhr.upload) {
        xhr.upload.onprogress = (e) => {
          if (e.total > 0) {
            this.percentage = ((e.loaded / e.total) * 100).toFixed(2);
            console.log(this.percentage);
          }
        };
      }
      const formData = new FormData();
      formData.append("businessKey", this.businessKey);
      this.fileList.forEach((file) => {
        formData.append("files", file.raw);
      });
      xhr.responseType = "json";
      xhr.open("post", "/api/srm/file/upload", true);
      xhr.send(formData);
      xhr.onerror = () => {
        this.uploadError();
      };
      xhr.onload = () => {
        let response = xhr.response;
        if (!response.success) {
          this.uploadError(response.message);
        } else {
          this.uploadSuccess(response.data);
        }
      };
    },
    uploadError(message = "文件上传失败") {
      this.uploadStatus = "exception";
      this.$message.error(message);
    },
    uploadSuccess(data) {
      this.$message.success("文件上传成功");
      this.$bus.$emit("uploadFileSuccess", data);
      this.handleClose();
    },
    onExceed(files, fileList) {
      this.$message.error(
        `本次上传最多可以选择${
          this.limitFiles.limit - this.uploadedFiles.length
        }个文件`
      );
    },
    resetProgressStatus() {
      let defaultValue = this.getDefaultProgressStatus();
      this.uploadStatus = defaultValue.uploadStatus;
      this.percentage = defaultValue.percentage;
    },
    getDefaultProgressStatus() {
      return {
        uploadStatus: "success",
        percentage: 0,
      };
    },
    onFileChange(file, fileList) {
      console.log(file, 1111);
      this.resetProgressStatus();
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.onFileChange(file, fileList);
    },
    handleClose() {
      this.$common.closeCurPage.call(this);
    },
  },
};
</script>

<style scoped>
.customUpload .el-upload--text {
  display: flex;
  justify-content: center;
}

.customUpload .el-upload-dragger {
  width: 100%;
  height: 256px;
}
</style>