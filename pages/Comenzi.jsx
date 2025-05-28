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
  Divider
} from "@mui/material";
import { 
  KeyboardReturn as ReturnIcon,
  Visibility as ViewIcon,
  Event as DateIcon,
  Business as CompanyIcon,
  ShoppingCart as OrderIcon
} from "@mui/icons-material";
import data from "../data.json";

const Comenzi = () => {
  const [comenzi, setComenzi] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [produse, setProduse] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be fetched from an API
    // For now, we're using the data.json file
    setComenzi(data.comenzi || []);
    setClienti(data.clienti || []);
    setProduse(data.produse || []);
    setLoading(false);
  }, []);

  const handleOrderClick = (orderId) => {
    const order = comenzi.find(comanda => comanda.id === orderId);
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestionare Comenzi
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Se încarcă comenzile...</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">ID Comandă</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Client</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Data</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Total (RON)</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Status</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Acțiuni</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comenzi.map((comanda) => (
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
                    >
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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