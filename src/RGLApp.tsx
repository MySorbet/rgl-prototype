import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Layout, Responsive } from "react-grid-layout";
import React, { useEffect, useState } from "react";
import { cn } from "./lib/utils";
import "./custom.css";
import { useContainerQuery } from "./lib/use-container-query";

// 🧠 can i read the width of the container to set the row height such that they will be sq
// Rather, the row height drives the width, we calculate the width from a set rowheight for the grid

const updateElementInLayout = (
  layout: Layout[],
  elementId: string,
  newLayout: Partial<Layout>
) => {
  return layout.map((item) => {
    if (item.i === elementId) {
      return { ...item, ...newLayout };
    }
    return item;
  });
};

const initialLayoutLG = [
  { i: "a", x: 0, y: 0, w: 1, h: 1 },
  { i: "b", x: 1, y: 0, w: 1, h: 1 },
  { i: "c", x: 2, y: 0, w: 1, h: 1 },
  { i: "d", x: 3, y: 0, w: 1, h: 1 },

  { i: "e", x: 0, y: 1, w: 2, h: 1 },
  { i: "f", x: 2, y: 1, w: 2, h: 1 },

  { i: "g", x: 0, y: 2, w: 2, h: 2 },
  { i: "h", x: 2, y: 2, w: 2, h: 2 },
];

const initialLayoutSM = [
  { i: "a", x: 0, y: 0, w: 1, h: 1 },
  { i: "b", x: 1, y: 0, w: 1, h: 1 },

  { i: "c", x: 0, y: 1, w: 1, h: 1 },
  { i: "d", x: 1, y: 1, w: 1, h: 1 },

  { i: "e", x: 0, y: 2, w: 2, h: 1 },
  { i: "f", x: 0, y: 3, w: 2, h: 1 },

  { i: "g", x: 0, y: 4, w: 2, h: 2 },
  { i: "h", x: 0, y: 6, w: 2, h: 2 },
];

const initialLayout = {
  lg: initialLayoutLG,
  sm: initialLayoutSM,
};

const cols = {
  lg: 4,
  sm: 2,
};

const rh = 175; // row height
const m = 40; // margin

/** Calculate the width if the grid given the above row height and margin, and the number of columns (which depends on the breakpoint) */
const w = (breakpoint: "sm" | "lg") => {
  const numCols = cols[breakpoint];
  return rh * numCols + m * (numCols + 1);
};

// Precalculate the grid widths for the breakpoints
const wSm = w("sm");
const wLg = w("lg");

// These are the breakpoints the grid will use to decide when to change the number of columns
// So just go one smaller than the value of its controlling container
const breakpoints = {
  lg: wLg - 1,
  sm: wSm - 1,
};

export const RGLApp = () => {
  const [layouts, setLayouts] =
    useState<Record<"sm" | "lg", Layout[]>>(initialLayout);
  const [breakpoint, setBreakpoint] = useState<"sm" | "lg">("lg");

  const { ref, matches } = useContainerQuery<HTMLDivElement>("56rem");

  useEffect(() => {
    if (matches) {
      setBreakpoint("lg");
    } else {
      setBreakpoint("sm");
    }
  }, [matches]);

  const onLayoutChange = (
    layout: Layout[],
    allLayouts: Record<"sm" | "lg", Layout[]>
  ) => {
    console.log("layouts", layouts);
    console.log("layout", layout);
    setLayouts(allLayouts);
  };

  const cycleSize = (item: Layout) => {
    // Set of sizes to cycles thru
    const sizes = [
      { w: 1, h: 1 },
      { w: 2, h: 1 },
      { w: 2, h: 2 },
      { w: 1, h: 2 },
    ];

    // Cycles through the sizes
    const currentIndex = sizes.findIndex(
      (size) => size.w === item.w && size.h === item.h
    );
    const nextIndex = (currentIndex + 1) % sizes.length;
    const nextSize = sizes[nextIndex];

    const newLayout = updateElementInLayout(layouts[breakpoint], item.i, {
      w: nextSize.w,
      h: nextSize.h,
    });
    setLayouts({
      ...layouts,
      [breakpoint]: newLayout,
    });
  };

  const addWidget = () => {
    // Find the layout for the current breakpoint
    const newWidget = {
      i: String.fromCharCode(65 + layouts[breakpoint].length),
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    };
    // Add a new widget to the layouts
    const newLayoutSm = [...layouts["sm"], newWidget];
    const newLayoutLg = [...layouts["lg"], newWidget];
    // Update the layouts state with the new layouts
    setLayouts({
      sm: newLayoutSm,
      lg: newLayoutLg,
    });
  };

  const width = w(breakpoint);

  return (
    // Page container
    <div className="h-full w-full flex">
      {/* Sidebar */}
      <div className="w-2xs h-full border-r border-white flex flex-col p-4 gap-4">
        <button
          className="bg-pink-500 p-3 rounded-lg text-2xl font-medium hover:bg-pink-400"
          onClick={addWidget}
        >
          Add Widget
        </button>
        <button
          className="bg-pink-500 p-3 rounded-lg text-2xl font-medium hover:bg-pink-400"
          onClick={() => {
            const randomIndex = Math.floor(
              Math.random() * layouts[breakpoint].length
            );
            const randomWidget = layouts[breakpoint][randomIndex];
            cycleSize(randomWidget);
          }}
        >
          Resize random widget
        </button>
        <div>{matches ? "lg" : "sm"}</div>
      </div>
      {/* Grid container (rest of the page) */}
      <div className="flex-1 overflow-y-auto @container">
        {/* Grid layout (less than the rest of the page) */}
        {/* This div responds to its parents size, going between a sm and lg size, which then triggers the grid breakpoint. centers the grid inside using mx-auto */}
        <div
          className={`mx-auto w-(--wsm) @4xl:w-(--wlg)`}
          ref={ref}
          style={
            {
              "--wsm": `${wSm}px`,
              "--wlg": `${wLg}px`,
            } as React.CSSProperties
          }
        >
          <Responsive
            compactType="horizontal"
            layouts={layouts}
            cols={cols}
            rowHeight={rh}
            margin={[m, m]}
            width={width}
            isResizable={false}
            breakpoints={breakpoints}
            breakpoint={breakpoint}
            onLayoutChange={onLayoutChange}
            // 👇  Not important
            // autoSize={false} // if you use autoSize={false}, you can use tailwind h-full
            onDragStart={(_, __, ___, ____, e) => e.stopPropagation()} // this is just a little hack to make double click more reliable
          >
            {layouts[breakpoint].map((item) => (
              <Widget
                key={item.i}
                onDoubleClickCapture={() => cycleSize(item)}
              ></Widget>
            ))}
          </Responsive>
        </div>
      </div>
    </div>
  );
};

interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        style={style}
        className={cn("bg-pink-500 rounded-2xl select-none", className)}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Widget.displayName = "Widget";
