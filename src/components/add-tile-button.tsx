"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { addTile } from "../lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InputWithSuggestions } from "./ui/input-with-suggestions";

export function AddTileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isMobile = useIsMobile();
  const router = useRouter();

  const [formData, setFormData] = useState({
    company: "",
    model: "",
    grade: "None",
    size: "",
    quantity: 0,
    price: 0,
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      company: "",
      model: "",
      grade: "None",
      size: "",
      quantity: 0,
      price: 0,
      notes: "",
    });
  };

  const handleAdd = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addTile(formData);
      if (result.success) {
        toast.success("Success", {
          description: result.message,
        });
        resetForm();
        setIsOpen(false);
        router.refresh(); // Refresh the page to show updated data
      } else {
        toast.error("Error", {
          description: result.message,
        });
      }
    });
  };

  const TileForm = () => (
    <form action={handleAdd} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="company">Company Name *</Label>
        <InputWithSuggestions
          id="company"
          name="company"
          defaultValue={formData.company}
          placeholder="Enter company name"
          suggestions={[
            "AB",
            "AKIJ",
            "ATI",
            "AURA",
            "BHL",
            "CBC",
            "CHARU",
            "CHINA",
            "DSC",
            "FONDE",
            "FONDY",
            "FR",
            "GORDA",
            "KCL",
            "KH",
            "LOCAL",
            "MARBEL",
            "MO",
            "RAK",
            "SL",
            "X",
          ]}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="model">Model Number</Label>
        <Input
          id="model"
          name="model"
          defaultValue={formData.model}
          placeholder="Enter model number"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="grade">Grade</Label>
          <Select name="grade" defaultValue={formData.grade}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="size">Size</Label>
          <Input
            id="size"
            name="size"
            defaultValue={formData.size}
            placeholder="e.g., 12x12, 24x24"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            defaultValue={formData.quantity}
            placeholder="0"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={formData.price}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={formData.notes}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Add Tile
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button onClick={resetForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tile
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Add New Tile</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <TileForm />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Tile</DialogTitle>
        </DialogHeader>
        <TileForm />
      </DialogContent>
    </Dialog>
  );
}
