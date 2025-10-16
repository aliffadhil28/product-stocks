<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $message;
    public int $userId;

    public function __construct(int $userId, string $message)
    {
        $this->userId = $userId;
        $this->message = $message;

        Notification::create([
            'user_id' => $userId,
            'message' => $message
        ]);
    }

    public function broadcastOn(): Channel
    {
        // private channel agar hanya user yang bersangkutan bisa subscribe
        return new PrivateChannel("user.{$this->userId}");
    }

    public function broadcastAs(): string
    {
        return 'user.notification';
    }
}
