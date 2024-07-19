import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function EndTicket() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>End a Ticket</CardTitle>
          {/* <CardDescription>Manual/QR</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Ticket ID</Label>
                <Input id="name" placeholder="Ticket id number" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>End</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default EndTicket;