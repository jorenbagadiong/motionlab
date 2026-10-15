import { attr, element, expr, indent, moduleCode, text } from "./jsx"
import { type Category, CATEGORIES, type ComponentDoc, defineComponent } from "./model"

const UI = "@/components/ui"

/** Omits a prop when it equals the component's own default. */
const unless = <T>(value: T, componentDefault: T) =>
  value === componentDefault ? undefined : value

const button = defineComponent({
  slug: "button",
  name: "Button",
  category: "Actions",
  description:
    "Triggers an action. Five variants for different emphasis, three sizes, and a loading state.",
  importPath: `${UI}/button`,
  exports: ["Button", "ButtonLink"],
  controls: {
    variant: {
      kind: "select",
      label: "Variant",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
      initial: "primary",
    },
    size: { kind: "select", label: "Size", options: ["sm", "md", "lg"], initial: "md" },
    label: { kind: "text", label: "Label", initial: "Save", maxLength: 40 },
    icon: { kind: "boolean", label: "Icon", initial: false },
    loading: { kind: "boolean", label: "Loading", initial: false },
    disabled: { kind: "boolean", label: "Disabled", initial: false },
  },
  code: (v) =>
    moduleCode({
      imports: [
        ["lucide-react", v.icon ? ["Save"] : []],
        [`${UI}/button`, ["Button"]],
      ],
      name: "ButtonDemo",
      jsx: element(
        "Button",
        [
          attr("variant", unless(v.variant, "secondary")),
          attr("size", unless(v.size, "md")),
          attr("loading", v.loading),
          attr("disabled", v.disabled),
        ],
        [v.icon ? "<Save aria-hidden />" : "", v.label ? text(v.label) : ""],
      ),
    }),
  props: [
    {
      name: "variant",
      type: '"primary" | "secondary" | "outline" | "ghost" | "danger"',
      default: '"secondary"',
      description:
        "Visual emphasis. Use one primary action per view and danger for destructive actions.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "icon-sm" | "icon"',
      default: '"md"',
      description: "Height and padding. The icon sizes are square, for icon-only buttons.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      description: "Shows a spinner, disables the button and sets aria-busy.",
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      default: '"button"',
      description: "Defaults to button, so it never submits a form by accident.",
    },
    {
      name: "...props",
      type: 'ComponentProps<"button">',
      description: "Any native button attribute, e.g. onClick or disabled.",
    },
  ],
  examples: ["button"],
  a11y: [
    "Icon-only buttons need an aria-label.",
    "Icons inside a labelled button should be aria-hidden.",
    "Use ButtonLink (same styles) when the action navigates to another page.",
  ],
})

