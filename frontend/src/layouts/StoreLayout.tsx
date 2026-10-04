import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function StoreLayout() {
  const [city, setCity] = useState('北京');

  return (
    <div className="site">
      <Header city={city} onCityChange={setCity} />
      <main className="site-main">
        <Outlet context={{ city }} />
      </main>
    </div>
  );
}
