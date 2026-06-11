import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  /** Maximum width constraint. Defaults to "default" (max-w-5xl). */
  maxWidth?: "sm" | "default" | "lg" | "full"
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  default: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-full",
}

export function PageContainer({
  children,
  className,
  maxWidth = "default",
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full flex-1 px-4 pt-6 pb-20 sm:px-6 sm:py-8",
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </main>
  )
}
