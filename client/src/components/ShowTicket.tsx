import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VehicleInfo {
  building_id: string;
  building_name: string;
  created_at: string;
  expired: boolean;
  infra_city: string;
  infra_id: string;
  infra_name: string;
  infra_state: string;
  organisation_name: string;
  owner_email: string;
  owner_name: string;
  owner_phone: string;
  rate_type: string;
  spot_floor: number;
  spot_id: string;
  spot_name: string;
  start_time: string;
  ticket_id: string;
  vehicle_number: string;
  vehicle_type: string;
}

interface ShowTicketProps {
  ticketInfo: VehicleInfo[][];
}

const ShowTicket: React.FC<ShowTicketProps> = ({ ticketInfo }) => {
  // console.log("ticketInfo from ShowTicket: ", ticketInfo);

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleString();
  }

  return (
    <div>
      {ticketInfo?.map((ticketArray, index) => (
        <div
          key={`ticket-group-${index}`}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            // backgroundColor: "grey",
            margin: '2%',
            padding: '1%',
            boxSizing: 'border-box',
            flex: '1 1 30%', // Adjust percentage as needed for the desired number of items per row
          }}
        >
          {ticketArray?.map((ticket, index) => (
            <div style={{ padding: "1%" }} key={ticket.ticket_id}>
              <Card className="w-[450px]">
                <CardHeader>
                  <CardTitle style={{ display: 'inline-block' }}> Ticket {index + 1}</CardTitle>
                </CardHeader>
                <CardContent style={{ textAlign: "left" }}>
                  <div key={ticket.ticket_id}>
                    <div style={{ paddingBottom: "4%" }}>
                      <div><strong>Email:</strong> {ticket.owner_email}</div>
                      <div><strong>Name:</strong> {ticket.owner_name}</div>
                      <div><strong>Phone:</strong> {ticket.owner_phone}</div>
                    </div>

                    <div style={{ paddingBottom: "4%" }}>
                      <div><strong>State:</strong> {ticket.infra_state}</div>
                      <div><strong>City:</strong> {ticket.infra_city}</div>
                      <div><strong>Organization:</strong> {ticket.organisation_name}</div>
                      <div><strong>Infra Name:</strong> {ticket.infra_name}</div>
                      <div><strong>Building Name:</strong> {ticket.building_name}</div>
                    </div>

                    <div style={{ paddingBottom: "4%" }}>
                      <div><strong>Spot Floor:</strong> {ticket.spot_floor}</div>
                      <div><strong>Spot Name:</strong> {ticket.spot_name}</div>
                      <div><strong>Rate Type:</strong> {ticket.rate_type}</div>
                      <div><strong>Vehicle Number:</strong> {ticket.vehicle_number}</div>
                      <div><strong>Vehicle Type:</strong> {ticket.vehicle_type}</div>
                    </div>

                    <div>
                      {/* <div><strong>Expired:</strong> {ticket.expired ? 'Yes' : 'No'}</div> */}
                      <div><strong>Created At:</strong> {formatDate(ticket.created_at)}</div>
                      <div><strong>Start Time:</strong> {formatDate(ticket.start_time)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShowTicket;
