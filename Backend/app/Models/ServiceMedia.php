<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceMedia extends Model
{
    protected $fillable = ['service_id', 'path', 'type'];

    public function service() { return $this->belongsTo(Service::class); }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}