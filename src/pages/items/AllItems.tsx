
import { useState, useMemo } from "react";
import { useItemStore } from "@/hooks/useItemStore";
import MainLayout from "@/components/layout/MainLayout";
import ItemCard from "@/components/items/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const AllItems = () => {
  const { items, bulkDeleteItems } = useItemStore();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [bulkDeleteType, setBulkDeleteType] = useState<"normal" | "emergency" | "both">("both");
  const [bulkDeleteStartDate, setBulkDeleteStartDate] = useState<Date | undefined>(undefined);
  const [bulkDeleteEndDate, setBulkDeleteEndDate] = useState<Date | undefined>(undefined);

  // Calculate filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search term filter
      const searchMatch = 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      
      // Type filter
      const typeMatch = typeFilter === "all" || item.type === typeFilter;
      
      // Date filter
      let dateMatch = true;
      if (dateFilter) {
        const itemDate = new Date(item.date);
        dateMatch = 
          itemDate.getDate() === dateFilter.getDate() &&
          itemDate.getMonth() === dateFilter.getMonth() &&
          itemDate.getFullYear() === dateFilter.getFullYear();
      }
      
      return searchMatch && statusMatch && typeMatch && dateMatch;
    });
  }, [items, searchTerm, statusFilter, typeFilter, dateFilter]);
  
  // Handle filter reset
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setDateFilter(undefined);
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!bulkDeleteStartDate || !bulkDeleteEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    
    if (bulkDeleteStartDate > bulkDeleteEndDate) {
      toast.error("Start date must be before end date");
      return;
    }
    
    bulkDeleteItems({
      dateRange: { start: bulkDeleteStartDate, end: bulkDeleteEndDate },
      type: bulkDeleteType
    });
    
    toast.success("Items deleted successfully");
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">All Items</h1>
          
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Bulk Delete Items</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bulk Delete Items</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete items based on your selection.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Delete items by type:</h4>
                    <Select
                      value={bulkDeleteType}
                      onValueChange={(value: "normal" | "emergency" | "both") => 
                        setBulkDeleteType(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal Items Only</SelectItem>
                        <SelectItem value="emergency">Emergency Items Only</SelectItem>
                        <SelectItem value="both">Both Types</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Start Date:</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bulkDeleteStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bulkDeleteStartDate ? (
                            format(bulkDeleteStartDate, "PPP")
                          ) : (
                            <span>Pick a start date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bulkDeleteStartDate}
                          onSelect={setBulkDeleteStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">End Date:</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bulkDeleteEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bulkDeleteEndDate ? (
                            format(bulkDeleteEndDate, "PPP")
                          ) : (
                            <span>Pick an end date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bulkDeleteEndDate}
                          onSelect={setBulkDeleteEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        <div className="bg-card rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-9"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="found">Found</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : <span>Filter by date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== "all" || typeFilter !== "all" || dateFilter) && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}
              
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {statusFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setStatusFilter("all")}
                  />
                </Badge>
              )}
              
              {typeFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {typeFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setTypeFilter("all")}
                  />
                </Badge>
              )}
              
              {dateFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date: {format(dateFilter, "PPP")}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setDateFilter(undefined)}
                  />
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="ml-auto"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No items found matching your filters.</p>
            {(searchTerm || statusFilter !== "all" || typeFilter !== "all" || dateFilter) && (
              <Button
                variant="link"
                onClick={resetFilters}
                className="mt-2"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AllItems;