const badge = defineComponent({
  slug: "badge",
  name: "Badge",
  category: "Display",
  description: "A small label for status, categories or counts.",
  importPath: `${UI}/badge`,
  exports: ["Badge"],
  controls: {
    tone: {
      kind: "select",
      label: "Tone",
      options: ["neutral", "accent", "success", "warning", "danger"],
      initial: "accent",
    },
    label: { kind: "text", label: "Label", initial: "New", maxLength: 30 },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/badge`, ["Badge"]]],
      name: "BadgeDemo",
      jsx: element("Badge", [attr("tone", unless(v.tone, "neutral"))], [text(v.label)]),
    }),
  props: [
    {
      name: "tone",
      type: '"neutral" | "accent" | "success" | "warning" | "danger" | "motion" | "anime"',
      default: '"neutral"',
      description: "Color. Every tone meets WCAG AA contrast in light and dark mode.",
    },
    { name: "...props", type: 'ComponentProps<"span">', description: "Any native span attribute." },
  ],
  examples: ["badge"],
  a11y: ["Don't rely on color alone: the label text should carry the meaning."],
})

const alert = defineComponent({
  slug: "alert",
  name: "Alert",
  category: "Feedback",
  description: "A message that stands out from the page, in four tones, optionally dismissible.",
  importPath: `${UI}/alert`,
  exports: ["Alert"],
  controls: {
    tone: {
      kind: "select",
      label: "Tone",
      options: ["info", "success", "warning", "danger"],
      initial: "info",
    },
    title: { kind: "text", label: "Title", initial: "Heads up", maxLength: 60 },
    description: {
      kind: "text",
      label: "Description",
      initial: "Playground changes are lost when you leave the page.",
      maxLength: 120,
    },
    dismissible: { kind: "boolean", label: "Dismissible", initial: false },
    role: {
      kind: "select",
      label: "Live region",
      options: ["none", "status", "alert"],
      initial: "none",
    },
  },
  code: (v) =>
    moduleCode({
      imports: [
        ["react", v.dismissible ? ["useState"] : []],
        [`${UI}/alert`, ["Alert"]],
      ],
      name: "AlertDemo",
      setup: v.dismissible
        ? ["const [visible, setVisible] = useState(true)", "if (!visible) return null"]
        : [],
      jsx: element(
        "Alert",
        [
          attr("tone", unless(v.tone, "info")),
          attr("role", unless(v.role, "none")),
          attr("title", v.title),
          v.dismissible ? expr("onDismiss", "() => setVisible(false)") : "",
        ],
        [v.description ? text(v.description) : ""],
      ),
    }),
  props: [
    {
      name: "tone",
      type: '"info" | "success" | "warning" | "danger"',
      default: '"info"',
      description: "Color and icon. Info uses the current color theme.",
    },
    { name: "title", type: "ReactNode", description: "Required headline." },
    { name: "children", type: "ReactNode", description: "Optional body text." },
    { name: "onDismiss", type: "() => void", description: "Shows a close button that calls this." },
    {
      name: "dismissLabel",
      type: "string",
      default: '"Dismiss"',
      description: "Accessible name of the close button.",
    },
    {
      name: "role",
      type: '"alert" | "status"',
      description: "Make it a live region when it appears after an action.",
    },
  ],
  examples: ["alert"],
  a11y: [
    "Static alerts have no live region, so they aren't announced on page load.",
    'Pass role="alert" for urgent messages that appear after an action (errors), or role="status" for polite ones (saved).',
  ],
})

const card = defineComponent({
  slug: "card",
  name: "Card",
  category: "Display",
  description: "A raised surface that groups related content, with optional header and footer.",
  importPath: `${UI}/card`,
  exports: ["Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"],
  controls: {
    title: { kind: "text", label: "Title", initial: "Spring Pop", maxLength: 40 },
    description: {
      kind: "text",
      label: "Description",
      initial: "A bouncy scale-in for buttons and badges.",
      maxLength: 100,
    },
    content: {
      kind: "text",
      label: "Content",
      initial: "Stiffness 320 · Damping 18",
      maxLength: 100,
    },
    footer: { kind: "boolean", label: "Footer", initial: true },
  },
  code: (v) => {
    const header = [
      element("CardTitle", [], [text(v.title)]),
      v.description ? element("CardDescription", [], [text(v.description)]) : "",
    ]
    const footer = element(
      "CardFooter",
      [attr("className", "justify-end")],
      [
        element("Button", [attr("size", "sm"), attr("variant", "ghost")], ["Cancel"]),
        element("Button", [attr("size", "sm"), attr("variant", "primary")], ["Open"]),
      ],
    )
    return moduleCode({
      imports: [
        [`${UI}/button`, v.footer ? ["Button"] : []],
        [
          `${UI}/card`,
          [
            "Card",
            "CardHeader",
            "CardTitle",
            ...(v.description ? ["CardDescription"] : []),
            ...(v.content ? ["CardContent"] : []),
            ...(v.footer ? ["CardFooter"] : []),
          ],
        ],
      ],
      name: "CardDemo",
      jsx: element(
        "Card",
        [attr("className", "w-full max-w-sm")],
        [
          element("CardHeader", [], header),
          v.content ? element("CardContent", [], [text(v.content)]) : "",
          v.footer ? footer : "",
        ],
      ),
    })
  },
  props: [
    { name: "Card", type: 'ComponentProps<"div">', description: "The container." },
    {
      name: "CardHeader",
      type: 'ComponentProps<"div">',
      description: "Holds the title and description.",
    },
    {
      name: "CardTitle",
      type: 'ComponentProps<"h3"> & { as?: "h2" | "h3" | "h4" }',
      default: '"h3"',
      description: "Heading; pick the level that fits the page outline.",
    },
    { name: "CardDescription", type: 'ComponentProps<"p">', description: "Muted supporting text." },
    {
      name: "CardContent",
      type: 'ComponentProps<"div">',
      description: "Main content with padding.",
    },
    {
      name: "CardFooter",
      type: 'ComponentProps<"div">',
      description: "Bottom row for actions, separated by a border.",
    },
  ],
  examples: ["card"],
  a11y: ["Choose the CardTitle heading level so headings stay in order on the page."],
})

/** A labelled field for the text-like inputs; uses useId to link label and control. */
function labelledField(label: string, control: string) {
  return element(
    "div",
    [attr("className", "flex w-full max-w-xs flex-col gap-1.5")],
    [element("Label", [expr("htmlFor", "id")], [text(label)]), control],
  )
}

const textInput = defineComponent({
  slug: "text-input",
  name: "Text input",
  category: "Forms",
  description: "A single-line text field. Pair it with Label for an accessible name.",
  importPath: `${UI}/field`,
  exports: ["Label", "TextInput"],
  controls: {
    label: { kind: "text", label: "Label", initial: "Email", maxLength: 40 },
    type: {
      kind: "select",
      label: "Type",
      options: ["text", "email", "password", "search"],
      initial: "email",
    },
    placeholder: { kind: "text", label: "Placeholder", initial: "you@example.com", maxLength: 40 },
    disabled: { kind: "boolean", label: "Disabled", initial: false },
  },
  code: (v) =>
    moduleCode({
      imports: [
        ["react", ["useId"]],
        [`${UI}/field`, ["Label", "TextInput"]],
      ],
      name: "TextInputDemo",
      setup: ["const id = useId()"],
      jsx: labelledField(
        v.label,
        element("TextInput", [
          expr("id", "id"),
          attr("type", unless(v.type, "text")),
          attr("placeholder", v.placeholder || undefined),
          attr("disabled", v.disabled),
        ]),
      ),
    }),
  props: [
    {
      name: "...props",
      type: 'ComponentProps<"input">',
      description: "Any native input attribute: type, value, onChange, required, autoComplete…",
    },
    {
      name: "Label",
      type: 'ComponentProps<"label">',
      description: "Styled label; link it with htmlFor.",
    },
  ],
  examples: ["form"],
  a11y: [
    "Always give the input a visible Label linked with htmlFor (placeholders aren't labels).",
    "Set autoComplete (e.g. email) so browsers and password managers can help.",
  ],
})

const textarea = defineComponent({
  slug: "textarea",
  name: "Textarea",
  category: "Forms",
  description: "A multi-line text field that the user can resize vertically.",
  importPath: `${UI}/field`,
  exports: ["Label", "Textarea"],
  controls: {
    label: { kind: "text", label: "Label", initial: "Notes", maxLength: 40 },
    placeholder: {
      kind: "text",
      label: "Placeholder",
      initial: "Anything worth remembering",
      maxLength: 60,
    },
    rows: { kind: "number", label: "Rows", initial: 4, min: 2, max: 10, step: 1 },
    disabled: { kind: "boolean", label: "Disabled", initial: false },
  },
  code: (v) =>
    moduleCode({
      imports: [
        ["react", ["useId"]],
        [`${UI}/field`, ["Label", "Textarea"]],
      ],
      name: "TextareaDemo",
      setup: ["const id = useId()"],
      jsx: labelledField(
        v.label,
        element("Textarea", [
          expr("id", "id"),
          v.rows === 4 ? "" : attr("rows", v.rows),
          attr("placeholder", v.placeholder || undefined),
          attr("disabled", v.disabled),
        ]),
      ),
    }),
  props: [
    { name: "rows", type: "number", default: "4", description: "Initial height in lines." },
    {
      name: "...props",
      type: 'ComponentProps<"textarea">',
      description: "Any native textarea attribute.",
    },
  ],
  examples: ["form"],
  a11y: ["Give it a visible Label linked with htmlFor."],
})

const select = defineComponent({
  slug: "select",
  name: "Select",
  category: "Forms",
  description: "A native dropdown, styled to match the other fields.",
  importPath: `${UI}/field`,
  exports: ["Label", "SelectInput"],
  controls: {
    label: { kind: "text", label: "Label", initial: "Engine", maxLength: 40 },
    disabled: { kind: "boolean", label: "Disabled", initial: false },
  },
  code: (v) =>
    moduleCode({
      imports: [
        ["react", ["useId"]],
        [`${UI}/field`, ["Label", "SelectInput"]],
      ],
      name: "SelectDemo",
      setup: ["const id = useId()"],
      jsx: labelledField(
        v.label,
        element(
          "SelectInput",
          [expr("id", "id"), attr("defaultValue", "motion"), attr("disabled", v.disabled)],
          [
            element("option", [attr("value", "motion")], ["Motion"]),
            element("option", [attr("value", "anime")], ["Anime.js"]),
          ],
        ),
      ),
    }),
  props: [
    { name: "children", type: "<option> elements", description: "The choices." },
    {
      name: "...props",
      type: 'ComponentProps<"select">',
      description: "Any native select attribute: value, onChange, defaultValue…",
    },
  ],
  examples: ["form"],
  a11y: ["Native selects get the platform's accessible picker, including on phones."],
})

const checkbox = defineComponent({
  slug: "checkbox",
  name: "Checkbox",
  category: "Forms",
  description: "An on/off choice in a form, with a clickable label and optional description.",
  importPath: `${UI}/checkbox`,
  exports: ["Checkbox"],
  controls: {
    label: { kind: "text", label: "Label", initial: "Add to favorites", maxLength: 40 },
    description: { kind: "text", label: "Description", initial: "", maxLength: 80 },
    defaultChecked: { kind: "boolean", label: "Checked", initial: true },
    disabled: { kind: "boolean", label: "Disabled", initial: false },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/checkbox`, ["Checkbox"]]],
      name: "CheckboxDemo",
      jsx: element("Checkbox", [
        attr("label", v.label),
        attr("description", v.description || undefined),
        attr("defaultChecked", v.defaultChecked),
        attr("disabled", v.disabled),
      ]),
    }),
  props: [
    { name: "label", type: "ReactNode", description: "Required; clicking it toggles the box." },
    { name: "description", type: "ReactNode", description: "Muted text under the label." },
    {
      name: "...props",
      type: 'ComponentProps<"input">',
      description: "checked, defaultChecked, onChange, name…",
    },
  ],
  examples: ["form"],
  a11y: ["Uses a native checkbox, so Space toggles it and forms submit it."],
})

