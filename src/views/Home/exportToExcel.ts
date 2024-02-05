const tableToExcel = (function () {
  // 编码要用utf-8不然默认gbk会出现中文乱码
  let uri = "data:application/vnd.ms-excel;base64,",
    template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    base64 = function (s: any) {
      return window.btoa(unescape(encodeURIComponent(s)))
    },
    format = (s: any, c: any) => {
      return s.replace(/{(\w+)}/g, (m: any, p: any) => {
        return c[p]
      })
    }
  return (table: any, name: any) => {
    let ctx = {
      worksheet: name,
      table
    }

    //创建下载
    let link = document.createElement("a")
    link.setAttribute("href", uri + base64(format(template, ctx)))

    link.setAttribute("download", name)

    // window.location.href = uri + base64(format(template, ctx))
    link.click()
  }
})()
interface parmsType {
  data: any[]
  fileList: any[]
  stopName: Record<string, any>
}
function getCurrentDateTime() {
  let date = new Date()
  let year = date.getFullYear()
  let month: string | number = date.getMonth() + 1 // 月份是从0开始的，所以需要+1
  let day: string | number = date.getDate()
  let hours: string | number = date.getHours()
  let minutes: string | number = date.getMinutes()
  let seconds: string | number = date.getSeconds()

  // 如果月份、日期、小时、分钟或秒数小于10，前面加一个'0'
  month = month < 10 ? "0" + month : month
  day = day < 10 ? "0" + day : day
  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes
  seconds = seconds < 10 ? "0" + seconds : seconds

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const exportExcel = (
  { data, fileList, stopName }: parmsType,
  fileName?: string
) => {
  let html = ""
  let fieldListLength = fileList.length - 1
  const formLabel: Record<string, any> = {
    title: "店名",
    address: "地址",
    tel: "电话"
  }
  // 店名信息
  Object.keys(stopName).forEach((ele, index) => {
    const value = stopName[ele]
    if (value) {
      html += `<tr>
                <td>${formLabel[ele]}</td>
                <td colspan="${fieldListLength}" style="text-align:center;">${value}</td>
            </tr>`
    }
  })
  // 表头
  fileList.forEach((ele, index) => {
    if (index === 0) {
      html += "<tr>"
    }
    html += `
    <td  style="width:${ele.width}px">
    <div>
        ${ele.name}(${ele.enName})
    </div>
    </td>`
    if (index === fileList.length - 1) {
      html += "</tr>"
    }
  })
  // 数据
  data.forEach((ele, index) => {
    html += `<tr>`
    fileList.forEach((item, fileindex) => {
      let value = item.prop === "name" ? String(ele[item.prop]) : ele[item.prop]
      if (item.prop === "No") value = index + 1
      const isPic =
        typeof ele[item.prop] === "string"
          ? ele[item.prop].includes("data:image")
          : false
      if (isPic) {
        html += `<td><div display:inline>
                <img src="${value}" width="${item.width}" height="200"/>
            </div></td>`
        return
      }
      if (item.colspan) {
        html += `<td colspan="${item.colspan}">${value}</td>`
      } else if (item.colspan !== 0) {
        html += `<td>${value}</td>`
      }
    })
    html += `</tr>`
  })
  const tempfileName = getCurrentDateTime() + "货单"
  tableToExcel(html, fileName ? fileName : tempfileName)
}
