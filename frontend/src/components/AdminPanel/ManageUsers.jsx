import axios from "axios";
import {Accordion, AccordionItem} from "@heroui/accordion";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@heroui/modal";
import {Input} from "@heroui/react";
import {Button} from "@heroui/button";
import {Icon} from "@iconify-icon/react";
import {Form} from "@heroui/form";
import { useState, useEffect } from "react";

const HideText = ({text}) => {
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => {
        setVisible(!visible);
    }
    return <div className={`${!visible && 'block bg-default-200 w-24 h-5 hover:bg-default-100'} cursor-pointer`} onClick={toggleVisibility}>{visible && text}</div>;
}

const ManageUsers = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const [name, setName] = useState('');
    
    
    // Create separate disclosure hooks for each modal
    const addModalDisclosure = useDisclosure();
    const deleteModalDisclosure = useDisclosure();
    
    const openDeleteModal = (username) => {
        setSelectedAdmin(username);
        deleteModalDisclosure.onOpen(); // Use the correct method from the hook
    };
    
    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/admins`);
            setAdmins(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        try {
            const response = await axios.post(`http://localhost:3000/addadmin`, {
                data: data
            });
            if (response.data.success) {
                alert("Admin added successfully");
                fetchAdmins();
                addModalDisclosure.onClose(); // Close modal after successful deletion
            } else {
                alert("Failed to add admin");
            }
        } catch (error) {
            alert("Error adding admin");
            console.log("Error adding admin:", error);
        }
    };

    const deleteAdmin = async (username) => {
        const adminId = username;
        try {
            const response = await axios.delete(`http://localhost:3000/deleteadmin/${adminId}`);
            if (response.data.success) {
                alert("Admin deleted successfully");
                fetchAdmins();
                deleteModalDisclosure.onClose(); // Close modal after successful deletion
            } else {
                alert("Failed to delete admin");
            }
        } catch (error) {
            alert("Error deleting admin");
            console.log("Error deleting admin:", error);
        }
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const populateAdmins = () => {
        if (admins.length === 0) {
            return <AccordionItem key='noadmin' aria-label="Accordion 1" title="No admins found" className="rounded-md">                        
            </AccordionItem>
        }
        return admins.map((admin) => {
            return (
                <AccordionItem key={admin.username} aria-label="Accordion 1" title={admin.name} className="rounded-md" subtitle={admin.designation}>                        
                    <div className="flex flex-col justify-center mb-2 text-sm">
                        <div className="flex items-center mb-2 gap-2">
                            <span>Username:</span><span>{admin.username}</span>
                        </div>
                        <div className="flex items-center mb-2 gap-2">
                            <span>Password:</span><span><HideText text={admin.password} /></span>
                        </div>
                        <Button color="danger" className="w-2 mt-4 rounded-md bg-red-600" onPress={() => openDeleteModal(admin.username)}>Delete</Button>
                    </div>
                </AccordionItem>
            )
        })
    }
    
    return (
        <div className="text-white p-12">
            <h1 className="text-3xl font-semibold">Manage Users</h1>
            <div className="mt-12">
                <Accordion variant="splitted" className="!px-0 max-h-[75vh] overflow-y-auto">
                    {populateAdmins()}
                </Accordion>
                
                {/* Add User Modal */}
                <Modal 
                    isOpen={addModalDisclosure.isOpen} 
                    onOpenChange={addModalDisclosure.onOpenChange} 
                    className="bg-[#111111] text-white dark"
                >
                    <ModalContent>
                        <>
                        <ModalHeader className="flex flex-col gap-1">Add User</ModalHeader>
                        <Form onSubmit={onSubmit} className="w-full">
                            <ModalBody className="w-full">
                                <Input
                                    label="Username"
                                    placeholder="Enter Username"
                                    type="text"
                                    radius="sm"
                                    name="username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    isRequired
                                />
                                <Input
                                    type={isVisible ? "text" : "password"}
                                    radius="sm"
                                    placeholder="Enter Password"
                                    label="Password"
                                    name="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    isRequired
                                    endContent={
                                        <button
                                        type="button"
                                        aria-label="toggle password visibility"
                                        className="focus:outline-none flex items-center"
                                        onClick={toggleVisibility}
                                        >
                                        {isVisible ? (
                                            <Icon icon="mynaui:eye-slash-solid" width={20} className="w-4 text-default-400 pointer-events-none"/>
                                        ) : (
                                            <Icon icon="mynaui:eye-solid" width={20} className="w-4 text-default-400 pointer-events-none"/>
                                        )}
                                        </button>
                                    }
                                />
                                <Input
                                    label="Name"
                                    placeholder="Enter the name"
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                    name="name"
                                    radius="sm"
                                    isRequired
                                />
                                <Input
                                    label="Designation"
                                    placeholder="Head of IT Dept."
                                    type="text"
                                    onChange={(e) => setDesignation(e.target.value)}
                                    name="designation"
                                    radius="sm"
                                    isRequired
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={addModalDisclosure.onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="primary" className="text-white">
                                    Add User
                                </Button>
                            </ModalFooter>
                        </Form>
                        </>
                    </ModalContent>
                </Modal>
                
                {/* Delete User Modal */}
                <Modal 
                    isOpen={deleteModalDisclosure.isOpen} 
                    onOpenChange={deleteModalDisclosure.onOpenChange} 
                    className="bg-[#111111] text-white dark"
                >
                    <ModalContent>
                        <>
                        <ModalHeader className="flex flex-col gap-1">Delete User</ModalHeader>
                            <ModalBody className="w-full">
                                <p>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={deleteModalDisclosure.onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="primary" className="text-white" onPress={() => deleteAdmin(selectedAdmin)}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    </ModalContent>
                </Modal>
                
                <Button color="primary" className="rounded-md mt-5 text-white" onPress={addModalDisclosure.onOpen}>Add User</Button>
            </div>
        </div>
    );
}

export default ManageUsers;