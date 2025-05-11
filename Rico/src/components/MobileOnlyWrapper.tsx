import { useEffect, useState } from 'react';
import '../styles/css/MobileOnlyWrapper.css'

function MobileOnlyWrapper({ children }: React.PropsWithChildren<{}>) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) {
    return (
      <div className="not-mobile-message">
        האפליקציה זמינה לצפייה רק בטלפון נייד<br />
        אנא עבור למכשיר נייד כדי להמשיך
      </div>
    );
  }

  return children;
}

export default MobileOnlyWrapper;
