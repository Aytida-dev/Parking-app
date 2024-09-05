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
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"

function StartTicket() {
  const WorkerId = "uYfYUs";
  const [TicketId, setTicketId] = useState('');
  const [VehicleNum, setVehicleNum] = useState('')

  const fetchStartTicketData = async () => {
    try {
      const response = await fetch('http://localhost:4000/ticket/startTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket_id: TicketId,
          vehicle_number: VehicleNum,
          worker_id: WorkerId
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json();
    } catch (err) {
      toast.error("Ticket did not start");
      console.log(err);
    }
  }

  const { data: StartTicketData, refetch } = useQuery({
    queryFn: fetchStartTicketData,
    queryKey: ['TicketId', TicketId],
    enabled: false, // Disable automatic execution
  })
  const handleStartTicket = async (e: any) => {
    e.preventDefault();

    const result = await refetch();
    const data = result.data;

    console.log("data: ", data);

    if (data) {
      toast.success(`Ticket Started at: ${data.start_time}`);
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card className="w-[350px]">
        <form onSubmit={handleStartTicket}>
          <CardHeader>
            <CardTitle>Start a Ticket</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Start</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default StartTicket;