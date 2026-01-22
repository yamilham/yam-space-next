"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FaInfo,
  FaRotate,
  FaArrowRightArrowLeft,
  FaMagnifyingGlassMinus,
  FaMagnifyingGlassPlus,
  FaHandPointer,
} from "react-icons/fa6";

export default function InformationButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute z-50 top-6 right-6 hover:focus">
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        size="icon"
        aria-label="Information"
        className="cursor-pointer"
      >
        <FaInfo className="w-12 h-12" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Scene Controls</DialogTitle>
            <DialogDescription>
              Learn how to navigate and interact with the space scene
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="view" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="view" className="cursor-pointer">View Controls</TabsTrigger>
              <TabsTrigger value="interaction" className="cursor-pointer">Interaction</TabsTrigger>
            </TabsList>
            <TabsContent value="view" className="space-y-3 py-4">
              <div className="flex items-center justify-between py-2 gap-4 mx-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    <FaRotate />
                  </span>
                  <span className="font-medium">Rotate View</span>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Left Click
                  </kbd>{" "}
                  + Drag
                </div>
              </div>
              <div className="flex items-center justify-between py-2 gap-4 mx-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    <FaArrowRightArrowLeft />
                  </span>
                  <span className="font-medium">Pan View</span>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Shift
                  </kbd>{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Left Click
                  </kbd>{" "}
                  + Drag
                </div>
              </div>
              <div className="flex items-center justify-between py-2 gap-4 mx-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    <FaMagnifyingGlassPlus />
                  </span>
                  <span className="font-medium">Zoom In</span>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Scroll Up
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 gap-4 mx-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    <FaMagnifyingGlassMinus />
                  </span>
                  <span className="font-medium">Zoom Out</span>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Scroll Down
                  </kbd>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="interaction" className="space-y-3 py-4">
              <div className="flex items-center justify-between py-2 gap-4 mx-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    <FaHandPointer />
                  </span>
                  <span className="font-medium">Select Object</span>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  Hover over object:{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Click
                  </kbd>
                </div>
              </div>
              <div className="flex justify-center text-xs text-gray-400 pt-4">
                Hint: Only a few object you can interact with.
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
