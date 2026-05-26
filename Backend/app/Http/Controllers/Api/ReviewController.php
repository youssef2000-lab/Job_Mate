<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // POST /api/reviews
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        $booking = Booking::findOrFail($request->booking_id);

        // Only the client of this booking can review
        if ($booking->client_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        // Only review completed + paid bookings
        if ($booking->status !== 'completed') {
            return response()->json(['message' => 'La prestation doit être terminée.'], 422);
        }

        if ($booking->review) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis.'], 422);
        }

        $review = Review::create([
            'booking_id'  => $booking->id,
            'provider_id' => $booking->provider_id,
            'client_id'   => $request->user()->id,
            'rating'      => $request->rating,
            'comment'     => $request->comment,
        ]);

        return response()->json($review->load('client:id,name,avatar'), 201);
    }

    // GET /api/providers/{id}/reviews
    public function providerReviews(int $providerId): JsonResponse
    {
        $reviews = Review::with('client:id,name,avatar')
            ->where('provider_id', $providerId)
            ->latest()
            ->get()
            ->map(fn($r) => [
                'id'           => $r->id,
                'rating'       => $r->rating,
                'comment'      => $r->comment,
                'creator_name' => $r->client?->name,
                'creator_avatar' => $r->client?->avatar_url,
                'date'         => $r->created_at->diffForHumans(),
            ]);

        return response()->json($reviews);
    }
}