import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, ROLE_NAMES, ALLOWED_ROLES } from '../types';
import { AddUserModal } from '../components/AddUserModal';
import { Toast, ToastMessage, useToast } from '../components/Toast';
import './UsersPage.css';

type SortField = 'name' | 'surname' | 'login' | 'createdAt' | 'role';
type SortOrder = 'asc' | 'desc';

export function UsersPage() {
  const { user } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  const currentUserRoleName = user?.role?.roleName?.toLowerCase() || '';
  const canAddUsers = ALLOWED_ROLES[currentUserRoleName]?.length > 0;
  const visibleRoles = ALLOWED_ROLES[currentUserRoleName] || [];

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.getUsers({
        role: roleFilter || undefined,
        search: searchQuery || undefined,
        limit,
        offset: (page - 1) * limit,
        sortBy: sortField,
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
  }, [page, limit, roleFilter, searchQuery, sortField, sortOrder, showError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, searchQuery]);

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

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Удалить пользователя "${userName}"?`)) return;
    
    try {
      await api.deleteUser(userId);
      success('Пользователь удалён');
      fetchUsers();
    } catch (err) {
      const apiError = api.parseApiError(err);
      if (apiError.status === 403) {
        showError('Недостаточно прав для удаления пользователя');
      } else {
        showError(`Ошибка удаления: ${apiError.message}`);
      }
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await api.updateUserStatus(userId, !currentStatus);
      success(`Пользователь ${!currentStatus ? 'активирован' : 'деактивирован'}`);
      fetchUsers();
    } catch (err) {
      const apiError = api.parseApiError(err);
      showError(`Ошибка изменения статуса: ${apiError.message}`);
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getRoleBadgeClass = (roleName: string) => {
    const role = roleName?.toLowerCase();
    if (role === 'owner') return 'badge-owner';
    if (role === 'manager') return 'badge-manager';
    return 'badge-client';
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Управление пользователями</h1>
        {canAddUsers && (
          <button
            className="btn-add"
            onClick={() => setIsModalOpen(true)}
            aria-label="Добавить пользователя"
          >
            + Добавить пользователя
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="search"
            placeholder="Поиск по имени, фамилии или логину..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Поиск пользователей"
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="role-filter" className="filter-label">Роль:</label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
            aria-label="Фильтр по роли"
          >
            <option value="">Все роли</option>
            {visibleRoles.map((role) => (
              <option key={role} value={role}>
                {ROLE_NAMES[role]}
              </option>
            ))}
            {currentUserRoleName === 'owner' && (
              <>
                <option value="owner">{ROLE_NAMES.owner}</option>
                <option value="manager">{ROLE_NAMES.manager}</option>
                <option value="client">{ROLE_NAMES.client}</option>
              </>
            )}
          </select>
        </div>
      </div>

      {isLoading && users.length === 0 ? (
        <div className="loading-state">
          <div className="spinner" aria-label="Загрузка"></div>
          <span>Загрузка пользователей...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <p>Пользователи не найдены</p>
        </div>
      ) : (
        <>
          <div className="table-container" role="region" aria-label="Таблица пользователей">
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    <button
                      className="sort-btn"
                      onClick={() => handleSort('surname')}
                      aria-label={`Сортировка по фамилии ${sortField === 'surname' ? (sortOrder === 'asc' ? 'по возрастанию' : 'по убыванию') : ''}`}
                    >
                      Фамилия {getSortIcon('surname')}
                    </button>
                  </th>
                  <th>
                    <button
                      className="sort-btn"
                      onClick={() => handleSort('name')}
                      aria-label={`Сортировка по имени ${sortField === 'name' ? (sortOrder === 'asc' ? 'по возрастанию' : 'по убыванию') : ''}`}
                    >
                      Имя {getSortIcon('name')}
                    </button>
                  </th>
                  <th>
                    <button
                      className="sort-btn"
                      onClick={() => handleSort('login')}
                      aria-label={`Сортировка по логину ${sortField === 'login' ? (sortOrder === 'asc' ? 'по возрастанию' : 'по убыванию') : ''}`}
                    >
                      Логин {getSortIcon('login')}
                    </button>
                  </th>
                  <th>
                    <button
                      className="sort-btn"
                      onClick={() => handleSort('role')}
                      aria-label={`Сортировка по роли ${sortField === 'role' ? (sortOrder === 'asc' ? 'по возрастанию' : 'по убыванию') : ''}`}
                    >
                      Роль {getSortIcon('role')}
                    </button>
                  </th>
                  <th>Телефон</th>
                  <th>
                    <button
                      className="sort-btn"
                      onClick={() => handleSort('createdAt')}
                      aria-label={`Сортировка по дате создания ${sortField === 'createdAt' ? (sortOrder === 'asc' ? 'по возрастанию' : 'по убыванию') : ''}`}
                    >
                      Создан {getSortIcon('createdAt')}
                    </button>
                  </th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={!u.isActive ? 'inactive-row' : ''}>
                    <td>{u.surname}</td>
                    <td>{u.name}</td>
                    <td>{u.login}</td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(u.role?.roleName || '')}`}>
                        {ROLE_NAMES[u.role?.roleName?.toLowerCase() || 'unknown'] || u.role?.roleName}
                      </span>
                    </td>
                    <td>{u.phoneNumber || '-'}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${u.isActive ? 'status-active' : 'status-inactive'}`}>
                        {u.isActive ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {u.id !== user?.id && currentUserRoleName === 'owner' && (
                        <>
                          <button
                            className="btn-action btn-toggle"
                            onClick={() => handleToggleStatus(u.id, u.isActive)}
                            aria-label={u.isActive ? 'Деактивировать пользователя' : 'Активировать пользователя'}
                            title={u.isActive ? 'Деактивировать' : 'Активировать'}
                          >
                            {u.isActive ? '○' : '●'}
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteUser(u.id, `${u.surname} ${u.name}`)}
                            aria-label={`Удалить пользователя ${u.surname} ${u.name}`}
                            title="Удалить"
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-pagination"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Предыдущая страница"
              >
                ←
              </button>
              <span className="pagination-info">
                Страница {page} из {totalPages} ({totalUsers} пользователей)
              </span>
              <button
                className="btn-pagination"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Следующая страница"
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddUserSuccess}
        currentUserRole={currentUserRoleName}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
