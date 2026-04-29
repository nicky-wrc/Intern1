<?php

namespace Nelisys\LaravelDompdfThaiFont;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider as IlluminateServiceProvider;

class ServiceProvider extends IlluminateServiceProvider
{
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/../fonts' => public_path('fonts'),
        ], 'public');
    }

    public function register()
    {
        Blade::directive('LaravelDompdfThaiFont', function () {
            return <<<EOT
<style>
@font-face {
    font-family: 'THSarabunNew';
    font-style: normal;
    font-weight: normal;
    src: url("{{ public_path('fonts/THSarabunNew.ttf') }}") format('truetype');
}
@font-face {
    font-family: 'THSarabunNew';
    font-style: normal;
    font-weight: bold;
    src: url("{{ public_path('fonts/THSarabunNew Bold.ttf') }}") format('truetype');
}
@font-face {
    font-family: 'THSarabunNew';
    font-style: italic;
    font-weight: normal;
    src: url("{{ public_path('fonts/THSarabunNew Italic.ttf') }}") format('truetype');
}
@font-face {
    font-family: 'THSarabunNew';
    font-style: italic;
    font-weight: bold;
    src: url("{{ public_path('fonts/THSarabunNew BoldItalic.ttf') }}") format('truetype');
}
</style>
EOT;
        });
    }
}
