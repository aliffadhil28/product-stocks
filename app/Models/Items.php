<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Items extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'unit',
        'price',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            // hanya set code jika belum diisi
            if (empty($model->code)) {
                $model->code = \App\Services\CodeGeneratorService::generate('items', 'ITM');
            }
        });
    }
}
