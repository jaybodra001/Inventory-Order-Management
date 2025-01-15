import { useState, useEffect } from "react";
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
  Divider,
} from "@mui/material";
import {
  Warning,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  TrendingDown,
} from "@mui/icons-material";
import { inventoryApi, supplierApi } from "../services/api";
import LoadingSpinner from "../components/shared/LoadingSpinner";

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
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <InventoryIcon
                  sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Items
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalItems}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Warning sx={{ fontSize: 40, color: "error.main", mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.lowStockItems.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon
                  sx={{ fontSize: 40, color: "success.main", mr: 2 }}
                />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Suppliers
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalSuppliers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Low Stock Alerts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {stats.lowStockItems.map((item) => (
                <ListItem key={item._id} sx={{ paddingLeft: 0 }}>
                  <ListItemIcon>
                    <TrendingDown color="error" sx={{ fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity} (Threshold: ${item.lowStockThreshold})`}
                    sx={{ color: "text.primary" }}
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
