import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import suv from '../assets/suv.avif'
import sedan from '../assets/sedan.avif'
import cycle from '../assets/bicycle.webp'
import { useLocation } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react";

const data = [
  {
    goal: 1,
  },
  {
    goal: 2,
  },
  {
    goal: 3,
  },
  {
    goal: 4,
  },
  {
    goal: 5,
  },
  {
    goal: 6,
  },
]

function InfrastructureLanding() {
  type VehicleType = 'SUV' | 'SEDAN' | 'BIKE';

  const vehicleTypes: Record<VehicleType, string> = {
    SUV: suv,
    SEDAN: sedan,
    BIKE: cycle
  };

  const [goal, setGoal] = useState<number>(1)
  const [occupied, setOccupied] = useState<{ [key in VehicleType]?: string }>({});

  const location = useLocation();
  const { InfraID = "" } = location.state || {};

  const fetchOccupancy = async () => {
    const response = await fetch(`http://localhost:4000/occupency/${InfraID}`)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return response.json()
  }

  const {
    data: occupancyData,
    error: occupancyError,
    isLoading: occupancyLoading,
  } = useQuery({
    queryFn: () => fetchOccupancy(),
    queryKey: ["all_occupancy"]
  })

  const addVehicleStatus = (vehicle: VehicleType, count: string) => {
    setOccupied((prevOccupied) => ({
      ...prevOccupied,
      [vehicle]: count,
    }));
  }

  const onClick = (adjustment: number) => {
    setGoal((prevGoal) => prevGoal + adjustment);
  }
  // console.log(occupied);
  const handleLockSpot = async () => {
    const requestBody = {
      infra_id: InfraID,
      requirements: occupied
    };

    console.log(requestBody); // Check the requestBody structure

    try {
      const response = await fetch('http://localhost:4000/spots/lockSpots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const lockId = await response.json();
      console.log(lockId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // console.log(occupancyData);


  return (
    <div style={{ display: "flex", width: "100vw", justifyContent: "space-evenly", marginTop: "2vh", flexDirection: "column" }}>
      <div style={{ display: "flex", width: "100vw", justifyContent: "space-evenly", marginTop: "2vh", flexDirection: "row" }}>
        {occupancyData && Object.keys(occupancyData).map((key) => {
          const vehicleImg = key as VehicleType; // Assert the type here
          return (
            <Card className="w-[350px]" key={key}>
              <CardHeader>
                <CardTitle style={{ display: "inline-block" }}>{key}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={vehicleTypes[vehicleImg]} alt={key} />
                <div>
                  <div style={{ display: "flex", justifyContent: 'space-evenly' }}>
                    <p>Total: {occupancyData[key].total}</p>
                    {/* <p>Occupied: {occupied[vehicleImg]}</p> */}
                    <p>Available: {occupancyData[key].available}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", paddingTop: "5%" }}>
                    <div>
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button style={{ backgroundColor: "black", color: "white" }} variant="secondary">Open Drawer</Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                              <DrawerTitle>Book Tickets</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4 pb-0">
                              <div className="flex items-center justify-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 rounded-full"
                                  onClick={() => onClick(-1)}
                                  disabled={goal <= 0}
                                >
                                  <Minus className="h-4 w-4" />
                                  <span className="sr-only">Decrease</span>
                                </Button>
                                <div className="flex-1 text-center">
                                  <div className="text-7xl font-bold tracking-tighter">
                                    {goal}
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className="text-[0.70rem] uppercase text-muted-foreground">
                                      ${occupancyData[key].DAILY}/DAY
                                    </div>
                                    <div className="text-[0.70rem] uppercase text-muted-foreground">
                                      ${occupancyData[key].HOURLY}/HOURLY
                                    </div>
                                  </div>

                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 rounded-full"
                                  onClick={() => onClick(1)}
                                  disabled={goal >= 6}
                                >
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Increase</span>
                                </Button>
                              </div>
                              <div className="mt-3 h-[120px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={data}>
                                    <Bar
                                      dataKey="goal"
                                      style={
                                        {
                                          fill: "hsl(var(--foreground))",
                                          opacity: 0.9,
                                        } as React.CSSProperties
                                      }
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            <DrawerFooter>
                              <DrawerClose>
                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                  <Button onClick={() => addVehicleStatus(vehicleImg, goal.toString())}>Submit</Button>
                                  <Button variant="destructive">Cancel</Button>
                                </div>
                              </DrawerClose>
                            </DrawerFooter>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div>
        <Button style={{ marginTop: "4%", width: "20%" }} onClick={handleLockSpot}>Submit</Button>
      </div>
    </div>
  );
}

export default InfrastructureLanding;
