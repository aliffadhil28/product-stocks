<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiGatewayController;
// use App\Http\Controllers\Controller;
use App\Models\{GroupMenu, Menu, Permission};
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PermissionController extends ApiGatewayController
{
    public function index(Request $request)
    {
        $roles = Role::with('permissions')->get()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ];
        })->toArray();
        $permissions = Permission::get()->pluck('name')->toArray();
        $menus = Menu::get()->pluck('name')->toArray();
        $groupMenus = GroupMenu::with('menus')->get()->map(function ($group) {
            return [
                'id' => $group->id,
                'name' => $group->name,
                'menus' => $group->menus->pluck('name')->toArray(),
            ];
        })->toArray();

        $this->userHasPermission('permissions/manage');

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions,
            'menus' => $menus,
            'groupMenus' => $groupMenus,
        ],200);
    }

    public function storeMenu(Request $request){
        DB::beginTransaction();
        try{
            $exist = Menu::where('name', $request->name)->first();
            if($exist){
                return response()->json([
                    'message' => 'Menu already exists',
                ], 400);
            }

            $menu = new Menu();

            $menu->name = $request->name;
            $menu->path = $request->path;
            $menu->icon = $request->icon;
            $menu->group_id = $request->group_id;

            $menu->save();

            $permissionsDefault = ['view', 'create', 'edit', 'delete'];
            foreach($permissionsDefault as $perm){
                $permissionName = str_replace(' ', '-',strtolower($menu->name)) . '/' . $perm;
                $permission = Permission::create(['name' => $permissionName ,'guard_name' => 'web']);
                $adminRole = Role::where('name', 'admin')->first();
                if($adminRole && $permission){
                    $adminRole->givePermissionTo($permission);
                }
            }

            DB::commit();
            return response()->json([
                'message' => 'Menu created successfully',
                'menu' => $menu,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create menu',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function storeGroup(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $exist = GroupMenu::where('name', $request->name)->first();
            if($exist){
                return response()->json([
                    'message' => 'Group already exists',
                ], 400);
            }

            $group = GroupMenu::create([
                'name' => $request->name,
                'icon' => $request->icon,
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Group created successfully',
                'data' => $group ?? '-',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create group',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function storePermission(Request $request){
        $request->validate([
            'menu' => 'required|string|max:255',
            'permission' => 'required|string|max:255|unique:permissions,name',
        ]);

        DB::beginTransaction();
        try {
            $permissionName = strtolower($request->menu) . '/' . $request->permission;
            $exist = Permission::where('name', $permissionName)->first();
            if($exist){
                return response()->json([
                    'message' => 'Permission already exists',
                ], 400);
            }

            $permission = Permission::create([
                'name' => $permissionName,
                'guard_name' => 'web',
            ]);
            
            $adminRole = Role::where('name', 'admin')->first();
            if($adminRole){
                $adminRole->givePermissionTo($permissionName);
            }

            DB::commit();
            return response()->json([
                'message' => 'Permission created successfully',
                'data' => $permission,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create permission',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function saveRolePermissions (Request $request) {
        DB::beginTransaction();
        try {
            $userRole = Role::where('name', $request->role)->first();
            $userRole->givePermissionTo($request->permissions);
            
            DB::commit();
            return response()->json([
                'message' => "Permission for $request->role set successfully"
            ], 200);
        } catch (\Exception $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to save role permission',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function deleteMenu(Request $request){
        DB::beginTransaction();
        try {
            $menu_name = ucwords(str_replace('-', ' ', $request->menu));
            $menu = Menu::where('name', $menu_name)->first();
            if(is_null($menu)){
                return response()->json([
                    'message' => 'Menu tidak ditemukan'
                ], 404);
            }

            $menu->delete();

            Permission::where('name', 'like', "%$request->menu/%")->delete();

            DB::commit();
            return response()->json([
                'message' => "Permissions $request->menu is deleted include menu"
            ], 200);
        } catch (\Exception $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
                'line' => $th->getLine(),
                'file' => $th->getFile()
            ], 500);
        }
    }

    public function deletePermission(Request $request){
        DB::beginTransaction();
        try{
            $permission = Permission::where('name', $request->permission)->first();
            if(is_null($permission)){
                return response()->json([
                    'message' => 'Permission tidak ditemukan'
                ], 404);
            }

            $permission->delete();

            DB::commit();
            return response()->json([
                'message' => "Permission $request->permission deleted successfully"
            ], 200);
        } catch (\Exception $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
                'line' => $th->getLine(),
                'file' => $th->getFile()
            ], 500);
        }
    }
}
