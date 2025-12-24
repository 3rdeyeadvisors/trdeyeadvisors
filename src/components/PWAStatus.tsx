import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { Download, RefreshCw, WifiOff } from 'lucide-react';
import { OfflineIndicator } from './OfflineIndicator';

export const PWAStatus = () => {
  const { isOnline, isUpdateAvailable, isInstallable, isInstalled, promptInstall, updateApp } = usePWA();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {/* Only show offline controls when actually offline */}
      {!isOnline && <OfflineIndicator />}

      {/* Update available */}
      {isUpdateAvailable && (
        <Button
          onClick={updateApp}
          size="sm"
          className="gap-2 shadow-lg animate-in slide-in-from-bottom-2"
        >
          <RefreshCw className="w-4 h-4" />
          Update Available
        </Button>
      )}

      {/* Install prompt */}
      {isInstallable && !isInstalled && (
        <Button
          onClick={promptInstall}
          variant="secondary"
          size="sm"
          className="gap-2 shadow-lg animate-in slide-in-from-bottom-2"
        >
          <Download className="w-4 h-4" />
          Install App
        </Button>
      )}
    </div>
  );
};

export const OfflineBanner = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 py-2 px-4 text-center text-sm font-medium">
      <WifiOff className="w-4 h-4 inline-block mr-2" />
      You're offline. Some features may be limited.
    </div>
  );
};
