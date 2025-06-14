import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface AddMemberDialogSimpleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMemberDialogSimple({ open, onOpenChange }: AddMemberDialogSimpleProps) {
  console.log("Simple dialog rendered with open:", open);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            This is a test dialog to verify the dialog functionality works.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            alert("Dialog is working!");
            onOpenChange(false);
          }}>
            Test Button
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}