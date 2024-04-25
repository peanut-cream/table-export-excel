<template>
  <el-dialog
    class="border-dialog"
    :model-value="modelValue"
    :title="title"
    width="800px"
    @close="handleClose"
    draggable
  >
    <div>
      <el-form :model="form" :rules="rules" label-width="100px">
        <el-form-item label="型号/品名" prop="name">
          <el-input v-model.trim="form.name" />
        </el-form-item>
        <el-form-item label="箱数" prop="box_number">
          <el-input-number
            v-model.number.trim="form.box_number"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="每箱箱数" prop="ctn">
          <el-input-number
            v-model.number.trim="form.ctn"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number
            v-model.number.trim="form.price"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="单箱规格" prop="specifications">
          <el-input-number
            v-model.number.trim="form.specifications"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :limit="1"
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            accept=".png,.jpg,.gif,.jpeg"
            @exceed="exceed"
            @change="fileChange"
          >
            <el-icon><Plus /></el-icon>

            <template #file="{ file }">
              <div>
                <el-image
                  ref="imageRef"
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  :preview-src-list="[file.url]"
                  fit=""
                  alt="contain"
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close"> 取消 </el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import Big from "big.js"
import { watch, ref } from "vue"
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue"
import type { UploadFile } from "element-plus"
import { ElMessage } from "element-plus"
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string // 标题
    initform?: Record<string, any> // form
  }>(),
  {
    title: "添加单行数据",
    initform: () => ({})
  }
)
const form = ref<any>({})
const fileList = ref<UploadFile[] & { base64Url?: string }[]>([])
const imageRef = ref()
const rules = {
  name: [{ required: true, message: "请输入型号/品名", trigger: "blur" }],
  box_number: [{ required: true, message: "请输入箱数", trigger: "blur" }],
  ctn: [{ required: true, message: "请输入每箱箱数", trigger: "blur" }],
  price: [{ required: true, message: "请输入每个单价", trigger: "blur" }],
  specifications: [
    { required: true, message: "请输入单箱规格", trigger: "blur" }
  ]
}
watch(
  () => props.initform,
  () => {
    form.value = { ...props.initform }
    if (props.initform.base64Url) {
      const type = props.initform.base64Url.match(/[^:]*(;)+/)[0].slice(0,-1)
      const blob = base64ToBlob(props.initform.base64Url, type)
      fileList.value = [
        {
          base64Url: props.initform.base64Url,
          url: URL.createObjectURL(blob),
          name: props.initform.name,
          uid: props.initform.id,
          status:'success'
        }
      ]
    }
  },
  { immediate: true, deep: true }
)
const emit = defineEmits(["update:modelValue", "close", "confirm"])
// 关闭前操作
const handleClose = () => {
  emit("close")
  fileList.value = []
  form.value = {}
  closeDialog()
}
const closeDialog = () => {
  emit("update:modelValue", false)
}
const close = () => {
  emit("close")
}
const confirm = () => {
  const parms = {
    ...form.value,
    base64Url: fileList.value?.[0]?.base64Url || ""
  }
  parms.total = Number(new Big(parms.box_number).times(parms.ctn).toFixed()) || ""
  parms.sub_price = Number(new Big(parms.price).times(parms.total).toFixed()) || ""
  parms.sub_specifications =
  Number(new Big(parms.box_number).times(parms.specifications).toFixed()) || ""
  emit("confirm", parms)
  emit("close")
}
// 删除当前文件
const handleRemove = (file: UploadFile) => {
  fileList.value = []
}

const handlePictureCardPreview = (file: UploadFile) => {
  imageRef.value.$el.querySelector("img").click()
}
// 超出时触发
const exceed = () => {
  ElMessage.error("超出限制，只能上传一张图!")
}
const fileChange = async (file: any) => {
  const base64 = await convertFileToBase64(file.raw).catch(() => {
    ElMessage.error("图片生成失败")
  })
  if (base64) {
    ;(fileList.value[0] as any).base64Url = base64
  }
}

function convertFileToBase64(blob: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(blob)
  })
}
function base64ToBlob(base64Data:string, contentType:string) {  
  contentType = contentType || '';  
  var sliceSize = 1024;  
  var byteCharacters = atob(base64Data.split(',')[1]); // 提取base64部分  
  var byteArrays = [];  
  
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {  
    var slice = byteCharacters.slice(offset, offset + sliceSize);  
    var byteNumbers = new Array(slice.length);  
    for (var i = 0; i < slice.length; i++) {  
      byteNumbers[i] = slice.charCodeAt(i);  
    }  
    var byteArray = new Uint8Array(byteNumbers);  
    byteArrays.push(byteArray);  
  }  
  return new Blob(byteArrays, {type: contentType});  
}
// // blob转化成File对象
// function blobToFile(blob: any, fileName: string) {
// 	return new File([blob], fileName, { type: blob.type, lastModified: Date.now() })
// }
</script>
