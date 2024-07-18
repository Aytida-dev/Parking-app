import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import VehicleCard from './CreateTicketComp/VehicleCard';
import VehicleBookTicket from './CreateTicketComp/VehicleBookTicket';
import suv from '../assets/suv.avif';
import sedan from '../assets/sedan.avif';
import bike from '../assets/bike.avif';
import ShowTicket from './ShowTicket';

type VehicleType = 'SUV' | 'SEDAN' | 'BIKE';

const CreateTicket: React.FC = () => {
  const vehicleTypes: Record<VehicleType, string> = {
    SUV: suv,
    SEDAN: sedan,
    BIKE: bike,
  };


  const [TicketInfo, setTicketInfo] = useState<any[]>([]);
  const [LOCK_ID, setLOCK_ID] = useState('');
  const [goal, setGoal] = useState<number>(0);
  const [occupied, setOccupied] = useState<{ [key in VehicleType]?: string }>({});
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ChosenRate, setChosenRate] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Vehicles, setVehicles] = useState<any[]>([]);
  const location = useLocation();
  const { InfraID = '' } = location.state || {};

  // console.log("occupied: ", occupied);
  // console.log("vehicles: ", Vehicles);

  const fetchOccupancy = async () => {
    const response = await fetch(`http://localhost:4000/occupency/${InfraID}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data: occupancyData, error: occupancyError, isLoading: occupancyLoading } = useQuery({
    queryFn: fetchOccupancy,
    queryKey: ['all_occupancy'],
  });

  const addVehicleStatus = (vehicle: VehicleType, count: number, vehicleBody: any) => {
    setOccupied((prevOccupied) => ({
      ...prevOccupied,
      [vehicle]: count,
    }));
    setVehicles((prevVehicles) => [...prevVehicles, vehicleBody]);
  };

  const handleLockSpot = async () => {
    const requestBody = {
      infra_id: InfraID,
      requirements: occupied,
    };

    try {
      const response = await fetch('http://localhost:4000/spots/lockSpots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const lockId = await response.json();
      setLOCK_ID(lockId.lock_id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTicketSubmit = async () => {
    Vehicles.map((vehicle) => {
      if (vehicle.number.length === 0) {
        const message = `Please enter vehicle number of: ${vehicle.type}`;
        toast.info(message);
      }
    });

    closeDialog();
    const requestBody = {
      lock_id: LOCK_ID,
      owner_name: name,
      owner_phone: phoneNumber,
      owner_email: email,
      vehicles: Vehicles,
      start: 1,
    };

    try {
      const response = await fetch('http://localhost:4000/ticket/createTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const ticketInfo = await response.json();
      setTicketInfo((prevInfo) => [...prevInfo, ticketInfo]);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (isDialogOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      closeDialog();
    }
  }, [isDialogOpen, timeLeft]);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeLeft(600); // reset timer
    setOccupied({});
    setGoal(1);
  };

  const openDialog = () => {
    handleLockSpot();
    setIsDialogOpen(true);
    setTimeLeft(600); // 10 minutes in seconds
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2vh', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2vh', flexDirection: 'row' }}>
        {occupancyData &&
          Object.keys(occupancyData).map((key) => {
            const vehicleImg = key as VehicleType; // Assert the type here
            return (
              <VehicleCard
                key={key}
                vehicleImg={vehicleTypes[vehicleImg]}
                vehicleType={vehicleImg}
                occupancyData={occupancyData[key]}
                goal={goal}
                vehicleNumber={vehicleNumber}
                ChosenRate={ChosenRate}
                setGoal={setGoal}
                setVehicleNumber={setVehicleNumber}
                setChosenRate={setChosenRate}
                addVehicleStatus={addVehicleStatus}
              />
            );
          })}
      </div>
      <div>
        <VehicleBookTicket
          Vehicles={Vehicles}
          closeDialog={closeDialog}
          openDialog={openDialog}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          timeLeft={timeLeft}
          name={name}
          phoneNumber={phoneNumber}
          email={email}
          setName={setName}
          setPhoneNumber={setPhoneNumber}
          setEmail={setEmail}
          handleTicketSubmit={handleTicketSubmit}
        />
      </div>
      <div>
        {/* {TicketInfo.length > 0 &&  */}
        <ShowTicket ticketInfo={TicketInfo} />
        {/* } */}
      </div>
    </div>
  );
};

export default CreateTicket;
