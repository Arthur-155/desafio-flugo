import './colaborades.css'
import EnhancedTableHead from '../tableColaboradores/Table'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';


function Colaboradores() {
    return (
        <div className="container">
            <div className="subContainer">
                <div className="headers">
                    <h2>Colaboradores</h2>
                    <Button variant="contained" className='button' component={Link} to ="/NovoColaborador">Novo Colaborador</Button>
                </div>
                <EnhancedTableHead />
            </div>
        </div>
    )
}

export default Colaboradores