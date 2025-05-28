import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from "@mui/material";
import { 
  KeyboardReturn as ReturnIcon,
  Visibility as ViewIcon,
  Event as DateIcon,
  Business as CompanyIcon,
  ShoppingCart as OrderIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from "@mui/icons-material";
import data from "../data.json";

const Comenzi = () => {
  const [comenzi, setComenzi] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [produse, setProduse] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredComenzi, setFilteredComenzi] = useState([]);

  useEffect(() => {
    // In a real application, this would be fetched from an API
    // For now, we're using the data.json file
    setComenzi(data.comenzi || []);
    setClienti(data.clienti || []);
    setProduse(data.produse || []);
    setLoading(false);
  }, []);

  // Apply filters whenever the filter state changes
  useEffect(() => {
    let filtered = [...comenzi];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(comanda => {
        const client = clienti.find(c => c.id === comanda.id_client);
        const clientName = client ? client.nume_companie.toLowerCase() : '';
        
        return comanda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
               clientName.includes(searchTerm.toLowerCase());
      });
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(comanda => comanda.status === statusFilter);
    }
    
    setFilteredComenzi(filtered);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, statusFilter, comenzi, clienti]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOrderClick = (orderId) => {
    const order = comenzi.find(comanda => comanda.id === orderId);
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const getClientName = (clientId) => {
    const client = clienti.find(client => client.id === clientId);
    return client ? client.nume_companie : "Client necunoscut";
  };

  const getClientDetails = (clientId) => {
    return clienti.find(client => client.id === clientId);
  };

  const getProductDetails = (productId) => {
    return produse.find(produs => produs.id === productId) || { 
      nume: "Produs necunoscut", 
      pret: 0 
    };
  };

  const calculateVAT = (amount) => {
    return amount * 0.19; // 19% TVA (VAT)
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Livrată':
        return 'success';
      case 'În procesare':
        return 'warning';
      case 'Expediată':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get unique status values for filter dropdown
  const getUniqueStatuses = () => {
    const statuses = comenzi.map(comanda => comanda.status);
    return [...new Set(statuses)];
  };

  // Calculate the slice of data to display based on pagination
  const displayedOrders = filteredComenzi
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestionare Comenzi
        </Typography>
      </Box>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Caută după ID sau client"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Filtrare după status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Filtrare după status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">
                  <em>Toate</em>
                </MenuItem>
                {getUniqueStatuses().map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            {(searchTerm || statusFilter) && (
              <Button 
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={clearFilters}
                sx={{ mr: 1 }}
              >
                Resetează filtre
              </Button>
            )}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                {filteredComenzi.length} comenzi găsite
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Se încarcă comenzile...</Typography>
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID Comandă</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Total (RON)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Acțiuni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedOrders.length > 0 ? (
                  displayedOrders.map((comanda) => (
                    <TableRow key={comanda.id} hover>
                      <TableCell>{comanda.id}</TableCell>
                      <TableCell>{getClientName(comanda.id_client)}</TableCell>
                      <TableCell>{comanda.data}</TableCell>
                      <TableCell>{comanda.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={comanda.status} 
                          color={getStatusColor(comanda.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOrderClick(comanda.id)}
                          aria-label="view details"
                          size="small"
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        Nu s-au găsit comenzi care să corespundă criteriilor de căutare
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredComenzi.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rânduri pe pagină:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} din ${count}`}
          />
        </Paper>
      )}

      {/* Order Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Detalii Comandă: {selectedOrder.id}
                </Typography>
                <Chip 
                  label={selectedOrder.status} 
                  color={getStatusColor(selectedOrder.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                {/* Client Information */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CompanyIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Informații Client</Typography>
                      </Box>
                      {(() => {
                        const client = getClientDetails(selectedOrder.id_client);
                        if (!client) return <Typography color="error">Client negăsit</Typography>;
                        
                        return (
                          <Box sx={{ pl: 1 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Companie:</strong> {client.nume_companie}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Persoană Contact:</strong> {client.persoana_contact}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Email:</strong> {client.email}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Telefon:</strong> {client.telefon}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Adresă:</strong> {client.adresa}
                            </Typography>
                          </Box>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Order Information */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <OrderIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Informații Comandă</Typography>
                      </Box>
                      <Box sx={{ pl: 1 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>ID Comandă:</strong> {selectedOrder.id}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <DateIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            <strong>Data Comandă:</strong> {selectedOrder.data}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Număr Produse:</strong> {selectedOrder.produse.reduce((acc, item) => acc + item.cantitate, 0)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Products */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Produse Comandate
                      </Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                              <TableCell><Typography variant="subtitle2" fontWeight="bold">Produs</Typography></TableCell>
                              <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold">Preț Unitar</Typography></TableCell>
                              <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold">Cantitate</Typography></TableCell>
                              <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold">Subtotal</Typography></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedOrder.produse.map((item) => {
                              const product = getProductDetails(item.id_produs);
                              const subtotal = product.pret * item.cantitate;
                              
                              return (
                                <TableRow key={item.id_produs}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      {product.imagine && (
                                        <Box 
                                          component="img" 
                                          src={product.imagine}
                                          alt={product.nume}
                                          sx={{ 
                                            width: 40, 
                                            height: 40, 
                                            objectFit: 'cover',
                                            marginRight: 2,
                                            borderRadius: 1
                                          }}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/40x40?text=No+Image";
                                          }}
                                        />
                                      )}
                                      {product.nume}
                                    </Box>
                                  </TableCell>
                                  <TableCell align="right">{product.pret.toFixed(2)}</TableCell>
                                  <TableCell align="right">{item.cantitate}</TableCell>
                                  <TableCell align="right">{subtotal.toFixed(2)}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box sx={{ mt: 3, backgroundColor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">Subtotal:</Typography>
                          <Typography variant="body1">{selectedOrder.total.toFixed(2)} Lei</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">TVA (19%):</Typography>
                          <Typography variant="body1">{calculateVAT(selectedOrder.total).toFixed(2)} Lei</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">Total cu TVA:</Typography>
                          <Typography variant="h6" color="primary">{(selectedOrder.total + calculateVAT(selectedOrder.total)).toFixed(2)} Lei</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDetails} 
                color="primary"
                startIcon={<ReturnIcon />}
                variant="contained"
              >
                Înapoi la Listă
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Comenzi;