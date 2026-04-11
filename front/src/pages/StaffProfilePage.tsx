import { useEffect, useState, useCallback } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Role, ROLE_NAMES } from '../types';
import { Toast, useToast } from '../components/Toast';

export function StaffProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();

  const userId = Number(id);
  const [target, setTarget] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [roleId, setRoleId] = useState<number>(0);
  const [password, setPassword] = useState('');

  const viewerRole = currentUser?.role?.roleName?.toLowerCase() || '';
  const isOwner = viewerRole === 'owner';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const u = await api.getStaffUserById(userId);
      setTarget(u);
      setName(u.name || '');
      setSurname(u.surname || '');
      setPatronymic(u.patronymic || '');
      setPhoneNumber(u.phoneNumber || '');
      setIsActive(u.isActive);
      setRoleId(u.roleId);
      if (viewerRole === 'owner') {
        const r = await api.getStaffRoles(50, 0);
        setRoles(r);
      } else {
        setRoles([]);
      }
    } catch (err) {
      showError(api.parseApiError(err).message);
      setTarget(null);
    } finally {
      setLoading(false);
    }
  }, [userId, viewerRole, showError]);

  useEffect(() => {
    if (!Number.isFinite(userId) || userId < 1) return;
    load();
  }, [userId, load]);

  const handleRoleChange = (e: SelectChangeEvent<number>) => {
    setRoleId(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target?.login) return;
    setSaving(true);
    try {
      await api.updateStaffUser({
        login: target.login,
        name: name.trim() || null,
        surname: surname.trim() || null,
        patronymic: patronymic.trim() ? patronymic.trim() : null,
        phoneNumber: phoneNumber.trim() || null,
        isActive,
        password: password.trim() ? password.trim() : null,
        roleId: isOwner ? roleId : null,
      });
      success('Профиль сохранён');
      setPassword('');
      await load();
    } catch (err) {
      showError(api.parseApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  if (!Number.isFinite(userId) || userId < 1) {
    return <Navigate to="/users" replace />;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!target) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Пользователь не найден или нет доступа</Alert>
        <Button component={Link} to="/users" sx={{ mt: 2 }} startIcon={<ArrowBackIcon />}>
          К списку
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 720, mx: 'auto' }}>
      <Button component={Link} to="/users" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        К пользователям
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Профиль пользователя
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Логин: <strong>{target.login}</strong>
      </Typography>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }} elevation={1}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            required
            label="Фамилия"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            disabled={saving}
            sx={{ flex: '1 1 220px' }}
          />
          <TextField
            required
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            sx={{ flex: '1 1 220px' }}
          />
        </Box>
        <TextField
          fullWidth
          label="Отчество"
          value={patronymic}
          onChange={(e) => setPatronymic(e.target.value)}
          disabled={saving}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Телефон"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={saving}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Новый пароль (необязательно)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={saving}
          margin="normal"
          autoComplete="new-password"
        />

        <FormControlLabel
          control={<Switch checked={isActive} onChange={(_, v) => setIsActive(v)} disabled={saving} />}
          label="Активен"
          sx={{ mt: 2, display: 'block' }}
        />

        {isOwner && roles.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="staff-profile-role">Роль</InputLabel>
            <Select
              labelId="staff-profile-role"
              label="Роль"
              value={roleId}
              onChange={handleRoleChange}
              disabled={saving}
            >
              {roles.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {ROLE_NAMES[r.roleName?.toLowerCase() || ''] || r.roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {!isOwner && target.role && (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Роль: {ROLE_NAMES[target.role.roleName?.toLowerCase() || ''] || target.role.roleName}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Сохранение…' : 'Сохранить'}
          </Button>
          <Button component={Link} to={`/cards/${userId}`} variant="outlined">
            Автомобили
          </Button>
          <Button component={Link} to={`/orders/${userId}`} variant="outlined">
            Заказы
          </Button>
        </Box>
      </Paper>

      <Toast toasts={toasts} onRemove={removeToast} />
    </Box>
  );
}
