
import { Item } from "@/hooks/useItemStore";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Check, Edit, Eye, Phone, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useItemStore } from "@/hooks/useItemStore";
import { toast } from "sonner";

interface ItemCardProps {
  item: Item;
  showActions?: boolean;
  onView?: (item: Item) => void;
}

const ItemCard = ({ item, showActions = true, onView }: ItemCardProps) => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { updateItem, deleteItem } = useItemStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const isOwner = user?.id === item.userId;
  const canEdit = isOwner || isAdmin;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost':
        return 'bg-red-500';
      case 'found':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const handleStatusChange = () => {
    updateItem(item.id, { status: 'completed' });
    toast.success("Item marked as completed!");
  };
  
  const handleDelete = () => {
    deleteItem(item.id);
    setIsDeleteDialogOpen(false);
    toast.success("Item deleted successfully!");
  };
  
  return (
    <>
      <Card className={`item-card ${item.type} ${item.status}`}>
        <CardContent className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg line-clamp-1">{item.productName}</h3>
              <div className="flex gap-1">
                <Badge variant={item.type === 'emergency' ? 'destructive' : 'outline'}>
                  {item.type}
                </Badge>
                <Badge variant="secondary" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">Location:</span> {item.location}
            </p>
            
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">Date:</span> {format(new Date(item.date), 'dd MMM yyyy')}
            </p>
            
            {item.description && (
              <p className="text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
            )}
            
            {item.imageUrl && (
              <div className="mb-3">
                <img 
                  src={item.imageUrl} 
                  alt={item.productName}
                  className="h-32 w-full object-cover rounded-sm"
                />
              </div>
            )}
            
            <div className="mt-auto">
              <p className="text-xs text-muted-foreground">
                Posted by {item.userName}
              </p>
            </div>
          </div>
        </CardContent>
        
        {showActions && isAuthenticated && (
          <CardFooter className="bg-muted/50 p-2 flex justify-between">
            <TooltipProvider>
              <div className="flex space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setIsViewDialogOpen(true)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View details</TooltipContent>
                </Tooltip>
                
                {canEdit && item.status !== 'completed' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleStatusChange}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Mark as completed</TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              {canEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete item</TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </CardFooter>
        )}
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{item.productName}</DialogTitle>
            <div className="flex gap-2 mt-1">
              <Badge variant={item.type === 'emergency' ? 'destructive' : 'outline'}>
                {item.type}
              </Badge>
              <Badge variant="secondary" className={getStatusColor(item.status)}>
                {item.status}
              </Badge>
            </div>
          </DialogHeader>
          
          <div className="space-y-3">
            {item.imageUrl && (
              <div>
                <img 
                  src={item.imageUrl} 
                  alt={item.productName}
                  className="h-56 w-full object-contain rounded-md border"
                />
              </div>
            )}
            
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <span className="text-sm font-medium">Location:</span>
              <span className="text-sm">{item.location}</span>
              
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm">{format(new Date(item.date), 'dd MMM yyyy')}</span>
              
              <span className="text-sm font-medium">Posted by:</span>
              <span className="text-sm">{item.userName}</span>
              
              <span className="text-sm font-medium">Contact:</span>
              <span className="text-sm flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {item.phone}
              </span>
            </div>
            
            {item.description && (
              <div>
                <p className="text-sm font-medium mb-1">Description:</p>
                <p className="text-sm">{item.description}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            {canEdit && item.status !== 'completed' && (
              <Button 
                variant="outline" 
                className="mr-auto"
                onClick={() => {
                  handleStatusChange();
                  setIsViewDialogOpen(false);
                }}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark as Completed
              </Button>
            )}
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemCard;
