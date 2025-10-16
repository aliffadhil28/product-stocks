<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Clear cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions
        Permission::create(['name' => 'products/view']);
        Permission::create(['name' => 'products/create']);
        Permission::create(['name' => 'products/edit']);
        Permission::create(['name' => 'products/delete']);
        Permission::create(['name' => 'products/manage']);

        // Permission for manage permissions
        Permission::create(['name' => 'permissions/view']);
        Permission::create(['name' => 'permissions/create']);
        Permission::create(['name' => 'permissions/edit']);
        Permission::create(['name' => 'permissions/delete']);
        Permission::create(['name' => 'permissions/manage']);

        // Permission for dashboard
        Permission::create(['name' => 'dashboard/view']);
        Permission::create(['name' => 'dashboard/edit']);
        Permission::create(['name' => 'dashboard/delete']);

        // Permission for users
        Permission::create(['name' => 'users/view']);
        Permission::create(['name' => 'users/create']);
        Permission::create(['name' => 'users/edit']);
        Permission::create(['name' => 'users/delete']);
        Permission::create(['name' => 'users/manage']);

        // Create roles
        $admin = Role::create(['name' => 'admin']);
        $manager = Role::create(['name' => 'manager']);
        $staff = Role::create(['name' => 'staff']);

        // Assign permissions to roles
        $admin->givePermissionTo(Permission::all());
        $manager->givePermissionTo(['products/view', 'products/create', 'products/edit']);
        $staff->givePermissionTo(['products/view']);
    }
}