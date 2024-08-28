import React from 'react';

interface CustomCellProps {
  value: any;
  column: any; // Adjust type based on your needs
}

const CustomCell: React.FC<CustomCellProps> = ({ value }) => {
  // Example custom rendering logic: highlight values based on a condition
  const highlightStyle = value > 50 ? { backgroundColor: 'lightgreen' } : {};

  return (
    <div style={{ ...highlightStyle, padding: '8px' }}>
      {value}
    </div>
  );
};

export default CustomCell;
