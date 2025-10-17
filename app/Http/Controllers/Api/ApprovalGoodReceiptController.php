<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Approval;
use App\Models\GoodsReceipt;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class ApprovalGoodReceiptController extends Controller
{
    public function index(){
        $data = GoodsReceipt::with(['purchaseOrder','warehouse', 'user', 'receiptItems.item'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');

        return DataTables::of($data)->make(true);
    }

    public function approve(Request $request)
    {
        DB::beginTransaction();
        try {
            $receipt = GoodsReceipt::findOrFail($request->id);
            $receipt->status = 'approved';
            $receipt->approved_by = $request->user()->id;
            $receipt->approved_at = now();
            $receipt->save();

            $stock = new Stock();
            foreach ($receipt->receiptItems as $item) {
                $stock->updateOrCreate(
                    [
                        'item_id' => $item->item_id,
                        'warehouse_id' => $receipt->warehouse_id,
                    ],
                    [
                        'quantity' => DB::raw('quantity + ' . $item->quantity),
                    ]
                );
            }

            $approve = new Approval([
                'approvable_type' => GoodsReceipt::class,
                'approvable_id' => $receipt->id,
                'status' => 'approved',
                'approved_by' => $request->user()->id,
            ]);
            $approve->save();

            DB::commit();
            return response()->json([
                'message' => 'Goods receipt approved successfully.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to approve goods receipt.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function reject(Request $request)
    {
        DB::beginTransaction();
        try {
            $receipt = GoodsReceipt::findOrFail($request->id);
            $receipt->status = 'rejected';
            $receipt->save();

            $reject = new Approval([
                'approvable_type' => GoodsReceipt::class,
                'approvable_id' => $receipt->id,
                'status' => 'rejected',
                'approved_by' => $request->user()->id,
                'note' => $request->rejection_reason,
            ]);
            $reject->save();

            DB::commit();
            return response()->json([
                'message' => 'Goods receipt rejected successfully.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to reject goods receipt.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
