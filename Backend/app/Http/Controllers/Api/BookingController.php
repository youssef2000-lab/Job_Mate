<?php
// Backend/app/Http/Controllers/Api/BookingController.php
// ✅ FIX 5: updateStatus() validation was `'status' => 'required'`
// The checkout flow sends ONLY { payment_status: 'paid' } with no `status` field.
// This caused a 422 error on every payment attempt — payment never worked.
// Fix: make validation conditional — either status OR payment_status must be present.

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

        return response()->json(
            $this->transform($booking->load(['service:id,title', 'client:id,name', 'provider:id,name'])),
            201
        );
    }

    // GET /api/bookings
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $query = Booking::with(['service:id,title,price', 'client:id,name,phone', 'provider:id,name'])
            ->latest();

        if ($user->isClient()) {
            $query->where('client_id', $user->id);
        } elseif ($user->isProvider()) {
            $query->where('provider_id', $user->id);
        }

        return response()->json($query->get()->map(fn($b) => $this->transform($b)));
    }

    // PUT /api/bookings/{id}/status
    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('updateStatus', $booking);

        // ✅ FIX 5: separated validation — payment flow sends only payment_status,
        //            provider accept/decline sends only status.
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

        // Only update fields that were actually sent
        $update = array_filter([
            'status'         => $request->status,
            'payment_status' => $request->payment_status,
        ], fn($v) => $v !== null);

        $booking->update($update);
        $booking->load('service', 'client', 'provider');

        $data = $this->transform($booking);

        // Expose contact info only after payment confirmed
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
