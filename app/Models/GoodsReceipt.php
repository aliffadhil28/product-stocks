<?php

namespace App\Models;

use App\Services\CodeGeneratorService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoodsReceipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'purchase_order_id',
        'warehouse_id',
        'user_id',
        'status',
        'approved_by',
        'approved_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            // hanya set code jika belum diisi
            if (empty($model->code)) {
                $model->code = CodeGeneratorService::generate('goods_receipts', 'GRN');
            }
        });
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_order_id', 'id');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function receiptItems()
    {
        return $this->hasMany(GoodReceiptItems::class, 'good_receipt_id');
    }
}
