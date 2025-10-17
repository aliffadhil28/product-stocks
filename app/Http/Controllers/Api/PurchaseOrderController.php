<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Items, PurchaseOrder, PurchaseOrderItem, Supplier};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        $data = PurchaseOrder::with(['supplier', 'user', 'approver', 'orderItems.item'])->get();
        return DataTables::of($data)->make(true);
    }

    public function getFormData(Request $request)
    {
        // Contoh data tambahan yang mungkin diperlukan pada form
        $suppliers = Supplier::select('id', 'name')->get()->toArray();
        $items = Items::select('id', 'name', 'price')->get()->toArray();

        return response()->json([
            'suppliers' => $suppliers,
            'items' => $items,
        ], 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
        ]);

        $order_items = json_decode($request->order_items, true);
        if (empty($order_items) || !is_array($order_items)) {
            return response()->json([
                'message' => 'Order items are required and must be an array'
            ], 422);
        }
        DB::beginTransaction();
        try{
            $total_amount = 0;
            
            $purchaseOrder                  = new PurchaseOrder();
            $purchaseOrder->supplier_id     = $validatedData['supplier_id'];
            $purchaseOrder->user_id         = $request->user()->id;
            $purchaseOrder->total_amount    = 0;
            $purchaseOrder->save();
            
            foreach ($order_items as $item) {
                $orderItem = new PurchaseOrderItem();
                $orderItem->purchase_order_id = $purchaseOrder->id;
                $orderItem->item_id           = $item['item_id'];
                $orderItem->quantity          = $item['quantity'];
                $orderItem->price             = $item['sub_total'] / $item['quantity'];
                $orderItem->subtotal          = $item['sub_total'];
                $orderItem->save();
                
                $total_amount += round($orderItem->subtotal, 2);
            }
            
            $is_auto_approve = round($total_amount, 2) < 10000000;
            $purchaseOrder->total_amount    = round($total_amount, 2);
            $purchaseOrder->status          = $is_auto_approve ? 'approved' : 'pending';
            if ($is_auto_approve) {
                $purchaseOrder->approved_by = $request->user()->id;
                $purchaseOrder->approved_at = now();
            }
            $purchaseOrder->save();

            DB::commit();
            return response()->json([
                'message' => 'Purchase order created successfully',
                'data' => $purchaseOrder
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'required|exists:purchase_orders,id',
            'supplier_id' => 'required|exists:suppliers,id',
        ]);

        $order_items = json_decode($request->order_items, true);
        if (empty($order_items) || !is_array($order_items)) {
            return response()->json([
                'message' => 'Order items are required and must be an array'
            ], 422);
        }

        DB::beginTransaction();
        try{
            $is_auto_approve = $validatedData['total_amount'] < 10000000;
            $total_amount = 0;

            $purchaseOrder                  = PurchaseOrder::findOrFail($validatedData['id']);
            $purchaseOrder->supplier_id     = $validatedData['supplier_id'];
            foreach ($order_items as $item) {
                $orderItem = new PurchaseOrderItem();
                $orderItem->purchase_order_id = $purchaseOrder->id;
                $orderItem->item_id           = $item['item_id'];
                $orderItem->quantity          = $item['quantity'];
                $orderItem->price             = $item['sub_total'] / $item['quantity'];
                $orderItem->subtotal          = $item['sub_total'];
                $orderItem->save();

                $total_amount += round($orderItem->subtotal, 2);
            }

            $is_auto_approve = round($total_amount, 2) < 10000000;
            $purchaseOrder->total_amount    = round($total_amount, 2);

            $purchaseOrder->updated_at      = now();
            if ($is_auto_approve && $purchaseOrder->status !== 'approved') {
                $purchaseOrder->status      = 'approved';
                $purchaseOrder->approved_by = $request->user()->id;
                $purchaseOrder->approved_at = now();
            } elseif (!$is_auto_approve) {
                $purchaseOrder->status      = 'pending';
                $purchaseOrder->approved_by = null;
                $purchaseOrder->approved_at = null;
            }
            $purchaseOrder->save();

            DB::commit();
            return response()->json([
                'message' => 'Purchase order updated successfully',
                'data' => $purchaseOrder
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'required|exists:purchase_orders,id',
        ]);
        $id = $validatedData['id'];

        DB::beginTransaction();
        try{
            $purchaseOrder = PurchaseOrder::findOrFail($id);
            $purchaseOrder->delete();

            DB::commit();
            return response()->json([
                'message' => 'Purchase order deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
