import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Car, COLOR_MAP } from '../types';
import './CarsPage.css';

export function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await api.getCars();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="cars-page">
      <h1>🚗 Автомобили</h1>
      
      {cars.length === 0 ? (
        <p className="empty-message">Нет доступных автомобилей</p>
      ) : (
        <div className="cars-table-container">
          <table className="cars-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Номер</th>
                <th>Модель</th>
                <th>VIN</th>
                <th>Цвет</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td className="car-number">{car.carNumber}</td>
                  <td>{car.modelName}</td>
                  <td className="vin">{car.vin}</td>
                  <td>
                    <span 
                      className="color-badge"
                      style={{ backgroundColor: COLOR_MAP[car.color]?.hex || '#808080' }}
                    >
                      {COLOR_MAP[car.color]?.name || 'Неизвестно'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
