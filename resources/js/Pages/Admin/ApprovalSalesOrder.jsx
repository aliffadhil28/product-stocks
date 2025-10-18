import DashboardLayout from '@/Layouts/DashboardLayout'
import { useState, useEffect, useMemo, useRef } from 'react'
import LucideIcon from '@/Components/LucideIcons';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separator';
import { hasPermission, hasRole } from '@/utils/userAccess';
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
import DetailPage from './SalesOrder/DetailPage';
import { toast } from 'sonner';
import { formatDateTime, numberToCurrency } from '@/utils/helper';
import StatusBadge from '@/Components/StatusBadge';
import ComboBox from '@/Components/ComboBox';

const ApprovalSalesOrder = () => {
    const [isIndexShown, setIsIndexShown] = useState(true);
    const [mode, setMode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState('');
    const [payload, setPayload] = useState(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const comboBoxRef = useRef(null);


    const controller = "ApprovalSalesOrderController";

    useEffect(() => {
        const fetchWarehouses = async () => {
            const response = await fetchPost(controller, "fetchWarehouses", {});
            if (response) {
                setWarehouses(response.data || []);
            }
        };

        fetchWarehouses();
    }, []);

    const handleComboBoxChange = (value) => {
        setSelectedWarehouse(value);
    };

    const clearSelection = () => {
        setSelectedWarehouse(null);
        // Hanya clear via ref jika ref tersedia
        if (comboBoxRef.current) {
            comboBoxRef.current.clearValue();
        }
    };

    const handleApproveWithRef = (id) => {
        // Jika ada ref, ambil value dari ref, jika tidak pakai state
        const warehouseValue = comboBoxRef.current 
            ? comboBoxRef.current.getValue() 
            : selectedWarehouse;
        
        handleApprove(id, warehouseValue);
        clearSelection();
    };

    const handleApprove = async (orderId, warehouseId) => {
        try {
            const response = await fetchPost(controller, 'approve', { id: orderId, warehouse_id: warehouseId });
            if (response) {
                fetchOrders();
                toast.success(response.message || 'Sales order approved successfully');
            }
        } catch (error) {
            console.error('Error approving order:', error);
            toast.error('Failed to approve sales order');
        }
    }

    const handleRejectClick = (order) => {
        setSelectedOrder(order);
        setRejectReason('');
        setShowRejectDialog(true);
    }

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        try {
            const response = await fetchPost(controller, 'reject', {
                id: selectedOrder.id,
                rejection_reason: rejectReason
            });
            if (response) {
                fetchOrders();
                setShowRejectDialog(false);
                setRejectReason('');
                setSelectedOrder(null);
                toast.success(response.message || 'Sales order rejected successfully');
            }
        } catch (error) {
            console.error('Error rejecting order:', error);
            toast.error('Failed to reject sales order');
        }
    }

    const handleCancel = () => {
        setIsIndexShown(true);
        setMode(null);
        setPayload(null);
    }

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await fetchPost(controller, 'index', {});
            if (response) {
                setOrders(response.data || []);
            }
        } catch (error) {
            toast.error('Error fetching orders');
            console.error('Error:', error);
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
            columnHelper.accessor('customer.name', {
                header: 'Customer',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('user.name', {
                header: 'User',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('total_amount', {
                header: 'Total Amount',
                cell: info => numberToCurrency(info.getValue()),
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
                        {(hasPermission('approval-sales-order/view') || hasRole('admin')) && (
                            <button
                                onClick={() => { handleView(info.row.original) }}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                title="View"
                            >
                                <LucideIcon name="Eye" className="w-4 h-4" />
                            </button>
                        )}
                        {(hasPermission('approval-sales-order/approve') || hasRole('admin')) && info.row.original.status === 'pending' && (
                            <>
                                <AlertDialog>
                                    <AlertDialogTrigger
                                        className='p-1 text-green-600 hover:text-green-800 transition-colors'
                                        onClick={() => setSelectedWarehouse(null)} // Reset saat buka dialog
                                    >
                                        <LucideIcon name="CheckCircle" className="w-4 h-4" />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Approve Sales Order</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                <p>
                                                    Are you sure you want to approve sales order <strong>{info.row.original.code}</strong>?
                                                    This action cannot be undone.
                                                </p>

                                                <label className="block text-sm font-medium mt-4 mb-2">
                                                    Select Warehouse <span className="text-red-500">*</span>
                                                </label>
                                                <ComboBox
                                                    ref={comboBoxRef} // Optional ref
                                                    data={warehouses.map(warehouse => ({
                                                        label: warehouse.name,
                                                        value: warehouse.id
                                                    }))}
                                                    name="warehouse"
                                                    value={selectedWarehouse}
                                                    setValue={setSelectedWarehouse}
                                                />
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setSelectedWarehouse(null)}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    handleApproveWithRef(info.row.original.id);
                                                    setSelectedWarehouse(null); // Reset setelah approve
                                                }}
                                                disabled={!selectedWarehouse}
                                            >
                                                Approve
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <button
                                    onClick={() => handleRejectClick(info.row.original)}
                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                    title="Reject"
                                >
                                    <LucideIcon name="XCircle" className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                ),
            }),
        ],
        [orders]
    );

    const table = useReactTable({
        data: orders,
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
            fetchOrders();
        }
    }, [isIndexShown]);

    return (
        <DashboardLayout header="Approval Sales Orders">
            <div className="py-6">
                {isIndexShown && (
                    <Card className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <CardHeader className="flex justify-between items-center flex-row">
                            <CardTitle>Sales Orders Approval List</CardTitle>
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
                                                placeholder="Search orders..."
                                                className="px-3 py-2 bg-white dark:bg-gray-800 border-none focus:ring-300 dark:focus:ring-gray-600 rounded-sm"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Showing {table.getPrePaginationRowModel().rows.length} of {orders.length} orders
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

                {/* Reject Dialog */}
                <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Reject Sales Order</DialogTitle>
                            <DialogDescription>
                                Please provide a reason for rejecting sales order <strong>{selectedOrder?.code}</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <label className="block text-sm font-medium mb-2">
                                Rejection Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter reason for rejection..."
                                className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowRejectDialog(false);
                                    setRejectReason('');
                                    setSelectedOrder(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleRejectSubmit}
                            >
                                Reject Order
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DetailPage
                    show={!isIndexShown && mode === 'view' && payload}
                    onCancel={handleCancel}
                    payload={payload}
                />
            </div>
        </DashboardLayout>
    )
}

export default ApprovalSalesOrder;