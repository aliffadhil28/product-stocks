<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoodReceiptItems extends Model
{
    use HasFactory;

    protected $fillable = [
        'good_receipt_id',
        'item_id',
        'quantity'
    ];

    public function goodReceipt()
    {
        return $this->belongsTo(GoodsReceipt::class);
    }

    public function item()
    {
        return $this->belongsTo(Items::class);
    }
}
