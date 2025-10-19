<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\GoodsReceipt;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class DeliveryController extends Controller
{
    public function index()
    {
        $data = Delivery::with(['salesOrder', 'warehouse', 'user', 'approver', 'items.item'])
            ->orderBy('created_at', 'desc');

        return DataTables::of($data)->make(true);
    }

    public function getFormData()
    {
        $salesOrders = SalesOrder::with('delivery')
            ->whereDoesntHave('delivery')
            ->where('status', 'approved')
            ->get();
        $warehouses = Warehouse::all();

        return response()->json([
            'order' => $salesOrders,
            'warehouse' => $warehouses,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sales_order_id' => 'required|exists:sales_orders,id|unique:deliveries,sales_order_id',
            'warehouse_id' => 'required|exists:warehouses,id',
        ]);

        DB::beginTransaction();
        try {
            $orderItems = SalesOrderItem::select('item_id','quantity')
                ->where('sales_order_id', $validated['sales_order_id'])
                ->get()
                ->toArray();

            $delivery = new Delivery();
            $delivery->sales_order_id = $validated['sales_order_id'];
            $delivery->warehouse_id = $validated['warehouse_id'];
            $delivery->user_id = $request->user()->id;
            $delivery->status = 'pending';
            $delivery->save();

            foreach ($orderItems as $item) {
                $delivery->items()->create([
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
            'id' => 'required|exists:deliveries,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'sales_order_id' => 'required|exists:sales_orders,id',
        ]);

        DB::beginTransaction();
        try {
            $delivery = Delivery::findOrFail($validated['id']);
            $delivery->warehouse_id = $validated['warehouse_id'];
            $delivery->sales_order_id = $validated['sales_order_id'];
            $delivery->save();

            $orderItems = SalesOrderItem::select('item_id','quantity')
                ->where('sales_order_id', $validated['sales_order_id'])
                ->get()
                ->toArray();

            if ($delivery->isDirty('sales_order_id')) {
                // Delete old items only if sales_order_id changed
                $delivery->items()->delete();

                // Add new items
                foreach ($orderItems as $item) {
                    $delivery->items()->create([
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