const switchDoc = defineComponent({
  slug: "switch",
  name: "Switch",
  category: "Forms",
  description: "A toggle for settings that take effect immediately.",
  importPath: `${UI}/switch`,
  exports: ["Switch"],
  controls: {
    label: { kind: "text", label: "Label", initial: "Loop", maxLength: 40 },
    description: {
      kind: "text",
      label: "Description",
      initial: "Repeat the animation forever.",
      maxLength: 80,
    },
    defaultChecked: { kind: "boolean", label: "On", initial: false },
    disabled: { kind: "boolean", label: "Disabled", initial: false },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/switch`, ["Switch"]]],
      name: "SwitchDemo",
      jsx: element("Switch", [
        attr("label", v.label),
        attr("description", v.description || undefined),
        attr("defaultChecked", v.defaultChecked),
        attr("disabled", v.disabled),
      ]),
    }),
  props: [
    { name: "label", type: "ReactNode", description: "Required; clicking it toggles the switch." },
    { name: "description", type: "ReactNode", description: "Muted text under the label." },
    {
      name: "...props",
      type: 'ComponentProps<"input">',
      description: "checked, defaultChecked, onChange, name…",
    },
  ],
  examples: ["form"],
  a11y: [
    'A native checkbox with role="switch": screen readers announce "on/off", and Space toggles it.',
    "Use a Checkbox instead when the choice only applies after submitting a form.",
  ],
})

const TAB_NAMES = ["Preview", "Code", "Notes", "History"]

const tabs = defineComponent({
  slug: "tabs",
  name: "Tabs",
  category: "Navigation",
  description: "Switches between related views in the same place.",
  importPath: `${UI}/tabs`,
  exports: ["Tabs"],
  controls: {
    label: { kind: "text", label: "Accessible name", initial: "Preset details", maxLength: 40 },
    count: { kind: "number", label: "Tabs", initial: 3, min: 2, max: 4, step: 1 },
  },
  code: (v) => {
    const items = TAB_NAMES.slice(0, v.count).map(
      (name) => `{ id: "${name.toLowerCase()}", label: "${name}", content: <p>${name} panel</p> },`,
    )
    return moduleCode({
      imports: [[`${UI}/tabs`, ["Tabs"]]],
      name: "TabsDemo",
      jsx: element("Tabs", [
        attr("label", v.label),
        expr("items", `[\n${indent(items.join("\n"), 2)}\n]`),
      ]),
    })
  },
  props: [
    {
      name: "items",
      type: "{ id: string; label: ReactNode; content: ReactNode }[]",
      description: "Tabs in order.",
    },
    { name: "label", type: "string", description: "Accessible name for the tab list." },
    {
      name: "defaultValue",
      type: "string",
      default: "first id",
      description: "Initially selected tab (uncontrolled).",
    },
    {
      name: "value / onValueChange",
      type: "string / (id: string) => void",
      description: "Controlled mode: pass both.",
    },
  ],
  examples: ["tabs"],
  a11y: [
    "Follows the WAI-ARIA tabs pattern: arrow keys move and select, Home/End jump to the ends.",
    "Only the selected tab is in the Tab order, so the keyboard reaches the panel quickly.",
  ],
})

const dialog = defineComponent({
  slug: "dialog",
  name: "Dialog",
  category: "Overlay",
  description: "A modal window for confirmations and focused tasks.",
  importPath: `${UI}/dialog`,
  exports: ["Dialog"],
  controls: {
    trigger: { kind: "text", label: "Trigger label", initial: "Delete preset", maxLength: 30 },
    title: { kind: "text", label: "Title", initial: "Delete this preset?", maxLength: 60 },
    description: {
      kind: "text",
      label: "Description",
      initial: "It will be removed from your library. This can't be undone.",
      maxLength: 120,
    },
    confirm: { kind: "text", label: "Confirm label", initial: "Delete", maxLength: 20 },
    destructive: { kind: "boolean", label: "Destructive", initial: true },
  },
  code: (v) => {
    const variant = v.destructive ? "danger" : "primary"
    const footer = element(
      "",
      [],
      [
        element("Button", [expr("onClick", "() => setOpen(false)")], ["Cancel"]),
        element(
          "Button",
          [attr("variant", variant), expr("onClick", "() => setOpen(false)")],
          [text(v.confirm)],
        ),
      ],
    )
    return moduleCode({
      imports: [
        ["react", ["useState"]],
        [`${UI}/button`, ["Button"]],
        [`${UI}/dialog`, ["Dialog"]],
      ],
      name: "DialogDemo",
      setup: ["const [open, setOpen] = useState(false)"],
      jsx: element(
        "",
        [],
        [
          element(
            "Button",
            [attr("variant", variant), expr("onClick", "() => setOpen(true)")],
            [text(v.trigger)],
          ),
          element("Dialog", [
            expr("open", "open"),
            expr("onOpenChange", "setOpen"),
            attr("title", v.title),
            attr("description", v.description || undefined),
            expr("footer", `\n${indent(footer, 2)}\n`),
          ]),
        ],
      ),
    })
  },
  props: [
    {
      name: "open / onOpenChange",
      type: "boolean / (open: boolean) => void",
      description:
        "Controlled visibility; onOpenChange(false) fires on Escape, backdrop click and the close button.",
    },
    { name: "title", type: "ReactNode", description: "Required; names the dialog." },
    {
      name: "description",
      type: "ReactNode",
      description: "Describes the dialog to screen readers.",
    },
    { name: "footer", type: "ReactNode", description: "Actions row." },
    { name: "children", type: "ReactNode", description: "Body content." },
  ],
  examples: ["dialog"],
  a11y: [
    "Built on the native <dialog>: focus is trapped inside and the page behind is inert.",
    "Escape closes it and focus returns to the button that opened it.",
  ],
})

const progress = defineComponent({
  slug: "progress",
  name: "Progress",
  category: "Feedback",
  description: "Shows how far a task has come, or that it's running when the end is unknown.",
  importPath: `${UI}/progress`,
  exports: ["Progress"],
  controls: {
    value: { kind: "number", label: "Value", initial: 64, min: 0, max: 100, step: 1 },
    indeterminate: { kind: "boolean", label: "Indeterminate", initial: false },
    label: { kind: "text", label: "Accessible name", initial: "Export progress", maxLength: 40 },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/progress`, ["Progress"]]],
      name: "ProgressDemo",
      jsx: element("Progress", [
        attr("label", v.label),
        v.indeterminate ? "" : attr("value", v.value),
        attr("className", "max-w-xs"),
      ]),
    }),
  props: [
    {
      name: "value",
      type: "number",
      description: "0–100, clamped. Omit for an indeterminate bar.",
    },
    { name: "label", type: "string", description: "Required accessible name." },
  ],
  examples: ["loading"],
  a11y: ['role="progressbar" with aria-valuenow, so screen readers can report the percentage.'],
})

