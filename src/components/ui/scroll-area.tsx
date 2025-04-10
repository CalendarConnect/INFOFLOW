"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

type ScrollVisibility = "always" | "hover" | "scroll" | "auto" | "never"

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  scrollVisibility?: ScrollVisibility;
}

function ScrollArea({
  className,
  children,
  scrollVisibility = "always",
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 h-full w-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 overflow-y-auto"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {scrollVisibility !== "never" && (
        <>
          <ScrollBar visibility={scrollVisibility} />
          <ScrollAreaPrimitive.Corner />
        </>
      )}
    </ScrollAreaPrimitive.Root>
  )
}

interface ScrollBarProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  visibility?: ScrollVisibility;
}

function ScrollBar({
  className,
  orientation = "vertical",
  visibility = "always",
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        visibility === "always" && "opacity-100",
        visibility === "hover" && "opacity-0 hover:opacity-100",
        visibility === "scroll" && "opacity-0 [&[data-state=visible]]:opacity-100",
        visibility === "auto" && "opacity-0 hover:opacity-100 [&[data-state=visible]]:opacity-100",
        visibility === "never" && "opacity-0",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
export type { ScrollAreaProps, ScrollBarProps, ScrollVisibility }
