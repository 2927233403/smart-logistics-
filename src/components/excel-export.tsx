"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"
import * as XLSX from "xlsx"

interface ExcelExportProps {
  data: any[]
  filename?: string
  sheetName?: string
  columns?: { key: string; title: string }[]
  buttonText?: string
  className?: string
}

export function ExcelExportButton({
  data,
  filename = "导出数据.xlsx",
  sheetName = "Sheet1",
  columns,
  buttonText = "导出Excel",
  className = "bg-green-600 hover:bg-green-700 text-white"
}: ExcelExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (data.length === 0) {
      alert('没有数据可导出')
      return
    }

    setIsExporting(true)

    try {
      // 准备数据
      let exportData = data

      // 如果有指定列，则只导出指定列
      if (columns && columns.length > 0) {
        exportData = data.map(item => {
          const row: any = {}
          columns.forEach(col => {
            row[col.title] = item[col.key]
          })
          return row
        })
      }

      // 创建工作簿
      const wb = XLSX.utils.book_new()
      
      // 创建工作表
      const ws = XLSX.utils.json_to_sheet(exportData)
      
      // 设置列宽
      const colWidths = Object.keys(exportData[0] || {}).map(() => ({ wch: 20 }))
      ws['!cols'] = colWidths

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, sheetName)

      // 生成文件并下载
      XLSX.writeFile(wb, filename)

      console.log('Excel导出成功:', filename)
    } catch (error) {
      console.error('Excel导出失败:', error)
      alert('导出失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      onClick={handleExport}
      disabled={isExporting || data.length === 0}
      className={className}
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          导出中...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          {buttonText}
        </>
      )}
    </Button>
  )
}

// 通用导出函数
export function exportToExcel(
  data: any[],
  filename: string = "导出数据.xlsx",
  sheetName: string = "Sheet1",
  columns?: { key: string; title: string }[]
) {
  if (data.length === 0) {
    alert('没有数据可导出')
    return
  }

  try {
    // 准备数据
    let exportData = data

    // 如果有指定列，则只导出指定列
    if (columns && columns.length > 0) {
      exportData = data.map(item => {
        const row: any = {}
        columns.forEach(col => {
          row[col.title] = item[col.key]
        })
        return row
      })
    }

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // 设置列宽
    const colWidths = Object.keys(exportData[0] || {}).map(() => ({ wch: 20 }))
    ws['!cols'] = colWidths

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // 生成文件并下载
    XLSX.writeFile(wb, filename)

    console.log('Excel导出成功:', filename)
  } catch (error) {
    console.error('Excel导出失败:', error)
    alert('导出失败，请重试')
  }
}

// CSV导出函数
export function exportToCSV(
  data: any[],
  filename: string = "导出数据.csv",
  columns?: { key: string; title: string }[]
) {
  if (data.length === 0) {
    alert('没有数据可导出')
    return
  }

  try {
    // 准备数据
    let exportData = data

    // 如果有指定列，则只导出指定列
    if (columns && columns.length > 0) {
      exportData = data.map(item => {
        const row: any = {}
        columns.forEach(col => {
          row[col.title] = item[col.key]
        })
        return row
      })
    }

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(exportData)

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")

    // 生成CSV文件并下载
    XLSX.writeFile(wb, filename, { bookType: 'csv' })

    console.log('CSV导出成功:', filename)
  } catch (error) {
    console.error('CSV导出失败:', error)
    alert('导出失败，请重试')
  }
}