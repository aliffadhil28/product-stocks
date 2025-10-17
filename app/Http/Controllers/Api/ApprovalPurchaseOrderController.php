<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Approval;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class ApprovalPurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        $data = PurchaseOrder::with(['supplier','user', 'orderItems.item'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');

        return DataTables::of($data)->make(true);
    }

    public function approve(Request $request)
    {
        DB::beginTransaction();
        try {
            $purchaseOrder = PurchaseOrder::findOrFail($request->id);
            $purchaseOrder->status = 'approved';
            $purchaseOrder->approved_by = $request->user()->id;
            $purchaseOrder->approved_at = now();
            $purchaseOrder->save();

            $approve = new Approval([
                'approvable_type' => PurchaseOrder::class,
                'approvable_id' => $purchaseOrder->id,
                'status' => 'approved',
                'approved_by' => $request->user()->id,
            ]);
            $approve->save();

            DB::commit();
            return response()->json(['message' => 'Purchase order approved successfully.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to approve purchase order.'], 500);
        }
    }

    public function reject(Request $request)
    {
        DB::beginTransaction();
        try {
            $purchaseOrder = PurchaseOrder::findOrFail($request->id);
            $purchaseOrder->status = 'rejected';
            $purchaseOrder->save();

            $reject = new Approval([
                'approvable_type' => PurchaseOrder::class,
                'approvable_id' => $purchaseOrder->id,
                'status' => 'rejected',
                'approved_by' => $request->user()->id,
                'note' => $request->rejection_reason,
            ]);
            $reject->save();

            DB::commit();
            return response()->json(['message' => 'Purchase order rejected successfully.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to reject purchase order.'], 500);
        }
    }
}
