<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class CodeGeneratorService
{
    public static function generate(string $tableName, string $prefix, string $column = 'code'): string
    {
        // Ambil kode terakhir (dengan lock baris)
        $lastRecord = DB::table($tableName)
            ->where($column, 'like', $prefix . '%')
            ->orderBy($column, 'desc')
            ->sharedLock() // menggunakan shared lock agar aman dibaca paralel
            ->first();

        $newNumber = $lastRecord
            ? intval(substr($lastRecord->$column, strlen($prefix))) + 1
            : 1;

        return $prefix . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }
}
