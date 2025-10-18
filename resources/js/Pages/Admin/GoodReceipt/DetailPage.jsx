import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { User, Info, Calendar, Package, Receipt, Barcode, Hash } from 'lucide-react'
import React from 'react'
import { numberFormat, numberToCurrency } from '@/utils/helper'
import StatusBadge from '@/Components/StatusBadge'

const DetailPage = ({ show, onCancel, payload }) => {
    if (!show || !payload) return null;

    const details = [
        { icon: <Hash />, label: "Kode", value: payload.code || '-' },
        { icon: <User />, label: "Warehouse", value: payload.warehouse?.name || '-' },
        { icon: <Barcode />, label: "PO CODE", value: payload.purchase_order?.code || '-' },
        { icon: <User />, label: "User", value: payload.user?.name || '-' },
        { icon: <Info />, label: "Status", value: <StatusBadge status={payload.status} /> || '-' },
        { icon: <User />, label: "Approved By", value: payload.approver?.name || '-' },
        { icon: <Calendar />, label: "Approved At", value: payload.approved_at ? new Date(payload.approved_at).toLocaleString() : '-' },
        { icon: <Calendar />, label: "Created At", value: payload.created_at ? new Date(payload.created_at).toLocaleString() : '-' },
        { icon: <Calendar />, label: "Updated At", value: payload.updated_at ? new Date(payload.updated_at).toLocaleString() : '-' },
    ];

    const receiptItems = payload.receipt_items || [];

    const calculateSubtotal = () => {
        return receiptItems.reduce((total, item) => total + (parseFloat(item.subtotal) || 0), 0);
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card Kiri - Detail Information */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Detail Good Receipt
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {details.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 border-b pb-3 last:border-b-0">
                                <div className="text-gray-400 mt-1">
                                    {React.cloneElement(item.icon, { size: 20 })}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-500 mb-1">{item.label}</div>
                                    <div className="text-gray-700 font-medium">
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Card Kanan - Order Items Receipt */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="w-5 h-5" />
                            Order Items
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-3">
                            {receiptItems.length > 0 ? (
                                <>
                                    {/* Items List */}
                                    <div className="space-y-3">
                                        {receiptItems.map((item, index) => (
                                            <div key={index} className="bg-muted/30 rounded-lg p-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex gap-3 flex-1">
                                                        <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                                            <Package className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm">
                                                                {item.item?.name || 'Item ' + (index + 1)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right font-semibold text-sm">
                                                        {item.quantity || 0} x
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>No items found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={onCancel}>
                    Tutup
                </Button>
            </div>
        </div>
    )
}

export default DetailPage