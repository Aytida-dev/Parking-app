import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

function InfrastructureLanding() {
  const [selectedOrganization, setSelectedOrganization] = useState('');

  // const [InfraName, setInfraName] = useState('');
  // const [InfraAddress, setInfraAddress] = useState('')
  // const [InfraCoordinate, setInfraCoordinate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Organization:", selectedOrganization);
  };

  const handleSelectChange = (value) => {
    console.log("Select changed:", value); // Debugging statement
    setSelectedOrganization(value);
  };

  // const getAllOrganizationData = async () => {
  //   try {
  //     const response = await axios.get("localhost:5000/worker/infra/getAllByOrgan/:orgId");
  //     console.log(response.data);
  //     setselectedOrganizationName(response.data.name)
  //     setSelectedLocation(response.data.address)
  //   } catch (err) {
  //     toast.error("Something went wrong...")
  //   }
  // }
  // useEffect(() => {
  //   getAllOrganizationData();
  // }, [])

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>TCS</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Choose Branch</Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Name of the Branch" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Gitanjali Park">Gitanjali Park</SelectItem>
                  <SelectItem value="Chennai One">Chennai One</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Submit</Button>
      </CardFooter>
    </Card>
  );
}

export default InfrastructureLanding;
