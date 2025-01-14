import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

function InventoryForm({ open, onClose, onSubmit, initialData, suppliers }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: '',
    supplier: '',
    lowStockThreshold: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        quantity: initialData.quantity || '',
        category: initialData.category || '',
        supplier: initialData.supplier?._id || '',
        lowStockThreshold: initialData.lowStockThreshold || '',
      });
    } else {
      setFormData({
        name: '',
        quantity: '',
        category: '',
        supplier: '',
        lowStockThreshold: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Food',
    'Beverages',
    'Furniture',
    'Office Supplies',
    'Other'
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        {initialData ? 'Edit Item' : 'Add New Item'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Item Name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                required
                value={formData.quantity}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="lowStockThreshold"
                label="Low Stock Threshold"
                type="number"
                fullWidth
                required
                value={formData.lowStockThreshold}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Category"
                select
                fullWidth
                required
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="supplier"
                label="Supplier"
                select
                fullWidth
                required
                value={formData.supplier}
                onChange={handleChange}
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{ borderRadius: 1 }}
          >
            {initialData ? 'Update' : 'Add'} Item
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default InventoryForm; 