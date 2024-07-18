import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react'

type VehicleType = 'SUV' | 'SEDAN' | 'BIKE';

interface VehicleCardDrawerProps {
  vehicleType: VehicleType;
  occupancyData: any;
  goal: number;
  vehicleNumber: string;
  ChosenRate: string;
  setGoal: (value: number) => void;
  setVehicleNumber: (value: string) => void;
  setChosenRate: (value: string) => void;
  addVehicleStatus: (vehicle: VehicleType, count: number, vehicleBody: any) => void;
  vehicleBody: any;
}

const VehicleCardDrawer: React.FC<VehicleCardDrawerProps> = ({
  vehicleType,
  occupancyData,
  goal,
  vehicleNumber,
  ChosenRate,
  setGoal,
  setVehicleNumber,
  setChosenRate,
  addVehicleStatus,
  vehicleBody,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onClick = (adjustment: number) => {
    setGoal(goal + adjustment);
  };

  const resetGoal = () => {
    setGoal(0);
    setIsDrawerOpen(false)
  };

  const isSubmitDisabled = !ChosenRate || !vehicleNumber || goal <= 0;

  const handleSubmit = () => {
    if (!isSubmitDisabled) {
      addVehicleStatus(vehicleType, goal, vehicleBody);
      setIsDrawerOpen(false);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} onClose={resetGoal}>
      <DrawerTrigger asChild>
        <Button
          style={{ backgroundColor: 'black', color: 'white', width: '7vw' }}
          variant="secondary"
          onClick={() => setIsDrawerOpen(true)}
        >
          Add
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p>Book Tickets</p>
                </div>
                <div>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Vehicle Number"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      required
                    />
                    <Button type="submit">Add</Button>
                  </div>
                </div>
              </div>
            </DrawerTitle>
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
                <div className="text-7xl font-bold tracking-tighter">{goal}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant={ChosenRate === 'DAILY' ? 'secondary' : 'outline'}
                    onClick={() => setChosenRate('DAILY')}
                  >
                    ${occupancyData.DAILY}/DAY
                  </Button>
                  <Button
                    variant={ChosenRate === 'HOURLY' ? 'secondary' : 'outline'}
                    onClick={() => setChosenRate('HOURLY')}
                  >
                    ${occupancyData.HOURLY}/HOURLY
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(1)}
                disabled={goal >= occupancyData.available}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button variant="destructive" onClick={resetGoal}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                Submit
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default VehicleCardDrawer;