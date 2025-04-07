import axios from "axios";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useEffect, useState } from "react";

const ManageHalls = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [halls, setHalls] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const response = await axios.post(`http://localhost:3000/addhall`, {
        data: data,
      });
      if (response.data.success) {
        alert("Hall added successfully");
        fetchHalls();
        onOpenChange(false);
      } else {
        alert("Failed to add hall");
      }
    } catch (error) {
      alert("Error adding hall");
      console.log("Error adding hall:", error);
    }
  };
  
  const updateHall = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    try {
      const response = await axios.put(`http://localhost:3000/updatehall`, data);
      if (response.data.success) {
        alert("Hall updated successfully");
        fetchHalls();
      } else {
        alert("Failed to update hall");
      }
    } catch (error) {
      alert("Error updating hall");
      console.log("Error updating hall:", error);
    }
  }

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/halls`);
      setHalls(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const populateHalls = () => {
    if (halls.length === 0) {
      return (
        <AccordionItem
          key="no halls"
          aria-label="No Halls"
          title="No Halls Found"
          className="rounded-md"
        ></AccordionItem>
      );
    }
    return halls.map((hall) => {
      return (
        <AccordionItem
          key={hall.name}
          aria-label="Accordion 1"
          title={hall.name}
          className="rounded-md"
          subtitle="Click to View / Edit"
        >
          <div className="flex flex-col justify-center mb-2 text-sm gap-2">
            <Form onSubmit={updateHall}>
              <div className="flex gap-2 items-center">
                <Input
                  className="w-32"
                  label="Hall Name"
                  placeholder="CS1"
                  type="text"
                  name="hallName"
                  defaultValue={hall.name}
                  isReadOnly
                />
                <Input
                  className="w-32"
                  label="Rows"
                  placeholder="0.00"
                  name="rows"
                  type="number"
                  defaultValue={hall.rows}
                />
                <Input
                  className="w-32"
                  label="Columns"
                  placeholder="0.00"
                  name="columns"
                  type="number"
                  defaultValue={hall.columns}
                />
              </div>
              <Button type="submit" color="primary" className="w-2 mt-4 rounded-md text-white" onPress={() => {
              }}>
                Update
              </Button>
            </Form>
          </div>
        </AccordionItem>
      );
    });
  };

  return (
    <div className="text-white p-12">
      <h1 className="text-3xl font-semibold">Manage Halls</h1>
      <div className="mt-12">
        <Accordion variant="splitted" className="!px-0 max-h-[75vh] overflow-y-auto">
          {populateHalls()}
        </Accordion>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className="bg-[#111111] text-white dark"
        >
          <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Exam Hall
              </ModalHeader>
              <Form onSubmit={onSubmit} className="w-full">
                <ModalBody className="w-full">
                  <Input
                    label="Hall Name"
                    placeholder="CS1"
                    type="text"
                    radius="sm"
                    name="hallName" // Add name attribute
                    isRequired
                  />
                  <div className="flex gap-2">
                    <Input
                      className="w-full"
                      label="Rows"
                      placeholder="0.00"
                      type="number"
                      min={1}
                      name="rows" // Add name attribute
                      defaultValue={5}
                    />
                    <Input
                      className="w-full"
                      label="Columns"
                      placeholder="0.00"
                      type="number"
                      min={1}
                      name="columns" // Add name attribute
                      defaultValue={6}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onOpenChange}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" className="text-white">
                    Add Hall
                  </Button>
                </ModalFooter>
              </Form>
            </>
          </ModalContent>
        </Modal>
        <Button
          color="primary"
          className="rounded-md mt-5 text-white"
          onPress={onOpen}
        >
          Add Hall
        </Button>
      </div>
    </div>
  );
};

export default ManageHalls;
