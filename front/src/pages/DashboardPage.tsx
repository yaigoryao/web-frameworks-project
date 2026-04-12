import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../hooks/useAuth';
import { useRootStore } from '../stores/StoreContext';
import { Car, Order, ORDER_STATUS_MAP } from '../types';
import { Toast, useToast } from '../components/Toast';

const ACTIVE_STATUS_NAMES = new Set(['pending', 'in_process', 'waiting_car']);

function isActiveOrder(o: Order): boolean {
  const n = o.orderStatus?.orderStatusName?.toLowerCase() || '';
  return ACTIVE_STATUS_NAMES.has(n);
}

function orderStatusLabel(o: Order): string {
  const key = o.orderStatus?.orderStatusName?.toLowerCase() || '';
  return ORDER_STATUS_MAP[key] || o.orderStatus?.orderStatusName || '—';
}

function carLine(c: Car): string {
  const parts = [c.modelName, c.carNumber, c.vin].filter(Boolean);
  return parts.join(' · ') || `Автомобиль #${c.id}`;
}

export const DashboardPage = observer(function DashboardPage() {
  const auth = useAuth();
  const { user } = auth;
  const { customerDataStore } = useRootStore();
  const { toasts, removeToast, error: showError } = useToast();

  useEffect(() => {
    void (async () => {
      await Promise.all([
        customerDataStore.ensureCars(),
        customerDataStore.ensureOrders(),
      ]);
      if (customerDataStore.carsError) showError(customerDataStore.carsError);
      if (customerDataStore.ordersError) showError(customerDataStore.ordersError);
    })();
  }, [customerDataStore, showError]);

  const { cars, orders, carsLoading, ordersLoading } = customerDataStore;
  const loading = carsLoading || ordersLoading;

  const activeOrders = useMemo(() => orders.filter(isActiveOrder), [orders]);

  if (loading && cars.length === 0 && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 960, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Сводка
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Профиль, активные заказы и ваши автомобили (списком, без фото — по контракту).
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        }}
      >
        <Card variant="outlined" sx={{ gridColumn: { md: '1 / -1' } }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Профиль
            </Typography>
            <Typography variant="body2">
              <strong>Логин:</strong> {user?.login ?? '—'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>ФИО:</strong> {user?.surname} {user?.name} {user?.patronymic}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Телефон:</strong> {user?.phoneNumber ?? '—'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Роль:</strong> {user?.role?.roleName ?? '—'}
            </Typography>
            <Button component={Link} to="/profile" variant="outlined" size="small" sx={{ mt: 2 }}>
              Редактировать профиль
            </Button>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">Активные заказы</Typography>
              <Button component={Link} to="/orders" size="small">
                Все заказы
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Статусы: ожидание, в процессе, ожидание машины
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {activeOrders.length === 0 ? (
              <Typography color="text.secondary">Нет активных заказов</Typography>
            ) : (
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {activeOrders.map((o) => (
                  <Typography key={o.id} component="li" variant="body2" sx={{ mb: 0.5 }}>
                    №{o.id} — {orderStatusLabel(o)}
                  </Typography>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">Мои автомобили</Typography>
              <Button component={Link} to="/cars" size="small">
                Карточки с фото
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              На дашборде — только текстовый список
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {cars.length === 0 ? (
              <Typography color="text.secondary">Нет привязанных автомобилей</Typography>
            ) : (
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {cars.map((c) => (
                  <Typography key={c.id} component="li" variant="body2" sx={{ mb: 0.5 }}>
                    {carLine(c)}
                  </Typography>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Toast toasts={toasts} onRemove={removeToast} />
    </Box>
  );
});
