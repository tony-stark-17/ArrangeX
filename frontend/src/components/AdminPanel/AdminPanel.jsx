import { useState } from 'react';
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Icon } from '@iconify-icon/react';

import ManageUsers from './ManageUsers';
import ManageHalls from './ManageHalls';
import GenerateSeats from './GenerateSeats';

import Logo from '../../assets/logo.png'
import classes from './AdminPanel.module.css'

const AdminPanel = () =>{
    const [activeTab, setActiveTab] = useState("users");
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    return(
       <div className={classes['admin-container']}>
            <nav className={classes['admin-nav']}>
                <div className={classes['admin-nav-logo']}>
                    <img src={Logo} alt="Logo" className={classes['logo']}/>
                </div>
                <div className={classes['admin-nav-buttons']}>
                    <Button color="primary" className={`text-white rounded-md ${activeTab == 'users' ? 'bg-teal-700' : 'bg-[#282828]'} justify-start`} onPress={() => handleTabChange('users')}><Icon icon="material-symbols:person" width="24" height="24" />Manage Users</Button>
                    <Button color="primary" className={`text-white rounded-md ${activeTab == 'halls' ? 'bg-teal-700' : 'bg-[#282828]'} justify-start`} onPress={() => handleTabChange('halls')}><Icon icon="bx:chair" width="24" height="24" />Manage Halls</Button>
                    <Button color="primary" className={`text-white rounded-md ${activeTab == 'seats' ? 'bg-teal-700' : 'bg-[#282828]'} justify-start`} onPress={() => handleTabChange('seats')}><Icon icon="mdi:wand" width="24" height="24" />Generate Seats</Button>
                </div>
                <div className={classes['admin-nav-user']}>
                    <User
                        className="text-white"
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                        }}
                        description="Head of IT Dept."
                        name="Tony Stark"
                    />
                    <Button isIconOnly aria-label="Like" color="primary" className='rounded-md text-white' size='sm'>
                        <Icon icon="material-symbols:logout" className='w-4'/>
                    </Button>
                </div>
            </nav>
            <section className={classes['admin-content']}>
                        {
                            {
                                users: <ManageUsers/>,
                                halls: <ManageHalls/>,
                                seats: <GenerateSeats/>
                            }[activeTab]
                        }
                        
            </section>
       </div>
    )
}

export default AdminPanel