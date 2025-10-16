<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_id',
        'item_id',
        'quantity',
    ];

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }

    public function item()
    {
        return $this->belongsTo(Items::class);
    }
}
