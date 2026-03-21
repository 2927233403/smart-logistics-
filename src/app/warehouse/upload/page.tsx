"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Upload,
  Package,
  BarChart2,
  Search,
  Image as ImageIcon,
  Check,
  X
} from "lucide-react"
import Link from "next/link"

export default function Upload() {
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<{
    id: number
    name: string
    url: string
    time: string
  }[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(prev => [...prev, ...files])
      
      // 生成预览
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setPreviewImages(prev => [...prev, event.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleUpload = () => {
    if (images.length === 0) return
    
    setUploading(true)
    
    // 模拟上传过程
    setTimeout(() => {
      const newUploads = images.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        url: URL.createObjectURL(file),
        time: new Date().toLocaleTimeString()
      }))
      
      setUploadedImages(prev => [...newUploads, ...prev])
      setImages([])
      setPreviewImages([])
      setUploading(false)
    }, 1500)
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveUploaded = (id: number) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <div className="lg:w-64">
            <Card className="h-full">
              <CardContent className="p-0">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <Upload className="mr-2 h-6 w-6 text-indigo-600" />
                    照片上传
                  </h2>
                </div>
                <div className="p-4">
                  <Link href="/warehouse">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <BarChart2 className="h-5 w-5" />
                      <span>仓库概览</span>
                    </button>
                  </Link>
                  <Link href="/warehouse/inbound">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Package className="h-5 w-5" />
                      <span>入库管理</span>
                    </button>
                  </Link>
                  <Link href="/warehouse/search">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Search className="h-5 w-5" />
                      <span>库存查询</span>
                    </button>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 bg-indigo-50 text-indigo-600 font-medium">
                    <Upload className="h-5 w-5" />
                    <span>照片上传</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">上传照片</h3>
                
                {/* 上传区域 */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-6">
                  <Upload className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-900 mb-2">拖放文件到此处或点击上传</h4>
                  <p className="text-slate-500 mb-4">支持 JPG、PNG、JPEG 格式，单文件最大 10MB</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      选择文件
                    </Button>
                  </label>
                </div>
                
                {/* 预览区域 */}
                {previewImages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-slate-900 mb-3">待上传照片</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                            <img src={preview} alt={`预览 ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <button 
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button 
                        onClick={handleUpload}
                        disabled={uploading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {uploading ? '上传中...' : '开始上传'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* 已上传照片 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">已上传照片</h3>
                {uploadedImages.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                    <p>暂无上传记录</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative">
                        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                          <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-xs text-white truncate">{image.name}</p>
                          <p className="text-xs text-white/80">{image.time}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveUploaded(image.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}