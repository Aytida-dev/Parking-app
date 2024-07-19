import { Button } from "@/components/ui/button"
import { useState } from "react"
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

function StartTicket() {
  const [TicketId, setTicketId] = useState('');
  const [VehicleNum, setVehicleNum] = useState('')

  const ToStartTicket = async() => {
    // const response = 
  }


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Start a Ticket</CardTitle>
          {/* <CardDescription>Manual/QR</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="idNum">Ticket ID</Label>
                <Input onChange={(e) => setTicketId(e.target.value)} value={TicketId} id="idNum" placeholder="Ticket id number" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="Vnumber">Vehicle Number</Label>
                <Input onChange={(e) => setVehicleNum(e.target.value)} value={VehicleNum} id="Vnumber" placeholder="Vehicle number" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Start</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default StartTicket;