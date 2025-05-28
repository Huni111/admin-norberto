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
  Grid,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import data from "../data.json";

const Clienti = () => {
  const [clients, setClients] = useState([]);
  const [comenzi, setComenzi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  // Form state for edit/add
  const [formData, setFormData] = useState({
    id: '',
    nume_companie: '',
    persoana_contact: '',
    email: '',
    telefon: '',
    adresa: ''
  });

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch data on component mount
  useEffect(() => {
    // In a real application, this would be fetched from an API
    setClients(data.clienti || []);
    setComenzi(data.comenzi || []);
    setLoading(false);
  }, []);

  // Apply filters whenever the filter state changes
  useEffect(() => {
    let filtered = [...clients];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.nume_companie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.persoana_contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredClients(filtered);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, clients]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    setDetailsDialogOpen(true);
  };

  const handleEditClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setFormData({...client});
    setEditDialogOpen(true);
  };

  const handleAddClient = () => {
    setFormData({
      id: `c${clients.length + 1}`, // Simple ID generation (in a real app would be handled by backend)
      nume_companie: '',
      persoana_contact: '',
      email: '',
      telefon: '',
      adresa: ''
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Remove the client from the list
    const updatedClients = clients.filter(c => c.id !== clientToDelete.id);
    setClients(updatedClients);
    
    // Show notification
    setNotification({
      open: true,
      message: `Clientul ${clientToDelete.nume_companie} a fost șters cu succes`,
      severity: 'success'
    });
    
    // Close the dialog
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedClient(null);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveClient = () => {
    // Validate form
    if (!formData.nume_companie || !formData.email || !formData.telefon) {
      setNotification({
        open: true,
        message: 'Completați toate câmpurile obligatorii',
        severity: 'error'
      });
      return;
    }

    // Check if it's a new client or editing existing
    const isNewClient = !clients.some(client => client.id === formData.id);
    
    if (isNewClient) {
      // Add new client
      setClients([...clients, formData]);
      setNotification({
        open: true,
        message: `Clientul ${formData.nume_companie} a fost adăugat cu succes`,
        severity: 'success'
      });
    } else {
      // Update existing client
      const updatedClients = clients.map(client => 
        client.id === formData.id ? formData : client
      );
      setClients(updatedClients);
      setNotification({
        open: true,
        message: `Clientul ${formData.nume_companie} a fost actualizat cu succes`,
        severity: 'success'
      });
    }
    
    // Close the dialog
    setEditDialogOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({...notification, open: false});
  };

  // Get client orders
  const getClientOrders = (clientId) => {
    return comenzi.filter(comanda => comanda.id_client === clientId);
  };

  // Calculate the slice of data to display based on pagination
  const displayedClients = filteredClients
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestionare Clienți
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={handleAddClient}
        >
          Client Nou
        </Button>
      </Box>
      
      {/* Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Caută client"
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
          <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            {searchTerm && (
              <Button 
                variant="outlined"
                onClick={clearSearch}
                sx={{ mr: 1 }}
              >
                Resetează căutarea
              </Button>
            )}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                {filteredClients.length} clienți găsiți
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Se încarcă clienții...</Typography>
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Companie</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Persoană Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Telefon</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Acțiuni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedClients.length > 0 ? (
                  displayedClients.map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 2, 
                              bgcolor: 'primary.main',
                              width: 36,
                              height: 36
                            }}
                          >
                            {getInitials(client.nume_companie)}
                          </Avatar>
                          {client.nume_companie}
                        </Box>
                      </TableCell>
                      <TableCell>{client.persoana_contact}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.telefon}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="Vezi detalii">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleViewClient(client.id)}
                              aria-label="view details"
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editează">
                            <IconButton 
                              color="secondary" 
                              onClick={() => handleEditClient(client.id)}
                              aria-label="edit client"
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Șterge">
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteClick(client)}
                              aria-label="delete client"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        Nu s-au găsit clienți care să corespundă criteriilor de căutare
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
            count={filteredClients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rânduri pe pagină:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} din ${count}`}
          />
        </Paper>
      )}

      {/* Client Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedClient && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {selectedClient.nume_companie}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                        Informații de Contact
                      </Typography>

                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Persoană de Contact" 
                            secondary={selectedClient.persoana_contact} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Email" 
                            secondary={selectedClient.email} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PhoneIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Telefon" 
                            secondary={selectedClient.telefon} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LocationIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Adresă" 
                            secondary={selectedClient.adresa} 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Istoric Comenzi
                      </Typography>
                      
                      {(() => {
                        const clientOrders = getClientOrders(selectedClient.id);
                        
                        if (clientOrders.length === 0) {
                          return (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70%' }}>
                              <Typography color="text.secondary">
                                Acest client nu are comenzi înregistrate
                              </Typography>
                            </Box>
                          );
                        }
                        
                        return (
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                  <TableCell>ID</TableCell>
                                  <TableCell>Data</TableCell>
                                  <TableCell align="right">Total</TableCell>
                                  <TableCell>Status</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {clientOrders.map(order => (
                                  <TableRow key={order.id} hover>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.data}</TableCell>
                                    <TableCell align="right">{order.total.toFixed(2)} Lei</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDetails} 
                color="primary"
              >
                Închide
              </Button>
              <Button 
                onClick={() => {
                  handleCloseDetails();
                  handleEditClient(selectedClient.id);
                }} 
                color="secondary"
                variant="contained"
                startIcon={<EditIcon />}
              >
                Editează Client
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit/Add Client Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {clients.some(client => client.id === formData.id) ? 'Editează Client' : 'Adaugă Client Nou'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nume_companie"
              label="Nume Companie"
              name="nume_companie"
              value={formData.nume_companie}
              onChange={handleInputChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="persoana_contact"
              label="Persoană de Contact"
              name="persoana_contact"
              value={formData.persoana_contact}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="telefon"
              label="Telefon"
              name="telefon"
              value={formData.telefon}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="adresa"
              label="Adresă"
              name="adresa"
              multiline
              rows={3}
              value={formData.adresa}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseEdit} 
            startIcon={<CancelIcon />}
          >
            Anulează
          </Button>
          <Button 
            onClick={handleSaveClient} 
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Salvează
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Confirmare Ștergere
        </DialogTitle>
        <DialogContent>
          <Typography>
            Sunteți sigur că doriți să ștergeți clientul <strong>{clientToDelete?.nume_companie}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Această acțiune nu poate fi anulată.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Anulează
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Șterge
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Clienti;