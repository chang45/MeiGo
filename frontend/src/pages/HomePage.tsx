import { useOutletContext } from 'react-router-dom';
import Home from './Home';

interface StoreContext {
  city: string;
}

export default function HomePage() {
  const { city } = useOutletContext<StoreContext>();
  return <Home city={city} />;
}
