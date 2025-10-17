import React, { useEffect, useState } from 'react'

const StatusBadge = ({ status }) => {
    const [colorClass, setColorClass] = useState('')

    useEffect(() => {
        switch (status) {
            case 'draft':
                setColorClass('bg-gray-500 text-white')
                break
            case 'pending':
                setColorClass('bg-yellow-500 text-white')
                break
            case 'approved':
                setColorClass('bg-green-500 text-white')
                break
            case 'rejected':
                setColorClass('bg-red-500 text-white')
                break
            default:
                setColorClass('')
        }
    }, [status])

    return (
        <span className={`badge ${colorClass} px-2 py-1 rounded`}>{status[0].toUpperCase() + status.slice(1)}</span>
    )
}

export default StatusBadge