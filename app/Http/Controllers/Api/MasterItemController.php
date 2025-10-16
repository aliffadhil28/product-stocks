<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Items;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class MasterItemController extends Controller
{
    public function index()
    {
        $data = Items::all();
        return DataTables::of($data)->make(true);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $item = Items::create([
                'name' => $request->name,
                'unit' => $request->unit,
                'price' => $request->price
            ]);
            
            DB::commit();
            return response()->json([
                'message' => 'Item created successfully',
                'data' => $item
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error creating item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:items,id',
            'name' => 'required|string|max:255',
            'unit' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $item = Items::find($request->id);
            $item->update([
                'name' => $request->name,
                'unit' => $request->unit,
                'price' => $request->price
            ]);
            
            DB::commit();
            return response()->json([
                'message' => 'Item updated successfully',
                'data' => $item
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error updating item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $item = Items::findOrFail($request->id);
            $item->delete();

            DB::commit();
            return response()->json([
                'message' => 'Item deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Error deleting item: " . $e->getMessage(),
                'error' => $e
            ], 500);
        }
    }
}
