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
import { useQuery } from "@tanstack/react-query";

function OrganisationLanding() {
  const [OrganizationName, setOrganizationName] = useState<String>('');
  const [OrganizationLocation, setOrganizationLocation] = useState<String>('');
  const [OrgID, setOrgID] = useState<String>('');


  const fetchOrganisations = async () => {
    const response = await fetch("http://localhost:4000/organisation");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const fetchInfrastructures = async (OrgID: String) => {
    const response = await fetch(`http://localhost:4000/infrastructure/${OrgID}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };


  const {
    data: organisationsData,
    error: organisationsError,
    isLoading: organisationsLoading,
  } = useQuery({
    queryFn: fetchOrganisations,
    queryKey: ["All_Organization"],
  });

  const {
    data: infrastructuresData,
    error: infrastructuresError,
    isLoading: infrastructuresLoading,
  } = useQuery({
    queryFn: () => fetchInfrastructures(OrgID),
    queryKey: ["All_Infrastructure"],
    enabled: !!OrgID, // This ensures the query runs only if OrgID is not empty
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    navigate("/InfrastructureLanding");
  };

  const handleSelectOrganization = (value: String, id: String) => {
    console.log("organization changed:", value); // Debugging statement
    setOrganizationName(value);
    setOrgID(id);
  };

  const handleSelectChangeLocation = (value: String) => {
    console.log("location changed: ", value);
    setOrganizationLocation(value);
  };

  if (organisationsLoading || infrastructuresLoading) {
    toast.info("Loading..");
  }

  if (organisationsError) {
    toast.error(organisationsError?.message);
  }

  if (infrastructuresError) {
    toast.error(infrastructuresError?.message);
  }

  const organisations = organisationsData?.organisations;
  const infrastructures = infrastructuresData?.infrastructures;
  console.log(infrastructures);


  console.log(OrgID)

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Select onValueChange={(value) => {
                // const selectedOrg = '';
                {
                  const selectedOrg = organisations?.find((org: any) => org.name === value);
                  handleSelectOrganization(value, selectedOrg?._id);
                }
              }}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Organization Name" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {
                    organisations?.map((e: any, index: number) => (
                      <SelectItem key={e._id} value={e.name}>{`${index + 1}. ${e.name}`}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Select onValueChange={handleSelectChangeLocation}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Organization Infrastructure" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {/* {
                    infrastructures?.map((e: any, index: number) => (
                      <SelectItem key={e._id} value={e.name}>{`${index + 1}. ${e.name}`}</SelectItem>
                    ))
                  } */}
                  {infrastructures ? (
                    infrastructures.map((e: any, index: number) => (
                      <SelectItem key={e._id} value={e.name}>{`${index + 1}. ${e.name}`}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Please select Org. Name" disabled>Please select Org. Name</SelectItem>
                  )}
                </SelectContent>
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
