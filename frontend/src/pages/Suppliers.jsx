import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Breadcrumbs,
  Link,
  Stack,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SupplierList from '../components/supplier/SupplierList';
import SupplierForm from '../components/supplier/SupplierForm';
import { supplierApi } from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ConfirmDialog from '../components/shared/ConfirmDialog';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await supplierApi.getAll();
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Error loading suppliers', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { backgroundColor: '#fff' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedSupplier) {
        await supplierApi.update(selectedSupplier._id, formData);
        toast.success('Supplier updated successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { backgroundColor: '#fff' }
        });
      } else {
        await supplierApi.create(formData);
        toast.success('Supplier added successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { backgroundColor: '#fff' }
        });
      }
      loadSuppliers();
      setOpenForm(false);
      setSelectedSupplier(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving supplier', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { backgroundColor: '#fff' }
      });
    }
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    try {
      await supplierApi.delete(deleteDialog.id);
      toast.success('Supplier deleted successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { backgroundColor: '#fff' }
      });
      loadSuppliers();
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      toast.error('Error deleting supplier', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { backgroundColor: '#fff' }
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/">
              Dashboard
            </Link>
            <Typography color="text.primary">Suppliers</Typography>
          </Breadcrumbs>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
          >
            <Typography variant="h5" component="h1">
              Supplier Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
              sx={{ borderRadius: 2 }}
            >
              Add Supplier
            </Button>
          </Box>
        </Box>

        {suppliers.length === 0 ? (
          <Alert severity="info">
            No suppliers found. Add your first supplier to get started.
          </Alert>
        ) : (
          <SupplierList
            suppliers={suppliers}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteDialog({ open: true, id })}
          />
        )}

        <SupplierForm
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setSelectedSupplier(null);
          }}
          onSubmit={handleSubmit}
          initialData={selectedSupplier}
        />

        <ConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null })}
          onConfirm={handleDelete}
          title="Delete Supplier"
          message="Are you sure you want to delete this supplier? This action cannot be undone."
        />
      </Stack>
    </Container>
  );
}

export default Suppliers; 