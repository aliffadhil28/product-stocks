import { useEffect, useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { fetchPost } from '@/hooks/Api';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { MultiSelect } from '@/Components/ui/multi-select';

const FormPage = ({ show, mode, onSubmit, onCancel, payload }) => {
    const formRef = useRef(null);
    const [roles, setRoles] = useState([]);

    // PERBAIKAN 1: Inisialisasi selectedRoles yang benar
    const [selectedRoles, setSelectedRoles] = useState(
        mode === 'edit' && payload?.role
            ? payload.role.map(val => val.id)
            : []
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);

        // Tambahkan selectedRoles ke formData
        selectedRoles.forEach(roleId => {
            formData.append('roles[]', roleId);
        });

        onSubmit(formData);
    }

    const fetchRoles = async () => {
        try {
            const response = await fetchPost('UserController', 'getRoles');
            if (response) {
                setRoles(response.data)
                // PERBAIKAN 2: Set selectedRoles hanya jika edit mode
                if (mode === 'edit' && payload?.role) {
                    setSelectedRoles(payload.role.map(val => val.id))
                }
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }

    useEffect(() => {
        if (show) {
            fetchRoles()
        } else {
            formRef.current?.reset();
            setSelectedRoles([]);
        }
    }, [show])

    // PERBAIKAN 3: Reset selectedRoles ketika mode/payload berubah
    useEffect(() => {
        if (mode === 'edit' && payload?.role) {
            setSelectedRoles(payload.role.map(val => val.id));
        } else {
            setSelectedRoles([]);
        }
    }, [mode, payload]);

    return (
        <>
            {show && (
                <Card className="w-full mx-auto sm:px-6 lg:px-8 p-4">
                    <CardHeader className="dark:text-white rounded-t-lg">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            {mode === 'add' ? 'Add New User' : 'Edit User'}
                        </CardTitle>
                        <CardDescription>
                            {mode === 'add'
                                ? 'Fill in the form to add a new user.'
                                : 'Update the user information below.'}
                        </CardDescription>
                    </CardHeader>

                    <form ref={formRef} onSubmit={handleSubmit}>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <input type="hidden" name="id" defaultValue={payload?.id || ''} />
                                {/* Section Kiri - Profile Image */}
                                <div className="flex flex-col items-center space-y-4">
                                    <img
                                        src={payload?.image || "/images/default-image.jpeg"}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border"
                                    />
                                    <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                        Upload
                                        <input
                                            type="file"
                                            name="profile_image"
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>

                                {/* Section Kanan - Form Input */}
                                <ScrollArea className="md:col-span-2 max-h-96">
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1" htmlFor="name">
                                                Name
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                defaultValue={payload?.name || ''}
                                                required
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1" htmlFor="email">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={payload?.email || ''}
                                                required
                                                className="w-full border rounded px-3 py-2"
                                                disabled={mode === 'edit'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1" htmlFor="role">
                                                Role
                                            </label>
                                            {/* PERBAIKAN 4: Struktur options yang benar */}
                                            <MultiSelect
                                                options={roles.map(role => ({
                                                    value: role.name, // PASTIKAN 'value' bukan 'defaultValue'
                                                    label: role.name
                                                }))}
                                                selected={selectedRoles}
                                                onChange={setSelectedRoles}
                                                placeholder='Select roles...'
                                                emptyText='No roles found.'
                                                className={'w-full border rounded px-3 py-2'}
                                            />
                                        </div>
                                        {mode === 'add' && (
                                            <div>
                                                <label className="block text-sm font-medium mb-1" htmlFor="password">
                                                    Password
                                                </label>
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    required
                                                    className="w-full border rounded px-3 py-2"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 text-sm font-medium"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-medium"
                            >
                                {mode === 'add' ? 'Add' : 'Update'} User
                            </button>
                        </CardFooter>
                    </form>
                </Card>
            )}
        </>
    )
}

export default FormPage