<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GoodsReceipt;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class GoodReceiptController extends Controller
{
    public function index()
    {
        $data = GoodsReceipt::with(['purchaseOrder', 'warehouse', 'user', 'receiptItems.item'])
            ->orderBy('created_at', 'desc');

        return DataTables::of($data)->make(true);
    }

    public function getFormData()
    {
        $orders = PurchaseOrder::with('receipt')
            ->whereDoesntHave('receipt')
            ->where('status', 'approved')
            ->get();
        $warehouses = Warehouse::all();

        return response()->json([
            'order' => $orders,
            'warehouse' => $warehouses,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'warehouse_id' => 'required|exists:warehouses,id',
        ]);

        DB::beginTransaction();
        try {
            $orderItems = PurchaseOrderItem::select('item_id','quantity')
                ->where('purchase_order_id', $validated['purchase_order_id'])
                ->get()
                ->toArray();

            $goodsReceipt = new GoodsReceipt();
            $goodsReceipt->purchase_order_id = $validated['purchase_order_id'];
            $goodsReceipt->warehouse_id = $validated['warehouse_id'];
            $goodsReceipt->user_id = $request->user()->id;
            $goodsReceipt->status = 'pending';
            $goodsReceipt->save();

            foreach ($orderItems as $item) {
                $goodsReceipt->receiptItems()->create([
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }
            DB::commit();
            return response()->json([
                'message' => 'Goods receipt created successfully.'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create goods receipt.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request){
        $validated = $request->validate([
            'id' => 'required|exists:goods_receipts,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'purchase_order_id' => 'required|exists:purchase_orders,id',
        ]);

        DB::beginTransaction();
        try {
            $goodsReceipt = GoodsReceipt::findOrFail($validated['id']);
            $goodsReceipt->warehouse_id = $validated['warehouse_id'];
            $goodsReceipt->purchase_order_id = $validated['purchase_order_id'];
            $goodsReceipt->save();

            $orderItems = PurchaseOrderItem::select('item_id','quantity')
                ->where('purchase_order_id', $validated['purchase_order_id'])
                ->get()
                ->toArray();

            if ($goodsReceipt->isDirty('purchase_order_id')) {
                // Delete old items only if purchase_order_id changed
                $goodsReceipt->receiptItems()->delete();

                // Add new items
                foreach ($orderItems as $item) {
                    $goodsReceipt->receiptItems()->create([
                        'item_id' => $item['item_id'],
                        'quantity' => $item['quantity'],
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'message' => 'Goods receipt updated successfully.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update goods receipt.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