const spinner = defineComponent({
  slug: "spinner",
  name: "Spinner",
  category: "Feedback",
  description: "A compact loading indicator that's announced to screen readers.",
  importPath: `${UI}/spinner`,
  exports: ["Spinner"],
  controls: {
    size: { kind: "select", label: "Size", options: ["sm", "md", "lg"], initial: "md" },
    label: { kind: "text", label: "Accessible name", initial: "Loading presets", maxLength: 40 },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/spinner`, ["Spinner"]]],
      name: "SpinnerDemo",
      jsx: element("Spinner", [
        attr("size", unless(v.size, "md")),
        attr("label", unless(v.label, "Loading")),
      ]),
    }),
  props: [
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Icon size." },
    {
      name: "label",
      type: "string",
      default: '"Loading"',
      description: "Announced to screen readers.",
    },
  ],
  examples: ["loading"],
  a11y: [
    'A role="status" region: its label is announced when it appears.',
    "With reduced motion enabled the spinner stops rotating.",
  ],
})

const skeleton = defineComponent({
  slug: "skeleton",
  name: "Skeleton",
  category: "Feedback",
  description: "Placeholder shapes that hint at the layout while content loads.",
  importPath: `${UI}/skeleton`,
  exports: ["Skeleton"],
  controls: {
    layout: {
      kind: "select",
      label: "Layout",
      options: ["text", "avatar", "card"],
      initial: "avatar",
    },
  },
  code: (v) => {
    const lines = [
      element("Skeleton", [attr("className", "h-4 w-3/4")]),
      element("Skeleton", [attr("className", "h-4 w-1/2")]),
    ]
    const jsx = {
      text: element("div", [attr("className", "flex w-full max-w-xs flex-col gap-2")], lines),
      avatar: element(
        "div",
        [attr("className", "flex w-full max-w-xs items-center gap-3")],
        [
          element("Skeleton", [attr("className", "size-10 rounded-full")]),
          element("div", [attr("className", "flex flex-1 flex-col gap-2")], lines),
        ],
      ),
      card: element(
        "div",
        [attr("className", "flex w-full max-w-xs flex-col gap-3")],
        [element("Skeleton", [attr("className", "h-32 w-full rounded-xl")]), ...lines],
      ),
    }[v.layout]
    return moduleCode({ imports: [[`${UI}/skeleton`, ["Skeleton"]]], name: "SkeletonDemo", jsx })
  },
  props: [
    {
      name: "...props",
      type: 'ComponentProps<"div">',
      description: "Size and shape it with className.",
    },
  ],
  examples: ["loading"],
  a11y: ["Hidden from screen readers; pair it with a Spinner or other status text."],
})

const kbd = defineComponent({
  slug: "kbd",
  name: "Kbd",
  category: "Display",
  description: "Shows a keyboard key or shortcut.",
  importPath: `${UI}/kbd`,
  exports: ["Kbd"],
  controls: {
    keys: { kind: "text", label: "Keys (space-separated)", initial: "⌘ K", maxLength: 30 },
  },
  code: (v) => {
    const keys = v.keys.split(/\s+/).filter(Boolean)
    return moduleCode({
      imports: [[`${UI}/kbd`, ["Kbd"]]],
      name: "KbdDemo",
      jsx: element(
        "span",
        [attr("className", "inline-flex gap-1")],
        keys.map((key) => element("Kbd", [], [text(key)])),
      ),
    })
  },
  props: [
    { name: "...props", type: 'ComponentProps<"kbd">', description: "Any native kbd attribute." },
  ],
  examples: ["misc"],
  a11y: ["Uses the semantic <kbd> element."],
})

const separator = defineComponent({
  slug: "separator",
  name: "Separator",
  category: "Display",
  description: "A thin line that divides content, horizontally or vertically.",
  importPath: `${UI}/separator`,
  exports: ["Separator"],
  controls: {
    orientation: {
      kind: "select",
      label: "Orientation",
      options: ["horizontal", "vertical"],
      initial: "horizontal",
    },
    decorative: { kind: "boolean", label: "Decorative", initial: true },
  },
  code: (v) => {
    const vertical = v.orientation === "vertical"
    const sep = element("Separator", [
      attr("orientation", unless(v.orientation, "horizontal")),
      v.decorative ? "" : expr("decorative", "false"),
      vertical ? attr("className", "h-5") : "",
    ])
    return moduleCode({
      imports: [[`${UI}/separator`, ["Separator"]]],
      name: "SeparatorDemo",
      jsx: element(
        "div",
        [
          attr(
            "className",
            vertical
              ? "flex items-center gap-3 text-sm"
              : "flex w-full max-w-xs flex-col gap-3 text-sm",
          ),
        ],
        [
          `<span>${vertical ? "Left" : "Above"}</span>`,
          sep,
          `<span>${vertical ? "Right" : "Below"}</span>`,
        ],
      ),
    })
  },
  props: [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Direction of the line.",
    },
    {
      name: "decorative",
      type: "boolean",
      default: "true",
      description: 'When false, it gets role="separator" for assistive technology.',
    },
  ],
  examples: ["misc"],
  a11y: [
    "Decorative separators are ignored by screen readers; set decorative={false} only when it divides meaningful sections.",
  ],
})

const TRIGGER_PROPS = [
  {
    name: "trigger",
    type: '"mount" | "inView"',
    default: '"mount"',
    description: "Play when mounted, or the first time a quarter of it scrolls into view.",
  },
  {
    name: "replay",
    type: "boolean",
    default: "false",
    description: 'With trigger="inView": play again each time it re-enters the viewport.',
  },
]

const REDUCED_MOTION_NOTE =
  "With reduced motion the final state is shown straight away; nothing animates."

const textReveal = defineComponent({
  slug: "text-reveal",
  name: "Text Reveal",
  category: "Typography",
  description:
    "Text that animates in per character, word or line, with slide, blur, rotate or terminal effects (Anime.js). The Character Rise and Letter Tumble presets as a component.",
  importPath: `${UI}/text-reveal`,
  exports: ["TextReveal"],
  controls: {
    text: {
      kind: "text",
      label: "Text",
      initial: "Ship motion that feels designed.",
      maxLength: 80,
    },
    split: { kind: "select", label: "Split", options: ["char", "word", "line"], initial: "word" },
    effect: {
      kind: "select",
      label: "Effect",
      options: ["slide", "blur", "rotate", "terminal"],
      initial: "blur",
    },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/text-reveal`, ["TextReveal"]]],
      name: "TextRevealDemo",
      jsx: element("TextReveal", [
        attr("text", v.text),
        attr("split", unless(v.split, "word")),
        attr("effect", unless(v.effect, "slide")),
        attr("className", "text-3xl font-semibold tracking-tight"),
      ]),
    }),
  props: [
    { name: "text", type: "string", description: 'The text. Use "\\n" for line breaks.' },
    {
      name: "split",
      type: '"char" | "word" | "line"',
      default: '"word"',
      description: "The piece that animates on its own. Characters stay grouped per word.",
    },
    {
      name: "effect",
      type: '"slide" | "blur" | "rotate" | "terminal"',
      default: '"slide"',
      description: "terminal types characters in fixed steps behind a blinking caret.",
    },
    {
      name: "as",
      type: "ElementType",
      default: '"p"',
      description: 'Element to render, e.g. "h1".',
    },
    { name: "duration", type: "number", default: "600", description: "Milliseconds per piece." },
    {
      name: "stagger",
      type: "number",
      description: "Milliseconds between pieces. Defaults depend on split and effect.",
    },
    {
      name: "delay",
      type: "number",
      default: "0",
      description: "Milliseconds before the first piece.",
    },
    {
      name: "ease",
      type: "string",
      default: '"outExpo"',
      description: 'Anime.js easing name, e.g. "outElastic" for a springy settle.',
    },
    ...TRIGGER_PROPS,
  ],
  examples: ["text-reveal", "text-reveal-presets"],
  a11y: [
    "Screen readers read the full text once; the animated pieces are aria-hidden.",
    REDUCED_MOTION_NOTE,
  ],
})

