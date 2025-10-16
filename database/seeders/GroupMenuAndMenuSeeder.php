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
        // Seed GroupMenu
        $groups = [
            [
                'name' => 'management',
                'icon' => 'Building2',
            ],
            [
                'name' => 'analytics',
                'icon' => 'BarChart3',
            ],
        ];

        GroupMenu::insert($groups);

        // Seed Menu
        $menu = [
            [
                'name' => 'Dashboard',
                'path' => '/dashboard',
                'group_id' => null,
                'icon' => 'LayoutDashboard',
            ],
            [
                'name' => 'Products',
                'path' => '/products',
                'group_id' => GroupMenu::where('name', 'management')->first()->id,
                'icon' => 'Package',
            ],
            [
                'name' => 'Users',
                'path' => '/users',
                'group_id' => GroupMenu::where('name', 'management')->first()->id,
                'icon' => 'Users',
            ],
            [
                'name' => 'Permissions',
                'path' => '/permissions',
                'group_id' => GroupMenu::where('name', 'management')->first()->id,
                'icon' => 'Settings',
            ],
            [
                'name' => 'Visitor',
                'path' => '/visitor',
                'group_id' => GroupMenu::where('name', 'analytics')->first()->id,
                'icon' => 'BarChart3',
            ],
        ];
        
        Menu::insert($menu);
    }
}
