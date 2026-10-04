import { Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <div>
      <h1>仿美团网站</h1>
      <Routes>
        <Route path="/" element={<div>首页（待实现）</div>} />
      </Routes>
    </div>
  );
}
