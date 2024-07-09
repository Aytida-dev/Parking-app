import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function OrganisationLanding() {
  const [OrgID, setOrgID] = useState<String>('');
  const [InfraID, setInfraID] = useState<String>('')


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
    navigate("/createTicket", { state: { InfraID: InfraID } });
  };

  const handleSelectOrganization = (value: String, id: String) => {
    setOrgID(id);
  };

  const handleSelectInfrastructure = (value: String, id: String) => {
    setInfraID(id);
  }

  // if (organisationsLoading || infrastructuresLoading) {
  //   toast.info("Loading..");
  // }

  if (organisationsError) {
    toast.error(organisationsError?.message);
  }

  if (infrastructuresError) {
    toast.error(infrastructuresError?.message);
  }

  const organisations = organisationsData?.organisations;
  const infrastructures = infrastructuresData?.infrastructures;


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
                const selectedOrg = organisations?.find((org: any) => org.name === value);
                handleSelectOrganization(value, selectedOrg?._id);
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
              <Select onValueChange={(value) => {
                const selectInfra = infrastructures?.find((infra: any) => infra.name == value)
                handleSelectInfrastructure(value, selectInfra?._id)
              }}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Organization Infrastructure" />
                </SelectTrigger>
                <SelectContent position="popper">
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
