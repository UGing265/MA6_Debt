import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, className, children, ...props }: PageHeaderProps) {
  return (
    <div 
      className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-5 border-b border-gray-100/60 mb-6", className)} 
      {...props}
    >
      <div className="space-y-1.5">
        <h1 className="text-3xl md:text-4xl font-bold text-ink-black tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-8 md:h-10 bg-note-yellow rounded-full inline-block shadow-sm"></span>
          {title}
        </h1>
        {description && (
          <p className="text-pencil-gray text-base md:text-lg ml-[22px]">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {children}
        </div>
      )}
    </div>
  )
}
