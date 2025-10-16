<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'email',
        'contact_person',
        'phone',
        'address',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            // hanya set code jika belum diisi
            if (empty($model->code)) {
                $model->code = \App\Services\CodeGeneratorService::generate('suppliers', 'SUP');
            }
        });
    }
}
