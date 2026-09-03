import { useEffect, useState } from "react";

function InstallPWA() {
  const [installPrompt, setInstallPrompt] =
    useState(null);

  const [installed, setInstalled] =
    useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (
      event
    ) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    installPrompt.prompt();

    await installPrompt.userChoice;

    setInstallPrompt(null);
  };

  if (installed) {
    return (
      <div className="install-message">
        EZTechMovie is installed.
      </div>
    );
  }

  if (!installPrompt) {
    return null;
  }

  return (
    <button
      className="install-button"
      onClick={handleInstall}
    >
      Install EZTechMovie
    </button>
  );
}

export default InstallPWA;