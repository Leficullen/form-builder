"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const TabsContext = React.createContext<{
  activeTab: string | undefined;
  id: string;
}>({
  activeTab: undefined,
  id: "",
});

const TabsListVariantContext = React.createContext<"default" | "underline">(
  "default",
);

function Tabs({
  className,
  orientation = "horizontal",
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const id = React.useId();
  const [activeTab, setActiveTab] = React.useState<string | undefined>(
    defaultValue || value,
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  return (
    <TabsContext.Provider value={{ activeTab, id }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        orientation={orientation}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => {
          setActiveTab(v);
          onValueChange?.(v);
        }}
        className={cn(
          "group/tabs flex data-[orientation=horizontal]:flex-col",
          className,
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
}

const tabsListVariants = cva(
  "rounded-lg p-[3px] group-data-[orientation=horizontal]/tabs:h-9 group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        underline: "bg-transparent w-full h-auto p-0 justify-start",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsListVariantContext.Provider value={variant as "default" | "underline"}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsListVariantContext.Provider>
  );
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { activeTab, id } = React.useContext(TabsContext);
  const variant = React.useContext(TabsListVariantContext);
  const isActive = activeTab === value;

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm data-[state=active]:bg-background data-[state=active]:text-primary dark:data-[state=active]:text-primary-dark dark:data-[state=active]:border-primary-dark",
        "group-data-[variant=underline]/tabs-list:rounded-none group-data-[variant=underline]/tabs-list:border-b-2 dark:group-data-[variant=underline]/tabs-list:border-foreground/50 group-data-[variant=underline]/tabs-list:pb-2 group-data-[variant=underline]/tabs-list:px-4 group-data-[variant=underline]/tabs-list:flex-1 md:group-data-[variant=underline]/tabs-list:text-lg group-data-[variant=underline]/tabs-list:text-md group-data-[variant=underline]/tabs-list:font-medium group-data-[variant=underline]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=underline]/tabs-list:data-[state=active]:text-primary group-data-[variant=underline]/tabs-list:data-[state=active]:shadow-none",
        className,
      )}
      {...props}
    >
      {children}
      {variant === "underline" && isActive && (
        <motion.div
          layoutId={`activeTabUnderline-${id}`}
          className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-primary z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { activeTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      value={value}
      asChild
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {props.children}
      </motion.div>
    </TabsPrimitive.Content>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
