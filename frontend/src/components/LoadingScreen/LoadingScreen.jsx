import {Spinner} from "@heroui/spinner";
import Logo from '../../assets/logo.png'
import classes from './LoadingScreen.module.css'

const LoadingScreen = () =>{    
    return(
        <div className={`${classes.loadingscreen}`}>
            <img src={Logo} alt="Logo" className="logo" />
            <Spinner className="relative top-12" color="primary" size="lg"/>
        </div>
    )
}

export default LoadingScreen;