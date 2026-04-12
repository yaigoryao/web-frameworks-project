import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { api } from './services/api';
import { Car, COLOR_MAP, normalizeCarColorIndex } from './types';
import { Toast, useToast } from './components/Toast';

function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, error: showError } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getCars({ limit: 100, offset: 0 });
      setCars(data);
    } catch (err) {
      showError(api.parseApiError(err).message);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Мои автомобили
      </Typography>
      <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 3 }}>

        <Box component="span" sx={{ fontFamily: 'monospace' }}>
          
        </Box>
        
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : cars.length === 0 ? (
        <Typography color="text.secondary">У вас нет привязанных автомобилей</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {cars.map((car) => {
            const colorIdx = normalizeCarColorIndex(car.color);
            const colorMeta = COLOR_MAP[colorIdx];
            return (
              <Card key={car.id} variant="outlined" elevation={0}>
                <CardMedia
                  component="img"
                  height="160"
                  image={`/cars/${colorIdx}.png`}
                  alt={colorMeta?.name ?? 'Автомобиль'}
                  sx={{ objectFit: 'contain', bgcolor: 'grey.100', p: 1 }}
                />
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {car.modelName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Госномер: <strong>{car.carNumber}</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, fontFamily: 'monospace', wordBreak: 'break-all' }}
                  >
                    VIN: {car.vin}
                  </Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`Цвет: ${colorMeta?.name ?? '—'}`}
                    sx={{
                      mt: 1.5,
                      borderColor: colorMeta?.hex ?? 'grey.500',
                      bgcolor: `${colorMeta?.hex ?? '#9e9e9e'}22`,
                    }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </Box>
  );
}

export default CarsPage;
