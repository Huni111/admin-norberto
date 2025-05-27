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
  DialogContentText,
  TextField,
  Box,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Stack,
  Chip,
  Grid,
  Divider
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Add as AddIcon, 
  Delete as DeleteIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Clear as ClearIcon
} from "@mui/icons-material";

const Produse = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    nume: "",
    descriere: "",
    pret: 0,
    categorie: "",
    stoc: 0,
    laComanda: false,
    imagini: []
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // For this example, we'll use mock data
        const mockProducts = [
          {
            id: "p1",
            nume: "Cămașă casual pentru bărbați",
            descriere: "O cămașă confortabilă și stilată pentru bărbați.",
            pret: 129.99,
            categorie: "Cămăși",
            stoc: 120,
            laComanda: false,
            imagini: ["/imagini/camasa1.jpg", "/imagini/camasa2.jpg"]
          },
          {
            id: "p2",
            nume: "Blugi slim fit pentru bărbați",
            descriere: "Blugi slim fit la modă, perfecți pentru ieșiri casual.",
            pret: 199.99,
            categorie: "Pantaloni",
            stoc: 80,
            laComanda: false,
            imagini: ["/imagini/blugi1.jpg"]
          },
          {
            id: "p3",
            nume: "Geacă de piele pentru bărbați",
            descriere: "Geacă premium din piele pentru bărbați eleganți.",
            pret: 499.99,
            categorie: "Geci",
            stoc: 0,
            laComanda: true,
            imagini: ["/imagini/geaca1.jpg", "/imagini/geaca2.jpg", "/imagini/geaca3.jpg"]
          }
        ];
        
        setProducts(mockProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setIsAdding(false);
    setCurrentProduct(product);
    setFormData({
      nume: product.nume,
      descriere: product.descriere,
      pret: product.pret,
      categorie: product.categorie,
      stoc: product.stoc,
      laComanda: product.laComanda || false,
      imagini: product.imagini || []
    });
    setNewImageUrl("");
    setOpen(true);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setCurrentProduct(null);
    setFormData({
      nume: "",
      descriere: "",
      pret: 0,
      categorie: "",
      stoc: 0,
      laComanda: false,
      imagini: []
    });
    setNewImageUrl("");
    setOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Remove the product from the list
    const updatedProducts = products.filter(
      product => product.id !== productToDelete.id
    );
    
    setProducts(updatedProducts);
    
    // In a real application, you would send a delete request to the backend
    console.log("Deleting product:", productToDelete.id);
    
    // Close the dialog
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct(null);
    setIsAdding(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'pret' || name === 'stoc' ? parseFloat(value) : value
    });
  };

  const handleNewImageChange = (e) => {
    setNewImageUrl(e.target.value);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() !== "") {
      setFormData({
        ...formData,
        imagini: [...formData.imagini, newImageUrl.trim()]
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData({
      ...formData,
      imagini: formData.imagini.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSave = () => {
    if (isAdding) {
      // Create a new product
      const newProduct = {
        id: `p${Date.now()}`, // Generate a unique ID (in a real app, this would come from the backend)
        ...formData
      };
      
      setProducts([...products, newProduct]);
      
      // In a real application, you would save this to the backend
      console.log("Adding new product:", newProduct);
    } else {
      // Update the existing product
      const updatedProducts = products.map(product => 
        product.id === currentProduct.id 
          ? { ...product, ...formData } 
          : product
      );
      
      setProducts(updatedProducts);
      
      // In a real application, you would save this to the backend
      console.log("Updating product:", { id: currentProduct.id, ...formData });
    }
    
    // Close the dialog
    handleClose();
  };

  const renderImagePreviews = () => {
    if (formData.imagini.length === 0) return null;
    
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Previzualizare Imagini
        </Typography>
        <Grid container spacing={2}>
          {formData.imagini.map((imageUrl, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box sx={{ position: 'relative' }}>
                <Box 
                  component="img" 
                  src={imageUrl}
                  alt={`Imagine produs ${index + 1}`}
                  sx={{ 
                    width: '100%', 
                    height: 150,
                    objectFit: 'contain',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150x150?text=Imagine+Indisponibilă";
                  }}
                />
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'center' }}>
                Imagine {index + 1}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestionare Produse
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Adaugă Produs Nou
        </Button>
      </Box>
      
      {loading ? (
        <Typography>Se încarcă produsele...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Nume Produs</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Categorie</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Preț (RON)</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Stoc</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Acțiuni</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {product.imagini && product.imagini.length > 0 ? (
                        <Box 
                          component="img" 
                          src={product.imagini[0]}
                          alt={product.nume}
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            objectFit: 'cover',
                            marginRight: 2,
                            borderRadius: 1
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
                          }}
                        />
                      ) : (
                        <Box 
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            backgroundColor: '#f0f0f0',
                            marginRight: 2,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="caption" color="textSecondary">No Image</Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography>{product.nume}</Typography>
                        {product.imagini && product.imagini.length > 1 && (
                          <Typography variant="caption" color="textSecondary">
                            +{product.imagini.length - 1} imagini suplimentare
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{product.categorie}</TableCell>
                  <TableCell>{product.pret.toFixed(2)}</TableCell>
                  <TableCell>
                    {product.laComanda ? (
                      <Typography sx={{ 
                        color: 'primary.main', 
                        fontWeight: 'medium',
                        fontStyle: 'italic'
                      }}>
                        La comandă
                      </Typography>
                    ) : (
                      product.stoc
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditClick(product)}
                        aria-label="edit"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteClick(product)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {isAdding ? "Adaugă Produs Nou" : "Editează Produs"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nume"
              label="Nume Produs"
              name="nume"
              value={formData.nume}
              onChange={handleInputChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="descriere"
              label="Descriere"
              name="descriere"
              multiline
              rows={4}
              value={formData.descriere}
              onChange={handleInputChange}
            />

            <Box sx={{ mt: 3, mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Imagini Produs
              </Typography>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <TextField
                  fullWidth
                  id="newImageUrl"
                  label="Link Imagine Produs"
                  value={newImageUrl}
                  onChange={handleNewImageChange}
                  placeholder="https://example.com/imagine.jpg"
                  sx={{ mr: 1 }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleAddImage}
                  startIcon={<AddPhotoIcon />}
                  disabled={!newImageUrl.trim()}
                >
                  Adaugă
                </Button>
              </Box>
              <Typography variant="caption" color="textSecondary">
                Introduceți URL-uri către imaginile produsului. Adăugați câte o imagine pe rând.
              </Typography>
            </Box>

            {formData.imagini.length > 0 && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Imagini adăugate ({formData.imagini.length}):
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {formData.imagini.map((url, index) => (
                    <Chip
                      key={index}
                      label={`Imagine ${index + 1}`}
                      onDelete={() => handleRemoveImage(index)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {renderImagePreviews()}
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="pret"
                label="Preț (RON)"
                name="pret"
                type="number"
                value={formData.pret}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="categorie-label">Categorie</InputLabel>
                <Select
                  labelId="categorie-label"
                  id="categorie"
                  name="categorie"
                  value={formData.categorie}
                  label="Categorie"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Cămăși">Cămăși</MenuItem>
                  <MenuItem value="Pantaloni">Pantaloni</MenuItem>
                  <MenuItem value="Geci">Geci</MenuItem>
                  <MenuItem value="Accesorii">Accesorii</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.laComanda}
                    onChange={handleCheckboxChange}
                    name="laComanda"
                    color="primary"
                  />
                }
                label="Produs disponibil doar la comandă"
              />
            </Box>
            
            {!formData.laComanda && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="stoc"
                label="Stoc"
                name="stoc"
                type="number"
                value={formData.stoc}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 1 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anulează</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={formData.nume === "" || formData.pret <= 0 || (!formData.laComanda && formData.stoc < 0)}
          >
            {isAdding ? "Adaugă" : "Salvează"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>
          Confirmare Ștergere
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sunteți sigur că doriți să ștergeți produsul "{productToDelete?.nume}"?
            <br />
            Această acțiune nu poate fi anulată.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Anulează
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Șterge
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Produse;
