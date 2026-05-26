<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', 'provider_id', 'client_id', 'rating', 'comment',
    ];

    protected $casts = ['rating' => 'integer'];

    public function booking()  { return $this->belongsTo(Booking::class); }
    public function provider() { return $this->belongsTo(User::class, 'provider_id'); }
    public function client()   { return $this->belongsTo(User::class, 'client_id'); }
}