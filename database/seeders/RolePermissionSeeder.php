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

        // === Define Permissions ===
        $permissions = [
            // Permission management
            'permissions/view', 'permissions/create', 'permissions/edit', 'permissions/delete', 'permissions/manage',

            // Dashboard
            'dashboard/view', 'dashboard/edit', 'dashboard/delete',

            // Users
            'users/view', 'users/create', 'users/edit', 'users/delete', 'users/manage',

            // Items
            'items/view', 'items/create', 'items/edit', 'items/delete',

            // Supplier
            'supplier/view', 'supplier/create', 'supplier/edit', 'supplier/delete',

            // Customer
            'customer/view', 'customer/create', 'customer/edit', 'customer/delete',

            // Purchase Order
            'purchase-order/view', 'purchase-order/create', 'purchase-order/edit', 'purchase-order/delete',

            // Good Receipt
            'good-receipt/view', 'good-receipt/create', 'good-receipt/edit', 'good-receipt/delete',

            // Sales Order
            'sales-order/view', 'sales-order/create', 'sales-order/edit', 'sales-order/delete',

            // Delivery
            'delivery/view', 'delivery/create', 'delivery/edit', 'delivery/delete',

            // Approval Purchase Order
            'approval-purchase-order/view', 'approval-purchase-order/create', 'approval-purchase-order/edit', 'approval-purchase-order/delete',
            'approval-purchase-order/reject', 'approval-purchase-order/approve',

            // Approval Good Receipt
            'approval-good-receipt/view', 'approval-good-receipt/create', 'approval-good-receipt/edit', 'approval-good-receipt/delete',

            // Approval Sales Order
            'approval-sales-order/view', 'approval-sales-order/create', 'approval-sales-order/edit', 'approval-sales-order/delete',

            // Approval Delivery
            'approval-delivery/view', 'approval-delivery/create', 'approval-delivery/edit', 'approval-delivery/delete',

            // Products
            'products/view', 'products/create', 'products/edit', 'products/delete', 'products/manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // === Create Roles ===
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $manager = Role::firstOrCreate(['name' => 'manager']);
        $staff = Role::firstOrCreate(['name' => 'staff']);

        // === Assign Permissions ===
        // Admin → semua permission
        $admin->givePermissionTo(Permission::all());

        // Manager → juga semua permission
        $manager->givePermissionTo(Permission::all());

        // Staff → hanya group transaksi
        $staffPermissions = [
            // Purchase Order
            'purchase-order/view', 'purchase-order/create', 'purchase-order/edit', 'purchase-order/delete',

            // Good Receipt
            'good-receipt/view', 'good-receipt/create', 'good-receipt/edit', 'good-receipt/delete',

            // Sales Order
            'sales-order/view', 'sales-order/create', 'sales-order/edit', 'sales-order/delete',

            // Delivery
            'delivery/view', 'delivery/create', 'delivery/edit', 'delivery/delete',
        ];

        $staff->givePermissionTo($staffPermissions);
    }
}
