import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
} from '@mui/material';
import { Upload, Download } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { inventoryApi } from '../../services/api';

function CsvOperations({ onImportSuccess }) {
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleExport = async () => {
    try {
      const response = await inventoryApi.exportCsv();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error('Error exporting data');
      console.error('Export error:', error);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      return;
    }

    setImporting(true);
    setImportError(null);
    setOpenDialog(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      await inventoryApi.importCsv(formData);
      toast.success('Data imported successfully');
      if (onImportSuccess) onImportSuccess();
      setOpenDialog(false);
    } catch (error) {
      setImportError(error.response?.data?.message || 'Error importing data');
      toast.error('Error importing data');
    } finally {
      setImporting(false);
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          sx={{ borderRadius: 1 }}
        >
          Export CSV
        </Button>
        <Button
          variant="outlined"
          component="label"
          startIcon={<Upload />}
          sx={{ borderRadius: 1 }}
        >
          Import CSV
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={handleImport}
          />
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => !importing && setOpenDialog(false)}>
        <DialogTitle>Importing Data</DialogTitle>
        <DialogContent>
          {importing && (
            <Box sx={{ width: '100%', my: 2 }}>
              <LinearProgress />
            </Box>
          )}
          {importError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {importError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={importing}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CsvOperations; 