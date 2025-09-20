import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useInteractivity() {
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const { toast } = useToast();

  const trigger = (actionName: string) => {
    // Set confirmation message for internal state tracking
    setConfirmationMessage(actionName);
    
    // Show visual feedback via toast notification
    toast({
      title: "✨ Action Triggered",
      description: actionName,
      duration: 3000,
    });

    // Clear message after a short delay
    setTimeout(() => {
      setConfirmationMessage("");
    }, 3000);
  };

  return {
    trigger,
    confirmationMessage,
  };
}