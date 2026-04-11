import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowBack, DeleteOutlined as DeleteOutlineIcon, Edit as EditIcon } from '@mui/icons-material';
import { api } from '../services/api';
import { Order, OrderStatus, ORDER_STATUS_MAP } from '../types';
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

function toLocalInputValue(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function StaffUserOrdersPage() {
  const { id } = useParams();
  const userId = Number(id);
  const { toasts, removeToast, success, error: showError } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOnly, setActiveOnly] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [eStatusId, setEStatusId] = useState(0);
  const [ePrice, setEPrice] = useState('');
  const [eDesc, setEDesc] = useState('');
  const [ePlanned, setEPlanned] = useState('');
  const [eEnd, setEEnd] = useState('');

  const completedId = useMemo(
    () => statuses.find((s) => s.orderStatusName?.toLowerCase() === 'completed')?.id,
    [statuses]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, st] = await Promise.all([
        api.getStaffOrders({ userId, id: 0, limit: 200, offset: 0 }),
        api.getStaffOrderStatuses(50, 0),
      ]);
      setOrders(list);
      setStatuses(st);
    } catch (err) {
      showError(api.parseApiError(err).message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [userId, showError]);

  useEffect(() => {
    if (!Number.isFinite(userId) || userId < 1) return;
    load();
  }, [userId, load]);

  const visible = useMemo(
    () => (activeOnly ? orders.filter(isActiveOrder) : orders),
    [orders, activeOnly]
  );

  const statusLabel = (o: Order) => {
    const key = o.orderStatus?.orderStatusName?.toLowerCase() || '';
    return ORDER_STATUS_MAP[key] || o.orderStatus?.orderStatusName || '—';
  };

  const openEdit = (o: Order) => {
    setEditOrder(o);
    setEStatusId(o.orderStatusId);
    setEPrice(String(o.totalPrice));
    setEDesc(o.description || '');
    setEPlanned(toLocalInputValue(o.plannedEndDate));
    setEEnd(toLocalInputValue(o.endDate));
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editOrder) return;
    const price = parseFloat(ePrice.replace(',', '.'));
    if (!Number.isFinite(price) || price <= 0) {
      showError('Укажите корректную цену');
      return;
    }
    if (!ePlanned) {
      showError('Укажите плановую дату окончания');
      return;
    }
    let endIso: string | null = eEnd ? new Date(eEnd).toISOString() : null;
    if (completedId && eStatusId === completedId) {
      endIso = new Date().toISOString();
    }
    try {
      await api.updateStaffOrder({
        id: editOrder.id,
        orderStatusId: eStatusId,
        totalPrice: price,
        description: eDesc.trim() || null,
        plannedEndDate: new Date(ePlanned).toISOString(),
        endDate: endIso,
        startDate: null,
      });
      success('Заказ обновлён');
      setEditOpen(false);
      setEditOrder(null);
      await load();
    } catch (err) {
      showError(api.parseApiError(err).message);
    }
  };

  const removeOrder = async (o: Order) => {
    if (!window.confirm(`Удалить заказ #${o.id}?`)) return;
    try {
      await api.deleteStaffOrder(o.id);
      success('Заказ удалён');
      await load();
    } catch (err) {
      showError(api.parseApiError(err).message);
    }
  };

  if (!Number.isFinite(userId) || userId < 1) {
    return <Navigate to="/users" replace />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 960, mx: 'auto' }}>
      <Button component={Link} to="/users" startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        К пользователям
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        Заказы пользователя #{userId}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Button component={Link} to={`/profile/${userId}`} size="small" variant="outlined">
          Профиль
        </Button>
        <Button component={Link} to={`/cards/${userId}`} size="small" variant="outlined">
          Автомобили
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }} elevation={0} variant="outlined">
        <FormControlLabel
          control={<Switch checked={activeOnly} onChange={(_, v) => setActiveOnly(v)} />}
          label="Только активные заказы"
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : visible.length === 0 ? (
        <Typography color="text.secondary">Нет заказов</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {visible.map((o) => (
            <Card key={o.id}>
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="h6">Заказ #{o.id}</Typography>
                  <Chip label={statusLabel(o)} size="small" variant="outlined" />
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {o.description || '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {o.car?.modelName} · {o.car?.carNumber} · {o.totalPrice} ₽
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                  План: {formatDt(o.plannedEndDate)} · Окончание: {formatDt(o.endDate)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(o)}>
                  Изменить
                </Button>
                <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => removeOrder(o)}>
                  Удалить
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Редактирование заказа #{editOrder?.id}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mt: 1 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              label="Статус"
              value={eStatusId || ''}
              onChange={(e: SelectChangeEvent<number>) => setEStatusId(Number(e.target.value))}
            >
              {statuses.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {ORDER_STATUS_MAP[s.orderStatusName?.toLowerCase() || ''] || s.orderStatusName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            fullWidth
            label="Цена"
            type="number"
            value={ePrice}
            onChange={(e) => setEPrice(e.target.value)}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          />
          <TextField margin="dense" fullWidth label="Описание" value={eDesc} onChange={(e) => setEDesc(e.target.value)} multiline minRows={2} />
          <TextField
            margin="dense"
            fullWidth
            label="Плановая дата окончания"
            type="datetime-local"
            value={ePlanned}
            onChange={(e) => setEPlanned(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            margin="dense"
            fullWidth
            label="Дата окончания работ (факт)"
            type="datetime-local"
            value={eEnd}
            onChange={(e) => setEEnd(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText={
              completedId && eStatusId === completedId
                ? 'При статусе «Завершён» дата будет проставлена автоматически при сохранении'
                : ' '
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={saveEdit} disabled={!statuses.length}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Toast toasts={toasts} onRemove={removeToast} />
    </Box>
  );
}
