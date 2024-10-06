const currentDate = new Date();
const warningThreshold = new Date(); // Create a new date object for 30-day warning
warningThreshold.setDate(currentDate.getDate() + 30); // Add 30 days to the current date

export const renderExpiryDateCell = (row) => {
  if (row.expiryDate) {
    const expiryDate = new Date(row.expiryDate.seconds * 1000); // Convert seconds to milliseconds
    const isOverdue = expiryDate <= currentDate;
    const isWarning =
      expiryDate > currentDate && expiryDate <= warningThreshold;

    let className = '';
    if (isOverdue) {
      className = 'overdue';
    } else if (isWarning) {
      className = 'overdue-warning';
    }

    return (
      <div className={className}>
        {new Intl.DateTimeFormat('en-GB').format(expiryDate)}
      </div>
    );
  }
  return null;
};

export const renderServiceDateCell = (row) => {
  if (row.expiryDate) {
    const serviceDate = new Date(row.expiryDate.seconds * 1000); // Convert seconds to milliseconds
    const expiryDate = new Date(serviceDate); // Create a new date for the expiry date
    expiryDate.setFullYear(serviceDate.getFullYear() + 1); // Set the expiry date to one year later

    const warningThreshold = new Date(expiryDate);
    warningThreshold.setDate(expiryDate.getDate() - 30); // Subtract 30 days to the expiry date for the warning check

    let className = '';
    if (expiryDate < currentDate) {
      // conditionally apply classes to cell
      className = 'overdue';
    } else if (warningThreshold < currentDate) {
      className = 'overdue-warning';
    }

    return (
      <div className={className}>
        {new Intl.DateTimeFormat('en-GB').format(serviceDate)}
      </div>
    );
  }
  return null;
};
