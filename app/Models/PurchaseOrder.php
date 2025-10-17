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

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            // hanya set code jika belum diisi
            if (empty($model->code)) {
                $model->code = \App\Services\CodeGeneratorService::generate('purchase_orders', 'PO');
            }
        });
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function orderItems()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by', 'id');
    }
}
