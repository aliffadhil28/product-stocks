<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class MasterSupplierController extends Controller
{
    public function index()
    {
        $data = Supplier::all();
        return DataTables::of($data)->make(true);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'contact_person' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:50',
                'email' => 'nullable|email|max:255',
                'address' => 'nullable|string|max:500',
            ]);

            $supplier = Supplier::create(
                [
                    'name' => $request->name,
                    'contact_person' => $request->contact_person,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'address' => $request->address,
                ]
            );

            DB::commit();
            return response()->json([
                'message' => 'Supplier created successfully',
                'data' => $supplier
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Error creating supplier: " . $e->getMessage(),
                'error' => $e
            ], 500);
        }
    }

    public function update(Request $request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'contact_person' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:50',
                'email' => 'nullable|email|max:255',
                'address' => 'nullable|string|max:500',
            ]);

            $supplier = Supplier::findOrFail($request->id);
            $supplier->update([
                'name' => $request->name,
                'contact_person' => $request->contact_person,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address,
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Supplier updated successfully',
                'data' => $supplier
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Error updating supplier: " . $e->getMessage(),
                'error' => $e
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $supplier = Supplier::findOrFail($request->id);
            $supplier->delete();

            DB::commit();
            return response()->json([
                'message' => 'Supplier deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Error deleting supplier: " . $e->getMessage(),
                'error' => $e
            ], 500);
        }
    }
}
