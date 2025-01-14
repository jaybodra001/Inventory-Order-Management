import { Chip } from '@mui/material';
import { Warning, CheckCircle, Error } from '@mui/icons-material';

function StockIndicator({ quantity, threshold }) {
  if (quantity <= 0) {
    return (
      <Chip
        icon={<Error />}
        label="Out of Stock"
        color="error"
        size="small"
      />
    );
  }

  if (quantity <= threshold) {
    return (
      <Chip
        icon={<Warning />}
        label="Low Stock"
        color="warning"
        size="small"
      />
    );
  }

  return (
    <Chip
      icon={<CheckCircle />}
      label="In Stock"
      color="success"
      size="small"
    />
  );
}

export default StockIndicator; 