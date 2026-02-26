import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

function Paginacao() {
    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} underline="hover" color="inherit" to="/">
                Colaboradores
            </Link>

            <Link
                component={RouterLink} underline="hover" color="inherit" to="/NovoColaborador">
                Cadastrar Colaboradores
            </Link>
        </Breadcrumbs>
    )
}

export default Paginacao