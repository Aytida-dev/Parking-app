// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import suv from '../assets/suv.avif'
// import sedan from '../assets/sedan.avif'
// import bike from '../assets/bike.avif'
// import { useLocation } from 'react-router-dom';
// import { useQuery } from "@tanstack/react-query";
// import { Minus, Plus } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { toast } from "sonner";
// import VehicleCard from "./CreateTicketComp/VehicleCard";

// function CreateTicket() {
//   type VehicleType = 'SUV' | 'SEDAN' | 'BIKE';

//   const vehicleTypes: Record<VehicleType, string> = {
//     SUV: suv,
//     SEDAN: sedan,
//     BIKE: bike,
//   };

//   const [LOCK_ID, setLOCK_ID] = useState('')

//   const [goal, setGoal] = useState<number>(0)
//   const [occupied, setOccupied] = useState<{ [key in VehicleType]?: string }>({});
//   const [name, setName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [vehicleNumber, setVehicleNumber] = useState('')

//   const [ChosenRate, setChosenRate] = useState('')
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
//   const [isDialogOpen, setIsDialogOpen] = useState(false);


//   const [Vehicles, setVehicles] = useState<any[]>([])


//   const location = useLocation();
//   const { InfraID = "" } = location.state || {};

//   const fetchOccupancy = async () => {
//     const response = await fetch(`http://localhost:4000/occupency/${InfraID}`)
//     if (!response.ok) {
//       throw new Error("Network response was not ok")
//     }
//     return response.json()
//   }

//   const {
//     data: occupancyData,
//     error: occupancyError,
//     isLoading: occupancyLoading,
//   } = useQuery({
//     queryFn: () => fetchOccupancy(),
//     queryKey: ["all_occupancy"]
//   })

//   const addVehicleStatus = (vehicle: VehicleType, count: number, VehicleBody: any) => {
//     setOccupied((prevOccupied) => ({
//       ...prevOccupied,
//       [vehicle]: count,
//     }));
//     setVehicles((prevVehicles) => [...prevVehicles, VehicleBody]);
//   }

//   const onClick = (adjustment: number) => {
//     setGoal((prevGoal) => prevGoal + adjustment);
//   }

//   const handleLockSpot = async () => {
//     const requestBody = {
//       infra_id: InfraID,
//       requirements: occupied
//     };

//     try {
//       const response = await fetch('http://localhost:4000/spots/lockSpots', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       const lockId = await response.json();

//       setLOCK_ID(lockId.lock_id);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleTicketSubmit = async () => {
//     Vehicles.map((vehicle) => {
//       if (vehicle.number.length === 0) {
//         const message = `please enter vehicle number of: ${vehicle.type}`;
//         toast.info(message);
//       }
//     })
//     closeDialog();
//     const requestBody = {
//       lock_id: LOCK_ID,
//       owner_name: name,
//       owner_phone: phoneNumber,
//       owner_email: email,
//       vehicles: Vehicles,
//       start: 1
//     }
//     console.log(requestBody);

//     try {
//       const response = await fetch('http://localhost:4000/ticket/createTicket', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody)
//       })
//       const ticketInfo = await response.json();
//       console.log(ticketInfo);
//     } catch (err) {
//       toast.error(err)
//     }
//   }

//   useEffect(() => {
//     if (isDialogOpen && timeLeft > 0) {
//       const timer = setInterval(() => {
//         setTimeLeft((prevTime) => prevTime - 1);
//       }, 1000);

//       return () => clearInterval(timer);
//     } else if (timeLeft === 0) {
//       closeDialog();
//     }
//   }, [isDialogOpen, timeLeft]);

//   const closeDialog = () => {
//     setIsDialogOpen(false);
//     setTimeLeft(600); // reset timer
//     setOccupied({});
//     setGoal(1);
//   }

//   const openDialog = () => {
//     handleLockSpot()
//     setIsDialogOpen(true);
//     setTimeLeft(600); // 10 minutes in seconds
//   }


//   const resetGoal = () => {
//     setGoal(0);
//   }


