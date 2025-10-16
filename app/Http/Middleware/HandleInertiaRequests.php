<?php

namespace App\Http\Middleware;

use App\Models\GroupMenu;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => fn() => $request->user()
                    ? $request->user()->only('id', 'name', 'email') + [
                        'roles' => $request->user()->getRoleNames(),
                        'permissions' => $request->user()->getAllPermissions()->pluck('name')->toArray(),
                        'notifications' => $request->user()->notifications
                    ]
                    : null,
            ],
            'menu' => fn() => Menu::getMenuWithGroup(),
            'groups' => fn() => GroupMenu::all()->select(['name', 'icon'])->toArray(),
            'appName' => config('app.name'),
        ]);
    }
}
