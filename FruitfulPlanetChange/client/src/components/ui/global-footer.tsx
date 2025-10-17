import { useLocation } from "wouter";

interface GlobalFooterProps {
  className?: string;
}

export function GlobalFooter({ className = "" }: GlobalFooterProps) {
  const currentYear = new Date().getFullYear();
  const [, setLocation] = useLocation();

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  return (
    <footer className={`bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-8 px-4 text-sm border-t border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Links */}
        <div className="footer-links flex flex-wrap justify-center mb-6 gap-x-4 gap-y-2">
          <button 
            onClick={() => handleNavigation("/")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Fruitful Global™
          </button>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <a 
            href="https://www.banimal.co.za" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors whitespace-nowrap"
          >
            Banimal Giving Loop
          </a>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <button 
            onClick={() => handleNavigation("/secure-sign")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            SecureSign™ VIP
          </button>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <button 
            onClick={() => handleNavigation("/vaultmesh-dashboard")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            VaultMesh™
          </button>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <button 
            onClick={() => handleNavigation("/fruitful-smart-toys")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Smart Toys™
          </button>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <button 
            onClick={() => handleNavigation("/omnigrid-faa-zone")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            OmniGrid™ FAA.zone™
          </button>
        </div>

        {/* Secondary Links */}
        <div className="footer-links flex flex-wrap justify-center mb-6 gap-x-4 gap-y-2 text-xs">
          <button 
            onClick={() => handleNavigation("/legal-hub")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
          >
            Legal
          </button>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <button 
            onClick={() => handleNavigation("/privacy")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <button 
            onClick={() => handleNavigation("/terms")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
          >
            Terms
          </button>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <button 
            onClick={() => handleNavigation("/api-keys")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
          >
            API Keys
          </button>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <button 
            onClick={() => handleNavigation("/integrations")}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
          >
            Integrations
          </button>
        </div>

        {/* Special Notice for Banimal */}
        <div className="text-center mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-200 text-sm font-medium">
            🐾 <strong>Banimal Giving Loop</strong> - WordPress finalization in progress at{" "}
            <a 
              href="https://www.banimal.co.za" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              www.banimal.co.za
            </a>
          </p>
          <p className="text-green-700 dark:text-green-300 text-xs mt-1">
            Supporting animal welfare through innovative giving solutions
          </p>
        </div>

        {/* Copyright and Final Info */}
        <div className="text-center text-xs">
          <div className="mb-2">
            <span className="font-medium">Fruitful Global™</span> • 
            <span className="mx-1">Powered by VaultMesh™, Seedwave™ & OmniGrid™</span>
          </div>
          <div className="text-gray-500 dark:text-gray-500">
            © {currentYear} Fruitful Holdings. All rights reserved. | 
            <span className="mx-1">6,005+ Brand Ecosystem</span> | 
            <span className="mx-1">FAA.zone™ Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}