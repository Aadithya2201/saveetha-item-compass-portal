
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useItemStore } from "@/hooks/useItemStore";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const { addItem } = useItemStore();
  const [formState, setFormState] = useState({
    productName: "",
    location: "",
    description: "",
    type: "normal",
    status: "lost",
    date: new Date(),
    phone: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormState({
        ...formState,
        date,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormState({
      ...formState,
      image: file,
    });

    // Create image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formState.productName || !formState.location || !formState.phone) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    // Validate phone number - simple validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formState.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      try {
        // Create new item
        addItem({
          id: Math.random().toString(36).substring(2, 11),
          productName: formState.productName,
          location: formState.location,
          description: formState.description,
          type: formState.type as "normal" | "emergency",
          status: formState.status as "lost" | "found" | "completed",
          date: formState.date,
          phone: formState.phone,
          imageUrl: imagePreview,
          userId: user?.id || "",
          userName: user?.name || "",
          createdAt: new Date(),
        });

        // Reset form
        setFormState({
          productName: "",
          location: "",
          description: "",
          type: "normal",
          status: "lost",
          date: new Date(),
          phone: "",
          image: null,
        });
        setImagePreview(null);

        toast.success("Item posted successfully!");
      } catch (error) {
        toast.error("Failed to post item");
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome to the Lost & Found Dashboard
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Post a Lost or Found Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productName">Item Name *</Label>
                  <Input
                    id="productName"
                    name="productName"
                    placeholder="e.g. Laptop, Wallet, ID Card"
                    value={formState.productName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Your contact number"
                    value={formState.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Where lost/found"
                    value={formState.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formState.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formState.date ? format(formState.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formState.date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Item Type *</Label>
                  <Select
                    value={formState.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formState.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide additional details about the item"
                    value={formState.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image">Upload Image</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image
                    </Button>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <span className="text-sm text-muted-foreground">
                      {formState.image ? formState.image.name : "No file selected"}
                    </span>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-40 object-contain rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-college hover:bg-college-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Post Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
