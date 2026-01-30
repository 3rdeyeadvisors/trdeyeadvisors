import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, X } from "lucide-react";

function ReloadPrompt() {
  const swResult = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // Handle case where useRegisterSW might return undefined or incomplete in some environments
  if (!swResult || !Array.isArray(swResult.offlineReady) || !Array.isArray(swResult.needUpdate)) {
    return null;
  }

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needUpdate: [needUpdate, setNeedUpdate],
    updateServiceWorker,
  } = swResult;

  const close = () => {
    setOfflineReady(false);
    setNeedUpdate(false);
  };

  React.useEffect(() => {
    if (offlineReady) {
      toast.success("App ready to work offline", {
        action: {
          label: "Close",
          onClick: () => close(),
        },
      });
    }
  }, [offlineReady]);

  React.useEffect(() => {
    if (needUpdate) {
      toast("New content available, click on reload button to update.", {
        duration: Infinity,
        action: {
          label: "Reload",
          onClick: () => updateServiceWorker(true),
        },
        cancel: {
          label: "Close",
          onClick: () => close(),
        }
      });
    }
  }, [needUpdate]);

  if (!offlineReady && !needUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] p-3 rounded-lg bg-card border border-border shadow-cosmic animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col gap-3">
        <div className="text-sm font-consciousness">
          {offlineReady ? (
            <span>App ready to work offline</span>
          ) : (
            <span>New content available, click on reload button to update.</span>
          )}
        </div>
        <div className="flex gap-2">
          {needUpdate && (
            <Button
              size="sm"
              onClick={() => updateServiceWorker(true)}
              className="font-consciousness gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => close()}
            className="font-consciousness gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReloadPrompt;
