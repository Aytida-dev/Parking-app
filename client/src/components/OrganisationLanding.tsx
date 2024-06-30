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
import axios from "axios";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

function OrganisationLanding() {
  const [OrganizationName, setOrganizationName] = useState <String>('')
  const [OrganizationLocation, setOrganizationLocation] = useState <String>('')

  const navigate = useNavigate();

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    // console.log("Selected Organization:", OrganizationName);
    navigate("/InfrastructureLanding")
  };

  const handleSelectOrganization = (value: String) => {
    console.log("oraganization changed:", value); // Debugging statement
    setOrganizationName(value);
  };

  const handleSelectChangeLocation = (value : String) => {
    console.log("location changed: ", value);
    setOrganizationLocation(value);
  }

  // const getAllOrganizationData = async () => {
  //   try {
  //     const response = await axios.get("localhost:5000/worker/organisation/getAll");
  //     console.log(response.data);
  //     setOrganizationName(response.data.name)
  //     setOrganizationLocation(response.data.address)
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
        <CardTitle>Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              {/* <Label htmlFor="framework">Choose Location</Label> */}
              <Select onValueChange={handleSelectOrganization}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Organization Name" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="TCS">TCS</SelectItem>
                  <SelectItem value="Accenture">Accenture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              {/* <Label htmlFor="framework">Choose Location</Label> */}
              <Select onValueChange={handleSelectChangeLocation}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Organization Infrastructure" />
                </SelectTrigger>
                {
                  OrganizationName === "TCS" ? (
                    <SelectContent position="popper">
                      <SelectItem value="Kolkata">Kolkata</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                    </SelectContent>
                  )
                    : OrganizationName === "Accenture" ? (
                      <SelectContent position="popper">
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                      </SelectContent>
                    ) : (
                      ""
                    )
                }
              </Select>
            </div>
          </div>
          <div style={{ "marginTop": "7%" }} className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default OrganisationLanding;
