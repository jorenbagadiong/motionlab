import { Badge } from "@/components/ui/badge"

export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Draft</Badge>
      <Badge tone="accent">New</Badge>
      <Badge tone="success">Published</Badge>
      <Badge tone="warning">Pending review</Badge>
      <Badge tone="danger">Failed</Badge>
    </div>
  )
}
