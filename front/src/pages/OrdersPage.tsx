import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { api } from '../services/api';
import { Order, ORDER_STATUS_MAP } from '../types';
import { Toast, useToast } from '../components/Toast';

const ACTIVE_STATUS_NAMES = new Set(['pending', 'in_process', 'waiting_car']);

function isActiveOrder(o: Order): boolean {
  const n = o.orderStatus?.orderStatusName?.toLowerCase() || '';
  return ACTIVE_STATUS_NAMES.has(n);
}

function formatDt(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('ru-RU');
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOnly, setActiveOnly] = useState(false);
  const [detail, setDetail] = useState<Order | null>(null);
  const { toasts, removeToast, error: showError } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getOrders({ id: 0, limit: 100, offset: 0 });
      setOrders(data);
    } catch (err) {
      showError(api.parseApiError(err).message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (activeOnly ? orders.filter(isActiveOrder) : orders),
    [orders, activeOnly]
  );

  const statusLabel = (o: Order) => {
    const key = o.orderStatus?.orderStatusName?.toLowerCase() || '';
    return ORDER_STATUS_MAP[key] || o.orderStatus?.orderStatusName || '—';
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Мои заказы
      </Typography>

      <FormControlLabel
        control={<Switch checked={activeOnly} onChange={(_, v) => setActiveOnly(v)} />}
        label="Только активные"
        sx={{ mb: 2, display: 'block' }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : visible.length === 0 ? (
        <Typography color="text.secondary">Нет заказов</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {visible.map((order) => (
            <Card key={order.id} elevation={1}>
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                  <Typography variant="h6">Заказ #{order.id}</Typography>
                  <Chip size="small" label={statusLabel(order)} color="primary" variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {order.description || 'Без описания'}
                </Typography>
                <Typography variant="body2">
                  {order.car?.modelName} · {order.car?.carNumber}
                </Typography>
                <Typography variant="body2">Цена: {order.totalPrice} ₽</Typography>
                <Button size="small" sx={{ mt: 1 }} onClick={() => setDetail(order)}>
                  Подробнее
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={!!detail} onClose={() => setDetail(null)} fullWidth maxWidth="sm">
        <DialogTitle>Заказ #{detail?.id}</DialogTitle>
        <DialogContent>
          {detail && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1 }}>
              <Typography>
                <strong>Статус:</strong> {statusLabel(detail)}
              </Typography>
              <Typography>
                <strong>Описание:</strong> {detail.description || '—'}
              </Typography>
              <Typography>
                <strong>Цена:</strong> {detail.totalPrice} ₽
              </Typography>
              <Typography>
                <strong>Авто:</strong> {detail.car?.modelName} ({detail.car?.carNumber}), VIN {detail.car?.vin}
              </Typography>
              <Typography>
                <strong>Начало:</strong> {formatDt(detail.startDate)}
              </Typography>
              <Typography>
                <strong>План окончания:</strong> {formatDt(detail.plannedEndDate)}
              </Typography>
              <Typography>
                <strong>Факт. окончание:</strong> {formatDt(detail.endDate)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Toast toasts={toasts} onRemove={removeToast} />
    </Box>
  );
}
