import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

export default function AddClient() {
  useAuth('admin');
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      idNumber: "", // renamed from CNIC to idNumber (more generic)
      status: "Active",
      joiningDate: "",
    },
  });

  const onSubmit = (data) => {
    // Convert to UTC before sending to backend
    const localDate = new Date(data.joiningDate);
    const utcDate = new Date(Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate()
    ));
    // we will convert it back when we get it from backend, so global time can be implemented
    // new Date(client.joiningDate).toLocaleDateString();
  
    const payload = {
      ...data,
      joiningDate: utcDate.toISOString(), // send in UTC ISO format
    };
  
    console.log("Client payload (UTC safe):", payload);
  
    toast({
      title: "Client Added Successfully",
      description: `${data.name} has been added.`,
    });
  
    reset();
    navigate("/admin/clients");
  };
  

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Add New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <Label>Name</Label>
              <Input
                {...register("name", { required: "Name is required" })}
                placeholder="Enter client name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                {...register("email", {
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                })}
                placeholder="Enter client email (optional)"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label>Phone</Label>
              <Input
                {...register("phone")}
                placeholder="Enter phone number"
              />
            </div>

            {/* Address */}
            <div>
              <Label>Address</Label>
              <Input {...register("address")} placeholder="Enter address" />
            </div>

            {/* ID Number */}
            <div>
              <Label>ID Number / Passport / National ID</Label>
              <Input
                {...register("idNumber")}
                placeholder="Enter ID number"
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <select
                {...register("status")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Joining Date */}
            <div>
              <Label>Joining Date</Label>
              <Input
                type="date"
                {...register("joiningDate")}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/clients")}
              >
                Cancel
              </Button>
              <Button type="submit">Add Client</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
