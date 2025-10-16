<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class MasterCustomerController extends Controller
{
    public function index()
    {
        $data = Customer::all();
        return DataTables::of($data)->make(true);
    }

    public function store(Request $request)
    {
        // Name, email, phone, address
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            $customer = Customer::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);
            DB::commit();
            return response()->json([
                'data' => $customer,
                'message' => 'Customer created successfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create customer',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        // id, name, email, phone, address
        $request->validate([
            'id' => 'required|exists:customers,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            $customer = Customer::find($request->id);
            $customer->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);
            DB::commit();
            return response()->json([
                'data' => $customer,
                'message' => 'Customer updated successfully'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to update customer',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        // id
        $request->validate([
            'id' => 'required|exists:customers,id',
        ]);

        DB::beginTransaction();
        try {
            $customer = Customer::find($request->id);
            $customer->delete();
            DB::commit();
            return response()->json([
                'message' => 'Customer deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to delete customer',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
