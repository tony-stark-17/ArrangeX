import {Spinner} from "@heroui/spinner";
import { motion,AnimatePresence } from 'framer-motion';
import Logo from '../../assets/logo.png'
import classes from './LoadingScreen.module.css'
import { useEffect } from "react";

const LoadingScreen = ({state}) =>{    
    useEffect(() => {
        console.log(state)
    }
    , [state]);
    return(
        <AnimatePresence>
            {state === 'loading' &&
            (<motion.div className={`${classes.loadingscreen}`} key="cont"
                exit={{ opacity: 0 }}>
                <img src={Logo} alt="Logo" className="logo" />
                <Spinner className="relative top-12" color="primary" size="lg"/>
            </motion.div>)
            }
        </AnimatePresence>
    )
}

export default LoadingScreen;