import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { User, Mail, Phone, Home, Calendar } from 'lucide-react'
import React from 'react'

const DetailPage = ({ show, onCancel, payload }) => {
    if (!show || !payload) return null;

    const details = [
        { icon: <User />, label: "Nama", value: payload.name },
        { icon: <Mail />, label: "Email", value: payload.email },
        { icon: <Phone />, label: "Telepon", value: payload.phone },
        { icon: <User />, label: "Contact Person", value: payload.contact_person },
        { icon: <Home />, label: "Alamat", value: payload.address },
        { icon: <Calendar />, label: "Dibuat", value: new Date(payload.created_at).toLocaleDateString() },
    ];

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Detail Supplier</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {details.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 border-b pb-2">
                        <div className="text-gray-400">
                            {React.cloneElement(item.icon, { size: 20 })}
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{item.label}</div>
                            <div className="text-gray-700">
                                {item.label === "Alamat" ? (
                                    <textarea 
                                        readOnly 
                                        value={item.value}
                                        className="w-full min-h-[60px] mt-1 text-sm"
                                    />
                                ) : item.value}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={onCancel}>
                        Tutup
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default DetailPage
