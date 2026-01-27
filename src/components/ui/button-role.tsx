import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonRoleVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        student: "bg-student text-student-foreground hover:bg-student/90 shadow-sm",
        admin: "bg-admin text-admin-foreground hover:bg-admin/90 shadow-sm",
        manager: "bg-manager text-manager-foreground hover:bg-manager/90 shadow-sm",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonRoleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonRoleVariants> {
  asChild?: boolean;
}

const ButtonRole = React.forwardRef<HTMLButtonElement, ButtonRoleProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonRoleVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonRole.displayName = "ButtonRole";

export { ButtonRole, buttonRoleVariants };
