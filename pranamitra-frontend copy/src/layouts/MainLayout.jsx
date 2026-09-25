import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <>
            {/* Navbar will come here */}

            <main>
                <Outlet />
            </main>

            {/* Footer will come here */}
        </>
    );
}

export default MainLayout;