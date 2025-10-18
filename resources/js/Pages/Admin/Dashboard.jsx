import { useEffect, useState } from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import CardOverview from '@/Components/CardOverview'
import { Package, Receipt, ShoppingCart } from 'lucide-react'
import { fetchPost } from '@/hooks/Api'
import WarehouseStocks from './Dashboard/WarehouseStocks'

export default function Dashboard() {
    const [overviews, setOverviews] = useState([
        {
            title: 'Delivery',
            value: 0,
            icon: Package,
            description: 'This month deliveries',
            key: 'delivery_count',
        },
        {
            title: 'Sales',
            value: 0,
            icon: ShoppingCart,
            description: 'This month sales',
            key: 'sales_count',
        },
        {
            title: 'Purchases',
            value: 0,
            icon: Receipt,
            description: 'This month purchases',
            key: 'purchase_count',
        },
    ])

    const [loading, setLoading] = useState(false)
    const controller = 'DashboardController'

    const fetchDataOverview = async () => {
        try {
            setLoading(true)
            const response = await fetchPost(controller, 'getOverview')
            if (response) {
                setOverviews((prev) =>
                    prev.map((item) => ({
                        ...item,
                        value: response[item.key] ?? 0,
                    }))
                )
            }
        } catch (error) {
            console.error('Failed to fetch overview data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDataOverview()
    }, [])

    return (
        <DashboardLayout header="Dashboard">
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {overviews.map((item, index) => (
                            <CardOverview
                                key={index}
                                title={item.title}
                                value={loading ? '...' : item.value}
                                icon={item.icon}
                                description={item.description}
                            />
                        ))}
                    </div>

                    <WarehouseStocks/>
                </div>
            </div>
        </DashboardLayout>
    )
}