const numberTicker = defineComponent({
  slug: "number-ticker",
  name: "Number Ticker",
  category: "Typography",
  description:
    "A number whose digits roll like an odometer to each new value, with fixed-width digits (Anime.js).",
  importPath: `${UI}/number-ticker`,
  exports: ["NumberTicker", "formatTickerValue"],
  controls: {
    value: { kind: "number", label: "Value", initial: 1284, min: 0, max: 99999, step: 1 },
    decimals: { kind: "number", label: "Decimals", initial: 0, min: 0, max: 2, step: 1 },
    prefix: { kind: "text", label: "Prefix", initial: "", maxLength: 4 },
    suffix: { kind: "text", label: "Suffix", initial: "", maxLength: 6 },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/number-ticker`, ["NumberTicker"]]],
      name: "NumberTickerDemo",
      jsx: element("NumberTicker", [
        attr("value", v.value),
        attr("decimals", unless(v.decimals, 0)),
        attr("prefix", unless(v.prefix, "")),
        attr("suffix", unless(v.suffix, "")),
        attr("className", "font-mono text-5xl"),
      ]),
    }),
  props: [
    {
      name: "value",
      type: "number",
      description: "The number. Changing it rolls from the old value.",
    },
    { name: "decimals", type: "number", default: "0", description: "Fixed number of decimals." },
    {
      name: "minDigits",
      type: "number",
      default: "1",
      description: "Pads with leading zeros: 2 shows 3 as 03.",
    },
    { name: "prefix", type: "string", description: 'Text before the number, e.g. "$".' },
    { name: "suffix", type: "string", description: 'Text after the number, e.g. " kB".' },
    {
      name: "locale",
      type: "string",
      default: '"en-US"',
      description: "Grouping and decimal separators. Fixed so server and client render the same.",
    },
    { name: "duration", type: "number", default: "900", description: "Milliseconds per roll." },
    {
      name: "trigger",
      type: '"mount" | "inView"',
      default: '"mount"',
      description: "When the first roll from zero plays. Later changes always roll.",
    },
  ],
  examples: ["number-ticker"],
  a11y: [
    "Screen readers get the formatted value with its prefix and suffix; the digit columns are aria-hidden.",
    "The value isn't announced when it changes. Wrap it in a live region if the change matters.",
    REDUCED_MOTION_NOTE,
  ],
})

const textScramble = defineComponent({
  slug: "text-scramble",
  name: "Text Scramble",
  category: "Typography",
  description:
    "Text that decodes from random glyphs or types itself out, and can cycle through a list of words (Anime.js).",
  importPath: `${UI}/text-scramble`,
  exports: ["TextScramble"],
  controls: {
    text: { kind: "text", label: "Text", initial: "ACCESS GRANTED", maxLength: 40 },
    mode: { kind: "select", label: "Mode", options: ["scramble", "type"], initial: "scramble" },
    duration: { kind: "number", label: "Duration", initial: 900, min: 200, max: 3000, step: 100 },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/text-scramble`, ["TextScramble"]]],
      name: "TextScrambleDemo",
      jsx: element("TextScramble", [
        attr("text", v.text),
        attr("mode", unless(v.mode, "scramble")),
        attr("duration", unless(v.duration, 900)),
        attr("className", "text-2xl"),
      ]),
    }),
  props: [
    { name: "text", type: "string", description: "The text. Ignored when words is given." },
    { name: "words", type: "string[]", description: "Cycles through these, one after another." },
    {
      name: "mode",
      type: '"scramble" | "type"',
      default: '"scramble"',
      description: "scramble decodes from random glyphs; type types behind a blinking caret.",
    },
    { name: "duration", type: "number", default: "900", description: "Milliseconds per word." },
    {
      name: "pause",
      type: "number",
      default: "1600",
      description: "Milliseconds a finished word stays before the next one.",
    },
    {
      name: "loop",
      type: "boolean",
      default: "true",
      description: "Repeat the word list forever.",
    },
    { name: "glyphs", type: "string", description: "Characters used while scrambling." },
    ...TRIGGER_PROPS,
  ],
  examples: ["text-scramble"],
  a11y: [
    "Screen readers get the real words once, never the random in-between frames.",
    "A cycling word list keeps moving; don't use it for content people need to read in full.",
    REDUCED_MOTION_NOTE,
  ],
})

