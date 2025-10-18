<?php

namespace App\Models;

use App\Services\CodeGeneratorService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'sales_order_id',
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
                $model->code = CodeGeneratorService::generate('deliveries', 'DLV');
            }
        });
    }

    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function items()
    {
        return $this->hasMany(DeliveryItem::class);
    }
}
