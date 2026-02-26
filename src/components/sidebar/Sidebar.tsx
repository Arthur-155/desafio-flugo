import flugoLogo from '../../assets/flugo.png';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import './sidebar.css'
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className='sidebar'>
            <div className="mainSidebar">
                <Link to="/">
                    <img src={flugoLogo} alt="Logo da Flugo" className='LogoFlugo'/>
                </Link>
                <br />
                <div className="subSidebar">
                    <AccountBoxIcon className='colaboradoresIcon' />
                    <p>Colaboradores</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar