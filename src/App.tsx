import './App.css'
import Sidebar from './components/sidebar/Sidebar'
import Avatar from '@mui/material/Avatar'
import { deepOrange } from '@mui/material/colors'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Colaboradores from './components/colaboradores/Colaboradores'
import NovoColaborador from './components/novoColaborador/NovoColaborador'


function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <div className="layout">
          <aside className="lateral">
            <Sidebar />
          </aside>

          <header className="barraTopo">
            <Avatar sx={{ bgcolor: deepOrange[500] }}>A</Avatar>
          </header>

          <main className="conteudo">
            <Routes>
              <Route path="/" element={<Colaboradores/>} />
              <Route path="/novoColaborador" element={<NovoColaborador />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App