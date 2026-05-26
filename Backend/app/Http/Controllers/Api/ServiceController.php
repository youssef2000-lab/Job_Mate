<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest;
use App\Models\Service;
use App\Models\ServiceMedia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    // GET /api/services
    public function index(Request $request): JsonResponse
    {
        $query = Service::with(['provider:id,name,avatar,is_verified', 'media'])
            ->where('status', 'active');

        if ($request->category && $request->category !== 'Tous') {
            $query->where('category', $request->category);
        }
        if ($request->search) {
            $q = $request->search;
            $query->where(function ($q2) use ($q) {
                $q2->where('title', 'like', "%$q%")
                   ->orWhere('description', 'like', "%$q%");
            });
        }
        if ($request->city)    $query->where('city', 'like', '%' . $request->city . '%');
        if ($request->country) $query->where('country', 'like', '%' . $request->country . '%');
        if ($request->max_price) $query->where('price', '<=', $request->max_price);

        $services = $query->latest()->paginate(12);

        return response()->json($this->transformPaginated($services));
    }

    // GET /api/services/{id}
    public function show(Service $service): JsonResponse
    {
        $service->load([
            'provider:id,name,avatar,phone,is_verified',
            'media',
            'reviews.client:id,name,avatar',
        ]);

        return response()->json($this->transformService($service, withContact: false));
    }

    // POST /api/services
    public function store(ServiceRequest $request): JsonResponse
    {
        $this->authorize('create', Service::class);

        $service = $request->user()->services()->create($request->validated());

        $this->handleMediaUploads($request, $service);

        return response()->json($this->transformService($service->fresh('media')), 201);
    }

    // PUT /api/services/{id}
    public function update(ServiceRequest $request, Service $service): JsonResponse
    {
        $this->authorize('update', $service);

        $service->update($request->validated());
        $this->handleMediaUploads($request, $service);

        return response()->json($this->transformService($service->fresh('media')));
    }

    // DELETE /api/services/{id}
    public function destroy(Service $service): JsonResponse
    {
        $this->authorize('delete', $service);

        // Clean up stored files
        foreach ($service->media as $media) {
            Storage::disk('public')->delete($media->path);
        }

        $service->delete();

        return response()->json(['message' => 'Service supprimé.']);
    }

    // ─── Private helpers ──────────────────────────
    private function handleMediaUploads(Request $request, Service $service): void
    {
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('services/gallery', 'public');
                $service->media()->create(['path' => $path, 'type' => 'gallery']);
            }
        }
        if ($request->hasFile('certificates')) {
            foreach ($request->file('certificates') as $file) {
                $path = $file->store('services/certificates', 'public');
                $service->media()->create(['path' => $path, 'type' => 'certificate']);
            }
        }
    }

    private function transformService(Service $service, bool $withContact = false): array
    {
        $data = [
            'id'            => $service->id,
            'provider_id'   => $service->provider_id,
            'provider_name' => $service->provider?->name,
            'provider_avatar' => $service->provider?->avatar_url,
            'is_verified'   => $service->provider?->is_verified ?? false,
            'title'         => $service->title,
            'category'      => $service->category,
            'description'   => $service->description,
            'price'         => $service->price,
            'city'          => $service->city,
            'country'       => $service->country,
            'video_url'     => $service->video_url,
            'status'        => $service->status,
            'rating'        => $service->average_rating,
            'reviews_count' => $service->reviews_count,
            'gallery'       => $service->gallery->map(fn($m) => $m->url)->values(),
            'certificates'  => $service->certificates->map(fn($m) => $m->url)->values(),
            'created_at'    => $service->created_at,
        ];

        // Phone is only exposed after payment
        if ($withContact) {
            $data['provider_phone'] = $service->provider?->phone;
        }

        return $data;
    }

    private function transformPaginated($paginated): array
    {
        return [
            'data'         => collect($paginated->items())->map(fn($s) => $this->transformService($s)),
            'current_page' => $paginated->currentPage(),
            'last_page'    => $paginated->lastPage(),
            'total'        => $paginated->total(),
        ];
    }
}