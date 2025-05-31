import React from "react";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeletePropertyUIProps {
  propertyId: string;
  onDelete: (id: string) => void;
  alertTitle: string;
  alertDesc: string;
}

const DeletePropertyUI: React.FC<DeletePropertyUIProps> = ({ propertyId, onDelete, alertTitle, alertDesc }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        
          <Trash2 className="text-red-500/40 hover:scale-110 hover:text-red-500/100 ease-in-out duration-500 w-8 h-8 cursor-pointer " />
        
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
          <AlertDialogDescription>{alertDesc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className="font-bold"  onClick={() => onDelete(propertyId)}>
              Supprimer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePropertyUI;
