<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DecodeActionMiddleware
{
    protected $characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-_";
    protected $keys = [];
    protected $reverseKeys = [];

    public function __construct()
    {
        $characters = str_split("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-_");
        $keys = [];
        $reverseKeys = [];

        foreach ($characters as $char) {
            $hash = $this->cyrb53($char);
            $base36 = base_convert($hash, 10, 36); // sama seperti JS toString(36)
            $keys[$char] = $base36;
            $reverseKeys[$base36] = $char;
        }

        list($this->keys, $this->reverseKeys) = [$keys, $reverseKeys];
    }

    public function handle(Request $request, Closure $next)
    {
        $encoded = $request->header('X-Action'); // ambil dari header
        if (!$encoded) {
            return response()->json(['error' => 'Missing action header'], 400);
        }
        $decoded = $this->decodeActions($encoded);

        // taruh hasil decode ke request attribute
        $request->attributes->set('decoded_action', $decoded);

        return $next($request);
    }

    private function cyrb53(string $str, int $seed = 0): string
    {
        $h1 = 0xdeadbeef ^ $seed;
        $h2 = 0x41c6ce57 ^ $seed;

        $len = strlen($str);
        for ($i = 0; $i < $len; $i++) {
            $ch = ord($str[$i]);
            $h1 = (int) $this->imul($h1 ^ $ch, 2654435761);
            $h2 = (int) $this->imul($h2 ^ $ch, 1597334677);
        }

        $h1 = (int) $this->imul(($h1 ^ ($h1 >> 16)), 2246822507);
        $h1 ^= (int) $this->imul(($h2 ^ ($h2 >> 13)), 3266489909);

        $h2 = (int) $this->imul(($h2 ^ ($h2 >> 16)), 2246822507);
        $h2 ^= (int) $this->imul(($h1 ^ ($h1 >> 13)), 3266489909);

        // hasil bisa > PHP_INT_MAX → simpan sebagai string
        $result = gmp_add(
            gmp_mul(($h2 & 0x1fffff), "4294967296"),
            ($h1 & 0xffffffff)
        );

        return gmp_strval($result); // return string
    }

    private function imul($a, $b)
    {
        $a = $a | 0;
        $b = $b | 0;
        $low16 = ($a & 0xffff) * ($b & 0xffff);
        $high16 = ((($a >> 16) & 0xffff) * $b + (($b >> 16) & 0xffff) * $a) & 0xffff;
        return ($low16 + ($high16 << 16)) & 0xffffffff;
    }


    private function decodeActions(string $encoded): string
    {
        $decoded = '';
        $buffer = '';

        $chars = str_split($encoded);
        foreach ($chars as $char) {
            $buffer .= $char;
            if (isset($this->reverseKeys[$buffer])) {
                $decoded .= $this->reverseKeys[$buffer];
                $buffer = '';
            }
        }

        return $decoded;
    }
}
