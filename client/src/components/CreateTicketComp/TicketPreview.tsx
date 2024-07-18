interface TicketPreviewProps {
  name: string;
  phoneNumber: string;
  email: string;
  Vehicles: any[];
}

const TicketPreview: React.FC<TicketPreviewProps> = ({ name, phoneNumber, email, Vehicles }) => {
  return (
    <div>
      <div>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Phone Number:</strong> {phoneNumber}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>
      <div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '0.5rem' }}>Vehicle Name</th>
              <th style={{ border: '1px solid black', padding: '0.5rem' }}>Vehicle Number</th>
              <th style={{ border: '1px solid black', padding: '0.5rem' }}>Rate Type</th>
            </tr>
          </thead>
          <tbody>
            {
              Vehicles.map((vehicle, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{vehicle.type}</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{vehicle.number}</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{vehicle.rate_type}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketPreview;
