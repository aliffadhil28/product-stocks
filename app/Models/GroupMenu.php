<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupMenu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon',
    ];

    public function menus()
    {
        return $this->hasMany(Menu::class, 'group_id');
    }
}
