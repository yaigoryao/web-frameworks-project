import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Car, Order } from '../types';
import './DashboardPage.css';

export function DashboardPage() {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, ordersData] = await Promise.all([
          api.getCars({ limit: 5 }),
          api.getOrders({ limit: 5 }),
        ]);
        setCars(carsData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Добро пожаловать, {user?.name}!</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>🚗 Мои автомобили</h2>
            <Link to="/cars" className="card-link">Все автомобили →</Link>
          </div>
          {cars.length === 0 ? (
            <p className="empty-message">У вас пока нет автомобилей</p>
          ) : (
            <ul className="card-list">
              {cars.slice(0, 3).map((car) => (
                <li key={car.id}>
                  <span className="car-number">{car.carNumber}</span>
                  <span className="car-model">{car.modelName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>📋 Мои заказы</h2>
            <Link to="/orders" className="card-link">Все заказы →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="empty-message">У вас пока нет заказов</p>
          ) : (
            <ul className="card-list">
              {orders.slice(0, 3).map((order) => (
                <li key={order.id}>
                  <span className="order-id">#{order.id}</span>
                  <span className="order-status">{order.orderStatus?.orderStatusName || 'N/A'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-card profile-card">
          <h2>👤 Профиль</h2>
          <div className="profile-info">
            <p><strong>Логин:</strong> {user?.login}</p>
            <p><strong>ФИО:</strong> {user?.surname} {user?.name} {user?.patronymic}</p>
            <p><strong>Телефон:</strong> {user?.phoneNumber}</p>
            <p><strong>Роль:</strong> {user?.role?.roleName}</p>
          </div>
          <Link to="/profile" className="btn-edit">Редактировать профиль</Link>
        </div>
      </div>
    </div>
  );
}
