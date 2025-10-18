<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Approval;
use App\Models\Delivery;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class ApprovalDeliveryController extends Controller
{
    public function index(Request $request)
    {
        $data = Delivery::with(['salesOrder', 'warehouse', 'user', 'items.item'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');

        return DataTables::of($data)->make(true);
    }

    public function approve(Request $request)
    {
        DB::beginTransaction();
        try {
            $delivery = Delivery::where('id', $request->id)->firstOrFail();
            $delivery->status       = 'approved';
            $delivery->approved_by  = $request->user()->id;
            $delivery->approved_at  = now();
            $delivery->save();

            $checkStock = new Stock();
            foreach ($delivery->items as $item) {
                $stock = $checkStock->where('item_id', $item->item_id)->where('warehouse_id', $delivery->warehouse_id)->first();
                // dd($stock, $item);
                if ($stock) {
                    if ($stock->quantity < $item->quantity) {
                        throw new \Exception("Stok tidak cukup untuk item: " . $item->item->name);
                    }
                    $stock->quantity -= $item->quantity;
                    $stock->save();
                } else {
                    throw new \Exception("Tidak ada catatan stok ditemukan untuk item: " . $item->item->name);
                }
            }

            $approve                    = new Approval();
            $approve->approvable_type   = Delivery::class;
            $approve->approvable_id     = $delivery->id;
            $approve->status            = 'approved';
            $approve->approved_by       = $request->user()->id;
            $approve->save();

            DB::commit();
            return response()->json([
                'message' => 'Delivery approved successfully.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error approving delivery: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function reject(Request $request)
    {
        DB::beginTransaction();
        try {
            $delivery = Delivery::where('id', $request->id)->firstOrFail();
            $delivery->status       = 'rejected';
            $delivery->approved_by  = $request->user()->id;
            $delivery->approved_at  = now();
            $delivery->save();

            $approve                    = new Approval();
            $approve->approvable_type   = Delivery::class;
            $approve->approvable_id     = $delivery->id;
            $approve->status            = 'rejected';
            $approve->approved_by       = $request->user()->id;
            $approve->save();

            DB::commit();
            return response()->json([
                'message' => 'Delivery rejected successfully.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error rejecting delivery: ' . $e->getMessage(),
            ], 500);
        }
    }
}
