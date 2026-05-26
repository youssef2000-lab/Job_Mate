<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'service_id'     => 'required|exists:services,id',
            'client_message' => 'nullable|string|max:1000',
        ];
    }
}