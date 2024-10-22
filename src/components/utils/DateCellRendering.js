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
