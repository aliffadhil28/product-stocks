<?php

namespace App\Http\Controllers\Api;

use App\Events\UserNotification;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    public function testNotification(){
        try {
            $message = 'Test Notifikasi ya gess !!';
            $user_id = Auth::user()->id;

            broadcast(new UserNotification($user_id, $message));

            Log::info("Broadcast event dikirim ke user {$user_id}");
            return response()->json([
                'status' => 'sent'
            ],200);
        }catch (\Exception $e){
            return response()->json([
                'message' => $e->getMessage()
            ],500);
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

    }

    public function store(Request $request){

    }

    public function destroy(Request $request, $id){

    }
}
