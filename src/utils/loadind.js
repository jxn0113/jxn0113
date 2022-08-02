/*
 * @Author: bkchen
 * @Date: 2021-06-11 13:36:36
 * @Description: http请求loading封装
 * @FilePath: \s2b2c-template-app\src\utils\loading.js
 */
import { Loading } from 'element-ui'
import {createEl} from '../../directive/loading';

let needLoadingRequestCount = 0


const showLoading = function(option) {
  if (needLoadingRequestCount === 0) {
    let mask = createEl().maskEl
    mask.style.display = 'flex'
    document.body._maskEl = mask
    document.body.append(mask)
    mask.style.background = (option && option.background) ? option.background : 'rgba(255, 255, 255, 0.3)'
  }
  needLoadingRequestCount ++
}

const hideLoading = function() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount --
  if (needLoadingRequestCount === 0) {
    document.body._maskEl.remove()
    document.body._maskEl = null
  }
}

export { showLoading, hideLoading }
