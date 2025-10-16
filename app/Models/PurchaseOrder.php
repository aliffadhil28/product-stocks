<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'supplier_id',
        'user_id',
        'status',
        'total_amount',
        'approved_by',
        'approved_at',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