const textHighlight = defineComponent({
  slug: "text-highlight",
  name: "Text Highlight",
  category: "Typography",
  description:
    "Draws an SVG underline, squiggle, bracket box, circle, strike or marker around a word (Anime.js).",
  importPath: `${UI}/text-highlight`,
  exports: ["TextHighlight"],
  controls: {
    variant: {
      kind: "select",
      label: "Variant",
      options: ["underline", "squiggle", "box", "circle", "strike", "marker"],
      initial: "squiggle",
    },
    word: { kind: "text", label: "Word", initial: "smooth", maxLength: 30 },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/text-highlight`, ["TextHighlight"]]],
      name: "TextHighlightDemo",
      jsx: element(
        "p",
        [attr("className", "text-3xl font-semibold")],
        [
          "Ship",
          `{" "}`,
          element(
            "TextHighlight",
            [attr("variant", unless(v.variant, "underline"))],
            [v.word ? text(v.word) : ""],
          ),
          `{" "}`,
          "motion.",
        ],
      ),
    }),
  props: [
    { name: "children", type: "ReactNode", description: "The text to mark." },
    {
      name: "variant",
      type: '"underline" | "squiggle" | "box" | "circle" | "strike" | "marker"',
      default: '"underline"',
      description: "The mark. marker sweeps a soft accent block in behind the text.",
    },
    { name: "duration", type: "number", default: "800", description: "Milliseconds to draw." },
    { name: "delay", type: "number", default: "200", description: "Milliseconds before drawing." },
    {
      name: "trigger",
      type: '"mount" | "inView"',
      default: '"inView"',
      description: "Draw when mounted, or when it scrolls into view.",
    },
    {
      name: "replay",
      type: "boolean",
      default: "false",
      description: 'With trigger="inView": draw again each time it re-enters the viewport.',
    },
  ],
  examples: ["text-highlight"],
  a11y: [
    "The mark is decorative (aria-hidden). Don't rely on it alone for meaning; use <strong>, <em> or <del> when emphasis or deletion matters.",
    REDUCED_MOTION_NOTE,
  ],
})

const CAROUSEL_SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

const carousel = defineComponent({
  slug: "carousel",
  name: "Carousel",
  category: "Display",
  description:
    "Draggable slides with bracket controls, status, pagination, thumbnails and autoplay progress. Motion moves the blocks; Anime.js draws the arrows and rolls the counter.",
  importPath: `${UI}/carousel`,
  exports: [
    "Carousel",
    "CarouselContent",
    "CarouselItem",
    "CarouselPrevious",
    "CarouselNext",
    "CarouselStatus",
    "CarouselProgress",
    "CarouselPagination",
    "CarouselThumbs",
    "CarouselPlayToggle",
    "BracketButton",
    "useCarousel",
  ],
  controls: {
    orientation: {
      kind: "select",
      label: "Orientation",
      options: ["horizontal", "vertical"],
      initial: "horizontal",
    },
    align: { kind: "select", label: "Align", options: ["start", "center"], initial: "start" },
    slidesPerView: { kind: "number", label: "Per view", initial: 1, min: 1, max: 3, step: 0.5 },
    effect: {
      kind: "select",
      label: "Effect",
      options: ["none", "fade", "scale"],
      initial: "none",
    },
    loop: { kind: "boolean", label: "Loop", initial: false },
    autoplay: { kind: "boolean", label: "Autoplay", initial: false },
    status: { kind: "boolean", label: "Status", initial: true },
    pagination: { kind: "boolean", label: "Pagination", initial: false },
  },
  code: (v) => {
    const vertical = v.orientation === "vertical"
    const slide = vertical ? "flex h-full" : "flex aspect-video"
    return moduleCode({
      imports: [
        [
          `${UI}/carousel`,
          [
            "Carousel",
            "CarouselContent",
            "CarouselItem",
            "CarouselNext",
            "CarouselPrevious",
            ...(v.status ? ["CarouselStatus"] : []),
            ...(v.pagination ? ["CarouselPagination"] : []),
            ...(v.autoplay ? ["CarouselProgress", "CarouselPlayToggle"] : []),
          ],
        ],
      ],
      name: "CarouselDemo",
      setup: [`const slides = ${JSON.stringify(CAROUSEL_SLIDES).replaceAll(",", ", ")}`],
      jsx: element(
        "Carousel",
        [
          attr("label", "Presets"),
          attr("orientation", unless(v.orientation, "horizontal")),
          attr("align", unless(v.align, "start")),
          attr("slidesPerView", unless(v.slidesPerView, 1)),
          attr("effect", unless(v.effect, "none")),
          attr("loop", v.loop),
          v.autoplay ? expr("autoplay", "3000") : "",
          attr("className", "w-full max-w-md"),
        ],
        [
          element(
            "CarouselContent",
            [vertical ? attr("className", "h-64") : ""],
            [
              [
                "{slides.map((name) => (",
                indent(
                  element(
                    "CarouselItem",
                    [expr("key", "name")],
                    [
                      element(
                        "div",
                        [
                          attr(
                            "className",
                            `${slide} items-center justify-center rounded-md border border-line bg-surface bg-dots font-mono text-sm`,
                          ),
                        ],
                        ["{name}.tsx"],
                      ),
                    ],
                  ),
                  2,
                ),
                "))}",
              ].join("\n"),
            ],
          ),
          element(
            "div",
            [attr("className", "flex items-center justify-between gap-2")],
            [
              "<CarouselPrevious />",
              v.status ? "<CarouselStatus />" : "",
              v.pagination ? "<CarouselPagination />" : "",
              v.autoplay ? "<CarouselProgress />" : "",
              v.autoplay ? "<CarouselPlayToggle />" : "",
              "<CarouselNext />",
            ],
          ),
        ],
      ),
    })
  },
  props: [
    {
      name: "label",
      type: "string",
      description: 'Accessible name of the carousel, e.g. "Presets".',
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Drag axis and arrow-key direction. Vertical needs a height on CarouselContent.",
    },
    {
      name: "align",
      type: '"start" | "center"',
      default: '"start"',
      description: "start pins slides to the leading edge; center centers the current slide.",
    },
    {
      name: "slidesPerView",
      type: "number",
      default: "1",
      description: "Slides visible at once. Fractions show a peek of the next one.",
    },
    {
      name: "effect",
      type: '"none" | "fade" | "scale"',
      default: '"none"',
      description: "Fades or shrinks slides by distance from the center, live while dragging.",
    },
    {
      name: "loop",
      type: "boolean",
      default: "false",
      description: "Wrap from the last slide to the first.",
    },
    {
      name: "autoplay",
      type: "number",
      default: "0",
      description:
        "Milliseconds per slide; 0 is off. Pauses on hover and focus, off with reduced motion. Add CarouselPlayToggle.",
    },
    {
      name: "onIndexChange",
      type: "(index: number) => void",
      description: "Called when the current slide changes.",
    },
    {
      name: "CarouselStatus format",
      type: '"long" | "short"',
      default: '"long"',
      description: "long shows slide 03/05; short shows 03 / 05.",
    },
    {
      name: "CarouselThumbs children",
      type: "(index: number) => ReactNode",
      description: "Renders the thumbnail for each slide.",
    },
  ],
  examples: [
    "carousel-default",
    "carousel-multiple",
    "carousel-vertical",
    "carousel-status",
    "carousel-status-2",
    "carousel-pagination",
    "carousel-footer",
    "carousel-progress",
    "carousel-thumbs",
    "carousel-opacity",
    "carousel-scale",
  ],
  a11y: [
    'The carousel is a labelled region (aria-roledescription="carousel"); each slide is a group labelled "N of M".',
    "Left and Right arrow keys (Up and Down when vertical), Home and End move between slides while focus is inside.",
    "Slides outside the viewport are inert, so Tab never lands on hidden content.",
    "A polite live region announces the current slide; it stays quiet while autoplay is running.",
    "Autoplay pauses on hover and focus, needs CarouselPlayToggle (WCAG 2.2.2), and is off with reduced motion, where slides also jump instead of sliding.",
  ],
})

const bouncingDots = defineComponent({
  slug: "bouncing-dots",
  name: "Bouncing Dots",
  category: "Feedback",
  description:
    "A friendly loading indicator: dots bounce in a staggered wave (Motion). The Bouncing Dots preset as a component.",
  importPath: `${UI}/bouncing-dots`,
  exports: ["BouncingDots"],
  controls: {
    size: { kind: "select", label: "Size", options: ["sm", "md", "lg"], initial: "md" },
    count: { kind: "number", label: "Dots", initial: 3, min: 3, max: 6, step: 1 },
    height: { kind: "number", label: "Bounce height", initial: 8, min: 4, max: 24, step: 1 },
    label: { kind: "text", label: "Accessible name", initial: "Loading", maxLength: 40 },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/bouncing-dots`, ["BouncingDots"]]],
      name: "BouncingDotsDemo",
      jsx: element("BouncingDots", [
        attr("size", unless(v.size, "md")),
        attr("count", unless(v.count, 3)),
        attr("height", unless(v.height, 8)),
        attr("label", unless(v.label, "Loading")),
      ]),
    }),
  props: [
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Dot size." },
    { name: "count", type: "number", default: "3", description: "Number of dots, 3 to 6." },
    { name: "height", type: "number", default: "8", description: "Bounce height in px." },
    { name: "duration", type: "number", default: "450", description: "Milliseconds per bounce." },
    { name: "stagger", type: "number", default: "120", description: "Milliseconds between dots." },
    {
      name: "label",
      type: "string",
      default: '"Loading"',
      description: "Announced to screen readers.",
    },
  ],
  examples: ["bouncing-dots"],
  a11y: [
    'A role="status" region: its label is announced when it appears. Make it specific, e.g. "Ada is typing".',
    "With reduced motion the dots stay still.",
  ],
})

