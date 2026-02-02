
const STATUS_TEXT = {
  expired: {
    text: 'Expired',
    className: 'expired'
  },
  expiring: {
    text: 'Expiring soon',
    className: 'expiring'
  },
  fresh: {
    text: 'Fresh',
    className: 'fresh'
  }
};

export default function FoodStatus({expiryDate}) {
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

    const status = getFoodStatus(expiryDate);
     const { text, className } = STATUS_TEXT[status];

    return (
        <div style={{display: 'flex', textAlign: 'center', justifyContent: 'center'}}>
            <p className={`label ${className}`}>
                {text}
            </p>
        </div>
    );
}
