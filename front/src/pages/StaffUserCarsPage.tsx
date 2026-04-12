import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '../services/api';
import { Car, COLOR_MAP } from '../types';
import { Toast, useToast } from '../components/Toast';
import { useRootStore } from '../stores/StoreContext';

const COLOR_KEYS = Object.keys(COLOR_MAP).map(Number).sort((a, b) => a - b);

function normalizeVin(v: string): string {
  return v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export const StaffUserCarsPage = observer(function StaffUserCarsPage() {
  const { id } = useParams();
  const userId = Number(id);
  const { staffUserDataStore, staffReferenceStore } = useRootStore();
  const { toasts, removeToast, success, error: showError } = useToast();

  const cars = staffUserDataStore.getCars(userId);
  const orderStatuses = staffReferenceStore.orderStatuses;
  const [pageLoading, setPageLoading] = useState(true);

  const [vinInput, setVinInput] = useState('');
  const [vinBusy, setVinBusy] = useState(false);
  const [vinMessage, setVinMessage] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [newVin, setNewVin] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newColor, setNewColor] = useState(0);

  const [transferOpen, setTransferOpen] = useState(false);
  const [transferCarId, setTransferCarId] = useState(0);
  const [transferFromUserId, setTransferFromUserId] = useState(0);

  const [editCar, setEditCar] = useState<Car | null>(null);
  const [editModel, setEditModel] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editVin, setEditVin] = useState('');
  const [editColor, setEditColor] = useState(0);

  const [orderCar, setOrderCar] = useState<Car | null>(null);
  const [orderPrice, setOrderPrice] = useState('');
  const [orderDesc, setOrderDesc] = useState('');
  const [orderPlanned, setOrderPlanned] = useState('');
  const [orderStatusId, setOrderStatusId] = useState<number>(0);

  const refreshCars = useCallback(async () => {
    await staffUserDataStore.ensureStaffCars(userId, true);
  }, [staffUserDataStore, userId]);

  useEffect(() => {
    if (!Number.isFinite(userId) || userId < 1) return;
    setPageLoading(true);
    void (async () => {
      try {
        await Promise.all([
          staffUserDataStore.ensureStaffCars(userId),
          staffReferenceStore.ensureOrderStatuses(),
        ]);
      } catch (err) {
        showError(api.parseApiError(err).message);
      } finally {
        setPageLoading(false);
      }
    })();
  }, [userId, staffUserDataStore, staffReferenceStore, showError]);

  useEffect(() => {
    if (orderStatuses.length) {
      setOrderStatusId((prev) => prev || orderStatuses[0].id);
    }
  }, [orderStatuses]);

  const loading =
    pageLoading ||
    staffUserDataStore.carsLoadingUserId === userId ||
    (staffReferenceStore.orderStatusesLoading && orderStatuses.length === 0);

  const openEdit = (c: Car) => {
    setEditCar(c);
    setEditModel(c.modelName);
    setEditNumber(c.carNumber);
    setEditVin(c.vin);
    setEditColor(c.color);
  };

  const saveEdit = async () => {
    if (!editCar) return;
    try {
      await api.updateStaffCar({
        id: editCar.id,
        modelName: editModel.trim(),
        carNumber: editNumber.trim(),
        vin: normalizeVin(editVin),
        color: editColor,
      });
      success('Автомобиль обновлён');
      setEditCar(null);
      await refreshCars();
    } catch (err) {
      showError(api.parseApiError(err).message);
    }
  };

  const unlinkCar = async (carId: number) => {
    if (!window.confirm('Снять привязку автомобиля с этого пользователя? Запись в базе сохранится.')) return;
    try {
      await api.deleteStaffUserCar(userId, carId);
      success('Привязка снята');
      await refreshCars();
    } catch (err) {
      showError(api.parseApiError(err).message);
    }
  };

  const handleVinLookup = async () => {
    const vin = normalizeVin(vinInput);
    setVinMessage(null);
    if (vin.length !== 17) {
      setVinMessage('VIN должен быть ровно 17 символов (только буквы и цифры).');
      return;
    }
    setVinBusy(true);
    try {
      const found = await api.getStaffCars({ vin, limit: 1, offset: 0 });
      if (found.length === 0) {
        setNewVin(vin);
        setNewModel('');
        setNewNumber('');
        setNewColor(0);
        setCreateOpen(true);
        return;
      }
      const car = found[0];
      const owners = await api.getStaffUserCarLinks({ carId: car.id, ownsNow: true, limit: 20, offset: 0 });
      const current = owners.find((l) => l.ownsNow);
      if (current && current.userId === userId) {
        setVinMessage('Этот автомобиль уже привязан к выбранному пользователю.');
        return;
      }
      if (current && current.userId !== userId) {
        setTransferCarId(car.id);
        setTransferFromUserId(current.userId);
        setTransferOpen(true);
        return;
      }
      await api.addStaffUserCar({ userId, carId: car.id, ownsNow: true });
      success('Автомобиль привязан');
      setVinInput('');
      await refreshCars();
    } catch (err) {
      showError(api.parseApiError(err).message);
    } finally {
      setVinBusy(false);
    }
  };

  const confirmTransfer = async () => {
    setVinBusy(true);
    try {
      await api.deleteStaffUserCar(transferFromUserId, transferCarId);
      await api.addStaffUserCar({ userId, carId: transferCarId, ownsNow: true });
      success('Привязка перенесена');
      setTransferOpen(false);
      setVinInput('');
      await refreshCars();
    } catch (err) {
      showError(api.parseApiError(err).message);
    } finally {
      setVinBusy(false);
    }
  };

  const createAndLink = async () => {
    const vin = normalizeVin(newVin);
    if (vin.length !== 17 || !newModel.trim() || !newNumber.trim()) {
      showError('Заполните модель, номер и корректный VIN');
      return;
    }
    try {
      await api.createStaffCar({
        vin,
        modelName: newModel.trim(),
        carNumber: newNumber.trim(),
        color: newColor,
      });
      const again = await api.getStaffCars({ vin, limit: 1, offset: 0 });
      if (!again.length) throw new Error('Не удалось получить ID новой машины');
      await api.addStaffUserCar({ userId, carId: again[0].id, ownsNow: true });
      success('Автомобиль создан и привязан');
      setCreateOpen(false);
      setVinInput('');
      await refreshCars();
    } catch (err) {
      showError(api.parseApiError(err).message);
    }
  };

  const submitOrder = async () => {
    if (!orderCar) return;
    const price = parseFloat(orderPrice.replace(',', '.'));
    if (!Number.isFinite(price) || price <= 0) {
      showError('Укажите корректную цену');
      return;
    }
    if (!orderPlanned) {
      showError('Укажите плановую дату окончания');
      return;
    }
    if (!orderStatusId) {
      showError('Выберите статус заказа');
      return;
    }
    try {
      const planned = new Date(orderPlanned);
      await api.createStaffOrder({
        userId,
        carId: orderCar.id,
        totalPrice: price,
        description: orderDesc.trim() || null,
        startDate: new Date().toISOString(),
        plannedEndDate: planned.toISOString(),
        endDate: null,
        orderStatusId,
      });
      success('Заказ создан');
      staffUserDataStore.invalidateOrders(userId);
      setOrderCar(null);
      setOrderPrice('');
      setOrderDesc('');
    } catch (err) {
      showError(api.parseApiError(err).message);
    }
  };

  if (!Number.isFinite(userId) || userId < 1) {
    return <Navigate to="/users" replace />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Button component={Link} to="/users" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        К пользователям
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        Автомобили пользователя #{userId}
      </Typography>
      <Button component={Link} to={`/profile/${userId}`} sx={{ mb: 2 }}>
        Профиль пользователя
      </Button>

      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <Typography variant="subtitle1" gutterBottom>
          Добавить по VIN
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Только буквы и цифры, 17 символов. Если машина есть в базе — привязка; если у другого пользователя — запрос подтверждения на перенос связи.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start' }}>
          <TextField
            size="small"
            label="VIN"
            value={vinInput}
            onChange={(e) => setVinInput(normalizeVin(e.target.value))}
            placeholder="17 символов"
            sx={{ minWidth: 240 }}
          />
          <Button
            variant="contained"
            startIcon={vinBusy ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
            onClick={handleVinLookup}
            disabled={vinBusy}
          >
            Найти / привязать
          </Button>
        </Box>
        {vinMessage && (
          <Alert severity="info" sx={{ mt: 1 }}>
            {vinMessage}
          </Alert>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : cars.length === 0 ? (
        <Typography color="text.secondary">Нет привязанных автомобилей</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {cars.map((car) => (
            <Card key={car.id} elevation={2}>
              <CardMedia
                component="img"
                height="140"
                image={`/cars/${Math.min(9, Math.max(0, car.color))}.png`}
                alt={COLOR_MAP[car.color]?.name || 'Авто'}
                sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
              />
              <CardContent>
                <Typography variant="h6">{car.modelName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {car.carNumber} · VIN: {car.vin}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Цвет: {COLOR_MAP[car.color]?.name || '—'}
                </Typography>
              </CardContent>
              <CardActions sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                <Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(car)}>
                  Изменить
                </Button>
                <Button size="small" startIcon={<PostAddIcon />} onClick={() => setOrderCar(car)}>
                  Новый заказ
                </Button>
                <Button size="small" color="warning" startIcon={<LinkOffIcon />} onClick={() => unlinkCar(car.id)}>
                  Снять привязку
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Новый автомобиль в базе</DialogTitle>
        <DialogContent>
          <TextField margin="dense" fullWidth label="VIN" value={newVin} disabled />
          <TextField
            margin="dense"
            fullWidth
            required
            label="Модель"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
          />
          <TextField
            margin="dense"
            fullWidth
            required
            label="Госномер"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Цвет</InputLabel>
            <Select
              label="Цвет"
              value={newColor}
              onChange={(e: SelectChangeEvent<number>) => setNewColor(Number(e.target.value))}
            >
              {COLOR_KEYS.map((k) => (
                <MenuItem key={k} value={k}>
                  {COLOR_MAP[k].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={createAndLink}>
            Создать и привязать
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={transferOpen} onClose={() => !vinBusy && setTransferOpen(false)}>
        <DialogTitle>Перенос привязки</DialogTitle>
        <DialogContent>
          <Typography>
            Автомобиль сейчас привязан к пользователю #{transferFromUserId}. Снять старую связь и привязать к пользователю #
            {userId}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferOpen(false)} disabled={vinBusy}>
            Отмена
          </Button>
          <Button variant="contained" color="warning" onClick={confirmTransfer} disabled={vinBusy}>
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editCar} onClose={() => setEditCar(null)} fullWidth maxWidth="sm">
        <DialogTitle>Редактирование автомобиля</DialogTitle>
        <DialogContent>
          <TextField margin="dense" fullWidth label="Модель" value={editModel} onChange={(e) => setEditModel(e.target.value)} />
          <TextField margin="dense" fullWidth label="Госномер" value={editNumber} onChange={(e) => setEditNumber(e.target.value)} />
          <TextField
            margin="dense"
            fullWidth
            label="VIN"
            value={editVin}
            onChange={(e) => setEditVin(normalizeVin(e.target.value))}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Цвет</InputLabel>
            <Select
              label="Цвет"
              value={editColor}
              onChange={(e: SelectChangeEvent<number>) => setEditColor(Number(e.target.value))}
            >
              {COLOR_KEYS.map((k) => (
                <MenuItem key={k} value={k}>
                  {COLOR_MAP[k].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCar(null)}>Отмена</Button>
          <Button variant="contained" onClick={saveEdit}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!orderCar} onClose={() => setOrderCar(null)} fullWidth maxWidth="sm">
        <DialogTitle>Новый заказ {orderCar ? `· ${orderCar.modelName}` : ''}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="Цена"
            type="number"
            value={orderPrice}
            onChange={(e) => setOrderPrice(e.target.value)}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          />
          <TextField
            margin="dense"
            fullWidth
            label="Описание"
            value={orderDesc}
            onChange={(e) => setOrderDesc(e.target.value)}
            multiline
            minRows={2}
          />
          <TextField
            margin="dense"
            fullWidth
            label="Плановая дата окончания"
            type="datetime-local"
            value={orderPlanned}
            onChange={(e) => setOrderPlanned(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Статус</InputLabel>
            <Select
              label="Статус"
              value={orderStatusId || ''}
              onChange={(e: SelectChangeEvent<number>) => setOrderStatusId(Number(e.target.value))}
            >
              {orderStatuses.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.orderStatusName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderCar(null)}>Отмена</Button>
          <Button variant="contained" onClick={submitOrder} disabled={!orderStatuses.length}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      <Toast toasts={toasts} onRemove={removeToast} />
    </Box>
  );
});
