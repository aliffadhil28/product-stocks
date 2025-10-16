<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = ['user_id','message','is_read'];

    protected $appends = ['time_ago'];

    public function getTimeAgoAttribute()
    {
        return Carbon::parse($this->created_at)
            ->timezone('Asia/Jakarta') // ubah ke WIB
            ->diffForHumans();
    }
}
