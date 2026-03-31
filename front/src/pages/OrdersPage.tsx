import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Order, ORDER_STATUS_MAP } from '../types';
import './OrdersPage.css';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  const getStatusClass = (statusName: string | undefined): string => {
    if (!statusName) return '';
    const statusMap: Record<string, string> = {
      pending: 'status-pending',
      in_process: 'status-process',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      deleted: 'status-deleted',
      waiting_car: 'status-waiting',
    };
    return statusMap[statusName.toLowerCase()] || '';
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  return (
    <div className="orders-page">
      <h1>📋 Заказы</h1>
      
      {orders.length === 0 ? (
        <p className="empty-message">Нет заказов</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Заказ #{order.id}</span>
                <span className={`order-status ${getStatusClass(order.orderStatus?.orderStatusName)}`}>
                  {ORDER_STATUS_MAP[order.orderStatus?.orderStatusName?.toLowerCase() || ''] || order.orderStatus?.orderStatusName}
                </span>
              </div>
              <div className="order-body">
                <p className="order-description">{order.description}</p>
                <div className="order-details">
                  <div className="detail-row">
                    <span className="detail-label">Автомобиль:</span>
                    <span className="detail-value">{order.car?.modelName || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Номер:</span>
                    <span className="detail-value car-number">{order.car?.carNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Цена:</span>
                    <span className="detail-value price">{order.totalPrice} ₽</span>
                  </div>
                </div>
              </div>
              <div className="order-footer">
                <div className="date-info">
                  <span>Начало: {formatDate(order.startDate)}</span>
                  {order.endDate && <span>Окончание: {formatDate(order.endDate)}</span>}
                </div>
                <div className="planned-date">
                  Планируемая дата: {formatDate(order.plannedEndDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
