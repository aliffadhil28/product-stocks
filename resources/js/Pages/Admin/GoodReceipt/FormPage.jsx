import { useEffect, useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { fetchPost } from '@/hooks/Api';
import ComboBox from '@/Components/ComboBox'

const FormPage = ({ show, mode, onSubmit, onCancel, payload }) => {
    const formRef = useRef(null);

    const [orders, setOrders] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        purchase_order_id: '',
        warehouse_id: '',
    });

    useEffect(() => {
        // Reset form saat modal ditutup
        if (!show) {
            setFormData({
                id: '',
                purchase_order_id: '',
                warehouse_id: '',
            });
            return;
        }

        fetchFormData();

        // Isi ulang data ketika payload berubah (mode edit)
        if (payload && mode === 'edit') {
            setFormData({
                id: payload.id || '',
                purchase_order_id: payload.purchase_order_id || '',
                warehouse_id: payload.warehouse_id || ''
            });
        }

        // Kosongkan form untuk mode add
        if (mode === 'add') {
            setFormData({
                id: '',
                purchase_order_id: '',
                warehouse_id: ''
            });
        }
    }, [payload, show, mode]);

    const fetchFormData = async () => {
        try {
            const response = await fetchPost('GoodReceiptController', 'getFormData', {});
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
                        {mode === 'add' ? 'Add New GRN' : 'Edit GRN'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'add'
                            ? 'Fill in the form to add a new goods receipt note.'
                            : 'Update the goods receipt note information below.'}
                    </DialogDescription>
                </DialogHeader>

                <form ref={formRef} onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={formData.id} />

                    <ScrollArea className="h-[150px] pr-4">
                        <div className="space-y-4 px-1">
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="purchase_order">
                                    Purchase Order
                                </label>
                                <ComboBox
                                    data={orders.map(order => ({
                                        label: order.code,
                                        value: order.id
                                    }))}
                                    name="purchase_order"
                                    value={formData.purchase_order_id}
                                    setValue={(value) => setFormData((prev) => ({ ...prev, purchase_order_id: value }))}
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
                            {mode === 'add' ? 'Add' : 'Update'} Receipt
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormPage;