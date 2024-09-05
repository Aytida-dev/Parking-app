import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";

function GetBill() {
  const [TicketId, setTicketId] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchBillData = async () => {
    const response = await fetch('http://localhost:4000/ticket/GetBill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id: TicketId
      }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data: BillData, refetch } = useQuery({
    queryFn: fetchBillData,
    queryKey: ['TicketId', TicketId],
    enabled: false, // Disable automatic execution
  });

  const handleEndTicket = async (e: any) => {
    e.preventDefault();

    const result = await refetch(); // Get the result from refetch
    const data = result.data; // Access the data directly from refetch result

    if (data) {
      toast.success(data.message); // Show toast with the updated data
      setIsPreviewOpen(true); // Open the preview dialog
    }
  };

  console.log("EndTicketData: ", BillData);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card className="w-[350px]">
        <form onSubmit={handleEndTicket}>
          <CardHeader>
            <CardTitle>Get Ticket Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ticketId">Ticket ID</Label>
                <Input
                  id="ticketId"
                  placeholder="Ticket id number"
                  value={TicketId}
                  onChange={(e) => setTicketId(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Get</Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ticket Preview</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {BillData ? (
              <div>
                <div><strong>Start Time:</strong> {BillData.start_time}</div>
                <div><strong>End Time:</strong> {BillData.end_time}</div>
                <div><strong>Price:</strong> {BillData.price}</div>
                <div><strong>Rate:</strong> {BillData.rate}</div>
              </div>
            ) : (
              <div>No data available</div>
            )}
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GetBill;
