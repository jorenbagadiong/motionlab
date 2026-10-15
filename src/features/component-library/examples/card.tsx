import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardExample() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Spring Pop</CardTitle>
        <CardDescription>A bouncy scale-in for buttons and badges.</CardDescription>
      </CardHeader>
      <CardContent>Stiffness 320 · Damping 18 · Mass 1</CardContent>
      <CardFooter className="justify-end">
        <Button size="sm" variant="ghost">
          Duplicate
        </Button>
        <Button size="sm" variant="primary">
          Open
        </Button>
      </CardFooter>
    </Card>
  )
}
