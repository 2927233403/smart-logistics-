"use client"

import { AIChat } from "@/components/ai-chat"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIChat />
    </>
  )
}
