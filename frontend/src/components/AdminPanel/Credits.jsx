import {Card, CardHeader, CardBody, Image} from "@heroui/react";
import Zedan from '../../assets/Zedan2.jpg';  
import Surya from '../../assets/surya.jpg';
import Jishan from '../../assets/jishan.jpg';
import Samad from '../../assets/samad.jpg';

const Credits = () => {
    return (
        <div className="text-white p-12 flex flex-col gap-16">
            <h1 className="text-3xl font-semibold">About Us</h1>
            <p className="text-default-500">ArrangeX is an innovative solution developed by the Information Technology Department students of the 2022-2026 batch under the expert guidance of <b>Professor Resna R.</b> This automated exam hall seating arrangement generator was created as part of their third-year mini project initiative.
The system aims to significantly reduce the manual effort traditionally required for creating and managing examination seating arrangements. By automating this process, ArrangeX not only saves valuable administrative time but also minimizes human errors that can occur during manual allocation.
Additionally, ArrangeX streamlines the display of seating information, making it easier for students to locate their assigned seats during examinations. This reduces confusion and helps ensure a smooth examination process for all stakeholders.
The project demonstrates the practical application of IT solutions to real-world academic challenges, showcasing the students' technical skills and their ability to identify and address institutional needs effectively.</p>
            <div className="grid grid-cols-4 gap-8">
                <Card className="py-4 px-2 hover:scale-105 h-[350px] drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">Zedan Muhammed Rafi</p>
                        <small className="text-default-500">Student</small>
                        <small className="text-default-500">IT Department 2022-2026</small>
                    </CardHeader>
                    <CardBody className="py-2 overflow-hidden h-full">
                        <img src={Zedan} alt="" class="object-cover w-full rounded-md h-full" style={{
                            objectPosition: '20% 45%'
                        }}/>
                    </CardBody>
                </Card>
                <Card className="py-4 px-2 hover:scale-105 h-[350px] drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">Jishan PP</p>
                        <small className="text-default-500">Student</small>
                        <small className="text-default-500">IT Department 2022-2026</small>
                    </CardHeader>
                    <CardBody className="py-2 overflow-hidden h-full">
                        <img src={Jishan} alt="" class="object-cover w-full rounded-md h-full" style={{
                            objectPosition: '20% 30%'
                        }}/>
                    </CardBody>
                </Card>
                <Card className="py-4 px-2 hover:scale-105 h-[350px] drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">Surya Santhosh</p>
                        <small className="text-default-500">Student</small>
                        <small className="text-default-500">IT Department 2022-2026</small>
                    </CardHeader>
                    <CardBody className="py-2 overflow-hidden h-full">
                        <img src={Surya} alt="" class="object-cover w-full rounded-md h-full" style={{
                            objectPosition: '20% 40%'
                        }}/>
                    </CardBody>
                </Card>
                <Card className="py-4 px-2 hover:scale-105 h-[350px] drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">Abdul Samad</p>
                        <small className="text-default-500">Student</small>
                        <small className="text-default-500">IT Department 2022-2026</small>
                    </CardHeader>
                    <CardBody className="py-2 overflow-hidden h-full">
                        <img src={Samad} alt="" class="object-cover w-full rounded-md h-full" style={{
                            objectPosition: '20% 50%',
                        }}/>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default Credits;