import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          `
          w-full
          px-4 py-2.5
          rounded-xl
          text-sm

          bg-[#f3f3f1]
          border border-[#e5e5e2]

          text-[#2f2f2f]
          placeholder:text-[#9a9a9a]

          outline-none
          transition-all

          focus:border-[#8fa889]
          focus:ring-2 focus:ring-[#8fa889]/20

          disabled:opacity-50
          disabled:cursor-not-allowed
          `,
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }