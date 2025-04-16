import axios from "axios";
import { useState, useEffect } from "react";
import {Select, SelectItem, DatePicker, Form, Input, Button, Switch} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import "./GenerateSeats.css";


const GenerateSeats = () => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [selectedHalls, setSelectedHalls] = useState([]);
    const [halls, setHalls] = useState([]);

    const updateSelectedHalls = (e) => {
        let classText = e.target.value
        let convertedText = classText.split(",").map((item) => item.trim()).filter((item) => item !== "");
        setSelectedHalls(convertedText);
    };

    const fetchHalls = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/halls`);
            let hallData = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setHalls(hallData);
        } catch (error) {
            console.error("Error fetching halls:", error);
        }
    }
    useEffect(() => {
        fetchHalls();
    }, []);

    // Helper function to download a file from a URL
    const downloadFile = async (fileUrl, fileName) => {
        try {
            // Instead of directly accessing the file URL, create a new endpoint on your server
            // that will proxy the download request and add proper headers
            const response = await axios({
                url: `http://localhost:3000/download-proxy`,
                method: 'POST',
                responseType: 'blob',
                data: {
                    fileUrl: fileUrl.replace('http://localhost:3000', '') // Send just the path
                }
            });
            
            // Create a Blob from the response data
            const blob = new Blob([response.data]);
            
            // Create a link with an object URL
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            
            // Append to the body and click
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`Error downloading file ${fileName}:`, error);
            alert(`Failed to download ${fileName}. Please try again later.`);
        }
    };

    const onSubmit = async(e) => {
        e.preventDefault();
    
        const data = Object.fromEntries(new FormData(e.currentTarget));
        data.examHalls = selectedHalls;
        console.log(data);
        
        try {
            const response = await axios.post(`http://localhost:3000/generate-seats`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            // Check if the response indicates success
            if (response.data.success) {
                alert(`Seats generated successfully!`);
                
                // Download both files automatically
                const baseUrl = 'http://localhost:3000';
                
                // Extract file names from paths for better download naming
                const arrangementFileName = response.data.files.arrangementFile.split('/').pop();
                const rangesFileName = response.data.files.rangesFile.split('/').pop();
                const countFileName = response.data.files.countFile.split('/').pop();
                
                // Download the arrangement file
                downloadFile(`${baseUrl}${response.data.files.arrangementFile}`, arrangementFileName);
                downloadFile(`${baseUrl}${response.data.files.rangesFile}`, rangesFileName);
                downloadFile(`${baseUrl}${response.data.files.countFile}`, countFileName);
            } else {
                // Handle case where API returns success=false
                alert(`Error: ${response.data.error}.`);
            }
        } catch (error) {
            // Handle network errors or server errors (5xx, 4xx)
            console.error("Error generating seats:", error);
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                alert(`Server error: ${error.response.data.error || 'Unknown error occurred'}`);
            } else if (error.request) {
                // The request was made but no response was received
                alert("No response from server. Please check if the server is running.");
            } else {
                // Something happened in setting up the request
                alert(`Error: ${error.message}`);
            }
        }
    };

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
            <Form className="mt-12 w-full" onSubmit={onSubmit} encType="multipart/form-data">
                <label 
                    htmlFor="images" 
                    className={`drop-container w-full ${isDragActive ? "drag-active" : ""}`} 
                    id="dropcontainer"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <span className="drop-title">Drop files here</span>
                    or
                    <input type="file" id="images" name="studentList" required accept=".csv"/>
                </label>
                <Input type="text" className="mt-5" name="examName" label="Exam Name" placeholder="B.TECH DEGREE S7(R&S) SEMESTER EXAMINATION NOVEMBER 2024 (2019 SCHEME)" isRequired/>
                <Select
                    className="max-w-full mt-5"
                    radius="sm"
                    label="Exam Halls"
                    placeholder="Select Exam Halls"
                    selectionMode="multiple"
                    name="examHalls"
                    onChange={updateSelectedHalls}
                    isRequired
                    >
                    <SelectItem key="all">All</SelectItem>
                    {
                    halls.map((hall) => (
                        <SelectItem key={hall.name}>{hall.name}</SelectItem>
                    ))}
                </Select>
                <DatePicker className="mt-5" label="Examination Date" name="examDate" isRequired/>
                <Switch className="mt-5" name="isFN">Is Forenoon</Switch>
                <Button color="primary" className="mt-4 rounded-md text-white" type="submit"><Icon icon="mdi:wand" width="24" height="24"/>Generate Seat</Button>
            </Form>
        </div>
    );
}

export default GenerateSeats;