// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Dashboard() {
    return (
        <DashboardLayout
            header="Dashboard"
        >

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-200">You're logged in!</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