//   return (
//     <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "2vh", flexDirection: "column" }}>
//       <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "2vh", flexDirection: "row" }}>
//         {occupancyData && Object.keys(occupancyData).map((key) => {
//           const vehicleImg = key as VehicleType; // Assert the type here
//           const VehicleBody = {
//             number: vehicleNumber,
//             rate_type: ChosenRate,
//             start: 1,
//             type: vehicleImg,
//           }
//           return (
//             <Card className="w-[350px]" key={key}>
//               <CardHeader>
//                 <CardTitle style={{ display: "inline-block" }}>{key}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div style={{ height: "288px" }}>
//                   <img src={vehicleTypes[vehicleImg]} alt={key} />
//                 </div>
//                 <div>
//                   <div style={{ display: "flex", justifyContent: 'space-evenly' }}>
//                     <p>Total: {occupancyData[key].total}</p>
//                     <p>Available: {occupancyData[key].available}</p>
//                   </div>
//                   {/* <div>
//                     <p>Selected: {occupancyData[key].occupied}</p>
//                   </div> */}
//                   <div style={{ display: "flex", justifyContent: "center", paddingTop: "5%" }}>
//                     <div>
//                       <Drawer onClose={resetGoal}>
//                         <DrawerTrigger asChild>
//                           <Button style={{ backgroundColor: "black", color: "white", width: "7vw" }} variant="secondary">Add</Button>
//                         </DrawerTrigger>
//                         <DrawerContent>
//                           <div className="mx-auto w-full max-w-sm">
//                             <DrawerHeader>
//                               <DrawerTitle>
//                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                   <div>
//                                     <p>Book Tickets</p>
//                                   </div>
//                                   <div>
//                                     <div className="flex w-full max-w-sm items-center space-x-2">
//                                       <Input
//                                         type="text"
//                                         placeholder="Vehicle Number"
//                                         value={vehicleNumber}
//                                         onChange={(e) => setVehicleNumber(e.target.value)}
//                                         required
//                                       />
//                                       <Button type="submit">Add</Button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </DrawerTitle>
//                             </DrawerHeader>
//                             <div className="p-4 pb-0">
//                               <div className="flex items-center justify-center space-x-2">
//                                 <Button
//                                   variant="outline"
//                                   size="icon"
//                                   className="h-8 w-8 shrink-0 rounded-full"
//                                   onClick={() => onClick(-1)}
//                                   disabled={goal <= 0}
//                                 >
//                                   <Minus className="h-4 w-4" />
//                                   <span className="sr-only">Decrease</span>
//                                 </Button>
//                                 <div className="flex-1 text-center">
//                                   <div className="text-7xl font-bold tracking-tighter">
//                                     {goal}
//                                   </div>
//                                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                                     <Button
//                                       variant={ChosenRate === 'daily' ? 'secondary' : 'outline'}
//                                       onClick={() => setChosenRate('DAILY')}
//                                     >
//                                       ${occupancyData[key].DAILY}/DAY
//                                     </Button>
//                                     <Button
//                                       variant={ChosenRate === 'hourly' ? 'secondary' : 'outline'}
//                                       onClick={() => setChosenRate('HOURLY')}
//                                     >
//                                       ${occupancyData[key].HOURLY}/HOURLY
//                                     </Button>
//                                   </div>
//                                 </div>
//                                 <Button
//                                   variant="outline"
//                                   size="icon"
//                                   className="h-8 w-8 shrink-0 rounded-full"
//                                   onClick={() => onClick(1)}
//                                   disabled={goal >= occupancyData[key].available}
//                                 >
//                                   <Plus className="h-4 w-4" />
//                                   <span className="sr-only">Increase</span>
//                                 </Button>
//                               </div>
//                             </div>
//                             <DrawerFooter>
//                               <DrawerClose>
//                                 <div style={{ display: "flex", justifyContent: "space-evenly" }}>
//                                   <Button variant="destructive">Cancel</Button>
//                                   <Button onClick={() => addVehicleStatus(vehicleImg, goal, VehicleBody)}>Submit</Button>
//                                 </div>
//                               </DrawerClose>
//                             </DrawerFooter>
//                           </div>
//                         </DrawerContent>
//                       </Drawer>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>
//       <div>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button style={{ marginTop: "4%", width: "20%" }} onClick={openDialog}>Create Ticket</Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle style={{ display: "flex", justifyContent: "space-between" }}>
//                 <div>Create Ticket</div>
//                 <div style={{ paddingRight: "7%", color: "red" }}>{`${Math.floor(timeLeft / 60)
//                   .toString()
//                   .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}</div>
//               </DialogTitle>
//               <DialogDescription>
//                 Please be sure to submit within deadline
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="name" className="text-right">
//                   Name
//                 </Label>
//                 <Input
//                   id="name"
//                   placeholder="Enter your name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="phone_number" className="text-right">
//                   Phone_No.
//                 </Label>
//                 <Input
//                   id="phone_number"
//                   placeholder="Enter your phone number"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="email" className="text-right">
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="col-span-3"
//                 />
//               </div>
//             </div>
//             <div>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <Button style={{ backgroundColor: "greenyellow", color: "black" }} type="submit" onClick={handleTicketSubmit}>Submit</Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }

// export default CreateTicket;


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

type VehicleType = 'SUV' | 'SEDAN' | 'BIKE';

const CreateTicket: React.FC = () => {
  const vehicleTypes: Record<VehicleType, string> = {
    SUV: suv,
    SEDAN: sedan,
    BIKE: bike,
  };

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

  console.log("occupied: " , occupied);
  console.log("vehicles: ", Vehicles);
  
  

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

    console.log(requestBody);

    try {
      const response = await fetch('http://localhost:4000/ticket/createTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const ticketInfo = await response.json();
      console.log(ticketInfo);
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
    </div>
  );
};

export default CreateTicket;
