import { useEffect, useRef, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { ScrollArea } from '@/Components/ui/scroll-area';
import { toast } from 'sonner';
import { fetchPost } from '@/hooks/Api';
import ComboBox from '@/Components/ComboBox'

const FormPage = ({ show, mode, onSubmit, onCancel, payload }) => {
    const formRef = useRef(null);

    const [orders, setOrders] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        sales_order_id: '',
        warehouse_id: '',
    });

    useEffect(() => {
        // Reset form saat modal ditutup
        if (!show) {
            setFormData({
                id: '',
                sales_order_id: '',
                warehouse_id: '',
            });
            return;
        }

        fetchFormData();

        // Isi ulang data ketika payload berubah (mode edit)
        if (payload && mode === 'edit') {
            setFormData({
                id: payload.id || '',
                sales_order_id: payload.sales_order_id || '',
                warehouse_id: payload.warehouse_id || ''
            });
        }

        // Kosongkan form untuk mode add
        if (mode === 'add') {
            setFormData({
                id: '',
                sales_order_id: '',
                warehouse_id: ''
            });
        }
    }, [payload, show, mode]);

    const fetchFormData = async () => {
        try {
            const response = await fetchPost('DeliveryController', 'getFormData', {});
            if (response) {
                setOrders(response?.order || []);
                setWarehouses(response?.warehouse || []);
            }
        } catch (error) {
            console.error("Error fetching form data:", error);
            toast.error("Gagal memuat data form." + error.message);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        data.append('id', formData.id);
        const formDataEntries = Object.fromEntries(data.entries());
        onSubmit(formDataEntries);
    };

    return (
        <Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {mode === 'add' ? 'Add New Delivery' : 'Edit Delivery'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'add'
                            ? 'Fill in the form to add a new delivery.'
                            : 'Update the delivery information below.'}
                    </DialogDescription>
                </DialogHeader>

                <form ref={formRef} onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={formData.id} />

                    <ScrollArea className="h-[150px] pr-4">
                        <div className="space-y-4 px-1">
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="sales_order">
                                    Sales Order
                                </label>
                                <ComboBox
                                    data={orders.map(order => ({
                                        label: order.code,
                                        value: order.id
                                    }))}
                                    name="sales_order"
                                    value={formData.sales_order_id}
                                    setValue={(value) => setFormData((prev) => ({ ...prev, sales_order_id: value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="warehouse">
                                    Warehouse
                                </label>
                                <ComboBox
                                    data={warehouses.map(warehouse => ({
                                        label: warehouse.name,
                                        value: warehouse.id
                                    }))}
                                    name="warehouse"
                                    value={formData.warehouse_id}
                                    setValue={(value) => setFormData((prev) => ({ ...prev, warehouse_id: value }))}
                                />
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                        >
                            {mode === 'add' ? 'Add' : 'Update'} Delivery
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormPage;