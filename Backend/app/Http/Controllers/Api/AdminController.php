<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // GET /api/admin/dashboard
    public function dashboard(): JsonResponse
    {
        return response()->json([
            'total_users'     => User::count(),
            'total_providers' => User::where('role', 'provider')->count(),
            'total_clients'   => User::where('role', 'client')->count(),
            'total_services'  => Service::count(),
            'total_bookings'  => Booking::count(),
            'total_revenue'   => Booking::where('payment_status', 'paid')->sum('amount'),
            'pending_bookings'  => Booking::where('status', 'pending')->count(),
            'unverified_providers' => User::where('role', 'provider')
                ->where('is_verified', false)->count(),
        ]);
    }

    // GET /api/admin/users
    public function users(Request $request): JsonResponse
    {
        $users = User::when($request->role, fn($q, $r) => $q->where('role', $r))
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%$s%")
                ->orWhere('email', 'like', "%$s%"))
            ->latest()
            ->paginate(20);

        return response()->json($users);
    }

    // GET /api/admin/services
    public function services(Request $request): JsonResponse
    {
        $services = Service::with('provider:id,name,email')
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20);

        return response()->json($services);
    }

    // GET /api/admin/bookings
    public function bookings(Request $request): JsonResponse
    {
        $bookings = Booking::with([
                'service:id,title',
                'client:id,name,email',
                'provider:id,name,email',
            ])
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20);

        return response()->json($bookings);
    }

    // DELETE /api/admin/users/{id}
    public function deleteUser(User $user): JsonResponse
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Impossible de supprimer un admin.'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    // DELETE /api/admin/services/{id}
    public function deleteService(Service $service): JsonResponse
    {
        $service->delete();
        return response()->json(['message' => 'Service supprimé.']);
    }

    // PUT /api/admin/users/{id}/verify
    public function verifyUser(User $user): JsonResponse
    {
        $user->update(['is_verified' => ! $user->is_verified]);
        return response()->json([
            'message'     => $user->is_verified ? 'Prestataire vérifié.' : 'Vérification retirée.',
            'is_verified' => $user->is_verified,
        ]);
    }

    // PUT /api/admin/services/{id}/status
    public function updateServiceStatus(Request $request, Service $service): JsonResponse
    {
        $request->validate(['status' => 'required|in:active,pending,rejected']);
        $service->update(['status' => $request->status]);
        return response()->json(['message' => 'Statut mis à jour.', 'status' => $service->status]);
    }
}