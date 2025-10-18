<?php

namespace App\Http\Controllers\Api;

use App\Events\UserNotification;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Yajra\DataTables\DataTables;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $data = User::with('role')->get();

        return DataTables::of($data)
            ->make(true);
    }

    public function getRoles(Request $request){
        try{
            $roles = Role::all();

            return response()->json([
                'data' => $roles,
                'message' => 'Roles data retrieved succesfully!'
            ], 200);
        }catch(\Exception $e){
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function getNotifications(Request $request){
        $data = Notification::where('user_id', $request->user_id)->latest();

        return response()->json([
            'data' => $data,
            'message' => 'Notification retrieved successfully'
        ],200);
    }

    public function setNotifRead(Request $request){
        DB::beginTransaction();
        try{
            $notif = Notification::find($request->id);
            $notif->is_read = true;
            $notif->save();

            DB::commit();
            return response()->json([
                'message' => 'Notification is read'
            ], 200);
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ],500);
        }
    }

    public function setAllNotifRead(Request $request){
        DB::beginTransaction();
        try{
            Notification::where('user_id', $request->user_id)
                ->update(['is_read' => true]);

            DB::commit();
            return response()->json([
                'message' => 'Notification is all read'
            ], 200);
        }catch(\Exception $e){
            DB::rollBack();
        return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ],500);
        }
    }

    public function detail(Request $request){
        
    }

    public function update(Request $request, $id){
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,'.$id,
                'password' => 'nullable|string|min:8',
                'roles' => 'required|array|min:1',
            ]);

            $user = User::findOrFail($id);
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }
            $user->save();

            $user->syncRoles($validated['roles']);
            DB::commit();
            return response()->json([
                'message' => 'User updated successfully',
                'data' => $user,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request){
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'roles' => 'required|array|min:1',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password'])
            ]);

            $user->assignRole($validated['roles']);
            DB::commit();
            return response()->json([
                'message' => 'User created successfully',
                'data' => $user,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request){
        DB::beginTransaction();
        try {
            $user = User::findOrFail($request->id);
            $user->delete();

            DB::commit();
            return response()->json([
                'message' => 'User deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
