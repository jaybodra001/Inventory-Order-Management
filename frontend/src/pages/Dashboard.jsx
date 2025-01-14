import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Warning,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  TrendingDown,
} from '@mui/icons-material';
import { inventoryApi, supplierApi } from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: [],
    totalSuppliers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [inventory, suppliers] = await Promise.all([
        inventoryApi.getAll(),
        supplierApi.getAll(),
      ]);

      const lowStockItems = inventory.data.filter(
        (item) => item.quantity <= item.lowStockThreshold
      );

      setStats({
        totalItems: inventory.data.length,
        lowStockItems,
        totalSuppliers: suppliers.data.length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Items
                  </Typography>
                  <Typography variant="h4">{stats.totalItems}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Warning sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4">{stats.lowStockItems.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Suppliers
                  </Typography>
                  <Typography variant="h4">{stats.totalSuppliers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alerts
            </Typography>
            <List>
              {stats.lowStockItems.map((item) => (
                <ListItem key={item._id}>
                  <ListItemIcon>
                    <TrendingDown color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity} (Threshold: ${item.lowStockThreshold})`}
                  />
                </ListItem>
              ))}
              {stats.lowStockItems.length === 0 && (
                <ListItem>
                  <ListItemText primary="No items are currently low in stock" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 