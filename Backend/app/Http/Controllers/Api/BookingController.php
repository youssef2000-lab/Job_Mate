<?php

// Backend/app/Http/Controllers/Api/BookingController.php
// ─────────────────────────────────────────────────────────────
// FIX 5: updateStatus() validation rejected all payment requests.
//
//   Original: 'status' => 'required|in:accepted,declined,completed'
//   The checkout flow sends { payment_status: 'paid' } with NO `status` field.
//   Laravel validation fails immediately → 422 → payment never recorded.
//
//   Fix: make `status` conditional with required_without:payment_status.
//   Either status OR payment_status must be provided, but not both required.
//
// FIX 6: store() didn't load the `client` relation.
//
//   Original: ->load(['service:id,title', 'provider:id,name'])
//   The transform() method references $b->client?->name for client_name.
//   Since client wasn't loaded, client_name was always null in the response.
//   (Booking saved correctly — only the response was incomplete.)
//
//   Fix: add 'client:id,name' to the load() call in store().
// ─────────────────────────────────────────────────────────────

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

        if ($request->user()->id === $service->provider_id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas réserver votre propre service.',
            ], 422);
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

        // FIX 6: added 'client:id,name' — was missing, causing null client_name
        return response()->json(
            $this->transform(
                $booking->load(['service:id,title', 'client:id,name', 'provider:id,name'])
            ),
            201
        );
    }

    // GET /api/bookings  (scoped to auth user role)
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Booking::with([
            'service:id,title,price',
            'client:id,name,phone',
            'provider:id,name',
        ])->latest();

        if ($user->isClient()) {
            $query->where('client_id', $user->id);
        } elseif ($user->isProvider()) {
            $query->where('provider_id', $user->id);
        }
        // admin sees all — no additional scope

        return response()->json(
            $query->get()->map(fn($b) => $this->transform($b))
        );
    }

    // PUT /api/bookings/{id}/status
    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('updateStatus', $booking);

        // FIX 5: separated validation — checkout sends ONLY payment_status,
        //         provider accept/decline sends ONLY status.
        //         Original 'status' => 'required' caused 422 on every payment.
        $request->validate([
            'status' => [
                'sometimes',
                'required_without:payment_status',
                'in:accepted,declined,completed',
            ],
            'payment_status' => [
                'sometimes',
                'required_without:status',
                'in:unpaid,paid,refunded',
            ],
        ]);

        // Only update fields that were actually sent in the request
        $update = [];
        if ($request->has('status'))         $update['status']         = $request->status;
        if ($request->has('payment_status')) $update['payment_status'] = $request->payment_status;

        $booking->update($update);
        $booking->load('service', 'client', 'provider');

        $data = $this->transform($booking);

        // Expose contact info only after payment confirmed
        if ($booking->payment_status === 'paid') {
            $data['provider_phone'] = $booking->provider?->phone;
            $data['client_phone']   = $booking->client?->phone;
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
