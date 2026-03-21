const scan = () => {
  try {
    // 扫描逻辑...
  } catch (error) {
    console.error('扫描错误:', error)
    // 继续扫描循环
  }
  animationRef.current = requestAnimationFrame(scan)
}