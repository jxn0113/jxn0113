/**
 * 下载文件
 * @param {String} url 文件下载地址
 * @param {*} name 下载后文件名
 */
 export function download(url, name) {
    const a = document.createElement('a')
    a.download = name
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
