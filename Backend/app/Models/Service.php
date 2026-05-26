<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id', 'title', 'category',
        'description', 'price', 'city', 'country',
        'video_url', 'status',
    ];

    protected $casts = [
        'price' => 'float',
    ];

    // ─── Relationships ────────────────────────────
    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasManyThrough(Review::class, Booking::class);
    }

    public function media()
    {
        return $this->hasMany(ServiceMedia::class);
    }

    public function gallery()
    {
        return $this->hasMany(ServiceMedia::class)->where('type', 'gallery');
    }

    public function certificates()
    {
        return $this->hasMany(ServiceMedia::class)->where('type', 'certificate');
    }

    // ─── Computed ─────────────────────────────────
    public function getAverageRatingAttribute(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    public function getReviewsCountAttribute(): int
    {
        return $this->reviews()->count();
    }
}