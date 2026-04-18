import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: `
          bg-white
          text-[#2f2f2f]
          border border-[#e8e8e6]
          hover:bg-[#8fa889]
          hover:text-white
        `,
        primary: `
          bg-[#8fa889]
          text-white
          hover:bg-[#7f9a79]
        `,
        outline: `
          bg-white
          border border-[#e8e8e6]
          hover:bg-[#f3f3f1]
        `,
      },
      size: {
        default: "px-4 py-2",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }