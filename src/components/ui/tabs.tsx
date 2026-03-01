"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { RiArrowDownSLine } from "@remixicon/react";

const TabsContext = React.createContext<{
  activeTab: string | undefined;
  id: string;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  activeTab: undefined,
  id: "",
  isExpanded: false,
  setIsExpanded: () => {},
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
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  return (
    <TabsContext.Provider value={{ activeTab, id, isExpanded, setIsExpanded }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        orientation={orientation}
        value={activeTab}
        defaultValue={defaultValue}
        onValueChange={(v) => {
          setActiveTab(v);
          setIsExpanded(false);
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
  "rounded-lg p-[3px] md:group-data-[orientation=horizontal]/tabs:h-9 group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        underline: "bg-transparent w-full md:h-auto p-0 justify-start",
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
  const { isExpanded } = React.useContext(TabsContext);

  return (
    <TabsListVariantContext.Provider value={variant as "default" | "underline"}>
      <div className="relative w-full md:w-auto">
        <TabsPrimitive.List
          data-slot="tabs-list"
          data-variant={variant}
          className={cn(
            tabsListVariants({ variant }),
            "transition-all duration-300 ease-in-out",
            // Mobile Dropdown Behavior
            "max-md:flex-col max-md:w-full max-md:items-stretch max-md:bg-card max-md:border-2 max-md:border-border max-md:rounded-xl max-md:overflow-hidden",
            !isExpanded ? "max-md:h-[50px]" : "max-md:h-auto max-md:pb-2",
            className,
          )}
          {...props}
        />
      </div>
    </TabsListVariantContext.Provider>
  );
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { activeTab, id, isExpanded, setIsExpanded } =
    React.useContext(TabsContext);
  const variant = React.useContext(TabsListVariantContext);
  const isActive = activeTab === value;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      if (!isExpanded) {
        e.preventDefault();
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      if (!isExpanded) {
        setIsExpanded(true);
      } else if (isActive) {
        setIsExpanded(false);
      }
    }
  };

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={cn(
        "cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex md:h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm data-[state=active]:bg-background data-[state=active]:text-primary dark:data-[state=active]:text-primary-dark dark:data-[state=active]:border-primary-dark",
        "group-data-[variant=underline]/tabs-list:rounded-none group-data-[variant=underline]/tabs-list:border-b-2 dark:group-data-[variant=underline]/tabs-list:border-foreground/50 group-data-[variant=underline]/tabs-list:pb-2 group-data-[variant=underline]/tabs-list:px-4 group-data-[variant=underline]/tabs-list:flex-1 md:group-data-[variant=underline]/tabs-list:text-lg group-data-[variant=underline]/tabs-list:text-md group-data-[variant=underline]/tabs-list:font-medium group-data-[variant=underline]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=underline]/tabs-list:data-[state=active]:text-primary group-data-[variant=underline]/tabs-list:data-[state=active]:shadow-none",
        // Mobile behavior
        "max-md:h-[50px] max-md:justify-between max-md:px-6 max-md:border-none max-md:w-full max-md:flex-none max-md:rounded-none",
        !isActive && !isExpanded && "max-md:hidden",
        isActive && "max-md:order-first",
        isExpanded && !isActive && "max-md:border-t max-md:border-border/50",
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
      {isActive && (
        <>
          <RiArrowDownSLine
            className={cn(
              "md:hidden transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          />
          {variant === "underline" && (
            <motion.div
              layoutId={`activeTabUnderline-${id}`}
              className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-primary z-10 hidden md:block"
              initial={false}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
        </>
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
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
