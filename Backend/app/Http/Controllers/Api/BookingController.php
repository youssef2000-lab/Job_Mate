<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingRequest;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // POST /api/bookings
    public function store(BookingRequest $request): JsonResponse
    {
        $service = Service::findOrFail($request->service_id);

        // Prevent provider from booking own service
        if ($request->user()->id === $service->provider_id) {
            return response()->json(['message' => 'Vous ne pouvez pas réserver votre propre service.'], 422);
        }

        $booking = Booking::create([
            'service_id'     => $service->id,
            'client_id'      => $request->user()->id,
            'provider_id'    => $service->provider_id,
            'client_message' => $request->client_message,
            'amount'         => $service->price,
            'status'         => 'pending',
            'payment_status' => 'unpaid',
        ]);

        return response()->json($this->transform($booking->load(['service:id,title', 'provider:id,name'])), 201);
    }

    // GET /api/bookings  (scoped to auth user role)
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Booking::with(['service:id,title,price', 'client:id,name,phone', 'provider:id,name'])
            ->latest();

        if ($user->isClient()) {
            $query->where('client_id', $user->id);
        } elseif ($user->isProvider()) {
            $query->where('provider_id', $user->id);
        }
        // admin sees all — no additional scope

        $bookings = $query->get()->map(fn($b) => $this->transform($b));

        return response()->json($bookings);
    }

    // PUT /api/bookings/{id}/status
    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('updateStatus', $booking);

        $request->validate([
            'status'         => 'required|in:accepted,declined,completed',
            'payment_status' => 'sometimes|in:unpaid,paid,refunded',
        ]);

        $booking->update($request->only('status', 'payment_status'));

        // If paid, expose contact info
        $data = $this->transform($booking->load('service', 'client', 'provider'));
        if ($booking->payment_status === 'paid') {
            $data['provider_phone'] = $booking->provider->phone;
            $data['client_phone']   = $booking->client->phone;
        }

        return response()->json($data);
    }

    private function transform(Booking $b): array
    {
        return [
            'id'             => $b->id,
            'service_id'     => $b->service_id,
            'service_title'  => $b->service?->title,
            'client_id'      => $b->client_id,
            'client_name'    => $b->client?->name,
            'provider_id'    => $b->provider_id,
            'provider_name'  => $b->provider?->name,
            'client_message' => $b->client_message,
            'amount'         => $b->amount,
            'status'         => $b->status,
            'payment_status' => $b->payment_status,
            'created_at'     => $b->created_at,
        ];
    }
}