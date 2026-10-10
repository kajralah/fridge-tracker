import { useIsMobileView } from "./helpers/useIsMobileView";

export default function FoodStatus({expiryDate}) {
  const isMobile = useIsMobileView();

    const status = getFoodStatus(expiryDate);
    const { text, className } = getStatusText(status, isMobile);

    return (
        <div style={{display: 'flex', textAlign: 'center', justifyContent: 'center'}}>
            <p className={`label ${className}`}>
                {text}
            </p>
        </div>
    );
}

function getFoodStatus(expiryDate, soonDays = 3) {
    const normalize = (d) => {
          const date = new Date(d);
          date.setHours(0, 0, 0, 0);
          return date;
      };

      const today = normalize(new Date());
      const expiry = normalize(expiryDate);

      const soonLimit = new Date(today);
      soonLimit.setDate(today.getDate() + soonDays);

      if (expiry < today) return 'expired';
      if (expiry <= soonLimit) return 'expiring';
      return 'fresh';
  }
  
function getStatusText(status, isMobile) {
  const STATUS_TEXT = {
    expired: {
      text: isMobile ? 'Ex' : 'Expired',
      className: 'expired'
    },
    expiring: {
      text: isMobile ? 'E' : 'Expiring soon',
      className: 'expiring'
    },
    fresh: {
      text: isMobile? 'F' : 'Fresh',
      className: 'fresh'
    }
  };

  return STATUS_TEXT[status];
}