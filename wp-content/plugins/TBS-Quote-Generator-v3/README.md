# TBS Price Quotation Generator (WordPress Plugin)

ปลั๊กอิน WordPress สำหรับสร้างใบเสนอราคา (Quotation) ของ TBS Marketing ผ่านฟอร์มบนหน้าเว็บ และส่งออกเป็น **PDF** โดยใช้ **Dompdf**

- **เวอร์ชัน:** 3.0  
- **Author:** TBS Dev  

---

## ความสามารถหลัก

- ฟอร์มกรอกข้อมูลลูกค้า รายการบริการ ส่วนลด VAT และหมายเหตุ
- คำนวณยอดและแสดงตารางบริการแบบจัดกลุ่ม (service groups)
- สร้างไฟล์ PDF จาก HTML templates (`templates/quote-header-template.php`, `templates/quote-content-template.php`)
- เก็บประวัติการสร้าง quote ในตารางฐานข้อมูล `wp_quote_history` (prefix ตาม `$wpdb->prefix`)
- โหลดข้อมูลบริการจาก JSON (`assets/js/services.json`) และทีมจาก `assets/js/team-members.json`)

---

## ความต้องการของระบบ

- WordPress (ใช้ในธีมที่มี shortcode เช่น Astra Child)
- PHP เวอร์ชันที่รองรับ Composer packages ในปลั๊กอิน
- การติดตั้ง dependencies ผ่าน Composer (`vendor/` ควรมีอยู่แล้วในโปรเจกต์นี้)

---

## การติดตั้ง

1. คัดลอกโฟลเดอร์ปลั๊กอินไปที่  
   `wp-content/plugins/TBS-Quote-Generator-v3/`
2. จากโฟลเดอร์ปลั๊กอิน รัน `composer install` (ถ้ายังไม่มี `vendor/`)
3. เปิดใช้งานปลั๊กอินใน WordPress Admin → Plugins

---

## การใช้งานบนหน้าเว็บ

แทรก shortcode ในหน้าหรือโพสต์ที่ต้องการแสดงฟอร์ม:

```
[quote_generator_form]
```

เมื่อผู้ใช้ส่งฟอร์ม ระบบจะโพสต์ไปที่ `admin-post.php` ด้วย action `process_quote_form` เพื่อประมวลผลและสตรีม PDF

---

## โครงสร้างไฟล์สำคัญ

| พาธ | บทบาท |
|------|--------|
| `quote-generator.php` | จุดเข้าปลั๊กอิน: enqueue assets, shortcode, hook `admin_post_process_quote_form`, เรียก Dompdf |
| `templates/quote-generator-form.php` | UI ฟอร์ม + History popup |
| `templates/quote-header-template.php` | HTML/CSS ส่วนหัว PDF |
| `templates/quote-content-template.php` | HTML/CSS เนื้อหา PDF (ตาราง, summary, remarks, footer) |
| `assets/js/script.js` | Logic ฝั่งเบราว์เซอร์ (บริการ, ราคา, history import ฯลฯ) |
| `assets/css/style.css` | สไตล์ฟอร์มบนหน้าเว็บ |
| `assets/fonts/` | ฟอนต์ **Sarabun** (Regular/Bold/Italic/BoldItalic) สำหรับ PDF |
| `vendor/` | Dompdf และ dependencies จาก Composer |

---

## PDF และฟอนต์ภาษาไทย

ปลั๊กอินใช้ **Dompdf** (`dompdf/dompdf`) แปลง HTML เป็น PDF

- ฟอนต์เริ่มต้นในโค้ดตั้งเป็น **`Sarabun`** และประกาศ `@font-face` ในเทมเพลต PDF ให้ชี้ไปที่ไฟล์ใน `assets/fonts/`  
- Sarabun รองรับภาษาไทยและมีน้ำหนัก **Bold** แยกไฟล์ ช่วยให้ข้อความไทยที่เป็นตัวหนาแสดงผลถูกต้อง ไม่กลายเป็นเครื่องหมาย `?` เมื่อใช้ `font-weight: bold` / `<strong>`

ฟอนต์ Sarabun มาจาก Google Fonts (สัญญาอนุญาต OFL) — เก็บไว้ในโปรเจกต์เพื่อให้ Dompdf embed ได้โดยไม่พึ่ง CDN ตอน render

---

## Composer

ไฟล์ `composer.json` ระบุหลัก ๆ:

- `dompdf/dompdf` — สร้าง PDF จาก HTML/CSS  
- `nelisys/laravel-dompdf-thai-font` — package ช่วยเรื่องฟอนต์ไทยใน ecosystem Dompdf (อาจใช้ร่วมกับการตั้งค่าในโปรเจกต์)

รันจากโฟลเดอร์ปลั๊กอิน:

```bash
composer install
```

---

## ฐานข้อมูล

เมื่อ activate ปลั๊กอิน จะสร้างตาราง `{prefix}quote_history` ผ่าน `dbDelta()` สำหรับเก็บรายละเอียด quote แบบ JSON และเลข running / revision

---

## การพัฒนาและแก้ไข

- แก้ layout/ข้อความ PDF: ไปที่ไฟล์ใน `templates/` (ระวัง CSS ที่ Dompdf รองรับไม่ครบเหมือนเบราว์เซอร์)
- แก้ logic ฟอร์ม/ราคา: `assets/js/script.js` และ handler ใน `quote-generator.php`
- หลังแก้ PHP ใน production ควรทดสอบ Generate PDF และตรวจสอบว่าฟอนต์ใน `assets/fonts/` ยังอยู่ครบ

---

## เครดิต

- **TBS Marketing** — ธุรกิจและแบรนด์ที่ปลั๊กอินนี้ออกแบบมาให้ใช้งาน  
- **Dompdf** — ไลบรารีสร้าง PDF  
- **Sarabun** — ฟอนต์ไทย (OFL, Google Fonts)

---

หากต้องการเพิ่มส่วน “วิธี deploy” หรือ “environment variables” ให้ระบุได้ใน issue หรือเอกสารภายในองค์กรต่อได้ครับ
