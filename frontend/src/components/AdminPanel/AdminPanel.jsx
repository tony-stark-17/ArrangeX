import { useState, useEffect } from 'react';
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Icon } from '@iconify-icon/react';
import { useNavigate } from 'react-router';

import LoadingScreen from '../LoadingScreen';
import ManageUsers from './ManageUsers';
import ManageHalls from './ManageHalls';
import GenerateSeats from './GenerateSeats';
import Credits from './Credits';

import Logo from '../../assets/logo.png'
import classes from './AdminPanel.module.css'

const AdminPanel = () =>{
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
    const [userDetails, setUserDetails] = useState({})
    const [state, setState] = useState('loading');
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userDetails'));
        if(userData){
            setUserDetails(userData)
            setTimeout(() => {
                setState('loaded');
            }, 1000);
        }else{
            navigate('/login')
        }
    }, [])
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    return(
        <>
        <LoadingScreen state={state} />
       <div className={classes['admin-container']}>
            <nav className={classes['admin-nav']}>
                <div className={classes['admin-nav-logo']}>
                    <img src={Logo} alt="Logo" className={classes['logo']}/>
                </div>
                <div className={classes['admin-nav-buttons']}>
                    <Button color="primary" className={`text-white rounded-md ${activeTab == 'users' ? 'bg-teal-700' : 'bg-[#282828]'} justify-start`} onPress={() => handleTabChange('users')}><Icon icon="material-symbols:person" width="24" height="24" />Manage Users</Button>
                    <Button color="primary" className={`text-white rounded-md ${activeTab == 'halls' ? 'bg-teal-700' : 'bg-[#282828]'} justify-start`} onPress={() => handleTabChange('halls')}><Icon icon="bx:chair" width="24" height="24" />Manage Halls</Button>
                    <Button color="primary" className={`text-white rounded-md ${activeTab == 'seats' ? 'bg-teal-700' : 'bg-[#282828]'} justify-start`} onPress={() => handleTabChange('seats')}><Icon icon="mdi:wand" width="24" height="24" />Generate Seats</Button>
                    <Button color="primary" className={`text-white rounded-md ${activeTab == 'credits' ? 'bg-teal-700' : 'bg-[#282828]'} justify-start`} onPress={() => handleTabChange('credits')}><Icon icon="mdi:account-group" width="24" height="24" />About Us</Button>
                </div>
                <div className={classes['admin-nav-user']}>
                    <User
                        className="text-white"
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                        }}
                        description={userDetails.designation}
                        name={userDetails.name}
                    />
                    <Button isIconOnly aria-label="Like" color="primary" className='rounded-md text-white' size='sm' onPress={() => {
                        localStorage.removeItem('userDetails')
                        navigate('/login')
                    }}>
                        <Icon icon="material-symbols:logout" className='w-4'/>
                    </Button>
                </div>
            </nav>
            <section className={classes['admin-content']}>
                        {
                            {
                                users: <ManageUsers/>,
                                halls: <ManageHalls/>,
                                seats: <GenerateSeats/>,
                                credits: <Credits/>,
                            }[activeTab]
                        }
                        
            </section>
       </div>
       </>
    )
}

export default AdminPanel