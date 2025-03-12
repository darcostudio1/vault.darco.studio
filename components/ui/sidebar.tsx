import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const sidebarVariants = cva(
  "fixed inset-0 z-50 hidden h-full flex-col bg-background shadow-sm data-[state=open]:flex sm:sticky sm:flex",
  {
    variants: {
      variant: {
        default: "border-r",
        floating:
          "sm:left-4 sm:top-4 sm:rounded-xl sm:border sm:shadow-xl sm:h-[calc(100vh-2rem)]",
      },
      size: {
        default: "w-72",
        sm: "w-60",
        lg: "w-80",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "floating"
  size?: "default" | "sm" | "lg"
  isCollapsed?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant = "default", isCollapsed, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-state={isCollapsed ? "closed" : "open"}
        className={cn(
          "inset-0 data-[state=open]:flex sm:sticky sm:flex sm:left-4 sm:top-4 sm:rounded-xl sm:border sm:shadow-xl sm:h-[calc(100vh-2rem)]",
          variant === "floating" && "hidden lg:flex flex-col fixed inset-y-0 z-50 left-4 rounded-xl border shadow-xl h-screen top-0 bg-background",
          className
        )}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center border-b px-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center border-t p-4", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto py-2", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center", className)}
    {...props}
  />
))
SidebarNav.displayName = "SidebarNav"

const SidebarNavHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between px-2 py-2", className)}
    {...props}
  />
))
SidebarNavHeader.displayName = "SidebarNavHeader"

export {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarNav,
  SidebarNavHeader,
}
