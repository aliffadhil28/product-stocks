import DashboardLayout from '@/Layouts/DashboardLayout'
import { useState, useEffect, useMemo } from 'react'
import LucideIcon from '@/Components/LucideIcons';
import FormPage from './GoodReceipt/FormPage';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Separator } from '@/Components/ui/separator';
import { hasPermission, hasRole } from '@/utils/userAccess';
import { encodeActions } from '@/utils/encodeActions';
import { fetchPost } from '@/hooks/Api';

// TanStack Table imports
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import DetailPage from './GoodReceipt/DetailPage';
import { toast } from 'sonner';
import { formatDateTime, numberFormat, numberToCurrency } from '@/utils/helper';
import StatusBadge from '@/Components/StatusBadge';

const GoodReceipt = () => {
    const [isIndexShown, setIsIndexShown] = useState(true);
    const [mode, setMode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState('');
    const [payload, setPayload] = useState(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const controller = "GoodReceiptController";

    const handleAdd = () => {
        setIsIndexShown(false);
        setMode('add');
    }

    const handleEdit = (item) => {
        setIsIndexShown(false);
        setMode('edit');
        // Pass item data to FormPage
        // You might need to set selected item state here
        setPayload(item);
    }

    const handleDelete = async (receiptId) => {
        try {
            const response = await fetchPost(controller, 'destroy', { id: receiptId });
            if (response) {
                // Remove receipt from state
                setReceipts(receipts.filter(item => item.id !== receiptId));
                // Or refetch receipts
                fetchReceipts();
                toast.success(response.message || 'Receipt deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting receipt:', error);
        }
    }

    const handleCancel = () => {
        setIsIndexShown(true);
        setMode(null);
        setPayload(null);
    }

    const handleSubmit = async (formData) => {
        try {
            if (mode === 'add') {
                const response = await fetchPost(controller, 'store', formData);
                if (response) {
                    fetchReceipts(); // Refresh the table
                    handleCancel();
                    toast.success(response.message || 'Receipt created successfully');
                }
            } else if (mode === 'edit') {
                const response = await fetchPost(controller, 'update', { id: payload.id, ...formData });
                if (response) {
                    fetchReceipts(); // Refresh the table
                    handleCancel();
                    toast.success(response.message || 'Receipt updated successfully');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    const fetchReceipts = async () => {
        setIsLoading(true);
        try {
            const response = await fetchPost(controller, 'index', {});
            if (response) {
                setReceipts(response.data || []);
            }
        } catch (error) {
            toast.error('Error fetching receipts:', error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleView = (item) => {
        setIsIndexShown(false);
        setMode('view');
        setPayload(item);
    }

    // Column definitions using TanStack Table
    const columnHelper = createColumnHelper();

    const columns = useMemo(
        () => [
            columnHelper.accessor('code', {
                header: 'Code',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('purchase_order.code', {
                header: 'PO Code',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('user.name', {
                header: 'User',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('warehouse.name', {
                header: 'Warehouse',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: info => <StatusBadge status={info.getValue()} />,
            }),
            columnHelper.accessor('created_at', {
                header: 'Created At',
                cell: info => formatDateTime(info.getValue()),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: info => (
                    <div className="flex gap-2">
                        {(hasPermission('good-receipt/view') || hasRole('admin')) && (
                            <button
                                onClick={() => { handleView(info.row.original) }}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                title="View"
                            >
                                <LucideIcon name="Eye" className="w-4 h-4" />
                            </button>
                        )}
                        {(hasPermission('good-receipt/edit') || hasRole('admin')) && (info.row.original.status !== 'approved' && info.row.original.status !== 'rejected') && (
                            <button
                                onClick={() => handleEdit(info.row.original)}
                                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                title="Edit"
                            >
                                <LucideIcon name="Edit" className="w-4 h-4" />
                            </button>
                        )}
                        {(hasPermission('good-receipt/delete') || hasRole('admin')) && (info.row.original.status === 'rejected') && (
                            <>
                                <AlertDialog>
                                    <AlertDialogTrigger className='p-1 text-red-600 hover:text-red-800 transition-colors'>
                                        <LucideIcon name="Trash2" className="w-4 h-4" />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure you want to delete {info.row.original.name}?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the receipt
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(info.row.original.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        )}
                    </div>
                ),
            }),
        ],
        [receipts]
    );

    const table = useReactTable({
        data: receipts,
        columns,
        state: {
            sorting,
            globalFilter: filtering,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    useEffect(() => {
        if (isIndexShown) {
            fetchReceipts();
        }
    }, [isIndexShown]);

    return (
        <DashboardLayout header="Good Receipts">
            <div className="py-6">
                {isIndexShown && (
                    <Card className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <CardHeader className="flex justify-between items-center flex-row">
                            <CardTitle>Good Receipts List</CardTitle>
                            <button
                                style={{ display: hasPermission('good-receipt/create') || hasRole('admin') ? 'inline-flex' : 'none' }}
                                type="button"
                                className="bg-primary text-white dark:text-gray-100 px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-medium"
                                onClick={handleAdd}
                            >
                                <LucideIcon name="Plus" className="w-4 h-4 mr-2 inline-block text-white dark:text-gray-100" />
                                Add Item
                            </button>
                        </CardHeader>
                        <Separator />
                        <CardContent className="mt-4">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <span className="ml-2">Loading...</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Search Input */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md">
                                            <LucideIcon name="Search" className="w-4 h-4 text-gray-400 dark:text-gray-500 m-3 rounded-md" />
                                            <input
                                                value={filtering}
                                                onChange={e => setFiltering(e.target.value)}
                                                placeholder="Search items..."
                                                className="px-3 py-2 bg-white dark:bg-gray-800 border-none focus:ring-300 dark:focus:ring-gray-600 rounded-sm"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Showing {table.getPrePaginationRowModel().rows.length} of {receipts.length} items
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-x-auto border rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                {table.getHeaderGroups().map(headerGroup => (
                                                    <tr key={headerGroup.id}>
                                                        {headerGroup.headers.map(header => (
                                                            <th
                                                                key={header.id}
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={header.column.getToggleSortingHandler()}
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    {flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    )}
                                                                    {header.column.getIsSorted() && (
                                                                        <LucideIcon
                                                                            name={header.column.getIsSorted() === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                                                                            className="w-4 h-4"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                                {table.getRowModel().rows.map(row => (
                                                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        {row.getVisibleCells().map(cell => (
                                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                            </span>
                                            <select
                                                value={table.getState().pagination.pageSize}
                                                onChange={e => table.setPageSize(Number(e.target.value))}
                                                className="px-3 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-sm"
                                            >
                                                {[10, 20, 30, 40, 50].map(pageSize => (
                                                    <option key={pageSize} value={pageSize}>
                                                        Show {pageSize}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => table.setPageIndex(0)}
                                                disabled={!table.getCanPreviousPage()}
                                                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LucideIcon name="ChevronsLeft" className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => table.previousPage()}
                                                disabled={!table.getCanPreviousPage()}
                                                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LucideIcon name="ChevronLeft" className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => table.nextPage()}
                                                disabled={!table.getCanNextPage()}
                                                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LucideIcon name="ChevronRight" className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                                disabled={!table.getCanNextPage()}
                                                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LucideIcon name="ChevronsRight" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
                <DetailPage
                    show={!isIndexShown && mode === 'view' && payload}
                    onCancel={handleCancel}
                    payload={payload}
                />
                <FormPage
                    show={!isIndexShown && ((mode === 'edit' && payload) || mode === 'add')}
                    mode={mode}
                    payload={payload}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </DashboardLayout>
    )
}

export default GoodReceipt