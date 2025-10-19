<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GroupMenu;
use App\Models\Menu;

class GroupMenuAndMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- SEED GROUP MENU ---
        $groups = [
            [
                'name' => 'management',
                'icon' => 'Building2',
                'created_at' => null,
                'updated_at' => null,
            ],
            [
                'name' => 'master',
                'icon' => 'Settings',
                'created_at' => '2025-10-16 15:57:35',
                'updated_at' => '2025-10-16 15:57:35',
            ],
            [
                'name' => 'transaksi',
                'icon' => 'ArrowLeftRight',
                'created_at' => '2025-10-16 15:59:24',
                'updated_at' => '2025-10-16 15:59:24',
            ],
            [
                'name' => 'approval',
                'icon' => 'Signature',
                'created_at' => '2025-10-16 16:02:15',
                'updated_at' => '2025-10-16 16:02:15',
            ],
        ];

        GroupMenu::insert($groups);

        // Ambil ulang ID-nya berdasarkan nama (agar foreign key benar)
        $management = GroupMenu::where('name', 'management')->first()->id ?? null;
        $master = GroupMenu::where('name', 'master')->first()->id ?? null;
        $transaksi = GroupMenu::where('name', 'transaksi')->first()->id ?? null;
        $approval = GroupMenu::where('name', 'approval')->first()->id ?? null;

        // --- SEED MENU ---
        $menus = [
            [
                'name' => 'Dashboard',
                'path' => '/dashboard',
                'icon' => 'LayoutDashboard',
                'group_id' => null,
                'created_at' => null,
                'updated_at' => null,
            ],
            [
                'name' => 'Users',
                'path' => '/users',
                'icon' => 'Users',
                'group_id' => $management,
                'created_at' => null,
                'updated_at' => null,
            ],
            [
                'name' => 'Permissions',
                'path' => '/permissions',
                'icon' => 'Settings',
                'group_id' => $management,
                'created_at' => null,
                'updated_at' => null,
            ],
            [
                'name' => 'Items',
                'path' => '/items',
                'icon' => 'LayoutList',
                'group_id' => $master,
                'created_at' => '2025-10-16 15:57:36',
                'updated_at' => '2025-10-16 15:57:36',
            ],
            [
                'name' => 'Supplier',
                'path' => '/supplier',
                'icon' => 'UserStar',
                'group_id' => $master,
                'created_at' => '2025-10-16 15:58:14',
                'updated_at' => '2025-10-16 15:58:14',
            ],
            [
                'name' => 'Customer',
                'path' => '/customer',
                'icon' => 'CircleUser',
                'group_id' => $master,
                'created_at' => '2025-10-16 15:58:35',
                'updated_at' => '2025-10-16 15:58:35',
            ],
            [
                'name' => 'Purchase Order',
                'path' => '/purchase-order',
                'icon' => 'ShoppingBag',
                'group_id' => $transaksi,
                'created_at' => '2025-10-16 15:59:24',
                'updated_at' => '2025-10-16 15:59:24',
            ],
            [
                'name' => 'Good Receipt',
                'path' => '/good-receipt',
                'icon' => 'Receipt',
                'group_id' => $transaksi,
                'created_at' => '2025-10-16 15:59:49',
                'updated_at' => '2025-10-16 15:59:49',
            ],
            [
                'name' => 'Sales Order',
                'path' => '/sales-order',
                'icon' => 'Package',
                'group_id' => $transaksi,
                'created_at' => '2025-10-16 16:00:30',
                'updated_at' => '2025-10-16 16:00:30',
            ],
            [
                'name' => 'Delivery',
                'path' => '/delivery',
                'icon' => 'PackageCheck',
                'group_id' => $transaksi,
                'created_at' => '2025-10-16 16:00:58',
                'updated_at' => '2025-10-16 16:00:58',
            ],
            [
                'name' => 'Approval Purchase Order',
                'path' => '/approval-purchase-order',
                'icon' => 'CircleCheck',
                'group_id' => $approval,
                'created_at' => '2025-10-16 16:02:15',
                'updated_at' => '2025-10-16 16:02:15',
            ],
            [
                'name' => 'Approval Good Receipt',
                'path' => '/approval-good-receipt',
                'icon' => 'FileCheck',
                'group_id' => $approval,
                'created_at' => '2025-10-16 16:03:18',
                'updated_at' => '2025-10-16 16:03:18',
            ],
            [
                'name' => 'Approval Sales Order',
                'path' => '/approval-sales-order',
                'icon' => 'SquareCheckBig',
                'group_id' => $approval,
                'created_at' => '2025-10-16 16:04:00',
                'updated_at' => '2025-10-16 16:04:00',
            ],
            [
                'name' => 'Approval Delivery',
                'path' => '/approval-delivery',
                'icon' => 'PackageCheck',
                'group_id' => $approval,
                'created_at' => '2025-10-16 16:04:44',
                'updated_at' => '2025-10-16 16:04:44',
            ],
        ];

        Menu::insert($menus);
    }
}
