import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { User, Mail, Calendar, Shield, Hash } from 'lucide-react'
import React from 'react'

const DetailPage = ({ show, onCancel, payload }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <>
            {show && payload && (
                <Card className="w-full mx-4 shadow">
                    <CardHeader className="dark:text-white rounded-t-lg">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <User className="h-6 w-6" />
                            Detail Pengguna
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
                        {/* Column 1 */}
                        <div className="p-4 w-full md:w-2/5">
                            <div className="mb-4">
                                <img
                                    src={
                                        payload.profile_photo_url
                                            ? (payload.profile_photo_url.startsWith('http') 
                                                ? payload.profile_photo_url 
                                                : `/storage/${payload.profile_photo_url}`)
                                            : '/images/default-image.jpeg'
                                    }
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover mx-auto"
                                />
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">{payload.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">{formatDate(payload.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">{payload.role.map((role) => role.name).join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Hash className="h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">{payload.id}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-gray-50 px-6 py-4 rounded-b-lg">
                        <div className="flex justify-end w-full">
                            <Button
                                onClick={onCancel}
                                variant="outline"
                                className="px-6 py-2 hover:bg-gray-100"
                            >
                                Tutup
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </>
    )
}

export default DetailPage