import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import {Listado} from './componentes/listado.jsx';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Listado />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;

