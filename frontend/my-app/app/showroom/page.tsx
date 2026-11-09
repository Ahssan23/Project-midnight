import ShowroomForm from "./register-form";
import DashboardPage from "./dashboard";
import { redirect } from "next/navigation";
import {
    checkDashboard,
    checkShowroom,
    getCars,
    getShowroom
} from "./action.js";
import AddCar from "./cars/add-car";
import "../../globals.css";

export default async function Dashboard() {
    const verified = await checkDashboard();

    if (!verified) {
        redirect("/login");
    }

    // Check showroom first
    const CheckShowroom = await checkShowroom();

    if (!CheckShowroom) {
        return (
            <html>
                <body>
                    <ShowroomForm />
                </body>
            </html>
        );
    }

    // Get showroom data
    await getShowroom();

    // Get cars
    const GetCars = await getCars();

    // No cars? Show AddCar form
    if (!GetCars || GetCars.length === 0) {
        return (
            <html>
                <body>
                    <AddCar />
                </body>
            </html>
        );
    }

    // Cars exist? Show dashboard
    return (
        <html>
            <body>
                <DashboardPage cars={GetCars} />
            </body>
        </html>
    );
}