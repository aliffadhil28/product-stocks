import { useState, useEffect, useMemo } from 'react'
import LucideIcon from '@/Components/LucideIcons';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { Separator } from '@/Components/ui/separator';
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
import { toast } from 'sonner';
import { formatDateTime, numberFormat } from '@/utils/helper';

const WarehouseStocks = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [stocks, setStocks] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const controller = "DashboardController";

    const fetchStocks = async () => {
        setIsLoading(true);
        try {
            const response = await fetchPost(controller, 'getWarehouseData', {});
            if (response) {
                setStocks(response.data || []);
            }
        } catch (error) {
            toast.error('Error fetching stocks');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // Column definitions using TanStack Table
    const columnHelper = createColumnHelper();

    const columns = useMemo(
        () => [
            columnHelper.accessor('warehouse.name', {
                header: 'Warehouse',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('item.code', {
                header: 'Item Code',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('item.name', {
                header: 'Item Name',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('quantity', {
                header: 'Quantity',
                cell: info => numberFormat(info.getValue()),
            }),
            columnHelper.accessor('item.unit', {
                header: 'Unit',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('updated_at', {
                header: 'Last Updated',
                cell: info => formatDateTime(info.getValue()),
            }),
        ],
        [stocks]
    );

    const table = useReactTable({
        data: stocks,
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
        fetchStocks();
    }, []);

    return (
        <Card className="max-w-7xl mx-auto sm:px-6 lg:px-8 my-3">
            <CardHeader className="flex justify-between items-center flex-row">
                <CardTitle>Warehouse Stocks List</CardTitle>
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
                                    placeholder="Search stocks..."
                                    className="px-3 py-2 bg-white dark:bg-gray-800 border-none focus:ring-300 dark:focus:ring-gray-600 rounded-sm"
                                />
                            </div>
                            <div className="text-sm text-gray-500">
                                Showing {table.getPrePaginationRowModel().rows.length} of {stocks.length} stocks
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
    )
}

export default WarehouseStocks