import {Accordion, AccordionItem} from "@heroui/accordion";
import {Button} from "@heroui/button";
import { useState } from "react";
const HideText = (text) => {
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => {
        setVisible(!visible);
    }
    return <div className={`${!visible && 'block bg-default-200 w-24 h-5 hover:bg-default-100'} cursor-pointer`} onClick={toggleVisibility}>{visible && text}</div>;
}

const ManageUsers = () => {
    const defaultContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    return (
        <div className="text-white p-12">
            <h1 className="text-3xl font-semibold">Manage Users</h1>
            <div className="mt-12">
                <Accordion variant="splitted" className="!px-0">
                    <AccordionItem key="1" aria-label="Accordion 1" title="Tony Stark" className="rounded-md" subtitle="Head of IT Dept.">                        
                        <div className="flex flex-col justify-center mb-2 text-sm">
                            <div className="flex items-center mb-2 gap-2">
                                <span>Username:</span><span>tonystark</span>
                            </div>
                            <div className="flex items-center mb-2 gap-2">
                                <span>Password:</span><span>{HideText("HI")}</span>
                            </div>
                            <Button color="danger" className="w-2 mt-4 rounded-md bg-red-600">Delete</Button>
                        </div>
                    </AccordionItem>
                    <AccordionItem key="2" aria-label="Accordion 1" title="Tony Stark" className="rounded-md" subtitle="Head of IT Dept.">                        
                        <div className="flex flex-col justify-center mb-2 text-sm">
                            <div className="flex items-center mb-2 gap-2">
                                <span>Username:</span><span>tonystark</span>
                            </div>
                            <div className="flex items-center mb-2 gap-2">
                                <span>Password:</span><span>{HideText("HI")}</span>
                            </div>
                            <Button color="danger" className="w-2 mt-4 rounded-md bg-red-600">Delete</Button>
                        </div>
                    </AccordionItem>
                    <AccordionItem key="3" aria-label="Accordion 1" title="Tony Stark" className="rounded-md" subtitle="Head of IT Dept.">                        
                        <div className="flex flex-col justify-center mb-2 text-sm">
                            <div className="flex items-center mb-2 gap-2">
                                <span>Username:</span><span>tonystark</span>
                            </div>
                            <div className="flex items-center mb-2 gap-2">
                                <span>Password:</span><span>{HideText("HI")}</span>
                            </div>
                            <Button color="danger" className="w-2 mt-4 rounded-md bg-red-600">Delete</Button>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}

export default ManageUsers;