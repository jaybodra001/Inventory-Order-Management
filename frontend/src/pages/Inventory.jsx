import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import InventoryList from '../components/inventory/InventoryList';
import InventoryForm from '../components/inventory/InventoryForm';
import { inventoryApi, supplierApi } from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import CsvOperations from '../components/inventory/CsvOperations';

function Inventory() {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, suppliersRes] = await Promise.all([
        inventoryApi.getAll(),
        supplierApi.getAll()
      ]);
      setItems(inventoryRes.data);
      setSuppliers(suppliersRes.data);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      let updatedItem;
      if (selectedItem) {
        const response = await inventoryApi.update(selectedItem._id, formData);
        updatedItem = response.data;
        setItems(prevItems => 
          prevItems.map(item => 
            item._id === selectedItem._id ? updatedItem : item
          )
        );
        toast.success('Item updated successfully');
      } else {
        const response = await inventoryApi.create(formData);
        updatedItem = response.data;
        setItems(prevItems => [...prevItems, updatedItem]);
        toast.success('Item added successfully');
      }
      setOpenForm(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving item');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    try {
      await inventoryApi.delete(deleteDialog.id);
      setItems(prevItems => 
        prevItems.filter(item => item._id !== deleteDialog.id)
      );
      toast.success('Item deleted successfully');
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      toast.error('Error deleting item');
    }
  };  

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Inventory Management
          </Typography>
          <Box display="flex" gap={2}>
            <CsvOperations onImportSuccess={loadData} />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
              sx={{ borderRadius: 2, padding: '8px 16px' }}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        {/* Inventory List Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <InventoryList
                  items={items}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteDialog({ open: true, id })}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Inventory Form Dialog */}
        <InventoryForm
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setSelectedItem(null);
          }}
          onSubmit={handleSubmit}
          initialData={selectedItem}
          suppliers={suppliers}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null })}
          onConfirm={handleDelete}
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
        />
      </Paper>
    </Container>
  );
}

export default Inventory;
