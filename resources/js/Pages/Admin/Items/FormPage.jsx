import { useEffect, useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { ScrollArea } from '@/Components/ui/scroll-area';

const FormPage = ({ show, mode, onSubmit, onCancel, payload }) => {
    const formRef = useRef(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        unit: '',
        price: ''
    });

    useEffect(() => {
        // Reset form saat modal ditutup
        if (!show) {
            setFormData({
                id: '',
                name: '',
                unit: '',
                price: ''
            });
            return;
        }else if (payload && mode === 'edit') {
            setFormData({
                id: payload.id || '',
                name: payload.name || '',
                unit: payload.unit || '',
                price: payload.price || ''
            });
        }

        // Kosongkan form untuk mode add
        if (mode === 'add') {
            setFormData({
                id: '',
                name: '',
                unit: '',
                price: ''
            });
        }
    }, [show, mode, payload]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        data.append('id', formData.id);
        const formDataEntries = Object.fromEntries(data.entries());
        // console.log(formDataEntries);
        
        onSubmit(formDataEntries);
    };

    useEffect(() => {
        if (!show) {
            formRef.current?.reset();
        }
    }, [show])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <>
            {show && (
                <Card className="w-full mx-auto sm:px-6 lg:px-8 p-4">
                    <CardHeader className="dark:text-white rounded-t-lg">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            {mode === 'add' ? 'Add New Item' : 'Edit Item'}
                        </CardTitle>
                        <CardDescription>
                            {mode === 'add'
                                ? 'Fill in the form to add a new item.'
                                : 'Update the item information below.'}
                        </CardDescription>
                    </CardHeader>

                    <form ref={formRef} onSubmit={handleSubmit}>
                        <CardContent className="p-6">
                            <ScrollArea className="max-h-96">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="name">
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="unit">
                                            Unit
                                        </label>
                                        <input
                                            id="unit"
                                            name="unit"
                                            type="text"
                                            value={formData.unit}
                                            onChange={handleChange}
                                            required
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="price">
                                            Price
                                        </label>
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </ScrollArea>
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
                                {mode === 'add' ? 'Add' : 'Update'} Item
                            </button>
                        </CardFooter>
                    </form>
                </Card>
            )}
        </>
    )
}

export default FormPage
