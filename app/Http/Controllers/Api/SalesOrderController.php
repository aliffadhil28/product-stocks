<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Items;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class SalesOrderController extends Controller
{
    public function index(Request $request)
    {
        $data = SalesOrder::with(['customer', 'user', 'approver', 'items.item'])->get();
        return DataTables::of($data)->make(true);
    }

    public function getFormData(Request $request)
    {
        // Contoh data tambahan yang mungkin diperlukan pada form
        $customers = Customer::select('id', 'name')->get()->toArray();
        $items = Items::select('id', 'name', 'price')->get()->toArray();

        return response()->json([
            'customers' => $customers,
            'items' => $items,
        ], 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'customer_id' => 'required|exists:customers,id',
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
            
            $sales                  = new SalesOrder();
            $sales->customer_id     = $validatedData['customer_id'];
            $sales->user_id         = $request->user()->id;
            $sales->total_amount    = 0;
            $sales->save();
            
            foreach ($order_items as $item) {
                $orderItem = new SalesOrderItem();
                $orderItem->sales_order_id    = $sales->id;
                $orderItem->item_id           = $item['item_id'];
                $orderItem->quantity          = $item['quantity'];
                $orderItem->price             = $item['sub_total'] / $item['quantity'];
                $orderItem->subtotal          = $item['sub_total'];
                $orderItem->save();
                
                $total_amount += round($orderItem->subtotal, 2);
            }

            $sales->total_amount    = round($total_amount, 2);
            $sales->status          = 'pending';
            $sales->save();

            DB::commit();
            return response()->json([
                'message' => 'Purchase order created successfully',
                'data' => $sales
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
            'id' => 'required|exists:sales_orders,id',
            'customer_id' => 'required|exists:customers,id',
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

            $sales                  = SalesOrder::findOrFail($validatedData['id']);
            $sales->customer_id     = $validatedData['customer_id'];

            $sales->items()->delete();
            foreach ($order_items as $item) {
                $orderItem = new SalesOrderItem();
                $orderItem->sales_order_id    = $sales->id;
                $orderItem->item_id           = $item['item_id'];
                $orderItem->quantity          = $item['quantity'];
                $orderItem->price             = $item['sub_total'] / $item['quantity'];
                $orderItem->subtotal          = $item['sub_total'];
                $orderItem->save();

                $total_amount += round($orderItem->subtotal, 2);
            }

            $sales->total_amount    = round($total_amount, 2);

            $sales->updated_at      = now();
            $sales->save();

            DB::commit();
            return response()->json([
                'message' => 'Purchase order updated successfully',
                'data' => $sales
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
            'id' => 'required|exists:sales_orders,id',
        ]);
        $id = $validatedData['id'];

        DB::beginTransaction();
        try{
            $sales = SalesOrder::findOrFail($id);
            $sales->delete();

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