const orbitSpinner = defineComponent({
  slug: "orbit-spinner",
  name: "Orbit Spinner",
  category: "Feedback",
  description:
    "Satellites orbit a core: a calmer alternative to a spinner (Motion). The Orbit Spinner preset as a component.",
  importPath: `${UI}/orbit-spinner`,
  exports: ["OrbitSpinner"],
  controls: {
    size: { kind: "select", label: "Size", options: ["sm", "md", "lg"], initial: "lg" },
    direction: {
      kind: "select",
      label: "Direction",
      options: ["clockwise", "counterclockwise"],
      initial: "clockwise",
    },
    duration: {
      kind: "number",
      label: "Revolution",
      initial: 1200,
      min: 300,
      max: 5000,
      step: 100,
    },
    label: { kind: "text", label: "Accessible name", initial: "Loading", maxLength: 40 },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/orbit-spinner`, ["OrbitSpinner"]]],
      name: "OrbitSpinnerDemo",
      jsx: element("OrbitSpinner", [
        attr("size", unless(v.size, "md")),
        attr("direction", unless(v.direction, "clockwise")),
        attr("duration", unless(v.duration, 1200)),
        attr("label", unless(v.label, "Loading")),
      ]),
    }),
  props: [
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Overall size." },
    {
      name: "direction",
      type: '"clockwise" | "counterclockwise"',
      default: '"clockwise"',
      description: "Orbit direction.",
    },
    {
      name: "duration",
      type: "number",
      default: "1200",
      description: "Milliseconds per revolution.",
    },
    {
      name: "label",
      type: "string",
      default: '"Loading"',
      description: "Announced to screen readers.",
    },
  ],
  examples: ["orbit-spinner"],
  a11y: [
    'A role="status" region: its label is announced when it appears.',
    "With reduced motion the satellites stay still.",
  ],
})

const lineDraw = defineComponent({
  slug: "line-draw",
  name: "Line Draw",
  category: "Display",
  description:
    "An SVG whose strokes draw themselves on, one shape after another (Anime.js). The Line Draw preset as a component.",
  importPath: `${UI}/line-draw`,
  exports: ["LineDraw"],
  controls: {
    repeat: {
      kind: "select",
      label: "Repeat",
      options: ["none", "loop", "alternate"],
      initial: "alternate",
    },
    duration: { kind: "number", label: "Duration", initial: 1600, min: 300, max: 5000, step: 100 },
    stagger: { kind: "number", label: "Stagger", initial: 150, min: 0, max: 600, step: 10 },
  },
  code: (v) =>
    moduleCode({
      imports: [[`${UI}/line-draw`, ["LineDraw"]]],
      name: "LineDrawDemo",
      jsx: element(
        "LineDraw",
        [
          attr("label", "Image"),
          attr("viewBox", "0 0 120 96"),
          attr("repeat", unless(v.repeat, "none")),
          attr("duration", unless(v.duration, 1600)),
          attr("stagger", unless(v.stagger, 150)),
          expr("strokeWidth", "3"),
          attr("className", "h-28 w-36"),
        ],
        [
          '<rect x="6" y="6" width="108" height="84" rx="14" />',
          '<path d="M22 66 L44 40 L62 56 L76 44 L98 66" />',
          '<circle cx="86" cy="26" r="8" />',
        ],
      ),
    }),
  props: [
    {
      name: "children",
      type: "SVG shapes",
      description: "path, line, polyline, polygon, circle, ellipse or rect. Each draws in turn.",
    },
    {
      name: "label",
      type: "string",
      description: 'Accessible name (role="img"). Leave it out for decorative drawings.',
    },
    { name: "duration", type: "number", default: "1600", description: "Milliseconds per shape." },
    {
      name: "stagger",
      type: "number",
      default: "150",
      description: "Milliseconds between shapes.",
    },
    {
      name: "delay",
      type: "number",
      default: "0",
      description: "Milliseconds before the first shape.",
    },
    {
      name: "repeat",
      type: '"none" | "loop" | "alternate"',
      default: '"none"',
      description: "alternate draws on and retracts forever; loop redraws forever.",
    },
    ...TRIGGER_PROPS,
    {
      name: "...props",
      type: 'ComponentProps<"svg">',
      description: "Any SVG attribute, e.g. viewBox, strokeWidth or className.",
    },
  ],
  examples: ["line-draw"],
  a11y: [
    'With a label it is an image (role="img"); without one it is hidden from screen readers.',
    "Avoid repeat for drawings next to text people are reading: endless motion is distracting.",
    REDUCED_MOTION_NOTE,
  ],
})

/** All documented components, keyed by slug (the URL: /components/<slug>). */
export const COMPONENT_DOCS = {
  button,
  "text-input": textInput,
  textarea,
  select,
  checkbox,
  switch: switchDoc,
  alert,
  progress,
  spinner,
  "bouncing-dots": bouncingDots,
  "orbit-spinner": orbitSpinner,
  skeleton,
  badge,
  card,
  kbd,
  separator,
  tabs,
  dialog,
  carousel,
  "line-draw": lineDraw,
  "text-reveal": textReveal,
  "number-ticker": numberTicker,
  "text-scramble": textScramble,
  "text-highlight": textHighlight,
} as const

export type ComponentSlug = keyof typeof COMPONENT_DOCS

/**
 * The docs with their specific value types erased. Sound in practice: a doc's
 * code() only ever receives values built from its own controls.
 */
const ALL_DOCS = Object.values(COMPONENT_DOCS) as unknown as ComponentDoc[]

/** In sidebar order: by category, then as listed above. */
export const COMPONENT_LIST: ComponentDoc[] = CATEGORIES.flatMap((category) =>
  ALL_DOCS.filter((doc) => doc.category === category),
)

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return ALL_DOCS.find((doc) => doc.slug === slug)
}

export function componentsByCategory(): { category: Category; docs: ComponentDoc[] }[] {
  return CATEGORIES.map((category) => ({
    category,
    docs: COMPONENT_LIST.filter((doc) => doc.category === category),
  })).filter((group) => group.docs.length > 0)
}
