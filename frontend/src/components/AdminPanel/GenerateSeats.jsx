import { useState } from "react";
import {Select, SelectItem} from "@heroui/react";
import {Button} from "@heroui/button";
import { Icon } from "@iconify-icon/react";
import "./GenerateSeats.css";


export const classes = [
    {key: "all", label: "All"},
    {key: "cat", label: "CS1"},
    {key: "dog", label: "CS2"},
    {key: "elephant", label: "CS3"},
    {key: "lion", label: "CS4"},
    {key: "tiger", label: "CS5"},
    {key: "giraffe", label: "CS6"},
    {key: "dolphin", label: "CS7"},
    {key: "penguin", label: "CS8"},
    {key: "zebra", label: "CS9"},
    {key: "shark", label: "CS10"},
    {key: "whale", label: "CS11"},
    {key: "otter", label: "CS12"},
    {key: "crocodile", label: "CS13"},
  ];


const GenerateSeats = () => {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = () => {
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);
        const fileInput = document.getElementById("images");
        if (fileInput) {
            fileInput.files = e.dataTransfer.files;
        }
    };

    return (
        <div className="text-white p-12">
            <h1 className="text-3xl font-semibold">Manage Halls</h1>
            <div className="mt-12">
                <label 
                    htmlFor="images" 
                    className={`drop-container ${isDragActive ? "drag-active" : ""}`} 
                    id="dropcontainer"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <span className="drop-title">Drop files here</span>
                    or
                    <input type="file" id="images" required />
                </label>
                <Select
                    className="max-w-full mt-5"
                    radius="sm"
                    label="Exam Halls"
                    placeholder="Select Exam Halls"
                    selectionMode="multiple"
                    >
                    {classes.map((animal) => (
                        <SelectItem key={animal.key}>{animal.label}</SelectItem>
                    ))}
                </Select>
                <Button color="primary" className="mt-4 rounded-md text-white"><Icon icon="mdi:wand" width="24" height="24" />Generate Seat</Button>
            </div>
        </div>
    );
}

export default GenerateSeats;