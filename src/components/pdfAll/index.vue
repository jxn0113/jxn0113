<template>
    <div class="pdf-all-container">
        <div class="tool-container">
            <el-button
                style="float: right; margin-left: 20px; padding: 6px 15px"
                type="primary"
                size="mini"
                icon="el-icon-download"
                @click="onDownloadFile"
            >
                下载
            </el-button>
            <span style="float: left; color: #666">共 {{ numPages }} 页</span>
            <span
                v-if="loadedRatio > 0 && loadedRatio < 100"
                style="float: left; color: #999; margin-left: 50px; display: inline-block"
            >
                已加载：{{ loadedRatio }}%
            </span>
        </div>
        <div v-loading="loading" v-infinite-scroll="onScrollBtm" class="pdf-viewer">
            <pdf
                v-for="i in numLoadPages"
                :key="i"
                :src="srcTask"
                :page="i"
                style="display: inline-block; width: 100%"
                @progress="loadedRatio = $event"
            />
            <el-empty v-if="loadError" description="预览加载失败，请重新打开！" />
        </div>
    </div>
</template>

<script>
// import { queryFile } from '@/api/upload'//获取上传的文件
import pdf from 'vue-pdf' //引入下载的vue-pdf
// import { download } from '@/utils' //封装的下载方法

export default {
    components: {
        pdf
    },
    props: {
        fileId: {
            type: String,
            default: void 0
        }
    },
    data() {
        return {
            srcTask: void 0,
            numPages: 0,
            numLoadPages: 0,
            loading: false,
            src: void 0,
            fileInfo: {},
            loadError: false,
            loadedRatio: 0
        }
    },
    watch: {
        //实现监听，父组件需要传过来fileId,通过fileId拼接src地址，以此来显示pdf
        fileId: {
            handler: function(val) {
                if (!val) return
                this.loading = true
                queryFile({
                    id: this.fileId
                })
                    .then(result => {
                        // this.loading = false
                        const fileInfo = result.data
                        console.log(fileInfo)
                        this.src = fileInfo.relatPath + fileInfo.fileName.split('.')[0] + '.pdf'
                        this.fileInfo.src = fileInfo.relatPath + fileInfo.fileName
                        this.fileInfo.realName = fileInfo.realName
                    })
                    .catch(err => {
                        this.loading = false
                        console.log({ err })
                    })
            },
            immediate: true
        },
        src: {
            handler: function(val) {
                if (!val) {
                    return
                }
                this.srcTask = pdf.createLoadingTask(val)
                this.srcTask.onProgress = val => {
                    let ratio = (val.loaded / val.total) * 100
                    if (ratio >= 100) {
                        ratio = 100
                        this.loading = false
                    }
                    this.loadedRatio = ratio.toFixed(2)
                }
                this.srcTask.promise
                    .then(pdf => {
                        console.log({ pdf })
                        this.numPages = pdf.numPages
                        this.numLoadPages = pdf.numPages > 4 ? 4 : pdf.numPages
                        this.fileInfo.pageNum = pdf.numPages
                        this.$emit('loaded', this.fileInfo)
                    })
                    .catch(err => {
                        this.loadError = true
                        console.log(err)
                    })
            },
            immediate: true
        }
    },
    methods: {
        //加载pdf,每4页进行更新
        onScrollBtm() {
            if (this.numLoadPages >= this.numPages) {
                return
            }
            if (this.numLoadPages + 4 > this.numPages) {
                this.numLoadPages = this.numPages
                return
            }
            this.numLoadPages += 4
        },
        //下载pdf
        onDownloadFile() {
            // window.open(this.fileInfo.src + '?attname=' + this.fileInfo.realName)
            download(this.fileInfo.src, this.fileInfo.realName)
        }
    }
}
</script>

<style scoped>
.pdf-all-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: auto;
    position: relative;
}

.tool-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 30px;
    /* background: pink; */
}

.pdf-viewer {
    position: absolute;
    left: 0px;
    right: 0;
    top: 40px;
    bottom: 0;
    overflow: auto;
    padding: 10px 20px;
}

.pdf-viewer > span {
    box-shadow: 0px 1px 6px #ddd;
    margin-bottom: 10px;
    border-radius: 7px;
}
</style>
