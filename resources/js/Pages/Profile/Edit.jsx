import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <DashboardLayout
            user={auth.user}
            header="Profile"
        >
            <Head title="Profile" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-900 shadow sm:rounded-lg">
                        <Tabs defaultValue='updateProfile'>
                            <TabsList>
                                <TabsTrigger value="updateProfile">Update Profile</TabsTrigger>
                                <TabsTrigger value="updatePassword">Update Password</TabsTrigger>
                                <TabsTrigger value="deleteUser">Delete User</TabsTrigger>
                            </TabsList>
                            <TabsContent value="updateProfile">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </TabsContent>
                            <TabsContent value="updatePassword">
                                <UpdatePasswordForm className="max-w-xl" />
                            </TabsContent>
                            <TabsContent value="deleteUser">
                                <DeleteUserForm className="max-w-xl" />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
