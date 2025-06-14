import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Member } from "../../types/member";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember?: (member: Partial<Member>) => void;
}

const membershipTiers = [
  { value: "pharmacy", label: "Pharmacy Membership", price: 435 },
  { value: "staff_pharmacist", label: "Staff Pharmacist", price: 235 },
  { value: "sustaining", label: "Sustaining Member", price: 435 },
  { value: "retired", label: "Retired Pharmacist", price: 135 },
  { value: "student", label: "Student Member", price: 35 },
  { value: "ltc_division", label: "LTC Division", price: 235 },
  { value: "corporate", label: "Corporate", price: 0 },
];

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function AddMemberDialog({ open, onOpenChange, onAddMember }: AddMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Debug logging
  console.log("AddMemberDialog rendered with open:", open);
  
  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    businessPhone: "",
    personalPhone: "",
    membershipTier: "",
    businessAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    homeAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.businessName || !formData.contactName || !formData.email || !formData.membershipTier) {
      alert("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Get membership price
    const selectedTier = membershipTiers.find(tier => tier.value === formData.membershipTier);
    const membershipPrice = selectedTier?.price || 0;

    // Create new member object
    const newMember: Partial<Member> = {
      businessName: formData.businessName,
      contactName: formData.contactName,
      email: formData.email,
      businessPhone: formData.businessPhone,
      personalPhone: formData.personalPhone,
      membershipTier: formData.membershipTier as Member['membershipTier'],
      membershipPrice,
      businessAddress: formData.businessAddress,
      homeAddress: formData.homeAddress,
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
    };

    // Simulate API call
    setTimeout(() => {
      if (onAddMember) {
        onAddMember(newMember);
      }
      alert("Member added successfully!");
      setIsSubmitting(false);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        businessName: "",
        contactName: "",
        email: "",
        businessPhone: "",
        personalPhone: "",
        membershipTier: "",
        businessAddress: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
        homeAddress: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Enter the member's information below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Simplified form with just required fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="Enter business name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange("contactName", e.target.value)}
                placeholder="Enter contact name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipTier">Membership Tier *</Label>
              <Select
                value={formData.membershipTier}
                onValueChange={(value) => handleInputChange("membershipTier", value)}
                required
              >
                <SelectTrigger id="membershipTier">
                  <SelectValue placeholder="Select membership tier" />
                </SelectTrigger>
                <SelectContent>
                  {membershipTiers.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      {tier.label} {tier.price > 0 && `($${tier.price})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding Member..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}