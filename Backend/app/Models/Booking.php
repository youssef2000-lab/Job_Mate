<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id', 'client_id', 'provider_id',
        'client_message', 'amount', 'status', 'payment_status',
    ];

    public function service()  { return $this->belongsTo(Service::class); }
    public function client()   { return $this->belongsTo(User::class, 'client_id'); }
    public function provider() { return $this->belongsTo(User::class, 'provider_id'); }
    public function review()   { return $this->hasOne(Review::class); }
}