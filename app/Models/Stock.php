<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'warehouse_id',
        'quantity',
    ];

    public function item()
    {
        return $this->belongsTo(Items::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
