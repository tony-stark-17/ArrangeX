import {Accordion, AccordionItem} from "@heroui/accordion";
import {Button} from "@heroui/button";
import {Input} from "@heroui/input";
import { useState } from "react";

const ManageHalls = () => {
    return (
        <div className="text-white p-12">
            <h1 className="text-3xl font-semibold">Manage Halls</h1>
            <div className="mt-12">
                <Accordion variant="splitted" className="!px-0">
                    <AccordionItem key="1" aria-label="Accordion 1" title="CS1" className="rounded-md" subtitle="Click to View / Edit">                        
                        <div className="flex flex-col justify-center mb-2 text-sm gap-2">
                            <div className="flex gap-2 items-center">
                                <Input
                                        className="w-32"
                                        label="Rows"
                                        placeholder="0.00"
                                        type="number"
                                        defaultValue={7}
                                />
                                <Input
                                        className="w-32"
                                        label="Columns"
                                        placeholder="0.00"
                                        type="number"
                                        defaultValue={6}
                                />
                            </div>
                            <Button color="primary" className="w-2 mt-4 rounded-md text-white">Update</Button>
                        </div>
                    </AccordionItem>
                    <AccordionItem key="2" aria-label="Accordion 1" title="CS2" className="rounded-md" subtitle="Click to View / Edit">                        
                        <div className="flex flex-col justify-center mb-2 text-sm gap-2">
                            <div className="flex gap-2 items-center">
                                <Input
                                        className="w-32"
                                        label="Rows"
                                        placeholder="0.00"
                                        type="number"
                                        defaultValue={7}
                                />
                                <Input
                                        className="w-32"
                                        label="Columns"
                                        placeholder="0.00"
                                        type="number"
                                        defaultValue={6}
                                />
                            </div>
                            <Button color="primary" className="w-2 mt-4 rounded-md text-white">Update</Button>
                        </div>
                    </AccordionItem>
                    <AccordionItem key="3" aria-label="Accordion 1" title="CS3" className="rounded-md" subtitle="Click to View / Edit">                        
                        <div className="flex flex-col justify-center mb-2 text-sm gap-2">
                            <div className="flex gap-2 items-center">
                                <Input
                                        className="w-32"
                                        label="Rows"
                                        placeholder="0.00"
                                        type="number"
                                        defaultValue={7}
                                />
                                <Input
                                        className="w-32"
                                        label="Columns"
                                        placeholder="0.00"
                                        type="number"
                                        defaultValue={6}
                                />
                            </div>
                            <Button color="primary" className="w-2 mt-4 rounded-md text-white">Update</Button>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}

export default ManageHalls;