<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BpjsController;
use App\Http\Controllers\DisplayController;
use App\Http\Controllers\KioskController;
use App\Http\Controllers\LoketController;
use App\Http\Controllers\QueueController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// ============================================
// PUBLIC ROUTES
// ============================================
Route::get('/', function () {
    return redirect()->route('kiosk');
});

// Kiosk — Ambil Nomor Antrean (Public)
Route::get('/kiosk', [KioskController::class, 'index'])->name('kiosk');
Route::post('/kiosk', [KioskController::class, 'store'])->name('kiosk.store');

// Display TV — Antrean Real-time (Public)
Route::get('/display', [DisplayController::class, 'index'])->name('display');
Route::get('/display/data', [DisplayController::class, 'data'])->name('display.data');

// Auth Routes (Login)
Route::get('/login', function () {
    return Inertia::render('auth/login');
})->middleware('guest')->name('login');

// ============================================
// AUTHENTICATED ROUTES
// ============================================
Route::middleware(['auth'])->group(function () {

    // Dashboard redirect based on role
    Route::get('/dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('loket');
    })->name('dashboard');

    // ============================================
    // LOKET (Receptionist + Admin)
    // ============================================
    Route::middleware(['role:receptionist,admin'])->group(function () {
        Route::get('/loket', [LoketController::class, 'index'])->name('loket');
        Route::post('/loket/set-counter', [LoketController::class, 'setCounter'])->name('loket.setCounter');
        Route::get('/loket/search-patient', [LoketController::class, 'searchPatient'])->name('loket.searchPatient');
        Route::post('/loket/register', [LoketController::class, 'register'])->name('loket.register');
        Route::post('/loket/deliver-rm/{registration}', [LoketController::class, 'deliverRM'])->name('loket.deliverRM');

        // Queue operations
        Route::post('/queue/call-next', [QueueController::class, 'callNext'])->name('queue.callNext');
        Route::post('/queue/{queue}/serve', [QueueController::class, 'serve'])->name('queue.serve');
        Route::post('/queue/{queue}/skip', [QueueController::class, 'skip'])->name('queue.skip');
        Route::post('/queue/{queue}/complete', [QueueController::class, 'complete'])->name('queue.complete');
        Route::post('/queue/{queue}/recall', [QueueController::class, 'recall'])->name('queue.recall');

        // BPJS verification
        Route::post('/bpjs/check', [BpjsController::class, 'checkPeserta'])->name('bpjs.check');
        Route::post('/bpjs/bridge', [BpjsController::class, 'bridgePendaftaran'])->name('bpjs.bridge');
    });

    // ============================================
    // ADMIN (Admin Only)
    // ============================================
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

        // Polyclinics
        Route::get('/polyclinics', [AdminController::class, 'polyclinics'])->name('polyclinics');
        Route::post('/polyclinics', [AdminController::class, 'storePolyclinic'])->name('polyclinics.store');
        Route::put('/polyclinics/{polyclinic}', [AdminController::class, 'updatePolyclinic'])->name('polyclinics.update');
        Route::delete('/polyclinics/{polyclinic}', [AdminController::class, 'destroyPolyclinic'])->name('polyclinics.destroy');

        // Doctors
        Route::get('/doctors', [AdminController::class, 'doctors'])->name('doctors');
        Route::post('/doctors', [AdminController::class, 'storeDoctor'])->name('doctors.store');
        Route::put('/doctors/{doctor}', [AdminController::class, 'updateDoctor'])->name('doctors.update');
        Route::delete('/doctors/{doctor}', [AdminController::class, 'destroyDoctor'])->name('doctors.destroy');

        // Users
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::post('/users', [AdminController::class, 'storeUser'])->name('users.store');
        Route::put('/users/{user}', [AdminController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->name('users.destroy');

        // Queue Config
        Route::get('/queue-config', [AdminController::class, 'queueConfig'])->name('queueConfig');
        Route::post('/queue-config', [AdminController::class, 'updateQueueConfig'])->name('queueConfig.update');

        // Audit Log
        Route::get('/audit-log', [AdminController::class, 'auditLog'])->name('auditLog');
    });
});

require __DIR__.'/settings.php';
