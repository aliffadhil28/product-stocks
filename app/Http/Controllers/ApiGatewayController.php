<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiGatewayController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();
            return $next($request);
        });
    }

    public function handle(Request $request)
    {
        $decoded = $request->attributes->get('decoded_action');

        [$controller, $method] = explode('_', $decoded);

        return app()->make("\App\Http\Controllers\Api\\".$controller)->$method($request);
    }

    protected function userHasPermission($permission)
    {
        $can = Auth::user() && Auth::user()->can($permission);
        if (!$can) {
            abort(403, 'Unauthorized action.');
        }
        return $can;
    }
}
