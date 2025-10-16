<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // 1️⃣ Seed Warehouses
        $warehouses = [
            ['name' => 'Gudang Utama', 'location' => 'Jakarta'],
            ['name' => 'Gudang Cabang Bandung', 'location' => 'Bandung'],
            ['name' => 'Gudang Surabaya', 'location' => 'Surabaya'],
        ];

        DB::table('warehouses')->insert(array_map(function ($w) {
            $w['created_at'] = now();
            $w['updated_at'] = now();
            return $w;
        }, $warehouses));

        // 2️⃣ Seed Suppliers
        $suppliers = [];
        for ($i = 1; $i <= 10; $i++) {
            $suppliers[] = [
                'code' => 'SUP' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => $faker->company,
                'address' => $faker->address,
                'contact_person' => $faker->name,
                'phone' => $faker->phoneNumber,
                'email' => $faker->unique()->safeEmail,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('suppliers')->insert($suppliers);

        // 3️⃣ Seed Customers
        $customers = [];
        for ($i = 1; $i <= 15; $i++) {
            $customers[] = [
                'code' => 'CUS' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => $faker->name,
                'address' => $faker->address,
                'phone' => $faker->phoneNumber,
                'email' => $faker->unique()->safeEmail,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('customers')->insert($customers);

        // 4️⃣ Seed Items (Pet Food & Supplies)
        $itemNames = [
            'Royal Canin Adult Dog Food',
            'Whiskas Tuna Cat Food',
            'Purina Puppy Chow',
            'Me-O Mackerel Cat Food',
            'Pedigree Beef Adult',
            'Friskies Ocean Fish',
            'SmartHeart Puppy Milk',
            'Dog Choize Chicken Flavour',
            'Whiskas Kitten Mackerel',
            'Royal Canin Persian Cat',
            'Vitakraft Cat Stick Salmon',
            'Purina Cat Chow',
            'Felix Tuna Jelly Cat Food',
            'Equilibrio Adult Dog Food',
            'Bolt Cat Food Ocean Fish',
            'Blackwood Lamb & Rice',
            'Pro Plan Small Puppy',
            'Dr.Clauder Adult Cat',
            'Excel Catnip Treats',
            'Kit Cat Breath Bites Tuna',
        ];

        $units = ['kg', 'gr', 'pack', 'pcs', 'box'];
        $items = [];

        foreach ($itemNames as $index => $name) {
            $items[] = [
                'code' => 'ITM' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'name' => $name,
                'unit' => $faker->randomElement($units),
                'price' => $faker->randomFloat(2, 20000, 250000),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('items')->insert($items);

        // 5️⃣ Seed Stocks (spread items across warehouses)
        $stocks = [];
        $warehouseIds = DB::table('warehouses')->pluck('id');
        $itemIds = DB::table('items')->pluck('id');

        foreach ($warehouseIds as $warehouseId) {
            foreach ($itemIds as $itemId) {
                $stocks[] = [
                    'warehouse_id' => $warehouseId,
                    'item_id' => $itemId,
                    'quantity' => $faker->numberBetween(50, 500),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('stocks')->insert($stocks);
    }
}
