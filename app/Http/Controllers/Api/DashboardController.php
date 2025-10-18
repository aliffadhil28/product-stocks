<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\PurchaseOrder;
use App\Models\SalesOrder;
use App\Models\Stock;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class DashboardController extends Controller
{
    public function getOverview() {
        $sales_count = SalesOrder::where('status', 'approved')->whereMonth('created_at', now()->month)->count();
        $delivery_count = Delivery::where('status', 'approved')->whereMonth('created_at', now()->month)->count();
        $purchase_count = PurchaseOrder::where('status', 'approved')->whereMonth('created_at', now()->month)->count();

        return response()->json([
            'sales_count' => $sales_count,
            'delivery_count' => $delivery_count,
            'purchase_count' => $purchase_count,
        ],200);
    }

    public function getWarehouseData(Request $request){
        $data = Stock::with(['item','warehouse'])->get();

        return DataTables::of($data)->make(true);
    }
}
