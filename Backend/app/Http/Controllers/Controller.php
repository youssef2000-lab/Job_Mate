<?php

// Backend/app/Http/Controllers/Controller.php
// ─────────────────────────────────────────────────────────────
// FIX: The base Controller was an empty abstract class with no traits.
//
// authorize(), authorizeForUser(), and can() all live in the
// AuthorizesRequests trait (Illuminate\Foundation\Auth\Access\AuthorizesRequests).
// Without it, every controller call to $this->authorize(...) throws:
//   "Call to undefined method ...Controller::authorize()"
//
// Also added ValidatesRequests for $this->validate() support.
// ─────────────────────────────────────────────────────────────

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
