import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material'; // Importăm direct din Material-UI
import { Grid, Box, Typography, Paper } from '@mui/material';
import { CalendarToday as Calendar, Group as Users, ShoppingBag, Inventory as Package } from '@mui/icons-material';

export default function PaginaStart() {
  const [stats, setStats] = useState({
    customers: {
      total: 0,
      lastWeek: 0,
      lastMonth: 0,
      lastYear: 0
    },
    orders: {
      total: 0,
      lastWeek: 0,
      lastMonth: 0,
      lastYear: 0
    },
    products: {
      total: 0
    }
  });

  useEffect(() => {
    // Într-o aplicație reală, datele ar fi preluate de la un API
    // Pentru acest exemplu, vom folosi direct data.json
    const preiaDate = async () => {
      try {
        // Într-o aplicație de producție, ați folosi un endpoint API
        // Pentru acest exemplu, simulăm folosind datele despre care știm că există
        const data = {
          produse: [
            {
              id: "p1",
              nume: "Cămașă casual pentru bărbați",
              descriere: "O cămașă confortabilă și stilată pentru bărbați.",
              pret: 129.99,
              categorie: "Cămăși",
              stoc: 120,
              imagine: "/imagini/camasa1.jpg"
            },
            {
              id: "p2",
              nume: "Blugi slim fit pentru bărbați",
              descriere: "Blugi slim fit la modă, perfecți pentru ieșiri casual.",
              pret: 199.99,
              categorie: "Pantaloni",
              stoc: 80,
              imagine: "/imagini/blugi1.jpg"
            },
            {
              id: "p3",
              nume: "Geacă de piele pentru bărbați",
              descriere: "Geacă premium din piele pentru bărbați eleganți.",
              pret: 499.99,
              categorie: "Geci",
              stoc: 45,
              imagine: "/imagini/geaca1.jpg"
            }
          ],
          clienti: [
            {
              id: "c1",
              nume_companie: "Alpha Retail",
              persoana_contact: "Ion Popescu",
              email: "ion@alpharetail.ro",
              telefon: "+40 721 123 456",
              adresa: "Str. Pieței 123, București"
            },
            {
              id: "c2",
              nume_companie: "Distribuitor Beta",
              persoana_contact: "Maria Ionescu",
              email: "maria@betadistrib.ro",
              telefon: "+40 743 234 567",
              adresa: "Bd. Comerțului 456, Cluj-Napoca"
            },
            {
              id: "c3",
              nume_companie: "Gamma En-Gros",
              persoana_contact: "Mihai Georgescu",
              email: "mihai@gammaengros.ro",
              telefon: "+40 732 345 678",
              adresa: "Calea Afacerii 789, Timișoara"
            }
          ],
          comenzi: [
            {
              id: "o1",
              id_client: "c1",
              produse: [
                { id_produs: "p1", cantitate: 10 },
                { id_produs: "p2", cantitate: 5 }
              ],
              total: 2299.85,
              data: "2025-05-01",
              status: "Expediată"
            },
            {
              id: "o2",
              id_client: "c2",
              produse: [
                { id_produs: "p3", cantitate: 2 }
              ],
              total: 999.98,
              data: "2025-05-10",
              status: "În procesare"
            },
            {
              id: "o3",
              id_client: "c3",
              produse: [
                { id_produs: "p1", cantitate: 20 },
                { id_produs: "p3", cantitate: 1 }
              ],
              total: 2799.79,
              data: "2025-05-15",
              status: "Livrată"
            }
          ]
        };

        // Calculează statistici
        const dataActuala = new Date();
        const oSaptamanaInUrma = new Date(dataActuala);
        oSaptamanaInUrma.setDate(dataActuala.getDate() - 7);
        
        const oLunaInUrma = new Date(dataActuala);
        oLunaInUrma.setMonth(dataActuala.getMonth() - 1);
        
        const unAnInUrma = new Date(dataActuala);
        unAnInUrma.setFullYear(dataActuala.getFullYear() - 1);

        // În scopuri demonstrative, presupunem că datele din data.json sunt date viitoare
        // Într-o aplicație reală, ați avea date istorice cu date din trecut
        // Pentru acest exemplu, vom simula câțiva clienți/comenzi noi în fiecare perioadă de timp

        setStats({
          customers: {
            total: data.clienti.length,
            lastWeek: 1, // Simulăm 1 client nou în ultima săptămână
            lastMonth: 2, // Simulăm 2 clienți noi în ultima lună
            lastYear: 3  // Simulăm că toți cei 3 clienți au fost adăugați în ultimul an
          },
          orders: {
            total: data.comenzi.length,
            lastWeek: 1, // Simulăm 1 comandă nouă în ultima săptămână
            lastMonth: 2, // Simulăm 2 comenzi noi în ultima lună
            lastYear: 3  // Simulăm că toate cele 3 comenzi au fost adăugate în ultimul an
          },
          products: {
            total: data.produse.length
          }
        });
      } catch (error) {
        console.error("Eroare la preluarea datelor:", error);
      }
    };

    preiaDate();
  }, []);

  // Pregătim datele pentru diagrame în formatul cerut de MUI Charts
  const chartSeries = [
    { 
      data: [stats.customers.lastWeek, stats.customers.lastMonth, stats.customers.lastYear],
      label: 'Clienți' 
    },
    { 
      data: [stats.orders.lastWeek, stats.orders.lastMonth, stats.orders.lastYear], 
      label: 'Comenzi' 
    }
  ];
  
  const chartLabels = ['Ultima Săptămână', 'Ultima Lună', 'Ultimul An'];
  
  const renderSimpleChart = (title, dataKey) => {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Box height={300}>
            {/* Folosim un grafic simplu pentru a afișa datele */}
            <Paper 
              elevation={0} 
              sx={{ 
                height: '100%', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'stretch',
                p: 2
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {title}
              </Typography>
              
              <Box sx={{ display: 'flex', height: '80%', alignItems: 'flex-end' }}>
                {chartLabels.map((label, idx) => (
                  <Box 
                    key={label} 
                    sx={{ 
                      flex: 1, 
                      mx: 1, 
                      height: `${dataKey === 'customers' ? 
                                stats.customers[['lastWeek', 'lastMonth', 'lastYear'][idx]] * 30 : 
                                stats.orders[['lastWeek', 'lastMonth', 'lastYear'][idx]] * 30}%`,
                      bgcolor: dataKey === 'customers' ? '#8884d8' : '#82ca9d',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      minHeight: '10px'
                    }}
                  >
                    <Typography variant="body2" color="white" sx={{ mb: 1 }}>
                      {dataKey === 'customers' ? 
                        stats.customers[['lastWeek', 'lastMonth', 'lastYear'][idx]] : 
                        stats.orders[['lastWeek', 'lastMonth', 'lastYear'][idx]]}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', mt: 1 }}>
                {chartLabels.map(label => (
                  <Box key={label} sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="caption">{label}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Prezentare Generală Panou
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Clienți
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {stats.customers.total}
                  </Typography>
                </Box>
                <Users sx={{ color: '#3b82f6' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Clienți Noi (Luna)
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {stats.customers.lastMonth}
                  </Typography>
                </Box>
                <Calendar sx={{ color: '#22c55e' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Comenzi
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {stats.orders.total}
                  </Typography>
                </Box>
                <ShoppingBag sx={{ color: '#a855f7' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Produse
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {stats.products.total}
                  </Typography>
                </Box>
                <Package sx={{ color: '#f97316' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Analiza pe Perioade
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {renderSimpleChart("Clienți Noi pe Perioade", "customers")}
        </Grid>
        
        <Grid item xs={12} md={6}>
          {renderSimpleChart("Comenzi Noi pe Perioade", "orders")}
        </Grid>
      </Grid>
      
      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Detalii pe Perioade
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Ultima Săptămână" />
              <CardContent>
                <Typography>Clienți Noi: {stats.customers.lastWeek}</Typography>
                <Typography>Comenzi Noi: {stats.orders.lastWeek}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Ultima Lună" />
              <CardContent>
                <Typography>Clienți Noi: {stats.customers.lastMonth}</Typography>
                <Typography>Comenzi Noi: {stats.orders.lastMonth}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Ultimul An" />
              <CardContent>
                <Typography>Clienți Noi: {stats.customers.lastYear}</Typography>
                <Typography>Comenzi Noi: {stats.orders.lastYear}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
