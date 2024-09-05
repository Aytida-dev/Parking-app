import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VehicleCardDrawer from './VehicleCardDrawer';

type VehicleType = 'SUV' | 'SEDAN' | 'BIKE';

interface VehicleCardProps {
  vehicleImg: string;
  vehicleType: VehicleType;
  occupancyData: any;
  goal: number;
  vehicleNumber: string;
  ChosenRate: string;
  setGoal: (value: number) => void;
  setVehicleNumber: (value: string) => void;
  setChosenRate: (value: string) => void;
  addVehicleStatus: (vehicle: VehicleType, count: number, vehicleBody: any) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicleImg,
  vehicleType,
  occupancyData,
  goal,
  vehicleNumber,
  ChosenRate,
  setGoal,
  setVehicleNumber,
  setChosenRate,
  addVehicleStatus,
}) => {
  const vehicleBody = {
    number: vehicleNumber,
    rate_type: ChosenRate,
    start: 1,
    type: vehicleType,
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle style={{ display: 'inline-block' }}>{vehicleType}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '288px' }}>
          <img src={vehicleImg} alt={vehicleType} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <div>Total: {occupancyData.total}</div>
            <div>Available: {occupancyData.available}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5%' }}>
            <VehicleCardDrawer
              vehicleType={vehicleType}
              occupancyData={occupancyData}
              goal={goal}
              vehicleNumber={vehicleNumber}
              ChosenRate={ChosenRate}
              setGoal={setGoal}
              setVehicleNumber={setVehicleNumber}
              setChosenRate={setChosenRate}
              addVehicleStatus={addVehicleStatus}
              vehicleBody={vehicleBody}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
