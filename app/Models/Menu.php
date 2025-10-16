<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'path',
        'icon',
        'group_id',
    ];

    public function group()
    {
        return $this->belongsTo(GroupMenu::class, 'group_id');
    }

    public static function getMenuWithGroup(): array
    {
        return self::with(['group:id,name']) // hanya ambil kolom id & name
            ->select(['id', 'name', 'path', 'icon', 'group_id'])
            ->get()
            ->map(function ($menu) {
                return [
                    'id'    => $menu->id,
                    'name'  => $menu->name,
                    'path'  => $menu->path,
                    'icon'  => $menu->icon,
                    'group' => $menu->group ? $menu->group->name : null, // hanya ambil nama group
                ];
            })
            ->toArray();
    }
}
