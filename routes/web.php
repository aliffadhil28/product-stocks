<?php

use App\Http\Controllers\ApiGatewayController;
use App\Http\Controllers\ProfileController;
use App\Models\Menu;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Admin/Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::group(['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['auth', 'verified']], function () {
    $menus = Menu::all()->pluck('name')->toArray();
    foreach ($menus as $menu) {
        $lowerName = strtolower(str_replace(' ','-',$menu));
        $fileName = str_replace(" ", "", $menu);
        $file = "Admin/$fileName";
        Route::get("/$lowerName", function () use ($file) {
            return Inertia::render($file);
        })->name("$lowerName");
    }
});

Route::post('/api/gateway', [ApiGatewayController::class, 'handle'])->middleware(['decode.action','auth'])->name('api.gateway');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
