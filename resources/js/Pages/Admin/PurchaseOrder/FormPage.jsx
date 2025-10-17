import { useEffect, useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Plus, Trash2 } from 'lucide-react';
import { numberFormat, numberToCurrency } from '@/utils/helper'

const FormPage = ({ show, mode, onSubmit, onCancel, payload }) => {
    const formRef = useRef(null);

    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        supplier_id: '',
        order_items: [
            {
                item_id: '',
                quantity: '',
                sub_total: ''
            }
        ]
    });

    useEffect(() => {
        // Reset form saat modal ditutup
        if (!show) {
            setFormData({
                id: '',
                supplier_id: '',
                order_items: [
                    {
                        item_id: '',
                        quantity: '',
                        sub_total: ''
                    }
                ]
            });
            return;
        }

        fetchFormData();

        // Isi ulang data ketika payload berubah (mode edit)
        if (payload && mode === 'edit') {
            setFormData({
                id: payload.id || '',
                supplier_id: payload.supplier_id || '',
                order_items: payload.order_items.map(item => ({
                    item_id: item.item_id || '',
                    quantity: item.quantity || '',
                    sub_total: item.subtotal || ''
                })) || [
                    {
                        item_id: '',
                        quantity: '',
                        sub_total: ''
                    }
                ]
            });
        }

        // Kosongkan form untuk mode add
        if (mode === 'add') {
            setFormData({
                id: '',
                supplier_id: '',
                order_items: [
                    {
                        item_id: '',
                        quantity: '',
                        sub_total: ''
                    }
                ]
            });
        }
    }, [payload, show, mode]);

    const fetchFormData = async () => {
        try {
            const response = await fetchPost('PurchaseOrderController', 'getFormData', {});
            if (response) {
                setSuppliers(response?.suppliers || []);
                setItems(response?.items || []);
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

    const handleOrderItemChange = (index, field, value) => {
        const updatedItems = [...formData.order_items];
        updatedItems[index][field] = value;

        // Auto calculate sub_total if quantity changes and item is selected
        if (field === 'quantity' || field === 'item_id') {
            const selectedItem = items.find(item => item.id === updatedItems[index].item_id);
            if (selectedItem && updatedItems[index].quantity) {
                updatedItems[index].sub_total = selectedItem.price * updatedItems[index].quantity;
            }
        }

        setFormData((prev) => ({ ...prev, order_items: updatedItems }));
    };

    const addOrderItem = () => {
        setFormData((prev) => ({
            ...prev,
            order_items: [
                ...prev.order_items,
                {
                    item_id: '',
                    quantity: '',
                    sub_total: ''
                }
            ]
        }));
    };

    const removeOrderItem = (index) => {
        if (formData.order_items.length === 1) {
            toast.error("Minimal harus ada 1 item");
            return;
        }
        const updatedItems = formData.order_items.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, order_items: updatedItems }));
    };

    const calculateTotalAmount = () => {
        return formData.order_items.reduce((total, item) => {
            return total + (parseFloat(item.sub_total) || 0);
        }, 0);
    };

    const handleSubmit = () => {
        const data = new FormData();
        data.append('id', formData.id);
        data.append('supplier_id', formData.supplier_id);
        data.append('order_items', JSON.stringify(formData.order_items));
        const formDataEntries = Object.fromEntries(data.entries());
        onSubmit(formDataEntries);
    };

    if (!show) return null;
    
    return (
        <Card className="w-full mx-auto sm:px-6 lg:px-8 p-4">
            <CardHeader className="dark:text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    {mode === 'add' ? 'Add New PO' : 'Edit PO'}
                </CardTitle>
                <CardDescription>
                    {mode === 'add'
                        ? 'Fill in the form to add a new purchase order.'
                        : 'Update the purchase order information below.'}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
                <ScrollArea className="h-96">
                    <div className="space-y-4 pr-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="supplier">
                                Supplier
                            </label>
                            <ComboBox
                                data={suppliers.map(supplier => ({
                                    label: supplier.name,
                                    value: supplier.id
                                }))}
                                name="supplier"
                                value={formData.supplier_id}
                                setValue={(value) => setFormData((prev) => ({ ...prev, supplier_id: value }))}
                            />
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium">
                                    Order Items
                                </label>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={addOrderItem}
                                    className="flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Item
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {formData.order_items.map((orderItem, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">Item #{index + 1}</span>
                                            {formData.order_items.length > 1 && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => removeOrderItem(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Item
                                                </label>
                                                <ComboBox
                                                    data={items.map(item => ({
                                                        label: item.name,
                                                        value: item.id
                                                    }))}
                                                    name={`item_${index}`}
                                                    value={orderItem.item_id}
                                                    setValue={(value) => handleOrderItemChange(index, 'item_id', value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    value={orderItem.quantity}
                                                    onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
                                                    required
                                                    min="1"
                                                    className="w-full border rounded px-3 py-2"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Sub Total
                                                </label>
                                                <input
                                                    type="text"
                                                    value={numberFormat(orderItem.sub_total)}
                                                    onChange={(e) => handleOrderItemChange(index, 'sub_total', e.target.value)}
                                                    required
                                                    readOnly
                                                    className="w-full border rounded px-3 py-2 bg-muted"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total Amount:</span>
                                <span>{numberToCurrency(calculateTotalAmount())}</span>
                            </div>
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
                    type="button"
                    onClick={handleSubmit}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-medium"
                >
                    {mode === 'add' ? 'Add' : 'Update'} Purchase Order
                </button>
            </CardFooter>
        </Card>
    );
};

export default FormPage;