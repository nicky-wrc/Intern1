# Laravel Dompdf Thai Font

This package is adding Thai fonts for `barryvdh/laravel-dompdf` to allow users can type Thai in generated PDF.

## Installation

Run composer to install the package.

```
composer require nelisys/laravel-dompdf-thai-font
```

Publish the fonts files.

```
php artisan vendor:publish --provider="Nelisys\LaravelDompdfThaiFont\ServiceProvider"
```

Create `storage/fonts` to store cache files.

```
mkdir storage/fonts
```

## Usage

Add `@LaravelDompdfThaiFont` inside `<head>`.

```html
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
@LaravelDompdfThaiFont
<style>
body {
    font-family: 'THSarabunNew';
}
</style>
</head>
<body>
<h1>
    ทดสอบสร้าง PDF ภาษาไทย
</h1>
</body>
</html>
```

## Related Links

- [DOMPDF Wrapper for Laravel](https://github.com/barryvdh/laravel-dompdf)
- [ฟอนต์สารบรรณ รุ่นปรับปรุงใหม่ Sarabun New](https://www.f0nt.com/release/th-sarabun-new/)

## License

Laravel Dompdf Thai Font is open-sourced software licensed under the [MIT license](LICENSE.md).
