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
          {ticketArray.map((ticket, index) => (
            <div style={{ padding: "1%" }} key={ticket.ticket_id}>
              <Card className="w-[450px]">
                <CardHeader>
                  <CardTitle style={{ display: 'inline-block' }}> Ticket {index + 1}</CardTitle>
                </CardHeader>
                <CardContent style={{ textAlign: "left" }}>
                  <div key={ticket.ticket_id}>
                    <div style={{ paddingBottom: "4%" }}>
                      <p><strong>Email:</strong> {ticket.owner_email}</p>
                      <p><strong>Name:</strong> {ticket.owner_name}</p>
                      <p><strong>Phone:</strong> {ticket.owner_phone}</p>
                    </div>

                    <div style={{ paddingBottom: "4%" }}>
                      <p><strong>State:</strong> {ticket.infra_state}</p>
                      <p><strong>City:</strong> {ticket.infra_city}</p>
                      <p><strong>Organization:</strong> {ticket.organisation_name}</p>
                      <p><strong>Infra Name:</strong> {ticket.infra_name}</p>
                      <p><strong>Building Name:</strong> {ticket.building_name}</p>
                    </div>

                    <div style={{ paddingBottom: "4%" }}>
                      <p><strong>Spot Floor:</strong> {ticket.spot_floor}</p>
                      <p><strong>Spot Name:</strong> {ticket.spot_name}</p>
                      <p><strong>Rate Type:</strong> {ticket.rate_type}</p>
                      <p><strong>Vehicle Number:</strong> {ticket.vehicle_number}</p>
                      <p><strong>Vehicle Type:</strong> {ticket.vehicle_type}</p>
                    </div>

                    <div>
                      {/* <p><strong>Expired:</strong> {ticket.expired ? 'Yes' : 'No'}</p> */}
                      <p><strong>Created At:</strong> {formatDate(ticket.created_at)}</p>
                      <p><strong>Start Time:</strong> {formatDate(ticket.start_time)}</p>
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
