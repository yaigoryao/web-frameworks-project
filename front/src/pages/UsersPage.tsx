import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutlined as DeleteOutlineIcon,
  DirectionsCar as DirectionsCarIcon,
  Person as PersonIcon,
  ReceiptLong as ReceiptLongIcon,
  Search as SearchIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, ROLE_NAMES } from '../types';
import { AddUserModal } from '../components/AddUserModal';
import { Toast, useToast } from '../components/Toast';

type SortField = 'name' | 'surname' | 'login' | 'createdAt' | 'role';
type SortOrder = 'asc' | 'desc';

const OWNER_ROLE_FILTER: { value: string; label: string }[] = [
  { value: '', label: 'Все роли' },
  { value: 'owner', label: ROLE_NAMES.owner },
  { value: 'manager', label: ROLE_NAMES.manager },
  { value: 'user', label: ROLE_NAMES.user },
];

export function UsersPage() {
  const { user } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const currentUserRoleName = user?.role?.roleName?.toLowerCase() || '';
  const isOwner = currentUserRoleName === 'owner';
  const isManager = currentUserRoleName === 'manager';
  const canAddUsers = isOwner || isManager;

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const apiSortField = sortField === 'role' ? 'role' : sortField;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.getUsers({
        role: isOwner ? (roleFilter || undefined) : undefined,
        search: debouncedSearch || undefined,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        sortBy: apiSortField,
        sortOrder,
      });
      setUsers(result.users);
      setTotalUsers(result.total);
    } catch (err) {
      const apiError = api.parseApiError(err);
      showError(`Ошибка загрузки пользователей: ${apiError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    rowsPerPage,
    roleFilter,
    debouncedSearch,
    apiSortField,
    sortOrder,
    showError,
    isOwner,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(0);
  }, [roleFilter, debouncedSearch, rowsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddUserSuccess = () => {
    success('Пользователь успешно создан!');
    fetchUsers();
  };

  const canModifyUser = useCallback(
    (u: User) => {
      if (u.id === user?.id) return false;
      if (isOwner) return true;
      if (isManager) return u.role?.roleName?.toLowerCase() === 'user';
      return false;
    },
    [user?.id, isOwner, isManager]
  );

  const handleDeleteUser = async (target: User) => {
    if (!canModifyUser(target)) return;
    const label = `${target.surname} ${target.name}`.trim();
    if (!window.confirm(`Удалить пользователя «${label}» (${target.login})?`)) return;

    try {
      await api.deleteUserByLogin(target.login);
      success('Пользователь удалён');
      fetchUsers();
    } catch (err) {
      const apiError = api.parseApiError(err);
      showError(apiError.status === 403 ? 'Недостаточно прав для удаления' : apiError.message);
    }
  };

  const handleToggleStatus = async (target: User) => {
    if (!canModifyUser(target)) return;
    try {
      await api.updateStaffUser({
        login: target.login,
        password: null,
        name: null,
        surname: null,
        patronymic: null,
        phoneNumber: null,
        roleId: null,
        isActive: !target.isActive,
      });
      success(target.isActive ? 'Пользователь деактивирован' : 'Пользователь активирован');
      fetchUsers();
    } catch (err) {
      const apiError = api.parseApiError(err);
      showError(apiError.message);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const roleChipColor = useMemo(
    () =>
      (roleName: string): 'error' | 'primary' | 'success' | 'default' => {
        const r = roleName?.toLowerCase();
        if (r === 'owner') return 'error';
        if (r === 'manager') return 'primary';
        if (r === 'user') return 'success';
        return 'default';
      },
    []
  );

  const roleLabel = (roleName: string | undefined) => {
    const key = roleName?.toLowerCase() || '';
    return ROLE_NAMES[key] || roleName || '—';
  };

  const handleRoleFilterChange = (e: SelectChangeEvent<string>) => {
    setRoleFilter(e.target.value);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Пользователи
        </Typography>
        {canAddUsers && (
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
            Добавить пользователя
          </Button>
        )}
      </Box>

      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { md: 'center' },
          }}
        >
          <TextField
            fullWidth
            label="Поиск"
            placeholder="Телефон, логин, ФИО…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" aria-hidden />
                  </InputAdornment>
                ),
              },
            }}
            aria-label="Поиск по телефону, логину или ФИО"
          />
          {isOwner && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="users-role-filter-label">Роль</InputLabel>
              <Select
                labelId="users-role-filter-label"
                label="Роль"
                value={roleFilter}
                onChange={handleRoleFilterChange}
              >
                {OWNER_ROLE_FILTER.map((opt) => (
                  <MenuItem key={opt.value || 'all'} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
        {isManager && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            Доступны только клиенты (роль «{ROLE_NAMES.user}»).
          </Typography>
        )}
      </Paper>

      <TableContainer component={Paper} elevation={1}>
        {isLoading && users.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress aria-label="Загрузка" />
          </Box>
        ) : (
          <>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'surname'}
                      direction={sortField === 'surname' ? sortOrder : 'asc'}
                      onClick={() => handleSort('surname')}
                    >
                      Фамилия
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'name'}
                      direction={sortField === 'name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Имя
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'login'}
                      direction={sortField === 'login' ? sortOrder : 'asc'}
                      onClick={() => handleSort('login')}
                    >
                      Логин
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'role'}
                      direction={sortField === 'role' ? sortOrder : 'asc'}
                      onClick={() => handleSort('role')}
                    >
                      Роль
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'createdAt'}
                      direction={sortField === 'createdAt' ? sortOrder : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >
                      Создан
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">Пользователи не найдены</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow
                      key={u.id}
                      hover
                      sx={{ opacity: u.isActive ? 1 : 0.65, '&:last-child td': { border: 0 } }}
                    >
                      <TableCell>{u.surname}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.login}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={roleLabel(u.role?.roleName)}
                          color={roleChipColor(u.role?.roleName || '')}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{u.phoneNumber || '—'}</TableCell>
                      <TableCell>{formatDate(u.createdAt)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={u.isActive ? 'Активен' : 'Неактивен'}
                          color={u.isActive ? 'success' : 'default'}
                          variant={u.isActive ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="Профиль">
                            <IconButton component={Link} to={`/profile/${u.id}`} size="small" color="primary" aria-label="Профиль">
                              <PersonIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Заказы">
                            <IconButton component={Link} to={`/orders/${u.id}`} size="small" color="primary" aria-label="Заказы">
                              <ReceiptLongIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Автомобили">
                            <IconButton component={Link} to={`/cards/${u.id}`} size="small" color="primary" aria-label="Автомобили">
                              <DirectionsCarIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {canModifyUser(u) && (
                            <>
                              <Tooltip title={u.isActive ? 'Деактивировать' : 'Активировать'}>
                                <span>
                                  <IconButton size="small" onClick={() => handleToggleStatus(u)} aria-label="Сменить активность">
                                    {u.isActive ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Удалить">
                                <span>
                                  <IconButton size="small" color="error" onClick={() => handleDeleteUser(u)} aria-label="Удалить">
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
              labelRowsPerPage="На странице"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count !== -1 ? count : `более ${to}`}`}
            />
          </>
        )}
      </TableContainer>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddUserSuccess}
        currentUserRole={currentUserRoleName}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </Box>
  );
}
