<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:150',
            'category'    => 'required|string|max:60',
            'description' => 'nullable|string|max:2000',
            'price'       => 'required|numeric|min:1|max:9999',
            'city'        => 'nullable|string|max:80',
            'country'     => 'nullable|string|max:80',
            'video_url'   => 'nullable|url',
            'gallery.*'   => 'nullable|image|max:4096',
            'certificates.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:4096',
        ];
    }
}