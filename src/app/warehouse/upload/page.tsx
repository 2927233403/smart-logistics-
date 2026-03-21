"use client"

import { useState, useRef, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WarehouseSidebar } from "@/components/warehouse-sidebar"
import { useAudioManager } from "@/components/audio-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload as UploadIcon,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  Loader2,
  FolderOpen,
  Plus,
  Trash2,
  Eye,
  FileImage
} from "lucide-react"

interface ImageFile {
  id: string
  file: File
  preview: string
  name: string
  size: number
  type: string
}

interface UploadedImage {
  id: number
  name: string
  url: string
  time: string
  size: string
}

export default function UploadPage() {
  const { playSound } = useAudioManager()
  const [images, setImages] = useState<ImageFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // 验证文件
  const validateFile = (file: File): string | null => {
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return `文件 "${file.name}" 格式不支持，只支持 JPG、PNG、WebP、GIF 格式的图片`
    }

    // 验证文件大小（20MB）
    const maxSize = 20 * 1024 * 1024
    if (file.size > maxSize) {
      return `文件 "${file.name}" 大小超过 20MB 限制`
    }

    return null
  }

  // 生成唯一ID
  const generateId = () => Math.random().toString(36).substring(2, 9)

  // 处理文件添加
  const addFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newImages: ImageFile[] = []
    const errors: string[] = []

    // 检查重复文件
    const existingNames = new Set(images.map(img => img.name))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // 验证文件
      const errorMsg = validateFile(file)
      if (errorMsg) {
        errors.push(errorMsg)
        continue
      }

      // 检查重复
      if (existingNames.has(file.name)) {
        errors.push(`文件 "${file.name}" 已存在`)
        continue
      }

      // 生成预览
      try {
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })

        newImages.push({
          id: generateId(),
          file,
          preview,
          name: file.name,
          size: file.size,
          type: file.type
        })
      } catch (err) {
        errors.push(`文件 "${file.name}" 读取失败`)
      }
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages])
      setSuccess(`成功添加 ${newImages.length} 个文件`)
      playSound('upload')
      setTimeout(() => setSuccess(''), 3000)
    }

    if (errors.length > 0) {
      setError(errors.join('\n'))
      setTimeout(() => setError(''), 5000)
    }
  }, [images, playSound])

  // 文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    // 重置input以便可以重复选择相同文件
    e.target.value = ''
  }

  // 文件夹选择
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    e.target.value = ''
  }

  // 拖放功能
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.add('border-indigo-500', 'bg-indigo-50')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.remove('border-indigo-500', 'bg-indigo-50')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.remove('border-indigo-500', 'bg-indigo-50')
    
    const files = e.dataTransfer.files
    addFiles(files)
  }

  // 上传处理
  const handleUpload = async () => {
    if (images.length === 0) return
    
    setUploading(true)
    setUploadProgress(0)
    setError('')
    playSound('upload')
    
    // 模拟上传进度
    const totalFiles = images.length
    const uploadedFiles: UploadedImage[] = []
    
    for (let i = 0; i < totalFiles; i++) {
      const image = images[i]
      
      // 模拟单个文件上传延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      uploadedFiles.push({
        id: Date.now() + i,
        name: image.name,
        url: image.preview,
        time: new Date().toLocaleTimeString(),
        size: formatFileSize(image.size)
      })
      
      setUploadProgress(Math.round(((i + 1) / totalFiles) * 100))
    }
    
    setUploadedImages(prev => [...uploadedFiles, ...prev])
    setImages([])
    setUploading(false)
    setUploadProgress(0)
    playSound('success')
    setSuccess(`成功上传 ${totalFiles} 个文件`)
    setTimeout(() => setSuccess(''), 3000)
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 删除待上传图片
  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  // 删除已上传图片
  const handleRemoveUploaded = (id: number) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
  }

  // 清空所有待上传
  const handleClearAll = () => {
    if (confirm('确定要清空所有待上传的文件吗？')) {
      setImages([])
    }
  }

  // 查看大图
  const handleViewImage = (image: ImageFile) => {
    setSelectedImage(image)
    setShowPreview(true)
  }

  // 打开文件选择器
  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  // 打开文件夹选择器
  const openFolderPicker = () => {
    folderInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <div className="lg:w-64">
            <WarehouseSidebar title="照片上传" icon={UploadIcon} />
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            {/* 上传区域 */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-900">上传照片</h3>
                  <div className="text-sm text-slate-500">
                    已选择 {images.length} 个文件
                  </div>
                </div>
                
                {/* 消息提示 */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="text-red-600 text-sm whitespace-pre-line">{error}</div>
                    </div>
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 text-sm">{success}</span>
                  </div>
                )}
                
                {/* 拖放区域 */}
                <div 
                  ref={dropZoneRef}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-6 transition-all duration-200 hover:border-indigo-400 hover:bg-slate-50"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadIcon className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-900 mb-2">拖放文件到此处上传</h4>
                  <p className="text-slate-500 mb-4">支持批量上传，支持 JPG、PNG、WebP、GIF 格式，单文件最大 20MB</p>
                  
                  {/* 隐藏的文件输入 */}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <input 
                    ref={folderInputRef}
                    type="file" 
                    webkitdirectory=""
                    directory=""
                    multiple 
                    className="hidden" 
                    onChange={handleFolderChange}
                  />
                  
                  {/* 操作按钮 */}
                  <div className="flex justify-center gap-3">
                    <Button 
                      onClick={openFilePicker}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      选择文件
                    </Button>
                    <Button 
                      onClick={openFolderPicker}
                      variant="outline"
                      className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                    >
                      <FolderOpen className="h-4 w-4 mr-2" />
                      选择文件夹
                    </Button>
                  </div>
                </div>
                
                {/* 待上传文件列表 */}
                {images.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-slate-900 flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        待上传文件 ({images.length})
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleClearAll}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        清空
                      </Button>
                    </div>
                    
                    {/* 上传进度 */}
                    {uploading && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                          <span>上传进度</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* 文件网格 */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <div 
                            className="aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => handleViewImage(image)}
                          >
                            <img 
                              src={image.preview} 
                              alt={image.name} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            {/* 悬停遮罩 */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Eye className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          {/* 文件信息 */}
                          <div className="mt-1 px-1">
                            <p className="text-xs text-slate-600 truncate" title={image.name}>{image.name}</p>
                            <p className="text-xs text-slate-400">{formatFileSize(image.size)}</p>
                          </div>
                          {/* 删除按钮 */}
                          <button 
                            onClick={() => handleRemoveImage(image.id)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            disabled={uploading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* 添加更多按钮 */}
                      <div 
                        className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                        onClick={openFilePicker}
                      >
                        <Plus className="h-8 w-8 text-slate-400 mb-1" />
                        <span className="text-xs text-slate-500">添加更多</span>
                      </div>
                    </div>
                    
                    {/* 上传按钮 */}
                    <div className="mt-6 flex justify-end gap-3">
                      <Button 
                        variant="outline"
                        onClick={handleClearAll}
                        disabled={uploading}
                      >
                        取消
                      </Button>
                      <Button 
                        onClick={handleUpload}
                        disabled={uploading || images.length === 0}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            上传中 {uploadProgress}%
                          </>
                        ) : (
                          <>
                            <UploadIcon className="h-4 w-4 mr-2" />
                            开始上传 ({images.length})
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* 已上传照片 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">已上传照片</h3>
                  <span className="text-sm text-slate-500">共 {uploadedImages.length} 个文件</span>
                </div>
                
                {uploadedImages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="h-8 w-8 text-slate-300" />
                    </div>
                    <p>暂无上传记录</p>
                    <p className="text-sm text-slate-400 mt-1">上传的文件将显示在这里</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                          <img 
                            src={image.url} 
                            alt={image.name} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        {/* 文件信息 */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-xs text-white truncate">{image.name}</p>
                          <p className="text-xs text-white/70">{image.size} · {image.time}</p>
                        </div>
                        {/* 删除按钮 */}
                        <button 
                          onClick={() => handleRemoveUploaded(image.id)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
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

      {/* 图片预览弹窗 */}
      {showPreview && selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedImage.preview} 
              alt={selectedImage.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <p className="text-white font-medium">{selectedImage.name}</p>
              <p className="text-white/70 text-sm">
                {formatFileSize(selectedImage.size)} · {selectedImage.type}
              </p>
            </div>
            <button 
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              onClick={() => setShowPreview(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}