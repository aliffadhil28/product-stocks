<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Approval;
use App\Models\Delivery;
use App\Models\SalesOrder;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class ApprovalSalesOrderController extends Controller
{
    public function index(Request $request)
    {
        $data = SalesOrder::with(['customer', 'user', 'approver', 'items.item'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');

        return DataTables::of($data)->make(true);
    }

    public function fetchWarehouses(Request $request)
    {
        $data = Warehouse::select('id', 'name')->get()->toArray();

        return response()->json([
            'data' => $data,
        ], 200);
    }

    public function approve(Request $request)
    {
        DB::beginTransaction();
        try {
            $salesOrder = SalesOrder::with('items.item')->where('id', $request->id)->firstOrFail();
            $salesOrder->status       = 'approved';
            $salesOrder->approved_by  = $request->user()->id;
            $salesOrder->approved_at  = now();
            $salesOrder->save();

            $approve                    = new Approval();
            $approve->approvable_type   = SalesOrder::class;
            $approve->approvable_id     = $salesOrder->id;
            $approve->status            = 'approved';
            $approve->approved_by       = $request->user()->id;
            $approve->save();

            DB::commit();
            return response()->json([
                'message' => 'Sales order approved successfully.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to approve sales order.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function reject(Request $request)
    {
        DB::beginTransaction();
        try {
            $salesOrder = SalesOrder::findOrFail($request->id);
            $salesOrder->status = 'rejected';
            $salesOrder->save();

            $reject = new Approval([
                'approvable_type' => SalesOrder::class,
                'approvable_id' => $salesOrder->id,
                'status' => 'rejected',
                'approved_by' => $request->user()->id,
                'note' => $request->rejection_reason,
            ]);
            $reject->save();

            DB::commit();
            return response()->json(['message' => 'Sales order rejected successfully.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to reject sales order.'], 500);
        }
    }
}
