import ExcelJS from "exceljs"

function isBase64(str: string) {
  return str.indexOf("data:image") !== -1
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

export async function createExcelReturnBuffer(data: any) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("My Sheet", {
    pageSetup: { paperSize: 9, orientation: "landscape" }
  })
  // 设置前三个标题
  const topRow = [
    {
      key: "title",
      name: "店名"
    },
    {
      key: "address",
      name: "地址"
    },
    {
      key: "tel",
      name: "电话"
    }
  ]
  topRow.forEach((item, index) => {
    worksheet.getCell(`A${index + 1}`).value = item.name
    worksheet.getCell(`B${index + 1}`).value = data.stopName[item.key]
    // 合并单元格
    worksheet.mergeCells(
      `B${index + 1}:${String.fromCharCode(66 + data.fieldList.length - 2)}${
        index + 1
      }`
    )
    worksheet.getCell(`B${index + 1}`).alignment = {
      vertical: "middle",
      horizontal: "center"
    }
  })
  // 设置表格每行高度
  data.data.forEach((item: any, index: number) => {
    worksheet.getRow(index + Object.keys(data.stopName).length + 2).height = 100
  })

  // 设置表格宽度
  data.fieldList.forEach((item: any, index: any) => {
    worksheet.getColumn(index + 1).width = item.width / 5
  })
  // 设置表格标题
  worksheet.addTable({
    name: "MyTable",
    displayName: "货单表格",
    ref: `A${Object.keys(data.stopName).length + 1}`,
    headerRow: true,
    totalsRow: false,
    style: {
      theme: "TableStyleMedium2",
      showRowStripes: false
    },
    columns: data.fieldList.map((item: any, index: number) => {
      let obj: any = {
        name: `${item.name}(${item.enName})`,
        totalsRowFunction: "countNums"
      }
      if (index === 0) {
        obj.totalsRowLabel = "总计"
      }
      if (item.prop === "total") {
        obj.totalsRowFunction = "countNums"
      }
      return obj
    }),
    rows: data.data.map((item: any, index: number) => {
      return data.fieldList.map((file: any) => {
        if (file.prop === "No") {
          return index + 1
        }
        if (file.prop === "base64Url") {
          return ""
        }
        return item[file.prop]
      })
    })
  })

  // 设置图片  型号和品名合并单元格
  data.data.forEach((item: any, index: number) => {
    // 判断是否是base64格式
    if (item.base64Url && isBase64(item.base64Url)) {
      const imageId2 = workbook.addImage({
        base64: item.base64Url,
        extension: "png"
      })
      worksheet.addImage(imageId2, {
        tl: {
          col: data.fieldList.findIndex((ele: any) => ele.prop === "base64Url"),
          row: index + Object.keys(data.stopName).length + 1
        },
        ext: { width: 100, height: 100 },
        editAs: "undefined"
      })
    }
    // 型号和品名合并单元格
    worksheet.mergeCells(`C${index + 5}:D${index + 5}`)
  })
  
  //   合计公式
  let totalRowLine = data.data.length + Object.keys(data.stopName).length + 2
  // 合计数量计算公式
  data.data.forEach((item: any, index: number) => {
    // 合计数量
    worksheet.getCell(`${String.fromCharCode(65 + 6)}${Object.keys(data.stopName).length + 2+index}`).value= {
      formula: `(${String.fromCharCode(65 + 4)}${Object.keys(data.stopName).length + 2+index}*${String.fromCharCode(65 + 5)}${Object.keys(data.stopName).length + 2+index})`
    }
    // 小计金额
    worksheet.getCell(`${String.fromCharCode(65 + 8)}${Object.keys(data.stopName).length + 2+index}`).value= {
      formula: `(${String.fromCharCode(65 + 6)}${Object.keys(data.stopName).length + 2+index}*${String.fromCharCode(65 + 7)}${Object.keys(data.stopName).length + 2+index})`
    }
    // 小计箱规
    worksheet.getCell(`${String.fromCharCode(65 + 10)}${Object.keys(data.stopName).length + 2+index}`).value= {
      formula: `(${String.fromCharCode(65 + 9)}${Object.keys(data.stopName).length + 2+index}*${String.fromCharCode(65 + 4)}${Object.keys(data.stopName).length + 2+index})`
    }
  })
  data.fieldList.forEach((item: any, index: any) => {
    if (index === 0) {
      worksheet.getCell(
        `${String.fromCharCode(65 + index)}${totalRowLine}`
      ).value = "合计"
    }
    if (item.sum) {
      worksheet.getCell(
        `${String.fromCharCode(65 + index)}${totalRowLine}`
      ).value = {
        formula: `SUM(${String.fromCharCode(65 + index)}${
          Object.keys(data.stopName).length + 1
        }:${String.fromCharCode(65 + index)}${totalRowLine - 1})`
      }
    }
  })
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

export async function downloadExcel(
  data: any,
  filename: string = getCurrentDateTime() + "货单"
) {
  const buffer = await createExcelReturnBuffer(data)
  const blob = new Blob([buffer], { type: "application/octet-stream" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${filename}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
