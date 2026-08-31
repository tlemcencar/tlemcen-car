import React, { useEffect } from 'react';

interface GoogleReviewsWidgetProps {
  className?: string;
}

export const GoogleReviewsWidget: React.FC<GoogleReviewsWidgetProps> = ({ className = '' }) => {
  useEffect(() => {
    // If Elfsight platform script is loaded or needs trigger on SPA navigation
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div
        className="elfsight-app-97980cfd-d885-4cda-980c-fb0e11a6aaa9"
        data-elfsight-app-lazy
      />
    </div>
  );
};
